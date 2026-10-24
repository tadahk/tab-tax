// unit checks: node tests/test.js
const assert = require("assert");
const t = require("../extension/content.js");

let n = 0;
const check = (name, fn) => { fn(); n++; console.log("ok -", name); };

check("no grey at or under the limit", () => {
  assert.strictEqual(t.grey(10), 0);
  assert.strictEqual(t.grey(3), 0);
  assert.strictEqual(t.grey(0), 0);
});
check("10% grey per extra tab", () => {
  assert(Math.abs(t.grey(11) - 0.1) < 1e-9);
  assert(Math.abs(t.grey(15) - 0.5) < 1e-9);
});
check("capped at full grey", () => assert.strictEqual(t.grey(40), 1));
check("custom limit", () => {
  assert.strictEqual(t.grey(5, 5), 0);
  assert(Math.abs(t.grey(7, 5) - 0.2) < 1e-9);
});

console.log(`${n} checks passed`);
