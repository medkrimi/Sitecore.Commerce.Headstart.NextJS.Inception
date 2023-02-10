import {Box, Collapse, Container, Flex, Heading, Text} from "@chakra-ui/react"
import {useEffect, useState} from "react"

import BrandedBox from "../branding/BrandedBox"
import BrandedSpinner from "../branding/BrandedSpinner"
import {CdpGuestModel} from "../../services/cdp.service"
import Link from "next/link"
import {User} from "ordercloud-javascript-sdk"

type UserDataProps = {
  user: User
  buyerId: string
  cdpGuest: CdpGuestModel
}

export default function UserCdpData({user, cdpGuest}: UserDataProps) {
  const [expanded, setExpanded] = useState(false)
  const [isLoading] = useState(false)
  const [componentUser, setComponentUser] = useState<User<any>>(user)
  const [cdpGuestData, setCdpGuestData] = useState<CdpGuestModel>(null)

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
              <Heading size={{base: "md", md: "lg", lg: "xl"}} mb={expanded ? 6 : 0}>
                CDP Data
              </Heading>
              <Collapse in={expanded}>
                <Flex flexDirection={{base: "column", sm: "column", md: "row"}}>
                  <Container>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        First Name:
                      </Text>

                      <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                        <>{cdpGuestData?.firstName}</>
                      </Heading>
                    </Box>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Last Name:
                      </Text>

                      <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                        <>{cdpGuestData?.lastName}</>
                      </Heading>
                    </Box>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Email:
                      </Text>

                      <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                        <>{cdpGuestData?.email}</>
                      </Heading>
                    </Box>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Gender:
                      </Text>

                      <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                        <>{cdpGuestData?.gender}</>
                      </Heading>
                    </Box>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Language:
                      </Text>
                      <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                        {cdpGuestData?.language}
                      </Heading>
                    </Box>
                  </Container>
                  <Container>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Date of Birth:
                      </Text>

                      <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                        {new Date(cdpGuestData?.dateOfBirth)?.toLocaleString() ?? "Not set"}
                      </Heading>
                    </Box>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        First seen:
                      </Text>

                      <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                        {new Date(cdpGuestData?.firstSeen)?.toLocaleString() ?? "Not set"}
                      </Heading>
                    </Box>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Last seen:
                      </Text>

                      <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                        {new Date(cdpGuestData?.lastSeen)?.toLocaleString() ?? "Not set"}
                      </Heading>
                    </Box>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Modified at:
                      </Text>

                      <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                        {new Date(cdpGuestData?.modifiedAt)?.toLocaleString() ?? "Not set"}
                      </Heading>
                    </Box>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        CDP Guest ID:
                      </Text>

                      <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                        <Link href={"https://app.boxever.com/#/guests/" + cdpGuestData?.ref}>
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
