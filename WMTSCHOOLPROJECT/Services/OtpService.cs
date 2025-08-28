using System;
using System.Collections.Generic;

namespace WMTSCHOOLPROJECT.Services
{
    public class OtpService: IOtpService
    {
        private static Dictionary<string, (string otp, DateTime expirationTime)> _otpStore = new Dictionary<string, (string otp, DateTime expirationTime)>();

        // Generate OTP for a specific mobile number
        public string GenerateOtp(string mobileNumber)
        {
            // Generate a new OTP
            var otp = new Random().Next(100000, 999999).ToString();  // 6-digit OTP
            var expirationTime = DateTime.Now.AddSeconds(25);  // Set expiration time to 10 seconds

            // Store OTP and expiration time in the dictionary for the specific mobile number
            _otpStore[mobileNumber] = (otp, expirationTime);

            Console.WriteLine($"Generated OTP for {mobileNumber}: {otp}, Expiry Time: {expirationTime}");

            return otp;  // Return the generated OTP
        }

        // Simulate sending OTP to a mobile number (replace with actual SMS service)
        public bool SendOtpToMobile(string mobileNumber, string otp)
        {
            Console.WriteLine($"OTP sent to {mobileNumber}: {otp}");
            return true;  // Simulate OTP sent successfully
        }

        // Verify OTP for a specific mobile number
        public bool VerifyOtp(string mobileNumber, string otp)
        {
            // Check if OTP exists for the provided mobile number
            if (_otpStore.ContainsKey(mobileNumber))
            {
                var otpData = _otpStore[mobileNumber];

                // Check if OTP is expired
                if (DateTime.Now > otpData.expirationTime)
                {
                    Console.WriteLine("OTP has expired.");
                    _otpStore.Remove(mobileNumber);  // Remove expired OTP
                    return false;  // OTP expired
                }

                // Check if OTP matches
                return otpData.otp == otp;
            }

            return false;  // No OTP found for the mobile number
        }

        // Check if OTP is valid (not expired) for a specific mobile number
        public bool IsOtpValid(string mobileNumber)
        {
            if (_otpStore.ContainsKey(mobileNumber))
            {
                var otpData = _otpStore[mobileNumber];
                return DateTime.Now <= otpData.expirationTime;  // Check if OTP is still valid
            }

            return false;  // No OTP exists for the mobile number
        }
    }

}
