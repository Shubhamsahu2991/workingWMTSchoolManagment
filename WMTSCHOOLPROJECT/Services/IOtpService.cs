namespace WMTSCHOOLPROJECT.Services
{
    public interface IOtpService
    {
        string GenerateOtp(string mobileNumber);  // Generate OTP for a specific mobile number
        bool SendOtpToMobile(string mobileNumber, string otp);  // Simulate sending OTP to mobile number
        bool VerifyOtp(string mobileNumber, string otp);  // Verify OTP for a specific mobile number
        bool IsOtpValid(string mobileNumber);  // Check if the OTP is still valid (not expired)
    }
}
