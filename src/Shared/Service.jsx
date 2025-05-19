// import axios from "axios";

// const SendBirdApplicationId=import.meta.env.VITE_SENDBIRD_APP_ID;
// const SendBirdApiToken=import.meta.env.VITE_SENDBIRD_API_TOKEN;


import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { db } from './../../configs';
import { User } from './../../configs/schema'; 
import { eq } from 'drizzle-orm';

const FormatResult=(resp)=>{
    let result=[];
    let finalResult=[];
    resp.forEach((item)=>{
        const listingId=item.carListing?.id;
        if(!result[listingId])
        {
            result[listingId]={
                car:item.carListing,
                images:[]
            }
        }

        if(item.carImages)
        {
            result[listingId].images.push(item.carImages)
        }
    })
   
    result.forEach((item)=>{
        finalResult.push({
            ...item.car,
            images:item.images
        })
    })
 
    return finalResult;
}


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
    // CreateSendBirdUser,
    // CreateSendBirdChannel
    //checkUserInDB
}