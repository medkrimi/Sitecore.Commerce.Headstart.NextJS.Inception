import {Flex, Text, Box} from "@chakra-ui/react"
import React from "react"

// import LineChart from "../charts/LineChart"
import Card from "../card/Card"
import {
  lineChartDataDefault,
  lineChartOptionsDefault
} from "../../variables/charts"

export default function AverageOrderAmount() {
  return (
    <Card p="28px 10px 0px 0px" mb={{sm: "26px", lg: "0px"}}>
      <Flex direction="column" mb="20px" ps="22px" alignSelf="flex-start">
        <Text fontSize="lg" fontWeight="bold" mb="6px">
          Sales Overview
        </Text>
        <Text fontSize="sm" fontWeight="medium" color="gray.400">
          <Text as="span" color="green.400" fontWeight="bold">
            (+5%) more
          </Text>{" "}
          in 2022
        </Text>
      </Flex>
      <Box w="100%" h={{sm: "300px", xl: "100%"}} ps="8px">
        {/* <LineChart
        // chartData={lineChartDataDefault}
        // chartOptions={lineChartOptionsDefault}
        /> */}
      </Box>
    </Card>
  )
}
