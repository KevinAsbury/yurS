using System.Collections.Generic;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        // The database context
        private readonly IUserRepository _repo;
        public UsersController(IUserRepository repo)
        {
            _repo = repo;
        }

        /// <summary>
        /// Action: GET
        /// Description: Returns a list of all users
        /// URL: {url}/api/users
        /// </summary>
        /// <returns>List of users</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
            return Ok(await _repo.GetUsersAsync());
        }

        /// <summary>
        /// Action: GET
        /// Description: Returns one user
        /// URL: {url}/api/users/{username}
        /// </summary>
        /// <param name="username"></param>
        /// <returns>A singlue user</returns>        
        [HttpGet("{username}")]
        public async Task<ActionResult<AppUser>> GetUser(string username)
        {
            return await _repo.GetByUsernameAsync(username);
        }
    }
}