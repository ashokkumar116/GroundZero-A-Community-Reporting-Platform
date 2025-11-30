import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useEffect, useState } from 'react'
import { Categories, IndianStatesAndDistricts, Priorities } from '../../../Contents/constants';
import { AutoComplete } from 'primereact/autocomplete';
import { MdClear, MdOutlineLocationOn } from 'react-icons/md';
import { BiCategory } from 'react-icons/bi';
import { TiInfoOutline } from 'react-icons/ti';
import { FiSend, FiTag } from 'react-icons/fi';
import { LuSparkles, LuUpload } from 'react-icons/lu';
import { FaRegSave } from "react-icons/fa";
import axios from '../../Services/axios';
import toast from 'react-hot-toast';


const ReportEditModal = ({report,setModalVisible,modalVisible,getReports}) => {

    useEffect(() => {
        if (report) {
            setTitle(report?.title?.title || "");
            setDescription(report?.description || "");
            setCategory(report?.category || "");
            setPriority(report?.priority || "");
            setVillage(report?.village || "");
            setDistrict(report?.district || "");
            setSelectedDistrict(report?.district || "");
            setSelectedState(report?.state || "");
            setState(report?.state || "");
            setPincode(report?.pincode || "");
        }
    }, [report]);


    const [title,setTitle] = useState(report?.title?.title);
    const [description,setDescription] = useState(report?.description);
    const [category,setCategory] = useState(report?.category);
    const [priority,setPriority] = useState(report?.priority);
    const [village,setVillage] = useState(report?.village);
    const [district,setDistrict] = useState(report?.district);
    const [state,setState] = useState(report?.state);
    const [pincode,setPincode] = useState(report?.pincode);
    const [selectedState, setSelectedState] = useState(report?.state);
    const [selectedDistrict, setSelectedDistrict] = useState(report?.district);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [filteredStates, setFilteredStates] = useState([]);
    const [filteredDistricts, setFilteredDistricts] = useState([]);
    const [filteredPriorities, setFilteredPriorities] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [loading,setLoading] = useState(false);

        const handleImageChange = (e) => {
        const images = Array.from(e.target.files);
        setSelectedImages((prev) => [...prev, ...images]);
    };

    const handleImageDelete = (indexToDelete) => {
        const updatedImages = selectedImages.filter(
            (_, index) => index !== indexToDelete
        );
        setSelectedImages(updatedImages);
    };

    const searchPriorities = (event) => {
                const query = event.query.toLowerCase();
                const _filteredPriorities = Priorities.filter((priority)=>{
                    return priority.toLowerCase().includes(query);
                })
                setFilteredPriorities(_filteredPriorities);
            }

        const searchCategories = (event) => {
            const query = event.query.toLowerCase();
            const _filteredCategories = Categories.filter((category)=>{
                return category.toLowerCase().includes(query);
            })
            setFilteredCategories(_filteredCategories);
        }
    
        const searchState = (event) => {
            setSelectedDistrict(null);
            setFilteredDistricts([]);
            const query = event.query.toLowerCase();
            const _filteredStates = IndianStatesAndDistricts.filter((state)=>{
                return state?.name.toLowerCase().includes(query);
                
            }).map((state)=>state.name);
            setFilteredStates(_filteredStates);
        }
    
        const searchDistrict = (event) => {
            if (!selectedState) {
                setFilteredDistricts([]);
                return;
            }
            const query = event.query.toLowerCase();
            const stateData = IndianStatesAndDistricts.find(
                (s) => s.name === selectedState
            );
            const _filteredDistricts = stateData?.districts.filter((district) => {
                return district.toLowerCase().includes(query);
            }) || [];
            setFilteredDistricts(_filteredDistricts);
        }
    
        useEffect(()=>{
            setState(selectedState);
            setDistrict(selectedDistrict);
        },[selectedState,selectedDistrict])

        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('priority', priority);
            formData.append('category', category);
            formData.append('state', state);
            formData.append('district', district);
            formData.append('village', village);
            formData.append('pincode', pincode);
            if(selectedImages.length > 0){
                selectedImages.forEach((image) => {
                    formData.append('images', image);
                });
            }
            try {
                console.log(formData);
                const response = await axios.put(`/admin/editreport/${report._id}`, formData);
                console.log(response);
                if(response.status === 200){
                    toast.success('Report updated successfully');
                    getReports();
                    setLoading(false);
                    setModalVisible(false);
                    setSelectedImages([]);
                    setTitle('');
                    setDescription('');
                    setPriority('');
                    setCategory('');
                    setState('');
                    setDistrict('');
                    setVillage('');
                    setPincode('');
                    setSelectedState(null);
                    setSelectedDistrict(null);
                    setFilteredStates([]);
                    setFilteredDistricts([]);
                    setFilteredCategories([]);
                    setFilteredPriorities([]);

                }
            } catch (error) {
                toast.error('Failed to update report');
                setLoading(false);
            }finally{
                setLoading(false);
            }
        }

  return (
    <Dialog visible={modalVisible} onHide={()=>setModalVisible(false)} header="Edit Report" >
        <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2 text-emerald-800 px-2">
                    <LuSparkles />
                    <p className="label-text">Upload Images</p>
                </div>
                <label
                    htmlFor="file"
                    className="w-full bg-transparent rounded-3xl border-2 border-teal-500 border-dashed p-10 flex flex-col items-center justify-center gap-1 col-span-1 cursor-pointer hover:bg-teal-50 hover:border-teal-700 transition"
                >
                    <div className="rounded-full bg-teal-100 flex items-center justify-center p-2">
                        <LuUpload className="text-3xl text-teal-600" />
                    </div>
                    <p className="text-emerald-800 mb-1">
                        Click to upload images
                    </p>
                    <p className="text-emerald-600">
                        PNG, JPG, or JPEG (max 5MB each)
                    </p>
                    <input
                        type="file"
                        id="file"
                        className="hidden"
                        multiple
                        onChange={handleImageChange}
                    />
                </label>
                {selectedImages.length > 0 && (
                    <div className="flex justify-center items-center gap-5 py-8 flex-wrap">
                        {selectedImages.length > 0 &&
                            selectedImages.map((image, index) => (
                                <div className="relative border-2 border-teal-500 rounded-lg hover:scale-102 transition">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        className="h-40 w-40 z-1 object-cover rounded-lg"
                                    />
                                    <MdClear
                                        className="absolute -top-3 -right-3 z-2 text-2xl p-1 text-white bg-gradient-to-br from-rose-400 to-rose-800 rounded-full cursor-pointer"
                                        onClick={() =>
                                            handleImageDelete(index)
                                        }
                                    />
                                </div>
                            ))}
                    </div>
                )}
            </div>
            <div className="">
                <label htmlFor="title" className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-800">
                        <FiTag />
                        <p className="label-text">Title</p>
                    </div>
                    <InputText
                        type="text"
                        id="title"
                        className="w-full"
                        placeholder="Brief title of the issue"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </label>
            </div>
            <div className="">
                <label htmlFor="description" className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-800">
                        <FiTag />
                        <p className="label-text">Description</p>
                    </div>
                    <InputTextarea
                        type="text"
                        id="description"
                        className="w-full"
                        placeholder="Brief title of the issue"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>
            </div>
            
            <div className="flex gap-10 w-full">
                <label
                    htmlFor="priority"
                    className="space-y-3 flex-1"
                >
                    <div className="flex items-center gap-2 text-emerald-800">
                        <TiInfoOutline />
                        <p className="label-text">Priority</p>
                    </div>
                    <AutoComplete
                        type="text"
                        id="priority"
                        className="w-full"
                        suggestions={filteredPriorities}
                        completeMethod={searchPriorities}
                        dropdown
                        value={priority}
                        onChange={(e) => setPriority(e.value)}
                        placeholder="Select Priority"
                    />
                </label>
                <label
                    htmlFor="category"
                    className="space-y-3 flex-1"
                >
                    <div className="flex items-center gap-2 text-emerald-800">
                        <BiCategory />
                        <p className="label-text">Category</p>
                    </div>
                    <AutoComplete
                        type="text"
                        id="category"
                        className="w-full"
                        suggestions={filteredCategories}
                        completeMethod={searchCategories}
                        dropdown
                        value={category}
                        onChange={(e) => setCategory(e.value)}
                        placeholder="Select Category"
                    />
                </label>
            </div>
            <div className="grid grid-cols-2 gap-x-10 gap-y-5">
                <div className="flex items-center gap-2 text-emerald-800 col-span-2">
                    <MdOutlineLocationOn />
                    <p className="label-text">Location Details</p>
                </div>
                <label htmlFor="state" className="space-y-2">
                    <AutoComplete
                        type="text"
                        id="state"
                        className="w-full"
                        suggestions={filteredStates}
                        completeMethod={searchState}
                        dropdown
                        value={state}
                        onChange={(e) => setSelectedState(e.value)}
                        placeholder="State"
                    />
                </label>
                <label htmlFor="district" className="space-y-2">
                    <AutoComplete
                        disabled={!selectedState}
                        type="text"
                        id="district"
                        className="w-full"
                        suggestions={filteredDistricts}
                        completeMethod={searchDistrict}
                        dropdown
                        value={district}
                        onChange={(e) => setDistrict(e.value)}
                        placeholder="District"
                    />
                </label>
                <label htmlFor="village" className="space-y-2">
                    <InputText
                        type="text"
                        id="village"
                        className="w-full"
                        placeholder="Village"
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                    />
                </label>
                <label htmlFor="pincode" className="space-y-2">
                    <InputText
                        type="text"
                        id="pincode"
                        className="w-full"
                        placeholder="Pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <button className="flex items-center gap-2 w-full justify-center bg-gradient-to-br from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-md hover:shadow-lg hover:scale-102 transition rounded-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
                px-6 py-4 text-white
                "
                type="submit"
                disabled={loading}
                >
                    {
                        loading ? (
                            <>
                                <span className="loading loading-md"></span>
                                <p>Saving Changes...</p>
                            </>
                        ) : (
                            <>
                                <FaRegSave/>
                                <p>Save Changes</p>
                            </>
                        )
                    }
                </button>
            </div>
        </form>
    </Dialog>
  )
}

export default ReportEditModal