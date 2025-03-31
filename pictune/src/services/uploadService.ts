import api from "@/components/Api";
import { MusicFile } from "@/store/slices/musicFilesSlice";
import axios from "axios";

export const getPresignedUrl = async (fileName: string) => {
  
  try {
    const response = await api.get("/upload/presigned-url", {
      params: { fileName },
    });


    console.log("Presigned URL response:", response.data);

    if (!response.data.url) {
      throw new Error("Invalid response: Missing URL");
    }

    return response.data; // { url, key }
  } catch (error) {
    console.error("Error fetching presigned URL:", error);
    throw error;
  }
};

// Upload file to S3 using presigned URL
export const uploadFileToS3 = async (uploadUrl: string, file: File, setProgress: React.Dispatch<React.SetStateAction<number>>) => {
  
  try {
    await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
      onUploadProgress: (progressEvent:any) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(percent);
      },
    });
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
};

export const saveFileMetadata = async (fileName: string, fileType: string, size: number, s3key: string, folderId: number = 0) => {
  try {
    const response = await api.post("/upload/upload-complete", { fileName, fileType, size, s3key, folderId });
    return response.data as MusicFile; // Assuming the response contains the file info with `extractedImageUrl`
  } catch (error) {
    console.error("Error saving file metadata:", error);
    throw error;
  }
};
