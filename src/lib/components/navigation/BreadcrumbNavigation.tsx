import {Breadcrumb, BreadcrumbItem, BreadcrumbLink} from "@chakra-ui/react"

import {IoIosArrowForward} from "react-icons/io"

const BreadcrumbNavigation = ({breadcrumbs}) => {
  return (
    <Breadcrumb separator={<IoIosArrowForward />}>
      {breadcrumbs.map((breadcrumb, index) => {
        const current = index === breadcrumbs.length - 1
        return (
          <BreadcrumbItem key={index} isCurrentPage={current}>
            <BreadcrumbLink
              href={breadcrumb.url}
              color={current ? "brand.700" : "unset"}
            >
              {breadcrumb.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        )
      })}
    </Breadcrumb>
  )
}

export default BreadcrumbNavigation
