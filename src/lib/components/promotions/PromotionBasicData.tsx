import {CheckIcon, CloseIcon} from "@chakra-ui/icons"
import {
  Box,
  Button,
  Heading,
  HStack,
  Tooltip,
  useColorModeValue,
  Text,
  useColorMode,
  Spinner,
  Container,
  Flex,
  Collapse,
  Input,
  Checkbox,
  useToast
} from "@chakra-ui/react"
import {setProductId} from "lib/redux/ocProductDetail"
import {useOcDispatch} from "lib/redux/ocStore"
import {PromotionXPs} from "lib/types/PromotionXPs"
import {
  Inventory,
  Product,
  Products,
  Promotion,
  Promotions,
  RequiredDeep
} from "ordercloud-javascript-sdk"
import {ChangeEvent, useEffect, useState} from "react"
import {FiCheck, FiEdit, FiX} from "react-icons/fi"
import BrandedBox from "../branding/BrandedBox"
import BrandedSpinner from "../branding/BrandedSpinner"

type PromotionDataProps = {
  promotion: Promotion
}

export default function ProductBasicData({promotion}: PromotionDataProps) {
  const toast = useToast()
  const [isEditingBasicData, setIsEditingBasicData] = useState(false)
  const okColor = useColorModeValue("okColor.800", "okColor.200")
  const errorColor = useColorModeValue("errorColor.800", "errorColor.200")
  const [expanded, setExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [componentPromotion, setComponentPromotion] =
    useState<Promotion<PromotionXPs>>(promotion)
  const [formValues, setFormValues] = useState({
    name: componentPromotion?.Name,
    id: componentPromotion?.ID,
    description: componentPromotion?.Description,
    code: componentPromotion?.Code,
    allowAllBuer: componentPromotion?.AllowAllBuyers,
    canCombine: componentPromotion?.CanCombine,
    eligableExpression: componentPromotion?.EligibleExpression,
    valueExpression: componentPromotion?.ValueExpression,
    redemptionLimit: componentPromotion?.RedemptionLimit,
    redemptionLimitPerUser: componentPromotion?.RedemptionLimitPerUser,
    finePrint: componentPromotion?.FinePrint,
    startDate: componentPromotion?.StartDate,
    redemptionCount: componentPromotion?.RedemptionCount,
    expirationDate: componentPromotion?.ExpirationDate,
    lineItemLevel: componentPromotion?.LineItemLevel
  })

  useEffect(() => {
    setComponentPromotion(promotion)
  }, [promotion])

  const handleInputChange =
    (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormValues((v) => ({...v, [fieldKey]: e.target.value}))
    }

  const handleCheckboxChange =
    (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormValues((v) => ({...v, [fieldKey]: !!e.target.checked}))
    }

  const handleNumberInputChange =
    (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormValues((v) => ({
        ...v,
        [fieldKey]: e.target.value == "" ? 0 : e.target.value
      }))
    }

  const onEditClicked = (e) => {
    setFormValues((v) => ({
      ...v,
      ["name"]: componentPromotion?.Name,
      ["id"]: componentPromotion?.ID,
      ["description"]: componentPromotion?.Description,
      ["code"]: componentPromotion?.Code,
      ["allowAllBuer"]: componentPromotion?.AllowAllBuyers,
      ["canCombine"]: componentPromotion?.CanCombine,
      ["eligableExpression"]: componentPromotion?.EligibleExpression,
      ["valueExpression"]: componentPromotion?.ValueExpression,
      ["redemptionLimit"]: componentPromotion?.RedemptionLimit,
      ["redemptionLimitPerUser"]: componentPromotion?.RedemptionLimitPerUser,
      ["finePrint"]: componentPromotion?.FinePrint,
      ["redemptionCount"]: componentPromotion?.RedemptionCount,
      ["expirationDate"]: componentPromotion?.ExpirationDate,
      ["lineItemLevel"]: componentPromotion?.LineItemLevel
    }))
    setIsEditingBasicData(true)
    setExpanded(true)
  }

  const onAbortClicked = async (e) => {
    setFormValues((v) => ({
      ...v,
      ["name"]: componentPromotion?.Name,
      ["id"]: componentPromotion?.ID,
      ["description"]: componentPromotion?.Description,
      ["code"]: componentPromotion?.Code,
      ["allowAllBuer"]: componentPromotion?.AllowAllBuyers,
      ["canCombine"]: componentPromotion?.CanCombine,
      ["eligableExpression"]: componentPromotion?.EligibleExpression,
      ["valueExpression"]: componentPromotion?.ValueExpression,
      ["redemptionLimit"]: componentPromotion?.RedemptionLimit,
      ["redemptionLimitPerUser"]: componentPromotion?.RedemptionLimitPerUser,
      ["finePrint"]: componentPromotion?.FinePrint,
      ["redemptionCount"]: componentPromotion?.RedemptionCount,
      ["expirationDate"]: componentPromotion?.ExpirationDate,
      ["lineItemLevel"]: componentPromotion?.LineItemLevel
    }))
    setIsEditingBasicData(false)
  }

  const onSaveClicked = async (e) => {
    setIsLoading(true)
    const newPromotion: Promotion = {
      Code: formValues.code,
      EligibleExpression: formValues.eligableExpression,
      ValueExpression: formValues.valueExpression,
      AllowAllBuyers: formValues.allowAllBuer,
      CanCombine: formValues.canCombine,
      Description: formValues.description,
      ExpirationDate: formValues.expirationDate,
      FinePrint: formValues.finePrint,
      ID: formValues.id,
      LineItemLevel: formValues.lineItemLevel,
      Name: formValues.name,
      RedemptionCount: formValues.redemptionCount,
      RedemptionLimit: formValues.redemptionLimit,
      RedemptionLimitPerUser: formValues.redemptionLimitPerUser,
      StartDate: formValues.startDate
    }

    await Promotions.Patch(promotion.ID, newPromotion).catch((error) => {
      if (error.isOrderCloudError) {
        console.log(error.errors.Errors)
        error.errors.Errors.map((element) => {
          var message =
            element?.Data?.Expression != null
              ? element?.Data?.Expression + ": " + element.Message
              : element?.Data?.Token
              ? element?.Data?.Token + ": " + element.Message
              : element.Message

          toast({
            title: element.ErrorCode,
            description: message,
            status: "error",
            duration: 9000,
            isClosable: true
          })
        })
      }
    })
    var patchedPromotion = await Promotions.Get(componentPromotion.ID)
    setComponentPromotion(patchedPromotion)

    setIsEditingBasicData(false)
    setIsLoading(false)
  }

  return (
    <>
      <BrandedBox isExpaned={expanded} setExpanded={setExpanded}>
        <>
          {isEditingBasicData ? (
            <HStack float={"right"}>
              <Tooltip label="Save">
                <Button
                  colorScheme="brandButtons"
                  aria-label="Save"
                  onClick={onSaveClicked}
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
          {(!componentPromotion || isLoading) && expanded ? (
            <Box pt={6} textAlign={"center"}>
              Updating... <BrandedSpinner />
            </Box>
          ) : (
            <>
              <Heading
                size={{base: "md", md: "lg", lg: "xl"}}
                mb={expanded ? 6 : 0}
              >
                Basic Data
              </Heading>
              <Collapse in={expanded}>
                <Flex flexDirection={{base: "column", sm: "column", md: "row"}}>
                  <Container>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Name:
                      </Text>
                      {isEditingBasicData ? (
                        <Input
                          value={formValues.name}
                          onChange={handleInputChange("name")}
                        />
                      ) : (
                        <Heading
                          fontSize={"xl"}
                          fontFamily={"body"}
                          fontWeight={500}
                        >
                          {componentPromotion?.Name}
                        </Heading>
                      )}
                    </Box>
                    <Tooltip
                      label={isEditingBasicData ? "ID is not changeable" : ""}
                    >
                      <Box width="full" pb={2}>
                        <Text opacity={0.5} fontWeight={"bold"}>
                          ID:
                        </Text>
                        {isEditingBasicData ? (
                          <Input
                            disabled={true}
                            value={formValues.id}
                            onChange={handleInputChange("id")}
                          />
                        ) : (
                          <Heading
                            fontSize={"xl"}
                            fontFamily={"body"}
                            fontWeight={500}
                          >
                            {componentPromotion?.ID}
                          </Heading>
                        )}
                      </Box>
                    </Tooltip>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Description:
                      </Text>
                      {isEditingBasicData ? (
                        <Input
                          value={formValues.description}
                          onChange={handleInputChange("description")}
                        />
                      ) : (
                        <Heading
                          fontSize={"xl"}
                          fontFamily={"body"}
                          fontWeight={500}
                        >
                          {componentPromotion?.Description}
                        </Heading>
                      )}
                    </Box>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Code:
                      </Text>
                      {isEditingBasicData ? (
                        <Input
                          value={formValues.code}
                          onChange={handleInputChange("code")}
                        />
                      ) : (
                        <Heading
                          fontSize={"xl"}
                          fontFamily={"body"}
                          fontWeight={500}
                        >
                          {componentPromotion?.Code ?? "Not set"}
                        </Heading>
                      )}
                    </Box>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Fine Print:
                      </Text>
                      {isEditingBasicData ? (
                        <Input
                          value={formValues.finePrint}
                          onChange={handleInputChange("finePrint")}
                        />
                      ) : (
                        <Heading
                          fontSize={"xl"}
                          fontFamily={"body"}
                          fontWeight={500}
                        >
                          {componentPromotion?.FinePrint ?? "Not set"}
                        </Heading>
                      )}
                    </Box>
                  </Container>
                  <Container>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Start Date:
                      </Text>
                      {isEditingBasicData ? (
                        <Input
                          disabled={true}
                          value={formValues.startDate}
                          onChange={handleInputChange("startDate")}
                        />
                      ) : (
                        <Heading
                          fontSize={"xl"}
                          fontFamily={"body"}
                          fontWeight={500}
                        >
                          {componentPromotion?.StartDate ?? "Not set"}
                        </Heading>
                      )}
                    </Box>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Expiration Date:
                      </Text>
                      {isEditingBasicData ? (
                        <Input
                          disabled={true}
                          value={formValues.expirationDate}
                          onChange={handleInputChange("expirationDate")}
                        />
                      ) : (
                        <Heading
                          fontSize={"xl"}
                          fontFamily={"body"}
                          fontWeight={500}
                        >
                          {componentPromotion?.ExpirationDate ?? "Not set"}
                        </Heading>
                      )}
                    </Box>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Allow all Buyers?:
                      </Text>
                      {isEditingBasicData ? (
                        <Checkbox
                          isChecked={formValues.allowAllBuer}
                          onChange={handleCheckboxChange("allowAllBuer")}
                        />
                      ) : (
                        <Heading
                          fontSize={"xl"}
                          fontFamily={"body"}
                          fontWeight={500}
                        >
                          {componentPromotion?.AllowAllBuyers ?? false ? (
                            <CheckIcon boxSize={6} color={okColor} />
                          ) : (
                            <CloseIcon boxSize={6} color={errorColor} />
                          )}
                        </Heading>
                      )}
                    </Box>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Can Combine?:
                      </Text>
                      {isEditingBasicData ? (
                        <Checkbox
                          isChecked={formValues.canCombine}
                          onChange={handleCheckboxChange("canCombine")}
                        />
                      ) : (
                        <Heading
                          fontSize={"xl"}
                          fontFamily={"body"}
                          fontWeight={500}
                        >
                          {componentPromotion?.CanCombine ?? false ? (
                            <CheckIcon boxSize={6} color={okColor} />
                          ) : (
                            <CloseIcon boxSize={6} color={errorColor} />
                          )}
                        </Heading>
                      )}
                    </Box>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Line Item Level?:
                      </Text>
                      {isEditingBasicData ? (
                        <Checkbox
                          isChecked={formValues.lineItemLevel}
                          onChange={handleCheckboxChange("lineItemLevel")}
                        />
                      ) : (
                        <Heading
                          fontSize={"xl"}
                          fontFamily={"body"}
                          fontWeight={500}
                        >
                          {componentPromotion?.LineItemLevel ?? false ? (
                            <CheckIcon boxSize={6} color={okColor} />
                          ) : (
                            <CloseIcon boxSize={6} color={errorColor} />
                          )}
                        </Heading>
                      )}
                    </Box>
                  </Container>
                  <Container>
                    <Tooltip label="The expression evaluated to determine if an item or order is eligible for a promotion. See Rules Engine documentation for formatting details.">
                      <Box width="full" pb={2}>
                        <Text opacity={0.5} fontWeight={"bold"}>
                          Eligable Expression:
                        </Text>
                        {isEditingBasicData ? (
                          <Input
                            value={formValues.eligableExpression}
                            onChange={handleInputChange("eligableExpression")}
                          />
                        ) : (
                          <Heading
                            fontSize={"xl"}
                            fontFamily={"body"}
                            fontWeight={500}
                          >
                            {componentPromotion?.EligibleExpression ??
                              "Not set"}
                          </Heading>
                        )}
                      </Box>
                    </Tooltip>
                    <Tooltip label="The expression evaluated to determine the discount amount of an eligible promotion. See Rules Engine documentation for formatting details.">
                      <Box width="full" pb={2}>
                        <Text opacity={0.5} fontWeight={"bold"}>
                          Value Expression:
                        </Text>
                        {isEditingBasicData ? (
                          <Input
                            value={formValues.valueExpression}
                            onChange={handleInputChange("valueExpression")}
                          />
                        ) : (
                          <Heading
                            fontSize={"xl"}
                            fontFamily={"body"}
                            fontWeight={500}
                          >
                            {componentPromotion?.ValueExpression ?? "Not set"}
                          </Heading>
                        )}
                      </Box>
                    </Tooltip>
                    <Tooltip label="Limit the total number of orders this promotion can be applied to across all users.">
                      <Box width="full" pb={2}>
                        <Text opacity={0.5} fontWeight={"bold"}>
                          Redemption Limit:
                        </Text>
                        {isEditingBasicData ? (
                          <Input
                            value={formValues.redemptionLimit}
                            onChange={handleNumberInputChange(
                              "redemptionLimit"
                            )}
                          />
                        ) : (
                          <Heading
                            fontSize={"xl"}
                            fontFamily={"body"}
                            fontWeight={500}
                          >
                            {componentPromotion?.RedemptionLimit ?? "Not set"}
                          </Heading>
                        )}
                      </Box>
                    </Tooltip>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Redemption Limit per User:
                      </Text>
                      {isEditingBasicData ? (
                        <Input
                          value={formValues.redemptionLimitPerUser}
                          onChange={handleNumberInputChange(
                            "redemptionLimitPerUser"
                          )}
                        />
                      ) : (
                        <Heading
                          fontSize={"xl"}
                          fontFamily={"body"}
                          fontWeight={500}
                        >
                          {componentPromotion?.RedemptionLimitPerUser ??
                            "Not set"}
                        </Heading>
                      )}
                    </Box>

                    <Tooltip label="Redemption Count is readonly">
                      <Box width="full" pb={2}>
                        <Text opacity={0.5} fontWeight={"bold"}>
                          Redemption Count:
                        </Text>
                        {isEditingBasicData ? (
                          <Input
                            disabled={true}
                            value={formValues.redemptionCount}
                            onChange={handleInputChange("redemptionCount")}
                          />
                        ) : (
                          <Heading
                            fontSize={"xl"}
                            fontFamily={"body"}
                            fontWeight={500}
                          >
                            {componentPromotion?.RedemptionCount ?? "Not set"}
                          </Heading>
                        )}
                      </Box>
                    </Tooltip>
                  </Container>
                </Flex>
              </Collapse>
            </>
          )}
        </>
      </BrandedBox>
    </>
  )
}
