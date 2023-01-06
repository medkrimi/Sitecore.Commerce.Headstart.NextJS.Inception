import * as Yup from "yup"

import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormLabel,
  HStack,
  Icon,
  Input,
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
import {Field, Formik} from "formik"
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
    xp_Options: Yup.string()
  })

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
    //TODO Map xp Options to the setItems list
  }

  function onSubmit(fields, {setStatus, setSubmitting}) {
    setStatus()
    //console.log(fields)
    //TODO Refactor this to use the Form instead of this loop
    fields.xp_Options = items.map((item) => {
      return item.itemName
    })
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
  async function deleteProductFacets() {
    try {
      await productfacetsService.delete(router.query.id)
      router.push(".")
      toast({
        id: router.query.id + "-deleted",
        title: "Success",
        description: "Product Facet deleted successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top"
      })
    } catch (e) {
      toast({
        id: router.query.id + "fail-deleted",
        title: "Error",
        description: "Product Facet delete failed",
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
                  {/* <Input
                    name="xp"
                    value={items}
                    onChange={(event) => setInputValue(event.target.value)}
                  /> */}
                  <InputControl name="Name" label="Product Facet Name" />
                  <FormLabel>
                    Facet Options :
                    <Text fontSize="sm">
                      Create options for this facet group?
                    </Text>
                  </FormLabel>
                  <Box id="facetlist" mt="GlobalPadding" mb="40px">
                    <HStack className="item-list">
                      {items.map((item, index) => (
                        <Box className="item-container" key={index}>
                          <div className="item-name">
                            {
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
                            }
                          </div>
                        </Box>
                      ))}
                    </HStack>
                  </Box>
                  <Box position="relative" className="facet-input">
                    <Field name="xp_Options">
                      {({
                        field, // { name, value, onChange, onBlur }
                        form: {touched, errors}, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                        meta
                      }) => (
                        <div>
                          <input
                            type="text"
                            value={inputValue}
                            onChange={(event) =>
                              setInputValue(event.target.value)
                            }
                            className="add-item-input"
                            placeholder="Add a facet value..."
                          />
                          {meta.touched && meta.error && (
                            <div className="error">{meta.error}</div>
                          )}
                        </div>
                      )}
                    </Field>
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
                  <ButtonGroup>
                    <HStack justifyContent="space-between" w="100%" mb={5}>
                      <Box>
                        <Button
                          variant="primaryButton"
                          type="submit"
                          isLoading={isSubmitting}
                          mr="15px"
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
                          mr="15px"
                        >
                          Reset
                        </Button>
                        <Button
                          onClick={() => router.push("/settings/productfacets")}
                          variant="secondaryButton"
                          isLoading={isSubmitting}
                          mr="15px"
                        >
                          Cancel
                        </Button>
                      </Box>
                      <Button
                        onClick={() => deleteProductFacets()}
                        variant="secondaryButton"
                        isLoading={isSubmitting}
                        hidden={isAddMode}
                      >
                        Delete
                      </Button>
                    </HStack>
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
