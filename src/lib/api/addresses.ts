import {Addresses} from "ordercloud-javascript-sdk"

export const addressesService = {
  list,
  getById,
  create,
  update,
  delete: _delete
}

async function list(buyerID) {
  console.log("userGroupsService::List")
  return await Addresses.List(buyerID)
}

async function getById(buyerID, userGroupID) {
  console.log("userGroupsService::getById")
  return await Addresses.Get(buyerID, userGroupID)
}

async function create(buyerID, user) {
  console.log("userGroups::create")
  //Demo sample : By default OrderCloud will assign a unique ID to the new created buyer.
  //Customizing the ID generation business logic here for Demo purpose.
  user.ID = user.Name.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return await Addresses.Create(buyerID, user)
}

async function update(buyerID, userGroupID, user) {
  console.log("buyersService::update")
  return await Addresses.Patch(buyerID, userGroupID, user)
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(buyerID, userGroupID) {
  console.log("buyersService::_delete")
  if (buyerID) {
    return await Addresses.Delete(buyerID, userGroupID)
  }
}
