import {
  Heading,
  HStack,
  IconButton,
  Input,
  Link,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorModeValue,
  VStack
} from "@chakra-ui/react"
import {NextSeo} from "next-seo"
import {AiOutlineSearch} from "react-icons/ai"
import {FiRotateCcw, FiPlus} from "react-icons/fi"
import BrandedSpinner from "../branding/BrandedSpinner"
import BrandedTable from "../branding/BrandedTable"
import NextLink from "next/link"
import {useState, useEffect} from "react"
import {Promotion, Promotions} from "ordercloud-javascript-sdk"

interface PromotionSearchProps {
  query: string
}

export default function PromotionSearch({query}: PromotionSearchProps) {
  const [promotions, setPromotions] = useState<Promotion[]>(null)
  const bg = useColorModeValue("gray.400", "gray.600")
  const color = useColorModeValue("textColor.900", "textColor.100")
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState(query)

  useEffect(() => {
    console.log(query)
    setSearchQuery(query)
    doSearch(query)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  async function doSearch(query?: string) {
    var currentQuery = query ?? searchQuery
    setIsLoading(true)
    var promotions = await Promotions.List({
      search: currentQuery,
      searchOn: ["ID", "Name", "Code", "Description"]
    })
    setPromotions(promotions.Items)
    console.log(currentQuery)
    setIsLoading(false)
  }

  const onSearchClicked = async () => {
    doSearch()
  }

  const onResetSearchClicked = () => {
    setSearchQuery("")
    onSearchClicked()
  }

  return (
    <>
      {promotions ? (
        <VStack p={0} spacing={6} width="full" align="center">
          <NextSeo title="Promotions Overview" />
          <Heading color={"black"} as="h1">
            Promotions Overview
          </Heading>
          <HStack
            width={{
              base: "100%",
              sm: "100%",
              lg: "70%",
              md: "100%"
            }}
            justifyContent="space-between"
          >
            <Input
              autoComplete="off"
              placeholder="Enter here ..."
              aria-label="Enter Search Term"
              bg={bg}
              color={color}
              _placeholder={{color: color}}
              id={"headerSearchInput"}
              width={"full"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  onSearchClicked()
                }
              }}
            />
            <Tooltip label="Search for Promotions">
              <IconButton
                aria-label="Search"
                icon={<AiOutlineSearch />}
                colorScheme={"purple"}
                onClick={onSearchClicked}
              />
            </Tooltip>
            <Tooltip label="Reset Search Parameters">
              <IconButton
                aria-label="Reset all Search Parameters"
                icon={<FiRotateCcw />}
                colorScheme={"purple"}
                onClick={onResetSearchClicked}
              />
            </Tooltip>
            <Tooltip label="Add new Promotion">
              <IconButton
                aria-label="Add new Promotion"
                icon={<FiPlus />}
                colorScheme={"purple"}
                disabled={true}
              />
            </Tooltip>
          </HStack>
          {isLoading ? (
            <BrandedSpinner />
          ) : (
            <BrandedTable>
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Name</Th>
                  <Th>Code</Th>
                  <Th>Detail Page</Th>
                </Tr>
              </Thead>
              <Tbody alignContent={"center"}>
                {promotions &&
                  promotions.map((promotion, index) => (
                    <Tr key={index}>
                      <Td>{promotion.ID}</Td>
                      <Td>{promotion.Name}</Td>
                      <Td>{promotion.Code}</Td>
                      <Td>
                        <NextLink href={"/promotions/" + promotion.ID} passHref>
                          <Link>Open Promotion</Link>
                        </NextLink>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </BrandedTable>
          )}
        </VStack>
      ) : (
        <BrandedSpinner />
      )}
    </>
  )
}
