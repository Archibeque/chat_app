import { Button, TextField } from '@material-ui/core'
import React,{ useState, useEffect } from 'react'
import './Register.css'
import axios from '../axios'
import { useHistory } from 'react-router-dom'
// import setAuthToken from "../../utils/setAuthToken";
// import jwt_decode from "jwt-decode";
import { login } from '../../features/counter/userSlice'
// import { setChannelInfo } from '../../features/counter/appSlice'
import { useDispatch, useSelector } from 'react-redux'
import { setErrors, selectErrors } from '../../features/counter/errorSlice'
// import { selectUser } from '../../features/counter/userSlice'




function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({})
    const history = useHistory()
    const dispatch = useDispatch()
    const error = useSelector(selectErrors)


    const registerRoute = (e) =>{
        e.preventDefault()

        history.push("/")
    
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const userdetails = {
            email: email,
            password: password
        }
        console.log(userdetails)
        
        axios
        .post("/login", userdetails)
        .then(res => {
        // Save to localStorage
        if(res.data){
            dispatch(login({
                id : res.data.logged._id,
                name : res.data.logged.name,
                email : res.data.logged.email
            }))
        }
        else{
            console.log(res.data)
        }
        
            
        })
        .catch(err => {
            if (err.response) {
              // client received an error response (5xx, 4xx)
              dispatch(setErrors({
                errors: 
                err.response.data,
              }))
            console.log(err.response.data)
            } else {
              // anything else
              console.log(err)
            }
        })
        

    }

   
    


   

    return (
            <div className="login__header">
            <div className="login__left">
                <div className="login__logo">
                    <span>
                        {/* {
                            error.map(({ msg }) => (
                                <ListItem key={msg}>
                                    {msg}
                                </ListItem>
                                
                            ))
                        } */}
                    </span>
        
                    <form noValidate onSubmit={handleSubmit} autoComplete="off" >                            
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
                        style={{marginBottom: "5px"}}
                        />

                        
                        
                        <Button variant="contained" type="submit" color="primary" fullWidth >
                            Login
                        </Button>

                    </form>
                    


                    <Button variant="outlined" color="primary" onClick={registerRoute} style={{margin:"10px"}} >
                        Register
                    </Button>

                </div>
                
                
            </div>

            <div className="login__right">
            <img src="tapChat.png" height="100%" width="100%" alt="" style={{backgroundSize: "contain"}} />
            </div>
        </div>
    )
}

export default Login
