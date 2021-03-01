namespace API.DTOs
{
    public class LikeDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public int Age { get; set; }
        public string Alias { get; set; }
        public string PhotoUrl { get; set; }
        public string Orientation { get; set; }
        public string RelationshipStatus { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
    }
}