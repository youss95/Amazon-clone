import { DisplayUser } from "./DisplayUserInterface";

export interface DecodedJwt {
  user: DisplayUser;
  exp: number;
  iat: number;
}
