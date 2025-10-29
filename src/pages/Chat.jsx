import { useParams } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Chat() {
  const { roomId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
  }, []);

  if (!user) return <div>Loading...</div>;
  return <ChatBox roomId={roomId} user={user} />;
}
