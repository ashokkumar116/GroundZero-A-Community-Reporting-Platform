
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import React, { useState } from 'react'
import { Status } from "../../../Contents/constants";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { LuSend, LuUpload } from "react-icons/lu";
import { MdClear } from "react-icons/md";
import axios from "../../Services/axios";
import toast from "react-hot-toast";
import { BiSend } from "react-icons/bi";

const UpdateStatusRequestModal = ({visible, setVisible,reportId}) => {

  const [status, setStatus] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedImages, setSelectedImages] = useState([]);

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

const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("status", status);
      formData.append("note", note);
      selectedImages.forEach((image) => {
          formData.append("images", image);
      });
      const res = await axios.post(`/request/updatestatus/${reportId}`,formData)
      if(res.status === 201){
          toast.success("Status Update Request Created");
          setVisible(false);
          setStatus(null);
          setNote("");
          setSelectedImages([]);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }finally{
      setLoading(false);
    }
};

  return (
    <Dialog
        visible={visible}
        onHide={() => {setVisible(false)}}
        header="Request Update Status"
    >
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label htmlFor="status">Status</label>
          <Dropdown
            options={Status}
            optionLabel="name"
            optionValue="value"
            placeholder="Select Status"
            className="w-full"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="note">Note</label>
          <InputTextarea
            placeholder="Enter Note"
            className="w-full"
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="images">Images</label>
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
            {
              selectedImages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 gap-2">
                  {
                    selectedImages.map((image, index)=>(
                      <div
                        key={index}
                        className="relative ml-2"
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt="Uploaded"
                          className="w-24 h-24 object-cover rounded-lg hover:scale-102 transition"
                        />
                          <MdClear onClick={()=>handleImageDelete(index)}
                          className="absolute text-xl -top-3 -right-3 bg-red-500 text-white p-1 rounded-full cursor-pointer hover:bg-red-700 transition" />
                      </div>
                    ))
                  }
                </div>
              )
            }
                  <div className="flex justify-end mt-4">
                    {
                      loading ? (
                        <button className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-not-allowed flex items-center gap-2"
                      type="submit"
                    >
                      <span className="loading loading-sm"></span>
                      <p>Sending Request....</p>
                    </button>
                      ) : (
                        <button className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition flex items-center gap-2 cursor-pointer"
                      type="submit"
                    >
                      <LuSend />
                      <p>Send Request</p>
                    </button>
                      )
                    }
                  </div>
        </div>     
      </form>

    </Dialog>
  )
}

export default UpdateStatusRequestModal