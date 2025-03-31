using Microsoft.AspNetCore.Mvc;
using PicTune.Core.DTOs;
using PicTune.Core.IServices;
using PicTune.Data.Models;
using PicTune.Service;


namespace PicTune.Api.Controllers
{
    [Route("api/playlists")]
    [ApiController]
    public class PlaylistController : ControllerBase
    {
        private readonly IPlaylistService _service;

        public PlaylistController(IPlaylistService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Playlist>>> GetAllPlaylists()
        {
            return Ok(await _service.GetAllPlaylistsAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Playlist>> GetPlaylistById(Guid id)
        {
            var playlist = await _service.GetPlaylistByIdAsync(id);
            if (playlist == null) return NotFound();
            return Ok(playlist);
        }

        [HttpPost]
        public async Task<ActionResult<Playlist>> CreatePlaylist([FromBody] CreatePlaylistDto dto)
        {
            var playlist = await _service.CreatePlaylistAsync(dto);
            return CreatedAtAction(nameof(GetPlaylistById), new { id = playlist.Id }, playlist);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePlaylist(Guid id, [FromBody] UpdatePlaylistDto dto)
        {
            var success = await _service.UpdatePlaylistAsync(id, dto);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlaylist(Guid id)
        {
            var success = await _service.DeletePlaylistAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
        [HttpPost("{playlistId}/songs")]
        public async Task<IActionResult> AddSongToPlaylist(Guid playlistId, [FromBody] AddSongToPlaylistDto dto)
        {
            if (dto == null || dto.SongId <= 0)
                return BadRequest("Invalid song ID.");

            var success = await _service.AddSongToPlaylistAsync(playlistId, dto.SongId);
            if (!success) return NotFound("Playlist or song not found.");
            return NoContent();
        }

        [HttpDelete("{playlistId}/songs/{songId}")]
        public async Task<IActionResult> RemoveSongFromPlaylist(Guid playlistId, int songId)
        {
            var success = await _service.RemoveSongFromPlaylistAsync(playlistId, songId);
            if (!success) return NotFound("Playlist or song not found.");
            return NoContent();
        }

    }
}
