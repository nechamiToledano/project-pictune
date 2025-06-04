using Amazon;
using Amazon.S3;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using PicTune.Core.DTOs;
using PicTune.Core.IRepositories;
using PicTune.Core.IServices;
using PicTune.Core.Models;
using PicTune.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace PicTune.Service
{
    public class MusicFileService : IMusicFileService
    {
        private readonly UserManager<User> _userManager;
        private readonly IMusicFileRepository _repository;
        private readonly ILogger<MusicFileService> _logger;

        public MusicFileService(UserManager<User> userManager, IMusicFileRepository repository, ILogger<MusicFileService> logger)
        {
            _userManager = userManager;
            _repository = repository;
            _logger= logger;
        }

        public async Task<MusicFile?> GetMusicFileByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<MusicFile?> AddMusicFileAsync(MusicFile musicFile, string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            if (user == null) return null;

            if (!(await _userManager.IsInRoleAsync(user, "Editor")))
            {
                await _userManager.AddToRoleAsync(user, "Editor");
            }

            musicFile.OwnerId = user.Id;
            await _repository.AddAsync(musicFile);
            return musicFile;
        }

        public async Task<bool> DeleteMusicFileAsync(int id, string userId)
        {
            var file = await _repository.GetByIdAsync(id);
            if (file == null) return false;

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null || !(await _userManager.IsInRoleAsync(user, "Editor") || await _userManager.IsInRoleAsync(user, "Admin")))
                return false;

            file.IsDeleted = true;
            await _repository.UpdateAsync(file);
            return true;
        }

        public async Task<bool> UpdateMusicFileAsync(int id, string newFileName, string userId)
        {
            var file = await _repository.GetByIdAsync(id);
            if (file == null) return false;

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null || !(await _userManager.IsInRoleAsync(user, "Editor") || await _userManager.IsInRoleAsync(user, "Admin")))
                return false;

            file.FileName = newFileName;
            await _repository.UpdateAsync(file);
            return true;
        }

        public async Task<bool> ToggleLikeAsync(int id, string userId)
        {
            var file = await _repository.GetByIdAsync(id);
            if (file == null) return false;

            file.IsLiked = !file.IsLiked;
            await _repository.UpdateAsync(file);
            return true;
        }

        public async Task<IEnumerable<MusicFile>> GetAllMusicFilesAsync(string? userId, bool? favorites)
        {
            return await _repository.GetAllMusicFilesAsync(userId, favorites);
        }
        public async Task<string?> GeneratePreSignedUrlAsync(int fileId)
        {
            var file = await _repository.GetByIdAsync(fileId);
            if (file == null) return null;

            return _repository.GeneratePreSignedUrl(file);
        }

        public async Task<string?> TranscribeMusicFileAsync(int fileId)
        {
            try
            {
                _logger.LogInformation("Starting transcription for fileId: {FileId}", fileId);

                var file = await _repository.GetByIdAsync(fileId);
                if (file == null)
                {
                    _logger.LogWarning("File not found for fileId: {FileId}", fileId);
                    return null;
                }

                if (string.IsNullOrEmpty(file.S3Key))
                {
                    _logger.LogWarning("File with ID {FileId} has no S3Key", fileId);
                    return null;
                }

                var preSignedUrl = await GeneratePreSignedUrlAsync(file.Id);
                _logger.LogInformation("Generated pre-signed URL for fileId {FileId}: {Url}", fileId, preSignedUrl);

                var transcript = await _repository.TranscribeFileAsync(preSignedUrl);
                if (transcript == null)
                {
                    _logger.LogWarning("Transcript is null for fileId: {FileId}", fileId);
                    return null;
                }

                file.Transcript = transcript;
                await _repository.UpdateAsync(file);

                _logger.LogInformation("Transcription saved successfully for fileId: {FileId}", fileId);
                return transcript;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error transcribing music file with ID: {FileId}", fileId);
                return null;
            }
        }


        public async Task<List<StatPoint>> GetMusicUploadStatsAsync(string timeRange)
        {
            return await _repository.GetMusicUploadStatsAsync(timeRange);
        }
        public Task<List<HourlyStatDto>> GetUploadStatsByHourAsync()
        {
            return _repository.GetUploadStatsByHourAsync();
        }
        public async Task SyncMissingMusicFilesFromS3Async()
        {
            await _repository.SyncMissingMusicFilesFromS3Async();

        }


    }
}


