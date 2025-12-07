import { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { IoPersonAdd } from "react-icons/io5";
import toast from "react-hot-toast";
import axios from "../Services/axios";
import { useNavigate } from "react-router-dom";

const Register = () => {

    const navigate = useNavigate();

    const [loading,setLoading] = useState(false);
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");


    const handleSubmit = async(e)=>{
        e.preventDefault();
        try {
            setLoading(true);
            if(password !== confirmPassword){
                toast.error("Passwords Doesn't Match");
                return;
            }
            const res = await axios.post("/auth/register",{
            username,
            email,
            password
        })
        if(res.status === 201){
            toast.success("User Account Created");
            navigate('/login');
        }
        } catch (error) {
            toast.error(error.response?.data?.message);
        }finally{
            setLoading(false);
        }
    }



    return (
        <div className="lg:p-10 pt-30 px-10 lg:pt-30 justify-center items-center flex bg-gray-100">
            <div className="flex flex-col lg:flex-row justify-center overflow-hidden gap-5 shadow-xl rounded-xl bg-white max-w-[900px] items-stretch">
                <div className="flex-1 relative"
                    style={{backgroundImage: 'url("/bg-login.jpg")', backgroundSize: 'cover', backgroundPosition: 'left'}}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-600 opacity-80"></div>
                    <div className=" flex flex-col justify-center items-center p-10 h-full relative">
                        <h1 className="text-4xl text-center font-bold text-white my-5">
                            Hello there!
                        </h1>
                        <blockquote className="text-center text-white italic">
                            &quot;Change doesn’t wait — why should you? Join
                            GroundZero and start shaping your community.&quot;
                        </blockquote>
                    </div>
                </div>
                <div className="flex-1 py-10">
                    <h1 className="text-4xl font-bold mb-5 text-transparent bg-clip-text inline-flex py-2 ml-5 lg:ml-0 bg-gradient-to-r from-emerald-400 to-teal-600">
                        Register
                    </h1>
                    <form className="flex flex-col gap-5 justify-center items-center lg:items-start" onSubmit={handleSubmit}>
                        <div className="inputbox">
                            <FaRegUser className="text-gray-600" />
                            <input
                                type="text"
                                className="outline-none border-none w-full"
                                placeholder="JohnDoe"
                                value={username}
                                onChange={(e)=>setUsername(e.target.value)}
                            />
                        </div>
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
                        <div className="inputbox">
                            <TbLockPassword className="text-gray-600" />
                            <input
                                type="password"
                                className="outline-none border-none w-full"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e)=>setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <div className="btn-primary">
                            {loading ? (
                                <span className="loading loading-sm"></span>
                            ) : (
                                <IoPersonAdd className="text-white" />
                            )
                            
                        }
                           {
                            loading ? (
                                <button className="cursor-pointer" type="submit" disabled>
                                    Creating Account...
                                </button>
                            ) : (
                                 <button className="cursor-pointer" type="submit">
                                    Create Account
                                </button>
                            )
                           }
                        </div>
                    </form>
                    <p className="mt-3 text-center w-[90%]">
                        Already have an account?{" "}
                        <a
                            className="text-emerald-500 font-bold hover:underline"
                            href="/login" >
                                Login
                            </a>
                    </p>

                </div>
            </div>
        </div>
    );
};

export default Register;
