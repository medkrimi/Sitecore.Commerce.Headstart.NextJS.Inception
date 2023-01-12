import * as Yup from "yup"

import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Divider,
  Flex,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  ListIcon,
  ListItem,
  Radio,
  SimpleGrid,
  Stack,
  UnorderedList
} from "@chakra-ui/react"
import {CheckIcon, DeleteIcon} from "@chakra-ui/icons"
import {
  CheckboxSingleControl,
  InputControl,
  NumberInputControl,
  PercentComplete,
  RadioGroupControl,
  SelectControl,
  SwitchControl,
  TextareaControl
} from "formik-chakra-ui"

import Card from "../card/Card"
import {Formik} from "formik"
import {MdCheckCircle} from "react-icons/md"
import {Promotion} from "ordercloud-javascript-sdk"
import {promotionsService} from "lib/api"
import {useRouter} from "next/router"
import {useToast} from "@chakra-ui/react"
import {xpHelper} from "lib/utils/xp.utils"
import {yupResolver} from "@hookform/resolvers/yup"

export {AddEditForm}

interface AddEditFormProps {
  promotion?: Promotion
}
function AddEditForm({promotion}: AddEditFormProps) {
  const isAddMode = !promotion
  const router = useRouter()
  const toast = useToast()
  // form validation rules
  const validationSchema = Yup.object().shape({
    Name: Yup.string().max(100).required("Name is required"),
    Description: Yup.string().max(100)
  })

  const formOptions = {
    resolver: yupResolver(validationSchema, {
      stripUnknown: true,
      abortEarly: false
    }),
    defaultValues: {}
  }

  // set default form values if user passed in props
  if (!isAddMode) {
    formOptions.defaultValues = xpHelper.flattenXpObject(promotion, "_")
  }

  function onSubmit(fields, {setStatus, setSubmitting}) {
    setStatus()
    if (isAddMode) {
      const promotion = xpHelper.unflattenXpObject(fields, "_")
      createPromotion(promotion, setSubmitting)
    } else {
      const promotion = xpHelper.unflattenXpObject(fields, "_")
      updatePromotion(promotion, setSubmitting)
    }
  }

  async function createPromotion(fields, setSubmitting) {
    try {
      const createdPromotion = await promotionsService.create(fields)
      /*await promotionsService.saveAssignment(
        router.query.catalogid,
        createdCatalog.ID,
        router.query.buyerid,
        router.query.usergroupid
      )*/
      toast({
        id: fields.ID + "-created",
        title: "Success",
        description: "Promotion created successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top"
      })
      router.push(`/promotions`)
    } catch (e) {
      setSubmitting(false)
    }
  }

  async function updatePromotion(fields, setSubmitting) {
    try {
      const updatedPromotion = await promotionsService.update(fields)
      /*await promotionsService.saveAssignment(
        router.query.catalogid,
        updatedCatalog.ID,
        router.query.buyerid,
        router.query.usergroupid
      )*/
      toast({
        id: fields.ID + "-updated",
        title: "Success",
        description: "Promotion updated successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top"
      })
      router.push(`/promotions`)
    } catch (e) {
      setSubmitting(false)
    }
  }

  async function deletePromotion(promotionid) {
    try {
      await promotionsService.delete(promotionid)
      toast({
        id: promotionid + "-deleted",
        title: "Success",
        description: "Promotion deleted successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top"
      })
    } catch (e) {
      toast({
        id: promotionid + "fail-deleted",
        title: "Error",
        description: "Promotion delete failed",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top"
      })
    }
  }

  return (
    <>
      <Card variant="primaryCard">
        <Flex flexDirection="column" p="10">
          <Formik
            enableReinitialize
            initialValues={formOptions.defaultValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({
              // most of the usefull available Formik props
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              resetForm
            }) => (
              <>
                <SimpleGrid as="form" onSubmit={handleSubmit as any} columns={3} spacing={10}>
                  <Box>
                    <InputControl name="Name" label="Promotion Name" />
                    <TextareaControl name="Description" label="Description" />
                    <Divider mt="15" mb="15" />
                    <SwitchControl name="withCoupon" label="Coupon Based Promo" />
                    {values.withCoupon && (
                      <InputControl
                        name="DiscountCode"
                        label="Discount Code"
                        helperText="Buyer users will use this code at checkout."
                      />
                    )}
                    <Divider mt="15" mb="15" />
                    <TextareaControl name="FinePrint" label="Fine Print" />
                  </Box>
                  <Box>
                    <RadioGroupControl name="Type" label="Promotion Type">
                      <Radio value="percentage">Percentage</Radio>
                      <Radio value="fixed">Fixed Amount</Radio>
                      <Radio value="free-shipping">Free Shipping</Radio>
                      <Radio value="bogo">BOGO</Radio>
                    </RadioGroupControl>

                    {values.Type !== "free-shipping" && values.Type !== "bogo" && (
                      <InputGroup>
                        <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em">
                          {values.Type === "percentage" ? "%" : "$"}
                        </InputLeftElement>
                        <Input name="value" placeholder="Enter amout" />
                      </InputGroup>
                    )}

                    <Divider mt="15" mb="15" />
                    <RadioGroupControl name="MinRequirment" label="Minimum requirments">
                      <Radio value="none">None</Radio>
                      <Radio value="min-amount">Minimum purchase amount</Radio>
                      <Radio value="min-qty">Minimum quantity of items</Radio>
                    </RadioGroupControl>
                    <Divider mt="15" mb="15" />
                    <RadioGroupControl name="BuyerEligibility" label="Buyer Eligibility">
                      <Radio value="all-buyers">All Buyers</Radio>
                      <Radio value="buyers">Specific buyers</Radio>
                      <Radio value="buyersgroup">Specific buying group</Radio>
                    </RadioGroupControl>
                    <Divider mt="15" mb="15" />
                    <HStack spacing={6}>
                      <SwitchControl name="LineItemLevel" label="Line Item Level" />
                      <SwitchControl name="CanCombine" label="Can combine with other promos" />
                    </HStack>
                    <Divider mt="15" mb="15" />
                  </Box>
                  <Box>
                    <Stack spacing={6}>
                      <Heading as="h2" noOfLines={1}>
                        Preview
                      </Heading>
                      <UnorderedList>
                        <ListItem>Name: {values.Name}</ListItem>
                        <ListItem>Description: {values.Description}</ListItem>
                        <ListItem>Can Combine: {values.CanCombine ? "Yes" : "No"}</ListItem>
                        <ListItem>Facilisis in pretium nisl aliquet</ListItem>
                      </UnorderedList>
                    </Stack>
                  </Box>
                </SimpleGrid>
                <ButtonGroup>
                  <Button variant="primaryButton" type="submit" isLoading={isSubmitting}>
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      resetForm()
                    }}
                    type="reset"
                    variant="secondaryButton"
                    isLoading={isSubmitting}
                  >
                    Reset
                  </Button>
                  <Button onClick={() => router.push(`/promotions`)} variant="secondaryButton" isLoading={isSubmitting}>
                    Cancel
                  </Button>
                  <Button
                    variant="secondaryButton"
                    onClick={() => deletePromotion(values.ID)}
                    leftIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                </ButtonGroup>
              </>
            )}
          </Formik>
        </Flex>
      </Card>
    </>
  )
}
