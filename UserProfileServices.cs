using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;

namespace Sabio.Web.Core.Services
{
    public class UserProfileServices : IUserProfileServices
    {
        private readonly IDataProvider _dataProvider;

        public UserProfileServices(IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }

        public List<UserProfile> Get()
        {
            List<UserProfile> results = null;
            _dataProvider.ExecuteCmd(
                "dbo.UserProfiles_SelectAll_V2",
                null,
                (reader, recordSetIndex) =>
                {
                    UserProfile userProfile = Mapper(reader);

                    if (results == null)
                    {
                        results = new List<UserProfile>();
                    }

                    results.Add(userProfile);
                }
                );
            return results;
        }

        public Paged<UserProfile> GetPaginated(int pageIndex, int pageSize)
        {
            Paged<UserProfile> pagedList = null;
            List<UserProfile> list = null;
            int totalCount = 0;
            _dataProvider.ExecuteCmd(
                "dbo.UserProfiles_SelectAllPaginated_V2",
                (parameters) =>
                {
                    parameters.AddWithValue("@PageIndex", pageIndex);
                    parameters.AddWithValue("@PageSize", pageSize);
                },
                (reader, recordSetIndex) =>
                {
                    UserProfile userProfile = Mapper(reader);
                    totalCount = reader.GetSafeInt32(14);

                    if (list == null)
                    {
                        list = new List<UserProfile>();
                    }

                    list.Add(userProfile);
                }
                );
            if (list != null)
            {
                pagedList = new Paged<UserProfile>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<UserProfile> GetSearchPaginated(string search, int pageIndex, int pageSize)
        {
            Paged<UserProfile> pagedList = null;
            List<UserProfile> list = null;
            int totalCount = 0;

            _dataProvider.ExecuteCmd(
                "UserProfiles_SearchPaginated",
                (paramCol) =>
                {
                    paramCol.AddWithValue("@PageIndex", pageIndex);
                    paramCol.AddWithValue("@PageSize", pageSize);
                    paramCol.AddWithValue("@Search", search);
                },
                (reader, set) =>
                {
                    int index = 0;
                    UserProfile userProfile = new UserProfile();
                    userProfile.Id = reader.GetSafeInt32(index++);
                    userProfile.FirstName = reader.GetString(index++);
                    userProfile.LastName = reader.GetString(index++);
                    userProfile.Email = reader.GetSafeString(index++);
                    userProfile.AvatarUrl = reader.GetString(index++);
                    userProfile.Description = reader.GetString(index++);
                    userProfile.DOB = reader.GetDateTime(index++);
                    userProfile.PhoneNumber = reader.GetString(index++);
                    userProfile.UserId = reader.GetSafeInt32(index++);
                    userProfile.MilestoneId = reader.GetSafeInt32(index++);
                    totalCount = reader.GetInt32(index++);

                    if (list == null)
                    {
                        list = new List<UserProfile>();
                    }
                    list.Add(userProfile);
                }
                );
            if (list != null)
            {
                pagedList = new Paged<UserProfile>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public UserProfile GetById(int id)
        {
            UserProfile userProfile = null;
            _dataProvider.ExecuteCmd(
                "dbo.UserProfiles_SelectById",
                (parameters) =>
                {
                    parameters.AddWithValue("@Id", id);
                },
                (reader, recordSetIndex) =>
                {
                    userProfile = Mapper(reader);
                }
                );
            return userProfile;
        }

        public UserProfile Get(int id)
        {
            UserProfile userProfile = null;
            _dataProvider.ExecuteCmd(
                "dbo.UserProfiles_SelectById_V2",
                (parameters) =>
                {
                    parameters.AddWithValue("@UserId", id);
                },
                (reader, recordSetIndex) =>
                {
                    // if (recordSetIndex == 0)
                    {
                        userProfile = Mapper(reader);
                    }
                }
                );
            return userProfile;
        }

        public int Insert(UserProfileAddRequest model, int userId)
        {
            int newUserProfileId = 0;
            _dataProvider.ExecuteNonQuery(
                "dbo.UserProfiles_Insert",
                (parameters) =>
                {
                    if (model.AvatarUrl == null || model.AvatarUrl.ToString() == "")
                    {
                        parameters.AddWithValue("@AvatarUrl", "");
                    }
                    else
                    {
                        parameters.AddWithValue("@AvatarUrl", model.AvatarUrl.ToString());
                    }

                    parameters.AddWithValue("@FirstName", model.FirstName);
                    parameters.AddWithValue("@LastName", model.LastName);

                    parameters.AddWithValue("@Description", model.Description);
                    // parameters.AddWithValue("@DOB", model.DOB);
                    if (model.DOB == null || model.DOB.ToString() == "")
                    {
                        parameters.AddWithValue("@DOB", DBNull.Value);
                    }
                    else
                    {
                        parameters.AddWithValue("@DOB", model.DOB);
                    }
                    parameters.AddWithValue("@UserId", userId);
                    parameters.AddWithValue("@PhoneNumber", model.PhoneNumber);
                    parameters.AddWithValue("@MilestoneId", model.MilestoneId);

                    parameters.Add("@Id", SqlDbType.Int).Direction = ParameterDirection.Output;
                },
                (parameters) =>
                {
                    Int32.TryParse(parameters["@Id"].Value.ToString(), out newUserProfileId);
                }
                );
            return newUserProfileId;
        }

        public bool PhoneExists(string phoneNumber, int userId)
        {
            UserProfile userProfile = null;
            bool phoneExists = false;
            _dataProvider.ExecuteCmd("dbo.UserProfiles_CheckPhoneInDB", (parameters) =>
            {
                parameters.AddWithValue("@PhoneNumber", phoneNumber);
                parameters.AddWithValue("@UserId", userId);
            },
            (reader, setRecordIndex) =>
            {
                userProfile = PhoneMapper(reader);
                phoneExists = true;
            }
            );
            return phoneExists;
        }

        public string UpdatePhone(UserProfilesUpdatePhoneRequest model, int userId, string smsToken)
        {
            _dataProvider.ExecuteNonQuery("dbo.UserProfiles_UpdatePhoneNumber", (parameters) =>
            {
                parameters.AddWithValue("@PhoneNumber", model.PhoneNumber);
                parameters.AddWithValue("@UserId", userId);
                parameters.AddWithValue("@SmsToken", smsToken);
            });
            return smsToken;
        }

        public void ClearPhoneAndSmsToken(int userId)
        {
            _dataProvider.ExecuteNonQuery("dbo.UserProfiles_ClearPhoneAndSmsToken", (parameters) =>
            {
                parameters.AddWithValue("@UserId", userId);
            });
        }

        public bool VerifyConfirmPhone(string smsToken, int userId)
        {
            bool verifiedPhone = false;
            _dataProvider.ExecuteNonQuery("dbo.UserProfiles_VerifySmsToken", (parameters) =>
            {
                parameters.AddWithValue("@SmsToken", smsToken);
                parameters.AddWithValue("@UserId", userId);
            }, (returnParams) =>
            {
                verifiedPhone = true;
            });
            return verifiedPhone;
        }

        public bool UnverifyConfirmPhone(string smsToken, int userId)
        {
            bool unverifiedPhone = false;
            _dataProvider.ExecuteNonQuery("dbo.UserProfiles_UnverifySmsToken", (parameters) =>
            {
                parameters.AddWithValue("@SmsToken", smsToken);
                parameters.AddWithValue("@UserId", userId);
            },
            (returnParams) =>
            {
                unverifiedPhone = true;
            });
            return unverifiedPhone;
        }

        public void Update(UserProfileUpdateRequest model)
        {
            _dataProvider.ExecuteNonQuery(
                "dbo.UserProfiles_Update",
                (parameters) =>
                {
                    parameters.AddWithValue("@Id", model.Id);
                    parameters.AddWithValue("@FirstName", model.FirstName);
                    parameters.AddWithValue("@LastName", model.LastName);
                    if (model.AvatarUrl == null || model.AvatarUrl.ToString() == "")
                    {
                        parameters.AddWithValue("@AvatarUrl", "");
                    }
                    else
                    {
                        parameters.AddWithValue("@AvatarUrl", model.AvatarUrl.ToString());
                    }
                    parameters.AddWithValue("@Description", model.Description);
                    parameters.AddWithValue("@DOB", model.DOB);
                    parameters.AddWithValue("@PhoneNumber", model.PhoneNumber);
                    parameters.AddWithValue("@MilestoneId", model.MilestoneId);
                }
                );
        }

        public void Delete(int id)
        {
            _dataProvider.ExecuteNonQuery(
                "dbo.UserProfiles_Delete",
                (parameters) =>
                {
                    parameters.AddWithValue("@Id", id);
                }
                );
        }

        private UserProfile Mapper(IDataReader reader)
        {
            int index = 0;
            UserProfile userProfile = new UserProfile();
            userProfile.Id = reader.GetSafeInt32(index++);
            userProfile.FirstName = reader.GetSafeString(index++);
            userProfile.LastName = reader.GetSafeString(index++);
            userProfile.AvatarUrl = reader.GetSafeString(index++);
            userProfile.Description = reader.GetSafeString(index++);
            userProfile.DOB = reader.GetSafeDateTimeNullable(index++);
            userProfile.PhoneNumber = reader.GetSafeString(index++);
            userProfile.UserId = reader.GetSafeInt32(index++);
            userProfile.MilestoneId = reader.GetSafeInt32(index++);
            userProfile.DateCreated = reader.GetDateTime(index++);
            userProfile.DateModified = reader.GetDateTime(index++);
            userProfile.Email = reader.GetSafeString(index++);
            userProfile.SmsToken = reader.GetSafeString(index++);
            userProfile.PhoneConfirmed = reader.GetSafeBoolNullable(index++);

            return userProfile;
        }

        private UserProfile PhoneMapper(IDataReader reader)
        {
            UserProfile userProfile = new UserProfile();
            int index = 0;

            userProfile.PhoneNumber = reader.GetSafeString(index++);
            userProfile.UserId = reader.GetSafeInt32(index++);
            userProfile.SmsToken = reader.GetSafeString(index++);
            userProfile.PhoneConfirmed = reader.GetSafeBoolNullable(index++);

            return userProfile;
        }
    }
}
