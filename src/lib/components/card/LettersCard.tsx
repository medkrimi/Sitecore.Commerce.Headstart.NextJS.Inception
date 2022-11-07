import {Box, HStack, Text} from "@chakra-ui/react"

export default function LettersCard(props) {
  var str = new String(props.FirstName)
  var strlast = new String(props.LastName)
  const firstnameletter = str.charAt(0)
  const lastnameletter = strlast.charAt(0)
  return (
    <Box
      bg="brand.500"
      borderRadius="50%"
      p="15px"
      pt="20px"
      pb="20px"
      shadow="xl"
      width="40px"
      height="40px"
      position="relative"
      _hover={{
        bg: "brand.600",
        textDecoration: "none",
        borderRadius: "10px"
      }}
    >
      <HStack w="full" color="white" position="absolute" top="10px" left="6px">
        <Text fontSize="18px">
          {firstnameletter}
          {lastnameletter}
        </Text>
      </HStack>
    </Box>
  )
}
