namespace API.DTOs
{
    public class MemberUpdateDto
    {
        public string Alias { get; set; }
        public bool DisplayAge { get; set; }
        public string Orientation { get; set; }
        public string Gender { get; set; }
        public string Pronouns { get; set; }
        public string RelationshipStatus { get; set; }
        public string Introduction { get; set; }
        public string LookingFor { get; set; }
        public string Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
    }
}