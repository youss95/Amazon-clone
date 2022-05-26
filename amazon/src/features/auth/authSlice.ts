import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { DisplayUser } from "./model/DisplayUserInterface";
import { Jwt } from "./model/Jwt";
import { LoginUser } from "./model/LoginUser";
import { NewUser } from "./model/NewUser";
import authService from "./services/authService";

const storedUser: string | null = localStorage.getItem("user");
const user: DisplayUser | null = !!storedUser ? JSON.parse(storedUser) : null;

const storedJwt: string | null = localStorage.getItem("jwt");
const jwt: Jwt = !!storedJwt ? JSON.parse(storedJwt) : null;
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
  user: user,
  jwt: jwt,
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

export const login = createAsyncThunk(
  "auth/login",
  async (user: LoginUser, thunkAPI) => {
    try {
      let result = await authService.login(user);
      console.log("loginresult", result);
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue("Unable to login");
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

export const verifyJwt = createAsyncThunk(
  "auth/verify-jwt",
  async (jwt: string, thunkAPI) => {
    try {
      return await authService.verifyJwt(jwt);
    } catch (error) {
      return thunkAPI.rejectWithValue("Unable to verify");
    }
  }
);

//pending: action dispatch
//fulfilled: 프로미스가 이행된 상태면 action dispatch
//rejected: 프로미스가 거절된 상태에서 action dispatch
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
    },
  },
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
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.jwt = action.payload.jwt;
        state.isAuthenticated = true;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.user = null;
        state.isAuthenticated = false;
      })
      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.jwt = null;
        state.isAuthenticated = false;
      })
      // VERIFY JWT
      .addCase(verifyJwt.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyJwt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isAuthenticated = action.payload;
      })
      .addCase(verifyJwt.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isAuthenticated = false;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
export const selectedUser = (state: RootState) => {
  return state.auth;
};
