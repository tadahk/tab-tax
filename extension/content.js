// tab tax: every tab past the limit makes all your pages a little greyer, until you close some.

const tax = {
  LIMIT: 10,

  // greyscale amount (0 to 1) for a tab count
  grey(tabCount, limit = tax.LIMIT) {
    return Math.min(1, Math.max(0, tabCount - limit) * 0.1);
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = tax;
} else if (window.top === window) {
  (() => {
    const s = { on: true, limit: tax.LIMIT, tabCount: 0 };
    const style = document.createElement("style");
    style.id = "tab-tax";
    let shown = -1;

    const apply = () => {
      const g = s.on ? tax.grey(s.tabCount, s.limit) : 0;
      if (g !== shown) {
        shown = g;
        style.textContent = g
          ? `html{filter:grayscale(${g.toFixed(2)}) !important;transition:filter .8s ease}`
          : "";
      }
      if (!style.isConnected) (document.head || document.documentElement).appendChild(style);
    };

    const load = (next) => {
      for (const k of ["on", "limit", "tabCount"]) if (next[k] !== undefined) s[k] = next[k];
      apply();
    };

    try {
      chrome.storage.local.get(["on", "limit", "tabCount"], load);
      chrome.storage.onChanged.addListener((c, area) => {
        if (area !== "local") return;
        const next = {};
        for (const k in c) next[k] = c[k].newValue;
        load(next);
      });
    } catch (e) {}
  })();
}
