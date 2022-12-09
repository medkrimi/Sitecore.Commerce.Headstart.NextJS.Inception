import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  Tooltip,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react"
import {CdpGuestModel, getGuestContext} from "../../../lib/services/cdp.service"
import {FiRefreshCw, FiTrash2} from "react-icons/fi"
import {Promotion, Promotions, User, Users} from "ordercloud-javascript-sdk"
import {useEffect, useState} from "react"

import BrandedSpinner from "lib/components/branding/BrandedSpinner"
import BreadcrumbNavigation from "lib/components/navigation/BreadcrumbNavigation"
import {NextSeo} from "next-seo"
import PromotionBasicData from "lib/components/promotions/PromotionBasicData"
import PromotionBuyers from "lib/components/promotions/PromotionBuyers"
import {PromotionXPs} from "lib/types/PromotionXPs"
import PromotionXpInformation from "lib/components/promotions/PromotionXpInformation"
import React from "react"
import UserBasicData from "lib/components/users/UserBasicData"
import UserCdpData from "lib/components/users/UserCdpData"
import UserCdpSessionData from "lib/components/users/UserCdpSessionData"
import UserOrderData from "lib/components/users/UserOrderData"
import {useRouter} from "next/router"

const UserDetails = () => {
  const router = useRouter()

  const {buyergroupid, userid} = router.query
  const [userName, setUserName] = useState("")
  const [breadcrumb, setBreadcrumb] = useState<Breadcrumb>()
  const [isDeleting, setIsDeleting] = useState(false)
  const [user, setUser] = useState<User<any>>(null)
  const [cdpGuestData, setCdpGuestData] = useState<CdpGuestModel>(null)
  const color = useColorModeValue("textColor.900", "textColor.100")
  const {isOpen, onOpen, onClose} = useDisclosure()
  const cancelRef = React.useRef()

  interface BreadcrumbItem {
    name: string
    url: string
  }
  interface Breadcrumb {
    items: BreadcrumbItem[]
  }

  const onRefreshUserDataClicked = async () => {
    setUser(null)
    if (user) {
      const newUserData = await Users.Get(buyergroupid as string, user?.ID)
      setUser(newUserData)
    }
  }

  const onDelete = (e) => {
    setIsDeleting(true)
    e.preventDefault()
    Users.Delete(buyergroupid as string, user.ID)
    setTimeout(() => {
      setIsDeleting(false)
      onClose()
      router.push("/" + buyergroupid)
    }, 4000)
  }

  useEffect(() => {
    // TODO: Add 404 Handling if promotion really does not exist
    const doSetBreadcrumb = () => {
      const breadcrumbItems: BreadcrumbItem[] = [
        {
          name: "Home",
          url: "/dashboard"
        },
        {
          name: "Users",
          url: "/users"
        },
        {
          name: buyergroupid as string,
          url: "/users/" + buyergroupid
        },
        {
          name: user?.Username ?? "...",
          url: "/users/" + buyergroupid + "/" + user?.ID ?? ""
        }
      ]
      const tmpbreadcrumb: Breadcrumb = {
        items: breadcrumbItems
      }
      setBreadcrumb(tmpbreadcrumb)
    }
    async function doGetUser() {
      if (userid != user?.ID) {
        const user = await Users.Get(buyergroupid as string, userid as string)
        setUser(user)
      }
    }

    async function doGrabCDPData() {
      if (user) {
        var guestContext = await getGuestContext(user?.Email)
        console.log(guestContext)
        setCdpGuestData(guestContext)
      }
    }
    doGrabCDPData()

    doGetUser()
    setUserName(user?.Username ?? "")
    doSetBreadcrumb()
  }, [buyergroupid, userid, user])

  return (
    <>
      {/* {prodcutName !== "" ? ( */}
      <>
        {breadcrumb?.items?.length ?? 0 > 0 ? (
          <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            gap={4}
            mb={1}
            p={18}
            w="full"
            color={color}
          >
            <BreadcrumbNavigation breadcrumbs={breadcrumb?.items ?? null} />
          </Flex>
        ) : (
          <></>
        )}
        <NextSeo title="User Details" />
        <Heading
          color={"black"}
          as="h1"
          size={{sm: "lg"}}
          pb={2}
          ml={5}
          display={{base: "block", sm: "inline-block", md: "none"}}
        >
          Details about: {userName == "" ? "..." : null} <i>{userName}</i>
        </Heading>
        <HStack justifyContent={"space-between"} px={6} width={"full"}>
          <Heading
            color={"black"}
            as="h1"
            width={"full"}
            size={{base: "md", sm: "md", md: "lg", lg: "lg", xl: "xl"}}
            display={{base: "none", sm: "none", md: "block"}}
          >
            Details about: {userName == "" ? "..." : null} <i>{userName}</i>
          </Heading>
          <HStack
            justifyContent={{
              base: "flex-start",
              sm: "flex-start",
              md: "flex-end"
            }}
            width={"full"}
          >
            <Tooltip label="Refresh User Data">
              <Button
                colorScheme="brandButtons"
                aria-label="Refresh User Data"
                width={{
                  base: "50%",
                  sm: "50%",
                  md: "50%",
                  lg: "40%",
                  xl: "30%",
                  "2xl": "15%"
                }}
                onClick={onRefreshUserDataClicked}
              >
                <FiRefreshCw />
              </Button>
            </Tooltip>
            <Tooltip label="Delete Promotion">
              <Button
                colorScheme="brandButtons"
                aria-label="Delete Product"
                width={{
                  base: "50%",
                  sm: "50%",
                  md: "50%",
                  lg: "40%",
                  xl: "30%",
                  "2xl": "15%"
                }}
                onClick={onOpen}
              >
                <FiTrash2 />
              </Button>
            </Tooltip>
          </HStack>
        </HStack>
        <Container maxW={"full"} pb={8}>
          <Grid
            templateRows={{
              base: "repeat(1, 1fr)",
              md: "repeat(1, 1fr)",
              sm: "repeat(1, 1fr)",
              lg: "repeat(1, 1fr)"
            }}
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(3, 1fr)",
              sm: "repeat(3, 1fr)",
              lg: "repeat(6, 1fr)"
            }}
            gap={12}
            mt={8}
            gridGap={{base: 4, sm: 4, md: 8, lg: 12}}
          >
            <GridItem rowSpan={1} colSpan={4}>
              {" "}
              <UserBasicData user={user} buyerId={buyergroupid as string} />
            </GridItem>
            <GridItem rowSpan={1} colSpan={2}>
              {" "}
              <UserCdpData
                user={user}
                buyerId={buyergroupid as string}
                cdpGuest={cdpGuestData}
              />
            </GridItem>
            <GridItem rowSpan={1} colSpan={6}>
              {" "}
              <UserOrderData user={user} buyerId={buyergroupid as string} />
            </GridItem>
            <GridItem rowSpan={1} colSpan={6}>
              {" "}
              <UserCdpSessionData
                user={user}
                buyerId={buyergroupid as string}
                cdpGuest={cdpGuestData}
              />
            </GridItem>
          </Grid>
        </Container>
      </>

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            {isDeleting ? (
              <AlertDialogHeader
                textAlign={"center"}
                fontSize="lg"
                fontWeight="bold"
              >
                Deleting... <BrandedSpinner />
              </AlertDialogHeader>
            ) : (
              <>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete Promotion
                </AlertDialogHeader>

                <AlertDialogBody>
                  Are you sure? You can&apos;t undo this action afterwards.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button onClick={onClose}>Cancel</Button>
                  <Button colorScheme="red" onClick={onDelete} ml={3}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </>
            )}
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default UserDetails
