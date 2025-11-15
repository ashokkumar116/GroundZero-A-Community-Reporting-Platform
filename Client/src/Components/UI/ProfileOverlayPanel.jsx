import { OverlayPanel } from "primereact/overlaypanel";
import { ProfileMenuItems } from "../../../Contents/constants";



const ProfileOverlayPanel = ({ ref }) => {
    return (
        <OverlayPanel ref={ref}>
            <div className="flex flex-col items-start">
                {ProfileMenuItems.map((item, index) => {
                return (
                    <button 
                        className="hover:bg-gray-100 p-2 rounded-lg cursor-pointer flex items-center gap-2 text-sm transition"
                        key={index}
                    >
                        <item.icon />
                        <p>{item.name}</p>
                    </button>
                );
            })}
            </div>
        </OverlayPanel>
    );
};

export default ProfileOverlayPanel;
