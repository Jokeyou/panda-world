#!/usr/bin/env python3
"""Fetch panda photos from Wikimedia Commons (works through proxy)"""
import json, urllib.request, urllib.parse, time, os, re

os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')

with open('data/pandas.json') as f:
    pandas = json.load(f)

hit = 0
miss = 0

# Known Wikipedia page titles for famous pandas
KNOWN_PAGES = {
    '花花': 'Hua_Hua_(giant_panda)',
    '萌兰': 'Meng_Lan',
    '福宝': 'Fu_Bao_(giant_panda)',
    '香香': 'Xiang_Xiang_(giant_panda)',
    '奇一': 'Qi_Yi_(giant_panda)',
    '宝力': 'Bao_Li_(giant_panda)',
    '青宝': 'Qing_Bao_(giant_panda)',
    '冰墩墩': 'Bing_Dwen_Dwen',
    '美兰': 'Mei_Lan',
    '美香': 'Mei_Xiang',
    '添添': 'Tian_Tian_(giant_panda)',
    '贝贝': 'Bei_Bei_(giant_panda)',
    '小奇迹': 'Xiao_Qi_Ji',
    '金虎': 'Jin_Hu',
}

for p in pandas:
    name = p['name']
    title = KNOWN_PAGES.get(name)
    
    if not title:
        title = f"{name}_(giant_panda)"
    
    # Use commons API with category filter
    api_url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(name + ' giant panda')}&srnamespace=6&srlimit=3&format=json"
    
    try:
        req = urllib.request.Request(api_url, headers={"User-Agent": "PandaWorld/1.0"})
        data = json.loads(urllib.request.urlopen(req, timeout=15).read())
        results = data.get("query", {}).get("search", [])
        
        found = False
        for r in results:
            file_title = r['title']
            # Skip non-photo files
            if not file_title.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                continue
            # Get image URL
            img_api = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(file_title)}&prop=imageinfo&iiprop=url&format=json"
            img_req = urllib.request.Request(img_api, headers={"User-Agent": "PandaWorld/1.0"})
            img_data = json.loads(urllib.request.urlopen(img_req, timeout=10).read())
            pages = img_data.get("query", {}).get("pages", {})
            for pid, pinfo in pages.items():
                iis = pinfo.get("imageinfo", [])
                if iis:
                    p['photoUrl'] = iis[0]['url']
                    p['photoCredit'] = f"Wikimedia Commons · {file_title}"
                    hit += 1
                    print(f"OK {name}: {iis[0]['url'][:90]}")
                    found = True
                    break
            if found:
                break
        
        if not found:
            miss += 1
            print(f"NO  {name}")
    
    except Exception as e:
        miss += 1
        print(f"ERR {name}: {str(e)[:60]}")
    
    time.sleep(2)

with open('data/pandas.json', 'w') as f:
    json.dump(pandas, f, ensure_ascii=False, indent=2)

print(f"\nDONE: {hit} hits, {miss} misses")
