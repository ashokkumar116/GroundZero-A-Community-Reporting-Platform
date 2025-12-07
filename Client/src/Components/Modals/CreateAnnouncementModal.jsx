import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { LuUpload } from 'react-icons/lu'
import React, { useState } from 'react'
import { MdClear } from 'react-icons/md'
import { FiSend } from 'react-icons/fi'

const CreateAnnouncementModal = ({visible,setVisible,selectedImages,setSelectedImages,title,setTitle,description,setDescription,handleSubmit,loading}) => {

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

  return (
    <Dialog
        header="Create Announcement"
        visible={visible}
        onHide={() => setVisible(false)}
    >
      <form className='flex flex-col gap-2' >
        <div className='flex flex-col gap-2'>
            <label htmlFor="title">Title</label>
            <InputText type="text" id="title" name="title" placeholder='Enter title' value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className='flex flex-col gap-2'>
            <label htmlFor="description">Description</label>
            <InputTextarea type="text" id="description" name="description" placeholder='Enter description' value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className='flex flex-col gap-2'>
            <label htmlFor="images">Images</label>
            <label
                htmlFor="file"
                className="w-full bg-transparent rounded-3xl border-2 border-green-500 border-dashed p-10 flex flex-col items-center justify-center gap-1 col-span-1 cursor-pointer hover:bg-green-50 hover:border-green-700 transition"
                >
                <div className="rounded-full bg-green-100 flex items-center justify-center p-2">
                    <LuUpload className="text-3xl text-green-600" />
                </div>
                <p className="text-green-800 mb-1">
                    Click to upload images
                </p>
                <p className="text-green-600">
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
        <div className='mt-3'>
            <button className="flex items-center gap-2 w-full justify-center bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-md hover:shadow-lg hover:scale-102 transition rounded-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
            px-6 py-4 text-white
            "
            onClick={handleSubmit}
            disabled={loading}
            >
                {
                    loading ? (
                        <>
                            <span className="loading loading-md"></span>
                            <p>Creating announcement...</p>
                        </>
                    ) : (
                        <>
                            <FiSend/>
                            <p>Create Announcement</p>
                        </>
                    )
                }
            </button>
        </div>
      </form>
    </Dialog>
  )
}

export default CreateAnnouncementModal