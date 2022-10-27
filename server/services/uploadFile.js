import { bucket } from "../configs/googleCloud.js";
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
      const fileUrl = "https://storage.googleapis.com/brainleak/" + req.file.originalname;
      return fileUrl;
    } else throw "error with img";
  } catch (error) {
    blobStream.end(req.file.buffer);
    return res.status(500).json({ error: error });
  }
}
export { uploadFile };
