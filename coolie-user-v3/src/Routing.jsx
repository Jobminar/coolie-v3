import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { CategoryProvider } from "./context/CategoryContext";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home/home";
import Header from "./components/Header/header";
import Services from "./pages/SERVICES/Services";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import { OrdersProvider } from "./context/OrdersContext";
import { MessagingProvider } from "./context/MessagingContext";
import Footer from "./components/Footer/footer";
import Aboutus from "./components/Aboutus/aboutus";
import WorkerComponent from "./pages/WorkerComponent";
import Userprofile from "./pages/USER-PROFILE/user-profile";
import Addresses from "./pages/USER-PROFILE/ADDRESSES/addresses";
import Bookings from "./pages/USER-PROFILE/BOOKINGS/Bookings.jsx";
import Wallet from "./pages/USER-PROFILE/WALLET/wallet.jsx";
import Invite from "./pages/USER-PROFILE/INVITEAFRIEND/invite.jsx";
import Coupons from "./pages/USER-PROFILE/COUPONS/coupons.jsx";
import Rewards from "./pages/USER-PROFILE/MY-REWARDS/rewards.jsx";
import OrderTracking from "./pages/OrderTracking/OrderTracking.jsx";
import CartPage from "./pages/CartPage.jsx";
import Privacypolicy from "./components/Footer/privacypolicy.jsx";

const Routing = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <CategoryProvider>
          <MessagingProvider>
            <OrdersProvider>
              {" "}
              {/* Wrap your application with MessagingProvider */}
              <Router>
                <Header />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/ordertracking" element={<OrderTracking />} />

                  <Route element={<ProtectedRoute />}>
                    <Route path="/aboutus" element={<Aboutus />} />
                    <Route path="/workers" element={<WorkerComponent />} />
                    <Route path="/userprofile" element={<Userprofile />} />
                    <Route path="/addresses" element={<Addresses />} />
                    <Route path="/bookings" element={<Bookings />} />
                    <Route path="/wallet" element={<Wallet />} />
                    <Route path="/invite" element={<Invite />} />
                    <Route path="/coupons" element={<Coupons />} />
                    <Route path="/rewards" element={<Rewards />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/privacypolicy" element={<Privacypolicy/>} />
                  </Route>
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                <Footer />
              </Router>
            </OrdersProvider>
          </MessagingProvider>
        </CategoryProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default Routing;
