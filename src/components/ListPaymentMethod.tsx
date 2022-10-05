import {useEffect, useState} from "react";
import axios from "axios";

const ListPaymentMethod = ({onChangePaymentMethod}: any) => {
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const fetchPaymentMethods = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('stripe-demo-user') as string);
      const resp = await axios.get(`http://localhost:3000/payment/methods?customerId=${user.stripe_customer_id}`);
      const data = resp.data;
      const list = data.data;
      setPaymentMethods(list);
    }catch (err: any) {
      console.log(err)
      setPaymentMethods([]);
    }
  }
  useEffect(() => {
    fetchPaymentMethods();
  }, [])
  const handleChosePayment = (method: any) => {
    onChangePaymentMethod(method);
  }
  return (
    <div>
      <h3>Select your preferred payment method</h3>
      {paymentMethods &&
        paymentMethods.map((method) => (
          <div className="card" onClick={() => handleChosePayment(method)} key={method.id}>
           <p>{method.card.brand}</p>
            <div>
              <p>
                {method.card.brand} **** {method.card.last4}
              </p>
              <p>{method.billing_details.name}</p>
            </div>

            <div>
              Expires{" "}
              {method.card.exp_year} {method.card.exp_month}
            </div>
          </div>
        ))}
    </div>
  )
}

export default ListPaymentMethod