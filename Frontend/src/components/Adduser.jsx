import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Adduser() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullname: '',
        rollNo: '',
        email: '',
        password: '',
        role: '',
        committeeName: '',
        department: '',
    });

    const handleChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        // Api Call
        const response = await fetch('http://localhost:5000/api/auth/createuser', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "FrAngel-auth-token": localStorage.getItem('FrAngel-auth-token')
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                fullname: formData.fullname,
                rollNo: formData.rollNo,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                committeeName: formData.committeeName,
                department: formData.department,
            }),
        });
        const json = await response.json();
        if (json.success) {
            alert("User Created Succesfully")
            setFormData({
                fullname: '',
                rollNo: '',
                email: '',
                password: '',
                role: '',
                committeeName: '',
                department: '',
            });
            
            console.log(json);
        }
    }

    return (
        <div className="mt-16 text-lg font-semibold">
            <h1 className='w-[80%] m-auto mb-4'>Add User:</h1>
            <form className='bg-gray-100 shadow-xl w-[80%] rounded-lg m-auto pb-16 flex flex-col' onSubmit={handleSubmit}>
                <div className="flex flex-row w-full">

                    <div className={`flex flex-col mx-8 pt-8 w-[45%]`}>
                        <label htmlFor="role">Role:</label>
                        <select
                            name="role"
                            id="role"
                            className="bg-white py-2 outline-none"
                            required
                            value={formData.role}
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
                    </div>
                    {
                        formData.role == "commitee"
                            ?
                            <div className={`flex flex-col mx-8 pt-8 w-[45%]`}>
                                <label htmlFor="committeeName">Commitee Name: </label>
                                <input type="text" name="committeeName" value={formData.committeeName} className={`rounded-sm border-2 p-2`} placeholder="eg. CESA" onChange={handleChange} />
                            </div>
                            :
                            <div className={`flex flex-col mx-8 pt-8 w-[45%]`}>
                                <label htmlFor="fullname">Full Name: </label>
                                <input type="text" name="fullname" value={formData.fullname} className={`rounded-sm border-2 p-2`} placeholder="eg. Chinmay Mhatre" onChange={handleChange} />
                            </div>
                    }
                </div>
                <div className="flex flex-row w-full">
                    <div className={`flex flex-col mx-8 pt-8 w-[45%]`}>
                        <label htmlFor="email">Email: </label>
                        <input type="email" name="email" value={formData.email} className={`rounded-sm border-2 p-2`} placeholder="eg. chinmaymhatre@gmail.com" onChange={handleChange} />
                    </div>
                    <div className={`flex flex-col mx-8 pt-8 w-[45%]`}>
                        <label htmlFor="password">Password: </label>
                        <input type="password" name="password" value={formData.password} className={`rounded-sm border-2 p-2`} placeholder="eg. chinmay@1980" onChange={handleChange} />
                    </div>
                </div>
                <div className="flex flex-row w-full">
                    {
                        formData.role == "student"
                            ?
                            <div className={`flex flex-col mx-8 pt-8 w-[45%]`}>
                                <label htmlFor="rollNo">Roll No: </label>
                                <input type="text" name="rollNo" value={formData.rollNo} className={`rounded-sm border-2 p-2`} placeholder="eg. 22102B2001" onChange={handleChange} />
                            </div>
                            :
                            ""
                    }

                    <div className={`flex flex-col mx-8 pt-8 w-[45%]`}>
                        <label htmlFor="department">Department:</label>
                        <select
                            name="department"
                            id="department"
                            className="bg-white py-2 outline-none"
                            required
                            value={formData.department}
                            onChange={handleChange}
                        >
                            <option name="department" value="">Select your Department: </option>
                            {
                                formData.role == "hod" || formData.role == "student" || formData.role == "commitee"
                                    ?
                                    <>
                                        <option name="department" value="CMPN">CMPN</option>
                                        <option name="department" value="INFT">INFT</option>
                                        <option name="department" value="EXTC">EXTC</option>
                                        <option name="department" value="BIO-MEDICAL">BIO-MEDICAL</option>
                                    </>
                                    :
                                    <>
                                        <option name="department" value="VIT">VIT</option>
                                        <option name="department" value="VSIT">VSIT</option>
                                        <option name="department" value="VP">VP</option>
                                    </>

                            }
                        </select>
                    </div>
                </div>

                <button className='block p-2 bg-blue-600 rounded-lg w-1/5 mx-auto mt-8 text-white font-semibold'>Add User</button>
            </form>

        </div>

    )
}
