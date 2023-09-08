import React, { useState } from "react";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginUser } from "../../../_actions/user_actions";

function LoginPage() {
  const dispatch = useDispatch();

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  }
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  }
  const onSubmitHandler = (event) => {
    event.preventDefault();
    console.log(Email, Password);

    let body = {
      email: Email,
      password: Password
    }

    dispatch(loginUser(body))

    // axios.post('/login', body)
    //   .then(response => {
    //     console.log("성공");
    //   })
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: "100%", height: "100vh"
    }}>
      <form style={{display: 'flex', flexDirection: 'column'}} onSubmit={onSubmitHandler}>
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <br/>
        <button>Login</button>
      </form>
    </div>
  )
}

export default LoginPage;