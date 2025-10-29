import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import PostCard from "./PostCard";

export default function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
      setPosts(data || []);
    };
    fetchPosts();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h3>All Posts</h3>
      {posts.map(p => <PostCard key={p.id} post={p} />)}
    </div>
  );
}
