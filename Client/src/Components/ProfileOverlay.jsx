import React from "react";

const ProfileOverlay = ({ username, profile_image }) => {
  return (
    <div className="absolute top-2 left-2 z-30 flex items-center gap-2">
      {/* Profile image with glow ring */}
      <div className="relative">
        <img
          src={profile_image}
          alt={username}
          className="h-8 w-8 rounded-full object-cover border border-white/40 shadow-[0_0_6px_rgba(255,255,255,0.3)]"
        />
        {/* Soft radial glow behind profile */}
        <div className="absolute inset-0 rounded-full bg-white/10 blur-md"></div>
      </div>

      {/* Username with soft text shadow */}
      <p className="font-semibold text-white text-sm drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] capitalize">
        {username}
      </p>
    </div>
  );
};

export default ProfileOverlay;
