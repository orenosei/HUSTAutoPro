import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { db } from './../../configs';
import { User, BlogPost, BlogImages, BlogFavourite,
  ReportCarListing, ReportBlogPost, ReportUser, Appointment  

} from './../../configs/schema'; 
import { eq } from 'drizzle-orm';
import { and } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { favorites, CarListing, CarImages } from './../../configs/schema';

import { inArray } from 'drizzle-orm';
import { Comment } from './../../configs/schema';


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
    const syncUserWithDb = async () => {
      if (!user) {
        console.log('User chưa đăng nhập.');
        return;
      }

      try {
        // 1. Tìm user trong database
        const [existingUser] = await db
          .select()
          .from(User)
          .where(eq(User.clerkUserId, user.id))
          .execute();

        // 2. Xử lý khi không tìm thấy user
        if (!existingUser) {
          const newUser = {
            clerkUserId: user.id,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.primaryEmailAddress?.emailAddress || '',
            phoneNumber: user.primaryPhoneNumber?.phoneNumber || null,
            avatar: user.imageUrl || null,
            address: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          await db.insert(User).values(newUser).execute();
          console.log('Đã thêm người dùng mới vào DB');
          return;
        }

        // 3. Chuẩn bị dữ liệu hiện tại từ Clerk
        const currentUserData = {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.primaryEmailAddress?.emailAddress || '',
          phoneNumber: user.primaryPhoneNumber?.phoneNumber || null,
          avatar: user.imageUrl || null,
        };

        // 4. Kiểm tra thay đổi
        const changes = {};
        if (existingUser.firstName !== currentUserData.firstName)
          changes.firstName = currentUserData.firstName;
        if (existingUser.lastName !== currentUserData.lastName)
          changes.lastName = currentUserData.lastName;
        if (existingUser.email !== currentUserData.email)
          changes.email = currentUserData.email;
        if (existingUser.phoneNumber !== currentUserData.phoneNumber)
          changes.phoneNumber = currentUserData.phoneNumber;
        if (existingUser.avatar !== currentUserData.avatar)
          changes.avatar = currentUserData.avatar;

        // 5. Cập nhật nếu có thay đổi
        if (Object.keys(changes).length > 0) {
          changes.updatedAt = new Date();
          await db
            .update(User)
            .set(changes)
            .where(eq(User.id, existingUser.id))
            .execute();

          console.log('Đã cập nhật thông tin người dùng:', changes);
        } else {
          console.log('Không có thay đổi thông tin người dùng');
        }
      } catch (error) {
        console.error('Lỗi đồng bộ người dùng với DB:', error);
      }
    };

    syncUserWithDb();
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
        author: item.user,
        likeCount: 0,
        favourites: new Set()
      });
    }

    const currentBlog = resultMap.get(blogId);

    if (item.blog_images) {
      currentBlog.images.push(item.blog_images.imageUrl);
    }

    if (item.blog_favourite) {
      const favId = item.blog_favourite.id;
      if (!currentBlog.favourites.has(favId)) {
        currentBlog.favourites.add(favId);
        currentBlog.likeCount += 1;
      }
    }
  });

  resultMap.forEach((value) => {
    delete value.favourites;
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

export const AddBlogToFavorite = async (clerkUserId, blogPostId) => {
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

    // 2. Kiểm tra đã có trong bảng BlogFavourite chưa
    const existed = await db
      .select()
      .from(BlogFavourite)
      .where(
        and(eq(BlogFavourite.userId, userId), 
        eq(BlogFavourite.blogPostId, blogPostId)))
      .execute();

    if (existed.length > 0) {
      return { success: false, message: "Bài viết đã có trong mục yêu thích." };
    }

    // 3. Thêm vào bảng BlogFavourite
    await db.insert(BlogFavourite).values({
      userId,
      blogPostId,
    }).execute();

    return { success: true, message: "Đã thêm bài viết vào yêu thích!" };
  } catch (error) {
    console.error("Lỗi khi thêm yêu thích:", error);
    return { success: false, message: 'Lỗi khi thêm vào yêu thích' };
  }
};

// Service.js
export const CheckBlogLikeStatus = async (clerkUserId, blogPostId) => {
  try {
    const existingUser = await db.select()
      .from(User)
      .where(eq(User.clerkUserId, clerkUserId))
      .execute();

    if (!existingUser?.length) return false;

    const existed = await db.select()
      .from(BlogFavourite)
      .where(and(
        eq(BlogFavourite.userId, existingUser[0].id),
        eq(BlogFavourite.blogPostId, blogPostId)
      ))
      .execute();

    return existed.length > 0;
  } catch (error) {
    console.error("Lỗi kiểm tra like:", error);
    return false;
  }
};

export const RemoveBlogFromFavorite = async (clerkUserId, blogPostId) => {
  try {
    const existingUser = await db.select()
      .from(User)
      .where(eq(User.clerkUserId, clerkUserId))
      .execute();

    if (!existingUser?.length) {
      return { success: false, message: "Không tìm thấy người dùng" };
    }

    await db.delete(BlogFavourite)
      .where(and(
        eq(BlogFavourite.userId, existingUser[0].id),
        eq(BlogFavourite.blogPostId, blogPostId)
      ))
      .execute();

    return { success: true };
  } catch (error) {
    console.error("Lỗi khi bỏ like:", error);
    return { success: false };
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

export const createCarReport = async (data) => {
  return await db.insert(ReportCarListing).values({
    reporterId: data.reporterId,
    carListingId: data.carListingId,
    reason: data.reason,
    details: data.details,
    status: data.status
  }).returning();
};

export const createBlogReport = async (data) => {
  return await db.insert(ReportBlogPost).values({
    reporterId: data.reporterId,
    blogPostId: data.blogPostId,
    reason: data.reason,
    details: data.details,
    status: data.status
  }).returning();
};

export const createUserReport = async (data) => {
  return await db.insert(ReportUser).values({
    reporterId: data.reporterId,
    reportedUserId: data.reportedUserId,
    reason: data.reason,
    details: data.details,
    status: data.status
  }).returning();
};


export const CreateAppointment = async (data) => {
  try {
    const result = await db.insert(Appointment).values(data).returning();
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Lỗi tạo cuộc hẹn:", error);
    return { success: false, message: 'Lỗi khi tạo cuộc hẹn' };
  }
};


export const GetUserAppointments = async (userId) => {
  try {
    const buyerAppointments = await db.select({
      id: Appointment.id,
      scheduledTime: Appointment.scheduledTime,
      status: Appointment.status,
      notes: Appointment.notes,
      carListingId: Appointment.carListingId,
      carTitle: CarListing.listingTitle,
      owner: User, 
      role: sql`'buyer'` 
    })
    .from(Appointment)
    .innerJoin(CarListing, eq(Appointment.carListingId, CarListing.id))
    .innerJoin(User, eq(CarListing.createdBy, User.id))
    .where(eq(Appointment.userId, userId))

    const sellerAppointments = await db.select({
      id: Appointment.id,
      scheduledTime: Appointment.scheduledTime,
      status: Appointment.status,
      notes: Appointment.notes,
      carListingId: Appointment.carListingId,
      carTitle: CarListing.listingTitle,
      buyer: User, 
      role: sql`'seller'`
    })
    .from(Appointment)
    .innerJoin(CarListing, eq(Appointment.carListingId, CarListing.id))
    .innerJoin(User, eq(Appointment.userId, User.id))
    .where(eq(CarListing.createdBy, userId))

    return [...buyerAppointments, ...sellerAppointments];
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
};

export const UpdateAppointmentStatus = async (appointmentId, status, reason = null) => {
  try {
    await db.update(Appointment)
      .set({ status, reason })
      .where(eq(Appointment.id, appointmentId))
      .execute();
    return { success: true };
  } catch (error) {
    console.error("Error updating appointment status:", error);
    return { success: false, message: error.message };
  }
};

export default{
    FormatResult,
    GetFavoriteCars,
    AddToFavorite,
    getCommentsWithUsers,
    GetUserByClerkId,
    UpdateUserProfile,
    checkUserInDb,

    GetBlogPosts,
    GetSingleBlogPost,
    CreateBlogPost,
    UpdateBlogPost,
    GetUserBlogPosts,
    GetBlogPostById,
    AddBlogToFavorite,
    CheckBlogLikeStatus,
    RemoveBlogFromFavorite,

    createCarReport,
    createBlogReport,
    createUserReport,
    CreateAppointment,
    GetUserAppointments,
    UpdateAppointmentStatus

}