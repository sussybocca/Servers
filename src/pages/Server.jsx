import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import Editor from "@monaco-editor/react";

export default function ServerPage({ user }) {
  const { id } = useParams(); // server id
  const [server, setServer] = useState(null);
  const [currentFile, setCurrentFile] = useState("");
  const [currentCode, setCurrentCode] = useState("");

  useEffect(() => {
    const fetchServer = async () => {
      const { data } = await supabase.from("servers").select("*").eq("id", id).single();
      setServer(data);
      const files = Object.keys(data.files || {});
      if (files.length) {
        setCurrentFile(files[0]);
        setCurrentCode(data.files[files[0]]);
      }
    };
    fetchServer();
  }, [id]);

  const addFile = () => {
    const fileName = prompt("File name (e.g., index.html)");
    if (!fileName) return;
    const newFiles = { ...server.files, [fileName]: "" };
    updateServerFiles(newFiles);
  };

  const deleteFile = (fileName) => {
    const newFiles = { ...server.files };
    delete newFiles[fileName];
    updateServerFiles(newFiles);
    if (currentFile === fileName) setCurrentFile("");
  };

  const updateServerFiles = async (newFiles) => {
    const { data } = await supabase.from("servers").update({ files: newFiles }).eq("id", server.id).select();
    setServer(data[0]);
  };

  const saveCode = async () => {
    const newFiles = { ...server.files, [currentFile]: currentCode };
    updateServerFiles(newFiles);
    alert("File saved!");
  };

  if (!server) return <div>Loading server...</div>;

  return (
    <div style={{ padding:20 }}>
      <h2>{server.name}</h2>
      <button onClick={addFile}>Add File</button>
      {Object.keys(server.files || {}).map(f => (
        <div key={f}>
          <button onClick={() => { setCurrentFile(f); setCurrentCode(server.files[f]); }}>{f}</button>
          <button onClick={() => deleteFile(f)}>Delete</button>
        </div>
      ))}

      {currentFile && (
        <div style={{ marginTop:20 }}>
          <h3>Editing: {currentFile}</h3>
          <Editor height="50vh" defaultLanguage="javascript" defaultValue={currentCode} onChange={setCurrentCode} />
          <button onClick={saveCode}>Save</button>
        </div>
      )}
    </div>
  );
}
