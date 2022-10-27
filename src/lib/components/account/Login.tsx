import {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useState
} from "react"
import login from "../../redux/ocAuth/login"
import {useOcDispatch, useOcSelector} from "../../redux/ocStore"
import {
  Button,
  VStack,
  HStack,
  Input,
  Text,
  Heading,
  Box,
  useColorMode,
  useColorModeValue,
  Checkbox,
  Alert,
  AlertIcon
} from "@chakra-ui/react"
import HeaderLogo from "../branding/HeaderLogo"

interface OcLoginFormProps {
  title?: string
  onLoggedIn: () => void
}

const OcLoginForm: FunctionComponent<OcLoginFormProps> = ({
  title = "Sign into your account",
  onLoggedIn
}) => {
  const dispatch = useOcDispatch()

  const {loading, error, isAnonymous} = useOcSelector((s) => ({
    isAnonymous: s.ocAuth.isAnonymous,
    error: s.ocAuth.error,
    loading: s.ocAuth.loading
  }))

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
      e.preventDefault()
      dispatch(
        login({
          username: formValues.identifier,
          password: formValues.password,
          remember: formValues.remember
        })
      )
    },
    [formValues, dispatch]
  )

  useEffect(() => {
    if (!isAnonymous) {
      onLoggedIn()
    }
  }, [isAnonymous, onLoggedIn])

  const {colorMode, toggleColorMode} = useColorMode()
  const bg = useColorModeValue("gray.400", "gray.600")
  const color = useColorModeValue("textColor.900", "textColor.100")

  return (
    <>
      {isAnonymous ? (
        <form name="ocLoginForm" onSubmit={handleSubmit}>
          <VStack width="full" bg={bg} color={color} p={10} rounded={10}>
            <HeaderLogo />
            <Heading as="h1" py={6}>
              {title}
            </Heading>

            {error && (
              <Alert status="error" variant="solid">
                <AlertIcon />
                {error.message}{" "}
              </Alert>
            )}

            <Box width="full">
              <Text fontWeight={"bold"}>Username</Text>
              <Input
                type="text"
                id="identifier"
                name="identifier"
                placeholder="Enter username"
                value={formValues.identifier}
                onChange={handleInputChange("identifier")}
                required
                size="md"
              />
            </Box>
            <Box width="full">
              <Text fontWeight={"bold"}>Password</Text>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="Enter password"
                value={formValues.password}
                onChange={handleInputChange("password")}
                required
                size="md"
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
              disabled={loading}
              type="submit"
              colorScheme="brandButtons"
              width="full"
            >
              Sign in
            </Button>
          </VStack>
        </form>
      ) : (
        <></>
      )}
    </>
  )
}

export default OcLoginForm
