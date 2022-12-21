import {
  Avatar,
  Button,
  ButtonGroup,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text
} from "@chakra-ui/react"
import {useEffect, useState} from "react"
import {Buyer} from "ordercloud-javascript-sdk"
import {ChevronDownIcon} from "@chakra-ui/icons"
import {
  buyersService,
  catalogsService,
  userGroupsService,
  usersService
} from "../../api"
import {useRouter} from "next/router"

export default function BuyerContextSwitch({...props}) {
  const [buyers, setBuyers] = useState(Array<Buyer>)
  const [currentBuyer, setCurrentBuyer] = useState({} as Buyer)
  const [userGroupsCount, setUserGroupsCount] = useState(0)
  const [usersCount, setUsersCount] = useState(0)
  const [catalogsCount, setCatalogsCount] = useState(0)
  const router = useRouter()
  useEffect(() => {
    if (router.query.buyerid) {
      buyersService.list().then((buyers) => setBuyers(buyers.Items))
      userGroupsService
        .getUserGroupsCountById(router.query.buyerid)
        .then((totalCount) => setUserGroupsCount(totalCount))

      usersService
        .getUsersCountById(router.query.buyerid)
        .then((totalCount) => setUsersCount(totalCount))
      catalogsService
        .getCatalogsCountById(router.query.buyerid)
        .then((totalCount) => setCatalogsCount(totalCount))
    }
  }, [router.query.buyerid])

  return (
    <Flex
      direction={{sm: "column", md: "row"}}
      mb="24px"
      maxH="330px"
      justifyContent={{sm: "center", md: "space-between"}}
      align="center"
      backdropFilter="blur(21px)"
      boxShadow="0px 2px 5.5px rgba(0, 0, 0, 0.02)"
      border="1.5px solid"
      p="24px"
      borderRadius="20px"
    >
      <Flex
        align="center"
        mb={{sm: "10px", md: "0px"}}
        direction={{sm: "column", md: "row"}}
        w={{sm: "100%"}}
        textAlign={{sm: "center", md: "start"}}
      >
        <Avatar
          me={{md: "22px"}}
          src={`https://robohash.org/${router.query.buyerid}.png`}
          w="80px"
          h="80px"
          borderRadius="15px"
        />
        <Flex direction="column" maxWidth="100%" my={{sm: "14px"}}>
          <Text
            fontSize={{sm: "lg", lg: "xl"}}
            fontWeight="bold"
            ms={{sm: "8px", md: "0px"}}
          >
            {currentBuyer?.Name}
          </Text>
          <Text fontSize={{sm: "sm", md: "md"}} color="gray.400">
            {currentBuyer?.ID}
          </Text>
          <Menu>
            {buyers.length > 1 && (
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="lg">
                Update the buyer context
              </MenuButton>
            )}
            <MenuList>
              {buyers.map((buyer) => (
                <>
                  <MenuItem
                    minH="40px"
                    onClick={() => router.push({query: {buyerid: buyer.ID}})}
                  >
                    <Image
                      boxSize="2rem"
                      borderRadius="full"
                      src={`https://robohash.org/${buyer.ID}.png`}
                      alt={buyer.Name}
                      mr="12px"
                    />
                    <span>{buyer.Name}</span>
                  </MenuItem>
                </>
              ))}
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      <Flex
        direction={{sm: "column", lg: "row"}}
        w={{sm: "100%", md: "50%", lg: "auto"}}
      >
        <ButtonGroup>
          <Button
            onClick={() =>
              router.push(`/buyers/${router.query.buyerid}/usergroups`)
            }
            variant="secondaryButton"
          >
            User Groups ({userGroupsCount})
          </Button>
          <Button
            onClick={() => router.push(`/buyers/${router.query.buyerid}/users`)}
            variant="secondaryButton"
          >
            Users ({usersCount})
          </Button>
          <Button
            onClick={() =>
              router.push(`/buyers/${router.query.buyerid}/catalogs`)
            }
            variant="secondaryButton"
          >
            Catalogs ({catalogsCount})
          </Button>
          <Button
            onClick={() =>
              router.push(`/buyers/${router.query.buyerid}/categories`)
            }
            variant="secondaryButton"
          >
            Categories (17)
          </Button>
        </ButtonGroup>
      </Flex>
    </Flex>
  )
}
