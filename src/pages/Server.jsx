import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import Editor from "@monaco-editor/react";

export default function ServerPage({ user }) {
  const { id } = useParams(); // server id
  const [server, setServer] = useState(null);
  const [currentFile, setCurrentFile] = useState("");
  const [currentCode, setCurrentCode] = useState("");

  // Load server and files
  useEffect(() => {
    const fetchServer = async () => {
      const { data, error } = await supabase
        .from("servers")
        .select("*")
        .eq("id", id)
        .single();
      if (error) return console.error(error);
      setServer(data);

      // Open first file if exists
      const files = Object.keys(data.files || {});
      if (files.length) {
        setCurrentFile(files[0]);
        setCurrentCode(data.files[files[0]]);
      }
    };
    fetchServer();
  }, [id]);

  // Add new file
  const addFile = async () => {
    const fileName = prompt("File name (e.g., index.html or app.jsx):");
    if (!fileName) return;
    const newFiles = { ...server.files, [fileName]: "" };
    await updateServerFiles(newFiles);
    setCurrentFile(fileName);
    setCurrentCode("");
  };

  // Delete file
  const deleteFile = async (fileName) => {
    if (!confirm(`Delete ${fileName}?`)) return;
    const newFiles = { ...server.files };
    delete newFiles[fileName];
    await updateServerFiles(newFiles);
    if (currentFile === fileName) {
      setCurrentFile("");
      setCurrentCode("");
    }
  };

  // Rename file
  const renameFile = async (fileName) => {
    const newName = prompt("New file name:", fileName);
    if (!newName || newName === fileName) return;
    const newFiles = { ...server.files };
    newFiles[newName] = newFiles[fileName];
    delete newFiles[fileName];
    await updateServerFiles(newFiles);
    if (currentFile === fileName) setCurrentFile(newName);
  };

  // Save current code
  const saveCode = async () => {
    const newFiles = { ...server.files, [currentFile]: currentCode };
    await updateServerFiles(newFiles);
    alert("File saved!");
  };

  // Update server files in Supabase
  const updateServerFiles = async (newFiles) => {
    const { data, error } = await supabase
      .from("servers")
      .update({ files: newFiles })
      .eq("id", server.id)
      .select();
    if (error) return console.error(error);
    setServer(data[0]);
  };

  if (!server) return <div>Loading server...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{server.name}</h2>
      <button onClick={addFile} style={{ marginBottom: 10 }}>Add File</button>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 20 }}>
        {Object.keys(server.files || {}).map((f) => (
          <div key={f} style={{ display: "flex", gap: 5 }}>
            <button
              onClick={() => {
                setCurrentFile(f);
                setCurrentCode(server.files[f]);
              }}
            >
              {f}
            </button>
            <button onClick={() => renameFile(f)}>Rename</button>
            <button onClick={() => deleteFile(f)}>Delete</button>
          </div>
        ))}
      </div>

      {currentFile && (
        <div>
          <h3>Editing: {currentFile}</h3>
          <Editor
            height="50vh"
            defaultLanguage={currentFile.endsWith(".js") || currentFile.endsWith(".jsx") ? "javascript" : "html"}
            defaultValue={currentCode}
            onChange={setCurrentCode}
          />
          <button onClick={saveCode} style={{ marginTop: 10 }}>Save</button>
        </div>
      )}
    </div>
  );
}
