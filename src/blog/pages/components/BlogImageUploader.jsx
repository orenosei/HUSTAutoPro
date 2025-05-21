import { db } from "./../../../../configs";
import { BlogImages } from "./../../../../configs/schema";
import React, { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { eq } from "drizzle-orm";

const BlogImageUploader = ({ 
  onImagesChange, 
  postInfo, 
  mode, 
  onExistingImageDelete 
}) => {
  const [selectedFileList, setSelectedFileList] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    if (mode === 'edit' && postInfo?.images) {
      setExistingImages(postInfo.images.filter(img => img?.imageUrl));
    }
  }, [mode, postInfo]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFileList(prev => [...prev, ...files]);
    onImagesChange(prev => [...prev, ...files]);
  };

  const removeNewImage = (index) => {
    setSelectedFileList(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      onImagesChange(newFiles);
      return newFiles;
    });
  };

  const removeExistingImage = async (imageId) => {
    try {
      await db.delete(BlogImages).where(eq(BlogImages.id, imageId));
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      onExistingImageDelete(imageId);
    } catch (error) {
      console.error("Lỗi xóa ảnh:", error);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Hình ảnh bài viết</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {existingImages.map((image) => (
          <div key={image.id} className="relative group">
            <img
              src={image.imageUrl}
              alt="Blog content"
              className="w-full h-32 object-cover rounded-lg border-2 border-blue-200"
            />
            <IoMdCloseCircle
              className="absolute top-1 right-1 text-red-500 bg-white rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeExistingImage(image.id)}
            />
          </div>
        ))}

        {selectedFileList.map((file, index) => (
          <div key={index} className="relative group">
            <img
              src={URL.createObjectURL(file)}
              alt="New upload"
              className="w-full h-32 object-cover rounded-lg border-2 border-dashed border-blue-400"
            />
            <IoMdCloseCircle
              className="absolute top-1 right-1 text-red-500 bg-white rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeNewImage(index)}
            />
          </div>
        ))}

        <label className="cursor-pointer">
          <div className="w-full h-32 rounded-lg border-2 border-dashed border-blue-400 flex items-center justify-center hover:bg-blue-50">
            <span className="text-4xl text-blue-400">+</span>
          </div>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*"
          />
        </label>
      </div>
    </div>
  );
};

export default BlogImageUploader;