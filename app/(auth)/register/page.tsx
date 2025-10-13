import React from "react";

const Register = () => {
    return (
        <div className="bg-[url('/bg-login.jpg')] bg-cover bg-center bg-no-repeat h-screen flex flex-col justify-center items-center relative">
            <div className="bg-green-700 w-full h-full opacity-50 absolute"></div>
            <div className="z-100 w-full flex">
                <div className="w-[50%]">
                    <h1 className="text-white text-4xl font-bold text-center mt-10">
                        Register Page
                    </h1>
                </div>
                <div className="login-card">
                    <form>
                      <h1></h1>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
