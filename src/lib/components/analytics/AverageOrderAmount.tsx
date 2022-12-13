import {Flex, Text, Box, useColorModeValue} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import LineChart from "../charts/LineChart"
import Card from "../card/Card"

export default function AverageOrderAmount() {
  const boxBgColor = useColorModeValue("boxBgColor.100", "boxBgColor.600")
  const color = useColorModeValue("boxTextColor.900", "boxTextColor.100")
  const headingColor = useColorModeValue("boxTextColor.400", "boxTextColor.300")
  const [totalSales, settotalSales] = useState([Number])
  const [totalPreviousYearSales, settotalPreviousYearSales] = useState([Number])

  useEffect(() => {
    initData()
  }, [])

  async function initData() {
    // const totalSales = await dashboardService.getTotalSalesByMonth()
    // settotalSales(totalSales)
    // const totalSalesPreviousYear =
    //   await dashboardService.getTotalSalesPreviousYearByMonth()
    // settotalPreviousYearSales(totalSalesPreviousYear)
  }

  const d = new Date()
  let year = d.getFullYear()
  const options = {
    chart: {
      height: "auto",
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        },
        autoSelected: "zoom"
      },
      zoom: {
        enabled: true,
        type: "x",
        zoomedArea: {
          fill: {
            color: "#90CAF9",
            opacity: 0.4
          },
          stroke: {
            color: "#0D47A1",
            opacity: 0.4,
            width: 1
          }
        }
      }
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ]
    },
    title: {
      text: "Year to Date Sales",
      align: "left"
    }
  }
  const series = [
    {
      name: "Current years sales",
      data: [130, 140, 415, 510, 149, 160, 170, 391, 130, 410, 451, 501]
    },
    {
      name: "Previous years sales",
      data: [30, 40, 115, 310, 249, 60, 70, 191, 110, 210, 151, 101]
    }
  ]

  return (
    <Card p="28px 10px 15px 0px" mb={{sm: "26px", lg: "0px"}} bg={boxBgColor}>
      <Flex direction="column" mb="20px" ps="22px" alignSelf="flex-start">
        <Text
          fontSize="lg"
          textTransform="uppercase"
          mb="6px"
          color={headingColor}
        >
          Sales Overview
        </Text>
        <Text fontSize="sm" fontWeight="medium" color={color}>
          <Text as="span" color="green.400" fontWeight="bold" pr="10px">
            (+5%) more
          </Text>
          in {year}
        </Text>
      </Flex>
      <Box w="100%" h={{sm: "100%", xl: "330px"}} ps="8px">
        <LineChart chartData={series} chartOptions={options} />
      </Box>
    </Card>
  )
}
