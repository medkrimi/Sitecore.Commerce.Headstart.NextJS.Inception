import {
  Box,
  Button,
  Center,
  Checkbox,
  Collapse,
  HStack,
  Heading,
  Image,
  Input,
  Text,
  Tooltip,
  useColorModeValue
} from "@chakra-ui/react"
import {ChangeEvent, useState} from "react"
import {CheckIcon, CloseIcon} from "@chakra-ui/icons"
import {
  ComposedProduct,
  GetComposedProduct
} from "../../services/ordercloud.service"
import {FiCheck, FiEdit, FiMinus, FiPlus, FiX} from "react-icons/fi"
import {Product, Products, RequiredDeep} from "ordercloud-javascript-sdk"
import {ProductXPs, XpImage} from "lib/types/ProductXPs"

import BrandedBox from "../branding/BrandedBox"
import BrandedSpinner from "../branding/BrandedSpinner"

type ProductDataProps = {
  composedProduct: ComposedProduct
  setComposedProduct: React.Dispatch<React.SetStateAction<ComposedProduct>>
}

export default function ProductXpInformation({
  composedProduct,
  setComposedProduct
}: ProductDataProps) {
  const [isEditingBasicData, setIsEditingBasicData] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const okColor = useColorModeValue("okColor.800", "okColor.200")
  const errorColor = useColorModeValue("errorColor.800", "errorColor.200")
  const [formValues, setFormValues] = useState({
    someAdditionalCheckbox:
      composedProduct?.Product?.xp?.SomeAdditionalCheckbox,
    images: composedProduct?.Product?.xp?.Images
  })
  const [expanded, setExpanded] = useState(false)

  const onEditClicked = (e) => {
    e.preventDefault()
    setFormValues((v) => ({
      ...v,
      ["someAdditionalCheckbox"]:
        composedProduct?.Product?.xp?.SomeAdditionalCheckbox,
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
        ThumbnailUrl: emptyVal
      }

      tmpImages[fieldKey] = tmpImage

      setFormValues((v) => ({
        ...v,
        ["images"]: tmpImages
      }))
    }

  const handleCheckboxChange =
    (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormValues((v) => ({...v, [fieldKey]: !!e.target.checked}))
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
        Images: images,
        SomeAdditionalCheckbox: formValues.someAdditionalCheckbox
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
              <Button
                colorScheme="brandButtons"
                aria-label="Save"
                onClick={onProductSave}
              >
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
              <Button
                colorScheme="brandButtons"
                aria-label="Edit"
                onClick={onEditClicked}
              >
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
                              colorScheme={"purple"}
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
                          <Button
                            onClick={onNewProductImageClicked}
                            width={"10%"}
                            colorScheme={"purple"}
                          >
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
              <Box width="full" pb={2} pt={4}>
                <Text opacity={0.5} fontWeight={"bold"}>
                  Some Additional Checkbox:
                </Text>
                {isEditingBasicData ? (
                  <Checkbox
                    isChecked={formValues.someAdditionalCheckbox}
                    onChange={handleCheckboxChange("someAdditionalCheckbox")}
                  />
                ) : (
                  <Heading
                    fontSize={"2xl"}
                    fontFamily={"body"}
                    fontWeight={500}
                  >
                    {composedProduct?.Product?.xp?.SomeAdditionalCheckbox ??
                    false ? (
                      <CheckIcon boxSize={6} color={okColor} />
                    ) : (
                      <CloseIcon boxSize={6} color={errorColor} />
                    )}
                  </Heading>
                )}
              </Box>
            </Collapse>
          </>
        )}
      </>
    </BrandedBox>
  )
}
