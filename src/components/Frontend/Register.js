import { Button, TextField } from '@material-ui/core'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from '../axios'
import './Register.css'
import { setErrors, selectErrors } from '../../features/counter/errorSlice'
import ListItem from '@material-ui/core/ListItem';
import { useDispatch, useSelector } from 'react-redux'




function Register() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const history = useHistory()
    const dispatch = useDispatch()


    const Error = useSelector(selectErrors);

    

   

    const handleSubmit = (e) => {
        e.preventDefault()

        const newUser ={
            name: name,
            email: email,
            password: password,
            password2: password2
        }
        console.log(newUser)
        axios
        .post("/register", newUser)
        .then((res) => 
            
            history.push("/login") // re-direct to login on successful register
            
        )

        .catch(err => {
            if (err.response) {
              // client received an error response (5xx, 4xx)
              dispatch(setErrors({
                errors: 
                err.response.data,
              }))
           
            } else {
              // anything else
              console.log(err)
            }
        })


    }
    

    const loginRoute = (e) =>{
        e.preventDefault()

        history.push("/login")
    }

    return (
        <div className="login__header">
            <div className="login__left">
                <div className="login__logo">
                    
                    <form noValidate onSubmit={handleSubmit} autoComplete="off" >
                    
                        <TextField
                        id="name"
                        name="name"
                        value={name}
                        label="Name"
                        onChange={e=> setName(e.target.value)}
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
                        onChange={e=> setEmail(e.target.value)}
                        fullWidth
                        required
                        />

                        <TextField
                        id="password"
                        name="password"
                        value={password}
                        label="Password"
                        type="password"
                        onChange={e=> setPassword(e.target.value)}
                        fullWidth
                        required
                        />

                        
                        <TextField
                        id="password2"
                        name="password2"
                        value={password2}
                        label="Confirm Password"
                        type="password"
                        onChange={e=> setPassword2(e.target.value)}
                        fullWidth
                        required
                        style={{marginBottom: "5px"}}
                        />
                        <Button variant="contained" type="submit" color="primary" fullWidth >
                            Register
                        </Button>

                    </form>      
        



                    
                    <Button variant="outlined" color="primary" onClick={loginRoute} style={{margin:"10px"}} >
                        Login
                    </Button>
                    

                </div>
                
                
            </div>

            <div className="login__right">
            <img src="tapChat.png" height="100%" width="100%" alt="" style={{backgroundSize: "contain"}} />
            </div>
        </div>
    )
}


export default Register
