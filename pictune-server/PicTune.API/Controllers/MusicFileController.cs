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
            _bucketName = Env.GetString("AWS_BUCKET_NAME");
        }

        private string? GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier);

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllMusicFiles([FromQuery] bool? owner, [FromQuery] bool? favorites)
        {
            var userId = owner == true ? GetUserId() : null;
            var files = await _musicFileService.GetAllMusicFilesAsync(userId, favorites);
            return Ok(files);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetMusicFileById(int id)
        {
            var file = await _musicFileService.GetMusicFileByIdAsync(id);
            if (file == null) return NotFound();
            return Ok(file);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateMusicFile(int id, [FromBody] MusicFileUpdateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.DisplayName))
                return BadRequest("DisplayName is required");

            var userId = GetUserId();
            var success = await _musicFileService.UpdateMusicFileAsync(id, dto.DisplayName, userId);
            return success ? Ok(new { message = "File updated" }) : Forbid();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteMusicFile(int id)
        {
            var userId = GetUserId();
            var success = await _musicFileService.DeleteMusicFileAsync(id, userId);
            return success ? Ok(new { message = "File deleted" }) : Forbid();
        }

        [HttpGet("{id}/play")]
        [Authorize]
        public async Task<IActionResult> GetMusicFileUrl(int id)
        {
            var url = await _musicFileService.GeneratePreSignedUrlAsync(id);
            if (url == null) return NotFound(new { message = "File not found." });
            return Ok(new { url });
        }

        [HttpPost("{id}/like")]
        [Authorize]
        public async Task<IActionResult> ToggleLike(int id)
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized(new { message = "User ID not found in claims." });

            var file = await _musicFileService.GetMusicFileByIdAsync(id);
            if (file == null) return NotFound(new { message = "Music file not found." });

            await _musicFileService.ToggleLikeAsync(id, userId);
            return NoContent();
        }

        [HttpGet("extract-image")]
        [Authorize]
        public async Task<IActionResult> ExtractImage([FromQuery] string fileKey)
        {
            if (string.IsNullOrWhiteSpace(fileKey))
                return BadRequest("File key is required.");

            try
            {
                var request = new GetObjectRequest
                {
                    BucketName = _bucketName,
                    Key = fileKey
                };

                using var response = await _s3Client.GetObjectAsync(request);
                using var memoryStream = new MemoryStream();
                await response.ResponseStream.CopyToAsync(memoryStream);
                memoryStream.Seek(0, SeekOrigin.Begin);

                try
                {
                    var tagFile = TagLib.File.Create(new TagLib.StreamFileAbstraction(fileKey, memoryStream, memoryStream));

                    if (tagFile.Tag.Pictures.Length == 0)
                        return NoContent();

                    var picture = tagFile.Tag.Pictures[0];
                    var imageBytes = picture.Data.Data;

                    return File(imageBytes, "image/jpeg");
                }
                catch (TagLib.CorruptFileException ex)
                {
                    return NoContent(); // או שגיאה מותאמת אישית אם תרצי
                }

            }
            catch (AmazonS3Exception ex) when (ex.StatusCode == HttpStatusCode.NotFound)
            {
                return NoContent();
            }
            catch (AmazonS3Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new { message = $"S3 Error: {ex.Message}" });
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new { message = $"Error extracting image: {ex.Message}" });
            }
        }

        [HttpPost("{id}/transcribe")]
        [Authorize]
        public async Task<IActionResult> Transcribe(int id)
        {
            var transcript = await _musicFileService.TranscribeMusicFileAsync(id);
            if (transcript == null)
                return NotFound(new { message = "Transcript not available or file not found." });

            return Ok(transcript);
        }

        [HttpPost("sync-from-s3")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SyncFromS3()
        {
            await _musicFileService.SyncMissingMusicFilesFromS3Async();
            return Ok(new { message = "Sync completed successfully." });
        }
    }
}
