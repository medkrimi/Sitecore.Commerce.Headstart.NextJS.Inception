import {Buyer, Buyers, Catalogs, Users} from "ordercloud-javascript-sdk"

export const buyerService = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  getUsersCountById,
  getCatalogsCountById
}

async function getAll() {
  console.log("buyerService::getAll")
  return await Buyers.List()
}

async function getById(id) {
  console.log("buyerService::getById")
  return await Buyers.Get(id)
}

async function create(fields) {
  console.log("buyerService::create")
  //Demo sample : By default OrderCloud will assign a unique ID to the new created buyer.
  //Customizing the ID generation business logic here for Demo purpose.
  fields.ID = fields.Name.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return await Buyers.Create(fields)
}

async function update(fields) {
  console.log("buyerService::update")
  console.log(fields)
  //PrepareData(fields) - xp_strong
  return await Buyers.Patch(fields.ID, fields)
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(buyerId) {
  console.log("buyerService::_delete")
  if (buyerId) {
    return await Buyers.Delete(buyerId)
  }
}

async function getUsersCountById(buyerId) {
  console.log("buyerService::getUsersCountById")
  if (buyerId) {
    const usersList = await Users.List(buyerId)
    return usersList?.Meta?.TotalCount
  } else return "-"
}

async function getCatalogsCountById(buyerId) {
  console.log("buyerService::getCatalogsCountById")
  if (buyerId) {
    const catalogsList = await Catalogs.ListAssignments({buyerID: buyerId})
    return catalogsList?.Meta?.TotalCount
  } else return "-"
}
