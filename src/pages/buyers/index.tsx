import {
  Button,
  Container,
  Heading,
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react"
import {Buyers, Catalogs, Me, Users} from "ordercloud-javascript-sdk"
import {MdCheck, MdReplay} from "react-icons/md"
import {useEffect, useState} from "react"

import {IoMdClose} from "react-icons/io"
import Link from "../../lib/components/navigation/Link"
import {NextSeo} from "next-seo"
import {formatDate} from "lib/utils/formatDate"
import formatPrice from "lib/utils/formatPrice"
import useOcAuth from "lib/hooks/useOcAuth"

const BuyersPage = () => {
  const {isAdmin} = useOcAuth()
  const [buyers, setBuyers] = useState([])
  const [usersTotalCount, setusersTotalCount] = useState<number>(0)
  const [catalogTotalCount, setcatalogTotalCount] = useState<number>(0)

  useEffect(() => {
    const getBuyers = async () => {
      const buyersList = await Buyers.List()
      setBuyers(buyersList.Items)
    }
    getBuyers()
  }, [isAdmin])

  function getUsersTotalCount({buyerID}): number {
    Users.List(buyerID).then((userList) =>
      setusersTotalCount(userList.Meta.TotalCount)
    )
    return usersTotalCount
  }

  function getCatalogTotalCount({buyerID}): number {
    Catalogs.List().then((catalogList) =>
      setcatalogTotalCount(catalogList.Meta.TotalCount)
    )
    return catalogTotalCount
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
            <Button variant="outline" colorScheme="dark">
              Manage Users ({getUsersTotalCount({buyerID: buyer.ID})})
            </Button>
          </Link>
        </Td>
        <Td>
          <Link href={`/buyers/${buyer.ID}/users`}>
            <Button variant="outline" colorScheme="dark">
              Manage Catalogs ({getCatalogTotalCount({buyerID: buyer.ID})})
            </Button>
          </Link>
        </Td>
        <Td>
          <Link href="/categories">
            <Button variant="outline" colorScheme="dark">
              Manage Categories
            </Button>
          </Link>
        </Td>
      </Tr>
    ))
  ) : (
    <Tr>
      <Td colSpan={4}>No buyers!</Td>
    </Tr>
  )

  return (
    <Container maxWidth={"120ch"}>
      <NextSeo title="Buyers" />
      <Heading as="h2" marginTop={5}>
        Buyers{" "}
      </Heading>
      <Table variant="striped" margin={30}>
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
          </Tr>
        </Thead>
        <Tbody>{buyersContent}</Tbody>
      </Table>
    </Container>
  )
}

export default BuyersPage
