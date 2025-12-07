import { OverlayPanel } from "primereact/overlaypanel";
import { ProfileMenuItems } from "../../../Contents/constants";
import { useAuthStore } from "../../lib/authStore";
import { Navigate } from "react-router-dom";
import { Badge } from "primereact/badge";



const ProfileOverlayPanel = ({panelRef,unreadAnnouncements}) => {

    const {user} = useAuthStore();
    const userId = user?._id;



    return (
        <OverlayPanel ref={panelRef} key={userId}>
            <div className="flex flex-col items-start">
                {ProfileMenuItems.map((item, index) => {
                    if (item.name === "Profile" && !userId) {
                        return null;
                    }
                    if(item.name === "Announcements"){
                        return (
                            <a 
                                href={item.link}
                                className={`hover:bg-gray-100 p-2 rounded-lg cursor-pointer flex p-overlay-badge items-center gap-2 text-sm transition ${
                                    item.name === "Admin Panel" ? user?.isAdmin ? "" : "hidden" : ""
                                }`}
                                key={index}
                            >
                                <item.icon />
                                <p>{item.name}</p>
                                {unreadAnnouncements > 0 && (
                                    <Badge value="" severity="danger"></Badge>
                                )}
                            </a>
                        )
                    }
                    const link = item.name === "Profile" ? `/profile/${userId}` : item.name === "Volunteer Works" ? `/volunteer-works/${userId}` : item.name === "My Reports" ? `/user-reports/${userId}` : item.link;
                return (
                    
                    <a 
                        href={link}
                        className={`hover:bg-gray-100 p-2 rounded-lg cursor-pointer flex items-center gap-2 text-sm transition ${
                            item.name === "Admin Panel" ? user?.isAdmin ? "" : "hidden" : ""
                        }`}
                        key={index}
                    >
                        <item.icon />
                        <p>{item.name}</p>
                    </a>
                );
            })}
            </div>
        </OverlayPanel>
    );
};

export default ProfileOverlayPanel;
