import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Container,
  Flex,
  HStack,
  Heading,
  Input,
  ListItem,
  OrderedList,
  Text,
  Tooltip,
  useColorModeValue
} from "@chakra-ui/react"
import {ChangeEvent, useEffect, useState} from "react"
import {CheckIcon, CloseIcon} from "@chakra-ui/icons"
import {FiCheck, FiEdit, FiX} from "react-icons/fi"
import {User, Users} from "ordercloud-javascript-sdk"

import BrandedBox from "../branding/BrandedBox"
import BrandedSpinner from "../branding/BrandedSpinner"
import {JsonLd} from "next-seo/lib/jsonld/jsonld"

type UserDataProps = {
  user: User
  buyerId: string
}

export default function UserBasicData({user, buyerId}: UserDataProps) {
  const [isEditingBasicData, setIsEditingBasicData] = useState(false)
  const okColor = useColorModeValue("okColor.800", "okColor.200")
  const errorColor = useColorModeValue("errorColor.800", "errorColor.200")
  const [expanded, setExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [componentUser, setComponentUser] = useState<User<any>>(user)
  const [formValues, setFormValues] = useState({
    username: componentUser?.Username,
    firstname: componentUser?.FirstName,
    lastname: componentUser?.LastName,
    id: componentUser?.ID,
    active: componentUser?.Active,
    datecreated: componentUser?.DateCreated,
    email: componentUser?.Email,
    locale: componentUser?.Locale,
    phone: componentUser?.Phone,
    termsaccepted: componentUser?.TermsAccepted,
    availableRoles: componentUser?.AvailableRoles
  })

  useEffect(() => {
    setComponentUser(user)
  }, [user])

  const handleInputChange = (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((v) => ({...v, [fieldKey]: e.target.value}))
  }

  const handleCheckboxChange = (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((v) => ({...v, [fieldKey]: !!e.target.checked}))
  }

  const onEditClicked = (e) => {
    setFormValues((v) => ({
      ...v,
      ["username"]: componentUser?.Username,
      ["firstname"]: componentUser?.FirstName,
      ["lastname"]: componentUser?.LastName,
      ["id"]: componentUser?.ID,
      ["active"]: componentUser?.Active,
      ["datecreated"]: componentUser?.DateCreated,
      ["email"]: componentUser?.Email,
      ["locale"]: componentUser?.Locale,
      ["phone"]: componentUser?.Phone,
      ["termsaccepted"]: componentUser?.TermsAccepted,
      ["availableRoles"]: componentUser?.AvailableRoles
    }))
    setIsEditingBasicData(true)
    setExpanded(true)
  }

  const onAbortClicked = async (e) => {
    setFormValues((v) => ({
      ...v,
      ["username"]: componentUser?.Username,
      ["firstname"]: componentUser?.FirstName,
      ["lastname"]: componentUser?.LastName,
      ["id"]: componentUser?.ID,
      ["active"]: componentUser?.Active,
      ["datecreated"]: componentUser?.DateCreated,
      ["email"]: componentUser?.Email,
      ["locale"]: componentUser?.Locale,
      ["phone"]: componentUser?.Phone,
      ["termsaccepted"]: componentUser?.TermsAccepted,
      ["availableRoles"]: componentUser?.AvailableRoles
    }))
    setIsEditingBasicData(false)
  }

  const onSaveClicked = async (e) => {
    setIsLoading(true)
    const newUser: User = {
      Username: formValues.username,
      FirstName: formValues.firstname,
      LastName: formValues.lastname,
      Active: formValues.active,
      Email: formValues.email,
      Phone: formValues.phone,
      TermsAccepted: formValues.termsaccepted
    }

    await Users.Patch(buyerId, componentUser.ID, newUser)
    var patchedUser = await Users.Get(buyerId, componentUser.ID)
    setComponentUser(patchedUser)

    setIsEditingBasicData(false)
    setIsLoading(false)
  }

  return (
    <>
      <BrandedBox isExpaned={expanded} setExpanded={setExpanded}>
        <>
          {isEditingBasicData ? (
            <HStack float={"right"}>
              <Tooltip label="Save">
                <Button colorScheme="brandButtons" aria-label="Save" onClick={onSaveClicked}>
                  <FiCheck />
                </Button>
              </Tooltip>
              <Tooltip label="Cancel">
                <Button colorScheme="brandButtons" aria-label="Cancel" onClick={onAbortClicked}>
                  <FiX />
                </Button>
              </Tooltip>
            </HStack>
          ) : (
            <HStack float={"right"}>
              <Tooltip label="Edit">
                <Button colorScheme="brandButtons" aria-label="Edit" onClick={onEditClicked}>
                  <FiEdit />
                </Button>
              </Tooltip>
            </HStack>
          )}
          {(!componentUser || isLoading) && expanded ? (
            <Box pt={6} textAlign={"center"}>
              Updating... <BrandedSpinner />
            </Box>
          ) : (
            <>
              <Heading size={{base: "md", md: "lg", lg: "xl"}} mb={expanded ? 6 : 0}>
                OrderCloud Data
              </Heading>
              <Collapse in={expanded}>
                <Flex flexDirection={{base: "column", sm: "column", md: "row"}}>
                  <Container>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Username:
                      </Text>
                      {isEditingBasicData ? (
                        <Input value={formValues.username} onChange={handleInputChange("name")} />
                      ) : (
                        <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                          {componentUser?.Username}
                        </Heading>
                      )}
                    </Box>
                    <Tooltip label={isEditingBasicData ? "ID is not changeable" : ""}>
                      <Box width="full" pb={2}>
                        <Text opacity={0.5} fontWeight={"bold"}>
                          ID:
                        </Text>
                        {isEditingBasicData ? (
                          <Input disabled={true} value={formValues.id} onChange={handleInputChange("id")} />
                        ) : (
                          <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                            {componentUser?.ID}
                          </Heading>
                        )}
                      </Box>
                    </Tooltip>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        First Name:
                      </Text>
                      {isEditingBasicData ? (
                        <Input value={formValues.firstname} onChange={handleInputChange("firstname")} />
                      ) : (
                        <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                          {componentUser?.FirstName}
                        </Heading>
                      )}
                    </Box>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Last Name:
                      </Text>
                      {isEditingBasicData ? (
                        <Input value={formValues.lastname} onChange={handleInputChange("lastname")} />
                      ) : (
                        <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                          {componentUser?.LastName ?? "Not set"}
                        </Heading>
                      )}
                    </Box>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Email:
                      </Text>
                      {isEditingBasicData ? (
                        <Input value={formValues.email} onChange={handleInputChange("email")} />
                      ) : (
                        <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                          {componentUser?.Email}
                        </Heading>
                      )}
                    </Box>
                  </Container>
                  <Container>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Phone:
                      </Text>
                      {isEditingBasicData ? (
                        <Input value={formValues.phone} onChange={handleInputChange("phone")} />
                      ) : (
                        <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                          {componentUser?.Phone ?? "Not set"}
                        </Heading>
                      )}
                    </Box>
                    <Tooltip label="Creation Date is readonly">
                      <Box width="full" pb={2}>
                        <Text opacity={0.5} fontWeight={"bold"}>
                          Date Created:
                        </Text>
                        {isEditingBasicData ? (
                          <Input
                            disabled={true}
                            value={formValues.datecreated}
                            onChange={handleInputChange("datecreated")}
                          />
                        ) : (
                          <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                            {new Date(componentUser?.DateCreated)?.toLocaleString() ?? "Not set"}
                          </Heading>
                        )}
                      </Box>
                    </Tooltip>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Terms Accepted:
                      </Text>
                      {isEditingBasicData ? (
                        <Input
                          type="datetime-local"
                          value={formValues.termsaccepted}
                          onChange={handleInputChange("termsaccepted")}
                        />
                      ) : (
                        <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                          {new Date(componentUser?.TermsAccepted)?.toLocaleString() ?? "Not set"}
                        </Heading>
                      )}
                    </Box>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Active?:
                      </Text>
                      {isEditingBasicData ? (
                        <Checkbox isChecked={formValues.active} onChange={handleCheckboxChange("active")} />
                      ) : (
                        <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                          {componentUser?.Active ?? false ? (
                            <CheckIcon boxSize={6} color={okColor} />
                          ) : (
                            <CloseIcon boxSize={6} color={errorColor} />
                          )}
                        </Heading>
                      )}
                    </Box>
                  </Container>
                  <Container>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Available Roles:
                      </Text>

                      <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                        <OrderedList>
                          {componentUser?.AvailableRoles.map((element, index) => {
                            return (
                              <ListItem mt={4} key={index}>
                                {element}
                              </ListItem>
                            )
                          })}
                        </OrderedList>
                      </Heading>
                    </Box>
                  </Container>
                </Flex>
              </Collapse>
            </>
          )}
        </>
      </BrandedBox>
    </>
  )
}
