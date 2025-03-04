"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { useSelector } from "react-redux";
import API_ROUTES from '@/constants/apiRoutes'
import Logo from "@/components/Logo";


const VerifyOTP = () => {
  const router = useRouter();
  const { data, error, loading, fetchData } = useApi<{
    data: any; message: string
  }>();
  const user = useSelector((state: any) => state.auth);
  console.log(user, 'store')
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const email = user.email;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResendDisabled) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 30;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResendDisabled]);
  useEffect(() => {
    if (error) setLocalError(error);
  }, [error]);

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setIsValid(true);
      if (localError) setLocalError(null);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }
    }
  };




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setIsValid(false);
      return;
    }

    await fetchData(API_ROUTES.AUTH.VERIFY_OTP, "POST", { email, otp: Number(enteredOtp) });
  };

  useEffect(() => {
    if (data) {
      console.log("OTP Verification Successful", data);
      setIsValid(true);
      setIsVerified(true);
      // setTimeout(() => router.push("/login"), 6000);
    }
  }, [data]);


  const handleResendOtp = async () => {
    if (isResendDisabled) return;

    try {
      alert("Resend OTP logic here - Call API to resend OTP");
      setIsResendDisabled(true);
      setTimer(30);
    } catch (error) {
      console.error("Resend OTP failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">

        {isVerified ? (
          <div className="flex flex-col items-center space-y-6 mt-6">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg animate-bounce">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            {/* Success Message */}
            <p className="text-center text-white text-lg font-medium tracking-wide">
              OTP Verified Successfully!
            </p>

            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold p-2 rounded-md transition duration-200 disabled:bg-gray-400"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
              OTP Verification
            </h2>
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-2">
              Enter the 6-digit code sent to your email
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className={`w-12 h-12 text-center text-2xl border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 ${isValid === false ? "border-red-500" : "border-gray-300"
                      }`}
                    disabled={isVerified}
                  />
                ))}
              </div>
              {isValid === false && (
                <p className="text-center text-red-500 text-sm">Invalid OTP. Please try again.</p>
              )}
              {localError && <p className="text-center text-red-500 text-sm">{localError}</p>}
              {data && <p className="text-center text-green-500 text-sm">{data.message}</p>}

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold p-2 rounded-md transition duration-200 disabled:bg-gray-400"
                disabled={isVerified || loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              Didn&#39;t receive the code?{" "}
              <button
                onClick={handleResendOtp}
                className="text-blue-500 hover:underline"
                disabled={isResendDisabled}
              >
                {isResendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );

};

export default VerifyOTP;


