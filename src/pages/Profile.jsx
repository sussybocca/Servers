import ProfilePage from "../components/ProfilePage";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import CreatePost from "../components/CreatePost";
import PostList from "../components/PostList";
import ServerList from "../components/ServerList";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
  }, []);

  const addPost = (newPost) => setPosts(prev => [newPost, ...prev]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <ProfilePage user={user} />
      <CreatePost user={user} onPost={addPost} />
      <PostList />
      <ServerList />
    </div>
  );
}
