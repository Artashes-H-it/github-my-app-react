import { useNavigate, useLocation } from 'react-router-dom';
import React, { useMemo, useState } from 'react';
import { Button, Label, Input } from '../../components/ui';
import api from '../../api/axios';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}


const ResetPassword = () => {
    const query = useQuery();
    const token = query.get('token') || '';
    const emailFromLink = query.get('email') || '';
    
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
            email: emailFromLink,
            password: '',
            password_confirmation: '',
        });
    
        const [errors, setErrors] = useState({});

    const handleChage = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));

       validateField(name, value);
    }

       const validateField = (name, value) => {
        let error = "";
        
        switch(name) {
            case "email":
                if(!value) error = "Email is required";
                break;
            case "password":
                if(!value) error = "Password is required";
                break;
            case "password_confirmation":
                if(!value || formData.password != value) {
                   error = "Password is required and have to be same";  
                }else{
                     errors.confirmPassword = "";  
                }  
                break;   
        }
        setErrors((prev) => ({ ...prev, [name]: error }));
    }

     const hendleSubmit = async (e) => {
         e.preventDefault();
       
        try {
            const response = await api.post('/reset-password', {
            token,
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.password_confirmation,
            });

            if(response.status === 200){
               
                 navigate('/login');
                 response.success('Пароль успешно обновлён. Войдите с новым паролем.');
            }

            }catch(error) {
              error?.response?.data?.message || 'Не удалось обновить пароль. Проверьте данные и попробуйте снова.';
            }
    }

   return (
      <>
      <Button type='button' onClick={() => navigate('/') }>Back</Button>
      <h2>Send email forgot password!</h2>
      <form onSubmit={hendleSubmit}>
         <Label htmlFor="email" required>
                Email
         </Label>
         <Input id="email"  type="text" name={'email'} onChange={handleChage} placeholder={'email'} value={formData.email}/>  
         {errors.name && <span style={{ color: "red" }}>{errors.email}</span>}
          <Label htmlFor="password" required>
                Password
         </Label>
         <Input id="password"  type="password" name={'password'} onChange={handleChage} placeholder={'password'} value={formData.password}/>  
         {errors.password && <span style={{ color: "red" }}>{errors.password}</span>}
          <Label htmlFor="password_confirmation" required>
                Password_confirmation
         </Label>
         <Input id="password_confirmation"  type="password" name={'password_confirmation'} onChange={handleChage} placeholder={'password_confirmation'} value={formData.password_confirmation}/>  
         {errors.password_confirmation && <span style={{ color: "red" }}>{errors.password_confirmation}</span>}
         <Button type='submit'>Submit</Button>
      </form>
      </>
   );
}

export default ResetPassword;