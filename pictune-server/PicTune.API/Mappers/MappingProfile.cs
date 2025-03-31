using AutoMapper;
using PicTune.Core.DTOs;
using PicTune.Core.Models;

namespace PicTune.Core.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<RegisterDto, User>()  // Map RegisterDto to User model
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

            CreateMap<LoginDto, User>(); // If needed for login checks
            CreateMap<User, UserDto>()
           .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.Roles.Select(r => r.Name)));

        }
    }
}
