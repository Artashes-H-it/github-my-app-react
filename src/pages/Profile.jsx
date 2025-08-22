import { useEffect, useState } from "react";
import api from "../api/axios";

const Profile = () => {
  const [user, setUser] = useState(null);    
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);   

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await api.get("/user");
        setUser(response.data);
      } catch (err) {
        setError("Error on time get user");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>Not autorized</p>;

  return (
    <div>
      <h1>Hello, {user.name}!!!</h1>
      <h2>Email: {user.email}</h2>
    </div>
  );
};

export default Profile;