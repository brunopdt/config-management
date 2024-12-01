import { useCallback, useState } from "react";
import { AdminForgotPasswordModel } from "../model/index.ts";
import { useApi } from "../../../apis/axiosInstance.ts";
import { useNavigate } from "react-router-dom";

export const ForgotPasswordForm = () => {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<IFormValues>({
    email: ''
  });

  interface IFormValues {
    email: string;
  }

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  }, [formValues]);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const insertEmail = {
      email: formValues.email
    } satisfies AdminForgotPasswordModel;

    localStorage.setItem('reset-email', formValues.email);
    try {
      await useApi.post('admins/password-reset-email', insertEmail);
      navigate('/redefinirSenha')
    }
    catch (error) {
      console.error(error)
    }
  }, [formValues.email, navigate]);

  return {
    formValues,
    handleChange,
    handleSubmit,
  }
}
