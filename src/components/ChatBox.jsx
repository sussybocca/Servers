import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ChatBox({ roomId, user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [usersMap, setUsersMap] = useState({});
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages update
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [messages]);

  // Load messages & users
  useEffect(() => {
    const fetchMessages = async () => {
      const { data: msgs } = await supabase
        .from("chats")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });
      setMessages(msgs || []);

      // Load all users in this chat
      const { data: allUsers } = await supabase.from("users").select("id, username");
      const map = {};
      allUsers.forEach(u => { map[u.id] = u.username; });
      setUsersMap(map);
    };
    fetchMessages();

    // Subscribe to real-time messages
    const subscription = supabase
      .channel(`room-${roomId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chats", filter: `room_id=eq.${roomId}` },
        payload => setMessages(prev => [...prev, payload.new])
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, [roomId]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    await supabase.from("chats").insert([{ room_id: roomId, sender_id: user.id, message: input }]);
    setInput("");
  };

  return (
    <div style={{ border: "1px solid #444", borderRadius: 8, width: "100%", maxWidth: 600, margin: "auto", padding: 10 }}>
      <div style={{ maxHeight: "300px", overflowY: "auto", padding: 5, background: "#111", color: "#fff", borderRadius: 6 }}>
        {messages.map((m, idx) => {
          const isMe = m.sender_id === user.id;
          return (
            <div
              key={idx}
              style={{
                textAlign: isMe ? "right" : "left",
                marginBottom: 6,
                padding: 4,
                borderRadius: 4,
                backgroundColor: isMe ? "#0ff" : "#333",
                color: isMe ? "#000" : "#fff",
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                {usersMap[m.sender_id] || "Unknown"} | {new Date(m.created_at).toLocaleTimeString()}
              </div>
              <div>{m.message}</div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: "flex", marginTop: 8 }}>
        <input
          style={{ flex: 1, padding: 8, borderRadius: 4, border: "1px solid #555", background: "#222", color: "#fff" }}
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if(e.key==="Enter") sendMessage(); }}
        />
        <button
          onClick={sendMessage}
          style={{ marginLeft: 8, padding: "8px 12px", borderRadius: 4, background: "cyan", color: "#000", fontWeight: "bold", cursor: "pointer" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
