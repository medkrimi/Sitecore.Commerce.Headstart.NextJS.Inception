import {
  useColorModeValue,
  Heading,
  Box,
  Text,
  Image,
  Button,
  HStack,
  Tooltip,
  Input,
  Collapse,
  Center
} from "@chakra-ui/react"
import {
  ComposedProduct,
  GetComposedProduct
} from "../../services/ordercloud.service"
import {ProductXPs, XpImage} from "lib/types/ProductXPs"
import {Product, Products} from "ordercloud-javascript-sdk"
import {ChangeEvent, useState} from "react"
import {FiCheck, FiX, FiEdit, FiPlus, FiMinus} from "react-icons/fi"
import BrandedBox from "../branding/BrandedBox"
import BrandedSpinner from "../branding/BrandedSpinner"

type ProductDataProps = {
  composedProduct: ComposedProduct
  setComposedProduct: React.Dispatch<React.SetStateAction<ComposedProduct>>
}

export default function ProductMediaInformation({
  composedProduct,
  setComposedProduct
}: ProductDataProps) {
  const [isEditingBasicData, setIsEditingBasicData] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const okColor = useColorModeValue("okColor.800", "okColor.200")
  const errorColor = useColorModeValue("errorColor.800", "errorColor.200")
  const [formValues, setFormValues] = useState({
    images: composedProduct?.Product?.xp?.Images
  })
  const [expanded, setExpanded] = useState(true)

  const onEditClicked = (e) => {
    e.preventDefault()
    setFormValues((v) => ({
      ...v,
      ["images"]: composedProduct?.Product?.xp?.Images ?? []
    }))
    setIsEditingBasicData(true)
    setExpanded(true)
  }

  const onAbortClicked = (e) => {
    e.preventDefault()
    setIsEditingBasicData(false)
  }

  const handleInputChange =
    (fieldKey: number) => (e: ChangeEvent<HTMLInputElement>) => {
      var newVal = e.target.value
      var emptyVal = null
      var tmpImages = [...formValues.images]
      var tmpImage: XpImage = {
        Url: newVal,
        ThumbnailUrl: newVal
      }

      tmpImages[fieldKey] = tmpImage

      setFormValues((v) => ({
        ...v,
        ["images"]: tmpImages
      }))
    }

  const onDeleteProductImageClicked = (url: string) => async (e) => {
    setIsLoading(true)
    var tmpImages = [...formValues.images]
    tmpImages = tmpImages.filter((element) => element.Url != url)
    setFormValues((v) => ({
      ...v,
      ["images"]: tmpImages
    }))

    setIsLoading(false)
  }

  const onNewProductImageClicked = async (e) => {
    setIsLoading(true)
    var tmpImages: XpImage[] = []
    if (formValues.images) {
      tmpImages = [...formValues.images]
    }

    var tmpImage: XpImage = {
      Url: "",
      ThumbnailUrl: ""
    }

    tmpImages.push(tmpImage)
    setFormValues((v) => ({
      ...v,
      ["images"]: tmpImages
    }))

    setIsLoading(false)
  }

  const onProductSave = async () => {
    setIsLoading(true)
    const images: XpImage[] = []
    formValues.images.map((item) => {
      const xpImage: XpImage = {
        Url: item.Url,
        ThumbnailUrl: item.ThumbnailUrl
      }
      images.push(xpImage)
    })
    // For now focus on first image in list
    if (images.length == 0) {
      const xpImage: XpImage = {
        Url: formValues.images[0]?.Url ?? "",
        ThumbnailUrl: formValues.images[0]?.ThumbnailUrl ?? ""
      }
      images.push(xpImage)
    }

    const newProduct: Product<ProductXPs> = {
      Name: composedProduct?.Product?.Name,
      xp: {
        Name: "Test",
        Images: images
      }
    }

    await Products.Patch(composedProduct?.Product?.ID, newProduct)

    // Hack to ensure Data are loaded before showing -> AWAIT is not enough
    setTimeout(async () => {
      var product = await GetComposedProduct(composedProduct?.Product?.ID)
      setComposedProduct(product)
      setTimeout(() => {
        setIsEditingBasicData(false)
        setIsLoading(false)
      }, 1000)
    }, 4500)
  }

  return (
    <BrandedBox isExpaned={expanded} setExpanded={setExpanded}>
      <>
        {isEditingBasicData ? (
          <HStack float={"right"}>
            <Tooltip label="Save">
              <Button aria-label="Save" onClick={onProductSave}>
                <FiCheck />
              </Button>
            </Tooltip>
            <Tooltip label="Abort">
              <Button
                colorScheme="brandButtons"
                aria-label="Abort"
                onClick={onAbortClicked}
              >
                <FiX />
              </Button>
            </Tooltip>
          </HStack>
        ) : (
          <HStack float={"right"}>
            <Tooltip label="Edit">
              <Button aria-label="Edit" onClick={onEditClicked}>
                <FiEdit />
              </Button>
            </Tooltip>
          </HStack>
        )}
        <Heading size={{base: "md", md: "lg", lg: "xl"}}>Media</Heading>

        {(isLoading || !composedProduct?.Product) && expanded ? (
          <Box pt={6} textAlign={"center"}>
            Updating... <BrandedSpinner />
          </Box>
        ) : (
          <>
            <Collapse in={expanded}>
              <Box width="full" pb={2} pt={4}>
                <>
                  <Text opacity={0.5} fontWeight={"bold"}>
                    Images:
                  </Text>
                  {formValues?.images?.map((image, key) => {
                    return isEditingBasicData ? (
                      <HStack key={key} mt={3}>
                        <Text>{key + 1}</Text>
                        <Input
                          value={image.Url}
                          onChange={handleInputChange(key)}
                        />
                        {key != 0 ? (
                          <Tooltip pt={2} label="Remove Product Image">
                            <Button
                              onClick={onDeleteProductImageClicked(image.Url)}
                              //colorScheme={"purple"}
                            >
                              <FiMinus />
                            </Button>
                          </Tooltip>
                        ) : (
                          <></>
                        )}
                      </HStack>
                    ) : (
                      <></>
                    )
                  })}
                  {composedProduct?.Product?.xp?.Images?.map((image, key) => {
                    return !isEditingBasicData ? (
                      <HStack key={key} mt={4}>
                        <Text>{key + 1}</Text>
                        <Heading
                          fontSize={"2xl"}
                          fontFamily={"body"}
                          fontWeight={500}
                        >
                          {(image?.Url ?? "") == "" ? (
                            <>No Image</>
                          ) : (
                            <>
                              <Image
                                boxSize="250px"
                                objectFit="scale-down"
                                mt={4}
                                alt={"Product Image"}
                                src={image?.Url}
                              />
                            </>
                          )}
                        </Heading>
                      </HStack>
                    ) : (
                      <></>
                    )
                  })}
                  {isEditingBasicData &&
                  formValues?.images[formValues?.images?.length - 1]?.Url !=
                    "" ? (
                    <Tooltip label="Add new Product Image">
                      <Box pt={4}>
                        <Center>
                          <Button onClick={onNewProductImageClicked}>
                            <FiPlus />
                          </Button>
                        </Center>
                      </Box>
                    </Tooltip>
                  ) : (
                    <></>
                  )}
                </>
              </Box>
            </Collapse>
          </>
        )}
      </>
    </BrandedBox>
  )
}