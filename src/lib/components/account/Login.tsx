import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Text,
  VStack
} from "@chakra-ui/react"
import {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useState
} from "react"
import {
  GetAuthenticationStatus,
  Login,
  OcAuthState
} from "../../services/ordercloud.service"

import Card from "../card/Card"
import HeaderLogo from "../branding/HeaderLogo"

interface OcLoginFormProps {
  title?: string
  onLoggedIn: () => void
}

const OcLoginForm: FunctionComponent<OcLoginFormProps> = ({
  title = "Sign into your account",
  onLoggedIn
}) => {
  const [authState, setAuthState] = useState<OcAuthState>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formValues, setFormValues] = useState({
    identifier: "",
    password: "",
    remember: false
  })

  const handleInputChange =
    (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormValues((v) => ({...v, [fieldKey]: e.target.value}))
    }

  const handleCheckboxChange =
    (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormValues((v) => ({...v, [fieldKey]: !!e.target.checked}))
    }

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      setIsLoading(true)
      e.preventDefault()
      Login(formValues.identifier, formValues.password, formValues.remember)
      setIsLoading(false)
      onLoggedIn()
    },
    [
      formValues.identifier,
      formValues.password,
      formValues.remember,
      onLoggedIn
    ]
  )

  useEffect(() => {
    var authState = GetAuthenticationStatus()
    setAuthState(authState)
    if (!authState?.isAnonymous) {
      onLoggedIn()
    }

    setIsLoading(false)
  }, [onLoggedIn])

  return (
    <>
      {authState?.isAnonymous ? (
        <form name="ocLoginForm" onSubmit={handleSubmit}>
          <Card variant="primaryCard">
            <VStack width="full" p={10}>
              <HeaderLogo />
              <Heading as="h1" py={6}>
                {title}
              </Heading>

              {/* TODO Get Errors on Login */}
              {/* {error && (
              <Alert status="error" variant="solid">
                <AlertIcon />
                {error.message}{" "}
              </Alert>
            )} */}
              <FormControl>
                <Box width="full">
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    id="identifier"
                    name="identifier"
                    placeholder="Enter username"
                    value={formValues.identifier}
                    onChange={handleInputChange("identifier")}
                    required
                  />
                </Box>
                <Box width="full">
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter password"
                    value={formValues.password}
                    onChange={handleInputChange("password")}
                    required
                  />
                </Box>

                <Box width="full">
                  <HStack>
                    <Checkbox
                      id="remember"
                      name="remember"
                      checked={formValues.remember}
                      onChange={handleCheckboxChange("remember")}
                      size="lg"
                      mx={1}
                      py={2}
                      colorScheme="brandButtons"
                    />
                    <Text>Keep me logged in</Text>
                  </HStack>
                </Box>

                <Button
                  disabled={isLoading}
                  type="submit"
                  width="full"
                  onClick={handleSubmit}
                >
                  Sign in
                </Button>
              </FormControl>
            </VStack>
          </Card>
        </form>
      ) : (
        <></>
      )}
    </>
  )
}

export default OcLoginForm
