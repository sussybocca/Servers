import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ServerList() {
  const [servers, setServers] = useState([]);

  useEffect(() => {
    const fetchServers = async () => {
      const { data } = await supabase.from("servers").select("*").order("created_at", { ascending: false });
      setServers(data);
    };
    fetchServers();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h3>Explore Servers</h3>
      {servers.map(s => (
        <div key={s.id} style={{ border: "1px solid #555", padding: 10, marginBottom: 6 }}>
          <a href={`/server/${s.id}`} style={{ fontWeight: "bold", textDecoration: "none", color: "#0ff" }}>
            {s.name}
          </a>
        </div>
      ))}
    </div>
  );
}
