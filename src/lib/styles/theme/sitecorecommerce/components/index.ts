import type {DeepPartial, Theme} from "@chakra-ui/react"

import {Button} from "./button"
import {Card} from "./card"

export const components: DeepPartial<Theme["components"]> = {
  Button,
  Card
}
