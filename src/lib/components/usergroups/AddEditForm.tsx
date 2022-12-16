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
  SwitchControl,
  TextareaControl
} from "formik-chakra-ui"

import Card from "../card/Card"
import {Formik} from "formik"
import {NextSeo} from "next-seo"
import {useRouter} from "next/router"
import {useToast} from "@chakra-ui/react"
import {userGroupsService} from "../../api"
import {xpHelper} from "../../utils/xp.utils"
import {yupResolver} from "@hookform/resolvers/yup"

export {AddEditForm}

function AddEditForm({userGroup}) {
  const isAddMode = !userGroup
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
    formOptions.defaultValues = xpHelper.flattenXpObject(userGroup, "_")
  }

  function onSubmit(fields, {setStatus, setSubmitting}) {
    setStatus()
    if (isAddMode) {
      const userGroup = xpHelper.unflattenXpObject(fields, "_")
      createUserGroup(userGroup, setSubmitting)
    } else {
      const userGroup = xpHelper.unflattenXpObject(fields, "_")
      updateUserGroup(userGroup, setSubmitting)
    }
  }

  async function createUserGroup(fields, setSubmitting) {
    try {
      await userGroupsService.create(router.query.buyerid, fields)
      toast({
        id: fields.ID + "-created",
        title: "Success",
        description: "User Group created successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top"
      })
      router.push(`/buyers/${router.query.buyerid}/usergroups/`)
    } catch (e) {
      setSubmitting(false)
    }
  }

  async function updateUserGroup(fields, setSubmitting) {
    try {
      await userGroupsService.update(
        router.query.buyerid,
        router.query.usergroupid,
        fields
      )
      toast({
        id: fields.ID + "-updated",
        title: "Success",
        description: "Buyer updated successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top"
      })
      router.push(`/buyers/${router.query.buyerid}/usergroups/`)
    } catch (e) {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Container maxW="full">
        <NextSeo title="User Groups" />
        <Heading as="h2" marginTop={5}>
          <span>{isAddMode ? "Add User Group" : "Edit User Group"}</span>
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
                  <InputControl name="Name" label="User Group Name" />
                  <TextareaControl name="Description" label="Description" />
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
                          `/buyers/${router.query.buyerid}/usersgroups`
                        )
                      }
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
