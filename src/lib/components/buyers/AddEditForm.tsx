import * as Yup from "yup"

import {Button, Container, Heading} from "@chakra-ui/react"
import {alertService, buyerService} from "../../services"

import Card from "../card/Card"
import {NextSeo} from "next-seo"
import {useForm} from "react-hook-form"
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
    formOptions.defaultValues = buyer
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
          <span>{isAddMode ? "Add Buyer" : "Edit Buyer"}</span>
        </Heading>
        <Card variant="primaryCard">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group col-5">
              <label>Name</label>
              <input name="Name" type="text" {...register("Name")} />
              <div className="invalid-feedback">{errors.Name?.message}</div>
            </div>
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
