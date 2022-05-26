import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cart } from "./models/Cart";
import { ProductDocument } from "./models/Product";
import productService from "./services/productService";
interface AsyncState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

interface ProductState extends AsyncState {
  products: ProductDocument[];
  cart: Cart;
}

const initialState: ProductState = {
  products: [],
  cart: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
};
const modifyQtyByOne = (
  cart: Cart,
  selectedProduct: ProductDocument,
  modificationType: "INCREMENT" | "DECREMENT"
) => {
  const previousCart = [...cart];
  //장바구니에 상품을 추가할때 카트에 상품이 있다면
  const productInCart = previousCart.find(
    (product) => product._id === selectedProduct._id
  );

  let newCart = [];
  //중복 상품이 없다면
  if (!productInCart) {
    previousCart.push({ ...selectedProduct, quantity: 1 });
    newCart = previousCart;
  } else {
    //있다면
    //filterCart :  타겟 상품외 카트의 상품들
    const filteredCart = previousCart.filter(
      (p) => p._id !== productInCart._id
    );
    //카트에 존재하는 상품의 수량 + 1
    const modification = modificationType === "INCREMENT" ? 1 : -1;
    productInCart.quantity = productInCart?.quantity + modification;
    //상품 수량 0개가 되었다면 (그 상품 삭제)
    if (productInCart.quantity === 0) {
      newCart = [...filteredCart];
    } else {
      //타겟상품외 카트의 상품들 + 수량이 조정된 상품
      newCart = [...filteredCart, productInCart];
    }
  }
  return newCart;
};
export const getProducts = createAsyncThunk("product", async () => {
  try {
    return await productService.getProducts();
  } catch (e) {
    console.log(e);
  }
});

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    incrementProduct: (state, action: PayloadAction<ProductDocument>) => {
      const modifiedCart = modifyQtyByOne(
        state.cart,
        action.payload,
        "INCREMENT"
      );
      state.cart = modifiedCart;
    },
    decrementProduct: (state, action: PayloadAction<ProductDocument>) => {
      const modifiedCart = modifyQtyByOne(
        state.cart,
        action.payload,
        "DECREMENT"
      );
      state.cart = modifiedCart;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = action.payload?.data || [];
      })
      .addCase(getProducts.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.products = [];
      });
  },
});

export const { incrementProduct } = productSlice.actions;

export default productSlice.reducer;
