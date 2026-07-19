// The full list of currencies this app supports.
// "as const" locks this down to the exact literal strings below,
// rather than letting TypeScript widen it to a generic string[].
// This is what powers the CurrencyCode type just below it.
export const SUPPORTED_CURRENCIES = [
  "NOK",
  "RON",
  "USD",
  "EUR",
  "GBP",
  "SEK",
  "DKK",
  "CHF",
  "JPY",
  "CAD",
  "AUD",
] as const;

// Derives a TypeScript type directly from the array above:
// "NOK" | "USD" | "EUR" | "GBP" | ... | "RON"
// This means anywhere CurrencyCode is used, TypeScript will reject
// a typo like "nok" or an unsupported code like "PLN" at compile time,
// instead of letting it silently break formatting later.
export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number];

// A small list of currencies that don't use decimal subunits in real life
// (there's no such thing as "0.5 yen"). Intl.NumberFormat will actually
// throw a RangeError if you ask it for 2 fraction digits on one of these,
// so we have to detect and special-case them.
const ZERO_DECIMAL_CURRENCIES: CurrencyCode[] = ["JPY"];

// Formats a plain number as a properly styled currency string,
// e.g. formatCurrency(1234.5, "EUR") -> "€1,234.50"
export function formatCurrency(amount: number, currency: CurrencyCode) {
  // Check once whether this particular currency needs the zero-decimal exception
  const isZeroDecimal = ZERO_DECIMAL_CURRENCIES.includes(currency);

  return new Intl.NumberFormat("en-US", {
    // "currency" style tells Intl to add the right symbol (€, $, kr, etc.)
    // in the right position for that currency, automatically
    style: "currency",
    currency,

    // Most currencies show 2 decimal places (e.g. 10.50 kr).
    // JPY and similar currencies must show 0, or Intl.NumberFormat throws.
    minimumFractionDigits: isZeroDecimal ? 0 : 2,
    maximumFractionDigits: isZeroDecimal ? 0 : 2,
  }).format(amount);
}
