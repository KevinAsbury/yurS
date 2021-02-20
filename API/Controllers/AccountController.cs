using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        // The database context
        private readonly DataContext _context;
        // JWT token service
        private readonly ITokenService _tokenService;
        public AccountController(DataContext context, ITokenService tokenService)
        {
            // Assign values to the properties
            _tokenService = tokenService;
            _context = context;
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

            // create a new hashing algorithm
            using var hmac = new HMACSHA512();

            // Create a new user, hash their password, create salt
            var user = new AppUser
            {
                UserName = registerDto.UserName.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key
            };

            // Add user to the databse
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // return username and jwt token
            return new UserDto
            {
                UserName = user.UserName,
                Token = _tokenService.CreateToken(user)
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
            var user = await _context.Users
                .SingleOrDefaultAsync(x => x.UserName.ToLower() == loginDto.UserName.ToLower());

            // Return unauthorized if username is not located
            if (user == null) return Unauthorized("Invalid username");

            // compare the password hashes
            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (var i = 0; i < computeHash.Length; i++)
            {
                if (computeHash[i] != user.PasswordHash[i])
                    return Unauthorized("Invalid password");
            }

            // Return user name and jwt token on success
            return new UserDto
            {
                UserName = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
        }

        // Helper function to check if user exists
        private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(x => x.UserName.ToLower() == username.ToLower());
        }
    }
}