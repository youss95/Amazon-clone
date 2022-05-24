import { logout } from "../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../hooks/redux/hooks";

const Home = () => {
  const dispatch = useAppDispatch();
  const { isLoading, isSuccess, user } = useAppSelector((state) => state.auth);
  const logoutHandler = () => {
    dispatch(logout());
  };
  return (
    <div>
      <h1>Hoem</h1>
      <a onClick={logoutHandler}>Logout</a>
      {user?.email}
    </div>
  );
};

export default Home;
