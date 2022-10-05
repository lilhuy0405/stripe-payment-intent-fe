import {Button, Form, Input, message} from "antd";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Register = () => {
  let navigate = useNavigate();
  const handleSubmit = async (values: any) => {
    try {
      const resp = await axios.post('http://localhost:3000/user/register', values)
      const user = resp.data
      //save user to local storage
      localStorage.setItem('stripe-demo-user', JSON.stringify({...user, password: ""}))
      navigate('/add-payment-method')
    } catch (err: any) {
      console.log(err)
      const msg = err.response?.data?.error || err.message
      await message.error(msg)
    }
  }
  const handleFailed = async (errorInfo: any) => {
    await message.error('Please check your input')
  }
  return (
    <div className='form-container'>
      <h1>Register</h1>
      <Form
        name='register'
        layout='horizontal'
        onFinish={handleSubmit}
        onFinishFailed={handleFailed}
      >

        <Form.Item
          label="Full Name"
          name="name"
          rules={[{required: true, message: 'Please input your name!'}]}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          label="Username"
          name="username"
          rules={[{required: true, message: 'Please input your username!'}]}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{required: true, message: 'Please input your email!'}, {
            type: 'email',
            message: 'Please input a valid email!'
          }]}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{required: true, message: 'Please input your Phone!'}]}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{required: true, message: 'Please input your pwd!'}]}
        >
          <Input.Password/>
        </Form.Item>
        <Button type='primary' htmlType='submit'>Register</Button>
      </Form>
    </div>
  )
}

export default Register