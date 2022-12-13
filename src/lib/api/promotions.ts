import {Promotions} from "ordercloud-javascript-sdk"

export const promotionsService = {
  getAll,
  getById,
  create,
  update,
  delete: _delete
}

async function getAll() {
  //console.log("promotionsService::getAll")
  return await Promotions.List()
}

async function getById(id) {
  //console.log("promotionsService::getById")
  return await Promotions.Get(id)
}

async function create(fields) {
  //console.log("promotionsService::create")
  //console.log(fields)
  //Demo sample : By default OrderCloud will assign a unique ID to the newly created order.
  //Customizing the ID generation business logic here for Demo purpose.
  fields.ID = fields.Name.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

  //Promotions.Create(fields)
}

async function update(fields) {
  //console.log("promotionsService::update")
  //console.log(fields)
  //Promotions.Patch(fields.ID, fields)
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(id) {
  //console.log("promotionsService::_delete")
  if (id) {
    return await Promotions.Delete(id)
  }
}
