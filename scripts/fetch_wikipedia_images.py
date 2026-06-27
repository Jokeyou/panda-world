#!/usr/bin/env python3
"""
Wikipedia 主图提取脚本
读取 data/pandas.json，通过 Wikipedia API 逐个搜索每只熊猫的主图，
提取 photoUrl 和 photoCredit 字段后写回。

特性：
- 使用 requests 库，走 HTTPS_PROXY=http://127.0.0.1:1087 代理
- 10 秒超时，单个熊猫失败不中断整体流程
- 多种搜索策略依次尝试
"""

import json
import time
import os
import sys

import requests

# ── 配置 ───────────────────────────────────────────
WIKIPEDIA_API = "https://en.wikipedia.org/w/api.php"
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(SCRIPT_DIR, "..", "data", "pandas.json")
USER_AGENT = "PandaWorld/2.0 (https://github.com/pandaworld; panda-world@example.com)"
REQUEST_TIMEOUT = 10  # 秒
REQUEST_DELAY = 1.2    # Wikipedia 建议每秒不超过 1 次请求

# 代理配置 — 从环境变量读取，默认 127.0.0.1:1087
HTTPS_PROXY = os.environ.get("HTTPS_PROXY", "http://127.0.0.1:1087")
PROXIES = {"https": HTTPS_PROXY} if HTTPS_PROXY else None


def api_call(params: dict) -> dict:
    """
    调用 Wikipedia API，返回解析后的 JSON。
    代理不可达 / 超时 均抛出异常，由调用方处理。
    """
    params["format"] = "json"
    resp = requests.get(
        WIKIPEDIA_API,
        params=params,
        headers={"User-Agent": USER_AGENT},
        proxies=PROXIES,
        timeout=REQUEST_TIMEOUT,
    )
    resp.raise_for_status()
    return resp.json()


def search_page(title: str) -> str | None:
    """搜索 Wikipedia 页面，返回第一个匹配的页面标题，未找到返回 None"""
    try:
        data = api_call({
            "action": "query",
            "list": "search",
            "srsearch": title,
            "srlimit": 1,
        })
        results = data.get("query", {}).get("search", [])
        return results[0]["title"] if results else None
    except Exception:
        return None


def get_page_image(title: str) -> dict:
    """
    获取 Wikipedia 页面的主图。
    使用 prop=pageimages&pithumbsize=800 获取 800px 缩略图
    """
    try:
        data = api_call({
            "action": "query",
            "prop": "pageimages",
            "pithumbsize": 800,
            "titles": title,
        })
        pages = data.get("query", {}).get("pages", {})
        for pid, page in pages.items():
            if pid == "-1":
                continue
            # pithumbsize 返回 thumbnail 字段；piprop=original 返回 original 字段
            # 优先取 original（部分页面有），fallback 到 thumbnail
            original = page.get("original", {}).get("source", "")
            thumbnail = page.get("thumbnail", {}).get("source", "")
            url = original or thumbnail
            if url:
                return {"photoUrl": url, "photoCredit": "Wikipedia"}
    except Exception:
        pass
    return {"photoUrl": "", "photoCredit": ""}


def get_image_credit(title: str) -> str:
    """尝试获取图片的艺术家/版权信息，失败返回默认 'Wikipedia'"""
    try:
        # 先取页面第一张图片的文件名
        data = api_call({
            "action": "query",
            "prop": "images",
            "titles": title,
            "imlimit": 1,
        })
        pages = data.get("query", {}).get("pages", {})
        for _pid, page in pages.items():
            images = page.get("images", [])
            if not images:
                continue
            # 查询图片元数据
            ii = api_call({
                "action": "query",
                "prop": "imageinfo",
                "iiprop": "extmetadata",
                "titles": images[0]["title"],
            })
            for _iipid, iipage in ii.get("query", {}).get("pages", {}).items():
                meta = iipage.get("imageinfo", [{}])[0].get("extmetadata", {})
                artist = meta.get("Artist", {}).get("value", "").strip()
                if artist and artist.lower() != "unknown":
                    return f"Wikipedia / {artist}"
    except Exception:
        pass
    return "Wikipedia"


def main():
    # 读取数据
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        pandas = json.load(f)

    total = len(pandas)
    updated = 0
    skipped = 0
    missed = 0
    proxy_status = f"🟢 代理 {HTTPS_PROXY}" if PROXIES else "🔴 无代理（直连）"

    print(f"🐼 Panda World · Wikipedia 主图提取")
    print(f"📋 共 {total} 只熊猫")
    print(f"🌐 {proxy_status}")
    print(f"⏱️  超时: {REQUEST_TIMEOUT}s · 请求间隔: {REQUEST_DELAY}s\n")

    for i, panda in enumerate(pandas):
        name = panda["name"]
        name_en = panda.get("nameEn", "")

        # 已有外部 photoUrl 则跳过（保留已有的有效 URL）
        existing = panda.get("photoUrl", "")
        if existing and existing.startswith("http"):
            print(f"  [{i+1:02d}/{total}] ⏭️  {name} — 已有外部URL，跳过")
            skipped += 1
            continue

        print(f"  [{i+1:02d}/{total}] 🔍 {name} ({name_en})", end=" ", flush=True)

        title = None
        result = {"photoUrl": "", "photoCredit": ""}

        try:
            # 策略 1: 英文名直接搜（Wikipedia 文章标题通常是英文名）
            if name_en:
                title = search_page(name_en)

            # 策略 2: "名字 (giant panda)" 格式
            if not title:
                title = search_page(f"{name} (giant panda)")
            if not title and name_en:
                title = search_page(f"{name_en} (giant panda)")

            # 策略 3: 中文名直接搜
            if not title:
                title = search_page(name)

            if title:
                result = get_page_image(title)
                if result["photoUrl"]:
                    result["photoCredit"] = get_image_credit(title)
                    print(f"✅ {title}")
                    updated += 1
                else:
                    print(f"⚠️  页面无主图: {title}")
                    missed += 1
            else:
                print("❌ 未找到 Wikipedia 页面")
                missed += 1

        except requests.exceptions.Timeout:
            print(f"⏰ 请求超时")
            missed += 1
        except requests.exceptions.ProxyError:
            print(f"🛑 代理不可达 ({HTTPS_PROXY})")
            missed += 1
        except requests.exceptions.ConnectionError:
            print(f"🔌 网络连接失败")
            missed += 1
        except Exception as e:
            print(f"❌ 错误: {e}")
            missed += 1

        # 写入结果（即使没找到也写空字符串，避免下次重复尝试）
        panda["photoUrl"] = result["photoUrl"]
        panda["photoCredit"] = result["photoCredit"]
        time.sleep(REQUEST_DELAY)

    # 写回
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(pandas, f, ensure_ascii=False, indent=2)

    print(f"\n{'─'*40}")
    print(f"✨ 完成！更新 {updated} · 跳过 {skipped} · 未命中 {missed} · 共 {total}")
    print(f"📁 数据已写回: {DATA_FILE}")


if __name__ == "__main__":
    main()
