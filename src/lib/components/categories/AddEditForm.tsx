import * as Yup from "yup"
import {Box, Button, ButtonGroup, Flex, HStack, Stack, Heading} from "@chakra-ui/react"
import {Category} from "ordercloud-javascript-sdk"
import {InputControl, SwitchControl, TextareaControl} from "formik-chakra-ui"
import {Formik} from "formik"
import {categoriesService} from "lib/api"
import {useRouter} from "next/router"
import {xpHelper} from "lib/utils/xp.utils"
import {yupResolver} from "@hookform/resolvers/yup"
import {useErrorToast, useSuccessToast} from "lib/hooks/useToast"
import {useEffect} from "react"

export {AddEditForm}

interface AddEditFormProps {
  category?: Category
  headerComponent?: React.ReactNode
  parentId?: string
  onSuccess?: (category: Category) => void
}
function AddEditForm({category, headerComponent, parentId, onSuccess}: AddEditFormProps) {
  const isCreating = !category
  const router = useRouter()
  const successToast = useSuccessToast()
  const errorToast = useErrorToast()

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
  if (!isCreating) {
    formOptions.defaultValues = xpHelper.flattenXpObject(category, "_")
    console.log(JSON.stringify(formOptions.defaultValues))
  }

  useEffect(() => {
    formOptions.defaultValues = xpHelper.flattenXpObject(category, "_")
  }, [category?.ID])

  async function onSubmit(fields, {setStatus, setSubmitting}) {
    setStatus()
    if (isCreating) {
      const category = xpHelper.unflattenXpObject(fields, "_")
      await createCategory(category, setSubmitting)
    } else {
      const category = xpHelper.unflattenXpObject(fields, "_")
      await updateCategory(category, setSubmitting)
    }

    if (onSuccess) {
      onSuccess(category)
    }
  }

  async function createCategory(fields, setSubmitting) {
    try {
      fields.ParentID = parentId
      const createdCatalog = await categoriesService.create(router.query.catalogid, fields)
      await categoriesService.saveAssignment(
        router.query.catalogid,
        createdCatalog.ID,
        router.query.buyerid,
        router.query.usergroupid
      )
      successToast({
        description: "Category created successfully."
      })
      router.push(`/buyers/${router.query.buyerid}/catalogs/${router.query.catalogid}/categories`)
    } catch (e) {
      setSubmitting(false)
    }
  }

  async function updateCategory(fields, setSubmitting) {
    try {
      const updatedCatalog = await categoriesService.update(router.query.catalogid, fields)
      await categoriesService.saveAssignment(
        router.query.catalogid,
        updatedCatalog.ID,
        router.query.buyerid,
        router.query.usergroupid
      )
      successToast({
        description: "Category updated successfully."
      })
      router.push(`/buyers/${router.query.buyerid}/catalogs/${router.query.catalogid}/categories`)
    } catch (e) {
      setSubmitting(false)
    }
  }

  async function deleteCategory(categoryid) {
    try {
      await categoriesService.delete(router.query.catalogid, categoryid)
      successToast({
        description: "Category deleted successfully."
      })
    } catch (e) {
      errorToast({
        description: "Category delete failed"
      })
    }
    if (onSuccess) {
      onSuccess(category)
    }
  }

  return (
    <>
      <Box
        borderRadius="xl"
        border="1px"
        borderColor="gray.200"
        pt="2"
        pb="2"
        mb="6"
        w="100%"
        width="full"
        position="relative"
        _hover={{
          textDecoration: "none",
          borderRadius: "10px"
        }}
      >
        {headerComponent}
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
                  <SwitchControl name="Active" label="Active" colorScheme="teal" size="lg" />
                  <ButtonGroup>
                    <HStack justifyContent="space-between" w="100%" mb={5}>
                      <Box>
                        <Button variant="primaryButton" type="submit" isLoading={isSubmitting} mr="15px">
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
                          onClick={() =>
                            router.push(`/buyers/${router.query.buyerid}/catalogs/${router.query.catalogid}/categories`)
                          }
                          variant="secondaryButton"
                          isLoading={isSubmitting}
                          mr="15px"
                        >
                          Cancel
                        </Button>
                      </Box>
                      {!isCreating && (
                        <Button variant="secondaryButton" onClick={() => deleteCategory(values.ID)}>
                          Delete
                        </Button>
                      )}
                    </HStack>
                  </ButtonGroup>
                </Stack>
              </Box>
            )}
          </Formik>
        </Flex>
      </Box>
    </>
  )
}
