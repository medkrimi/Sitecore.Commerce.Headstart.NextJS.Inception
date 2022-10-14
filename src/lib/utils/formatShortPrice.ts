export default function formatShortPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol"
  })
    .format(amount)
    .replace(/\D00(?=\D*$)/, "")
}
