using System.ComponentModel.DataAnnotations;
using System;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required] public string UserName { get; set; }
        [Required] public DateTime DateOfBirth { get; set; }
        [Required] public string Alias { get; set; }
        [Required] public string Orientation { get; set; }
        [Required] public string Gender { get; set; }
        [Required] public string Pronouns { get; set; }
        [Required] public string RelationshipStatus { get; set; }
        [Required] public string City { get; set; }
        [Required] public string Country { get; set; }

        [Required]
        [StringLength(20, MinimumLength = 4)]
        public string Password { get; set; }
    }
}