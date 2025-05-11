using Amazon.S3.Model;
using Amazon.S3;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PicTune.Core.DTOs;
using PicTune.Core.IServices;
using PicTune.Core.Models;
using Microsoft.AspNetCore.Identity;
using PicTune.Service;
using DotNetEnv;

[ApiController]
[Route("api/upload")]
[Authorize]
public class UploadController : ControllerBase
{
    private readonly IAmazonS3 _s3Client;
    private readonly IMusicFileService _musicFileService;
    private readonly string _bucketName;

    public UploadController(IAmazonS3 s3Client, IMusicFileService musicFileService)
    {
        _s3Client = s3Client;
        _musicFileService = musicFileService;
        _bucketName = Env.GetString("AWS_BUCKET_NAME");


    }

    [HttpGet("presigned-url")]
    public async Task<IActionResult> GetPresignedUrl([FromQuery] string fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
        {
            return BadRequest("File name is required.");
        }

        var fileExtension = Path.GetExtension(fileName).ToLower();
        string contentType = fileExtension switch
        {
            ".mp3" => "audio/mpeg",
            ".jpg" => "image/jpeg",
            ".png" => "image/png",
            ".mp4" => "video/mp4",
            ".pdf" => "application/pdf",
            _ => "application/octet-stream"
        };

        var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}"; // Generate unique filename

        var request = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = uniqueFileName,
            Verb = HttpVerb.PUT,
            Expires = DateTime.UtcNow.AddMinutes(120), // Increased expiration time
            ContentType = contentType
        };
        string url = await Task.Run(() => _s3Client.GetPreSignedURL(request));

        return Ok(new { url, key = uniqueFileName }); // Return key for later retrieval
    }


    [HttpPost("upload-complete")]
    public async Task<IActionResult> UploadComplete([FromBody] MusicFileUploadDto dto)
    {
        if (string.IsNullOrEmpty(dto.S3Key))
            return BadRequest("Missing S3 key.");


        var musicFile = new MusicFile
        {
            FileName = dto.FileName,
            FileType = dto.FileType,
            Size = dto.Size,
            S3Key = dto.S3Key,
            FolderId = dto.FolderId,
            UploadedAt = DateTime.UtcNow,
        };

        var result = await _musicFileService.AddMusicFileAsync(musicFile, User.Identity.Name);
        return result != null ? Ok(result) : StatusCode(500, "Failed to save file metadata.");
    }


}
