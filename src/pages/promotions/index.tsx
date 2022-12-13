import {
  Button,
  Checkbox,
  Container,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorMode,
  useColorModeValue,
  Text,
  CheckboxGroup,
  Stack,
  VStack,
  Divider,
  IconButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  Textarea,
  AlertDialogFooter,
  Spinner
} from "@chakra-ui/react"
import {NextSeo} from "next-seo"
import {Promotion, Promotions} from "ordercloud-javascript-sdk"
import {useEffect, useRef, useState} from "react"
import Link from "../../lib/components/navigation/Link"
import {formatDate} from "lib/utils/formatDate"
import formatPrice from "lib/utils/formatPrice"
import {
  GetAuthenticationStatus,
  OcAuthState
} from "lib/scripts/OrdercloudService"
import formatStatus from "lib/utils/formatStatus"
import {ChevronDownIcon} from "@chakra-ui/icons"
import Card from "lib/components/card/Card"
import {HiOutlineMinusSm} from "react-icons/hi"

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([])
  const [authState, setAuthState] = useState<OcAuthState>()
  const [isExportCSVDialogOpen, setExportCSVDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const cancelRef = useRef()

  const requestExportCSV = () => {}

  const showInfiniteScrollBtn = promotions.length

  const loadMoreButton = showInfiniteScrollBtn != 0 && (
    <HStack justifyContent="center">
      <Button variant="tertiaryButton">
        Scroll down to load more promotions
      </Button>
    </HStack>
  )

  useEffect(() => {
    const getPromotions = async () => {
      const state = GetAuthenticationStatus()
      setAuthState(state)
      const promotionsList = Promotions.List()
      setPromotions((await promotionsList).Items)
    }
    getPromotions()
  }, [])

  const promotionsContent = promotions.length ? (
    promotions.map((promotion) => (
      <Tr key={promotion.Code}>
        <Td>
          <Checkbox pr="10px"></Checkbox>
          <Link href={`/promotions/${promotion.ID}`}>{promotion.Code}</Link>
        </Td>
        <Td>{promotion.Description}</Td>
        <Td>{promotion.Type}</Td>
        <Td>{promotion.Elgibility}</Td>
        <Td>{formatStatus(promotion.Status)}</Td>
        <Td>{formatDate(promotion.StartDate)}</Td>
        <Td>{formatDate(promotion.ExpirationDate)}</Td>
      </Tr>
    ))
  ) : (
    <Tr>
      <Td colSpan={7}>No promotions have been created</Td>
    </Tr>
  )

  return (
    <Container maxW="full">
      <NextSeo title="Promotions List" />
      <Heading as="h2" marginTop={5}>
        Promotions List
      </Heading>
      <HStack justifyContent="space-between" w="100%">
        <Link href={`/promotions/new`}>
          <Button variant="primaryButton">New Promotion</Button>
        </Link>
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
                  <Text>Promotion Status</Text>
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
                      <Checkbox value="Active" defaultChecked>
                        Active
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
          <Button
            variant="secondaryButton"
            onClick={() => setExportCSVDialogOpen(true)}
          >
            Export CSV
          </Button>
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
              <Th>Code</Th>
              <Th>Description</Th>
              <Th>Type</Th>
              <Th>Elgibility</Th>
              <Th>Status</Th>
              <Th>Start Date</Th>
              <Th>End Date</Th>
            </Tr>
          </Thead>
          <Tbody>{promotionsContent}</Tbody>
        </Table>
        {/* {loadMoreButton} */}
      </Card>
      <AlertDialog
        isOpen={isExportCSVDialogOpen}
        onClose={() => setExportCSVDialogOpen(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Export Selected Promotion to CSV
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text display="inline">
                Export the selected promotions to a CSV, once the export button
                is clicked behind the scense a job will be kicked off to create
                the csv and then will automatically download to your downloads
                folder in the browser.
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <HStack justifyContent="space-between" w="100%">
                <Button
                  ref={cancelRef}
                  onClick={() => setExportCSVDialogOpen(false)}
                  disabled={loading}
                  variant="secondaryButton"
                >
                  Cancel
                </Button>
                <Button onClick={requestExportCSV} disabled={loading}>
                  {loading ? (
                    <Spinner color="brand.500" />
                  ) : (
                    "Export Promotions"
                  )}
                </Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  )
}

export default PromotionsPage
