import React, { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { db } from './../../../configs';
import { eq, inArray } from 'drizzle-orm';
import { BlogPost, BlogImages, User } from './../../../configs/schema';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { 
  FiUser, 
  FiCalendar, 
  FiTag
} from "react-icons/fi";
import { BiLoaderAlt } from 'react-icons/bi';
import Service from '@/Shared/Service';
import BlogImageUploader from './components/BlogImageUploader';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const MAX_CONTENT_PREVIEW = 150; // Giới hạn 150 chữ cho phần xem trước nội dung

const AddBlog = () => {
  const CLOUD_NAME = "dqie3avyy"; 
  const UPLOAD_PRESET = "hustautopro_preset";
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [currentPost, setCurrentPost] = useState(null);
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
        await db.update(BlogPost)
          .set(processedData)
          .where(eq(BlogPost.id, Number(postId)));

        if (deletedImageIds.length > 0) {
          await db.delete(BlogImages)
            .where(inArray(BlogImages.id, deletedImageIds));
        }

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

  const renderContentPreview = () => {
    if (!formData.content) return null;
    
    // Tạo bản xem trước nội dung với giới hạn 150 chữ
    const textOnly = formData.content.replace(/<[^>]*>/g, ' ');
    const words = textOnly.trim().split(/\s+/);
    const preview = words.slice(0, MAX_CONTENT_PREVIEW).join(' ');
    
    return (
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Xem trước nội dung:</h3>
        <div className="prose max-w-none text-gray-600">
          {preview}{words.length > MAX_CONTENT_PREVIEW && '...'}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {words.length}/{MAX_CONTENT_PREVIEW} chữ (hiển thị)
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {mode === 'edit' ? 'Chỉnh Sửa Blog' : 'Viết Blog Mới'}
          </h1>
          <p className="text-gray-600 mt-2">
            {mode === 'edit' 
              ? 'Cập nhật nội dung bài viết của bạn' 
              : 'Chia sẻ kiến thức và kinh nghiệm với cộng đồng'}
          </p>
        </div>

        <form 
          className="bg-white rounded-2xl border border-gray-200 shadow-xl duration-300 overflow-hidden"
          onSubmit={handleSubmit}
        >
          <div className="p-6">
            {/* Tiêu đề */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-xl font-bold text-gray-800"
                placeholder="Nhập tiêu đề bài viết"
                required
              />
            </div>

            {/* Thông tin tác giả, ngày, thẻ */}
            <div className="flex flex-wrap gap-4 text-gray-500 mb-6">
              <div className="flex items-center gap-1">
                <FiUser className="text-lg" />
                <span>{user ? `${user.firstName} ${user.lastName}` : 'Ẩn danh'}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <FiCalendar className="text-lg" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <FiTag className="text-lg" />
                <input
                  type="text"
                  value={formData.tag}
                  onChange={(e) => handleInputChange('tag', e.target.value)}
                  className="border-b border-dashed border-gray-400 focus:border-solid focus:border-blue-500 outline-none bg-transparent px-1"
                  placeholder="Nhập thẻ"
                  required
                />
              </div>
            </div>

            {/* Component quản lý ảnh */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh bài viết</label>
              <BlogImageUploader
                postInfo={currentPost}
                mode={mode}
                onImagesChange={setNewImages}
                onExistingImageDelete={setDeletedImageIds}
              />
            </div>

            {/* Xem trước nội dung */}
            {renderContentPreview()}

            {/* Nội dung */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Nội dung</label>
                <span className="text-sm text-gray-500">
                  {formData.content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length} chữ
                </span>
              </div>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg h-64 focus:border-transparent"
                placeholder="Viết nội dung bài viết của bạn tại đây..."
                required
              />
            </div>

            {/* Nút gửi */}
            <div className="flex justify-between pt-4">
              <Button
                variant="destructive"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800"
                type="button"
                onClick={() => navigate(-1)}
              >
                Quay lại
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={loader}
              >
                {loader ? (
                  <BiLoaderAlt className="animate-spin mr-2" />
                ) : mode === 'edit' ? (
                  'Cập nhật'
                ) : (
                  'Đăng bài ngay'
                )}
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Bài viết của bạn sẽ được kiểm duyệt trước khi hiển thị công khai</p>
          <p className="mt-1">Vui lòng đảm bảo nội dung tuân thủ quy định cộng đồng</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddBlog;