import {CheckIcon, CloseIcon} from "@chakra-ui/icons"
import {
  Box,
  Button,
  Heading,
  HStack,
  Tooltip,
  useColorModeValue,
  Text,
  Container,
  Flex,
  Collapse,
  Input,
  Checkbox,
  useToast,
  ListItem,
  UnorderedList,
  OrderedList,
  color,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react"
import {
  getGuestContext,
  getGuestRefByEmail,
  CdpGuestModel
} from "lib/scripts/CDPService"
import {JsonLd} from "next-seo/lib/jsonld/jsonld"
import Link from "next/link"
import {User, Users} from "ordercloud-javascript-sdk"
import {ChangeEvent, useEffect, useState} from "react"
import {FiCheck, FiEdit, FiX} from "react-icons/fi"
import BrandedBox from "../branding/BrandedBox"
import BrandedSpinner from "../branding/BrandedSpinner"
import BrandedTable from "../branding/BrandedTable"

type UserDataProps = {
  user: User
  buyerId: string
  cdpGuest: CdpGuestModel
}

export default function UserCdpData({user, buyerId, cdpGuest}: UserDataProps) {
  const [isEditingBasicData, setIsEditingBasicData] = useState(false)
  const okColor = useColorModeValue("okColor.800", "okColor.200")
  const errorColor = useColorModeValue("errorColor.800", "errorColor.200")
  const [expanded, setExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [componentUser, setComponentUser] = useState<User<any>>(user)
  const [cdpGuestData, setCdpGuestData] = useState<CdpGuestModel>(null)
  const color = useColorModeValue("textColor.900", "textColor.100")

  useEffect(() => {
    setComponentUser(user)
    setCdpGuestData(cdpGuest)
  }, [user, cdpGuest])

  return (
    <>
      <BrandedBox isExpaned={expanded} setExpanded={setExpanded}>
        <>
          {(!componentUser || isLoading) && expanded ? (
            <Box pt={6} textAlign={"center"}>
              Updating... <BrandedSpinner />
            </Box>
          ) : (
            <>
              <Heading
                size={{base: "md", md: "lg", lg: "xl"}}
                mb={expanded ? 6 : 0}
              >
                CDP Data
              </Heading>
              <Collapse in={expanded}>
                <Flex flexDirection={{base: "column", sm: "column", md: "row"}}>
                  <Container>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        First Name:
                      </Text>

                      <Heading
                        fontSize={"xl"}
                        fontFamily={"body"}
                        fontWeight={500}
                      >
                        <>{cdpGuestData?.firstName}</>
                      </Heading>
                    </Box>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Last Name:
                      </Text>

                      <Heading
                        fontSize={"xl"}
                        fontFamily={"body"}
                        fontWeight={500}
                      >
                        <>{cdpGuestData?.lastName}</>
                      </Heading>
                    </Box>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Email:
                      </Text>

                      <Heading
                        fontSize={"xl"}
                        fontFamily={"body"}
                        fontWeight={500}
                      >
                        <>{cdpGuestData?.email}</>
                      </Heading>
                    </Box>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Gender:
                      </Text>

                      <Heading
                        fontSize={"xl"}
                        fontFamily={"body"}
                        fontWeight={500}
                      >
                        <>{cdpGuestData?.gender}</>
                      </Heading>
                    </Box>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Language:
                      </Text>
                      <Heading
                        fontSize={"xl"}
                        fontFamily={"body"}
                        fontWeight={500}
                      >
                        {cdpGuestData?.language}
                      </Heading>
                    </Box>
                  </Container>
                  <Container>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Date of Birth:
                      </Text>

                      <Heading
                        fontSize={"xl"}
                        fontFamily={"body"}
                        fontWeight={500}
                      >
                        {new Date(
                          cdpGuestData?.dateOfBirth
                        )?.toLocaleString() ?? "Not set"}
                      </Heading>
                    </Box>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        First seen:
                      </Text>

                      <Heading
                        fontSize={"xl"}
                        fontFamily={"body"}
                        fontWeight={500}
                      >
                        {new Date(cdpGuestData?.firstSeen)?.toLocaleString() ??
                          "Not set"}
                      </Heading>
                    </Box>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Last seen:
                      </Text>

                      <Heading
                        fontSize={"xl"}
                        fontFamily={"body"}
                        fontWeight={500}
                      >
                        {new Date(cdpGuestData?.lastSeen)?.toLocaleString() ??
                          "Not set"}
                      </Heading>
                    </Box>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Modified at:
                      </Text>

                      <Heading
                        fontSize={"xl"}
                        fontFamily={"body"}
                        fontWeight={500}
                      >
                        {new Date(cdpGuestData?.modifiedAt)?.toLocaleString() ??
                          "Not set"}
                      </Heading>
                    </Box>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        CDP Guest ID:
                      </Text>

                      <Heading
                        fontSize={"xl"}
                        fontFamily={"body"}
                        fontWeight={500}
                      >
                        <Link
                          href={
                            "https://app.boxever.com/#/guests/" +
                            cdpGuestData?.ref
                          }
                        >
                          <a target={"_blank"}>{cdpGuestData?.ref}</a>
                        </Link>
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
