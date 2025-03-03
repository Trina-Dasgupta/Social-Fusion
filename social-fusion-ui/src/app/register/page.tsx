
"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/Logo";
import useForm from "@/hooks/useForm";
import { useRouter } from "next/navigation";

const Register = () => {
  const router = useRouter();

  // Validation function
  const validate = (values: Record<string, string>) => {
    const errors: Record<string, string> = {};

    if (!values.fullName) errors.fullName = "Full Name is required";
    if (!values.username) errors.username = "Username is required";
    if (!values.email) errors.email = "Email is required";
    if (!values.phoneNumber) errors.phoneNumber = "Phone Number is required";
    if (!values.password) errors.password = "Password is required";
    if (values.password !== values.confirmPassword) errors.confirmPassword = "Passwords do not match";

    return errors;
  };

  // Use custom hook
  const { values, errors, previewImage, handleChange, handleFileChange, handleSubmit } = useForm(
    {
      fullName: "",
      username: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      profilePic: null,
    },
    validate
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        {/* Logo & Home Link */}
        <div className="flex justify-center mb-4">
          <Logo/>
        </div>

        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Create an Account</h2>
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm">Sign up to start using Social Fusion</p>

        {/* Form */}
        <form onSubmit={(e) => handleSubmit(e, () => router.push("/login"))} className="mt-5 space-y-4">
          {/* Profile Picture Upload */}
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

          {/* Input Fields */}
          {[
            { label: "Full Name", name: "fullName", type: "text" },
            { label: "Username", name: "username", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Phone Number", name: "phoneNumber", type: "tel" },
            { label: "Password", name: "password", type: "password" },
            { label: "Confirm Password", name: "confirmPassword", type: "password" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
              <input
                type={type}
                name={name}
                className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                value={values[name]}
                onChange={handleChange}
                required
              />
              {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
            </div>
          ))}

          {/* Register Button */}
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold p-2 rounded-md transition duration-200">
            Sign Up
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
