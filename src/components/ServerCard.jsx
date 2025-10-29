export default function ServerCard({ server }) {
  return (
    <div style={{ border: "1px solid #444", padding: 10, borderRadius: 6, marginBottom: 5 }}>
      <a href={`/server/${server.id}`} style={{ color: "#0ff", fontWeight: "bold", textDecoration: "none" }}>
        {server.name}
      </a>
      <div style={{ fontSize: 12, color: "#aaa" }}>Owner: {server.owner_id}</div>
    </div>
  );
}
