import S3 from "aws-sdk/clients/s3";
import dotenv from 'dotenv';

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
});

export const uploadFile = (file) => {
  const uploadParms = {
    Bucket: bucketName,
    Body: file.buffer,
    Key: `img/${file.originalname}` //upload a file in `img` folder
  };

  return s3.upload(uploadParms).promise();
}

export const downloadFile = (fileKey) => {
  const downloadParams = {
    Bucket: bucketName,
    Key: `img/${fileKey}`
  }

  return s3.getObject(downloadParams).createReadStream();
}

export const deleteFile = (fileKey) => {
  const deleteParams = {
    Bucket: bucketName,
    Key: `img/${fileKey}` //delete file from `img` folder
  }

  return s3.deleteObject(deleteParams).promise();
}

export const deleteMultiple = (fileKeys) => {
  const keyList = fileKeys.map(fileKey => {
    return {
      Key: `img/${fileKey}` //delete file from `img` folder
    };
  });

  const multipleDelParams = {
    Bucket: bucketName,
    Delete: {
      Objects: keyList,
      Quiet: false
    }
  };

  return s3.deleteObjects(multipleDelParams).promise();
}
