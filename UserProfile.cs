using System;

namespace Sabio.Models.Domain
{
    public class UserProfile
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string AvatarUrl { get; set; }
        public string Description { get; set; }
        public DateTime? DOB { get; set; }
        public string PhoneNumber { get; set; }
        public int UserId { get; set; }
        public int MilestoneId { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public string Email { get; set; }
        public string SmsToken { get; set; }
        public bool? PhoneConfirmed { get; set; }
    }
}
