import {LineItem} from "ordercloud-javascript-sdk"
import {
  FormEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useState
} from "react"
import OcQuantityInput from "./OcQuantityInput"
import {Button, HStack, Text, VStack, Image, Box} from "@chakra-ui/react"
import formatPrice from "lib/utils/formatPrice"
import {
  ComposedProduct,
  GetComposedProduct,
  RemoveLineItem,
  UpdateLineItem
} from "lib/scripts/OrdercloudService"

interface OcLineItemCardProps {
  lineItem: LineItem
  editable?: boolean
}

const OcLineItemCard: FunctionComponent<OcLineItemCardProps> = ({
  lineItem,
  editable
}) => {
  const [disabled, setDisabled] = useState(false)
  const [quantity, setQuantity] = useState(lineItem.Quantity)
  const [product, setProduct] = useState<ComposedProduct>()

  useEffect(() => {
    async function GetProduct() {
      var composedProduct = await GetComposedProduct(lineItem?.Product?.ID)
      setProduct(composedProduct)
    }

    GetProduct()
  }, [lineItem])

  const handleRemoveLineItem = useCallback(async () => {
    setDisabled(true)
    await RemoveLineItem(lineItem.ID)
    setDisabled(false)
  }, [lineItem])

  const handleUpdateLineItem = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setDisabled(true)
      await UpdateLineItem({...lineItem, Quantity: quantity})
      setDisabled(false)
    },
    [quantity, lineItem]
  )

  // const isUpdateDisabled = useMemo(() => {
  //   return disabled || lineItem.Quantity === quantity
  // }, [lineItem, disabled, quantity])

  return (
    <VStack w="100%" width="full">
      <HStack w="100%" width="full" justifyContent="space-between">
        <HStack justifyContent="flex-start" w="150">
          <VStack>
            <Image src={lineItem.xp?.proofUrl} maxW="125" alt=""></Image>
            <a href={lineItem.xp?.pdfUrl} target="_blank" rel="noreferrer">
              <Text fontSize="xs">View proof</Text>
            </a>
          </VStack>
        </HStack>
        <HStack justifyContent="flex-start" w="200" textAlign="left">
          <Text>{lineItem.Product.Name}</Text>
          {lineItem.Specs.map((s) => (
            <span key={s.SpecID}>
              <br />
              {`${s.Name}: ${s.Value}`}
            </span>
          ))}
        </HStack>

        {editable ? (
          <>
            <HStack justifyContent="flex-end">
              {/* <Link href={`/products/${lineItem.ProductID}?lineitem=${lineItem.ID}`}>
              <a aria-label="Edit Line Item">Edit</a>
            </Link> */}
            </HStack>
            <HStack w="30%" justifyContent="flex-end">
              <Box pr="5">{formatPrice(lineItem.UnitPrice)}</Box>
              <Box pr="5">
                {product && (
                  <form onSubmit={handleUpdateLineItem}>
                    <OcQuantityInput
                      controlId={`${lineItem.ID}_quantity`}
                      quantity={quantity}
                      disabled={disabled}
                      onChange={setQuantity}
                      priceSchedule={undefined}
                      // priceSchedule={product.PriceSchedule}
                    />
                    {/* <Button
                          type="submit"
                          aria-label="Update Line Item Quantity"
                          disabled={isUpdateDisabled}
                          variant='link'
                          fontWeight='normal'
                        >
                          Update
                        </Button> */}
                  </form>
                )}
              </Box>
              <Box>{formatPrice(lineItem.LineSubtotal)}</Box>
            </HStack>
          </>
        ) : (
          <p>{`Quantity: ${lineItem.Quantity}`}</p>
        )}
      </HStack>
      <HStack w="100%" width="full" justifyContent="flex-end">
        <Button
          variant="link"
          fontWeight="normal"
          color="red.500"
          fontSize="10"
          aria-label="Remove Line Item"
          type="button"
          disabled={disabled}
          onClick={handleRemoveLineItem}
        >
          Remove item
        </Button>
      </HStack>
    </VStack>
  )
}

export default OcLineItemCard
