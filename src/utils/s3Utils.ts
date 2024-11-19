import axios from "axios";

export const uploadFileToTemporaryS3 = async (
  file: File
): Promise<{ mediaUrl: string; objectKey: string }> => {
  // Request a presigned URL from the backend
  const response = await axios.post("/api/get-presigned-url-temp-bucket", {
    fileName: file.name,
    fileType: file.type,
  });

  const { presignedUrl, objectKey } = response.data;

  // Upload the file directly to S3 using the presigned URL
  await axios.put(presignedUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });

  // Request a presigned URL for accessing the media
  const accessResponse = await axios.post("/api/get-media-url-temp-bucket", {
    objectKey,
  });

  const { mediaUrl } = accessResponse.data;

  return { mediaUrl, objectKey };
};
