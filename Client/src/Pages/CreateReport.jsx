import { Editor } from "primereact/editor";
import { FileUpload } from "primereact/fileupload";
import React, { useEffect, useState } from "react";

import { LuUpload } from "react-icons/lu";
import { MdClear } from "react-icons/md";
import { LuSparkles } from "react-icons/lu";
import { FiTag } from "react-icons/fi";
import { MdInfoOutline } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { TiInfoOutline } from "react-icons/ti";
import { MdOutlineLocationOn } from "react-icons/md";
import { FiSend } from "react-icons/fi";
import { IoSparklesOutline } from "react-icons/io5";

import { Dropdown } from "primereact/dropdown";
import { Categories, IndianStatesAndDistricts, Priorities } from "../../Contents/constants";
import { AutoComplete } from "primereact/autocomplete";

import { CountrySelect, StateSelect, CitySelect } from "react-country-state-city";
import { InputText } from "primereact/inputtext";
import axios from '../Services/axios';
import { toast } from 'react-hot-toast';

const CreateReport = () => {
    const [selectedImages, setSelectedImages] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("");
    const [category, setCategory] = useState("");
    const [state, setState] = useState("");
    const [district, setDistrict] = useState("");
    const [village, setVillage] = useState("");
    const [pincode, setPincode] = useState("");
    const [selectedState, setSelectedState] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    const [filteredPriorities, setFilteredPriorities] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [filteredStates, setFilteredStates] = useState([]);
    const [filteredDistricts, setFilteredDistricts] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    

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


    const generateDescription = async(e)=>{
        e.preventDefault();
        if(!title){
            toast.error("Title is required");
            return;
        }
        try {
            setLoading(true);
            const res = await axios.post('/ai/generatedesc',{title});
            if(res.status === 200){
                setDescription(res.data.description);
                toast.success("Description Generated");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
        }finally{
            setLoading(false);
        }
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        if(!title || !description || !priority || !category || !state || !district || !village || !pincode){
            toast.error("All fields are required");
            return;
        }
        if(selectedImages.length === 0){
            toast.error("Images are required");
            return;
        }
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('title',title);
            formData.append('description',description);
            formData.append('priority',priority);
            formData.append('category',category);
            formData.append('state',state);
            formData.append('district',district);
            formData.append('village',village);
            formData.append('pincode',pincode);
            selectedImages.forEach((image)=>formData.append('images',image));

            const res = await axios.post('/reports/createreport',formData);
            if(res.status === 201){
                toast.success("Report Created");
                setTitle("");
                setDescription("");
                setPriority("");
                setCategory("");
                setState("");
                setDistrict("");
                setVillage("");
                setPincode("");
                setSelectedState(null);
                setSelectedDistrict(null);
                setSelectedImages([]);
                setFilteredPriorities([]);
                setFilteredCategories([]);
                setFilteredStates([]);
                setFilteredDistricts([]);
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
        }finally{
            setLoading(false);
        }
    }

    return (
        <div className="px-50 py-30 bg-gray-100">
            <div className="mb-10">
                <h1 className="text-2xl font-bold text-green-700">
                    Bring Your Concern to Light — Together, We’ll Fix It.
                </h1>
            </div>
            <div>
                <div className="flex flex-col gap-10 bg-white shadow-md py-10 px-20 rounded-2xl">
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
                    <div>
                        <label htmlFor="description" className="space-y-2">
                            <div className="flex items-center justify-between gap-2 text-emerald-800">
                                <div className="flex items-center gap-2">
                                    <MdInfoOutline />
                                    <p className="label-text">Description</p>
                                </div>
                                <div>
                                    <button className="flex items-center bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-3 py-2 gap-2 shadow-md hover:shadow-lg transition-all duration-200 text-white rounded-lg cursor-pointer" onClick={generateDescription} disabled={loading}>
                                        {
                                            loading ? (
                                                <>
                                                    <span className="loading loading-sm"></span>
                                                    <p>Generating</p>
                                                </>
                                            ) : (
                                                <>
                                                    <IoSparklesOutline/>
                                                    <p>Generate with AI</p>
                                                </>
                                            )
                                        }
                                    </button>
                                </div>
                            </div>
                            <Editor style={{ height: "200px" }} placeholder="Describe the issue in detail..." 
                                value={description}
                                onTextChange={(e)=>setDescription(e.htmlValue)}
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
                                className="w-full "
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
                        onClick={handleSubmit}
                        disabled={loading}
                        >
                            {
                                loading ? (
                                    <>
                                        <span className="loading loading-md"></span>
                                        <p>Submiting Report...</p>
                                    </>
                                ) : (
                                    <>
                                        <FiSend/>
                                        <p>Submit Report</p>
                                    </>
                                )
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateReport;
