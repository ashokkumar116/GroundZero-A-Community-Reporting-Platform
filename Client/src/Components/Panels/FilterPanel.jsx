import { MultiSelect } from 'primereact/multiselect'
import React from 'react'
import { Categories, Priorities, Status } from '../../../Contents/constants'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom'


const FilterPanel = ({
    selectedCategory,
    selectedPriority,
    selectedStatus,
    setSelectedCategory,
    setSelectedPriority,
    setSelectedStatus,
    setPage,
    setReports,
    fetchReportsByFilter,
    clearFilter,
    setSearch,
    search
}) => {

    const navigate = useNavigate();

    const handleSearch = (e)=>{
        e.preventDefault();
        navigate(`/search?search=${search}`)
    }

  return (
    <div className='p-5 border border-gray-200 rounded-lg bg-white shadow-md hover:shadow-lg cursor-pointer hover:border-green-500/60 hover:bg-green-50/50 transition-all duration-300'>
        <p className='text-gray-600 pb-4'>Filter your issues</p>
        <div className='flex items-start justify-between flex-col xl:flex-row gap-5 xl:gap-0 xl:items-center'>
            <div className='flex items-start w-full lg:items-center gap-5 flex-wrap '>
                <div>
                    <MultiSelect options={Categories} placeholder='Filter By Category' filter value={selectedCategory} onChange={(e) => setSelectedCategory(e.value)} className='' />
                </div>
                <div>
                    <MultiSelect options={Priorities} placeholder='Filter By Priority' filter value={selectedPriority} onChange={(e) => setSelectedPriority(e.value)} />
                </div>
                <div>
                    <MultiSelect options={Status} placeholder='Filter By Status' optionLabel="name" optionValue="value" filter value={selectedStatus} onChange={(e) => setSelectedStatus(e.value)} />
                </div>
                <div>
                    <button className='bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 flex items-center gap-2'
                        onClick={()=>{
                            setPage(1)
                            setReports([])
                            fetchReportsByFilter(1)
                        }}
                        disabled={selectedCategory.length === 0 && selectedPriority.length === 0 && selectedStatus.length === 0}
                    >
                        <FaRegCircleCheck />
                        <p>Apply</p>
                    </button>
                </div>
                <div>
                    <button className={`bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 flex items-center gap-2 ${selectedCategory.length > 0 || selectedPriority.length > 0 || selectedStatus.length > 0 ? "" : "hidden"}`}
                        onClick={()=>clearFilter()}
                        disabled={selectedCategory.length === 0 && selectedPriority.length === 0 && selectedStatus.length === 0}
                    >
                        <IoCloseCircleOutline />
                        <p>Clear</p>
                    </button>
                </div>
            </div>
            <div className='xl:w-1/3'>
                <form onSubmit={handleSearch}>
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search"> </InputIcon>
                        <InputText placeholder="Search" value={search} onChange={(e)=>setSearch(e.target.value)} />
                    </IconField>
                </form>
            </div>
        </div>
    </div>
  )
}

export default FilterPanel