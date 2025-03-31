import { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Upload,  ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import FileDropzone from '@/components/FileDropzone';
import ProgressBar from '@/components/ProgressBar';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {  getPresignedUrl, saveFileMetadata, uploadFileToS3 } from '@/services/uploadService';
import Background from './Background';
export default function FileUploaderPage() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
    setUploadComplete(false);
    setProgress(0);
  };

  const handleUpload = async () => {
    if (!file) {
      toast('No file selected');
      return;
    }

    setUploading(true);
    setProgress(0);
    setUploadComplete(false);

    try {
      // Step 1: Request a presigned URL from the backend
      const { url, key } = await getPresignedUrl(file.name);

      // Step 2: Upload the file directly to S3
      await uploadFileToS3(url,file,setProgress)

      // Step 3: Save file metadata in the backend
      await saveFileMetadata(file.name,file.type,file.size,key);

      setProgress(100);
      setUploadComplete(true);
      toast('Upload successful');

      // Reset after 3 seconds
      setTimeout(() => {
        setFile(null);
        setProgress(0);
        setUploadComplete(false);
      }, 3000);
    } catch (error) {
      toast('Upload failed');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
    
<Background/>

      <div className="container mx-auto px-4 z-10 pt-10 pb-20">
        <div className="flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <div className="inline-block p-4 rounded-full bg-gradient-to-r from-red-600/20 to-blue-600/20 mb-3">
                <Music className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Upload Your Music</h1>
              <p className="text-gray-300 mt-2">Transform your music into stunning visuals with our AI technology</p>
            </div>

            <Card className="border-none shadow-lg shadow-black/50 bg-black/40 backdrop-blur-md text-white overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-red-600/20 to-blue-600/20"></div>
              <CardContent className="p-6 space-y-6">
                <FileDropzone onFileSelect={handleFileSelect} selectedFile={file} />

                {/* Progress Bar */}
                {(progress > 0 || uploading) && (
                  <div className="mt-6 transition-all duration-300 ease-in-out">
                    <div className="relative">
                      <ProgressBar progress={progress} />
                      <p className="text-center text-sm text-gray-300 mt-2">
                        {progress < 100 ? `${Math.round(progress)}% completed` : 'Finalizing upload...'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <Button
                  onClick={handleUpload}
                  disabled={uploading || !file || uploadComplete}
                  className={`w-full transition-all duration-300 gap-2 font-medium text-white
                    ${
                      !uploading && !uploadComplete && file
                        ? "bg-gradient-to-r from-red-600/20 to-blue-600/20 hover:from-red-700 hover:to-blue-700"
                        : "bg-gray-700"
                    }
                    ${uploadComplete ? "bg-gradient-to-r from-green-600 to-green-500" : ""}
                    py-6 rounded-lg
                  `}
                >
                  {uploading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Uploading...
                    </>
                  ) : uploadComplete ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Upload Complete
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5" />
                      Upload Music File
                    </>
                  )}
                </Button>

                <div className="text-center text-sm text-gray-400">
                  <p>Supported formats: MP3, WAV, OGG, M4A (max 10MB)</p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 text-center">
              <Link to="/" className="text-gray-300 hover:text-white flex items-center justify-center gap-1 text-sm">
                <ChevronLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}



