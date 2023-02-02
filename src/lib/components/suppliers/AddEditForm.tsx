import * as Yup from "yup"

import {Box, Button, ButtonGroup, Flex, Stack} from "@chakra-ui/react"
import {InputControl, NumberInputControl, PercentComplete, SelectControl, SwitchControl} from "formik-chakra-ui"

import Card from "../card/Card"
import {Formik} from "formik"
import {Supplier} from "ordercloud-javascript-sdk"
import {suppliersService} from "../../api"
import {useRouter} from "next/router"
import {useToast} from "@chakra-ui/react"
import {xpHelper} from "../../utils/xp.utils"
import {yupResolver} from "@hookform/resolvers/yup"

export {AddEditForm}

interface AddEditFormProps {
  supplier?: Supplier
}

function AddEditForm({supplier}: AddEditFormProps) {
  const isAddMode = !supplier
  const router = useRouter()
  const toast = useToast()
  // form validation rules
  const validationSchema = Yup.object().shape({
    Name: Yup.string().required("Name is required"),
    Active: Yup.bool(),
    AllBuyersCanOrder: Yup.bool()
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
    formOptions.defaultValues = xpHelper.flattenXpObject(supplier, "_")
  }

  function onSubmit(fields, {setStatus, setSubmitting}) {
    setStatus()
    if (isAddMode) {
      const supplier = xpHelper.unflattenXpObject(fields, "_")
      createSupplier(supplier, setSubmitting)
    } else {
      const supplier = xpHelper.unflattenXpObject(fields, "_")
      updateSupplier(supplier, setSubmitting)
    }
  }

  async function createSupplier(fields, setSubmitting) {
    try {
      await suppliersService.create(fields)
      toast({
        id: fields.ID + "-created",
        title: "Success",
        description: "Supplier created successfully.",
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

  async function updateSupplier(fields, setSubmitting) {
    try {
      await suppliersService.update(fields)
      toast({
        id: fields.ID + "-updated",
        title: "Success",
        description: "Supplier updated successfully.",
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
                  <InputControl name="Name" label="Supplier Name" />
                  <SwitchControl name="Active" label="Active" />
                  <SwitchControl name="AllBuyersCanOrder" label="All Buyers Can Order" />
                  {isAddMode ? (
                    <PercentComplete />
                  ) : (
                    <InputControl name="DateCreated" label="Date created" isReadOnly />
                  )}
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
                      onClick={() => router.push("/suppliers")}
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
