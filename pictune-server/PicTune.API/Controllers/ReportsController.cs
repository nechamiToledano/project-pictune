// בתוך PicTune.Api.Controllers
using Microsoft.AspNetCore.Mvc;
using PicTune.Core.IServices;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IMusicFileService _musicService;

    public ReportsController(IUserService userService, IMusicFileService musicService)
    {
        _userService = userService;
        _musicService = musicService;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummaryReport()
    {
        var userStats = await _userService.GetUserRegistrationStatsAsync();
        var musicStats = await _musicService.GetMusicUploadStatsAsync();

        var result = new
        {
            users = userStats,
            music = musicStats
        };

        return Ok(result);
    }
}
