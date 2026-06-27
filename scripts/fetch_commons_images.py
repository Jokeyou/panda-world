#!/usr/bin/env python3
"""
Wikimedia Commons 图片搜索脚本
读取 data/pandas.json，通过 Commons API 搜索每只熊猫的 CC 许可图片，
提取 photoUrl 和 photoCredit 字段后写回。

Wikimedia Commons 所有图片均为自由许可（CC BY / CC BY-SA / CC0 等）。
"""

import json
import urllib.request
import urllib.parse
import time
import os
import re

# ── 配置 ───────────────────────────────────────────
COMMONS_API = "https://commons.wikimedia.org/w/api.php"
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(SCRIPT_DIR, "..", "data", "pandas.json")
USER_AGENT = "PandaWorld/2.0 (https://github.com/pandaworld; panda-world@example.com)"
REQUEST_DELAY = 0.6  # Commons 较宽松


def api_call(params: dict) -> dict:
    """调用 Wikimedia Commons API，返回解析后的 JSON"""
    params["format"] = "json"
    url = COMMONS_API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode())
    except Exception as e:
        print(f"    ⚠️ API 请求失败: {e}")
        return {}


def search_images(query: str, limit: int = 3) -> list:
    """
    在 Commons 文件命名空间搜索图片。
    返回文件标题列表（如 'File:Hua_Hua_panda.jpg'）
    """
    data = api_call({
        "action": "query",
        "list": "search",
        "srnamespace": "6",  # File namespace
        "srsearch": query,
        "srlimit": limit,
        "srprop": "snippet|titlesnippet",
    })
    results = data.get("query", {}).get("search", [])
    return [r["title"] for r in results]


def get_image_info(file_titles: list) -> list:
    """
    批量获取图片信息：原始 URL、艺术家、许可证。
    返回 [{title, url, width, height, artist, license, credit}, ...]
    """
    if not file_titles:
        return []

    data = api_call({
        "action": "query",
        "prop": "imageinfo",
        "iiprop": "url|size|extmetadata",
        "iiurlwidth": "800",  # 限制宽度 800px，减少大图加载
        "titles": "|".join(file_titles),
    })

    results = []
    pages = data.get("query", {}).get("pages", {})
    for _pid, page in pages.items():
        if "missing" in page:
            continue
        imageinfo = page.get("imageinfo", [])
        if not imageinfo:
            continue
        info = imageinfo[0]
        meta = info.get("extmetadata", {})

        artist = meta.get("Artist", {}).get("value", "").strip()
        license_short = meta.get("LicenseShortName", {}).get("value", "").strip()
        credit_text = meta.get("Credit", {}).get("value", "").strip()

        # 去除 HTML 标签
        artist = re.sub(r"<[^>]*>", "", artist) if artist else ""
        credit_text = re.sub(r"<[^>]*>", "", credit_text) if credit_text else ""

        # 构建 credit 字符串
        if artist and artist.lower() != "unknown":
            credit = f"Wikimedia Commons / {artist}"
        else:
            credit = "Wikimedia Commons"

        results.append({
            "title": page.get("title", ""),
            "url": info.get("url", ""),
            "thumburl": info.get("thumburl", ""),
            "width": info.get("width", 0),
            "height": info.get("height", 0),
            "artist": artist,
            "license": license_short,
            "credit": credit,
        })

    return results


def filter_suitable(results: list, panda_name: str, panda_name_en: str) -> dict | None:
    """
    从搜索结果中筛选最合适的图片。
    优先选择：
    1. 文件名包含熊猫英文名或中文拼音
    2. 排除图标、logo、画作等
    返回最佳的图片信息 dict，或 None
    """
    suitable = []
    keywords = [panda_name.lower()]

    if panda_name_en:
        # Hua Hua → hua_hua, huahua
        en_lower = panda_name_en.lower()
        keywords.append(en_lower)
        keywords.append(en_lower.replace(" ", "_"))
        keywords.append(en_lower.replace(" ", ""))

    # 排除词：非照片类型
    exclude_patterns = [
        "icon", "logo", "stamp", "map", "flag", "SVG", "svg",
        "monument", "memorial", "advertisement", "poster",
        "distribution", "range_map", "map_of", "range of",
    ]

    for r in results:
        title_lower = r["title"].lower()

        # 排除非照片
        if any(pat.lower() in title_lower for pat in exclude_patterns):
            continue

        # 文件名匹配度打分
        score = 0
        for kw in keywords:
            if kw in title_lower:
                score += 10

        # 优先真实照片（含 .jpg / .jpeg）
        if title_lower.endswith((".jpg", ".jpeg")):
            score += 5

        # 更高分辨率加分
        if r.get("width", 0) > 800:
            score += 3

        r["_score"] = score
        suitable.append(r)

    # 按分数降序排列
    suitable.sort(key=lambda x: x.get("_score", 0), reverse=True)

    # 即使没有完美匹配，也返回第一张（Commons 图片都是 CC 许可）
    return suitable[0] if suitable else (results[0] if results else None)


def main():
    # 读取数据
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        pandas = json.load(f)

    total = len(pandas)
    updated = 0
    skipped = 0
    missed = 0

    print(f"🐼 Panda World · Wikimedia Commons 图片搜索")
    print(f"📋 共 {total} 只熊猫\n")

    for i, panda in enumerate(pandas):
        name = panda["name"]
        name_en = panda.get("nameEn", "")

        # 已有 photoUrl 则跳过
        if panda.get("photoUrl") and panda["photoUrl"].startswith("http"):
            print(f"  [{i+1:02d}/{total}] ⏭️  {name} — 已有外部URL，跳过")
            skipped += 1
            continue

        # 清空之前可能的空值或本地路径
        if not panda.get("photoUrl") or not panda["photoUrl"].startswith("http"):
            print(f"  [{i+1:02d}/{total}] 🔍 {name} ({name_en})", end=" ", flush=True)

            file_titles = []

            # 策略 1: 英文名 + "giant panda"
            if name_en:
                q1 = f'"{name_en}" giant panda'
                file_titles = search_images(q1, limit=5)

            # 策略 2: 中文名 + "大熊猫"
            if not file_titles:
                q2 = f"{name} 大熊猫"
                file_titles = search_images(q2, limit=5)

            # 策略 3: 只用英文名
            if not file_titles and name_en:
                file_titles = search_images(name_en, limit=5)

            # 策略 4: 只用中文名
            if not file_titles:
                file_titles = search_images(f"{name} panda", limit=5)

            if file_titles:
                infos = get_image_info(file_titles)
                best = filter_suitable(infos, name, name_en)

                if best and best.get("url"):
                    panda["photoUrl"] = best["url"]
                    panda["photoCredit"] = best.get("credit", "Wikimedia Commons")
                    print(f"✅ {best['title']}")
                    updated += 1
                else:
                    print("⚠️  找到文件但无法获取URL")
                    missed += 1
            else:
                print("❌ 未找到 Commons 图片")
                missed += 1

            time.sleep(REQUEST_DELAY)
        else:
            skipped += 1

    # 写回
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(pandas, f, ensure_ascii=False, indent=2)

    print(f"\n{'─'*50}")
    print(f"✨ 完成！更新 {updated} · 跳过 {skipped} · 未命中 {missed} · 共 {total}")
    print(f"📁 数据已写回: {DATA_FILE}")


if __name__ == "__main__":
    main()
