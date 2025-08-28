using WMTSCHOOLPROJECT.Controllers;

namespace WMTSCHOOLPROJECT.Services
{
    public interface IUserService
    {
        Task<User> CreateUserAsync(CreateUserRequest createUserRequest);  // Method to create a user
    }
}
