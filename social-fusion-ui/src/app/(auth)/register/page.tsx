"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast"; 

import API_ROUTES from "@/constants/apiRoutes";
import Link from "next/link";
import Image from "next/image";
import { useApi } from "@/hooks/useApi";
import { useDispatch } from "react-redux";
import { registerStart, registerSuccess } from "@/store/authSlice";

const Register = () => {
  const router = useRouter();
  const dispatch=useDispatch();
  const { data, error, loading, fetchData } = useApi<{data: any; message: string }>();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone Number is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (value.trim()) {
        delete newErrors[name];
      } else {
        newErrors[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
      }

      if (name === "confirmPassword" && value !== formData.password) {
        newErrors.confirmPassword = "Passwords do not match";
      } else if (name === "confirmPassword") {
        delete newErrors.confirmPassword;
      }

      return newErrors;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfilePic(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(registerStart());
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => formDataToSend.append(key, value));
    if (profilePic) formDataToSend.append("profilePic", profilePic);

    await fetchData(API_ROUTES.AUTH.REGISTER, "POST", formDataToSend, true);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      console.log(data)

      dispatch(
        registerSuccess({
          fullName: data.data.fullName,
          username: data.data.username,
          email: data.data.email,
          phoneNumber: data.data.phoneNumber,
          profilePic: data.data.profilePic || "",
        })
      );

      toast.success("Registration successful! Redirecting...");
      setTimeout(() => {
        router.push("/verifyOtp");
      }, 1500);
    }
  }, [data]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Create an Account</h2>
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm">Sign up to start using Social Fusion</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
              {previewImage ? (
                <Image src={previewImage} alt="Profile Preview" width={96} height={96} className="object-cover w-full h-full" />
              ) : (
                <span className="text-gray-500 dark:text-gray-400">No Image</span>
              )}
            </div>
            <label className="mt-2 text-sm text-blue-500 hover:text-blue-600 cursor-pointer">
              Upload Profile Picture
              <input type="file" accept="image/*" name="profilePic" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {["fullName", "username", "email", "phoneNumber", "password", "confirmPassword"].map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field.includes("password") ? "password" : "text"}
                name={field}
                className={`w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 
                ${errors[field] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-500"}`}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
              />
              {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
            </div>
          ))}

          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold p-2 rounded-md transition duration-200" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};



export default Register;
