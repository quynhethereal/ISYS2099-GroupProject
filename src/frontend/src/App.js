import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login/Login";
import Customer from "./components/customer/Customer";
import BlockPage from "./components/blockPage/BlockPage";
import NotFoundPage from "./components/notFoundPage/NotFoundPage";
import { AuthProvider } from "./hook/AuthHook";
import { ProtectedRoute } from "./hook/ProtectedRoute";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route exact path="/" element={<Login />}></Route>
            <Route
              exact
              path="/customer"
              element={
                <ProtectedRoute>
                  <Customer />
                </ProtectedRoute>
              }
            ></Route>
            <Route exact path="/blocked" element={<BlockPage />}></Route>
            <Route path="*" element={<NotFoundPage />}></Route>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
