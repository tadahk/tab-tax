const $ = (id) => document.getElementById(id);

chrome.storage.local.get(["on", "limit", "tabCount"], (s) => {
  const state = { on: s.on !== false, limit: s.limit || 10, tabCount: s.tabCount || 0 };

  const status = () => {
    const n = state.tabCount;
    const over = Math.max(0, n - state.limit);
    $("status").textContent = `${n} tab${n === 1 ? "" : "s"} open` +
      (state.on && over ? ` · ${Math.min(100, over * 10)}% grey` : "");
  };

  $("on").checked = state.on;
  $("limit").value = state.limit;
  status();

  $("on").addEventListener("change", () => {
    state.on = $("on").checked;
    chrome.storage.local.set({ on: state.on });
    status();
  });
  $("limit").addEventListener("change", () => {
    state.limit = Math.max(1, parseInt($("limit").value, 10) || 10);
    $("limit").value = state.limit;
    chrome.storage.local.set({ limit: state.limit });
    status();
  });
});
