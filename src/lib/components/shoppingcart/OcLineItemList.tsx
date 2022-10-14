import {FunctionComponent} from "react"
import OcLineItemCard from "./OcLineItemCard"
import {Grid, GridItem, Box, HStack} from "@chakra-ui/react"
import {LineItem} from "ordercloud-javascript-sdk"

interface OcLineItemListProps {
  emptyMessage?: string
  editable?: boolean
  lineItems: LineItem[]
}

const OcLineItemList: FunctionComponent<OcLineItemListProps> = ({
  emptyMessage,
  editable,
  lineItems
}) => {
  return lineItems && lineItems.length ? (
    <Grid
      as="section"
      templateColumns="repeat(1, 1fr)"
      templateRows="(1, 1fr)"
      gap={3}
      w="full"
      width="100%"
      maxWidth="1000px"
    >
      <GridItem
        colSpan={1}
        rowSpan={1}
        bg="white"
        borderRadius="0px"
        w="full"
        width="100%"
        p="3"
      >
        <HStack
          w="100%"
          color="gray.600"
          justifyContent="flex-end"
          fontSize="14"
        >
          <Box pr="10">Price</Box>
          <Box pr="20">Qty</Box>
          <Box pr="1">Total</Box>
        </HStack>
      </GridItem>
      {lineItems.map((li) => (
        <GridItem
          colSpan={1}
          rowSpan={1}
          bg="white"
          border="1px"
          borderColor="gray.300"
          borderRadius="0px"
          w="full"
          width="100%"
          p="3"
          key={li.ID}
        >
          <section key={li.ID}>
            <OcLineItemCard lineItem={li} editable={editable} />
          </section>
        </GridItem>
      ))}
    </Grid>
  ) : (
    <h3>{emptyMessage}</h3>
  )
}

export default OcLineItemList
