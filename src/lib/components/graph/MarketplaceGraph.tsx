import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Flex,
  HStack,
  Heading,
  IconButton,
  ListIcon,
  ListItem,
  Menu,
  MenuItem,
  Text,
  Tooltip
} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import {
  TbBuildingBank,
  TbBuildingStore,
  TbBuildingWarehouse,
  TbChevronDown,
  TbEdit,
  TbTrash,
  TbUser,
  TbUsers
} from "react-icons/tb"
import {Tree, TreeNode} from "react-organizational-chart"
import {useDrag, useDrop} from "react-dnd"

import {ChakraProvider} from "@chakra-ui/react"
import {DndProvider} from "react-dnd"
import {HTML5Backend} from "react-dnd-html5-backend"
import _ from "lodash"
import router from "next/router"

//import organization from "./org.json"

// const useStyles = makeStyles((theme) => ({
//   root: {
//     background: "white",
//     display: "inline-block",
//     borderRadius: 16
//   },
//   expand: {
//     transform: "rotate(0deg)",
//     marginTop: -10,
//     marginLeft: "auto",
//     transition: theme.transitions.create("transform", {
//       duration: theme.transitions.duration.short
//     })
//   },
//   expandOpen: {
//     transform: "rotate(180deg)"
//   },
//   avatar: {
//     backgroundColor: "#ECECF4"
//   }
// }));

const newLocal = <IconButton aria-label="Search database" icon={<TbChevronDown />} color="primary" />
function Organization({org, onCollapse, collapsed}) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const [{canDrop, isOver}, drop] = useDrop({
    accept: "usergroup",
    drop: () => ({name: org.entityName}),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  })
  const isActive = canDrop && isOver
  let backgroundColor = "white"
  if (isActive) {
    backgroundColor = "#ddffd2"
  } else if (canDrop) {
    backgroundColor = "#ffeedc"
  }
  return (
    <Card size="xs" ref={drop} bg={{backgroundColor}} align="center">
      <CardHeader>
        <EntityAvatar entityType={org.entityType} />
      </CardHeader>
      <CardBody>
        <Heading size="xs">{org.entityName}</Heading>
      </CardBody>
      <CardFooter>
        <TbEdit />
        <TbTrash />
        {org.entityRelationship?.length > 0 && <TbChevronDown onClick={onCollapse} />}
      </CardFooter>
    </Card>
  )
}

function EntityAvatar({entityType}) {
  switch (entityType) {
    case "Buyer": {
      return <Avatar icon={<TbBuildingStore fontSize="1.5rem" color="#38B2AC" />} bg="#EDF2F7" />
    }
    case "Supplier": {
      return <Avatar icon={<TbBuildingWarehouse fontSize="1.5rem" color="#171923" />} bg="#EDF2F7" />
    }
    case "UserGroup": {
      return <Avatar icon={<TbUsers fontSize="1.5rem" color="#9F7AEA" />} bg="#EDF2F7" />
    }
    case "User": {
      return <Avatar icon={<TbUser fontSize="1.5rem" color="#DD6B20" />} bg="#EDF2F7" />
    }
    default: {
      // Seller
      return <Avatar icon={<TbBuildingBank fontSize="1.5rem" color="#E53E3E" />} bg="#EDF2F7" />
    }
  }
}

// function UserGroup({usergroup}) {
//   const [{isDragging}, drag] = useDrag({
//     type: "userGroup",
//     item: {name: usergroup.name},
//     end: (item, monitor) => {
//       const dropResult = monitor.getDropResult()
//       if (item && dropResult) {
//         alert(`You moved ${item.name} to ${dropResult.name}`)
//       }
//     },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging()
//     })
//   })
//   return (
//     <Card ref={drag} align="center">
//       <CardHeader>
//         <Avatar icon={<TbUsers fontSize="1.5rem" color="#9F7AEA" />} bg="#EDF2F7" />
//       </CardHeader>
//       <CardBody>
//         <Heading size="md">{usergroup.name}</Heading>
//       </CardBody>
//       <CardFooter></CardFooter>
//     </Card>
//   )
// }
// function User({user}) {
//   return (
//     <Card align="center">
//       <CardHeader>
//         <Avatar icon={<TbUser fontSize="1.5rem" color="#F6AD55" />} bg="#EDF2F7" />
//       </CardHeader>
//       <CardBody>
//         <Heading size="md">{user.name}</Heading>
//       </CardBody>
//       <CardFooter></CardFooter>
//     </Card>
//   )
// }
function Node({o, parent}) {
  const [collapsed, setCollapsed] = useState(o.collapsed)
  const handleCollapse = () => {
    setCollapsed(!collapsed)
  }
  useEffect(() => {
    o.collapsed = collapsed
  })
  const T = parent
    ? TreeNode
    : (props) => (
        <Tree {...props} lineWidth={"2px"} lineColor={"#bbc"} lineBorderRadius={"12px"}>
          {props.children}
        </Tree>
      )
  return collapsed ? (
    <T label={<Organization org={o} onCollapse={handleCollapse} collapsed={collapsed} />} />
  ) : (
    <T label={<Organization org={o} onCollapse={handleCollapse} collapsed={collapsed} />}>
      {/* {_.map(o.usergroup, (usergroup) => (
        <TreeNode label={<UserGroup usergroup={usergroup} />}>
          <TreeNode label={<User user={usergroup.user} />} />
        </TreeNode>
      ))} */}
      {_.map(o.entityRelationship, (c) => (
        <Node o={c} parent={o} />
      ))}
    </T>
  )
}

export default function MarketplaceGraph({organization}) {
  console.log("Component")
  console.log(organization)
  return (
    <ChakraProvider>
      <Box padding={4} height="80vh">
        <DndProvider backend={HTML5Backend}>
          <Node o={organization} parent={""} />
        </DndProvider>
      </Box>
    </ChakraProvider>
  )
}
