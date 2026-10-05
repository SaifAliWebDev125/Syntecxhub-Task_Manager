import { Navigate } from "react-router-dom";

// Access token in localStorage is enough to gate the route client-side —
// the API still re-verifies on every request via the auth middleware.
const PrivateRoute = ({ children }) => {
  const hasToken = Boolean(localStorage.getItem("accessToken"));
  return hasToken ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
