import React, { useState, useEffect } from 'react';
import { Separator } from './../../../components/ui/separator';
import { FiUser, FiCalendar, FiTag, FiChevronLeft, FiChevronRight } from "react-icons/fi";

function BlogItem({ blog }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = blog?.imageUrls || [];

  useEffect(() => {
    setActiveIndex(0);
  }, [blog]);

  const handlePrev = () => {
    setActiveIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="col-span-1 h-full">
      {blog ? (
        <div className="rounded-2xl bg-white border-2 border-gray-100 hover:shadow-xl cursor-pointer h-full flex flex-col">
          {/* Image Gallery Section */}
          <div className="aspect-video overflow-hidden rounded-t-xl relative group">
            {images.length > 0 ? (
              <>
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                      index === activeIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                    alt={blog.title}
                  />
                ))}

                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <FiChevronLeft className="text-2xl" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <FiChevronRight className="text-2xl" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all ${
                            index === activeIndex 
                              ? 'bg-white w-6' 
                              : 'bg-white/50 hover:bg-white/70'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <img
                src="/blog-placeholder.jpg"
                className="w-full h-full object-cover rounded-t-xl"
                alt="Blog placeholder"
              />
            )}
          </div>

          {/* Blog Content Section */}
          <div className="p-6 flex-1 flex flex-col">
            <h2 className="font-bold text-2xl text-gray-800 mb-4">
              {blog.title}
            </h2>

            <Separator className="bg-gray-200 mb-4" />

            <div className="flex flex-wrap gap-4 text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <FiUser className="text-lg" />
                <span>{blog?.author?.firstName + blog?.author?.lastName  || 'Ẩn danh'}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <FiCalendar className="text-lg" />
                <span>{new Date(blog?.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <FiTag className="text-lg" />
                <span>{blog?.category || 'Chưa phân loại'}</span>
              </div>
            </div>

            {blog?.content && (
              <div 
                className="prose max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: blog.content }} 
              />
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-slate-200 animate-pulse h-[500px] w-full"></div>
      )}
    </div>
  );
}

export default BlogItem;