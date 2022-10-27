import {CheckIcon, CloseIcon} from "@chakra-ui/icons"
import {
  Box,
  Button,
  Heading,
  Tooltip,
  useColorModeValue,
  Flex,
  Collapse,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Divider
} from "@chakra-ui/react"
import {
  Filters,
  LineItem,
  LineItems,
  Order,
  Orders,
  Promotion,
  User,
  Users
} from "ordercloud-javascript-sdk"
import {ChangeEvent, useEffect, useState} from "react"
import {FiCheck, FiEdit, FiX} from "react-icons/fi"
import BrandedBox from "../branding/BrandedBox"
import BrandedSpinner from "../branding/BrandedSpinner"
import BrandedTable from "../branding/BrandedTable"

type UserDataProps = {
  user: User
  buyerId: string
}

export default function UserOrderData({user, buyerId}: UserDataProps) {
  const [isEditingBasicData, setIsEditingBasicData] = useState(false)
  const okColor = useColorModeValue("okColor.800", "okColor.200")
  const errorColor = useColorModeValue("errorColor.800", "errorColor.200")
  const [expanded, setExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [componentUser, setComponentUser] = useState<User<any>>(user)
  const color = useColorModeValue("textColor.900", "textColor.100")
  const [userOrders, setUserOrders] = useState<Order[]>(null)
  const [orderDetails, setOrderDetails] = useState<OrderDetails>(null)
  const {isOpen, onOpen, onClose} = useDisclosure()

  interface OrderDetails {
    lineItems: LineItem[]
    promotions: Promotion[]
    order: Order
  }

  useEffect(() => {
    setComponentUser(user)

    async function doGetUserOrders() {
      if (user) {
        const filter: Filters = {
          FromUserID: user?.ID
        }
        var userOrders = await Orders.List("All", {
          buyerID: buyerId,
          filters: filter
        })
        setUserOrders(userOrders.Items)
      }
    }
    doGetUserOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const onOrderClicked = (index: number) => async (e) => {
    var lineItems = await LineItems.List("All", userOrders[index]?.ID)
    var promotions = await Orders.ListPromotions("All", userOrders[index]?.ID)
    var orderDetails: OrderDetails = {
      lineItems: lineItems.Items,
      promotions: promotions.Items,
      order: userOrders[index]
    }
    setOrderDetails(orderDetails)
    onOpen()
  }

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
                Orders
              </Heading>
              <Collapse in={expanded}>
                <Flex flexDirection={{base: "column", sm: "column", md: "row"}}>
                  <BrandedTable>
                    <Thead>
                      <Tr>
                        <Th color={color}>ID</Th>
                        <Th color={color}>Is Submitted?</Th>
                        <Th color={color}>Status</Th>
                        <Th color={color}>#Line Items</Th>
                        <Th color={color}>Subtotal</Th>
                        <Th color={color}>Discount</Th>
                        <Th color={color}>Tax</Th>
                        <Th color={color}>Total</Th>
                        <Th color={color}>Currency</Th>
                        <Th color={color}>Date Created</Th>
                        <Th color={color}>Date Submitted</Th>
                      </Tr>
                    </Thead>
                    <Tbody alignContent={"center"}>
                      {userOrders ? (
                        <>
                          {userOrders?.map((element, index) => {
                            return (
                              <Tooltip
                                key={index}
                                label="Click to see Order Details"
                              >
                                <Tr
                                  onClick={onOrderClicked(index)}
                                  cursor={"pointer"}
                                >
                                  <Td>{element.ID}</Td>
                                  <Td>
                                    {element.IsSubmitted ?? false ? (
                                      <CheckIcon boxSize={6} color={okColor} />
                                    ) : (
                                      <CloseIcon
                                        boxSize={6}
                                        color={errorColor}
                                      />
                                    )}
                                  </Td>
                                  <Td>{element.Status}</Td>
                                  <Td>{element.LineItemCount}</Td>
                                  <Td>{element.Subtotal}</Td>
                                  <Td>{element.PromotionDiscount}</Td>
                                  <Td>{element.TaxCost}</Td>
                                  <Td>{element.Total}</Td>
                                  <Td>{element.Currency}</Td>
                                  <Td>
                                    {" "}
                                    {new Date(
                                      element?.DateCreated
                                    )?.toLocaleString() ?? "Not set"}
                                  </Td>
                                  <Td>
                                    {" "}
                                    {new Date(
                                      element?.DateSubmitted
                                    )?.toLocaleString() ?? "Not set"}
                                  </Td>
                                </Tr>
                              </Tooltip>
                            )
                          })}
                        </>
                      ) : (
                        <Tr>
                          <Td>No Session Event data</Td>
                        </Tr>
                      )}
                    </Tbody>
                  </BrandedTable>
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
          <ModalHeader>Order Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection={{base: "column", sm: "column", md: "row"}}>
              <Box width="full" pb={2}>
                <Heading pl={2} mb={4}>
                  Order
                </Heading>
                <BrandedTable>
                  <Thead>
                    <Tr>
                      <Th color={color}>ID</Th>
                      <Th color={color}>Is Submitted?</Th>
                      <Th color={color}>Status</Th>
                      <Th color={color}>#Line Items</Th>
                      <Th color={color}>Subtotal</Th>
                      <Th color={color}>Discount</Th>
                      <Th color={color}>Tax</Th>
                      <Th color={color}>Total</Th>
                      <Th color={color}>Currency</Th>
                      <Th color={color}>Date Created</Th>
                      <Th color={color}>Date Submitted</Th>
                    </Tr>
                  </Thead>
                  <Tbody alignContent={"center"}>
                    {orderDetails ? (
                      <>
                        <Tr>
                          <Td>{orderDetails?.order?.ID}</Td>
                          <Td>
                            {orderDetails?.order?.IsSubmitted ?? false ? (
                              <CheckIcon boxSize={6} color={okColor} />
                            ) : (
                              <CloseIcon boxSize={6} color={errorColor} />
                            )}
                          </Td>
                          <Td>{orderDetails?.order?.Status}</Td>
                          <Td>{orderDetails?.order?.LineItemCount}</Td>
                          <Td>{orderDetails?.order?.Subtotal}</Td>
                          <Td>{orderDetails?.order?.PromotionDiscount}</Td>
                          <Td>{orderDetails?.order?.TaxCost}</Td>
                          <Td>{orderDetails?.order?.Total}</Td>
                          <Td>{orderDetails?.order?.Currency}</Td>
                          <Td>
                            {" "}
                            {new Date(
                              orderDetails?.order?.DateCreated
                            )?.toLocaleString() ?? "Not set"}
                          </Td>
                          <Td>
                            {" "}
                            {new Date(
                              orderDetails?.order?.DateSubmitted
                            )?.toLocaleString() ?? "Not set"}
                          </Td>
                        </Tr>
                      </>
                    ) : (
                      <Tr>
                        <Td>No Order data</Td>
                        <Td></Td>
                        <Td></Td>
                        <Td></Td>
                        <Td></Td>
                        <Td></Td>
                        <Td></Td>
                      </Tr>
                    )}
                  </Tbody>
                </BrandedTable>
                <Divider mt={5} mb={5} />
                <Heading pl={2} mb={4}>
                  Line Items
                </Heading>
                <BrandedTable>
                  <Thead>
                    <Tr>
                      <Th color={color}>Id</Th>
                      <Th color={color}>Name</Th>
                      <Th color={color}>Unit Price</Th>
                      <Th color={color}>Quantity</Th>
                      <Th color={color}>Subtotal</Th>
                      <Th color={color}>Discount</Th>
                      <Th color={color}>Total</Th>
                    </Tr>
                  </Thead>
                  <Tbody alignContent={"center"}>
                    {orderDetails ? (
                      <>
                        {orderDetails?.lineItems?.map((element, index) => {
                          return (
                            <Tr key={index}>
                              <Td>{element.ID}</Td>
                              <Td>{element.Product.Name}</Td>
                              <Td>{element.UnitPrice}</Td>
                              <Td>{element.Quantity}</Td>
                              <Td>{element.LineSubtotal}</Td>
                              <Td>{element.PromotionDiscount}</Td>
                              <Td>{element.LineTotal}</Td>
                            </Tr>
                          )
                        })}
                      </>
                    ) : (
                      <Tr>
                        <Td>No Line items</Td>
                        <Td></Td>
                        <Td></Td>
                        <Td></Td>
                        <Td></Td>
                        <Td></Td>
                        <Td></Td>
                      </Tr>
                    )}
                  </Tbody>
                </BrandedTable>
                <Divider mt={5} mb={5} />
                <Heading mt={4} pl={2} mb={4}>
                  Promotions
                </Heading>
                <BrandedTable>
                  <Thead>
                    <Tr>
                      <Th color={color}>Id</Th>
                      <Th color={color}>Name</Th>
                      <Th color={color}>Code</Th>
                      <Th color={color}>Description</Th>
                      <Th color={color}>Eligable Expression</Th>
                      <Th color={color}>Value Expression</Th>
                      <Th color={color}>Start Date</Th>
                      <Th color={color}>Expiration Date</Th>
                    </Tr>
                  </Thead>
                  <Tbody alignContent={"center"}>
                    {orderDetails?.promotions?.length > 0 ? (
                      <>
                        {orderDetails?.promotions?.map((element, index) => {
                          return (
                            <Tr key={index}>
                              <Td>{element.ID}</Td>
                              <Td>{element.Name}</Td>
                              <Td>{element.Code}</Td>
                              <Td>{element.Description}</Td>
                              <Td>{element.EligibleExpression}</Td>
                              <Td>{element.ValueExpression}</Td>
                              <Td>
                                {" "}
                                {new Date(
                                  element?.StartDate
                                )?.toLocaleString() ?? "Not set"}
                              </Td>
                              <Td>
                                {new Date(
                                  element?.ExpirationDate
                                )?.toLocaleString() ?? "Not set"}
                              </Td>
                            </Tr>
                          )
                        })}
                      </>
                    ) : (
                      <Tr>
                        <Td>No Promotions</Td>
                        <Td></Td>
                        <Td></Td>
                        <Td></Td>
                        <Td></Td>
                        <Td></Td>
                        <Td></Td>
                        <Td></Td>
                      </Tr>
                    )}
                  </Tbody>
                </BrandedTable>
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
