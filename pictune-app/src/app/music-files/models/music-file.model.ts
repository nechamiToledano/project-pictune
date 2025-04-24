export interface MusicFile {
    id: number
    fileName: string
    s3Key: string
    uploadDate: string
    userId: string
    isLiked?: boolean
  }
  
  export interface MusicFileUploadDto {
    fileName: string
  }
  
  