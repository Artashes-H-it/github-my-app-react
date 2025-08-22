
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Input, Button, Label} from "../../components/ui";
import api from "../../api/axios"

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

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
            case "name":
                if(!value) error = "Name is required";
                break;
            case "surname":
                if(!value) error = "Surname is required";
                break;
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
          const response = await api.post("/register", formData);

          const { token, user } = response.data.data;
          localStorage.setItem("token", token);
          localStorage.setItem("verified", false);
          navigate('/');

        }catch(error) {
          alert("Error submitting form", error);
        }

    }
 
    return (
        <>
        <Button onClick={() => navigate(-1) }>Back</Button>
        <h1>Register Page</h1>
         <form className="login-form" onSubmit={hendleSubmit}>
             <Label htmlFor="name" required>
                Name
            </Label>
            <Input id="name"  type="text" name={'name'} onChange={handleChage} placeholder={'name'} value={formData.name}/>  
               {errors.name && <span style={{ color: "red" }}>{errors.name}</span>}
            <Label htmlFor="surname" required>
                Surname
            </Label>
            <Input id="surname"  type="text" name={'surname'} onChange={handleChage} placeholder={'surname'} value={formData.surname}/>  
               {errors.surname && <span style={{ color: "red" }}>{errors.surname}</span>}
            <Label htmlFor="email" required>
                Email
            </Label>
            <Input id="email"  type="text" name={'email'} onChange={handleChage} placeholder={'email'} value={formData.email}/>  
               {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}
            <Label htmlFor="password" required>
                Password
            </Label> 
            <Input id="password" type="password" name={'password'} onChange={handleChage} placeholder={'password'} value={formData.password}/> 
             {errors.password && <span style={{ color: "red" }}>{errors.password}</span>}
              <Label htmlFor="password_confirmation" required>
                Confirm cassword
            </Label>
            <Input id="password_confirmation" type="password" name={'password_confirmation'} onChange={handleChage} placeholder={'confirm password'} value={formData.password_confirmation}/>
             {errors.password_confirmation && <span style={{ color: "red" }}>{errors.password_confirmation}</span>}
            <Button type='submit'>Register</Button>
        </form>
        </>
    )
};

export default Register;