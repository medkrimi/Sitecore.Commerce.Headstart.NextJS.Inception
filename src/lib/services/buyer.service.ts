import {Buyer, Buyers} from "ordercloud-javascript-sdk"

export const buyerService = {
  getAll,
  getById,
  create,
  update,
  delete: _delete
}

async function getAll() {
  console.log("buyerService::getAll")
  return await Buyers.List()
}

async function getById(id) {
  console.log("buyerService::getById")
  return Buyers.Get(id)
}

function create(params) {
  console.log("buyerService::create")
  return Promise<any>
}

function update(id, params) {
  console.log("buyerService::update")
  return Promise<any>
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(id) {
  console.log("buyerService::deleteAll")
  return Promise<any>
}

// helper function
function handleResponse(response) {
  debugger
  console.log(response)
  return response.catch((error) => {
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
    return Promise.reject(error)
  })
}
