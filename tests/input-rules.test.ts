import { test } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeInput,
  clampInput,
  filterOptions,
  highlightTokens,
} from "../projects/ui-controls/src/lib/utilities/input-rules.ts";
test("numeric paste obeys digit, decimal and sign settings", () => {
  assert.equal(
    normalizeInput("-12a3.456", {
      inputType: "number",
      allowNegative: true,
      maxDigits: 2,
      decimalPlaces: 2,
    }),
    "-12.45",
  );
  assert.equal(normalizeInput("1.2.3", { inputType: "integers" }), "1");
});
test("empty and intermediate numeric input remain editable", () => {
  assert.equal(
    normalizeInput("-", { inputType: "number", allowNegative: true }),
    "-",
  );
  assert.equal(clampInput("", { inputType: "number", minValue: 2 }), "");
  assert.equal(
    clampInput("150", { inputType: "number", maxValue: 100 }),
    "100",
  );
});
test("alphabet mode retains Unicode letters and spaces", () => {
  assert.equal(
    normalizeInput("Hello مرحبا 123!", { onlyAlphabets: true }),
    "Hello مرحبا ",
  );
});
test("search handles primitives, object labels and null input", () => {
  assert.deepEqual(filterOptions(["Beta", "Alpha"], "AL"), ["Alpha"]);
  assert.deepEqual(
    filterOptions([{ name: "Beta" }, { name: "Alpha" }], "al", "name", true),
    [{ name: "Alpha" }],
  );
  assert.deepEqual(filterOptions(null, "x"), []);
});
test("highlighting preserves literal text and prioritizes restricted words", () => {
  const value = "<script>API</script> APIS";
  const result = highlightTokens(
    value,
    [{ abbreviation: "API" }],
    [{ word: "API" }],
  );
  assert.equal(result.map((x) => x.text).join(""), value);
  assert.equal(result.filter((x) => x.kind === "restricted").length, 1);
});
