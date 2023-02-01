import * as Yup from "yup"
import {Box, Button, ButtonGroup, Flex, Heading, List, ListIcon, ListItem, Stack} from "@chakra-ui/react"
import {InputControl, SwitchControl} from "formik-chakra-ui"
import {ErrorMessage, Field, Formik} from "formik"
import {useState} from "react"
import Card from "../card/Card"
import {MdCheckCircle} from "react-icons/md"
import {User} from "ordercloud-javascript-sdk"
import {useRouter} from "next/router"
import {usersService} from "../../api"
import {xpHelper} from "../../utils/xp.utils"
import {yupResolver} from "@hookform/resolvers/yup"
import {useSuccessToast} from "lib/hooks/useToast"

export {AddEditForm}
interface AddEditFormProps {
  user?: User
}
function AddEditForm({user}: AddEditFormProps) {
  const isAddMode = !user
  const router = useRouter()
  const successToast = useSuccessToast()
  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)
  // form validation rules
  const validationSchema = Yup.object().shape({
    Username: Yup.string().max(100).required("Name is required"),
    FirstName: Yup.string().required("First Name is required"),
    LastName: Yup.string().required("Last Name is required"),
    Email: Yup.string().email("Email is invalid").required("Email is required"),
    Password: Yup.string().required("Password is required").min(10, "Password must be at least 6 characters"),
    ConfirmPassword: Yup.string()
      .transform((x) => (x === "" ? undefined : x))
      .when("Password", (password, schema) => {
        if (password || isAddMode) return schema.required("Confirm Password is required")
      })
      .oneOf([Yup.ref("Password")], "Passwords must match")
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
    formOptions.defaultValues = xpHelper.flattenXpObject(user, "_")
  }

  function onSubmit(fields, {setStatus, setSubmitting}) {
    setStatus()
    if (isAddMode) {
      const user = xpHelper.unflattenXpObject(fields, "_")
      createUser(user, setSubmitting)
    } else {
      const user = xpHelper.unflattenXpObject(fields, "_")
      updateUser(user, setSubmitting)
    }
  }

  async function createUser(fields, setSubmitting) {
    try {
      await usersService.create(router.query.buyerid, fields)
      successToast({
        description: "User created successfully."
      })
      router.push(`/buyers/${router.query.buyerid}/users/`)
    } catch (e) {
      setSubmitting(false)
    }
  }

  async function updateUser(fields, setSubmitting) {
    try {
      await usersService.update(router.query.buyerid, router.query.userid, fields)
      successToast({
        description: "User updated successfully."
      })
      router.push(`/buyers/${router.query.buyerid}/users/`)
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
                  <InputControl name="Username" label="Username" />
                  <InputControl name="FirstName" label="First name" />
                  <InputControl name="LastName" label="Last name" />
                  <InputControl name="Email" label="Email" />
                  <InputControl name="Phone" label="Phone" />
                  <SwitchControl name="Active" label="Active" />
                  {isAddMode && (
                    <>
                      <label htmlFor="Password">Password</label>
                      <Box position="relative">
                        <Field
                          style={{width: "100%"}}
                          label="Password"
                          name="Password"
                          pr="4.5rem"
                          type={show ? "text" : "password"}
                          placeholder="Enter password"
                        />
                        <Button position="absolute" right="2px" top="2px" size="sm" onClick={handleClick}>
                          {show ? "Hide" : "Show"}
                        </Button>
                      </Box>
                      <ErrorMessage name="Password" />
                      <label htmlFor="ConfirmPassword">Confirm Password</label>
                      <Field
                        label="Confirm Password"
                        name="ConfirmPassword"
                        pr="4.5rem"
                        type={show ? "text" : "password"}
                        placeholder="Enter password"
                      />
                      <ErrorMessage name="ConfirmPassword" />
                    </>
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
                      onClick={() => router.push(`/buyers/${router.query.buyerid}/users`)}
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

      {!isAddMode && user?.AvailableRoles && (
        <>
          <Card variant="primaryCard">
            <Flex flexDirection="column" p="10">
              <Heading as="h5" size="md">
                Available Roles
              </Heading>
              <List spacing={3}>
                {user.AvailableRoles.map((role) => (
                  <ListItem key={role}>
                    <ListIcon as={MdCheckCircle} color="green.500" />
                    {role}
                  </ListItem>
                ))}
              </List>
            </Flex>
          </Card>
        </>
      )}
    </>
  )
}
