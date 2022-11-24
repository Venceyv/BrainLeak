import { bucket } from "../configs/googleCloud.js";
import dotenv from "dotenv";
dotenv.config();
//upload file to google cloud
function uploadFile(req, res) {
  try {
    if (req.file) {
      const blob = bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream();

      blobStream.on("finish", () => {
        console.log("success");
      });
      blobStream.end(req.file.buffer);
      const head = process.env.FILETAG + "<img src=";
      const fileUrl = '"'+"https://storage.googleapis.com/brainleak/" + req.file.originalname + '"';
      const Tag = head +fileUrl + ">" + process.env.FILETAG;
      return Tag;
    } else throw "error with img";
  } catch (error) {
    blobStream.end(req.file.buffer);
    return res.status(500).json({ error: error });
  }
}
export { uploadFile };
