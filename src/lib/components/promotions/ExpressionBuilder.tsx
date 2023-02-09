import * as ReactDnD from "react-dnd"
import * as ReactDndHtml5Backend from "react-dnd-html5-backend"
import {ChakraProvider, extendTheme} from "@chakra-ui/react"
import {QueryBuilder} from "react-querybuilder"
import {QueryBuilderChakra} from "@react-querybuilder/chakra"
import {QueryBuilderDnD} from "@react-querybuilder/dnd"
import {fields} from "./fileds"
import {useState} from "react"
import {defaultQuery} from "lib/constants/app-promotions.config"

const chakraTheme = extendTheme()

export const ExpressionBuilder = () => {
  const [query, setQuery] = useState(defaultQuery)

  return (
    <QueryBuilderDnD dnd={{...ReactDnD, ...ReactDndHtml5Backend}}>
      <ChakraProvider theme={chakraTheme}>
        <QueryBuilderChakra>
          <QueryBuilder
            fields={fields}
            query={query}
            onQueryChange={(q) => setQuery(q)}
            addRuleToNewGroups
            showCombinatorsBetweenRules
          />
        </QueryBuilderChakra>
      </ChakraProvider>
    </QueryBuilderDnD>
  )
}
