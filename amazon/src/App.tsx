import { ThemeProvider } from "@emotion/react";
import { theme } from "./shared/utils/theme";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Register from "./pages/Register";
import Signin from "./pages/Signin";
import PrivateRoute from "./features/auth/components/PrivateRoute";
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<PrivateRoute page={<Home />} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
