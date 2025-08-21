import { Button, Label, Input } from "../../components/ui";
import api from "../../api/axios";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const ForgotPassword = () => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ email: '',});
  const navigate = useNavigate();


  const validateField = (name, value) => {
        let error = "";
        
        switch(name) {
            case "email":
                if(!value) error = "Email is required";
                break;
        }
        setErrors((prev) => ({ ...prev, [name]: error }));
    }

    const hendleSubmit = async (e) => {
        e.preventDefault();

        try {
        
          const response = await api.post('/forgot-password', formData);

        }catch(error) {
          alert("Error submitting form", error);
        }
    }

    const handleChage = (e) => {
        const { name, value, type } = e.target;

        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));

       validateField(name, value);
    }

   return (
      <>
      <Button type='button' onClick={() => navigate(-1) }>Back</Button>
      <h2>Send email forgot password!</h2>
      <form onSubmit={hendleSubmit}>
         <Label htmlFor="email" required>
                Email
         </Label>
         <Input id="email"  type="text" name={'email'} onChange={handleChage} placeholder={'email'} value={formData.email}/>  
         {errors.name && <span style={{ color: "red" }}>{errors.email}</span>}
         <Button type='submit'>Submit</Button>
      </form>
      </>
   );
}

export default ForgotPassword;