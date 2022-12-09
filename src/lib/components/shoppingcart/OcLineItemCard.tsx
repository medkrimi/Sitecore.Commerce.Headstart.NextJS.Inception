import {
  Box,
  Button,
  HStack,
  Image,
  Text,
  Th,
  Tr,
  VStack
} from "@chakra-ui/react"
import {
  ComposedProduct,
  GetComposedProduct,
  RemoveLineItem,
  UpdateLineItem
} from "../../services/ordercloud.service"
import {
  FormEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useState
} from "react"

import {LineItem} from "ordercloud-javascript-sdk"
import OcQuantityInput from "./OcQuantityInput"
import {priceHelper} from "../../utils/price.utils"

interface OcLineItemCardProps {
  lineItem: LineItem
  editable?: boolean
}

// const getPDFProof = (props): string => {
//   console.log(props)
//   if (props.length) {
//     return "HAS PDF"
//   }
//   return `Refund ${"No PDF"}`
// }

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
    <Tr key={lineItem.ID}>
      <Th>
        <HStack>
          <VStack>
            <Image src={lineItem.xp?.proofUrl} maxW="125" alt=""></Image>
            {/* <a href={lineItem.xp?.pdfUrl} target="_blank" rel="noreferrer">
              /<Text fontSize="xs">View proof</Text>
            </a> */}
          </VStack>
          <Text>{`# ${lineItem.ID}`}</Text>
        </HStack>
      </Th>
      <Th>
        <HStack textAlign="left">
          <Text>{lineItem.Product.Name}</Text>
          {lineItem.Specs.map((s) => (
            <span key={s.SpecID}>
              <br />
              {`${s.Name}: ${s.Value}`}
            </span>
          ))}
        </HStack>
      </Th>
      <Th>Status</Th>
      <Th>
        <p>{lineItem.Quantity}</p>
      </Th>
      <Th>{priceHelper.formatPrice(lineItem.UnitPrice)}</Th>
      <Th>{priceHelper.formatPrice(lineItem.LineSubtotal)}</Th>
    </Tr>
  )
}

export default OcLineItemCard
