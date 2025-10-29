import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ProfilePage({ user }) {
  const [bio, setBio] = useState(user.bio || "");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [background, setBackground] = useState(user.background || "");

  const saveProfile = async () => {
    await supabase.from("users").update({ bio, avatar, background }).eq("id", user.id);
    alert("Profile updated!");
  };

  return (
    <div style={{ textAlign:"center", padding:20 }}>
      <h2>{user.username}'s Profile</h2>
      <input placeholder="Bio" value={bio} onChange={e=>setBio(e.target.value)} />
      <input placeholder="Avatar URL" value={avatar} onChange={e=>setAvatar(e.target.value)} />
      <input placeholder="Background URL" value={background} onChange={e=>setBackground(e.target.value)} />
      <button onClick={saveProfile}>Save</button>
    </div>
  );
}
