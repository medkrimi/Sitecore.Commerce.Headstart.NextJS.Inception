import {Box, Progress, Heading, Tooltip} from "@chakra-ui/react"
import {ProductXPs} from "lib/types/ProductXPs"
import {Product, RequiredDeep} from "ordercloud-javascript-sdk"
import {useState, useEffect} from "react"

type ProductDataProps = {
  product: RequiredDeep<Product<ProductXPs>>
}

export function CalculateEditorialProcess(
  product: Product<ProductXPs>
): number {
  // TODO: Currently hardcoded, but the idea gets clear
  var totalNumberOfFieldsToEdit = 4
  var currentNumberOfEditedFields = 0

  if ((product?.Description ?? "") != "") {
    currentNumberOfEditedFields++
  }
  if ((product?.DefaultPriceScheduleID ?? "") != "") {
    currentNumberOfEditedFields++
  }
  if (product?.Active ?? false) {
    currentNumberOfEditedFields++
  }
  if ((product?.xp?.Images[0].Url ?? "") != "") {
    currentNumberOfEditedFields++
  }

  var calculatedEditorialProgress =
    (currentNumberOfEditedFields / totalNumberOfFieldsToEdit) * 100

  return calculatedEditorialProgress
}

export default function EditorialProgressBar({product}: ProductDataProps) {
  const [editorialProgress, setEditorialProgress] = useState(0)
  const [progressColor, setProgressColor] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)

    var calculatedEditorialProgress = CalculateEditorialProcess(product)
    setEditorialProgress(calculatedEditorialProgress)

    let colorSchema = ""
    if (calculatedEditorialProgress == 0) {
      colorSchema = "blue"
    }
    if (calculatedEditorialProgress <= 25) {
      colorSchema = "red"
    } else if (
      calculatedEditorialProgress > 25 &&
      calculatedEditorialProgress <= 50
    ) {
      colorSchema = "orange"
    } else if (
      calculatedEditorialProgress > 50 &&
      calculatedEditorialProgress <= 75
    ) {
      colorSchema = "yellow"
    } else {
      colorSchema = "green"
    }
    setProgressColor(colorSchema)
    setIsLoading(false)
  }, [product])

  return (
    <>
      <Progress
        hasStripe={true}
        isIndeterminate={!product}
        value={editorialProgress}
        size={"lg"}
        colorScheme={product ? progressColor : "blue"}
      />
      <Tooltip label="Please fill out IMAGE, DESCRIPTION, DEFAULTPRICESCHEDULEID and enable ISACTIVE">
        <Heading mt={2} size={"md"} color={"black"}>
          Editorial Progress{" "}
          {product && !isLoading ? ": " + editorialProgress + "%" : "..."}
        </Heading>
      </Tooltip>
    </>
  )
}
