import axios from "axios";
import jwtDecode from "jwt-decode";
import { DecodedJwt } from "../model/DecodedJwtInterface";
import { DisplayUser } from "../model/DisplayUserInterface";
import { Jwt } from "../model/Jwt";
import { LoginUser } from "../model/LoginUser";
import { NewUser } from "../model/NewUser";

const register = async (newUser: NewUser): Promise<DisplayUser | null> => {
  const resp = await axios.post(
    `${process.env.REACT_APP_BASE_API}/auth/register`,
    newUser
  );
  return resp.data;
};

const login = async (
  user: LoginUser
): Promise<{ jwt: Jwt; user: DisplayUser | null }> => {
  const resp = await axios.post(
    `${process.env.REACT_APP_BASE_API}/auth/login`,
    user
  );
  //localstorage에 토큰 저장
  if (resp.data) {
    localStorage.setItem("jwt", JSON.stringify(resp.data));

    const decodedJwt: DecodedJwt = jwtDecode(resp.data.token);
    localStorage.setItem("user", JSON.stringify(decodedJwt.user));
    return { jwt: resp.data, user: decodedJwt.user };
  }
  return { jwt: resp.data, user: null };
};

const verifyJwt = async (jwt: string): Promise<boolean> => {
  const resp = await axios.post(
    `${process.env.REACT_APP_BASE_API}/auth/verify-jwt`,
    { jwt }
  );
  if (resp.data) {
    const jwtExp = resp.data.exp * 1000;
    return jwtExp > Date.now(); //true면 valid
  }
  return false;
};

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("jwt");
};

const authService = {
  register,
  login,
  logout,
  verifyJwt,
};

export default authService;
