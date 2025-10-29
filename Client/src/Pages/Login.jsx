import { useState } from 'react'
import toast, {Toaster} from 'react-hot-toast';
import { MdOutlineEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { BiLogInCircle } from "react-icons/bi";
import { useAuthStore } from '../lib/authStore';
import { Navigate, useNavigate } from 'react-router-dom';

const Login = () => {

    const navigate = useNavigate();

    const {login,loading,error} = useAuthStore();

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const handleSubmit = async(e) => {
        e.preventDefault();
        const success = await login({email,password});
        if(success){
            toast.success("Login Success");
            navigate('/');
        }
        else{
            toast.error(error);
        }
    }
  return (
        <div className="p-10 h-screen justify-center items-center flex bg-gray-100">
            <Toaster />
            <div className="flex justify-center overflow-hidden gap-5 shadow-xl rounded-xl bg-white max-w-[900px] items-stretch">
                
                <div className="flex-1 py-10">
                    <h1 className="text-4xl font-bold mb-5 ml-10 text-transparent bg-clip-text inline-flex py-2 bg-gradient-to-r from-emerald-400 to-teal-600">
                        Login
                    </h1>
                    <form className="flex flex-col gap-5 justify-center items-end text-gray-600" onSubmit={handleSubmit}>
                        <div className="inputbox">
                            <MdOutlineEmail className="text-gray-600" />
                            <input
                                type="text"
                                className="outline-none border-none w-full"
                                placeholder="John@groundzero.com"
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                            />
                        </div>
                        <div className="inputbox">
                            <TbLockPassword className="text-gray-600" />
                            <input
                                type="password"
                                className="outline-none border-none w-full"
                                placeholder="Password"
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                            />
                        </div>
                        <div className="btn-primary">
                            <BiLogInCircle className="text-white" />
                            <button className="cursor-pointer" type="submit">
                                Login
                            </button>
                        </div>
                    </form>
                    <p className="mt-3 text-center w-[100%]">
                        Don't have an account?{" "}
                        <a
                            className="text-emerald-500 font-bold hover:underline"
                            href="/register" >
                                Register
                            </a>
                    </p>

                </div>
                <div className="flex-1 relative"
                    style={{backgroundImage: 'url("/bg-login.jpg")', backgroundSize: 'cover', backgroundPosition: 'left'}}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-600 opacity-80"></div>
                    <div className=" flex flex-col justify-center items-center p-10 h-full relative">
                        <h1 className="text-4xl text-center font-bold text-white my-5">
                            Welcome Back!
                        </h1>
                        <blockquote className="text-center text-white italic">
                            &quot;It’s good to see you again. Change doesn’t rest — and neither should we. Let’s get to work.&quot;
                        </blockquote>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
