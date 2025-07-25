﻿// בתוך PicTune.Api.Controllers
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PicTune.Core.DTOs;
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
    [Authorize("AdminOnly")]

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummaryReport([FromQuery] string timeRange = "month")
    {
        var userStats = await _userService.GetUserRegistrationStatsAsync(timeRange);
        var musicStats = await _musicService.GetMusicUploadStatsAsync(timeRange);

        var result = new
        {
            users = userStats,
            music = musicStats
        };

        return Ok(result);
    }
    [HttpGet("uploads-by-hour")]
    public async Task<ActionResult<List<HourlyStatDto>>> GetUploadStatsByHour()
    {
        var stats = await _musicService.GetUploadStatsByHourAsync();
        return Ok(stats);
    }
}
