import React, { useContext, useState } from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { listingDataContext } from '../Context/ListingContext';
function ListingPage3() {
    let navigate = useNavigate()
    const [showModal, setShowModal] = useState(false)
    let {title,setTitle,
        description,setDescription,
        frontEndImage1,setFrontEndImage1,
        frontEndImage2,setFrontEndImage2,
        frontEndImage3,setFrontEndImage3,
        backEndImage1,setBackEndImage1,
        backEndImage2,setBackEndImage2,
        backEndImage3,setBackEndImage3,
        rent,setRent,
        city,setCity,
        landmark,setLandmark,
        category,setCategory,
        handleAddListing,
        adding,setAdding
    } = useContext(listingDataContext)
  return (
    <div className='w-[100%] h-[100vh] bg-[white] flex items-center justify-center gap-[10px] flex-col overflow-auto  relative'>
         <div className='w-[50px] h-[50px] bg-[red] cursor-pointer fixed top-[5%] left-[20px] z-[50] rounded-[50%] flex items-center justify-center' onClick={()=>navigate("/listingpage2")} title="Go Back"><FaArrowLeftLong className='w-[25px] h-[25px] text-[white]' /></div>
         <div className='w-[50px] h-[50px] bg-[black] cursor-pointer fixed top-[5%] left-[85px] z-[50] rounded-[50%] flex items-center justify-center' onClick={()=>navigate("/")} title="Go Home"><FaHome className='w-[25px] h-[25px] text-[white]' /></div>

         <div className='w-[95%]  flex items-start justify-start text-[25px] md:w-[80%] mb-[10px]'>
            <h1 className='text-[20px]  text-[#272727] md:text-[30px] text-ellipsis text-nowrap overflow-hidden px-[70px] md:px-[0px]'>
                {`In ${landmark.toUpperCase()} , ${city.toUpperCase()}`}
            </h1>
         </div>

         <div className='w-[95%] h-[400px] flex items-center justify-center flex-col md:w-[80%] md:flex-row '>
            <div className='w-[100%]  h-[65%]  md:w-[70%] md:h-[100%] overflow-hidden flex items-center justify-center border-[2px] border-[white] '>
                <img src={frontEndImage1} alt="" className='w-[100%]' />
            </div>
            <div className='w-[100%] h-[50%]  flex  items-center justify-center md:w-[50%] md:h-[100%] md:flex-col '>
                <div className='w-[100%] h-[100%]  overflow-hidden  flex items-center justify-center border-[2px] '>
                <img src={frontEndImage2} alt="" className='w-[100%]' />
                </div>
                <div className='w-[100%] h-[100%]  overflow-hidden  flex items-center justify-center border-[2px] '>
                <img src={frontEndImage3} alt="" className='w-[100%]' />
                </div>
            </div>
           
         </div>
         <div className='w-[95%] flex items-start justify-start text-[18px] md:w-[80%] md:text-[25px]'>{`${title.toUpperCase()} ${category.toUpperCase()} , ${landmark.toUpperCase()}`}</div>
         <div className='w-[95%] flex items-start justify-start text-[18px] md:w-[80%] md:text-[25px] text-gray-800'>{`${description.toUpperCase()}`}</div>
         <div className='w-[95%] flex items-start justify-start text-[18px] md:w-[80%] md:text-[25px]'>{`Rs.${rent}/day`}</div>

         <div className='w-[95%] h-[50px] flex items-center justify-start px-[110px]'>
            <button 
              className='px-[30px] py-[10px] bg-[red] text-[white] text-[18px] md:px-[100px] rounded-lg text-nowrap ' 
              onClick={async () => {
                const success = await handleAddListing()
                if (success) {
                  setShowModal(true)
                }
              }} 
              disabled={adding}
            > 
              {adding ? "adding..." : "Add Listing"}
            </button>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
              <div className="bg-white rounded-2xl max-w-[450px] w-full p-8 shadow-2xl flex flex-col items-center text-center gap-6 transform scale-100 transition-transform">
                <div className="w-[80px] h-[80px] bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-bold text-gray-900">Listed Successfully!</h2>
                  <p className="text-gray-600">Your property has been listed on the platform and is now visible to everyone.</p>
                </div>
                <button 
                  className="w-full py-3 bg-[red] text-white rounded-xl font-semibold text-[18px] shadow-lg hover:bg-red-600 transition-colors"
                  onClick={() => navigate("/")}
                >
                  Go to Homepage
                </button>
              </div>
            </div>
          )}
          
        
      </div>
  )
}

export default ListingPage3
