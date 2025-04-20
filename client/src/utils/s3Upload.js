import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_SECRET_ACCESS_KEY,
  },
});

export const uploadPDFToS3 = async (fileBlob, fileName, userEmail) => {
    const arrayBuffer = await fileBlob.arrayBuffer();
  
    const params = {
      Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
      Key: `${userEmail}/${fileName}`,
      Body: arrayBuffer, 
      ContentType: 'application/pdf',
      ACL: 'private',
    };
  
    try {
      const command = new PutObjectCommand(params);
      const response = await s3Client.send(command);
      console.log('Upload successful:', response);
      return response;
    } catch (err) {
      console.error('Upload failed:', err);
      throw err;
    }
};