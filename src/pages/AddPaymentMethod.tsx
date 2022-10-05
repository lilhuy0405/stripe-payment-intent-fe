import {Button, Col, Form, Input, message, Row} from "antd";
import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {useRef, useState} from "react";
import {Country, State, City} from "country-state-city";
import Select from 'react-select';
import axios from "axios";


const CARD_OPTIONS = {
  style: {
    base: {
      iconColor: "#111",
      color: "#111",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": {color: "#fce883"},
      "::placeholder": {color: "#111"}
    },
    invalid: {
      iconColor: "#B73E3E",
      color: "#B73E3E"
    }
  }
}
const AddPaymentMethod = () => {
  function parseForSelect(arr: any[]) {
    return arr.map((item) => ({
      label: item.name,
      value: item.isoCode ? item.isoCode : item.name,
    }));
  }

  const stripe = useStripe();

  const elements = useElements();
  const card = useRef();

  const [locations, setLocations] = useState<any>({countries: Country.getAllCountries(), states: [], cities: []});
  const [selectedLocation, setSelectedLocation] = useState<any>({country: {}, city: {}, state: {}});


  function handleSelectCountry(countryData: any) {
    const countryCode = countryData.value;
    setSelectedLocation({...selectedLocation, country: Country.getCountryByCode(countryCode)})
    const states = State.getStatesOfCountry(countryCode);
    setLocations({...locations, states})
  }


  function handleSelectState(statData: any) {
    const stateCode = statData.value;
    setSelectedLocation({
      ...selectedLocation,
      state: State.getStateByCodeAndCountry(stateCode, selectedLocation.country.isoCode)
    })
    const cities = City.getCitiesOfState(selectedLocation.country.isoCode, stateCode);
    setLocations({...locations, cities})
  }

  function handleSelectCity(cityData: any) {
    const cityName = cityData.value;
    setSelectedLocation({...selectedLocation, city: {name: cityName}})
  }

  const handleAddPaymentMethod = async (values: any) => {
    try {
      if (!stripe || !elements) return;
      const billingDetails = {
        name: values.cardName,
        address: {
          country: selectedLocation.country.isoCode,
          state: selectedLocation.state.isoCode,
          city: selectedLocation.city.name,
          line1: values.addressLine1,
        },
      };
      console.log(billingDetails);

      const {error, paymentMethod} = await stripe
        .createPaymentMethod({
          type: "card",
          billing_details: billingDetails,
          card: elements.getElement(CardElement) as any,
        })
      if (error) {
        throw error;
      }
      console.log(paymentMethod);
      //call api
      if (!localStorage.getItem('stripe-demo-user')) {
        throw new Error("Not logged in");
      }
      const user = JSON.parse(localStorage.getItem('stripe-demo-user') as string);
      const resp = await axios.post('http://localhost:3000/payment/method/attach', {
        paymentMethod,
        customerId: user.stripe_customer_id
      });
      console.log(resp.data);
      message.success("Payment method added successfully");
    } catch (err: any) {
      console.log(err)
      await message.error(err.message);
    }
  }
  return (
    <div className='form-container'>
      <h1>Add Payment Method</h1>
      <Form
        name='add-payment-method'
        layout='vertical'
        onFinishFailed={async (errorInfo: any) => {
          await message.error('Please check your input')
        }}
        onFinish={handleAddPaymentMethod}
      >
        <Form.Item
          name='cardName'
          label='Card Holder Name'
          rules={[{required: true, message: 'Please input your card holder name!'}]}
        >
          <Input placeholder="Card holder name"/>

        </Form.Item>
        <label>Card detail</label>
        <CardElement
          options={CARD_OPTIONS}
        />
        <Form.Item
          name='addressLine1'
          label='Address'
          rules={[{required: true, message: 'Please input your address!'}]}
        >
          <Input placeholder='Enter Full Address'/>

        </Form.Item>


        <Row gutter={24}>
          <Col md={12} lg={12} sm={24} xs={24}>
            <Form.Item
              name='country'
              label='Country'
            >
              <Select
                isClearable={true}
                isSearchable={true}
                name="country"
                options={parseForSelect(locations.countries)}
                onChange={handleSelectCountry}
              />

            </Form.Item>
          </Col>
          {locations.states.length > 0 && (
            <Col md={12} lg={12} sm={24} xs={24}>
              <Form.Item
                name='state'
                label='State'
              >
                <Select
                  isClearable={true}
                  isSearchable={true}
                  name="sate"
                  options={parseForSelect(locations.states)}
                  onChange={handleSelectState}
                />

              </Form.Item>
            </Col>
          )}
          {
            locations.cities.length > 0 && (
              <Col md={12} lg={12} sm={24} xs={24}>

                <Form.Item
                  name='city'
                  label='City'
                >
                  <Select
                    isClearable={true}
                    isSearchable={true}
                    name="city"
                    options={parseForSelect(locations.cities)}
                    onChange={handleSelectCity}
                  />

                </Form.Item>
              </Col>
            )
          }
        </Row>
        <Button type='primary' htmlType='submit'>Submit</Button>
      </Form>
    </div>
  )
}

export default AddPaymentMethod