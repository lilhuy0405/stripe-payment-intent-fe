import {CardCvcElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {useState} from "react";
import {message} from "antd";
import axios from "axios";

const PaymentIntentForm = ({paymentIntent, paymentMethod}: any) => {

  const stripe = useStripe();
  const elements = useElements();

  const [cvcError, setCvcError] = useState(null);
  const {card, billing_details} = paymentMethod;
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    const cardElement = elements.getElement(CardCvcElement);
    try {
      const {token, error} = await stripe.createToken("cvc_update", cardElement);
      if (error) {
        throw error;
      }
      const resp = await axios.post("http://localhost:3000/payment/confirm", {
        paymentMethod: paymentMethod.id,
        paymentIntent: paymentIntent.id,
      });
      const paymentIntentData: any = resp.data;
      await handleApiResp(paymentIntentData);
      console.log("token", token);
      console.log("resp", resp.data);
      message.success("Payment successful");
      window.location.reload();
    } catch (err: any) {
      console.log(err)
      await message.error(err.message)
    }
  }

  async function handleApiResp(paymentIntent: any) {
    //if it has next option
    if (paymentIntent.next_action) {
      await handleNextAction(paymentIntent);
    }
  }

  async function handleNextAction(paymentIntentData: any) {
    if (!stripe) return;
    try {
      const resp = await stripe.handleCardAction(paymentIntentData.client_secret);

      const apiResp: any = await axios.post("http://localhost:3000/payment/confirm", {
        paymentMethod: paymentMethod.id,
        paymentIntent: paymentIntent.id,
      });
      const paymentIntentResp: any = apiResp.data;
      await handleApiResp(paymentIntentResp);
      if (resp.error) {
        throw resp.error;
      }
    } catch (err: any) {

    }
  }

  return (
    card && (
      <form onSubmit={handleSubmit}>

        <div className="card">
          <div>
            <img src={card.icon} alt=""/>
          </div>
          <div>
            <label>Cardholder Name</label>
            <p>{billing_details.name}</p>
          </div>
          <div>
            <div>
              <label>Card Number</label>
              <p>{`**** **** **** ${card.last4}`}</p>
            </div>
            <div>
              <label>Card Expiry</label>
              <p>{card.exp_year} {card.exp_month}</p>
            </div>
          </div>
        </div>
        <div>
          <label>Enter Cvc/Cvv </label>
          <div>
            <CardCvcElement
              onChange={() => {
                setCvcError(null);
              }}
            />
          </div>
          <p>{cvcError}</p>
        </div>


        <button>Make Payment</button>
      </form>
    )
  )
}
export default PaymentIntentForm