import { Router } from "express";
const router = Router();
import cors from 'cors';


import { handleGenerateShortUrl } from '../controllers/url.js';

router.post("/", handleGenerateShortUrl);
router.use(cors());

export default router; 
