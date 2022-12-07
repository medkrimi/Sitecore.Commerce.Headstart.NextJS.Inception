import * as Yup from "yup"

import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Heading,
  Stack,
  createStandaloneToast
} from "@chakra-ui/react"
import {
  InputControl,
  NumberInputControl,
  PercentComplete,
  SelectControl,
  SwitchControl
} from "formik-chakra-ui"

import Card from "../card/Card"
import {Formik} from "formik"
import {NextSeo} from "next-seo"
import {buyerService} from "../../services"
import flattenObject from "lib/utils/flattenObject"
import theme from "../../styles/theme/sitecorecommerce/"
import {useRouter} from "next/router"
import {yupResolver} from "@hookform/resolvers/yup"

const {toast} = createStandaloneToast({theme})

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
      updateBuyer(fields, setSubmitting)
    }
  }

  async function createBuyer(fields, setSubmitting) {
    try {
      await buyerService.create(fields)
      toast({
        id: fields.ID + "-created",
        title: "Success",
        description: "Buyer created successfully.",
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

  function updateBuyer(fields, setSubmitting) {
    buyerService.update(fields).then(() => {
      toast({
        id: fields.ID + "-updated",
        title: "Success",
        description: "Buyer updated successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top"
      })
      router.push(".")
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
