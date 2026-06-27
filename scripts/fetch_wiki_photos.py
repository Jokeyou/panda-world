#!/usr/bin/env python3
"""Extract Wikipedia main images for all pandas in data/pandas.json"""
import json, urllib.request, urllib.parse, time, os

os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')

with open('data/pandas.json') as f:
    pandas = json.load(f)

hit = 0
miss = 0

for p in pandas:
    name = p['name']
    search = f"{name} giant panda"
    api_url = f"https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&pithumbsize=800&titles={urllib.parse.quote(search)}&format=json"
    try:
        req = urllib.request.Request(api_url, headers={"User-Agent": "PandaWorld/1.0"})
        data = json.loads(urllib.request.urlopen(req, timeout=15).read())
        pages = data.get("query", {}).get("pages", {})
        found = False
        for pid, pinfo in pages.items():
            thumb = pinfo.get("thumbnail", {}).get("source", "")
            if thumb and int(pid) > 0:
                p['photoUrl'] = thumb
                p['photoCredit'] = "Wikipedia · CC BY-SA"
                hit += 1
                print(f"OK {name}: {thumb[:90]}")
                found = True
                break
        if not found:
            miss += 1
            print(f"NO  {name}")
    except Exception as e:
        miss += 1
        print(f"ERR {name}: {str(e)[:60]}")
    time.sleep(10)

with open('data/pandas.json', 'w') as f:
    json.dump(pandas, f, ensure_ascii=False, indent=2)

print(f"\nDONE: {hit} hits, {miss} misses")
