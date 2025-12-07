import { useState } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { BiLogInCircle } from "react-icons/bi";
import { useAuthStore } from "../lib/authStore";
import { useNavigate } from "react-router-dom";
import Loader from "../Loaders/Loader";

const Login = () => {
    const navigate = useNavigate();

    const { login, loading, error ,loginLoading , verifyAuth} = useAuthStore();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    if (loading) {
            return (
                <div className="flex justify-center items-center h-screen">
                    <Loader />
                </div>  
            );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login({ email, password });
        if (success) {
            verifyAuth();
            navigate("/");
        } else {
            console.log(error)
        }
    };
    return (
        <div className="lg:p-10 pt-30 px-10 lg:py-0 h-screen justify-center items-center flex bg-gray-100">
            <div className="flex flex-col lg:flex-row justify-center overflow-hidden gap-5 shadow-xl rounded-xl bg-white max-w-[900px] items-stretch">
                <div className="flex-1 py-10 max-lg:order-1">
                    <h1 className="text-4xl font-bold mb-5 ml-10 text-transparent bg-clip-text inline-flex py-2 bg-gradient-to-r from-emerald-400 to-teal-600">
                        Login
                    </h1>
                    <form
                        className="flex flex-col gap-5 justify-center items-center lg:items-end text-gray-600"
                        onSubmit={handleSubmit}
                    >
                        <div className="inputbox">
                            <MdOutlineEmail className="text-gray-600" />
                            <input
                                type="email"
                                className="outline-none border-none w-full"
                                placeholder="John@groundzero.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="inputbox">
                            <TbLockPassword className="text-gray-600" />
                            <input
                                type="password"
                                className="outline-none border-none w-full"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="btn-primary">
                            {loginLoading ? <span className="loading loading-sm"></span> : <BiLogInCircle className="text-white" />}
                            <button className="cursor-pointer" type="submit" disabled={loginLoading}>
                                <span>{loginLoading ? "Logging in..." : "Login"}</span>
                            </button>
                        </div>
                    </form>
                    <p className="mt-3 text-center w-[100%]">
                        Don't have an account?{" "}
                        <a
                            className="text-emerald-500 font-bold hover:underline"
                            href="/register"
                        >
                            Register
                        </a>
                    </p>
                </div>
                <div
                    className="flex-1 relative"
                    style={{
                        backgroundImage: 'url("/bg-login.jpg")',
                        backgroundSize: "cover",
                        backgroundPosition: "left",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-600 opacity-80"></div>
                    <div className=" flex flex-col justify-center items-center p-10 h-full relative">
                        <h1 className="text-4xl text-center font-bold text-white my-5">
                            Welcome Back!
                        </h1>
                        <blockquote className="text-center text-white italic">
                            &quot;It’s good to see you again. Change doesn’t
                            rest — and neither should we. Let’s get to
                            work.&quot;
                        </blockquote>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
