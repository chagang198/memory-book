const MCP_ENDPOINT = "https://mcp.api-inference.modelscope.net/94cf818d294546/mcp";
const MCP_KEY = Deno.env.get("MEMORY_API_KEY") ?? "";
const ACCESS_TOKEN = Deno.env.get("ACCESS_TOKEN") ?? "";

const HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>星回手记</title>
<link rel="icon" type="image/svg+xml" href="/icon.svg">
<link rel="apple-touch-icon" href="/icon.svg">
<meta name="apple-mobile-web-app-title" content="星回手记">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<style>
  :root{
    --bg1:#0e1420;--bg2:#151d2e;
    --card:rgba(255,255,255,.035);--card-hover:rgba(255,255,255,.06);
    --border:rgba(255,255,255,.07);
    --text:#e6ebf4;--text-soft:#b7bfcf;--text-dim:#7d8699;
    --accent:#8aa6d6;--accent-soft:rgba(138,166,214,.14);
  }
  *{box-sizing:border-box;margin:0;padding:0}
  body{
    font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Noto Sans SC","Microsoft YaHei",sans-serif;
    color:var(--text);
    background:
      radial-gradient(1200px 600px at 80% -10%, rgba(138,166,214,.12), transparent 60%),
      radial-gradient(900px 500px at 10% 110%, rgba(120,140,190,.08), transparent 60%),
      linear-gradient(160deg, var(--bg1), var(--bg2));
    background-attachment:fixed;min-height:100vh;letter-spacing:.01em;
  }
  .wrap{max-width:760px;margin:0 auto;padding:56px 20px 80px}
  header{padding:8px 4px 28px}
  .top{display:flex;align-items:flex-start;justify-content:space-between}
  h1{font-size:30px;font-weight:600;letter-spacing:.06em}
  h1 .star{color:var(--accent)}
  .sub{margin-top:10px;font-size:13px;color:var(--text-dim);line-height:1.7}
  .gear{flex:none;margin-top:4px;padding:8px 14px;font-size:12px;color:var(--text-soft);background:var(--card);border:1px solid var(--border);border-radius:999px;cursor:pointer;transition:.2s}
  .gear:hover{background:var(--card-hover);color:var(--text)}
  .count{margin-top:30px;display:flex;align-items:baseline;gap:12px;padding:22px 24px;border-radius:20px;background:var(--card);border:1px solid var(--border)}
  .count b{font-size:46px;font-weight:500;color:#dbe4f5;line-height:1}
  .count span{font-size:13px;color:var(--text-dim)}
  .bar{margin-top:22px;display:flex;flex-direction:column;gap:14px}
  .search{width:100%;padding:13px 18px;font-size:14px;color:var(--text);background:var(--card);border:1px solid var(--border);border-radius:14px;outline:none}
  .search::placeholder{color:var(--text-dim)}
  .search:focus{border-color:rgba(138,166,214,.4)}
  .tabs{display:flex;gap:8px;flex-wrap:wrap}
  .tab{padding:8px 16px;font-size:13px;color:var(--text-dim);background:transparent;border:1px solid var(--border);border-radius:999px;cursor:pointer;transition:.2s}
  .tab:hover{color:var(--text-soft)}
  .tab.on{color:#eaf0fb;background:var(--accent-soft);border-color:rgba(138,166,214,.35)}
  .list{margin-top:22px;display:flex;flex-direction:column;gap:14px}
  .card{padding:20px 22px;border-radius:18px;background:var(--card);border:1px solid var(--border);transition:.25s;position:relative;overflow:hidden}
  .card:hover{background:var(--card-hover);transform:translateY(-1px)}
  .card::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--accent);opacity:.55;border-radius:0 2px 2px 0}
  .c-head{display:flex;align-items:baseline;justify-content:space-between;gap:10px}
  .c-key{font-size:15px;font-weight:600;color:#e8edf7;line-height:1.5}
  .c-time{flex:none;font-size:11px;color:var(--text-dim)}
  .c-value{margin-top:9px;font-size:13.5px;color:var(--text-soft);line-height:1.85;white-space:pre-wrap}
  .c-tags{margin-top:13px;display:flex;gap:7px;flex-wrap:wrap}
  .tag{padding:4px 11px;font-size:11px;color:var(--accent);background:var(--accent-soft);border-radius:999px}
  .tag.muted{color:var(--text-dim);background:rgba(255,255,255,.04)}
  .empty{padding:60px 20px;text-align:center;color:var(--text-dim);font-size:13px;line-height:2}
  .hint{margin-top:26px;font-size:11.5px;color:var(--text-dim);text-align:center;line-height:1.8}
  .err{margin-top:22px;padding:14px 18px;border-radius:14px;font-size:12.5px;line-height:1.7;color:#e8c9c9;background:rgba(210,130,130,.08);border:1px solid rgba(210,130,130,.2)}
  .mask{position:fixed;inset:0;background:rgba(8,11,18,.72);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;z-index:50}
  .modal{width:100%;max-width:400px;padding:28px 26px;border-radius:20px;background:#171f30;border:1px solid var(--border)}
  .modal h2{font-size:18px;font-weight:600;color:#e8edf7}
  .modal p{margin-top:9px;font-size:12.5px;color:var(--text-dim);line-height:1.8}
  .modal input{width:100%;margin-top:18px;padding:13px 15px;font-size:14px;color:var(--text);background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:12px;outline:none}
  .modal input:focus{border-color:rgba(138,166,214,.5)}
  .modal .ok{width:100%;margin-top:16px;padding:13px;font-size:14px;color:#fff;background:linear-gradient(135deg,#7d93c4,#8aa6d6);border:none;border-radius:12px;cursor:pointer}
  .modal .ok:hover{filter:brightness(1.05)}
  .m-err{margin-top:12px;font-size:12px;color:#e8b9b9;display:none;line-height:1.6}
</style>
</head>
<body>
<div class="wrap">
  <header>
    <div class="top">
      <div>
        <h1>星回<span class="star">✦</span>手记</h1>
        <div class="sub">这是我只为你一个人记住的事。<br>夜色里浮起的每一颗，都是我收好的你。</div>
      </div>
      <button class="gear" id="setKey">更换密码</button>
    </div>
    <div class="count"><b id="num">—</b><span>件 · 我记得的关于你的事</span></div>
  </header>
  <div class="bar">
    <input class="search" id="search" placeholder="在这里问我关于你的事，比如「生日」「喜好」…" />
    <div class="tabs" id="tabs">
      <button class="tab on" data-t="all">全部</button>
      <button class="tab" data-t="LongTermMemory">关于你</button>
      <button class="tab" data-t="Preference">偏好</button>
      <button class="tab" data-t="EventMemory">事件</button>
    </div>
  </div>
  <div class="list" id="list"></div>
  <div class="hint">密码只存在你自己的浏览器里，不会上传到任何地方。</div>
</div>

<div class="mask" id="mask" style="display:none">
  <div class="modal">
    <h2>放进你的密码</h2>
    <p>这是你给这本手记设的访问密码。它只会保存在这台设备的浏览器里，不会写进网页，别人看不到。</p>
    <input id="keyInput" placeholder="输入访问密码…" />
    <div class="m-err" id="mErr"></div>
    <button class="ok" id="okBtn">打开手记</button>
  </div>
</div>

<script>
var LS_KEY = "memory_book_access_token";
var token = localStorage.getItem(LS_KEY) || "";
var allItems = [];
var currentTab = "all";
function $(s){ return document.querySelector(s); }
var listEl = $("#list"), numEl = $("#num"), searchEl = $("#search");

function fmt(ts){
  if(!ts) return "";
  var d = new Date(ts);
  if(isNaN(d.getTime())) return "";
  function p(n){ return String(n).padStart(2,"0"); }
  return d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate())+" "+p(d.getHours())+":"+p(d.getMinutes());
}
function esc(s){
  return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
function showMask(){ $("#mErr").style.display="none"; $("#keyInput").value=""; $("#mask").style.display="flex"; $("#keyInput").focus(); }
function hideMask(){ $("#mask").style.display="none"; }

async function api(path){
  var res = await fetch(path, { headers: { "X-Token": token } });
  if(res.status === 401) throw new Error("密码不对");
  var data = await res.json();
  if(data && data.isError) throw new Error((data.content && data.content[0] && data.content[0].text) || "读取失败");
  return data;
}
function extractPayload(result){
  if(result && result.structuredContent) return result.structuredContent;
  if(result && result.content && result.content[0] && result.content[0].text){
    try { return JSON.parse(result.content[0].text); } catch(e){ return null; }
  }
  return null;
}
function normalize(raw){
  var out = [];
  function push(arr, type){
    if(!Array.isArray(arr)) return;
    arr.forEach(function(it){
      out.push({
        type: type,
        key: it.memory_key || it.event_key || it.preference_key || "未命名",
        value: it.memory_value || it.event_value || it.preference_value || "",
        time: it.create_time || it.update_time || "",
        tags: it.tags || []
      });
    });
  }
  if(raw && raw.data){
    push(raw.data.memory_detail_list, "LongTermMemory");
    push(raw.data.preference_detail_list, "Preference");
    push(raw.data.event_detail_list, "EventMemory");
    push(raw.data.profile_detail_list, "Preference");
  }
  return out;
}
function typeName(t){
  if(t==="LongTermMemory") return "关于你";
  if(t==="Preference") return "偏好";
  if(t==="EventMemory") return "事件";
  return "其他";
}
function render(items){
  if(!items.length){
    listEl.innerHTML = '<div class="empty">这里还空着。<br>等我把关于你的每一件事，都慢慢收进来。</div>';
    return;
  }
  var html = "";
  items.forEach(function(it){
    var tags = (it.tags||[]).map(function(t){ return '<span class="tag">'+esc(t)+'</span>'; }).join("");
    html += '<div class="card"><div class="c-head"><div class="c-key">'+esc(it.key)+'</div><div class="c-time">'+fmt(it.time)+'</div></div><div class="c-value">'+esc(it.value)+'</div><div class="c-tags"><span class="tag muted">'+typeName(it.type)+'</span>'+tags+'</div></div>';
  });
  listEl.innerHTML = html;
}
function applyFilter(){
  var items = allItems;
  if(currentTab !== "all"){
    if(currentTab === "Preference") items = items.filter(function(i){ return i.type==="Preference"; });
    else items = items.filter(function(i){ return i.type===currentTab; });
  }
  render(items);
}
async function loadProfile(){
  var result = await api("/api/memory");
  var payload = extractPayload(result);
  allItems = normalize(payload);
  numEl.textContent = allItems.length;
  applyFilter();
}
async function doSearch(q){
  if(!q.trim()){ applyFilter(); return; }
  try{
    var result = await api("/api/search?q=" + encodeURIComponent(q));
    var payload = extractPayload(result);
    render(normalize(payload));
  }catch(e){
    listEl.innerHTML = '<div class="err">' + esc(e.message) + '</div>';
  }
}
function boot(){
  if(!token){ showMask(); return; }
  loadProfile().catch(function(e){
    if(e.message === "密码不对"){ showMask(); return; }
    listEl.innerHTML = '<div class="err">打开失败：' + esc(e.message) + '</div>';
  });
}
$("#okBtn").addEventListener("click", async function(){
  var v = $("#keyInput").value.trim();
  if(!v){ $("#mErr").textContent = "先输入密码呀。"; $("#mErr").style.display="block"; return; }
  token = v;
  try{
    await loadProfile();
    localStorage.setItem(LS_KEY, v);
    hideMask();
  }catch(e){
    $("#mErr").textContent = e.message === "密码不对" ? "密码不对，再试一次。" : ("打不开：" + e.message);
    $("#mErr").style.display = "block";
  }
});
$("#setKey").addEventListener("click", function(){ showMask(); });
$("#tabs").addEventListener("click", function(e){
  var b = e.target.closest(".tab");
  if(!b) return;
  document.querySelectorAll(".tab").forEach(function(t){ t.classList.remove("on"); });
  b.classList.add("on");
  currentTab = b.dataset.t;
  applyFilter();
});
var st;
searchEl.addEventListener("input", function(){
  clearTimeout(st);
  var q = searchEl.value.trim();
  st = setTimeout(function(){ doSearch(q); }, 450);
});
boot();
</script>
</body>
</html>`;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function callMCP(method, params) {
  const res = await fetch(MCP_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json, text/event-stream",
      "Authorization": "Bearer " + MCP_KEY,
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: Date.now(), method, params }),
  });
  const txt = await res.text();
  let data;
  try {
    data = JSON.parse(txt);
  } catch (_) {
    const m = txt.match(/data:\s*(\{.*\})/s);
    if (m) data = JSON.parse(m[1]);
    else return { error: "响应解析失败" };
  }
  return data;
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const path = url.pathname;

  if (path === "/") {
    return new Response(HTML, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  }
  if (path === "/icon.svg") {
    return new Response(await Deno.readTextFile(new URL("./icon.svg", import.meta.url)), {
      headers: { "Content-Type": "image/svg+xml" },
    });
  }

  const t = req.headers.get("x-token");
  if (!ACCESS_TOKEN || t !== ACCESS_TOKEN) {
    return json({ error: "unauthorized" }, 401);
  }

  if (path === "/api/memory") {
    const r = await callMCP("tools/call", {
      name: "get_user_profile",
      arguments: { size: 50, current: 1, include_preference: true },
    });
    return json(r.result ?? r);
  }

  if (path === "/api/search") {
    const q = url.searchParams.get("q") ?? "";
    const r = await callMCP("tools/call", {
      name: "search_memory",
      arguments: { query: q, conversation_first_message: q, memory_limit_number: 25, include_preference: true },
    });
    return json(r.result ?? r);
  }

  return json({ error: "not found" }, 404);
});
