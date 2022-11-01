import {Flex, Text, Box, useColorModeValue} from "@chakra-ui/react"
import React from "react"

// import LineChart from "../charts/LineChart"
import Card from "../card/Card"
import {
  lineChartDataDefault,
  lineChartOptionsDefault
} from "../../variables/charts"

export default function AverageOrderAmount() {
  const boxBgColor = useColorModeValue("boxBgColor.100", "boxBgColor.600")
  const color = useColorModeValue("boxTextColor.900", "boxTextColor.100")
  const headingColor = useColorModeValue("boxTextColor.400", "boxTextColor.300")
  return (
    <Card p="28px 10px 0px 0px" mb={{sm: "26px", lg: "0px"}} bg={boxBgColor}>
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
