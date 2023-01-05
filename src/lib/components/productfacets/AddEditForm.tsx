import * as Yup from "yup"

import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormLabel,
  HStack,
  Icon,
  Stack,
  Text
} from "@chakra-ui/react"
import {
  InputControl,
  NumberInputControl,
  PercentComplete,
  SelectControl,
  SwitchControl
} from "formik-chakra-ui"

import {ProductFacet} from "ordercloud-javascript-sdk"
import Card from "../card/Card"
import {Formik} from "formik"
import {useRouter} from "next/router"
import {useToast} from "@chakra-ui/react"
import {xpHelper} from "../../utils/xp.utils"
import {yupResolver} from "@hookform/resolvers/yup"
import {productfacetsService} from "lib/api/productfacets"
import {useState} from "react"
import {HiOutlineSparkles, HiOutlineX} from "react-icons/hi"

export {AddEditForm}

interface AddEditFormProps {
  productfacet?: ProductFacet
}

function AddEditForm({productfacet}: AddEditFormProps) {
  const isAddMode = !productfacet
  //console.log(isAddMode)
  const router = useRouter()
  const toast = useToast()
  // form validation rules
  const validationSchema = Yup.object().shape({
    Name: Yup.string().required("Name is required"),
    xp_MarkupPercent: Yup.number()
  })

  const productFacetsList = []
  const [inputValue, setInputValue] = useState("")
  const [items, setItems] = useState([])

  const formOptions = {
    resolver: yupResolver(validationSchema, {
      stripUnknown: true,
      abortEarly: false
    }),
    defaultValues: {}
  }

  // set default form values if user passed in props
  if (!isAddMode) {
    formOptions.defaultValues = xpHelper.flattenXpObject(productfacet, "_")
  }

  function onSubmit(fields, {setStatus, setSubmitting}) {
    setStatus()
    if (isAddMode) {
      const productfacet = xpHelper.unflattenXpObject(fields, "_")
      createProductFacet(productfacet, setSubmitting)
    } else {
      const productfacet = xpHelper.unflattenXpObject(fields, "_")
      updateProductFacet(productfacet, setSubmitting)
    }
  }

  const handleAddButtonClick = () => {
    const newItem = {
      itemName: inputValue
    }
    const newItems = [...items, newItem]
    setItems(newItems)
    setInputValue("")
  }
  const removeItem = (index) => {
    setItems((oldValues) => {
      return oldValues.filter((_, i) => i !== index)
    })
  }

  async function createProductFacet(fields, setSubmitting) {
    try {
      await productfacetsService.create(fields)
      toast({
        id: fields.ID + "-created",
        title: "Success",
        description: "Product Facet created successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top"
      })
      router.push(".")
    } catch (e) {
      setSubmitting(false)
    }
  }

  async function updateProductFacet(fields, setSubmitting) {
    try {
      await productfacetsService.update(fields)
      toast({
        id: fields.ID + "-updated",
        title: "Success",
        description: "Product Facet updated successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top"
      })
      router.push(".")
    } catch (e) {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Card variant="primaryCard">
        <Flex flexDirection="column" p="10">
          <Formik
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
              <Box as="form" onSubmit={handleSubmit as any}>
                <Stack spacing={5}>
                  <InputControl name="Name" label="Product Facet Name" />
                  <InputControl name="XpPath" label="XpPath" />
                  <InputControl name="ListOrder" label="ListOrder" />
                  <InputControl name="MinCount" label="MinCount" />
                  <FormLabel>
                    Facet Options :
                    <Text fontSize="sm">
                      Create options for this facet group?
                    </Text>
                  </FormLabel>

                  <Box id="facetlist" mt="20px" mb="40px">
                    <HStack className="item-list">
                      {items.map((item, index) => (
                        <Box className="item-container" key={index}>
                          <div className="item-name">
                            {item.isSelected ? (
                              <>
                                <Box
                                  className="completed"
                                  border="1px"
                                  borderColor="lightGray"
                                  pt="10px"
                                  pb="10px"
                                  pr="10px"
                                  pl="30px"
                                  position="relative"
                                  borderRadius="md"
                                >
                                  <Icon
                                    as={HiOutlineX}
                                    mr="10px"
                                    ml="10px"
                                    position="absolute"
                                    left="0px"
                                    top="14px"
                                    cursor="pointer"
                                    onClick={() => removeItem(index)}
                                  />
                                  {item.itemName}
                                </Box>
                              </>
                            ) : (
                              <>
                                <Box
                                  border="1px"
                                  borderColor="lightGray"
                                  pt="10px"
                                  pb="10px"
                                  pr="10px"
                                  pl="30px"
                                  position="relative"
                                  borderRadius="md"
                                >
                                  <Icon
                                    as={HiOutlineX}
                                    mr="10px"
                                    ml="10px"
                                    position="absolute"
                                    left="0px"
                                    top="14px"
                                    cursor="pointer"
                                    onClick={() => removeItem(index)}
                                  />
                                  {item.itemName}
                                </Box>
                              </>
                            )}
                          </div>
                        </Box>
                      ))}
                    </HStack>
                  </Box>
                  <Box position="relative" className="facet-input">
                    <input
                      value={inputValue}
                      onChange={(event) => setInputValue(event.target.value)}
                      className="add-item-input"
                      placeholder="Add a facet value..."
                    />
                    <Button
                      position="absolute"
                      right="0"
                      top="0"
                      onClick={() => {
                        handleAddButtonClick()
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                  {isAddMode ? (
                    <PercentComplete />
                  ) : (
                    <InputControl
                      name="DateCreated"
                      label="Date created"
                      isReadOnly
                    />
                  )}
                  <ButtonGroup>
                    <Button
                      variant="primaryButton"
                      type="submit"
                      isLoading={isSubmitting}
                    >
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
                      onClick={() => router.push("/settings/productfacets")}
                      variant="secondaryButton"
                      isLoading={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </ButtonGroup>
                </Stack>
              </Box>
            )}
          </Formik>
        </Flex>
      </Card>
    </>
  )
}
