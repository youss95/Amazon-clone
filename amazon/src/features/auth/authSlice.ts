import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DisplayUser } from "./model/DisplayUserInterface";
import { Jwt } from "./model/Jwt";
import { NewUser } from "./model/NewUser";
import authService from "./services/authService";

interface AsyncState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}
interface AuthState extends AsyncState {
  user?: DisplayUser | null;
  jwt?: Jwt;
  isAuthenticated?: boolean;
}
const initialState: AuthState = {
  user: null,
  jwt: null,
  isAuthenticated: false,
  isLoading: false,
  isSuccess: false,
  isError: false,
};
//action 타입 , 비동기함수, 추가옵션
//컴포넌트에서 비동기 dispatch(register) -> 실행 -> 비동기로 post 결과 반환
export const register = createAsyncThunk(
  "auth/register",
  async (user: NewUser, thunkAPI) => {
    try {
      let result = await authService.register(user);
      console.log("result", result);
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue("Unable to register");
    }
  }
);

//pending: action dispatch
//fulfilled: 프로미스가 이행된 상태면 action dispatch
//rejected: 프로미스가 거절된 상태에서 action dispatch
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  //비동기 리듀서
  extraReducers: (builder) => {
    builder
      //REGISTER
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.user = null;
      });
  },
});

export default authSlice.reducer;
