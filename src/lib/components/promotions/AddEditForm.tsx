import * as Yup from "yup"

import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Divider,
  Flex,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  ListIcon,
  ListItem,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  Select,
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
import {Formik, useField, useFormikContext} from "formik"
import {Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react"
import {useEffect, useState} from "react"

import Card from "../card/Card"
import DatePicker from "../datepicker/DatePicker"
import {ExpressionBuilder} from "./ExpressionBuilder"
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

const EligibleExpressionField = (props) => {
  const {values, touched, setFieldValue} = useFormikContext()
  const [field, meta] = useField(props)

  useEffect(() => {
    const eligibleExpression = async () => {
      const elExpression = await promotionsService.buildEligibleExpression(values)
      setFieldValue(props.name, elExpression)
    }
    eligibleExpression()
    //
  }, [props.name, setFieldValue, touched, values])

  return (
    <>
      <TextareaControl {...props} {...field} />
      {!!meta.touched && !!meta.error && <div>{meta.error}</div>}
    </>
  )
}

function AddEditForm({promotion}: AddEditFormProps) {
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const isAddMode = !promotion
  const router = useRouter()
  const toast = useToast()
  // form validation rules
  const validationSchema = Yup.object().shape({
    Name: Yup.string().max(100),
    Code: Yup.string().max(100).required("Code is required"),
    EligibleExpression: Yup.string().max(400).required("Eligible Expression is required"),
    ValueExpression: Yup.string().max(400).required("Value Expression is required"),
    Description: Yup.string().max(100),
    xp_MinReqValue: Yup.number()
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
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            resetForm
          }) => (
            <>
              <Box as="form" onSubmit={handleSubmit as any}>
                <Grid
                  templateAreas={`"main nav"
                  "main nav"
                  "footer footer"`}
                  gridTemplateRows={"auto"}
                  gridTemplateColumns={"70% 1fr"}
                  h="auto"
                  gap="1"
                  color="blackAlpha.700"
                  fontWeight="bold"
                >
                  <GridItem pl="2" area={"nav"}>
                    <Heading as="h2" noOfLines={1}>
                      Overview
                    </Heading>
                    <UnorderedList>
                      <ListItem>Name: {values.Name}</ListItem>
                      <ListItem>Description: {values.Description}</ListItem>
                      <Divider mt="15" mb="15" />
                      <ListItem>Code: {values.Code}</ListItem>
                      <Divider mt="15" mb="15" />
                      <ListItem>Start Date: {values.StartDate}</ListItem>
                      <ListItem>End Date: {values.EndDate}</ListItem>
                      <Divider mt="15" mb="15" />
                      <ListItem>Can Combine: {values.CanCombine ? "Yes" : "No"}</ListItem>
                      <ListItem>Line Item Level: {values.LineItemLevel ? "Yes" : "No"}</ListItem>
                      <ListItem>Allow All Buyers: {values.AllowAllBuyers ? "Yes" : "No"}</ListItem>
                      <ListItem>Redemption Limit: {values.RedemptionLimit}</ListItem>
                      <ListItem>Redemption Limit Per User: {values.RedemptionLimitPerUser}</ListItem>
                      <Divider mt="15" mb="15" />
                      <ListItem>Fine Print: {values.FinePrint}</ListItem>
                      <Divider mt="15" mb="15" />
                      <ListItem>Eligible Expression: {values.EligibleExpression}</ListItem>
                      <ListItem>Value Expression: {values.ValueExpression}</ListItem>
                      <Divider mt="15" mb="15" />
                    </UnorderedList>
                  </GridItem>
                  <GridItem pl="2" area={"main"}>
                    <Tabs>
                      <TabList>
                        {/* This tab contains all default Promotion API options (No extended propreties) */}
                        <Tab>Default Options</Tab>
                        {/* This tab contains some examples of how we can leverage XP (extended Propreties) */}
                        <Tab>Advanced Rules (xp)</Tab>
                        {/* This tab contains another examples to show the flexibility offered by EligibleExpressions and ValueExpression Fileds. */}
                        <Tab>Expression Builder</Tab>
                      </TabList>
                      <TabPanels>
                        <TabPanel>
                          <SimpleGrid columns={2} spacing={10}>
                            <Box>
                              <InputControl name="Name" label="Promotion Name" helperText="" />
                              <Divider mt="15" mb="15" />
                              <TextareaControl name="Description" label="Description" />
                              <Divider mt="15" mb="15" />
                              <FormLabel>Start Date</FormLabel>
                              <DatePicker selectedDate={startDate} onChange={setStartDate} />
                              <div>{startDate.toISOString()}</div>
                              <Divider mt="15" mb="15" />
                              <label htmlFor="RedemptionLimit">Redemption Limit</label>
                              <NumberInput defaultValue={100} max={1000} clampValueOnBlur={false}>
                                <NumberInputField name="RedemptionLimit" />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                              <Divider mt="15" mb="15" />
                              <HStack spacing={6}>
                                <SwitchControl name="Active" label="Active" />
                                <SwitchControl name="AutoApply" label="Auto Apply" />
                              </HStack>
                              <Divider mt="15" mb="15" />
                              <label htmlFor="Priority">Priority</label>
                              <NumberInput defaultValue={1} max={10} clampValueOnBlur={false}>
                                <NumberInputField name="Priority" />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                            </Box>
                            <Box>
                              <InputControl name="Code" label="Coupon Code" helperText="" />
                              <Divider mt="15" mb="15" />
                              <TextareaControl name="FinePrint" label="Fine Print" />
                              <Divider mt="15" mb="15" />
                              <FormLabel>End Date</FormLabel>
                              <DatePicker selectedDate={endDate} onChange={setEndDate} />
                              <div>{endDate.toISOString()}</div>
                              <Divider mt="15" mb="15" />
                              <label htmlFor="RedemptionLimitPerUser">Redemption Limit per user</label>
                              <NumberInput defaultValue={1} max={10} clampValueOnBlur={false}>
                                <NumberInputField name="RedemptionLimitPerUser" />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                              <Divider mt="15" mb="15" />
                              <HStack spacing={6}>
                                <SwitchControl name="LineItemLevel" label="Line Item Level" />
                                <SwitchControl name="CanCombine" label="Can be combined" />
                                <SwitchControl name="AllowAllBuyers" label="Allow all buyers" />
                              </HStack>
                            </Box>
                          </SimpleGrid>
                        </TabPanel>
                        <TabPanel>
                          <SimpleGrid columns={2} spacing={10}>
                            <Box>
                              <RadioGroupControl name="xp_MinimumReq" label="Minimum requirment">
                                <Radio value="none">None</Radio>
                                <Radio value="min-amount">Minimum purchase amount</Radio>
                                <Radio value="min-qty">Minimum quantity of items</Radio>
                              </RadioGroupControl>
                              <InputControl name="xp_MinReqValue" placeholder="Enter amount" />
                              <Divider mt="15" mb="15" />
                              <label htmlFor="xp_ScopeTo">Eligibility / Scope to</label>
                              <Select name="xp_ScopeTo" placeholder="Select option">
                                <option value="buyers">Buyers</option>
                                <option value="buyersgroup">Buyers Group</option>
                                <option value="suppliers">Suppliers</option>
                                <option value="products">Products</option>
                                <option value="categories">Categories</option>
                              </Select>
                            </Box>
                            <Box>
                              <RadioGroupControl name="xp_Type" label="Promotion Type">
                                <Radio value="Percentage">Percentage</Radio>
                                <Radio value="Fixed">Fixed Amount</Radio>
                                <Radio value="Free-shipping">Free Shipping</Radio>
                                <Radio value="BOGO">BOGO</Radio>
                              </RadioGroupControl>

                              {values.xp_Type !== "Free-shipping" && values.xp_Type !== "BOGO" && (
                                <InputGroup>
                                  <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em">
                                    {values.xp_Type === "Percentage" ? "%" : "$"}
                                  </InputLeftElement>
                                  <InputControl name="xp_Value" placeholder="Enter amount" />
                                </InputGroup>
                              )}
                              <Divider mt="15" mb="15" />
                            </Box>
                          </SimpleGrid>
                        </TabPanel>
                        <TabPanel>
                          <SimpleGrid columns={2} spacing={10}>
                            <Box>
                              <EligibleExpressionField name="EligibleExpression" label="Eligible Expression" />
                            </Box>
                            <Box>
                              <TextareaControl name="ValueExpression" label="Value Expression" />
                            </Box>
                          </SimpleGrid>
                          <ExpressionBuilder />
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
                  </GridItem>
                  <GridItem pl="2" area={"footer"}>
                    <Divider mt="15" mb="15" />
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
                      <Button
                        onClick={() => router.push(`/promotions`)}
                        variant="secondaryButton"
                        isLoading={isSubmitting}
                      >
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
                  </GridItem>
                </Grid>
              </Box>
            </>
          )}
        </Formik>
      </Card>
    </>
  )
}
