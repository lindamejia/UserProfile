using System;
using System.ComponentModel.DataAnnotations;

namespace Sabio.Models.Requests
{
    public class UserProfileAddRequest
    {
        [Required, MinLength(2), MaxLength(255)]
        public string FirstName { get; set; }

        [Required, MinLength(2), MaxLength(255)]
        public string LastName { get; set; }

        public Uri AvatarUrl { get; set; }

        public string Description { get; set; }

        [DataType(DataType.Date)]
        public DateTime? DOB { get; set; }

        [DataType(DataType.PhoneNumber)]
        public string PhoneNumber { get; set; }

        [Range(0, Int32.MaxValue)]
        public int MilestoneId { get; set; }

        [MaxLength(4)]
        public string SmsToken { get; set; }
    }
}
