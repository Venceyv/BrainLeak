import { bucket } from "../configs/googleCloud.js";
//upload file to google cloud
function uploadFile(req) {
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
    }
    return null;
  } catch (error) {
    blobStream.end(req.file.buffer);
    console.log({error:error});
  }
}
export { uploadFile };
