// import axios from "axios";

// const SendBirdApplicationId=import.meta.env.VITE_SENDBIRD_APP_ID;
// const SendBirdApiToken=import.meta.env.VITE_SENDBIRD_API_TOKEN;


import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { db } from './../../configs';
import { User, BlogPost, BlogImages, BlogFavourite } from './../../configs/schema'; 
import { eq } from 'drizzle-orm';
import { and } from 'drizzle-orm';
import { favorites, CarListing, CarImages } from './../../configs/schema';


const FormatResult = (resp) => {
  const resultMap = new Map();
  const finalResult = [];

  resp.forEach((item) => {
    const listingId = item.carListing?.id;
    
    if (!resultMap.has(listingId)) {
      resultMap.set(listingId, {
        ...item.carListing,
        images: [],
        user: item.user // Thêm trường user từ kết quả join
      });
    }

    const currentListing = resultMap.get(listingId);
    
    if (item.carImages) {
      currentListing.images.push(item.carImages);
    }

    // Cập nhật thông tin user nếu cần thiết
    if (item.user && !currentListing.user) {
      currentListing.user = item.user;
    }
  });

  resultMap.forEach((value) => {
    finalResult.push({
      ...value,
      images: value.images
    });
  });

  return finalResult;
};


export function checkUserInDb() {
  const { user } = useUser();

  useEffect(() => {
    const addUserToDB = async () => {
      if (!user) {
        console.log('User chưa đăng nhập.');
        return;
      }

      try {
        const existingUser = await db
          .select()
          .from(User)
          .where(eq(User.clerkUserId, user.id))
          .execute();

        if (existingUser.length > 0) {
          console.log('Người dùng đã tồn tại trong DB.');
          return;
        }

        const newUser = {
          clerkUserId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.primaryEmailAddress.emailAddress,
          phoneNumber: user.primaryPhoneNumber?.phoneNumber || null,
          address: null, // Nếu cần xử lý thêm địa chỉ
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await db.insert(User).values(newUser).execute();
        console.log('Người dùng mới đã được thêm vào DB:', newUser);
      } catch (error) {
        console.error('Lỗi khi kiểm tra/thêm người dùng trong DB:', error);
      }
    };

    addUserToDB();
  }, [user]);
}


// Lấy user theo clerkUserId
export const GetUserByClerkId = async (clerkUserId) => {
  const result = await db
    .select()
    .from(User)
    .where(eq(User.clerkUserId, clerkUserId))
    .execute();

  return result[0] || null;
};


const GetFavoriteCars = async (userId) => {
  const result = await db
    .select()
    .from(favorites)
    .leftJoin(CarListing, eq(favorites.carListingId, CarListing.id))
    .leftJoin(CarImages, eq(CarImages.carListingId, CarListing.id))
    .where(eq(favorites.userId, userId))
    .execute();

  return FormatResult(result);
};




const AddToFavorite = async (clerkUserId, carListingId) => {
  try {
    // 1. Tìm user theo clerk ID
    const existingUser = await db
      .select()
      .from(User)
      .where(eq(User.clerkUserId, clerkUserId))
      .execute();

    if (!existingUser || existingUser.length === 0) {
      return { success: false, message: "Không tìm thấy người dùng." };
    }

    const userId = existingUser[0].id;

    // 2. Kiểm tra đã có trong bảng favorites chưa
    const existed = await db
      .select()
      .from(favorites)
      .where(
        and(eq(favorites.userId, userId), eq(favorites.carListingId, carListingId))
      )
      .execute();

    if (existed.length > 0) {
      return { success: false, message: "Xe đã có trong danh sách yêu thích." };
    }

    // 3. Thêm vào bảng favorites
    await db.insert(favorites).values({
      userId,
      carListingId,
    }).execute();

    return { success: true, message: "Đã thêm vào xe yêu thích!" };
  } catch (error) {
    console.error("Lỗi khi thêm yêu thích:", error);
    return { success: false, message: 'Đã xảy ra lỗi khi thêm yêu thích.' };
  }
};

const getCommentsWithUsers = async (carListingId) => {
  return db.select()
    .from(Comment)
    .innerJoin(User, eq(Comment.userId, User.id))
    .where(eq(Comment.carListingId, carListingId));
};


export const UpdateUserProfile = async (userId, { firstName, lastName, phoneNumber, address }) => {
  try {
    await db.update(User)
      .set({
        firstName,
        lastName,
        phoneNumber,
        address
      })
      .where(eq(User.id, userId))
      .execute()

    return { success: true }
  } catch (error) {
    console.error("Lỗi cập nhật hồ sơ:", error)
    return { success: false }
  }
}


const FormatBlogResult = (resp) => {
  const resultMap = new Map();
  const finalResult = [];

  resp.forEach((item) => {
    const blogId = item.blogPost?.id;
    
    if (!resultMap.has(blogId)) {
      resultMap.set(blogId, {
        ...item.blogPost,
        images: [],
        author: item.user
      });
    }

    const currentBlog = resultMap.get(blogId);
    //console.log("Item:", item);
    if (item.blog_images) {
      currentBlog.images.push(item.blog_images.imageUrl);
    }
    //console.log("Current Blog:", currentBlog);
  });
  

  resultMap.forEach((value) => {
    finalResult.push(value);
  });

  return finalResult;
};

export const GetBlogPosts = async () => {
  try {
    const result = await db.select()
      .from(BlogPost)
      .innerJoin(User, eq(BlogPost.userId, User.id))
      .leftJoin(BlogImages, eq(BlogPost.id, BlogImages.blogPostId))
      .leftJoin(BlogFavourite, eq(BlogPost.id, BlogFavourite.blogPostId))
      .execute();

    return {
      success: true,
      data: FormatBlogResult(result)
    };
  } catch (error) {
    return {
      success: false,
      message: 'Lỗi tải bài viết'
    };
  }
};

export const GetUserBlogPosts = async (userId) => {
    const result = await db
      .select()
      .from(BlogPost)
      .innerJoin(User, eq(BlogPost.userId, User.id))
      .leftJoin(BlogImages, eq(BlogPost.id, BlogImages.blogPostId))
      .leftJoin(BlogFavourite, eq(BlogPost.id, BlogFavourite.blogPostId))
      .where(eq(User.id, userId))
      .execute();

    return FormatBlogResult(result)
};

export const GetBlogPostById = async (id) => {
  const result = await db.select()
    .from(BlogPost)
    .innerJoin(User, eq(BlogPost.userId, User.id))
    .leftJoin(BlogImages, eq(BlogPost.id, BlogImages.blogPostId))
    .where(eq(BlogPost.id, id))
    .execute();

  return FormatBlogResult(result)[0] || null;
};


export const GetSingleBlogPost = async (id) => {
  try {
    const result = await db.select()
      .from(BlogPost)
      .innerJoin(User, eq(BlogPost.userId, User.id))
      .leftJoin(BlogImages, eq(BlogPost.id, BlogImages.blogPostId))
      .where(eq(BlogPost.id, id))
      .execute();

    const formatted = FormatBlogResult(result);
    return {
      success: true,
      data: formatted.length > 0 ? formatted[0] : null
    };
  } catch (error) {
    return {
      success: false,
      message: 'Lỗi tải bài viết'
    };
  }
};

export const CreateBlogPost = async (postData, imageUrls) => {
  try {
    // Tạo bài viết
    const result = await db.insert(BlogPost)
      .values(postData)
      .returning({ id: BlogPost.id });

    const postId = result[0].id;

    // Thêm ảnh
    if (imageUrls.length > 0) {
      await db.insert(BlogImages).values(
        imageUrls.map(url => ({
          imageUrl: url,
          blogPostId: postId
        }))
      );
    }

    return {
      success: true,
      id: postId
    };
  } catch (error) {
    return {
      success: false,
      message: 'Lỗi tạo bài viết'
    };
  }
};

export const UpdateBlogPost = async (id, updateData, newImages = [], deletedImageIds = []) => {
  try {
    // Cập nhật thông tin chính
    await db.update(BlogPost)
      .set(updateData)
      .where(eq(BlogPost.id, id))
      .execute();

    // Xóa ảnh cũ
    if (deletedImageIds.length > 0) {
      await db.delete(BlogImages)
        .where(inArray(BlogImages.id, deletedImageIds))
        .execute();
    }

    // Thêm ảnh mới
    if (newImages.length > 0) {
      await db.insert(BlogImages).values(
        newImages.map(url => ({
          imageUrl: url,
          blogPostId: id
        }))
      );
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: 'Lỗi cập nhật bài viết'
    };
  }
};




// const CreateSendBirdUser=(userId,nickName,profileUrl)=>{
    
//     return axios.post('https://api-'+SendBirdApplicationId+'.sendbird.com/v3/users',{
//         user_id:userId,
//         nickname:nickName,
//         profile_url:profileUrl,
//         issue_access_token:false
//     },{
//         headers:{
//             'Content-Type':'application/json',
//             'Api-Token':SendBirdApiToken
//         }
//     });
// }


// const CreateSendBirdChannel=(users,title)=>{
//     return axios.post('https://api-'+SendBirdApplicationId+'.sendbird.com/v3/group_channels',{
//         user_ids:users,
//         is_distinct:true,
//         name:title,
//         operator_ids:[users[0]]

//     },{
//         headers:{
//             'Content-Type':'application/json',
//             'Api-Token':SendBirdApiToken
//         }
//     })
// }

export default{
    FormatResult,
    GetFavoriteCars,
    AddToFavorite,
    getCommentsWithUsers,
    GetUserByClerkId,
    UpdateUserProfile,

    GetBlogPosts,
    GetSingleBlogPost,
    CreateBlogPost,
    UpdateBlogPost,
    GetUserBlogPosts,
    GetBlogPostById,


    // CreateSendBirdUser,
    // CreateSendBirdChannel
    //checkUserInDB
}