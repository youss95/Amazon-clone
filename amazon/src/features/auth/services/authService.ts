import axios from "axios";
import { DisplayUser } from "../model/DisplayUserInterface";
import { NewUser } from "../model/NewUser";

const register = async (newUser: NewUser): Promise<DisplayUser | null> => {
  const resp = await axios.post(
    `${process.env.REACT_APP_BASE_API}/auth/register`,
    newUser
  );
  return resp.data;
};

const authService = {
  register,
  //login,
  //logout,
  //verifyJwt,
};

export default authService;
