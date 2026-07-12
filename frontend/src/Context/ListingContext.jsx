import axios from 'axios'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

const compressImage = (file, maxWidth = 1024, maxHeight = 1024, quality = 0.7) => {
    return new Promise((resolve) => {
        if (!file) {
            resolve(null);
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            resolve(file); // Fallback to original
                            return;
                        }
                        const compressedFile = new File([blob], file.name, {
                            type: file.type || "image/jpeg",
                            lastModified: Date.now()
                        });
                        resolve(compressedFile);
                    },
                    file.type || "image/jpeg",
                    quality
                );
            };
            img.onerror = () => resolve(file);
        };
        reader.onerror = () => resolve(file);
    });
};

export const listingDataContext = createContext()

function ListingContext({children}) {
    let navigate = useNavigate() 
    let [title,setTitle] = useState("")
    let [description,setDescription]=useState("")
    let [frontEndImage1,setFrontEndImage1]=useState(null)
    let [frontEndImage2,setFrontEndImage2]=useState(null)
    let [frontEndImage3,setFrontEndImage3]=useState(null)
    let [backEndImage1,setBackEndImage1]=useState(null)
    let [backEndImage2,setBackEndImage2]=useState(null)
    let [backEndImage3,setBackEndImage3]=useState(null)
    let [rent,setRent]=useState("")
    let [city,setCity]=useState("")
    let [landmark,setLandmark]=useState("")
    let [category,setCategory]=useState("")
    let [adding,setAdding]=useState(false)
    let [updating,setUpdating]=useState(false)
    let [deleting,setDeleting]=useState(false)
    let [listingData,setListingData]=useState([])
    let [newListData,setNewListData]=useState([])
    let [cardDetails,setCardDetails]=useState(null)
    let [searchData,setSearchData]=useState([])

    let {serverUrl} = useContext(authDataContext)

    

     const handleAddListing = async () => {
        setAdding(true)
        try {
            // Compress images in parallel before sending to fit Vercel payload limit
            const [compImg1, compImg2, compImg3] = await Promise.all([
                backEndImage1 ? compressImage(backEndImage1) : null,
                backEndImage2 ? compressImage(backEndImage2) : null,
                backEndImage3 ? compressImage(backEndImage3) : null
            ]);

            let formData = new FormData()
            formData.append("title",title)
            if (compImg1) formData.append("image1",compImg1)
            if (compImg2) formData.append("image2",compImg2)
            if (compImg3) formData.append("image3",compImg3)
            formData.append("description",description)
            formData.append("rent",rent)
            formData.append("city",city)
            formData.append("landMark",landmark)
            formData.append("category",category)
        
        let result = await axios.post( serverUrl + "/api/listing/add" ,formData, {withCredentials:true}  )
        setAdding(false)
        console.log(result)
        toast.success("AddListing Successfully")
        setTitle("")
        setDescription("")
        setFrontEndImage1(null)
        setFrontEndImage2(null)
        setFrontEndImage3(null)
        setBackEndImage1(null)
        setBackEndImage2(null)
        setBackEndImage3(null)
        setRent("")
        setCity("")
        setLandmark("")
        setCategory("")
        return true
            
        } catch (error) {
            setAdding(false)
            console.log(error)
            const errMsg = error.response?.data?.message || error.message || "An unexpected error occurred.";
            toast.error(errMsg)
        }
        
     }
     const handleViewCard = async (id) => {
        try {
            let result = await axios.get( serverUrl + `/api/listing/findlistingByid/${id}`,{withCredentials:true})
            console.log(result.data)
            setCardDetails(result.data)
            navigate("/viewcard")
        } catch (error) {
            console.log(error)
        }
        
     }
     const handleSearch = async (data) => {
        try {
            let result = await axios.get(serverUrl + `/api/listing/search?query=${data}`)
            setSearchData(result.data)
        } catch (error) {
            setSearchData(null)
            console.log(error)
            
        }
        
     }

     const getListing = async () => {
        try {
            let result = await axios.get( serverUrl + "/api/listing/get",{withCredentials:true})
            setListingData(result.data)
            setNewListData(result.data)

        } catch (error) {
            console.log(error)
        }
        
     }

    useEffect(()=>{
     getListing()
    },[adding,updating,deleting])



    let value={
        title,setTitle,
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
        setAdding,adding,
        listingData,setListingData,
        getListing,
        newListData,setNewListData,
        handleViewCard,
        cardDetails,setCardDetails,
        updating,setUpdating,
        deleting,setDeleting,handleSearch,searchData,setSearchData
       

    }
  return (
    <div>
        <listingDataContext.Provider value={value}>
            {children}
        </listingDataContext.Provider>
      
    </div>
  )
}

export default ListingContext
