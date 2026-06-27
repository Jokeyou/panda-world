"""Push all files to GitHub via API (bypasses git TLS issue)."""
import base64, json, os, pathlib, ssl, urllib.request, urllib.error, sys
# macOS Python SSL fix
ssl_ctx = ssl._create_unverified_context()

TOKEN_FILE = os.path.expanduser("~/.openclaw/workspace/downloads/kkk.txt")
REPO = "Jokeyou/panda-world"
API = "https://api.github.com"
SKIP = {".next", "node_modules", ".git", "package-lock.json", "deploy_github.py", "README.md"}

def auth_headers():
    token = open(TOKEN_FILE).read().strip()
    return {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }

def api(method, path, data=None):
    url = f"{API}{path}"
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, method=method)
    for k, v in auth_headers().items():
        req.add_header(k, v)
    try:
        with urllib.request.urlopen(req, timeout=30, context=ssl_ctx) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print(f"  API Error: {e.code} {e.reason}")
        print(f"  {e.read().decode()[:500]}")
        return None

# 1. Get current ref SHA
print("Getting current ref...")
ref = api("GET", f"/repos/{REPO}/git/ref/heads/main")
if ref:
    parent_sha = ref["object"]["sha"]
    print(f"  Parent: {parent_sha[:8]}")
else:
    print("  Empty repo - will create initial commit")
    parent_sha = None

# 2. Collect files (skip README.md since already created)
files = []
root = pathlib.Path(".")
# Skip README.md since it was created to init the repo
for fpath in sorted(root.rglob("*")):
    parts = fpath.parts
    if any(p in SKIP for p in parts):
        continue
    if any(p.startswith(".") and p != ".gitignore" for p in parts):
        continue
    if fpath.is_file():
        files.append(str(fpath))
print(f"Uploading {len(files)} files...")

# 3. Create blobs
blobs = {}  # path -> sha
for i, fpath in enumerate(files):
    content = open(fpath, "rb").read()
    if len(content) > 1024 * 1024:
        print(f"  [{i+1}/{len(files)}] SKIP {fpath} ({len(content)} bytes)")
        continue
    blob = api("POST", f"/repos/{REPO}/git/blobs",
               {"content": base64.b64encode(content).decode(), "encoding": "base64"})
    if blob:
        blobs[fpath] = blob["sha"]
        if (i+1) % 10 == 0:
            print(f"  [{i+1}/{len(files)}] {fpath}")
    else:
        print(f"  [{i+1}/{len(files)}] FAIL {fpath}")
        sys.exit(1)

print(f"  Created {len(blobs)} blobs")

# 4. Create tree
tree_items = [{"path": p, "mode": "100644", "type": "blob", "sha": s}
              for p, s in blobs.items()]
tree = api("POST", f"/repos/{REPO}/git/trees",
           {"tree": tree_items})
if not tree:
    print("Failed to create tree")
    sys.exit(1)
print(f"  Tree: {tree['sha'][:8]}")

# 5. Create commit
commit_data = {
    "message": "Panda World v2.0 — 全球大熊猫平台\n\n41轮自动迭代 · 暗色+双语+响应式 · via GitHub API",
    "tree": tree["sha"],
}
if parent_sha:
    commit_data["parents"] = [parent_sha]
commit = api("POST", f"/repos/{REPO}/git/commits", commit_data)
if not commit:
    print("Failed to create commit")
    sys.exit(1)
print(f"  Commit: {commit['sha'][:8]}")

# 6. Update ref
if parent_sha:
    api("PATCH", f"/repos/{REPO}/git/refs/heads/main", {"sha": commit["sha"], "force": False})
else:
    api("POST", f"/repos/{REPO}/git/refs", {"ref": "refs/heads/main", "sha": commit["sha"]})
print("Done! Pushed to GitHub via API.")
