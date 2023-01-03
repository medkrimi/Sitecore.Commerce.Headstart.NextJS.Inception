import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  VStack
} from "@chakra-ui/react"
import {useEffect, useState} from "react"
import {Buyer} from "ordercloud-javascript-sdk"
import {ChevronDownIcon} from "@chakra-ui/icons"
import Card from "lib/components/card/Card"
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

      let currentBuyer = buyers.find(
        (buyer) => buyer.ID === router.query.buyerid
      )
      setCurrentBuyer(currentBuyer)
    }
  }, [buyers, router.query.buyerid])

  return (
    <Box
      bg="white"
      borderRadius="xl"
      pl="20px"
      pr="20px"
      pt="2"
      pb="2"
      mb="6"
      shadow="xl"
      w="100%"
      width="full"
      position="relative"
      _hover={{
        textDecoration: "none",
        borderRadius: "10px"
      }}
    >
      <HStack
        maxWidth="100%"
        my={{sm: "14px"}}
        justifyContent="space-between"
        w="100%"
      >
        <HStack>
          <Avatar
            me={{md: "22px"}}
            src={`https://robohash.org/${router.query.buyerid}.png`}
            w="80px"
            h="80px"
            borderRadius="15px"
          />
          <VStack textAlign="left">
            <Text
              fontSize={{sm: "lg", lg: "xl"}}
              fontWeight="bold"
              ms={{sm: "8px", md: "0px"}}
              width="100%"
            >
              {currentBuyer?.Name}
            </Text>
            <Text fontSize={{sm: "sm", md: "md"}} color="gray.400" width="100%">
              {currentBuyer?.ID}
            </Text>
          </VStack>
          <Spacer width="40px"></Spacer>
          <Menu>
            {buyers.length > 1 && (
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                size="lg"
                ml="30px"
              >
                {currentBuyer?.Name}
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
        </HStack>

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
              onClick={() =>
                router.push(`/buyers/${router.query.buyerid}/users`)
              }
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
      </HStack>
    </Box>
  )
}
