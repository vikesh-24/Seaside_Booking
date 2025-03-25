import express from "express";
import{
    getUsers,
    getUserById,
    registerUser,
    loginUser,
    logoutUser,
    updateUser,
    deleteUser
} from "../controllers/UserController.js";

const userRouter = express.Router(); 

userRouter.get("/all",getUsers); 
userRouter.get("/:id",getUserById); 
userRouter.post("/register",registerUser); 
userRouter.post("/login",loginUser); 
userRouter.post("/logout",logoutUser); 
userRouter.put("/:id",updateUser); 
userRouter.delete("/:id",deleteUser); 

export default userRouter;