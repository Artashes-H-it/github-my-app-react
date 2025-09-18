import api from "../api/axios";

const logout = async () => {

    let res =  await api.post('/logout');
    if(res.data.success == true){
      localStorage.removeItem('token');
      localStorage.removeItem('verified');
      localStorage.removeItem('userId');
      window.location.href = '/'; 
    }
}

export default logout;