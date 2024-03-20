import React, { useState, useEffect } from "react";
import LeftSideLogo from '../assets/signinLogo.png'
import star from '../assets/star.svg'
import { Link, useNavigate } from "react-router-dom";


export default function Signin(props){

    const navigate = useNavigate();
    const [user, setUser] = useState({});

    useEffect(()=>{
        if (window.localStorage.getItem("FrAngel-auth-token") && (window.location.href.includes("signin"))) {
            navigate("/")
        }
    }, [])
   
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
        role: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const response = await fetch('https://event-management-system-ext9.onrender.com/api/auth/login', {
            method: "POST",  
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({email: credentials.email, password: credentials.password, role: credentials.role }),
          });
          const json = await response.json();
        //   console.log(json.success);

          if(json.success){
            // redirect
            localStorage.setItem('FrAngel-auth-token', json.authtoken);
            await getUser();
            navigate("/");
            props.showAlert("Logged in Successfully", "success")
        } 
          else{
            props.showAlert("Invalid Credentials", "danger")
          }
    };

    const getUser = async () => {
        // API call
        const response = await fetch('https://event-management-system-ext9.onrender.com/api/auth/getuser', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "FrAngel-auth-token": localStorage.getItem('FrAngel-auth-token')
            },
        });
        const json = await response.json();
        setUser(json)
        console.log(user);

    }

    return (
        <>

        <div className="h-screen w-full z-40">
            <div className="flex flex-row lg:h-[90%] p-8 lg:p-0">
                <div className="lg:w-1/2 flex flex-row items-center justify-center hidden lg:flex">
                    <img className="w-3/5 mix-blend-normal" src={LeftSideLogo} alt="Signin_Logo" />
                </div>
                <div className="lg:w-1/2 flex flex-col h-[100%]">
                    <div className="flex flex-row py-12 pb-8">
                        <img className="me-4" src={star} alt="" />
                        <h1 className="text-xl font-semibold">Permissions DashBoard</h1>
                    </div>
                    <form className="flex flex-col lg:w-1/2 my-auto " onSubmit={handleSubmit}>
                        <h1 className="text-4xl font-bold drop-shadow-2xl">Welcome back!!</h1>
                        <h1 className="text-xl font-bold pb-12 pt-4 drop-shadow-lg">Please enter your credentials...</h1>
                        <input
                            type="text"
                            name="email"
                            placeholder="Email"
                            className="bg-transparent border-b-2 border-gray-500 pb-2 placeholder:text-black placeholder:font-semibold outline-none"
                            required
                            value={credentials.email}
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="bg-transparent border-b-2 border-gray-500 pb-2 my-4 placeholder:text-black placeholder:font-semibold outline-none"
                            required
                            value={credentials.password}
                            onChange={handleChange}
                        />
                        <select
                            name="role"
                            id="role"
                            className="bg-transparent py-2 outline-none"
                            required
                            value={credentials.role}
                            onChange={handleChange}
                        >
                            <option name="role" value="">Select your Role</option>
                            <option name="role" value="principle">Principle</option>
                            <option name="role" value="dean">Student Dean Affairs</option>
                            <option name="role" value="hod">H.O.D</option>
                            <option name="role" value="system">System</option>
                            <option name="role" value="commitee">Commitee Member</option>
                            <option name="role" value="student">Student</option>
                        </select>
                        <Link className="underline text-right" to="/">Forget Password</Link>
                        <button className="w-full bg-black text-white rounded-lg p-4 my-12">Log in</button>
                    </form>
                </div>
            </div>
        </div>
                
        </>
    )

}