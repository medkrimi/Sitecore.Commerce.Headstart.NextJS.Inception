import {LineItem} from "ordercloud-javascript-sdk"
import {FormEvent, FunctionComponent, useCallback, useState} from "react"
import useOcProduct from "../hooks/useOcProduct"
import {removeLineItem, updateLineItem} from "../../redux/ocCurrentOrder"
import OcQuantityInput from "./OcQuantityInput"
import {useOcDispatch} from "lib/redux/ocStore"
import {HStack, Text, VStack, Image, Tr, Th} from "@chakra-ui/react"
import formatPrice from "lib/utils/formatPrice"

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
  const dispatch = useOcDispatch()
  const [disabled, setDisabled] = useState(false)
  const [quantity, setQuantity] = useState(lineItem.Quantity)
  const product = useOcProduct(lineItem.ProductID)

  return (
    <Tr key={lineItem.ID}>
      <Th>
        <HStack>
          <VStack>
            <Image src={lineItem.xp?.proofUrl} maxW="125" alt=""></Image>
            <a href={lineItem.xp?.pdfUrl} target="_blank" rel="noreferrer">
              /<Text fontSize="xs">View proof</Text>
            </a>
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
      <Th>{formatPrice(lineItem.UnitPrice)}</Th>
      <Th>{formatPrice(lineItem.LineSubtotal)}</Th>
    </Tr>
  )
}

export default OcLineItemCard
