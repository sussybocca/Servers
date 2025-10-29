import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/profile");
  }, [user]);

  return (
    <div>
      {!user && <RegisterForm onRegister={setUser} />}
    </div>
  );
}
