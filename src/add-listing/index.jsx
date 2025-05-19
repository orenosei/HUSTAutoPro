import Header from '@/components/Header'
import React, { useEffect } from 'react'
import carDetails from './../Shared/carDetails.json'
import InputField from './components/InputField'
import DropdownField from './components/DropdownField'
import { Separator } from '@/components/ui/separator'
import features from './../Shared/features.json'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { db } from './../../configs'
import { eq } from 'drizzle-orm'
import { CarListing } from './../../configs/schema'
import { CarImages } from './../../configs/schema'
import { User } from './../../configs/schema'
import TextAreaField from './components/TextAreaField'
import IconField from './components/IconField'
import UploadImages from './components/UploadImages'
import { BiLoaderAlt } from 'react-icons/bi'
import { toast } from 'sonner'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import Service from '@/Shared/Service'

function AddListing() {    
  
  const CLOUD_NAME = "dql9a2fi8"; 
  const UPLOAD_PRESET = "hustautopro_preset"; 
  const [searchParams]= useSearchParams();
  const [images, setImages] = useState([]);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const {user} = useUser();

  const [formData, setFormData] = useState({}); // Sửa thành object
  const [featuresData, setFeaturesData] = useState({}); // Sửa thành object
  const [carInfo, setCarInfo] = useState({}); // Sửa thành object
  
  const mode = searchParams.get('mode');
  const recordId= searchParams.get('id');

  useEffect(()=>{
    if(mode=='edit')
    {
      GetListingDetail();
    }
  }, []);

  const GetListingDetail = async () => {
    const result = await db.select()
      .from(CarListing)
      .innerJoin(CarImages, eq(CarListing.id, CarImages.carListingId))
      .innerJoin(User, eq(CarListing.createdBy, User.id)) // Thêm join với User
      .where(eq(CarListing.id, Number(recordId)));

    const resp = Service.FormatResult(result);
    const formattedData = {
      ...resp[0],
      // Convert các trường số
      year: Number(resp[0].year),
      mileage: Number(resp[0].mileage),
      door: Number(resp[0].door),
      sellingPrice: parseFloat(resp[0].sellingPrice),
      originalPrice: resp[0].originalPrice ? parseFloat(resp[0].originalPrice) : null,
      engineSize: resp[0].engineSize ? parseFloat(resp[0].engineSize) : null,
      cylinder: resp[0].cylinder ? Number(resp[0].cylinder) : null
    };
    
    setCarInfo(formattedData);
    setFeaturesData(formattedData.features || {});
    setFormData(formattedData);
  };
  

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value === "" ? null : value 
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
    setLoader(true);
  
    try {

      const userResult = await db.select()
      .from(User)
      .where(eq(User.clerkUserId, user.id));

      if (!userResult[0]) {
        throw new Error('User not found in database');
      }
      const dbUserId = userResult[0].id;
      // 1. Chuẩn bị dữ liệu
      const processedData = {
        ...formData,
        // Chuyển đổi các trường số
        year: Number(formData.year),
        mileage: Number(formData.mileage),
        door: Number(formData.door),
        sellingPrice: parseFloat(formData.sellingPrice),
        originalPrice: formData.originalPrice 
          ? parseFloat(formData.originalPrice) 
          : null,
        engineSize: formData.engineSize 
          ? parseFloat(formData.engineSize) 
          : null,
        cylinder: formData.cylinder 
          ? Number(formData.cylinder) 
          : null,
        
        // Xử lý dữ liệu đặc biệt
        features: featuresData,
        createdBy: dbUserId, // Sử dụng database user ID
        postedOn: new Date()
      };
  
      // 2. Xử lý mode edit
      if (mode === 'edit') {
        await db.update(CarListing)
          .set(processedData)
          .where(eq(CarListing.id, Number(recordId)));
  
        // Cập nhật ảnh nếu có
        if (images.length > 0) {
          const imageUrls = await uploadImagesToCloud();
          await db.delete(CarImages)
            .where(eq(CarImages.carListingId, Number(recordId)));
          
          for (const url of imageUrls) {
            await db.insert(CarImages).values({
              imageUrl: url,
              carListingId: Number(recordId)
            });
          }
        }
  
        toast.success("Cập nhật thành công!");
        navigate('/profile');
      } 
      // 3. Xử lý mode tạo mới
      else {
        // Upload ảnh
        const imageUrls = await uploadImagesToCloud();
  
        // Tạo bản ghi chính
        const listingResult = await db.insert(CarListing)
          .values(processedData)
          .returning({ id: CarListing.id });
  
        const carListingId = listingResult[0]?.id;
  
        // Thêm ảnh vào bảng CarImages
        if (carListingId && imageUrls.length > 0) {
          await db.insert(CarImages).values(
            imageUrls.map(url => ({
              imageUrl: url,
              carListingId: carListingId
            }))
          );
        }
  
        toast.success("Đăng tin thành công!");
        navigate("/profile");
      }
    } catch (error) {
      console.error("Lỗi xử lý:", error);
      toast.error(`Thao tác thất bại: ${error.message}`);
    } finally {
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
                      carInfo={carInfo}
                    />
                  ) : item.fieldType === "dropdown" ? (
                    <DropdownField
                      item={item}
                      handleInputChange={handleInputChange}
                      carInfo={carInfo}
                    />
                  ) : item.fieldType === "textarea" ? (
                    <TextAreaField
                      item={item}
                      handleInputChange={handleInputChange}
                      carInfo={carInfo}
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
                  <Checkbox className="h-5 w-5 "
                    onCheckedChange={(value) =>
                      handleFeatureChange(item.label, value)
                    }
                    checked={ featuresData?.[item.name]}
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
              className="bg-red-500 text-white hover:scale-110"
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