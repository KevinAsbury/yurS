using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        // The database context
        private readonly IUserRepository _repo;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        public UsersController(IUserRepository repo, IMapper mapper, IPhotoService photoService)
        {
            _photoService = photoService;
            _mapper = mapper;
            _repo = repo;
        }

        /// <summary>
        /// Action: GET
        /// Description: Returns a list of all users
        /// URL: {url}/api/users
        /// </summary>
        /// <returns>List of users</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery]UserParams userParams)
        {
            var user = await _repo.GetByUsernameAsync(User.GetUserName());
            userParams.CurrentUsername = user.UserName;

            // if(string.IsNullOrEmpty(userParams.Gender))
            // {
            //     userParams.Gender = user.Gender == "male" ? "female" : "male";
            // }

            var users = await _repo.GetMembersAsync(userParams);

            Response.AddPaginationHeader(users.CurrentPage, users.PageSize, 
                users.TotalCount, users.TotalPages);

            return Ok(users);
        }

        /// <summary>
        /// Action: GET
        /// Description: Returns one user
        /// URL: {url}/api/users/{username}
        /// </summary>
        /// <param name="username"></param>
        /// <returns>A singlue user</returns>        
        [HttpGet("{username}", Name="GetUser"),]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            return await _repo.GetMemberAsync(username);
        }

        /// <summary>
        /// Action: POST
        /// Description: Updates a user
        /// </summary>
        /// <param name="memberUpdateDto"></param>
        /// <returns></returns>
        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var user = await _repo.GetByUsernameAsync(User.GetUserName());

            _mapper.Map(memberUpdateDto, user);

            _repo.Update(user);

            if (await _repo.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update user");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await _repo.GetByUsernameAsync(User.GetUserName());

            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if (user.Photos.Count == 0)
            {
                photo.IsMain = true;
            }

            user.Photos.Add(photo);

            if (await _repo.SaveAllAsync())
            {
                // To return a "201 Created" response
                return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<PhotoDto>(photo));
            }

            return BadRequest("Problem adding photo");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _repo.GetByUsernameAsync(User.GetUserName());

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if (photo.IsMain) return BadRequest("This is already your main photo");

            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);

            if (currentMain != null) currentMain.IsMain = false;

            photo.IsMain = true;

            if (await _repo.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to set main photo");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _repo.GetByUsernameAsync(User.GetUserName());

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if (photo == null) return NotFound();

            if (photo.IsMain) return BadRequest("You cannot delete your main photo");

            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);

                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            user.Photos.Remove(photo);

            if (await _repo.SaveAllAsync()) return Ok();

            return BadRequest("Failed to delete photo");
        }
    }
}