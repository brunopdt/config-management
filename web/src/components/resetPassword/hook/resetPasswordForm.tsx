import { useCallback, useState } from "react";
import { AdminResetPasswordModel } from "../model/index.ts";
import { useApi } from "../../../apis/axiosInstance.ts";
import { useNavigate } from "react-router-dom";

export const ResetPasswordForm = () => {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<IFormValues>({
    code: '',
    newPassword: '',
  });

  interface IFormValues {
    code: string;
    newPassword: string;
  }

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  }, [formValues]);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = localStorage.getItem('reset-email');

    const dadosResetSenha = {
      code: formValues.code,
      newPassword: formValues.newPassword,
      email: email as string,
    } satisfies AdminResetPasswordModel;

    try {
      await useApi.post('admins/password-reset', { ...dadosResetSenha, email });
      navigate('/login')
    }
    catch (error) {
      console.error(error)
    }

  }, [formValues.code, formValues.newPassword, navigate]);

  return {
    formValues,
    handleChange,
    handleSubmit,
  }
}
