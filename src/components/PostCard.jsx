export default function PostCard({ post }) {
  const downloadPost = () => {
    const blob = new Blob([post.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${post.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ border: "1px solid #555", padding: 10, marginBottom: 6, borderRadius: 6 }}>
      <h4>{post.title}</h4>
      <p>{post.content}</p>
      <button onClick={downloadPost} style={{ marginRight: 5 }}>Download</button>
      <button onClick={() => navigator.clipboard.writeText(post.content)}>Copy</button>
    </div>
  );
}
