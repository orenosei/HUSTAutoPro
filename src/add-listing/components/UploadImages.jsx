import React, { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";

function UploadImages({ onImagesChange }) {
  const [selectedFileList, setSelectedFileList] = useState([]);

  const onFileSelected = (event) => {
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setSelectedFileList((prev) => [...prev, file]);
    }

    onImagesChange([...selectedFileList, ...files]); // Truyền danh sách file về component cha
  };

  const onImageRemove = (image) => {
    const result = selectedFileList.filter((item) => item !== image);
    setSelectedFileList(result);
    onImagesChange(result); // Cập nhật danh sách file mới về component cha
  };

  return (
    <div>
      <h1 className="text-xl font-medium my-3">Upload Car Images</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        {selectedFileList.map((image, index) => (
          <div
            key={index}
            className="relative border rounded-xl border-dotted border-blue-400 bg-blue-100"
          >
            <IoMdCloseCircle
              className="absolute top-2 right-2 text-lg text-white cursor-pointer"
              onClick={() => onImageRemove(image)}
            />
            <img
              src={URL.createObjectURL(image)}
              alt="car"
              className="w-full h-[130px] object-cover rounded-xl"
            />
          </div>
        ))}
        <label htmlFor="upload-images">
          <div className="border rounded-xl border-dotted border-blue-400 bg-blue-100 p-10 cursor-pointer hover:shadow-md">
            <h2 className="text-lg text-center text-blue-500">+</h2>
          </div>
        </label>
        <input
          type="file"
          multiple={true}
          id="upload-images"
          className="hidden"
          onChange={onFileSelected}
        />
      </div>
    </div>
  );
}

export default UploadImages;
