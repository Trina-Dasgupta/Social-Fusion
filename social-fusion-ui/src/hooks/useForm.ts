import { FormValues } from "@/types";
import { useState } from "react";



type ValidationFunction = (values: FormValues) => Record<string, string>;

const useForm = (initialState: FormValues, validate: ValidationFunction) => {
  const [values, setValues] = useState<FormValues>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setValues({ ...values, profilePic: file });

    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent, callback: (values: FormValues) => void) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      callback(values);
    }
  };

  return { values, errors, previewImage, handleChange, handleFileChange, handleSubmit };
};

export default useForm;
