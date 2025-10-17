import express from "express";
import { login, register , getCredits , logout } from "../controllers/usercontroller.js";
import isAuthenticated from "../middleware/isAuth.js";


const router = express.Router();

router.post("/register" , register);
router.post("/login" , login);
router.get("/credits" ,isAuthenticated , getCredits);
router.post("/logout" , logout);



export default router;