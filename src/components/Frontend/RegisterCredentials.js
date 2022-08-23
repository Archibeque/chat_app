import { Button, TextField } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import "./Register.css";
import { useDispatch, useSelector } from "react-redux";
import { register, reset } from "../../features/counter/authSlice";
// import { makeStyles } from "@material-ui/styles";
// import Alert from '../../Alert'


// const useStyles = makeStyles((theme) => ({
//   root: {
//     width: '100%',
//     '& > * + *': {
//       marginTop: theme.spacing(2),
//     },
//   },
// }));

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const history = useNavigate();
  const dispatch = useDispatch();



  // const locked = useSelector(selectErrors);
  // console.log(locked)

  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      name: name,
      email: email,
      password: password,
      password2: password2,
    //   senderId: senderId
    };

    dispatch(register(newUser));
    // console.log(newUser)
    // axios
    // .post("/register", newUser)
    // .then((res) =>

    //     history.push("/login") // re-direct to login on successful register

    // )

    // .catch(err => {
    //     if (err.response) {
    //       // client received an error response (5xx, 4xx)
    //       dispatch(setErrors({
    //         errors:
    //         err.response.data,
    //       }))

    //     } else {
    //       // anything else
    //       console.log(err)
    //     }
    // })
  };

  useEffect(() => {
    // if (isError) {
    //   // toast.error(message);
    //   console.log(toast.error(message));
    
    //   // <span>
    //   //   message
    //   // </span>
    // }
    if (isSuccess) {
      toast.success("User successfully registered")
      history("/login")

    }
    dispatch(reset());
  }, [user, isError, isSuccess, message]);

  const loginRoute = (e) => {
    e.preventDefault();

    history("/login");
  };


  if(isLoading) {
    <h1>Loading ...</h1>
  }

  return (
    <div className="login__header">
      <div className="login__left">
        <div className="login__logo">
          {/* <span>{locked.msg}</span> */}
          <h2 className="sign__up">Sign Up</h2>
          <form noValidate onSubmit={handleSubmit} autoComplete="off">
            <TextField
              id="name"
              name="name"
              value={name}
              label="Name"
              onChange={(e) => setName(e.target.value)}
              type="text"
              fullWidth
              required
            />

            <TextField
              id="email"
              name="wmail"
              value={email}
              label="Email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />

            <TextField
              id="password"
              name="password"
              value={password}
              label="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />

            <TextField
              id="password2"
              name="password2"
              value={password2}
              label="Confirm Password"
              type="password"
              onChange={(e) => setPassword2(e.target.value)}
              fullWidth
              required
              style={{ marginBottom: "5px" }}
            />
            <Button variant="contained" type="submit" color="primary" fullWidth>
              Register
            </Button>
          </form>

          <div style={{ zIndex: 1000 }}>
            {/* {locked ? locked.map((lock)=><h1>lock.msg</h1>): "not available" } */}
          </div>

          <Button
            variant="outlined"
            color="primary"
            onClick={loginRoute}
            style={{ margin: "10px" }}
          >
            Login
          </Button>
        </div>
      </div>

      <div className="login__right">
        <img
          src="tapChat.png"
          height="100%"
          width="100%"
          alt=""
          style={{ backgroundSize: "contain" }}
        />
      </div>
    </div>
  );
}

export default Register;
