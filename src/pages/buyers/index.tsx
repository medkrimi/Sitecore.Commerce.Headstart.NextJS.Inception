import {AddIcon, ChevronDownIcon, DeleteIcon} from "@chakra-ui/icons"
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Container,
  Divider,
  HStack,
  Heading,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack
} from "@chakra-ui/react"
import {useEffect, useState} from "react"

import Card from "lib/components/card/Card"
import {HiOutlineMinusSm} from "react-icons/hi"
import {IoMdClose} from "react-icons/io"
import Link from "../../lib/components/navigation/Link"
import {MdCheck} from "react-icons/md"
import {NextSeo} from "next-seo"
import React from "react"
import {buyerService} from "../../lib/services"
import {formatDate} from "../../lib/utils/formatDate"
import router from "next/router"

const BuyersList = () => {
  const [buyers, setBuyers] = useState([])
  const [buyersMeta, setBuyersMeta] = useState({})
  useEffect(() => {
    initBuyersData()
  }, [])

  async function initBuyersData() {
    let _buyerListMeta = {}
    const buyersList = await buyerService.getAll()

    const requests = buyersList.Items.map(async (buyer) => {
      _buyerListMeta[buyer.ID] = {}
      _buyerListMeta[buyer.ID]["usersCount"] =
        await buyerService.getUsersCountById(buyer.ID)
      _buyerListMeta[buyer.ID]["catalogsCount"] =
        await buyerService.getCatalogsCountById(buyer.ID)
    })
    await Promise.all(requests)
    setBuyersMeta(_buyerListMeta)
    setBuyers(buyersList.Items)
  }

  function deleteUser(id) {
    setBuyers(
      buyers.map((x) => {
        if (x.id === id) {
          x.isDeleting = true
        }
        return x
      })
    )
    buyerService.delete(id).then(() => {
      setBuyers((buyers) => buyers.filter((x) => x.id !== id))
    })
  }

  const buyersContent = buyers.length ? (
    buyers.map((buyer) => (
      <Tr key={buyer.ID}>
        <Td>
          <Link href={`/buyers/${buyer.ID}`}>{buyer.ID}</Link>
        </Td>
        <Td>{buyer.Name}</Td>
        <Td>{buyer.DefaultCatalogID}</Td>
        <Td>
          <Icon
            as={buyer.Active === true ? MdCheck : IoMdClose}
            color={buyer.Active === true ? "green.400" : "red.400"}
            w="20px"
            h="20px"
          />
          <Text>{buyer.Active ? "Active" : "Non active"}</Text>
        </Td>
        <Td>{formatDate(buyer.DateCreated)}</Td>
        <Td>
          <Link href={`/buyers/${buyer.ID}/users`}>
            <Button variant="secondaryButton">
              Manage Users ({buyersMeta[buyer.ID]["usersCount"]})
            </Button>
          </Link>
        </Td>
        <Td>
          <Button
            onClick={() => router.push("/catalogs/${buyer.ID}")}
            variant="secondaryButton"
          >
            Manage Catalogs ({buyersMeta[buyer.ID]["catalogsCount"]})
          </Button>
        </Td>
        <Td>
          <Button
            onClick={() => router.push("/catagories")}
            variant="secondaryButton"
          >
            Manage Categories
          </Button>
        </Td>
        <Td>
          <Button
            onClick={() => deleteUser(buyer.ID)}
            variant="secondaryButton"
            leftIcon={<DeleteIcon />}
          ></Button>
        </Td>
      </Tr>
    ))
  ) : (
    <Tr>
      <Td colSpan={4}>No buyers!</Td>
    </Tr>
  )

  return (
    <Container maxW="full">
      <NextSeo title="Buyers" />
      <Heading as="h2" marginTop={5}>
        Buyers List
      </Heading>
      <HStack justifyContent="space-between" w="100%">
        <Button
          onClick={() => router.push("/buyers/add")}
          variant="primaryButton"
          leftIcon={<AddIcon />}
        >
          Create new buyer
        </Button>

        <HStack>
          <Menu>
            <MenuButton
              px={4}
              py={2}
              transition="all 0.2s"
              borderRadius="md"
              borderWidth="1px"
              _hover={{bg: "gray.400"}}
              _expanded={{bg: "blue.400"}}
              _focus={{boxShadow: "outline"}}
            >
              Filters <ChevronDownIcon />
            </MenuButton>
            <MenuList>
              <MenuItem>
                <VStack>
                  <Text>Product Status</Text>
                  <CheckboxGroup>
                    <Stack spacing={[1, 3]} direction={["column", "row"]}>
                      <Checkbox value="Completed" defaultChecked>
                        Completed
                      </Checkbox>
                      <Checkbox value="AwaitingApproval" defaultChecked>
                        Awaiting Approval
                      </Checkbox>
                      <Checkbox value="Canceled" defaultChecked>
                        Canceled
                      </Checkbox>
                      <Checkbox value="Declined" defaultChecked>
                        Declined
                      </Checkbox>
                      <Checkbox value="Open" defaultChecked>
                        Open
                      </Checkbox>
                    </Stack>
                  </CheckboxGroup>
                  <Divider />
                  <HStack>
                    {/*<Button size="md" bg={boxBgColor} color={color}>
                      Clear
                    </Button>
                  <Button size="md" bg={boxBgColor} color={color}>
                      Submit
                    </Button> */}
                  </HStack>
                </VStack>
              </MenuItem>
            </MenuList>
          </Menu>
          <Button variant="secondaryButton">Export CSV</Button>
        </HStack>
      </HStack>
      <Card variant="primaryCard">
        <IconButton
          variant="closePanelButton"
          aria-label="close panel"
          icon={<HiOutlineMinusSm />}
        ></IconButton>
        <Table margin={30}>
          <Thead>
            <Tr>
              <Th>Buyer ID</Th>
              <Th>Name</Th>
              <Th>Default Catalog ID</Th>
              <Th>Status</Th>
              <Th>Created</Th>
              <Th>Users</Th>
              <Th>Catalogs</Th>
              <Th>Categories</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>{buyersContent}</Tbody>
        </Table>
        <Button variant="tertiaryButton">
          Scroll down to load more orders
        </Button>
      </Card>
    </Container>
  )
}
export default BuyersList
