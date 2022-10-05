import {useState} from "react";
import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import axios from "axios";


const CARD_OPTIONS: any = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "#fff",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": {color: "#fce883"},
      "::placeholder": {color: "#87bbfd"}
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee"
    }
  }
}

const PaymentForm = () => {
  const [succeeded, setSucceeded] = useState(false)
  const stripe = useStripe()
  const elements = useElements()
  console.log(succeeded)
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement) as any
    });
    if (error) {
      console.log(error)
      return;
    }
    try {
      const {id} = paymentMethod
      const response = await axios.post('http://localhost:3000/payment', {
        amount: 1000,
        id
      })

      if (response.data.success) {
        console.log('Payment Successful')
        setSucceeded(true)
      }

    } catch (err: any) {
      console.log(err)
    }
  }

  return (
    <div>
      {!succeeded ? (
        <form onSubmit={handleSubmit}>
          <fieldset className="FormGroup">
            <div className="FormRow">
              <CardElement options={CARD_OPTIONS}/>
            </div>
          </fieldset>
          <button>Checkout</button>
        </form>
      ) : (
        <div>Payment Successful</div>
      )}
    </div>
  )
}

export default PaymentForm