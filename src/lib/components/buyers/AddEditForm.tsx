import * as Yup from "yup"

import {
  Box,
  Button,
  ButtonGroup,
  Container,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Stack,
  Switch
} from "@chakra-ui/react"
import {ErrorMessage, Field, Form, Formik} from "formik"
import {
  InputControl,
  NumberInputControl,
  PercentComplete,
  SelectControl,
  SwitchControl
} from "formik-chakra-ui"
import {alertService, buyerService} from "../../services"

import Card from "../card/Card"
import {NextSeo} from "next-seo"
import {XpIndices} from "ordercloud-javascript-sdk"
import {flatten} from "flatten-anything"
import flattenObject from "lib/utils/flattenObject"
import {useRouter} from "next/router"
import {yupResolver} from "@hookform/resolvers/yup"

export {AddEditForm}

function AddEditForm({buyer}) {
  const isAddMode = !buyer
  const router = useRouter()

  // form validation rules
  const validationSchema = Yup.object().shape({
    Name: Yup.string().required("Name is required")
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
    formOptions.defaultValues = flattenObject(buyer, "_")
    console.log(formOptions.defaultValues)
  }

  function onSubmit(fields, {setStatus, setSubmitting}) {
    setStatus()
    if (isAddMode) {
      createBuyer(fields, setSubmitting)
    } else {
      updateBuyer(buyer.ID, fields, setSubmitting)
    }
  }

  function createBuyer(fields, setSubmitting) {
    buyerService
      .create(fields)
      .then(() => {
        alertService.success("Buyer added", {keepAfterRouteChange: true})
        router.push(".")
      })
      .catch(() => {
        setSubmitting(false)
        alertService.error
      })
  }

  function updateBuyer(id, fields, setSubmitting) {
    buyerService
      .update(id, fields)
      .then(() => {
        alertService.success("Buyer updated", {keepAfterRouteChange: true})
        router.push(".")
      })
      .catch(() => {
        setSubmitting(false)
        alertService.error
      })
  }

  return (
    <>
      <Container maxW="full">
        <NextSeo title="Buyers" />
        <Heading as="h2" marginTop={5}>
          <span>{isAddMode ? "Add Buyer" : "Edit Buyer"}</span>
        </Heading>
        <Card variant="primaryCard">
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
            }) => {
              return (
                <Box as="form" onSubmit={handleSubmit as any}>
                  <Stack spacing={5}>
                    <InputControl name="Name" label="Buyer Name" />
                    <SwitchControl name="Active" label="Active" />
                    {/* Complete this with getCatalogList one we create the catalog.service*/}
                    <SelectControl
                      name="DefaultCatalogID"
                      label="Default Catalog"
                      selectProps={{placeholder: "Select option"}}
                    >
                      <option value="PlayShop">PlayShop</option>
                      <option value="PlayShop1">catalog 2</option>
                      <option value="PlayShop2">catalog 3</option>
                    </SelectControl>
                    <NumberInputControl
                      name="xp_MarkupPercent"
                      label="Markup percent"
                    />
                    <InputControl name="xp_URL" label="Url" />

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
                      <Button type="submit" isLoading={isSubmitting}>
                        Save
                      </Button>
                      <Button
                        onClick={resetForm}
                        type="reset"
                        variant="secondaryButton"
                        isDisabled={isSubmitting}
                      >
                        Reset
                      </Button>
                      <Button
                        onClick={() => router.push("/buyers")}
                        variant="secondaryButton"
                        isDisabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    </ButtonGroup>
                  </Stack>
                </Box>
              )
            }}
          </Formik>
        </Card>
      </Container>
    </>
  )
}
