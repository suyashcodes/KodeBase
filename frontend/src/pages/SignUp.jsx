import { useState } from 'react'
import { api_base_url } from '../helper'
import { toast } from 'react-toastify';
import logo from '../images/logos/logo.png'
import { Link, useNavigate } from 'react-router-dom'
const SignUp = () => {
    const [fullname,setfullname] = useState("")
    const [email,setemail] = useState("")
    const [password,setpassword] = useState("")
    const navigate = useNavigate()
    const submitForm = (e)=>{
        e.preventDefault();
        fetch(api_base_url+"/signup",{
            mode:"cors",
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                fullname:fullname,
                email:email,
                password:password
            })
        }).then(res=>res.json()).then(data=>{
            if(data.success){
                navigate('/login')
            }
            else{
                toast.error(data.msg)
            }
        })

    }
  return (
    <>
        <div className='con flex flex-col items-center justify-center min-h-screen'>
        <form onSubmit={submitForm}  action="" className='w-[25vw] h-[40vh] flex flex-col justify-center items-center bg-[#0f0e0e] rounded-lg shadow-xl p-[20px] shadow-black/50'>

        <img src={logo} className='w-[230px] object-cover' alt="" />

        <div className='inputBox'>
            <input onChange={(e)=>{setfullname(e.target.value)}} value={fullname} type="text" placeholder='Enter your name'/>
        </div>
        <div className='inputBox'>
            <input onChange={(e)=>{setemail(e.target.value)}} value={email} type="email" placeholder='Enter your email'/>
        </div>
        <div className='inputBox'>
            <input onChange={(e)=>{setpassword(e.target.value)}} value={password} type="password" placeholder='Enter your password'/>
        </div>
        <p className='text-[grey mt-3 text-sm self-start'>Already have an account ? <Link to="/login" className='text-blue-400 transition-all hover:text-blue-600'>Login</Link> </p>
        <button className='btnNormal mt-4 bg-blue-500'>Sign Up</button>
         
        </form>

        </div>
    </>
  )
}

export default SignUp
