import { db } from "./../../../configs";
import { CarImages } from "./../../../configs/schema";
import React, { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { eq } from "drizzle-orm";

function UploadImages({ onImagesChange, carInfo, mode, onExistingImageDelete }) {
  const [selectedFileList, setSelectedFileList] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    if (mode === 'edit' && carInfo?.images) {
      const validImages = carInfo.images.filter(img => img?.imageUrl);
      setExistingImages(validImages);
    }
  }, [mode, carInfo]);

  const onFileSelected = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFileList(prev => [...prev, ...files]);
    onImagesChange(prev => [...prev, ...files]);
  };

  const handleRemoveNewImage = (index) => {
    setSelectedFileList(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      onImagesChange(newFiles);
      return newFiles;
    });
  };

  const handleRemoveExistingImage = async (imageId) => {
    try {
      await db.delete(CarImages).where(eq(CarImages.id, imageId));
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      onExistingImageDelete(imageId); // Thông báo cho component cha
    } catch (error) {
      console.error("Lỗi xóa ảnh:", error);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-medium my-3">Tải Lên Ảnh Xe</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {/* Hiển thị ảnh có sẵn từ database */}
        {existingImages.map((image) => (
          <div
            key={image.id}
            className="relative border rounded-xl border-dotted border-red-400 bg-red-100"
          >
            <IoMdCloseCircle
              className="absolute top-2 right-2 text-lg text-white cursor-pointer hover:scale-110 transition-transform"
              onClick={() => handleRemoveExistingImage(image.id)}
            />
            <img
              src={image.imageUrl}
              alt="car"
              className="w-full h-[130px] object-cover rounded-xl"
            />
          </div>
        ))}

        {/* Hiển thị ảnh mới upload */}
        {selectedFileList.map((file, index) => (
          <div
            key={`new-${index}`}
            className="relative border rounded-xl border-dotted border-red-400 bg-red-100"
          >
            <IoMdCloseCircle
              className="absolute top-2 right-2 text-lg text-white cursor-pointer hover:scale-110 transition-transform"
              onClick={() => handleRemoveNewImage(index)}
            />
            <img
              src={URL.createObjectURL(file)}
              alt="new upload"
              className="w-full h-[130px] object-cover rounded-xl"
            />
          </div>
        ))}

        <label htmlFor="upload-images">
          <div className="border rounded-xl border-dotted border-red-400 bg-red-100 h-[130px] flex items-center justify-center hover:shadow-md transition-shadow">
            <span className="text-4xl text-red-500">+</span>
          </div>
        </label>
        <input
          type="file"
          multiple
          id="upload-images"
          className="hidden"
          onChange={onFileSelected}
          accept="image/*"
        />
      </div>
    </div>
  );
}

export default UploadImages;