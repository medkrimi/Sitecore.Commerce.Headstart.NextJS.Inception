export default function formatPercentChange(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol"
  }).format(amount)
}

//<Text as="span" color="green.400" fontWeight="bold">
//+5.2%
//</Text>
