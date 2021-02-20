using System.Collections.Generic;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class UsersController : BaseApiController
    {   
        // The database context
        private readonly DataContext _context;
        public UsersController(DataContext context)
        {
            // Assign values to the properties
            _context = context;
        }

        /// <summary>
        /// Action: GET
        /// Description: Returns a list of all users
        /// URL: {url}/api/users
        /// </summary>
        /// <returns>List of users</returns>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        /// <summary>
        /// Action: GET
        /// Description: Returns one user
        /// URL: {url}/api/users/{id#}
        /// </summary>
        /// <param name="id"></param>
        /// <returns>A singlue user</returns>        
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<AppUser>> GetUser(int id)
        {
            return await _context.Users.FindAsync(id);
        }
    }
}