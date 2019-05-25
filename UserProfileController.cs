using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers.Temp
{
    [Route("api/users/")]
    [ApiController]
    public class UserProfileController : BaseApiController
    {
        private IUserProfileServices _userProfileServices;
        private readonly IAuthenticationService<int> _authService;
        private readonly ISmsServices _smsServices;

        public UserProfileController(IUserProfileServices userProfileServices,
            ISmsServices smsServices,
            IAuthenticationService<int> authService,
            ILogger<IUserProfileServices> logger) : base(logger)
        {
            _userProfileServices = userProfileServices;
            _authService = authService;
            _smsServices = smsServices;
        }

        //[HttpGet("")]
        //public ActionResult<ItemsResponse<UserProfile>> GetAll()
        //{
        //    ActionResult result = null;
        //    try
        //    {
        //        List<UserProfile> list = _userProfileServices.Get();
        //        if (list == null)
        //        {
        //            result = NotFound404(new ErrorResponse("Doesn't Exist"));
        //        }
        //        else
        //        {
        //            ItemsResponse<UserProfile> response = new ItemsResponse<UserProfile>();
        //            response.Items = list;
        //            result = Ok200(response);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Logger.LogError(ex.ToString());

        //        result = StatusCode(500, "Internal Server Error");
        //    }
        //    return result;
        //}

        [HttpGet("profile")]
        public ActionResult<ItemResponse<UserProfile>> GetByUserId()
        {
            ItemResponse<UserProfile> response = null;
            ActionResult result = null;
            int id = _authService.GetCurrentUserId();
            try
            {
                UserProfile profile = _userProfileServices.Get(id);

                if (profile == null)
                {
                    result = NotFound404(new ErrorResponse("Doesn't Exist"));
                }
                else
                {
                    response = new ItemResponse<UserProfile>();
                    response.Item = profile;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());

                result = StatusCode(500, new ErrorResponse(ex.Message));


            }

            return result;
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<UserProfile>> GetByIId(int id)
        {
            ItemResponse<UserProfile> response = null;
            ActionResult result = null;
            try
            {
                UserProfile profile = _userProfileServices.Get(id);

                if (profile == null)
                {
                    result = NotFound404(new ErrorResponse("Doesn't Exist"));
                }
                else
                {
                    response = new ItemResponse<UserProfile>();
                    response.Item = profile;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());

                result = StatusCode(500, new ErrorResponse(ex.Message));


            }

            return result;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Insert(UserProfileAddRequest model)
        {
            ItemResponse<int> response = null;
            ActionResult result = null;
            int userId = _authService.GetCurrentUserId();
            try
            {
                int newId = _userProfileServices.Insert(model, userId);

                if (newId > 0)
                {
                    response = new ItemResponse<int>();
                    response.Item = newId;
                    result = Ok200(response);
                }
                else
                {
                    result = NotFound404(new ErrorResponse("Please Check All Your Fields"));
                }
            }
            catch (Exception ex)
            {
                if (userId > 0)
                {
                    result = Ok200(response);
                }
                else
                {

                    Logger.LogError(ex.ToString());

                    result = StatusCode(500, new ErrorResponse(ex.Message));
                }
            }

            return result;
        }

        [HttpPut("{id:int}/editProfile")]
        public ActionResult<SuccessResponse> Update(UserProfileUpdateRequest model)
        {
            ActionResult result = null;
            try
            {
                _userProfileServices.Update(model);
                SuccessResponse response = new SuccessResponse();
                result = Ok200(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());

                result = StatusCode(500, ex.ToString());
            }
            return result;
        }

        [HttpPut("deletePhone")]
        public ActionResult<SuccessResponse> DeletePhoneInDb()
        {
            ActionResult result = null;
            SuccessResponse response = null;
            int userId = _authService.GetCurrentUserId();
            try
            {
                _userProfileServices.ClearPhoneAndSmsToken(userId);
                response = new SuccessResponse();
                result = Ok200(response);
            }
            catch(Exception e)
            {
                Logger.LogError(e.ToString());
                result = StatusCode(500, new ErrorResponse("Internal Server Error."));
            }
            return result; 
        }

        [HttpPut("updatePhone")]
        public ActionResult<ItemResponse<string>> UpdatePhone(UserProfilesUpdatePhoneRequest model)
        {
            ActionResult result = null;
            ItemResponse<string> response = null;
            int userId = _authService.GetCurrentUserId();
            Guid preSmsToken = Guid.NewGuid();
            string smsTokenBuild = preSmsToken.ToString();
            string smsToken = smsTokenBuild.Substring(smsTokenBuild.Length - 4);
            try
            {
                if (_userProfileServices.PhoneExists(model.PhoneNumber, userId)
                    && _userProfileServices.VerifyConfirmPhone(smsToken, userId) == true)
                {
                    result = NotFound404(new ErrorResponse("That number already exists in our database."));
                }
                else
                {
                    response = new ItemResponse<string>();
                    response.Item = _userProfileServices.UpdatePhone(model, userId, smsToken);
                    _userProfileServices.UnverifyConfirmPhone(smsToken, userId);

                    _smsServices.ConfirmSms(model.PhoneNumber, smsToken);

                    result = Ok200(response);
                }
            }
            catch (Exception e)
            {
                Logger.LogError(e.ToString());

                result = StatusCode(500, new ErrorResponse("Internal Server Error"));
            }
            return result;
        }

        [HttpPut("updatetoken")]
        public ActionResult<SuccessResponse> VerifySmsToken(UserProfilesUpdatePhoneRequest model)
        {
            ActionResult result = null;
            SuccessResponse response = null;
            int userId = _authService.GetCurrentUserId();
            try
            {
                _userProfileServices.VerifyConfirmPhone(model.SmsToken, userId);
                response = new SuccessResponse();
                result = Ok200(response);
            }
            catch (Exception e)
            {
                Logger.LogError(e.ToString());
                result = StatusCode(500, new ErrorResponse("Internal Server Error"));
            }

            return result;
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            ActionResult result = null;
            try
            {
                _userProfileServices.Delete(id);
                SuccessResponse response = new SuccessResponse();
                result = Ok200(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());

                result = StatusCode(500, "Internal Server Error");
            }
            return result;
        }

        [HttpGet]
        public ActionResult<ItemResponse<Paged<UserProfile>>> GetPaginated(int pageIndex, int pageSize)
        {
            ActionResult result = null;
            try
            {
                Paged<UserProfile> list = _userProfileServices.GetPaginated(pageIndex, pageSize);
                if (list.PagedItems == null)
                {
                    result = NotFound404(new ErrorResponse("Nothing was Found"));
                }
                else
                {
                    ItemResponse<Paged<UserProfile>> response = new ItemResponse<Paged<UserProfile>>();
                    response.Item = list;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());

                result = StatusCode(500, "Internal Server Error");
            }
            return result;
        }

        //[HttpGet("search")]
        //public ActionResult<ItemResponse<Paged<UserProfile>>> GetSearchPaginated 
        //    (string search, int pageIndex, int pageSize)
        //{
        //    ActionResult result = null;
        //    try
        //    {
        //        Paged<UserProfile> list = _userProfileServices.GetSearchPaginated(search, pageIndex, pageSize);
        //        if(list.PagedItems == null)
        //        {
        //            result = NotFound404(new ErrorResponse("Nothing was Found"));
        //        }
        //        else
        //        {
        //            ItemResponse<Paged<UserProfile>> response = new ItemResponse<Paged<UserProfile>>();
        //            response.Item = list;
        //            result = Ok200(response);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Logger.LogError(ex.ToString());
        //        result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
        //    }
        //    return result;
        //}

    }
}
