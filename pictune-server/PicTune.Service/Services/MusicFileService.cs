using Amazon;
using Amazon.S3;
using Microsoft.AspNetCore.Identity;
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

        public MusicFileService(UserManager<User> userManager, IMusicFileRepository repository)
        {
            _userManager = userManager;
            _repository = repository;
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

            return _repository.GeneratePreSignedUrl(file.S3Key);
        }

        public async Task<string?> TranscribeMusicFileAsync(int fileId)
        {
            var file = await _repository.GetByIdAsync(fileId);
            if (file == null || string.IsNullOrEmpty(file.S3Key)) return null;

            var preSignedUrl =await GeneratePreSignedUrlAsync(file.Id); // reuse existing logic
            var transcript = await _repository.TranscribeFileAsync( preSignedUrl);
            if (transcript == null) return transcript;

            file.Transcript = transcript;
            await _repository.UpdateAsync(file);
            return null;
        }


        public async Task<List<StatPoint>> GetMusicUploadStatsAsync()
        {
            return await _repository.GetMusicUploadStatsAsync();
        }


    }
}


