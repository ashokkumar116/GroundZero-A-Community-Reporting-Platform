import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../lib/authStore";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/InputTextarea";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { IndianStatesAndDistricts } from "../../../Contents/constants";
import { AutoComplete } from "primereact/autocomplete";
import { FiSend } from "react-icons/fi";
import { MdOutlineUpdate } from "react-icons/md";
import { AiOutlineSave } from "react-icons/ai";
import axios from "../../Services/axios";
import toast from "react-hot-toast";

const ProfileEditModal = ({ visible, setVisible, user , fetchUser}) => {

    useEffect(() => {
    if (user) {
        setUsername(user.username || "");
        setBio(user.bio || "");
        setPhone(user.phone || "");
        setDob(user.dob || Date.now());
        setVillage_name(user.village_name || "");
        setPincode(user.pincode || "");
        setSelectedState(user.state || "");
        setSelectedDistrict(user.district || "");
    }
}, [user]);


    const [username, setUsername] = useState(user?.username);
    const [bio, setBio] = useState(user?.bio);
    const [phone, setPhone] = useState(user?.phone);
    const [dob, setDob] = useState(user?.dob);
    const [village_name, setVillage_name] = useState(user?.village_name);
    const [pincode, setPincode] = useState(user?.pincode);
    const [selectedState, setSelectedState] = useState(user?.state);
    const [selectedDistrict, setSelectedDistrict] = useState(user?.district);
    const [filteredStates, setFilteredStates] = useState([]);
    const [filteredDistricts, setFilteredDistricts] = useState([]);
    const [loading, setLoading] = useState(false);


    const searchState = (event) => {
        setSelectedDistrict(null);
        setFilteredDistricts([]);
        const query = event.query.toLowerCase();
        const _filteredStates = IndianStatesAndDistricts.filter((state) => {
            return state?.name.toLowerCase().includes(query);
        }).map((state) => state.name);
        setFilteredStates(_filteredStates);
    };

    const searchDistrict = (event) => {
        if (!selectedState) {
            setFilteredDistricts([]);
            return;
        }
        const query = event.query.toLowerCase();
        const stateData = IndianStatesAndDistricts.find(
            (s) => s.name === selectedState
        );
        const _filteredDistricts =
            stateData?.districts.filter((district) => {
                return district.toLowerCase().includes(query);
            }) || [];
        setFilteredDistricts(_filteredDistricts);
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.put('/users/updateprofile',{
                username,
                bio,
                phone,
                dob,
                village_name,
                pincode,
                state:selectedState,
                district:selectedDistrict,
            })
            if(res.status === 200){
                fetchUser();
                toast.success("Profile Updated Successfully");
                setVisible(false);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }finally{
            setLoading(false);
        }
        
    }

    return (
        <Dialog visible={visible} onHide={() => setVisible(false)} header="Edit Profile Details">
            <form className="flex flex-col gap-3 ">
                <div className="edit-modal-input">
                    <label htmlFor="username">Username</label>
                    <InputText value={username} onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div className="edit-modal-input">
                    <label htmlFor="bio">Bio</label>
                    <InputTextarea value={bio} rows={4} onChange={(e) => setBio(e.target.value)}/>
                </div>
                <div className="edit-modal-input">
                    <label htmlFor="phone">Phone Number</label>
                    <InputNumber value={phone} onValueChange={(e) => setPhone(e.value)} useGrouping={false} />
                </div>
                <div className="edit-modal-input">
                    <label htmlFor="dob">Date of Birth</label>
                    <Calendar value={new Date(dob)} onChange={(e) => setDob(e.value)} dateFormat="dd/mm/yy" />
                </div>
                <div className="edit-modal-input">
                    <label htmlFor="state">State</label>
                    <AutoComplete
                        type="text"
                        id="state"
                        className="w-full"
                        suggestions={filteredStates}
                        completeMethod={searchState}
                        dropdown
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.value)}
                        placeholder="State"
                    />
                </div>
                <div className="edit-modal-input">
                    <label htmlFor="district">District</label>
                    <AutoComplete
                        disabled={!selectedState}
                        type="text"
                        id="district"
                        className="w-full"
                        suggestions={filteredDistricts}
                        completeMethod={searchDistrict}
                        dropdown
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.value)}
                        placeholder="District"
                    />
                </div>

                <div className="edit-modal-input">
                    <label htmlFor="village">Village</label>
                    <InputText value={village_name} onChange={(e) => setVillage_name(e.target.value)} />
                </div>
                <div className="edit-modal-input">
                    <label htmlFor="pincode">PinCode</label>
                    <InputText value={pincode} onChange={(e) => setPincode(e.target.value)}/>
                </div>
                <div>
                    <button className="flex items-center gap-2 w-full justify-center bg-gradient-to-br from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-md hover:shadow-lg hover:scale-102 transition rounded-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
                    px-6 py-4 text-white
                    "
                    onClick={handleSubmit}
                    disabled={loading}
                    >
                        {
                            loading ? (
                                <>
                                    <span className="loading loading-md"></span>
                                    <p>Updating Profile...</p>
                                </>
                            ) : (
                                <>
                                    <AiOutlineSave/>
                                    <p>Update Profile</p>
                                </>
                            )
                        }
                    </button>
                </div>
            </form>
        </Dialog>
    );
};

export default ProfileEditModal;
