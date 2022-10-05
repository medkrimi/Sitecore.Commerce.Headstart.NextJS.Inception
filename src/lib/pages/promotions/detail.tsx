import {
  Flex,
  Heading,
  HStack,
  Tooltip,
  Grid,
  GridItem,
  Button,
  Container,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogBody,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogHeader,
  useDisclosure
} from "@chakra-ui/react"
import BrandedSpinner from "lib/components/branding/BrandedSpinner"
import BreadcrumbNavigation from "lib/components/navigation/BreadcrumbNavigation"
import PromotionBasicData from "lib/components/promotions/PromotionBasicData"
import PromotionBuyers from "lib/components/promotions/PromotionBuyers"
import PromotionXpInformation from "lib/components/promotions/PromotionXpInformation"
import {PromotionXPs} from "lib/types/PromotionXPs"
import {NextSeo} from "next-seo"
import {useRouter} from "next/router"
import {Promotion, Promotions} from "ordercloud-javascript-sdk"
import React from "react"
import {useEffect, useState} from "react"
import {FiRefreshCw, FiTrash2} from "react-icons/fi"

const PromotionDetails = () => {
  const router = useRouter()

  const {id} = router.query
  const [promotionName, setPromotionName] = useState("")
  const [breadcrumb, setBreadcrumb] = useState<Breadcrumb>()
  const [isDeleting, setIsDeleting] = useState(false)
  const [promotion, setPromotion] = useState<Promotion<PromotionXPs>>(null)

  const {isOpen, onOpen, onClose} = useDisclosure()
  const cancelRef = React.useRef()

  interface BreadcrumbItem {
    name: string
    url: string
  }
  interface Breadcrumb {
    items: BreadcrumbItem[]
  }

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
    // TODO: Add 404 Handling if promotion really does not exist
    const doSetBreadcrumb = () => {
      const breadcrumbItems: BreadcrumbItem[] = [
        {
          name: "Home",
          url: "/admin"
        },
        {
          name: "Promotions",
          url: "/promotions"
        },
        {
          name: promotion?.Name ?? "...",
          url: "/promotions/" + promotion?.ID ?? ""
        }
      ]
      const tmpbreadcrumb: Breadcrumb = {
        items: breadcrumbItems
      }
      setBreadcrumb(tmpbreadcrumb)
    }
    async function doGetPromotion() {
      if (id != promotion?.ID) {
        const promotion = await Promotions.Get(id as string)
        setPromotion(promotion)
      }
    }

    doGetPromotion()
    setPromotionName(promotion?.Name ?? "")
    doSetBreadcrumb()
  }, [id, promotion])

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
            color={"black"}
          >
            <BreadcrumbNavigation breadcrumbs={breadcrumb?.items ?? null} />
          </Flex>
        ) : (
          <></>
        )}
        <NextSeo title="Promotion Details" />
        <Heading
          color={"black"}
          as="h1"
          size={{sm: "lg"}}
          pb={2}
          ml={5}
          display={{base: "block", sm: "inline-block", md: "none"}}
        >
          Promotion Detail Page: {promotionName == "" ? "..." : null}{" "}
          <i>{promotionName}</i>
        </Heading>
        <HStack justifyContent={"space-between"} px={6} width={"full"}>
          <Heading
            color={"black"}
            as="h1"
            width={"full"}
            size={{base: "md", sm: "md", md: "lg", lg: "lg", xl: "xl"}}
            display={{base: "none", sm: "none", md: "block"}}
          >
            Promotion Detail Page: {promotionName == "" ? "..." : null}{" "}
            <i>{promotionName}</i>
          </Heading>
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
                colorScheme="purple"
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
                colorScheme="purple"
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

export default PromotionDetails
