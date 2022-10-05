import ListPaymentMethod from "../components/ListPaymentMethod";
import {useState} from "react";
import {message} from "antd";
import axios from "axios";
import PaymentIntentForm from "../components/PaymentIntentForm";

const MakePayment = () => {
  const [selectedMethod, setSelectedMethod] = useState({});
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [isShowPaymentForm, setIsShowPaymentForm] = useState(false);
  const createPaymentIntent = async (paymentMethod: any) => {
    try {
      const user = JSON.parse(localStorage.getItem('stripe-demo-user') as string);
      if(!user) {
        throw new Error('User not found');
      }
      const resp = await axios.post('http://localhost:3000/payment/create', {
        paymentMethod: paymentMethod.id,
        userCustomerId: user.stripe_customer_id
      });
      const paymentIntent = resp.data;
      setPaymentIntent(paymentIntent);
      setIsShowPaymentForm(true);
    }catch (err: any) {
      console.log(err)
      await message.error('Something went wrong')
    }
  }
  const handleChosePaymentMethod = async (paymentMethod: any) => {
    setSelectedMethod(paymentMethod);
    await createPaymentIntent(paymentMethod);
  };

  return (
    <div className='wrapper'>
      <h1>Checkout</h1>
      <p>Pay 10$ for this fuckin shit</p>
      {!isShowPaymentForm && <ListPaymentMethod onChangePaymentMethod={handleChosePaymentMethod}/>}
      {isShowPaymentForm && <PaymentIntentForm paymentIntent={paymentIntent} paymentMethod={selectedMethod}/>}
    </div>

  )
}

export default MakePayment