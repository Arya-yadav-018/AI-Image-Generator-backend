import express from "express";
import { generateImage} from "../controllers/imagecontroller.js";
import isAuthenticated from "../middleware/isAuth.js";


const router = express.Router();

router.post("/generateimage" , isAuthenticated , generateImage);

export default router;