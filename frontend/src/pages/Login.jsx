import { useState } from 'react'
import logo from '../images/logos/logo.png'
import { Link, useNavigate } from 'react-router-dom';
import { api_base_url } from '../helper';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setpassword] = useState("");
    const navigate = useNavigate()

    const submitForm = (e) => {
        e.preventDefault();
        fetch(api_base_url + "/login", {
            mode: "cors",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then(res => res.json()).then(data => {
            if (data.success) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("isLoggedIn", true);
                console.log("Login successful. Redirecting to home page...");
                navigate("/", { replace: true });
                console.log("Login successful. Redirecting to home page after navigation...");
                toast.success(data.msg);
            }
            else {
                toast.error(data.msg)
            }
        })
    }
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen">
                <form onSubmit={submitForm} className='w-[25vw] h-[auto] flex flex-col items-center bg-[#0f0e0e] p-[20px] rounded-lg shadow-xl shadow-black/50'>
                    <img className='w-[230px] object-cover' src={logo} alt="" />

                    <div className="inputBox">
                        <input onChange={(e) => { setEmail(e.target.value) }} value={email} type="email" placeholder='Email' required />
                    </div>

                    <div className="inputBox">
                        <input onChange={(e) => { setpassword(e.target.value) }} value={password} type="password" placeholder='Password' required />
                    </div>

                    <p className='text-[gray] text-[14px] mt-3 self-start'>Dont have an account <Link to="/signup" className='text-blue-500'>Sign Up</Link></p>

                    <button className="btnNormal mt-3 bg-blue-500 transition-all hover:bg-blue-600">Login</button>
                </form>
            </div>
        </>
    )
}

export default Login
