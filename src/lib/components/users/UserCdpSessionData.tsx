import {
  Box,
  Button,
  Center,
  Collapse,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react"
import {useEffect, useState} from "react"

import BrandedBox from "../branding/BrandedBox"
import BrandedSpinner from "../branding/BrandedSpinner"
import BrandedTable from "../branding/BrandedTable"
import {CdpGuestModel} from "../../services/cdp.service"
import React from "react"
import {User} from "ordercloud-javascript-sdk"

type UserDataProps = {
  user: User
  buyerId: string
  cdpGuest: CdpGuestModel
}

export default function UserCdpSessionData({
  user,
  buyerId,
  cdpGuest
}: UserDataProps) {
  const [isEditingBasicData, setIsEditingBasicData] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [componentUser, setComponentUser] = useState<User<any>>(user)
  const [cdpGuestData, setCdpGuestData] = useState<CdpGuestModel>(null)
  const color = useColorModeValue("textColor.900", "textColor.100")
  const [chosenSession, setChosenSession] = useState(-1)
  const {isOpen, onOpen, onClose} = useDisclosure()

  const onSessionClicked = (index: number) => (e) => {
    setChosenSession(index)
    onOpen()
  }

  useEffect(() => {
    setComponentUser(user)
    setCdpGuestData(cdpGuest)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

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
                CDP Sessions
              </Heading>
              <Collapse in={expanded}>
                <Flex flexDirection={{base: "column", sm: "column", md: "row"}}>
                  <Box width="full" pb={2}>
                    <BrandedTable>
                      <Thead>
                        <Tr>
                          <Th color={color}>Session Type</Th>
                          <Th color={color}>Status</Th>
                          <Th color={color}>duration</Th>
                          <Th color={color}>PoS</Th>
                          <Th color={color}>Created at</Th>
                          <Th color={color}>Started at</Th>
                          <Th color={color}>Ended at</Th>
                          <Th color={color}>Modified at</Th>
                        </Tr>
                      </Thead>
                      <Tbody alignContent={"center"}>
                        {cdpGuestData ? (
                          <>
                            {cdpGuestData?.sessions.map((element, index) => {
                              return (
                                <Tooltip
                                  key={index}
                                  label="Click to see Session Events"
                                >
                                  <Tr
                                    onClick={onSessionClicked(index)}
                                    cursor={"pointer"}
                                  >
                                    <Td>{element.sessionType}</Td>
                                    <Td>{element.status}</Td>
                                    <Td>{element.duration} min</Td>
                                    <Td>{element.pointOfSale}</Td>
                                    <Td>
                                      {new Date(
                                        element?.createdAt
                                      )?.toLocaleString() ?? "Not set"}
                                    </Td>
                                    <Td>
                                      {new Date(
                                        element?.startedAt
                                      )?.toLocaleString() ?? "Not set"}
                                    </Td>
                                    <Td>
                                      {new Date(
                                        element?.endedAt
                                      )?.toLocaleString() ?? "Not set"}
                                    </Td>
                                    <Td>
                                      {new Date(
                                        element?.modifiedAt
                                      )?.toLocaleString() ?? "Not set"}
                                    </Td>
                                  </Tr>
                                </Tooltip>
                              )
                            })}
                          </>
                        ) : (
                          <Tr>
                            <Td>No Session data</Td>
                          </Tr>
                        )}
                      </Tbody>
                    </BrandedTable>
                    <Center>
                      <Text as="p" mt={4} fontWeight={"bold"}>
                        {cdpGuestData?.sessions.length} out of{" "}
                        {cdpGuestData?.sessions.length} Sessions
                      </Text>
                    </Center>
                  </Box>
                </Flex>
              </Collapse>
            </>
          )}
        </>
      </BrandedBox>
      <Modal
        size={"full"}
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior={"inside"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Details about Session EVENTS</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection={{base: "column", sm: "column", md: "row"}}>
              <Box width="full" pb={2}>
                <BrandedTable>
                  <Thead>
                    <Tr>
                      <Th color={color}>Channel</Th>
                      <Th color={color}>Type</Th>
                      <Th color={color}>Status</Th>
                      <Th color={color}>PoS</Th>
                      <Th color={color}>Page</Th>
                      <Th color={color}>Website Base Url</Th>
                    </Tr>
                  </Thead>
                  <Tbody alignContent={"center"}>
                    {cdpGuestData ? (
                      <>
                        {cdpGuestData?.sessions[chosenSession]?.events.map(
                          (element, index) => {
                            return (
                              <Tr key={index}>
                                <Td>{element.channel}</Td>
                                <Td>{element.type}</Td>
                                <Td>{element.status}</Td>
                                <Td>{element.pointOfSale}</Td>
                                <Td>{element.arbitraryData.page}</Td>
                                <Td>{element.arbitraryData.websiteBaseUrl}</Td>
                              </Tr>
                            )
                          }
                        )}
                      </>
                    ) : (
                      <Tr>
                        <Td>No Session Event data</Td>
                      </Tr>
                    )}
                  </Tbody>
                </BrandedTable>
                <Center>
                  <Text as="p" mt={4} fontWeight={"bold"}>
                    {cdpGuestData?.sessions[chosenSession]?.events?.length} out
                    of {cdpGuestData?.sessions[chosenSession]?.events?.length}{" "}
                    Events
                  </Text>
                </Center>
              </Box>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              size={"lg"}
              colorScheme="brandButtons"
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
