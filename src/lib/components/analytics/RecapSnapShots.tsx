import {
  SimpleGrid,
  Flex,
  Stat,
  Text,
  StatLabel,
  StatNumber
} from "@chakra-ui/react"
import useNextRouterMapping, {
  NextQueryMap
} from "lib/hooks/useNextRouterMapping"
import formatPrice from "lib/utils/formatPrice"
import formatPercentChange from "lib/utils/formatPercentChange"
import {Filters} from "ordercloud-javascript-sdk"
import React, {FormEvent, useCallback, useState} from "react"
import IconBox from "../icons/IconBox"
import {CartIcon, DocumentIcon, GlobeIcon, WalletIcon} from "../icons/Icons"
import Card from "../card/Card"

const queryMap: NextQueryMap = {
  monthLabels: "string[]",
  orderData: "any[]",
  averageData: "any[]",
  openStatus: "number",
  completedStatus: "number",

  // displayTable = 'false',
  ordersTable: "any[]"
}
interface Props {
  chartData: number[]
}

export default function RecapSnapShot() {
  const {isReady, options, updateQuery} = useNextRouterMapping(queryMap)
  const [orderdata, setOrderData] = useState([0, 1, 2, 3, 4, 5, 6, 7])
  const [avgdata, setAvgData] = useState([0, 1, 2, 3, 4, 5, 6, 7])
  const [orderstatusdata, setOrderStatusData] = useState([
    0, 1, 2, 3, 4, 5, 6, 7
  ])

  const curMonth = new Date().getMonth() + 1
  var prevMonth = new Date().getMonth()
  if (curMonth === 1) {
    prevMonth = 12
  }
  const curMonthTotalSales = 13599.59
  const prevMonthTotalSales = 806.87
  const percentChangeTotalSales =
    (curMonthTotalSales / prevMonthTotalSales) * 100

  const curMonthUsers = 34
  const prevMonthUsers = 11
  const percentChangeUsers = (curMonthUsers / prevMonthUsers) * 100

  const curMonthProducts = 34
  const prevMonthProducts = 11
  const percentChangeProducts = (curMonthProducts / prevMonthProducts) * 100

  const ytdCurrentMonthTotalSales = 13599.59
  const ytdPreviousMonthTotalSales = 806.87
  const ytdPercentChangeTotalSales =
    (ytdCurrentMonthTotalSales / ytdPreviousMonthTotalSales) * 100

  const handleFacetChange = useCallback(
    (updatedFilters: Filters) => {
      updateQuery({...options, page: undefined, filters: updatedFilters})
    },
    [options, updateQuery]
  )

  const toggleBurger = useCallback(async (e: FormEvent) => {
    e.preventDefault()
  }, [])
  // const getMondayOfCurrentWeek = useCallback(
  //   async (e: FormEvent) => {
  //     e.preventDefault()

  //   },
  //   [ ]
  // )

  return (
    <Flex flexDirection="column" w="100%" width="full">
      <SimpleGrid columns={{sm: 1, md: 2, xl: 4}} spacing="24px" mb="20px">
        <Card minH="125px" shadow="xl">
          <Flex direction="column">
            <Flex
              flexDirection="row"
              align="center"
              justify="center"
              w="100%"
              mb="25px"
            >
              <Stat me="auto">
                <StatLabel
                  fontSize="xs"
                  color="gray.400"
                  fontWeight="bold"
                  textTransform="uppercase"
                >
                  Todays Money
                </StatLabel>
                <Flex>
                  <StatNumber fontSize="lg" fontWeight="bold">
                    {` ${formatPrice(curMonthTotalSales)}`}
                  </StatNumber>
                </Flex>
              </Stat>
              <IconBox borderRadius="50%" as="box" h={"45px"} w={"45px"}>
                <WalletIcon h={"24px"} w={"24px"} />
              </IconBox>
            </Flex>
            <Text color="gray.400" fontSize="sm">
              {` ${formatPercentChange(percentChangeTotalSales)}`}
              Since last month
            </Text>
          </Flex>
        </Card>
        <Card minH="125px" shadow="xl">
          <Flex direction="column">
            <Flex
              flexDirection="row"
              align="center"
              justify="center"
              w="100%"
              mb="25px"
            >
              <Stat me="auto">
                <StatLabel
                  fontSize="xs"
                  color="gray.400"
                  fontWeight="bold"
                  textTransform="uppercase"
                >
                  Todays Customers
                </StatLabel>
                <Flex>
                  <StatNumber fontSize="lg" fontWeight="bold">
                    {curMonthUsers}
                  </StatNumber>
                </Flex>
              </Stat>
              <IconBox borderRadius="50%" as="box" h={"45px"} w={"45px"}>
                <GlobeIcon h={"24px"} w={"24px"} />
              </IconBox>
            </Flex>
            <Text color="gray.400" fontSize="sm">
              {` ${formatPercentChange(percentChangeUsers)}`}
              Since last month
            </Text>
          </Flex>
        </Card>
        <Card minH="125px" shadow="xl">
          <Flex direction="column">
            <Flex
              flexDirection="row"
              align="center"
              justify="center"
              w="100%"
              mb="25px"
            >
              <Stat me="auto">
                <StatLabel
                  fontSize="xs"
                  color="gray.400"
                  fontWeight="bold"
                  textTransform="uppercase"
                >
                  Unique Products
                </StatLabel>
                <Flex>
                  <StatNumber fontSize="lg" fontWeight="bold">
                    {curMonthProducts}
                  </StatNumber>
                </Flex>
              </Stat>
              <IconBox borderRadius="50%" as="box" h={"45px"} w={"45px"}>
                <DocumentIcon h={"24px"} w={"24px"} />
              </IconBox>
            </Flex>
            <Text color="gray.400" fontSize="sm">
              {` ${formatPercentChange(percentChangeProducts)}`}
              Since last month
            </Text>
          </Flex>
        </Card>
        <Card minH="125px" shadow="xl">
          <Flex direction="column">
            <Flex
              flexDirection="row"
              align="center"
              justify="center"
              w="100%"
              mb="25px"
            >
              <Stat me="auto">
                <StatLabel
                  fontSize="xs"
                  color="gray.400"
                  fontWeight="bold"
                  textTransform="uppercase"
                >
                  Total Sales
                </StatLabel>
                <Flex>
                  <StatNumber fontSize="lg" fontWeight="bold">
                    {` ${formatPrice(ytdCurrentMonthTotalSales)}`}
                  </StatNumber>
                </Flex>
              </Stat>
              <IconBox borderRadius="50%" as="box" h={"45px"} w={"45px"}>
                <CartIcon h={"24px"} w={"24px"} />
              </IconBox>
            </Flex>
            <Text color="gray.400" fontSize="sm">
              {` ${formatPercentChange(ytdPercentChangeTotalSales)}`}
              Since last month
            </Text>
          </Flex>
        </Card>
      </SimpleGrid>
    </Flex>
  )
}
