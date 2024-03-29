import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login/Login";

import Customer from "./components/customer/Customer";
import CartPage from "./components/cartPage/CartPage";
import ProductDetail from "./components/productList/product/ProductDetail";
import CustomerOrderPage from "./components/orderPage/CustomerOrderPage";

import Admin from "./components/admin/Admin";

import Seller from "./components/seller/Seller";

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
                  <ProtectedRoute role={"customer"}>
                    <Customer />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                exact
                path="/customer/order/delivery"
                element={
                  <ProtectedRoute role={"customer"}>
                    <CustomerOrderPage />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                exact
                path="/customer/cart"
                element={
                  <ProtectedRoute role={"customer"}>
                    <CartPage />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                exact
                path="/customer/product/details/:id"
                element={
                  <ProtectedRoute role={"customer"}>
                    <ProductDetail />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                exact
                path="/customer/search/*"
                element={
                  <ProtectedRoute role={"customer"}>
                    <Customer />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                exact
                path="/customer/browse/*"
                element={
                  <ProtectedRoute role={"customer"}>
                    <Customer />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                exact
                path="/customer/price/*"
                element={
                  <ProtectedRoute role={"customer"}>
                    <Customer />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute role={"admin"}>
                    <Admin />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/seller/*"
                element={
                  <ProtectedRoute role={"seller"}>
                    <Seller />
                  </ProtectedRoute>
                }
              ></Route>
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
