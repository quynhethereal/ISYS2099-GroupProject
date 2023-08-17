import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login/Login";

import Customer from "./components/customer/Customer";
import CartPage from "./components/cartPage/CartPage";
import ProductDetail from "./components/productList/product/ProductDetail";

import Admin from "./components/admin/Admin";
// import WarehouseList from "./components/warehouseList/WarehouseList";

import BlockPage from "./components/blockPage/BlockPage";
import NotFoundPage from "./components/notFoundPage/NotFoundPage";

import { AuthProvider } from "./hook/AuthHook";
import { CartProvider } from "./hook/CartHook";
import { ProtectedRoute } from "./hook/ProtectedRoute";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <CartProvider>
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
              <Route
                exact
                path="/customer/cart"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                exact
                path="/customer/product/details/:id"
                element={
                  <ProtectedRoute>
                    <ProductDetail />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              ></Route>
              {/* <Route
                exact
                path="/admin/warehouse"
                element={
                  <ProtectedRoute>
                    <WarehouseList />
                  </ProtectedRoute>
                }
              ></Route> */}
              <Route exact path="/blocked" element={<BlockPage />}></Route>
              <Route path="*" element={<NotFoundPage />}></Route>
            </Routes>
          </CartProvider>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
