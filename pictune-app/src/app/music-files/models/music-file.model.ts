export interface MusicFile {
    displayName: string
    id: number
    fileName: string
    s3Key: string
    uploadedAt: string
    userId: string
    isLiked?: boolean
  }
  
  export interface MusicFileUploadDto {
    displayName: string
  }
  
  