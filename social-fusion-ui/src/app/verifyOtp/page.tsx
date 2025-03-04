"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

const VerifyOTP = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(6).fill("")); 
  const [isValid, setIsValid] = useState<boolean | null>(null); 
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

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

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (enteredOtp === "123456") {
      setIsValid(true);
      setIsVerified(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      setIsValid(false);
    }
  };

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
                className={`w-12 h-12 text-center text-2xl border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 ${
                  isValid === false ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isVerified}
              />
            ))}
          </div>

          {isValid === false && (
            <p className="text-center text-red-500 text-sm">Invalid OTP. Please try again.</p>
          )}

          {isVerified && (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-center text-green-500 text-sm">OTP Verified Successfully!</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold p-2 rounded-md transition duration-200 disabled:bg-gray-400"
            disabled={isVerified}
          >
            Verify OTP
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
      </div>
    </div>
  );
};

export default VerifyOTP;


