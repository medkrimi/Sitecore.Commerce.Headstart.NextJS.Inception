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

async function getById(catalogID) {
  console.log("catalogsService::getById")
  return await Catalogs.Get(catalogID)
}

async function create(catalog) {
  console.log("catalogsService::create")
  return await Catalogs.Create(catalog)
}

async function update(catalog) {
  console.log("catalogsService::update")
  return await Catalogs.Patch(catalog.ID, catalog)
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(catalogID) {
  console.log("catalogsService::_delete")
  if (catalogID) {
    return await Catalogs.Delete(catalogID)
  }
}

async function getCatalogsCountById(buyerID) {
  console.log("catalogsService::getCatalogsCountById")
  if (buyerID) {
    const catalogsList = await Catalogs.ListAssignments({buyerID: buyerID})
    return catalogsList?.Meta?.TotalCount
  } else return 0
}
