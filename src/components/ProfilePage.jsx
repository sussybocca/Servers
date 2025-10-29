import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ProfilePage({ user }) {
  const [bio, setBio] = useState(user.bio || "");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [background, setBackground] = useState(user.background || "");
  const [servers, setServers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [newServerName, setNewServerName] = useState("");

  // Load user's servers
  useEffect(() => {
    const fetchData = async () => {
      const { data: s } = await supabase.from("servers").select("*").eq("owner_id", user.id);
      setServers(s || []);
      const { data: p } = await supabase.from("posts").select("*").eq("user_id", user.id);
      setPosts(p || []);
    };
    fetchData();
  }, [user.id]);

  const saveProfile = async () => {
    await supabase.from("users").update({ bio, avatar, background }).eq("id", user.id);
    alert("Profile updated!");
  };

  const createServer = async () => {
    if (!newServerName) return;
    const { data } = await supabase.from("servers").insert([
      { owner_id: user.id, name: newServerName, files: {} }
    ]).select();
    setServers(prev => [...prev, data[0]]);
    setNewServerName("");
  };

  return (
    <div style={{ textAlign:"center", padding:20 }}>
      <h2>{user.username}'s Profile</h2>
      <input placeholder="Bio" value={bio} onChange={e=>setBio(e.target.value)} />
      <input placeholder="Avatar URL" value={avatar} onChange={e=>setAvatar(e.target.value)} />
      <input placeholder="Background URL" value={background} onChange={e=>setBackground(e.target.value)} />
      <button onClick={saveProfile}>Save Profile</button>

      <hr />

      <h3>Create New Server</h3>
      <input placeholder="Server Name" value={newServerName} onChange={e=>setNewServerName(e.target.value)} />
      <button onClick={createServer}>Create Server</button>

      <h3>Your Servers</h3>
      {servers.map(s => (
        <div key={s.id}>
          <a href={`/server/${s.id}`}>{s.name}</a>
        </div>
      ))}

      <h3>Your Posts</h3>
      {posts.map(p => (
        <div key={p.id}>
          <strong>{p.title}</strong> - {p.content.substring(0,50)}...
        </div>
      ))}
    </div>
  );
}
