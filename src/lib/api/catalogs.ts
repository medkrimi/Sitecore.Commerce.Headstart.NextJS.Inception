import {Catalogs} from "ordercloud-javascript-sdk"

export const catalogsService = {
  list,
  getById,
  create,
  update,
  delete: _delete,
  getCatalogsCountById
}

async function list() {
  console.log("catalogsService::List")
  return await Catalogs.List()
}

async function getById(buyerID) {
  console.log("catalogsService::getById")
  return await Catalogs.Get(buyerID)
}

async function create(buyer) {
  console.log("catalogsService::create")
  return await Catalogs.Create(buyer)
}

async function update(buyer) {
  console.log("catalogsService::update")
  return await Catalogs.Patch(buyer.ID, buyer)
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(buyerID) {
  console.log("catalogsService::_delete")
  if (buyerID) {
    return await Catalogs.Delete(buyerID)
  }
}

async function getCatalogsCountById(buyerID) {
  console.log("catalogsService::getCatalogsCountById")
  if (buyerID) {
    const catalogsList = await Catalogs.ListAssignments({buyerID: buyerID})
    return catalogsList?.Meta?.TotalCount
  } else return 0
}
