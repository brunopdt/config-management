import { useCallback, useState } from "react";
import { AdminUserModel, AdminLoginResponse } from "../model/index.ts";
import { useApi } from "../../../apis/axiosInstance.ts";
import { useNavigate } from "react-router-dom";
import { AxiosResponse } from "axios";

export const UseLoginForm = () => {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<IFormValues>({
    username: '',
    password: '',
  });

  interface IFormValues {
    username: string;
    password: string;
  }

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  }, [formValues]);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const usuario = {
      username: formValues.username,
      password: formValues.password,
    } satisfies AdminUserModel;

    try {
      const response: AxiosResponse<AdminLoginResponse> = await useApi.post('admins/login', usuario);
      localStorage.setItem('token', response.data.access_token);
      navigate('/')
    }
    catch (error) {
      console.error(error)
    }

  }, [formValues.password, formValues.username, navigate]);

  return {
    formValues,
    handleChange,
    handleSubmit,
  }
}
