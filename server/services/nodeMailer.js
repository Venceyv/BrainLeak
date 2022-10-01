import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const transpoter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.GMAILACCOUNT,
        pass: process.env.GMAILPASSWORD
    }
});
function notifyAuthor (toEamil,userName,commentContent,postTitle,postDescription)
{
    return {
        from: process.env.GMAILACCOUNT,
        to: toEamil,
        subject: userName + ' left a comment under your post.',
        text: commentContent + '\r\n' + 'Post Details:\r\n' + postTitle + '\r\n' + postDescription
    }
}
export {transpoter,notifyAuthor};