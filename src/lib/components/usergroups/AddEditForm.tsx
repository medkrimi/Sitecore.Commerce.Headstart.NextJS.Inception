import * as Yup from "yup"

import {Box, Button, ButtonGroup, Card, Flex, Stack} from "@chakra-ui/react"
import {InputControl, TextareaControl} from "formik-chakra-ui"

import {Formik} from "formik"
import {UserGroup} from "ordercloud-javascript-sdk"
import {useRouter} from "next/router"
import {useSuccessToast} from "lib/hooks/useToast"
import {xpHelper} from "../../utils/xp.utils"
import {yupResolver} from "@hookform/resolvers/yup"

export {AddEditForm}

interface AddEditFormProps {
  userGroup?: UserGroup
  ocService: any
}
function AddEditForm({userGroup, ocService}: AddEditFormProps) {
  const isAddMode = !userGroup
  const router = useRouter()
  const successToast = useSuccessToast()

  let parentId
  if (router.query.buyerid !== undefined) parentId = router.query.buyerid
  if (router.query.supplierid !== undefined) parentId = router.query.supplierid

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
      await ocService.create(parentId, fields)
      successToast({
        description: "User Group created successfully."
      })
      router.back()
    } catch (e) {
      setSubmitting(false)
    }
  }

  async function updateUserGroup(fields, setSubmitting) {
    try {
      await ocService.update(parentId, router.query.usergroupid, fields)
      successToast({
        description: "Buyer updated successfully."
      })
      router.back()
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
                  <InputControl name="Name" label="User Group Name" />
                  <TextareaControl name="Description" label="Description" />
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
                    <Button onClick={() => router.back()} variant="secondaryButton" isLoading={isSubmitting}>
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
