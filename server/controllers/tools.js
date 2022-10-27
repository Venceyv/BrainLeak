import {uploadFile} from '../services/uploadFile.js';

function getFileUrl(req,res)
{
    const fileUrl = uploadFile(req,res);
    if(fileUrl)
    {
        res.status(200).json(fileUrl);
    }
}
export {getFileUrl};