import { BrowserRouter, Route,Routes, Link } from "react-router-dom";
import Login  from "./Components/Login";
import Signup from "./Components/Signup";
import Landing from './Components/Landing';
import BookingPage from './Components/BookingPage';
import BaggageAddOn from "./Components/BaggageAddOn";
import FoodAddOn from "./Components/FoodAddOn";
import SeatSelectionPage from "./Components/SeatSelectionPage";
import PaymentPage from "./Components/PaymentPage";
import AfterPaymentPage from "./Components/AfterPaymentPage";
import ReviewDetails from "./Components/ReviewDetails";
import ViewMyProfile from "./Components/viewMyProfile";
import ViewMyFlights from "./Components/viewMyFlights";
function App() {
  return (
   <BrowserRouter>
   <Routes>
    <Route path="" element={<Landing/>}></Route>
    <Route path="/login" element={<Login/>}></Route>
    <Route path="/signup" element={<Signup/>}> </Route>
    <Route path="/landing" element={<Landing/>}> </Route>
    <Route path="/bookingStart" element={<BookingPage/>}> </Route>
    <Route path="/baggageDetails" element={<BaggageAddOn/>}> </Route>
    <Route path="/foodDetails" element={<FoodAddOn/>}> </Route>
    <Route path="/seatSelectionPage" element={<SeatSelectionPage/>} > </Route>
    <Route path="/paymentPage" element={<PaymentPage/>} > </Route>
    <Route path="/AfterPaymentPage" element={<AfterPaymentPage/>} > </Route>
    <Route path="/ReviewDetails" element={<ReviewDetails/>} > </Route>
    <Route path="/ViewMyProfile" element={<ViewMyProfile/>} > </Route>
    <Route path="/viewMyFlights" element={<ViewMyFlights/>} > </Route>
   </Routes>
   </BrowserRouter>
  );
}

export default App;