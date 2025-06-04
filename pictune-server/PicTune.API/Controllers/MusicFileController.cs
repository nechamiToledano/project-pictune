using Amazon.S3.Model;
using Amazon.S3;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PicTune.Core.DTOs;
using PicTune.Core.IServices;
using System.Security.Claims;
using System.Net;
using DotNetEnv;

namespace PicTune.API.Controllers
{

    [Route("api/files")]
    [ApiController]
    public class MusicFileController : ControllerBase
    {
        private readonly IMusicFileService _musicFileService;
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;


        public MusicFileController(IMusicFileService musicFileService, IAmazonS3 s3Client)
        {
            _musicFileService = musicFileService;
            _s3Client = s3Client;
            _bucketName=Env.GetString("AWS_BUCKET_NAME");

        }

        [HttpGet]
        //[Authorize]
        public async Task<IActionResult> GetAllMusicFiles([FromQuery] bool? owner, [FromQuery] bool? favorites, [FromServices] IServiceScopeFactory scopeFactory)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (owner == null)
                userId = null;

            await using var scope = scopeFactory.CreateAsyncScope();
            var musicFileService = scope.ServiceProvider.GetRequiredService<IMusicFileService>();

            var files = await musicFileService.GetAllMusicFilesAsync(userId, favorites);
            return Ok(files);
        }


        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetMusicFileById(int id)
        {
            var file = await _musicFileService.GetMusicFileByIdAsync(id);
            return Ok(file);
        }



        [HttpPut("{id}")]
        [Authorize()]
        public async Task<IActionResult> UpdateMusicFile(int id, [FromBody] MusicFileUpdateDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var success = await _musicFileService.UpdateMusicFileAsync(id, dto.DisplayName, userId);
            return success ? Ok("File updated") : Forbid();
        }

        [HttpDelete("{id}")]
        [Authorize()]
        public async Task<IActionResult> DeleteMusicFile(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var success = await _musicFileService.DeleteMusicFileAsync(id, userId);
            return success ? Ok("File deleted") : Forbid();
        }
        [HttpGet("{id}/play")]
        [Authorize]
        public async Task<IActionResult> GetMusicFileUrl(int id)
        {
            var url = await _musicFileService.GeneratePreSignedUrlAsync(id);
            if (url == null) return NotFound("File not found.");

            return Ok(new { url });
        }

        [HttpPost("{id}/like")] // שינוי ל-POST
        [Authorize]
        public async Task<IActionResult> ToggleLike(int id)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdString))
            {
                return Unauthorized("User ID not found in claims.");
            }

        

            // קריאה לשירות לביצוע פעולת ה-ToggleLike
            await _musicFileService.ToggleLikeAsync(id, userIdString);
            return NoContent();
        }

      

[HttpGet("extract-image")]
    [Authorize]
    public async Task<IActionResult> ExtractImage([FromQuery] string fileKey)
    {
        if (string.IsNullOrWhiteSpace(fileKey))
        {
            return BadRequest("File key is required.");
        }

        try
        {
            // Fetch the MP3 file from S3
            var request = new GetObjectRequest
            {
                BucketName = _bucketName,
                Key = fileKey
            };

            using var response = await _s3Client.GetObjectAsync(request);
            using var memoryStream = new MemoryStream();
            await response.ResponseStream.CopyToAsync(memoryStream);

            // Reset stream position for reading
            memoryStream.Seek(0, SeekOrigin.Begin);

            // Extract image using TagLib
            // השתמש ב-memoryStream ישירות במקום ליצור StreamFileAbstraction חדש עם fileKey
            // שכן TagLib.File.Create יכול לקבל Stream.
            var tagFile = TagLib.File.Create(new TagLib.StreamFileAbstraction(fileKey, memoryStream, memoryStream));


            if (tagFile.Tag.Pictures.Length == 0)
            {
                // *** השינוי המרכזי כאן: החזר NoContent במקום NotFound ***
                return NoContent(); // HTTP 204 - Success, but no content
            }

            var picture = tagFile.Tag.Pictures[0];
            var imageBytes = picture.Data.Data;

            // Return the image as a file
            return File(imageBytes, "image/jpeg"); // או image/png, image/gif בהתאם ל-MimeType של התמונה אם ידוע
        }
        catch (AmazonS3Exception ex) when (ex.StatusCode == HttpStatusCode.NotFound)
        {
            return NoContent(); 
        }
        catch (AmazonS3Exception ex)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, $"S3 Error: {ex.Message}");
        }
        catch (Exception ex)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, $"Error extracting image: {ex.Message}");
        }
    }
    [HttpPost("{id}/transcribe")]
        [Authorize]
        public async Task<IActionResult> Transcribe(int id)
        {
            var transcript = await _musicFileService.TranscribeMusicFileAsync(id);
            return transcript!=null ? Ok(transcript) : StatusCode(500, "Transcription failed");
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("sync-from-s3")]
        public async Task<IActionResult> SyncFromS3()
        {
            await _musicFileService.SyncMissingMusicFilesFromS3Async();
            return Ok("Sync completed successfully.");
        }

    }
}
