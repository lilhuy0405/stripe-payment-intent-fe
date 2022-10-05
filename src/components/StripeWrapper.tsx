import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51LneFCGTRyZmdhYhsc4VSoWcak3mJVJu6oye9YR2nRXoA7GSPv2rSW7LM6BkqxPbduPvTjgnn7vQhXC7d4v7kAkx00U264rUUQ");
const StripeWrapper = (props: any) => {
  const options = {
    clientSecret: props.client_secret,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {props.children}
    </Elements>
  );

}

export default StripeWrapper