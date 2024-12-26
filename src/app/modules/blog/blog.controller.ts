import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import { BlogServices } from './blog.services';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { BlogModel } from './blog.model';
import { UserModel } from '../user/user.model';

const createBlog = async (req: Request, res: Response) => {
  const { userId } = req.user;
 
  // const user = await UserModel.findOne({email:userId});
  // console.log(user)
  const result = await BlogServices.createBlogIntoDB(req.body, userId);
  sendResponse(res, {
    success: true,
    message: 'Blog created successfully',
    statusCode: httpStatus.CREATED,
    data: result,
  });
};
const getAllBlogs = catchAsync(async (req, res) => {
  const result = await BlogServices.getAllBlogsFromDB(req.query);

  sendResponse(res, {
    success: true,
    message: 'Blogs fetched successfully',
    statusCode: httpStatus.OK,
    data: result,
  });
});


const updateBlogFromDB = async (req: Request, res: Response) => {
  const { id } = req.params;
  const{ userId }= req.user

  const existingBlog = await BlogModel.findById(id);
  
  if (!existingBlog) {
     res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: 'Blog Not Found',
    });
    // throw new AppError(httpStatus.NOT_FOUND,"Blog not found")

  }

  const author = await UserModel.findOne({email:userId});


// console.log(existingBlog?.author.toString());


  if (existingBlog?.author.toString() !== author?._id.toString()) {
     res.status(httpStatus.FORBIDDEN).json({
      success: false,
      message: 'You are not authorized to update this blog',
    });
    return;
  }
  // if (existingBlog?.author.toString() !== author?._id.toString()) {
  //    res.status(httpStatus.FORBIDDEN).json({
  //     success: false,
  //     message: 'You are not authorized to update this blog',
  //   });
  //   return;
  // }
  const result = await BlogServices.updateBlogsIntoDB(
   id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog updated successfully',
    data: result,
  });
};


const deleteBlog =async (req: Request, res: Response)=>{
  const { id } = req.params;

  const existingBlog = await BlogModel.findById(id);

  if (!existingBlog) {
     res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: 'Blog Not Found',
    });
    return;
    // throw new AppError(httpStatus.NOT_FOUND,"Blog not found")
  }
  const{ userId }= req.user
  const author = await UserModel.findOne({email:userId});

// console.log(existingBlog?.author.toString());
// console.log(author?._id.toString());

  if (existingBlog?.author.toString() !== author?._id.toString()) {
     res.status(httpStatus.FORBIDDEN).json({
      success: false,
      message: 'You are not authorized to delete this blog',
    });
    return;
  }

  // const result =
   await BlogServices.deleteBlogFromDB(id);
   
  //  sendResponse(res, {
  //    success: true,
  //    message: 'Blog deleted successfully',
  //    statusCode: httpStatus.OK,
  //    data:result,
  //  });
   res.status(httpStatus.OK).json({
    success: true,
    message: 'Blog deleted successfully',
    "statusCode": httpStatus.OK,
  });
};






export const BlogController = {
  createBlog,
  getAllBlogs,
  updateBlogFromDB,
  deleteBlog
};
