const assert = require("node:assert/strict");
const { calculateChange } = require("../js/task-1006.js");

assert.deepEqual(calculateChange(0), {
  valid: true,
  possible: true,
  amount: 0,
  counts: { 2: 0, 10: 0, 100: 0, 500: 0 },
  message: "500 руб. — 0; 100 руб. — 0; 10 руб. — 0; 2 руб. — 0."
});

assert.equal(calculateChange(-2).valid, false);
assert.equal(calculateChange("10,5").valid, false);
assert.deepEqual(calculateChange(9), {
  valid: true,
  possible: false,
  amount: 9,
  message: "Размен невозможен: все доступные номиналы чётные, а сумма нечётная."
});

assert.deepEqual(calculateChange(1234).counts, { 2: 2, 10: 3, 100: 2, 500: 2 });
assert.deepEqual(calculateChange(1012).counts, { 2: 1, 10: 1, 100: 0, 500: 2 });
assert.equal(calculateChange(2).counts[2], 1);
assert.equal(calculateChange(500).counts[500], 1);
assert.equal(calculateChange("").valid, false);
assert.equal(calculateChange("abc").valid, false);

console.log("task-1006: 10 проверок пройдены");
