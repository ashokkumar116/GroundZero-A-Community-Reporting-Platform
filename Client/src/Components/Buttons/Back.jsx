import React from "react";
import { IoCaretBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Back = ({scrolled}) => {

    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className={`bg-gradient-to-br from-red-500 to-red-800 px-2 py-2 text-white rounded-lg flex items-center gap-1 hover:scale-105 transition-all duration-300 cursor-pointer fixed top-22 z-30 ${
                scrolled ? "left-1 lg:left-10" : "lg:left-20"
            }`}
        >
            <IoCaretBackCircleOutline className="text-white text-lg" />
            {!scrolled && <p className="transition">Back</p>}
        </button>
    );
};

export default Back;
