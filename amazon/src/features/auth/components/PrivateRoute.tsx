import React from "react";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux/hooks";
import { verifyJwt } from "../authSlice";

/*
 *  페이지 시큐리티
 */
const PrivateRoute = ({ page }: { page: JSX.Element }) => {
  const dispatch = useAppDispatch();
  const { isSuccess, isAuthenticated, jwt } = useAppSelector(
    (state) => state.auth
  );
  useEffect(() => {
    if (!jwt || !jwt?.token) return;
    dispatch(verifyJwt(jwt.token));
    console.log("authenticated");
  }, [jwt, isSuccess, dispatch]);
  return isAuthenticated ? page : <Navigate replace to="/signin" />;
};

export default React.memo(PrivateRoute);
