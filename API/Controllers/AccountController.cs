using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ITokenService tokenService, IMapper mapper)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _mapper = mapper;
            _tokenService = tokenService;

        }

        /// <summary>
        /// Action: POST
        /// Description: Register a user
        /// URL: {url}/api/account/register
        /// </summary>
        /// <param name="registerDto"></param>
        /// <returns>A register data transfer object or BadRequest object</returns>
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            // Check if user exists and return a bad request if they do
            if (await UserExists(registerDto.UserName))
                return BadRequest("Username is taken");

            var user = _mapper.Map<AppUser>(registerDto);

            // Create a new user, hash their password, create salt
            user.UserName = registerDto.UserName.ToLower();

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            // return username and jwt token
            return new UserDto
            {
                UserName = user.UserName,
                Token = _tokenService.CreateToken(user),
                Alias = user.Alias,
                Gender = user.Gender,
                Orientation = user.Orientation
            };
        }

        /// <summary>
        /// Action: POST
        /// Description: Login a user
        /// URL: {url}/api/account/login
        /// </summary>
        /// <param name="loginDto"></param>
        /// <returns>A user data transfer object or Unauthorized object</returns>
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            // Returns null if no user is found or the user
            // Throws and exception if more than on user is found
            var user = await _userManager.Users
                .Include(p => p.Photos)
                .SingleOrDefaultAsync(x => x.UserName.ToLower() == loginDto.UserName.ToLower());

            // Return unauthorized if username is not located
            if (user == null) return Unauthorized("Invalid username");

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded) return Unauthorized();

            // Return user name and jwt token on success
            return new UserDto
            {
                UserName = user.UserName,
                Token = _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                Alias = user.Alias,
                Gender = user.Gender,
                Orientation = user.Orientation
            };
        }

        // Helper function to check if user exists
        private async Task<bool> UserExists(string username)
        {
            return await _userManager.Users.AnyAsync(x => x.UserName.ToLower() == username.ToLower());
        }
    }
}