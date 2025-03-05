import { FormValues } from "@/utils/types";
import { useState } from "react";



type ValidationFunction = (values: FormValues) => Record<string, string>;

const useForm = (initialState: FormValues, validate: (values: FormValues) => Record<string, string>) => {
  const [values, setValues] = useState<FormValues>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });

    // Keep previous errors, but validate only the changed field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validate({ ...values, [name]: value })[name], // Revalidate only this field
    }));
  };

  const handleSubmit = (e: React.FormEvent, callback: (values: FormValues) => void) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      callback(values);
    }
  };

  return { values, errors, handleChange, handleSubmit };
};

export default useForm;
