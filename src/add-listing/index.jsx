import Header from '@/components/Header'
import React from 'react'
import carDetails from './../Shared/carDetails.json'
import InputField from './components/InputField'
import DropdownField from './components/DropdownField'
import { Separator } from '@/components/ui/separator'
import features from './../Shared/features.json'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { db } from './../../configs'
import { CarListing } from './../../configs/schema'
import { CarImages } from './../../configs/schema'
import TextAreaField from './components/TextAreaField'
import IconField from './components/IconField'
import UploadImages from './components/UploadImages'
import { BiLoaderAlt } from 'react-icons/bi'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'

function AddListing() {    
  
  const CLOUD_NAME = "dql9a2fi8"; 
  const UPLOAD_PRESET = "hustautopro_preset"; 
  const [formData, setFormData] = useState([]);
  const [featuresData, setFeaturesData] = useState([]);
  const [images, setImages] = useState([]);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const {user} = useUser();

  
  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const handleFeatureChange = (name, value) => {
    setFeaturesData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const uploadImagesToCloud = async () => {
      const urls = [];
      for (const file of images) {
        if (!file) continue; // Bỏ qua file undefined/null
    
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);
    
        try {
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );
    
          if (response.ok) {
            const data = await response.json();
            urls.push(data.secure_url); // Lấy URL ảnh đã upload
            console.log(urls);
          } else {
            console.error("Upload failed:", await response.text());
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
      return urls;
    };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting...");
    setLoader(true);

    try {
      // Upload ảnh lên Cloudinary và lấy danh sách URLs
      const imageUrls = await uploadImagesToCloud();

      // Lưu dữ liệu listing vào bảng `CarListing`
      const listingResult = await db
        .insert(CarListing)
        .values({
          ...formData,
          features: featuresData,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          postedOn: new Date().toISOString(),
        })
        .returning({id:CarListing.id}); // Lấy id của bản ghi vừa lưu
      const carListingId = listingResult[0]?.id;

      if (carListingId) {
        // Lưu URLs vào bảng `CarImages`
        for (const url of imageUrls) {
          await db.insert(CarImages).values({
            imageUrl: url,
            carListingId,
          });
        }
        console.log("Data saved successfully!");
        setLoader(false);
        toast.success("Data saved successfully!");
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      setLoader(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="px-10 md:px-20 my-10">
        <h2 className="font-bold text-4xl">Add New Listing</h2>
        <form className="p-10 border rounded-xl mt-10" onSubmit={onSubmit}>
          {/* Car Details */}
          <div>
            <h2 className="font-medium text-xl mb-6">Car Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {carDetails.carDetails.map((item, index) => (
                <div key={index}>
                  <label className="text-sm flex gap-2 items-center font-medium text-gray-500 mb-1">
                    <IconField icon={item?.icon} />
                    {item?.label}{" "}
                    {item.required && <span className="text-red-500">*</span>}
                  </label>
                  {item.fieldType === "text" || item.fieldType === "number" ? (
                    <InputField
                      item={item}
                      handleInputChange={handleInputChange}
                    />
                  ) : item.fieldType === "dropdown" ? (
                    <DropdownField
                      item={item}
                      handleInputChange={handleInputChange}
                    />
                  ) : item.fieldType === "textarea" ? (
                    <TextAreaField
                      item={item}
                      handleInputChange={handleInputChange}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
          <Separator className="my-6 " />
          {/* Features List */}
          <div>
            <h2 className="font-medium text-xl my-6">Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {features.features.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Checkbox
                    onCheckedChange={(value) =>
                      handleFeatureChange(item.name, value)
                    }
                  />{" "}
                  <h2>{item.label}</h2>
                </div>
              ))}
            </div>
          </div>
          {/* Car Images */}
          <Separator className="my-6" />
          <UploadImages onImagesChange={setImages} 
          setLoader={(v)=>setLoader(v)}/>
          <div className="mt-10 flex justify-end">
            <Button
              className="bg-blue-500 text-white hover:scale-110"
              type="submit"
              disabled={loader}
            >
              {!loader ? (
                "Submit"
              ) : (
                <BiLoaderAlt className="animate-spin text-2xl" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddListing;