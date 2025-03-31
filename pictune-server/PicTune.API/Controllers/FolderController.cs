using Microsoft.AspNetCore.Mvc;
using PicTune.Service;
using PicTune.Core.Models;
using PicTune.Core.IServices;

namespace PicTune.Api.Controllers
{
    [ApiController]
    [Route("api/folders")]
    public class FolderController : ControllerBase
    {
        private readonly IFolderService _folderService;

        public FolderController(IFolderService folderService)
        {
            _folderService = folderService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var folders = await _folderService.GetAllFoldersAsync();
            return Ok(folders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var folder = await _folderService.GetFolderByIdAsync(id);
            if (folder == null) return NotFound();
            return Ok(folder);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Folder folder)
        {
            var createdFolder = await _folderService.CreateFolderAsync(folder);
            return CreatedAtAction(nameof(GetById), new { id = createdFolder.Id }, createdFolder);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, Folder updatedFolder)
        {
            var success = await _folderService.UpdateFolderAsync(id, updatedFolder);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var success = await _folderService.DeleteFolderAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
