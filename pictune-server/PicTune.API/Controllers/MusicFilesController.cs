using Amazon.S3.Model;
using Amazon.S3;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PicTune.Core.DTOs;
using PicTune.Core.IServices;
using System.Security.Claims;
using System.Net;

namespace PicTune.API.Controllers
{

    [Route("api/files")]
    [ApiController]
    public class MusicFileController : ControllerBase
    {
        private readonly IMusicFileService _musicFileService;
        private readonly IAmazonS3 _s3Client;

        public MusicFileController(IMusicFileService musicFileService, IAmazonS3 s3Client)
        {
            _musicFileService = musicFileService;
            _s3Client = s3Client;
        }

        [HttpGet]
        [Authorize]
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
        [Authorize("EditorOrAdmin")]
        public async Task<IActionResult> UpdateMusicFile(int id, [FromBody] MusicFileUploadDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var success = await _musicFileService.UpdateMusicFileAsync(id, dto.FileName, userId);
            return success ? Ok("File updated") : Forbid();
        }

        [HttpDelete("{id}")]
        [Authorize("EditorOrAdmin")]
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
            var file = await _musicFileService.GetMusicFileByIdAsync(id);
            if (file == null) return NotFound("File not found.");

            // Generate a pre-signed URL
            var request = new GetPreSignedUrlRequest
            {
                BucketName ="pictune-files-testpnoren",
                Key = file.S3Key, 
                Expires = DateTime.UtcNow.AddHours(1), // URL valid for 1 hour
                Verb = HttpVerb.GET
            };

            string url = _s3Client.GetPreSignedURL(request);
            return Ok(new { url });
        }
        [HttpPost("{id}/like")]
        [Authorize]
        public async Task<IActionResult> ToggleLike(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var success = await _musicFileService.ToggleLikeAsync(id, userId);
            return success ? Ok(new { message = "Like status updated" }) : NotFound("File not found.");
        }


[HttpGet("extract-image")]
        public async Task<IActionResult> ExtractImage( [FromQuery] string fileKey)
        {
            if ( string.IsNullOrWhiteSpace(fileKey))
            {
                return BadRequest(" file key is required.");
            }

            try
            {
                // Fetch the MP3 file from S3
                var request = new GetObjectRequest
                {
                    BucketName = "pictune-files-testpnoren",
                    Key = fileKey
                };

                using var response = await _s3Client.GetObjectAsync(request);
                using var memoryStream = new MemoryStream();
                await response.ResponseStream.CopyToAsync(memoryStream);

                // Reset stream position for reading
                memoryStream.Seek(0, SeekOrigin.Begin);

                // Extract image using TagLib
                var tagFile = TagLib.File.Create(new TagLib.StreamFileAbstraction(fileKey, memoryStream, memoryStream));

                if (tagFile.Tag.Pictures.Length == 0)
                {
                    return NotFound("No embedded image found in the MP3 file.");
                }

                var picture = tagFile.Tag.Pictures[0];
                var imageBytes = picture.Data.Data;

                // Return the image as a file
                return File(imageBytes, "image/jpeg");
            }
            catch (AmazonS3Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, $"S3 Error: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, $"Error: {ex.Message}");
            }
        }



    }
}
