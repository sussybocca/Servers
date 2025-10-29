import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function CreatePost({ user, onPost }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submitPost = async () => {
    if (!title || !content) return;
    const { data } = await supabase.from("posts").insert([{ user_id: user.id, title, content }]).select();
    onPost(data[0]);
    setTitle(""); setContent("");
  };

  return (
    <div>
      <h3>Create Post</h3>
      <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea placeholder="Content" value={content} onChange={e=>setContent(e.target.value)} />
      <button onClick={submitPost}>Post</button>
    </div>
  );
}
