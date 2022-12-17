import {Buyer, Buyers, Catalogs, Users} from "ordercloud-javascript-sdk"

export const buyersService = {
  list,
  getById,
  create,
  update,
  delete: _delete,
  getUsersCountById,
  getCatalogsCountById
}

async function list() {
  console.log("buyersService::List")
  return await Buyers.List()
}

async function getById(buyerID) {
  console.log("buyersService::getById")
  return await Buyers.Get(buyerID)
}

async function create(buyer) {
  console.log("buyersService::create")
  //Demo sample : By default OrderCloud will assign a unique ID to the new created buyer.
  //Customizing the ID generation business logic here for Demo purpose.
  console.log(buyer)
  buyer.ID = buyer.Name.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return await Buyers.Create(buyer)
}

async function update(buyer) {
  console.log("buyersService::update")
  return await Buyers.Patch(buyer.ID, buyer)
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(buyerID) {
  console.log("buyersService::_delete")
  if (buyerID) {
    return await Buyers.Delete(buyerID)
  }
}

async function getUsersCountById(buyerID) {
  console.log("buyersService::getUsersCountById")
  if (buyerID) {
    const usersList = await Users.List(buyerID)
    return usersList?.Meta?.TotalCount
  } else return "-"
}

async function getCatalogsCountById(buyerID) {
  console.log("buyersService::getCatalogsCountById")
  if (buyerID) {
    const catalogsList = await Catalogs.ListAssignments({buyerID: buyerID})
    return catalogsList?.Meta?.TotalCount
  } else return "-"
}
