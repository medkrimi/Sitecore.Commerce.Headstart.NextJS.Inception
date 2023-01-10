import * as Yup from "yup"

import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  Heading,
  Link,
  Stack
} from "@chakra-ui/react"
import {Catalog, Category} from "ordercloud-javascript-sdk"
import {
  InputControl,
  NumberInputControl,
  PercentComplete,
  SelectControl,
  SwitchControl,
  TextareaControl
} from "formik-chakra-ui"

import Card from "../card/Card"
import {DeleteIcon} from "@chakra-ui/icons"
import {Formik} from "formik"
import {categoriesService} from "lib/api"
import {useRouter} from "next/router"
import {useToast} from "@chakra-ui/react"
import {xpHelper} from "lib/utils/xp.utils"
import {yupResolver} from "@hookform/resolvers/yup"

export {AddEditForm}

interface AddEditFormProps {
  category?: Category
}
function AddEditForm({category}: AddEditFormProps) {
  const isAddMode = !category
  console.log(category)
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
    formOptions.defaultValues = xpHelper.flattenXpObject(category, "_")
  }

  function onSubmit(fields, {setStatus, setSubmitting}) {
    setStatus()
    if (isAddMode) {
      const catalog = xpHelper.unflattenXpObject(fields, "_")
      createCatalog(catalog, setSubmitting)
    } else {
      const catalog = xpHelper.unflattenXpObject(fields, "_")
      updateCatalog(catalog, setSubmitting)
    }
  }

  async function createCatalog(fields, setSubmitting) {
    try {
      const createdCatalog = await categoriesService.create(
        router.query.catalogid,
        fields
      )
      await categoriesService.saveAssignment(
        router.query.catalogid,
        createdCatalog.ID,
        router.query.buyerid,
        router.query.usergroupid
      )
      toast({
        id: fields.ID + "-created",
        title: "Success",
        description: "Category created successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top"
      })
      router.push(
        `/buyers/${router.query.buyerid}/catalogs/${router.query.catalogid}/categories`
      )
    } catch (e) {
      setSubmitting(false)
    }
  }

  async function updateCatalog(fields, setSubmitting) {
    try {
      const updatedCatalog = await categoriesService.update(
        router.query.catalogid,
        fields
      )
      await categoriesService.saveAssignment(
        router.query.catalogid,
        updatedCatalog.ID,
        router.query.buyerid,
        router.query.usergroupid
      )
      toast({
        id: fields.ID + "-updated",
        title: "Success",
        description: "Category updated successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top"
      })
      router.push(
        `/buyers/${router.query.buyerid}/catalogs/${router.query.catalogid}/categories`
      )
    } catch (e) {
      setSubmitting(false)
    }
  }

  async function deleteCategory(categoryid) {
    try {
      await categoriesService.delete(router.query.catalogid, categoryid)
      toast({
        id: categoryid + "-deleted",
        title: "Success",
        description: "Category deleted successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top"
      })
    } catch (e) {
      toast({
        id: categoryid + "fail-deleted",
        title: "Error",
        description: "Category delete failed",
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
              <Box as="form" onSubmit={handleSubmit as any}>
                <Stack spacing={5}>
                  <InputControl name="Name" label="Category Name" />
                  <TextareaControl name="Description" label="Description" />
                  <SwitchControl name="Active" label="Active" />
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
                      onClick={() =>
                        router.push(
                          `/buyers/${router.query.buyerid}/catalogs/${router.query.catalogid}/categories`
                        )
                      }
                      variant="secondaryButton"
                      isLoading={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="secondaryButton"
                      onClick={() => deleteCategory(values.ID)}
                      leftIcon={<DeleteIcon />}
                    >
                      Delete
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
