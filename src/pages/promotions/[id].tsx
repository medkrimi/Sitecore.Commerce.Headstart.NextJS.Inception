import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ColorModeScript,
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
import {FiRefreshCw, FiTrash2} from "react-icons/fi"
import {Promotion, Promotions} from "ordercloud-javascript-sdk"
import {useEffect, useState} from "react"

import BrandedSpinner from "lib/components/branding/BrandedSpinner"
import {NextSeo} from "next-seo"
import PromotionBasicData from "lib/components/promotions/PromotionBasicData"
import PromotionBuyers from "lib/components/promotions/PromotionBuyers"
import {PromotionXPs} from "lib/types/PromotionXPs"
import PromotionXpInformation from "lib/components/promotions/PromotionXpInformation"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import React from "react"
import {appPermissions} from "lib/constants/app-permissions.config"
import {useRouter} from "next/router"

const PromotionDetails = () => {
  const router = useRouter()

  const {id} = router.query
  const [promotionName, setPromotionName] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [promotion, setPromotion] = useState<Promotion<PromotionXPs>>(null)
  const color = useColorModeValue("textColor.900", "textColor.100")
  const {isOpen, onOpen, onClose} = useDisclosure()
  const cancelRef = React.useRef()

  const onRefreshPromotionDataClicked = async () => {
    setPromotion(null)
    if (promotion) {
      const newPromotionData = await Promotions.Get(promotion?.ID)
      setPromotion(newPromotionData)
    }
  }

  const onDelete = (e) => {
    setIsDeleting(true)
    e.preventDefault()
    Promotions.Delete(promotion.ID)
    setTimeout(() => {
      setIsDeleting(false)
      onClose()
      router.push("/promotions")
    }, 4000)
  }

  useEffect(() => {
    async function doGetPromotion() {
      if (id != promotion?.ID) {
        const promotion = await Promotions.Get(id as string)
        setPromotion(promotion)
      }
    }

    doGetPromotion()
    setPromotionName(promotion?.Name ?? "")
  }, [id, promotion])

  return (
    <>
      <>
        <NextSeo title="Promotion Details" />
        <HStack justifyContent={"space-between"} px={6} width={"full"}>
          <HStack
            justifyContent={{
              base: "flex-start",
              sm: "flex-start",
              md: "flex-end"
            }}
            width={"full"}
          >
            <Tooltip label="Refresh Promotion Data">
              <Button
                colorScheme="brandButtons"
                aria-label="Refresh Promotion Data"
                width={{
                  base: "50%",
                  sm: "50%",
                  md: "50%",
                  lg: "40%",
                  xl: "30%",
                  "2xl": "15%"
                }}
                onClick={onRefreshPromotionDataClicked}
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
            <GridItem rowSpan={1} colSpan={3}>
              {" "}
              <PromotionBasicData promotion={promotion} />
            </GridItem>

            <GridItem rowSpan={1} colSpan={3}>
              {" "}
              <PromotionBuyers promotion={promotion} />
            </GridItem>
            <GridItem rowSpan={1} colSpan={2}>
              {" "}
              <PromotionXpInformation promotion={promotion} />
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

const ProtectedPromotionDetails = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.ProductManager}>
      <PromotionDetails />
    </ProtectedContent>
  )
}

export default ProtectedPromotionDetails
