import httpStatus from "http-status";

import { UserModel } from "../user/user.model";
import { Request, Response } from 'express';
import { AdminServices } from "./admin.services";
import { BlogModel } from "../blog/blog.model";

const blockUser =async (req: Request, res: Response)=>{
    const { userId } = req.params;
//   console.log(userId);
    const existingUser = await UserModel.findById(userId);
  
    if (!existingUser) {
         res.status(httpStatus.NOT_FOUND).json({
            success: false,
            message: 'User not found',
          }
        );
        return
    //   throw new AppError(httpStatus.NOT_FOUND,"User not found")
    }
    

     await AdminServices.blockUser(userId);

     res.status(httpStatus.OK).json({
      success: true,
      message: 'User blocked successfully',
      "statusCode": httpStatus.OK,
    });
  }


  const deleteBlogByAdmin =async (req: Request, res: Response)=>{
    const { id } = req.params;
  
    const existingBlog = await BlogModel.findById(id);
  
    if (!existingBlog) {
         res.status(httpStatus.NOT_FOUND).json({
            success: false,
            message: 'Blog not found',
          });
          return;
    //   throw new AppError(httpStatus.NOT_FOUND,"Blog not found")
    }

     await AdminServices.deleteBlog(id);
  
     res.status(httpStatus.OK).json({
      success: true,
      message: 'Blog deleted successfully',
      "statusCode": httpStatus.OK,
    });
  };
  


  export const AdminController ={
blogUser: blockUser,deleteBlogByAdmin
  }