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
    .then((buyer) => buyer)
    .catch((error) => handleOrderCloudErrors(error))
}

async function create(buyer: Buyer) {
  console.log("buyerService::create")
  Buyers.Create(buyer)
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

async function update(id, params) {
  console.log("buyerService::update")
  return Promise<any>
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(buyerId) {
  console.log("buyerService::_delete")
  if (buyerId)
  return await Buyers.Delete(buyerId)
  else 

}

// helper function
function handleOrderCloudErrors(error) {
  if (error.isOrderCloudError) {
    // the request was made and the API responded with a status code
    // that falls outside of the range of 2xx, the error will be of type OrderCloudError
    // https://ordercloud-api.github.io/ordercloud-javascript-sdk/classes/orderclouderror
    console.log(error.message)
    console.log(JSON.stringify(error.errors, null, 4))
  } else if (error.request) {
    // the request was made but no response received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js
    console.log(error.request)
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log("Error", error.message)
  }
}
