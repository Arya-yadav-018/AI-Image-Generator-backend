import FormData from 'form-data';
import axios from 'axios';
import {User} from '../models/usermodel.js';

export const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    const user = await User.findById(req.id);  // req.id should be set by auth middleware

    if (!user || !prompt) {
      return res.status(400).json({
        message: "Missing user or prompt",
        success: false,
      });
    }

    if (user.creditBalance <= 0) {
      return res.status(403).json({
        message: "No Credit Balance",
        success: false,
        creditBalance: user.creditBalance,
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API,
          ...formData.getHeaders(),   // important to include FormData headers
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    // atomic update
    await User.findByIdAndUpdate(req.id, { $inc: { creditBalance: -1 } });

    return res.json({
      success: true,
      message: "Image generated successfully",
      creditBalance: user.creditBalance - 1,
      resultImage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Image generation failed",
      success: false,
    });
  }
};
