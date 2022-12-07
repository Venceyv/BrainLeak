import { bucket } from "../configs/googleCloud.js";
import stream from "stream";
import crypto from "crypto";
//upload file to google cloud
function uploadB64File(base64Image) {
  try {
    const bufferStream = new stream.PassThrough();
    const imgString = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const fileName = crypto.randomUUID();
    bufferStream.end(Buffer.from(imgString, "base64"));
    const file =  bucket.file(fileName);
    bufferStream
      .pipe(
        file.createWriteStream({
          metadata: {
            contentType: "image/jpeg",
          },
          validation: "md5",
        })
      )
      .on("error", function (err) {
        console.log(err);
        return null;
      })
      .on("finish", function () {
        console.log("success");
      });
    const head = "<img src=";
    const fileUrl = '"' + "https://storage.googleapis.com/brainleak/" + fileName + '"';
    const Tag = head + fileUrl + ">";
    return Tag;
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}

function ConvertB64Files(files) {
  const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
  files.forEach((file, index) => {
    let fileSrc = file.match(srcReg)[0].substring(4);
    fileSrc = fileSrc.replace(/^\"|\"$/g, "");
    if (fileSrc.includes("data:image")) {
      const fileURL = uploadB64File(fileSrc);
      if (fileURL) {
        files[index] = fileURL;
      }
    }
  });
  return files;
}
function clearB64(body, type = "comment") {
  const imgReg = /<img.*?(?:>|\/>)/gi;
  const replacement = type === "post" ? body.description.match(imgReg) : body.content.match(imgReg);
  const images = type === "post" ? body.description.match(imgReg) : body.content.match(imgReg);
  if (replacement) {
    ConvertB64Files(replacement);
    let index = 0;
    images.forEach((image) => {
      if (type === "post") {
        body.description = body.description.replace(image, replacement[index]);
      } else {
        body.content = body.content.replace(image, replacement[index]);
      }
      index++;
    });
    if (type === "post") {
      body.cover = replacement[0];
    }
  }
  return body;
}
export { uploadB64File, ConvertB64Files, clearB64 };
