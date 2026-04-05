import React, { useState } from 'react'
import axiosInstance from '../api/axios'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../store/authSlice'
import { Button, Input, Logo } from './index'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'

function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm()

    const create = async (data) => {
        setError("")
        try {
            const formData = new FormData();
            formData.append("username", data.username);
            formData.append("email", data.email);
            formData.append("password", data.password);
            formData.append("fullName", data.fullName);
            formData.append("avatar", data.avatar[0]);
            if (data.coverImage) formData.append("coverImage", data.coverImage[0]);

            const response = await axiosInstance.post("/users/register", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data) {
                const userData = await axiosInstance.get("/users/current-user");
                if (userData.data) dispatch(login(userData.data.data));
                navigate("/");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Signup failed");
        }
    }

    return (
        <div className="flex items-center justify-center">
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10 text-black`}>
                <div className="mb-2 flex justify-center"><Logo width="100%" /></div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                <form onSubmit={handleSubmit(create)} className='mt-8'>
                    <div className='space-y-5'>
                        <Input label="Full Name: " placeholder="Enter your full name" {...register("fullName", { required: true })} />
                        <Input label="Email: " type="email" placeholder="Enter your email" {...register("email", { required: true })} />
                        <Input label="Username: " placeholder="Enter username" {...register("username", { required: true })} />
                        <Input label="Password: " type="password" placeholder="Enter password" {...register("password", { required: true })} />
                        <Input label="Avatar: " type="file" accept="image/*" {...register("avatar", { required: true })} />
                        <Input label="Cover Image: " type="file" accept="image/*" {...register("coverImage")} />
                        <Button type="submit" className="w-full">Create Account</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default Signup