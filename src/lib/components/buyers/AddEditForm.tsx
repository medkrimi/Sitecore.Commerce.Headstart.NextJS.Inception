import * as Yup from "yup"

import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Heading,
  Stack
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
import {buyersService} from "../../api"
import {useRouter} from "next/router"
import {useToast} from "@chakra-ui/react"
import {xpHelper} from "../../utils/xp.utils"
import {yupResolver} from "@hookform/resolvers/yup"
import {Buyer} from "ordercloud-javascript-sdk"

export {AddEditForm}

interface AddEditFormProps {
  buyer?: Buyer
}
function AddEditForm({buyer}: AddEditFormProps) {
  const isAddMode = !buyer
  const router = useRouter()
  const toast = useToast()
  // form validation rules
  const validationSchema = Yup.object().shape({
    Name: Yup.string().required("Name is required"),
    xp_MarkupPercent: Yup.number()
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
    formOptions.defaultValues = xpHelper.flattenXpObject(buyer, "_")
  }

  function onSubmit(fields, {setStatus, setSubmitting}) {
    setStatus()
    if (isAddMode) {
      const buyer = xpHelper.unflattenXpObject(fields, "_")
      console.log(buyer)
      createBuyer(buyer, setSubmitting)
    } else {
      const buyer = xpHelper.unflattenXpObject(fields, "_")
      console.log(buyer)
      updateBuyer(buyer, setSubmitting)
    }
  }

  async function createBuyer(fields, setSubmitting) {
    try {
      await buyersService.create(fields)
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

  async function updateBuyer(fields, setSubmitting) {
    try {
      await buyersService.update(fields)
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
    } catch (e) {
      setSubmitting(false)
    }
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
            }) => (
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
                      onClick={() => router.push("/buyers")}
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
        </Card>
      </Container>
    </>
  )
}
