import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import os from "os";

const router = express.Router();
const upload = multer();

router.post(
  "/merge",
  upload.fields([{ name: "file1" }, { name: "file2" }]),
  async (req, res) => {
    try {
      const file1 = req.files["file1"]?.[0];
      const file2 = req.files["file2"]?.[0];
      const mode = req.body.mode;

      if (!file1 || !file2 || !mode) {
        return res.status(400).json({ error: "Missing file1, file2, or mode" });
      }

      // Step 1: Send file1 + mode to karaoke-split
      const splitForm = new FormData();
      splitForm.append("file", file1.buffer, file1.originalname);
      splitForm.append("mode", mode);

      const splitResponse = await axios.post(
        "http://localhost:8000/karaoke-split/mode",
        splitForm,
        {
          headers: splitForm.getHeaders(),
          responseType: "arraybuffer", // get back zip file
        }
      );

      // Step 2: Convert response to a File object
      const zipBuffer = Buffer.from(splitResponse.data);
      const tempZipPath = path.join(os.tmpdir(), "split_output.zip");
      fs.writeFileSync(tempZipPath, zipBuffer);

      // Step 3: Create new FormData with file2 + zip output
      const mergeForm = new FormData();
      mergeForm.append("file2", file2.buffer, file2.originalname);
      mergeForm.append("split_zip", fs.createReadStream(tempZipPath));

      const mergeResponse = await axios.post(
        "http://localhost:8000/karaoke-merge",
        mergeForm,
        {
          headers: mergeForm.getHeaders(),
        }
      );

      // Clean up temp file
      fs.unlinkSync(tempZipPath);

      // Forward the final output to the frontend
      res.json(mergeResponse.data);
    } catch (err) {
      console.error("Error in merge route:", err);
      res.status(500).json({ error: "Server error during merge process" });
    }
  }
);

export default router;
