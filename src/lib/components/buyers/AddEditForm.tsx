import * as Yup from "yup"

import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input
} from "@chakra-ui/react"
import {alertService, buyerService} from "../../services"

import Card from "../card/Card"
import {Link} from "../../components/Link"
import {NextSeo} from "next-seo"
import {useForm} from "react-hook-form"
import {useRouter} from "next/router"
import {useState} from "react"
import {yupResolver} from "@hookform/resolvers/yup"

export {AddEditForm}

function AddEditForm(props) {
  const buyer = props?.buyer
  const isAddMode = !buyer
  const router = useRouter()

  // form validation rules
  const validationSchema = Yup.object().shape({
    Name: Yup.string().required("Name is required")
  })
  const formOptions = {
    resolver: yupResolver(validationSchema),
    defaultValues: {}
  }

  // set default form values if user passed in props
  if (!isAddMode) {
    const {...defaultValues} = buyer
    formOptions.defaultValues = defaultValues
  }

  // get functions to build form with useForm() hook
  const {register, handleSubmit, reset, formState} = useForm(formOptions)
  const {errors} = formState

  function onSubmit(data) {
    return isAddMode ? createBuyer(data) : updateBuyer(buyer.id, data)
  }

  function createBuyer(data) {
    return buyerService
      .create(data)
      .then(() => {
        alertService.success("Buyer added", {keepAfterRouteChange: true})
        router.push(".")
      })
      .catch(alertService.error)
  }

  function updateBuyer(id, data) {
    return buyerService
      .update(id, data)
      .then(() => {
        alertService.success("Buyer updated", {keepAfterRouteChange: true})
        router.push("..")
      })
      .catch(alertService.error)
  }

  return (
    <>
      <Container maxW="full">
        <NextSeo title="Buyers" />
        <Heading as="h2" marginTop={5}>
          <h1>{isAddMode ? "Add Buyer" : "Edit Buyer"}</h1>
        </Heading>
        <Card variant="primaryCard">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={formState.errors.Name}>
              <FormLabel htmlFor="Name">Name</FormLabel>
              <Input
                id="Name"
                placeholder="Buyer name"
                {...register("name", {
                  required: "Buyer name is required",
                  maxLength: {
                    value: 100,
                    message: "Buyer Name Maximum length should be 100"
                  }
                })}
              />
              <FormErrorMessage>
                {formState.errors.Name && formState.errors.Name.message}
              </FormErrorMessage>
            </FormControl>
            <Button type="submit" isLoading={formState.isSubmitting}>
              Save
            </Button>
            <Button
              onClick={() => reset(formOptions.defaultValues)}
              variant="secondaryButton"
              isDisabled={formState.isSubmitting}
            >
              Reset
            </Button>
            <Button
              onClick={() => router.push("/buyers")}
              variant="secondaryButton"
              isDisabled={formState.isSubmitting}
            >
              Cancel
            </Button>
          </form>
        </Card>
      </Container>
    </>
  )
}
