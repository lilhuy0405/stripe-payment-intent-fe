import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import './style.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Register from "./pages/Register";
import AddPaymentMethod from "./pages/AddPaymentMethod";
import MakePayment from "./pages/MakePayment";
import {useEffect} from "react";
import StripeContainer from "./components/StripeContainer";
import StripeWrapper from "./components/StripeWrapper";

function App() {
  useEffect(() => {
    const user = localStorage.getItem('stripe-demo-user')
    if (!user) {
      window.location.href = '/register'
    }
  }, [])
  return (
    <div>
      <StripeWrapper>
        <BrowserRouter>
          <Routes>
            <Route path='/register' element={<Register/>}/>
            <Route path='/add-payment-method' element={<AddPaymentMethod/>}/>
            <Route path='/checkout' element={<MakePayment/>}/>
          </Routes>
        </BrowserRouter>
      </StripeWrapper>
    </div>
  )
}

export default App
