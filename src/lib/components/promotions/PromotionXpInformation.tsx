import {CheckIcon, CloseIcon} from "@chakra-ui/icons"
import {
  useColorMode,
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
  Spinner,
  GridItem,
  Collapse,
  Select
} from "@chakra-ui/react"
import {setProductId} from "lib/redux/ocProductDetail"
import {useOcDispatch} from "lib/redux/ocStore"
import {
  PromotionTier,
  PromotionType,
  PromotionXPs
} from "lib/types/PromotionXPs"
import {Promotion, Promotions, PartialDeep} from "ordercloud-javascript-sdk"
import {ChangeEvent, useState} from "react"
import {FiCheck, FiX, FiEdit} from "react-icons/fi"
import BrandedBox from "../branding/BrandedBox"
import BrandedSpinner from "../branding/BrandedSpinner"

type PromotionDataProps = {
  promotion: Promotion<PromotionXPs>
}

export default function BasicProductData({promotion}: PromotionDataProps) {
  const [isEditingBasicData, setIsEditingBasicData] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const okColor = useColorModeValue("okColor.800", "okColor.200")
  const errorColor = useColorModeValue("errorColor.800", "errorColor.200")
  const [formValues, setFormValues] = useState({
    tier: promotion?.xp?.Tier,
    type: promotion?.xp?.Type,
    customer: promotion?.xp?.Customer
  })
  const dispatch = useOcDispatch()
  const [expanded, setExpanded] = useState(false)

  const onEditClicked = (e) => {
    e.preventDefault()
    setFormValues((v) => ({
      ...v,
      ["tier"]: promotion?.xp?.Tier,
      ["type"]: promotion?.xp?.Type,
      ["customer"]: promotion?.xp?.Customer
    }))
    setIsEditingBasicData(true)
    setExpanded(true)
  }

  const onAbortClicked = (e) => {
    e.preventDefault()
    setIsEditingBasicData(false)
  }

  const handleInputChange =
    (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormValues((v) => ({...v, [fieldKey]: e.target.value}))
    }

  const handleSelectInputChange =
    (fieldKey: string) => (e: ChangeEvent<HTMLSelectElement>) => {
      setFormValues((v) => ({...v, [fieldKey]: e.target.value}))
    }

  const handleCheckboxChange =
    (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormValues((v) => ({...v, [fieldKey]: !!e.target.checked}))
    }

  const onPromotionSave = async (e) => {
    setIsLoading(true)
    e.preventDefault()
    const newPromotion: PartialDeep<Promotion<PromotionXPs>> = {
      xp: {
        Customer: formValues.customer,
        Type: formValues.type,
        Tier: formValues.tier
      }
    }

    await Promotions.Patch(promotion.ID, newPromotion)

    // Hack to ensure Data are loaded before showing -> AWAIT is not enough
    setTimeout(() => {
      dispatch(setProductId(promotion.ID))
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
                onClick={onPromotionSave}
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
        <Heading size={{base: "md", md: "lg", lg: "xl"}}>Membership</Heading>

        {(isLoading || !promotion) && expanded ? (
          <Box pt={6} textAlign={"center"}>
            Updating... <BrandedSpinner />
          </Box>
        ) : (
          <>
            <Collapse in={expanded}>
              <Box width="full" pb={2} pt={4}>
                <Text opacity={0.5} fontWeight={"bold"}>
                  Type:
                </Text>
                {isEditingBasicData ? (
                  <Select
                    onChange={handleSelectInputChange("type")}
                    value={formValues.type}
                  >
                    <option value={PromotionType.INDIVIDUAL}>Individual</option>
                    <option value={PromotionType.GENERIC}>Generic</option>
                  </Select>
                ) : (
                  <Heading
                    fontSize={"2xl"}
                    fontFamily={"body"}
                    fontWeight={500}
                  >
                    {promotion?.xp?.Type ?? "No Type"}
                  </Heading>
                )}
              </Box>
              <Box width="full" pb={2} pt={4}>
                <Text opacity={0.5} fontWeight={"bold"}>
                  Tier:
                </Text>
                {isEditingBasicData ? (
                  <Select
                    onChange={handleSelectInputChange("tier")}
                    value={formValues.tier}
                  >
                    <option value={PromotionTier.BRONZE}>Bronze</option>
                    <option value={PromotionTier.SILVER}>Silver</option>
                    <option value={PromotionTier.GOLD}>Gold</option>
                  </Select>
                ) : (
                  <Heading
                    fontSize={"2xl"}
                    fontFamily={"body"}
                    fontWeight={500}
                  >
                    {promotion?.xp?.Tier ?? "No Tier"}
                  </Heading>
                )}
              </Box>
              <Tooltip
                label={
                  formValues.type != PromotionType.INDIVIDUAL
                    ? "Please choose Type Individual to enter a customer"
                    : ""
                }
              >
                <Box width="full" pb={2} pt={4}>
                  <Text opacity={0.5} fontWeight={"bold"}>
                    Customer:
                  </Text>
                  {isEditingBasicData ? (
                    <Input
                      disabled={formValues.type != PromotionType.INDIVIDUAL}
                      value={formValues.customer}
                      onChange={handleInputChange("customer")}
                    />
                  ) : (
                    <Heading
                      fontSize={"2xl"}
                      fontFamily={"body"}
                      fontWeight={500}
                    >
                      {promotion?.xp?.Customer ?? "No Customer"}
                    </Heading>
                  )}
                </Box>
              </Tooltip>
            </Collapse>
          </>
        )}
      </>
    </BrandedBox>
  )
}
