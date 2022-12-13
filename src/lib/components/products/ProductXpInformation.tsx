import {CheckIcon, CloseIcon} from "@chakra-ui/icons"
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
  Checkbox,
  Collapse,
  Center,
  Textarea
} from "@chakra-ui/react"
import {
  ComposedProduct,
  GetComposedProduct
} from "lib/scripts/OrdercloudService"
import {ProductXPs, XpImage} from "lib/types/ProductXPs"
import {RequiredDeep, Product, Products} from "ordercloud-javascript-sdk"
import {ChangeEvent, useState} from "react"
import {
  FiCheck,
  FiX,
  FiEdit,
  FiPlus,
  FiPlusCircle,
  FiMinus
} from "react-icons/fi"
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
  const [xps, setXps] = useState({
    xps: composedProduct?.Product?.xp
  })

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
  /*   for (const x in composedProduct?.Product?.xp) {
    console.warn(x + " ," + composedProduct?.Product?.xp[x])
  } */
  //console.warn(composedProduct?.Product?.xp)
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
        <Heading size={{base: "md", md: "lg", lg: "xl"}}>
          Extended Properties
        </Heading>

        {(isLoading || !composedProduct?.Product) && expanded ? (
          <Box pt={6} textAlign={"center"}>
            Updating... <BrandedSpinner />
          </Box>
        ) : (
          <Collapse in={expanded}>
            <Box width="full" pb={2} pt={4}>
              <Text opacity={0.5} fontWeight={"bold"}></Text>
              {Object.keys(composedProduct?.Product?.xp).map((name, key) => {
                return isEditingBasicData &&
                  typeof composedProduct?.Product?.xp[name] != "object" ? (
                  <HStack key={key} mt={3}>
                    <Text width="25%">{name}</Text>
                    {composedProduct?.Product?.xp[name].length > 90 ? (
                      <Textarea
                        width={"75%"}
                        resize={"none"}
                        value={composedProduct?.Product?.xp[name]}
                        h={"300"}
                      />
                    ) : (
                      <Input
                        width={"75%"}
                        value={composedProduct?.Product?.xp[name]}
                        //onChange={handleInputChange(key)}
                      />
                    )}
                    <Tooltip pt={2} label="Remove Extended Property">
                      <Button
                        onClick={onDeleteProductImageClicked(name)}
                        //colorScheme={"purple"}
                      >
                        <FiMinus />
                      </Button>
                    </Tooltip>
                  </HStack>
                ) : (
                  <></>
                )
              })}
              {Object.keys(composedProduct?.Product?.xp).map((name, key) => {
                return !isEditingBasicData &&
                  typeof composedProduct?.Product?.xp[name] != "object" ? (
                  <HStack key={key} mt={4}>
                    <Text width={"25%"}>{name}</Text>
                    <Heading
                      fontSize={"2xl"}
                      fontFamily={"body"}
                      fontWeight={500}
                      width={"75%"}
                    >
                      <Input
                        width={"100%"}
                        value={composedProduct?.Product?.xp[name]}
                        disabled={true}
                      />
                    </Heading>
                  </HStack>
                ) : (
                  <></>
                )
              })}
              {isEditingBasicData &&
              formValues?.images[formValues?.images?.length - 1]?.Url != "" ? (
                <Tooltip label="Add new Extended Property">
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
            </Box>
          </Collapse>
        )}
      </>
    </BrandedBox>
  )
}
