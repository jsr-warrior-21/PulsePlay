import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import { Button, Input, Logo } from "./index"
import { useDispatch } from "react-redux"
import axiosInstance from "../api/axios"
import { useForm } from "react-hook-form"

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState("")

    const login = async (data) => {
        setError("")
        try {
            const response = await axiosInstance.post("/users/login", data)
            if (response.data) {
                dispatch(authLogin(response.data.data.user))
                navigate("/")
            }
        } catch (error) {
            setError(error.response?.data?.message || "Login failed")
        }
    }

    return (
        <div className='flex items-center justify-center w-full'>
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10 text-black`}>
                <div className="mb-2 flex justify-center"><Logo width="100%" /></div>
                <h2 className="text-center text-2xl font-bold">Sign in to your account</h2>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                <form onSubmit={handleSubmit(login)} className='mt-8'>
                    <div className='space-y-5'>
                        <Input label="Email: " type="email" {...register("email", { required: true })} />
                        <Input label="Password: " type="password" {...register("password", { required: true })} />
                        <Button type="submit" className="w-full">Sign in</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default Login