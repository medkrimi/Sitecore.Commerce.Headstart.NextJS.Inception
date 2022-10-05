import {createAsyncThunk, createSlice, SerializedError} from "@reduxjs/toolkit"
import {
  Me,
  Product,
  Products,
  RequiredDeep,
  Spec,
  Specs,
  Variant
} from "ordercloud-javascript-sdk"
import {createOcAsyncThunk} from "../ocReduxHelpers"
import {OcThunkApi} from "../ocStore"
import {cacheProduct, ocProductCacheSelectors} from "../ocProductCache"
import {ProductXPs} from "lib/types/ProductXPs"

interface OcProductDetailState {
  error?: SerializedError
  product?: RequiredDeep<Product<ProductXPs>>
  specs?: RequiredDeep<Spec>[]
  variants?: RequiredDeep<Variant>[]
}

const initialState: OcProductDetailState = {}

const getProductSpecs = createOcAsyncThunk<RequiredDeep<Spec>[], string>(
  "ocProductDetail/getSpecs",
  async (productId) => {
    const response = await Products.ListSpecs(productId, {pageSize: 100})
    return response.Items
  }
)

const getProductVariants = createOcAsyncThunk<RequiredDeep<Variant>[], string>(
  "ocProductDetail/getVariants",
  async (productId) => {
    const response = await Products.ListVariants(productId, {pageSize: 100})
    return response.Items
  }
)

export const setProductId = createAsyncThunk<
  RequiredDeep<Product<ProductXPs>>,
  string,
  OcThunkApi
>("ocProductDetail/setProductId", async (productId, ThunkAPI) => {
  // TODO Cause I have no idea how to clear the cache in advance I have to remove cache element retrieval
  // let product = ocProductCacheSelectors.selectById(
  //   ThunkAPI.getState(),
  //   productId
  // )

  let product = null
  if (!product) {
    console.log(productId)
    product = await Products.Get<Product<ProductXPs>>(productId)
    ThunkAPI.dispatch(cacheProduct(product))
  }

  ThunkAPI.dispatch(getProductSpecs(product.ID))
  ThunkAPI.dispatch(getProductVariants(product.ID))
  return product
})

const ocProductDetailSlice = createSlice({
  name: "ocProductDetail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setProductId.pending, (state) => {
      state.error = undefined
      state.specs = undefined
      state.variants = undefined
      state.product = undefined
    })
    builder.addCase(setProductId.fulfilled, (state, action) => {
      state.product = action.payload
    })
    builder.addCase(setProductId.rejected, (state, action) => {
      state.error = action.error
    })
    builder.addCase(getProductSpecs.fulfilled, (state, action) => {
      state.specs = action.payload
    })
    builder.addCase(getProductVariants.fulfilled, (state, action) => {
      state.variants = action.payload
    })
  }
})

export default ocProductDetailSlice.reducer
