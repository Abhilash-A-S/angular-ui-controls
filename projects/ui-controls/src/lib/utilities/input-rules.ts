/** Settings used by the local numeric input directive. Undefined limits are unrestricted. */
export interface InputRules {
  inputType?: string;
  onlyAlphabets?: boolean;
  allowDecimal?: boolean;
  allowNegative?: boolean;
  decimalPlaces?: number;
  maxDigits?: number;
  minValue?: number;
  maxValue?: number;
}
/** Normalize typing and paste consistently, while allowing intermediate '-' and decimal values. */
export function normalizeInput(value: string, rules: InputRules): string {
  if (rules.onlyAlphabets) return value.replace(/[^\p{L}\p{M}\s]/gu, "");
  if (!["number", "percentage", "integers"].includes(rules.inputType ?? ""))
    return value;
  const negative = !!rules.allowNegative && value.startsWith("-");
  const decimal =
    rules.inputType !== "integers" && rules.allowDecimal !== false;
  const cleaned = value.replace(/[^\d.]/g, "");
  const dot = cleaned.indexOf(".");
  let whole = dot < 0 ? cleaned : cleaned.slice(0, dot);
  let fraction = dot < 0 ? "" : cleaned.slice(dot + 1).replace(/\./g, "");
  if (Number.isFinite(rules.maxDigits) && rules.maxDigits! > 0)
    whole = whole.slice(0, Math.floor(rules.maxDigits!));
  if (Number.isFinite(rules.decimalPlaces) && rules.decimalPlaces! >= 0)
    fraction = fraction.slice(0, Math.floor(rules.decimalPlaces!));
  return (
    (negative ? "-" : "") +
    whole +
    (decimal && dot >= 0 && rules.decimalPlaces !== 0 ? "." + fraction : "")
  );
}
/** Apply numeric bounds on blur, so intermediate typing is not clamped prematurely. */
export function clampInput(value: string, rules: InputRules): string {
  if (
    !value.trim() ||
    !["number", "percentage", "integers"].includes(rules.inputType ?? "")
  )
    return value;
  let number = Number(value);
  if (!Number.isFinite(number)) return value;
  if (Number.isFinite(rules.minValue))
    number = Math.max(number, rules.minValue!);
  if (Number.isFinite(rules.maxValue))
    number = Math.min(number, rules.maxValue!);
  return number === Number(value) ? value : String(number);
}
/** Filter primitives or object labels without mutating the source array. */
export function filterOptions<T>(
  items: readonly T[] | null | undefined,
  query: unknown,
  key = "",
  startsWith = false,
): T[] {
  const search = String(query ?? "").toLocaleLowerCase();
  if (!search) return Array.from(items ?? []);
  return (items ?? []).filter((item) => {
    const label = String(
      key && item != null
        ? ((item as Record<string, unknown>)[key] ?? "")
        : (item ?? ""),
    ).toLocaleLowerCase();
    return startsWith ? label.startsWith(search) : label.includes(search);
  });
}
export interface HighlightEntry {
  abbreviation?: string;
  word?: string;
  text?: string;
  remarks?: string;
  [key: string]: unknown;
}
export interface HighlightToken {
  text: string;
  kind: "plain" | "abbreviation" | "restricted";
}
/** Tokenize literal words for safe interpolation; user text is never treated as HTML or a regex. */
export function highlightTokens(
  value: string,
  abbreviations: HighlightEntry[],
  restricted: HighlightEntry[],
): HighlightToken[] {
  const words = new Map<string, HighlightToken["kind"]>();
  for (const [entries, kind] of [
    [abbreviations, "abbreviation"],
    [restricted, "restricted"],
  ] as const)
    for (const entry of entries ?? []) {
      const word = entry.abbreviation ?? entry.word ?? entry.text;
      if (word) words.set(word.toLocaleLowerCase(), kind);
    }
  const tokens: HighlightToken[] = [];
  let plain = "";
  let index = 0;
  const keys = [...words.keys()].sort((a, b) => b.length - a.length);
  const isWord = (c: string) => /[\p{L}\p{N}_]/u.test(c);
  while (index < value.length) {
    const match = keys.find(
      (word) =>
        value.slice(index, index + word.length).toLocaleLowerCase() === word &&
        (!index || !isWord(value[index - 1])) &&
        (!value[index + word.length] || !isWord(value[index + word.length])),
    );
    if (match) {
      if (plain) {
        tokens.push({ text: plain, kind: "plain" });
        plain = "";
      }
      tokens.push({
        text: value.slice(index, index + match.length),
        kind: words.get(match)!,
      });
      index += match.length;
    } else plain += value[index++];
  }
  if (plain || !tokens.length) tokens.push({ text: plain, kind: "plain" });
  return tokens;
}
