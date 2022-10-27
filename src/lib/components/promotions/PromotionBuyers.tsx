import {
  useColorModeValue,
  Heading,
  Box,
  Button,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  Collapse,
  HStack
} from "@chakra-ui/react"
import {
  Promotion,
  PromotionAssignment,
  Promotions
} from "ordercloud-javascript-sdk"
import React, {useEffect} from "react"
import {useState} from "react"
import {FiPlus, FiTrash2} from "react-icons/fi"
import BrandedBox from "../branding/BrandedBox"
import BrandedSpinner from "../branding/BrandedSpinner"
import BrandedTable from "../branding/BrandedTable"

type PromotionDataProps = {
  promotion: Promotion
}

export default function PromotionBuyers({promotion}: PromotionDataProps) {
  const color = useColorModeValue("textColor.900", "textColor.100")
  const [expanded, setExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [promotionAssignments, setPromotionAssignments] =
    useState<PromotionAssignment[]>(null)

  useEffect(() => {
    async function getPromotionAssignments() {
      if (promotion) {
        var assignments = await Promotions.ListAssignments({
          promotionID: promotion.ID
        })
        setPromotionAssignments(assignments.Items)
      }
    }

    console.log("IJN")
    getPromotionAssignments()
  }, [promotion])

  const onRemovePromotionAssignment = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const buyerId = e.currentTarget.dataset.buyerid
    const usergroupId = e.currentTarget.dataset.usergroupid
    await Promotions.DeleteAssignment(promotion.ID, {
      buyerID: buyerId,
      userGroupID: usergroupId
    })

    var assignments = await Promotions.ListAssignments({
      promotionID: promotion.ID
    })
    setPromotionAssignments(assignments.Items)
    setIsLoading(false)
  }

  return (
    <>
      <BrandedBox isExpaned={expanded} setExpanded={setExpanded}>
        <>
          <HStack float={"right"}>
            <Tooltip label="Add Buyer to Promotion">
              <Button
                colorScheme="brandButtons"
                aria-label="Add Buyer to Promotion"
                disabled={true}
              >
                <FiPlus />
              </Button>
            </Tooltip>
          </HStack>
          <Heading size={{base: "md", md: "lg", lg: "xl"}}>Buyers</Heading>{" "}
          {isLoading && expanded ? (
            <Box pt={6} textAlign={"center"}>
              Updating... <BrandedSpinner />
            </Box>
          ) : (
            <>
              <Collapse in={expanded}>
                <Box width="full" pb={2} pt={4}>
                  {(promotionAssignments?.length ?? 0) == 0 ? (
                    <>No Buyers</>
                  ) : (
                    <BrandedTable>
                      <Thead>
                        <Tr>
                          <Th color={color}>Buyer ID</Th>
                          <Th color={color}>Usergroup ID</Th>
                          <Th color={color}>Remove</Th>
                        </Tr>
                      </Thead>
                      <Tbody alignContent={"center"}>
                        {promotionAssignments?.map((item, index) => {
                          return (
                            <Tr key={index}>
                              <Td>{item.BuyerID}</Td>
                              <Td>{item.UserGroupID}</Td>
                              <Td>
                                {" "}
                                <Tooltip label="Remove buyer from Promotion">
                                  <Button
                                    colorScheme="brandButtons"
                                    aria-label="Remove buyer fromPromotion"
                                    onClick={onRemovePromotionAssignment}
                                    data-buyerid={item.BuyerID}
                                    data-usergroupid={item.UserGroupID}
                                  >
                                    <FiTrash2 />
                                  </Button>
                                </Tooltip>
                              </Td>
                            </Tr>
                          )
                        })}
                      </Tbody>
                    </BrandedTable>
                  )}
                </Box>
              </Collapse>
            </>
          )}
        </>
      </BrandedBox>
    </>
  )
}
