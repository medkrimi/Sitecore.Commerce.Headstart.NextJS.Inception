import {
  VStack,
  Heading,
  Text,
  Button,
  Image,
  Checkbox,
  Link,
  useColorModeValue,
  HStack,
  Flex,
  Spacer,
  Tooltip
} from "@chakra-ui/react"
import {stripHTML} from "lib/utils/stripHTML"
import {CheckIcon, CloseIcon} from "@chakra-ui/icons"

const ProductCard = (props) => {
  const product = props.product
  const okColor = useColorModeValue("okColor.800", "okColor.200")
  const errorColor = useColorModeValue("errorColor.800", "errorColor.200")

  return (
    <VStack h="full" justifyContent="space-between" p={2}>
      <Flex w="full" alignItems={"flex-start"}>
        <Checkbox onChange={props.onCheck(product.ID)} />
        <Spacer />
        <Spacer />
        <Image
          src={
            typeof product?.xp?.Images != "undefined"
              ? product?.xp?.Images[0]?.ThumbnailUrl
              : "https://mss-p-006-delivery.stylelabs.cloud/api/public/content/4fc742feffd14e7686e4820e55dbfbaa"
          }
          alt="product image"
          width="100px"
        />
        <Spacer />
        <VStack>
          <p>Active</p>
          {product.Active ? (
            <CheckIcon boxSize={6} color={okColor} />
          ) : (
            <CloseIcon boxSize={6} color={errorColor} />
          )}
        </VStack>
        <Spacer />
      </Flex>
      <VStack
        flex="1"
        justifyContent="flex-end"
        alignItems="flex-start"
        p={[4, 2, 20, 6]}
      >
        {/* <Heading fontSize="xx-small" fontWeight='normal' color='gray.300' >NEW ARRIVALS</Heading>  */}
        <Tooltip label={product.Name}>
          <Heading as="h3" fontSize="small">
            {product.Name.length > 39
              ? product.Name.substring(0, 39) + "..."
              : product.Name}
          </Heading>
        </Tooltip>
        <Text fontSize="small" color="brand.500">
          {stripHTML(product.Description).length > 40
            ? stripHTML(product.Description).substring(0, 40) + "..."
            : stripHTML(product.Description)}
        </Text>
        <Link href={"/products/" + product.ID}>
          <Button bg="brand.500" size="xs">
            Edit Product
          </Button>
        </Link>
      </VStack>
    </VStack>
  )
}

export default ProductCard
