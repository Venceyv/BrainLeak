
import {bucket} from '../configs/googleCloud.js'

function uploadFile(req,res)
{
    try
    {
        if(req.file)
        {
            const blob = bucket.file(req.file.originalname);
            const blobStream = blob.createWriteStream();

            blobStream.on("finish",()=>{
                console.log('success');
            });
            blobStream.end(req.file.buffer);
            const fileUrl = "https://storage.googleapis.com/brainleak/"+req.file.originalname;
            return fileUrl;
        }
        else throw "error with img";
    }
    catch (error){
        res.status(500).send(error);
    }
}
export {uploadFile}