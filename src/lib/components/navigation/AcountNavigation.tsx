import {
  Menu,
  Button,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  HStack,
  Link,
  IconButton
} from "@chakra-ui/react"

import {HiOutlineLockClosed} from "react-icons/hi"
import NextLink from "next/link"
import {ChevronDownIcon} from "@chakra-ui/icons"

const MobileNavigation = () => {
  return (
    <HStack>
      <NextLink href="/account/favorites" passHref>
        <Link>
          <IconButton
            icon={<HiOutlineLockClosed />}
            aria-label="Member Sign-In"
            variant="link"
          />
        </Link>
      </NextLink>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          My Account
        </MenuButton>
        <MenuList>
          <MenuItem>Billing Information</MenuItem>
          <MenuItem>Shipping Information</MenuItem>
          <MenuItem>My Orders</MenuItem>
          <MenuItem>Saved Credit Cards</MenuItem>
          <MenuItem>Favorite Products</MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  )
}

export default MobileNavigation
