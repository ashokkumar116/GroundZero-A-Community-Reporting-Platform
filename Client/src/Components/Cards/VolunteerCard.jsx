import React from "react";
import { formatDate } from "../../utils/formatDate";

const VolunteerCard = ({ volunteer, joinedAt }) => {
    return (
        <div className="flex gap-2 items-center bg-gradient-to-br from-green-600 to-emerald-900 shadow-md drop-shadow-md rounded-lg inline-flex px-4 py-2 text-white cursor-pointer hover:scale-102 transition-all duration-300">
            <div>
                <img src={volunteer.profile_image} alt={volunteer.username} className="h-10 w-10 rounded-full" />
            </div>
            <div>
                <h1 className="text-xl font-bold">{volunteer.username}</h1>
                <p className="text-sm text-gray-200">Joined on {formatDate(joinedAt)}</p>
            </div>
        </div>
    );
};

export default VolunteerCard;
