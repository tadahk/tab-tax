// tab tax: keeps the open tab count in storage so every page can grey itself

let timer;
const count = () => {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    const tabs = await chrome.tabs.query({});
    const { on = true, limit = 10 } = await chrome.storage.local.get(["on", "limit"]);
    await chrome.storage.local.set({ tabCount: tabs.length });
    const over = on ? Math.max(0, tabs.length - limit) : 0;
    chrome.action.setBadgeText({ text: over ? "+" + over : "" });
    chrome.action.setBadgeBackgroundColor({ color: "#777" });
  }, 150);
};

chrome.tabs.onCreated.addListener(count);
chrome.tabs.onRemoved.addListener(count);
chrome.tabs.onAttached.addListener(count);
chrome.tabs.onDetached.addListener(count);
chrome.runtime.onStartup.addListener(count);
chrome.runtime.onInstalled.addListener(count);
chrome.storage.onChanged.addListener((c) => { if (c.on || c.limit) count(); });
count();
