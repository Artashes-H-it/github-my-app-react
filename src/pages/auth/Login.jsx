
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button, Label} from "../../components/ui";
import { useState, useEffect } from 'react';
import api from "../../api/axios";

const Login = () => {
   const [formData, setFormData] = useState({ email: '', password: '' });
   const [errors, setErrors] = useState({});
   const navigate = useNavigate();

    const hendleSubmit = async (e) => {
         e.preventDefault();

          try {        
            const response = await api.post("/login", formData);
            const { user, token } = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("userId", user.id);
            
            if(user.email_verified_at != null){
                localStorage.setItem("verified", true);
            }
            navigate('/');

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

       const validateField = (name, value) => {
        let error = "";
        
        switch(name) {
            case "email":
                if(!value) error = "Email is required";
                break;
            case "password":
                if(!value) error = "Password is required";
                break;
        }
        setErrors((prev) => ({ ...prev, [name]: error }));
    }

    const loginGoogle = async() => {
       
       window.location.href = import.meta.env.VITE_GOOGLE_REDIRECT_URL;
       console.log(import.meta.env.VITE_GOOGLE_REDIRECT_URL);
    }

    const loginFacebook = () => {
        window.location.href = import.meta.env.VITE_FACEBOOK_REDIRECT_URL;
    }

    return (
        <>
        <Button type='button' onClick={() => navigate('/') }>Back</Button>
         <h1>Login Page</h1>
         <form className="login-form" onSubmit={hendleSubmit}>
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
            <Button type='submit'>Login</Button>
         </form>
         <h4><Link to={'/forgot-password'}>Forgit password !</Link></h4>
         <div className='social-block'>
            <Button type='button' onClick={loginGoogle}>Google</Button>
            <Button type='button' onClick={loginFacebook}>Facebook</Button>
         </div>
        </>
    )
};

export default Login;