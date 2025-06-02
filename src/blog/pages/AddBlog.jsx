import Header from '@/components/Header'
import React, { useEffect, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { db } from './../../../configs'
import { eq, inArray } from 'drizzle-orm'
import { BlogPost, BlogImages, User } from './../../../configs/schema'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { toast } from 'sonner'
import BlogImageUploader from './components/BlogImageUploader'
import { BiLoaderAlt } from 'react-icons/bi'
import Service from '@/Shared/Service'

const AddBlog = () => {
  // const CLOUD_NAME = "dql9a2fi8";
  const CLOUD_NAME = "dqie3avyy"; 
  const UPLOAD_PRESET = "hustautopro_preset";
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [currentPost , setCurrentPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    tag: '',
    content: '',
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);
  const [loader, setLoader] = useState(false);

  const mode = searchParams.get('mode');
  const postId = searchParams.get('id');

  useEffect(() => {
    if (mode === 'edit') {
      getBlogPost();
    }
  }, []);

  const getBlogPost = async () => {
    const currentPost = await Service.GetBlogPostById(postId);
    setCurrentPost(currentPost);
    setFormData({
      title: currentPost.title,
      tag: currentPost.tag || 'Chưa phân loại',
      content: currentPost.content,
    });

    setExistingImages(currentPost.imageUrls || []);
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const uploadImagesToCloud = async (files) => {
    const urls = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      if (response.ok) {
        const data = await response.json();
        urls.push(data.secure_url);
      }
    }
    console.log("Uploaded URLs:", urls);
    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    try {
      const userResult = await db.select()
        .from(User)
        .where(eq(User.clerkUserId, user.id));

      if (!userResult[0]) throw new Error('User not found');
      const dbUserId = userResult[0].id;

      const processedData = {
        ...formData,
        userId: dbUserId,
        imageUrls: await uploadImagesToCloud(newImages),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (mode === 'edit') {
        // Update existing post
        await db.update(BlogPost)
          .set(processedData)
          .where(eq(BlogPost.id, Number(postId)));

        // Handle image deletions
        if (deletedImageIds.length > 0) {
          await db.delete(BlogImages)
            .where(inArray(BlogImages.id, deletedImageIds));
        }

        // Add new images
        if (processedData.imageUrls.length > 0) {
          await db.insert(BlogImages).values(
            processedData.imageUrls.map(url => ({
              imageUrl: url,
              blogPostId: Number(postId)
            }))
          );
        }

        toast.success('Cập nhật bài viết thành công!');
      } else {
        // Create new post
        const result = await db.insert(BlogPost)
          .values(processedData)
          .returning({ id: BlogPost.id });

        const newPostId = result[0].id;

        if (processedData.imageUrls.length > 0) {
          await db.insert(BlogImages).values(
            processedData.imageUrls.map(url => ({
              imageUrl: url,
              blogPostId: newPostId
            }))
          );
        }

        toast.success('Đăng bài thành công!');
      }

      navigate('/blog');
    } catch (error) {
      toast.error(`Lỗi: ${error.message}`);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="px-10 md:px-20 my-10">
        <h2 className="font-bold text-4xl">
          {mode === 'edit' ? 'Chỉnh Sửa Bài Viết' : 'Viết Bài Mới'}
        </h2>
        
        <form className="p-10 border rounded-xl mt-10 shadow-2xl" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Tiêu đề</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Thẻ</label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) => handleInputChange('tag', e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Nội dung</label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                className="w-full p-3 border rounded-lg h-96"
                required
              />
            </div>

            <BlogImageUploader
              postInfo={currentPost}
              mode={mode}
              onImagesChange={setNewImages}
              onExistingImageDelete={setDeletedImageIds}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loader}
              >
                {loader ? (
                  <BiLoaderAlt className="animate-spin" />
                ) : mode === 'edit' ? (
                  'Cập nhật'
                ) : (
                  'Đăng bài'
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;