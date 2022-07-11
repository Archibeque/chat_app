import { Button, TextField } from '@material-ui/core'
import React,{ useState, useEffect } from 'react'
import './Register.css'
import { useNavigate } from 'react-router-dom'
// import setAuthToken from "../../utils/setAuthToken";
// import jwt_decode from "jwt-decode";
// import { login } from '../../features/counter/userSlice'
// import { setChannelInfo } from '../../features/counter/appSlice'
import { useDispatch, useSelector } from 'react-redux'
import { login, reset } from "../../features/counter/authSlice";
import { toast } from 'react-toastify'





function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const history = useNavigate()
    const dispatch = useDispatch()
    
    const { user, isLoading, isSuccess, isError, message } = useSelector(
        (state) => state.auth
      );

    const registerRoute = (e) =>{
        e.preventDefault()

        history("/")
    
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const userdetails = {
            email: email,
            password: password
        }
        dispatch(login(userdetails))
        
        // axios
        // .post("/login", userdetails)
        // .then(res => {
        // // Save to localStorage
        // if(res.data){
        //     dispatch(login({
        //         id : res.data.logged._id,
        //         name : res.data.logged.name,
        //         email : res.data.logged.email
        //     }))
        // }
        // else{
        //     console.log(res.data)
        // }
        
            
        // })
        // .catch(err => {
        //     if (err.response) {
        //       // client received an error response (5xx, 4xx)
        //       dispatch(setErrors({
        //         errors: 
        //         err.response.data,
        //       }))
        //     console.log(err.response.data)
        //     } else {
        //       // anything else
        //       console.log(err)
        //     }
        // })
        

    }


    useEffect(() => {
        if (isSuccess) {
            history("/dashboard")
            toast.success(`Welcome`)
        }
        if (isError) {
            toast.error(message)
        }
        dispatch(reset())
    },[user, isSuccess, isLoading, isError, message])



    if(isLoading) {
        <h1>Loading ...</h1>
    }

     

    return (
        
        <div className="login__header">

                {/* <Alert /> */}

            <div className="login__left">

                
                <div className="login__logo">
                    <h2 className='sign__up'>Sign In</h2>
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
