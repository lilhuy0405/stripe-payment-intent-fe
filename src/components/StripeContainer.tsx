//TODO: Move to .env file later
import {loadStripe} from "@stripe/stripe-js";
import {CardElement, Elements, useElements, useStripe} from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";
import {useState} from "react";
import axios from "axios";

const PUBLIC_KEY = "pk_test_51LneFCGTRyZmdhYhsc4VSoWcak3mJVJu6oye9YR2nRXoA7GSPv2rSW7LM6BkqxPbduPvTjgnn7vQhXC7d4v7kAkx00U264rUUQ"

const stripePromise = loadStripe(PUBLIC_KEY)
const StripeContainer = () => {

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm/>
    </Elements>
  )
}

export default StripeContainer