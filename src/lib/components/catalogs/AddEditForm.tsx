import * as Yup from "yup"

import {Box, Button, ButtonGroup, Container, Flex, Heading, Stack} from "@chakra-ui/react"
import {
  InputControl,
  NumberInputControl,
  PercentComplete,
  SelectControl,
  SwitchControl,
  TextareaControl
} from "formik-chakra-ui"

import Card from "../card/Card"
import {Catalog} from "ordercloud-javascript-sdk"
import {Formik} from "formik"
import {catalogsService} from "lib/api"
import {useRouter} from "next/router"
import {useToast} from "@chakra-ui/react"
import {xpHelper} from "lib/utils/xp.utils"
import {yupResolver} from "@hookform/resolvers/yup"

export {AddEditForm}

interface AddEditFormProps {
  catalog?: Catalog
}
function AddEditForm({catalog}: AddEditFormProps) {
  const isAddMode = !catalog
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
    formOptions.defaultValues = xpHelper.flattenXpObject(catalog, "_")
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
      const createdCatalog = await catalogsService.create(fields)
      await catalogsService.saveAssignment(router.query.buyerid, createdCatalog.ID)
      toast({
        id: fields.ID + "-created",
        title: "Success",
        description: "Catalog created successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top"
      })
      router.push(`/buyers/${router.query.buyerid}/catalogs`)
    } catch (e) {
      setSubmitting(false)
    }
  }

  async function updateCatalog(fields, setSubmitting) {
    try {
      const updatedCatalog = await catalogsService.update(fields)
      await catalogsService.saveAssignment(router.query.buyerid, updatedCatalog.ID)
      toast({
        id: fields.ID + "-updated",
        title: "Success",
        description: "Catalog updated successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top"
      })
      router.push(`/buyers/${router.query.buyerid}/catalogs`)
    } catch (e) {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Card variant="primaryCard">
        <Flex flexDirection="column" p="10">
          <Formik initialValues={formOptions.defaultValues} validationSchema={validationSchema} onSubmit={onSubmit}>
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
                  <InputControl name="Name" label="Catalog Name" />
                  <TextareaControl name="Description" label="Description" />
                  <SwitchControl name="Active" label="Active" />
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
                      onClick={() => router.push(`/buyers/${router.query.buyerid}/catalogs`)}
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
