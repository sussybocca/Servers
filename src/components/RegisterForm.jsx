import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function RegisterForm({ onRegister }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [twoStepEnabled, setTwoStepEnabled] = useState(false);

  const generateCode = () => crypto.randomUUID().slice(0, 6).toUpperCase();

  const handleRegister = async () => {
    if (!email || !username || !password) {
      setMessage("⚠️ Fill all fields");
      return;
    }
    setLoading(true);
    const codeValue = generateCode();
    setGeneratedCode(codeValue);

    if (twoStepEnabled) {
      const res = await fetch("/api/sendVerification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, code: codeValue }),
      });
      const data = await res.json();
      if (!data.success) {
        setMessage("❌ Failed to send email");
        setLoading(false);
        return;
      }
    }

    setStep(2);
    setMessage("✅ Verification code sent!");
    setLoading(false);
  };

  const handleVerify = async () => {
    if (code.toUpperCase() !== generatedCode) {
      setMessage("❌ Wrong code");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.from("users").insert([
      { email, username, password, two_step_enabled: twoStepEnabled },
    ]).select();

    if (error) {
      setMessage("❌ Registration failed");
      setLoading(false);
      return;
    }
    setMessage("✅ Registered!");
    onRegister(data[0]);
    setLoading(false);
  };

  return (
    <div style={{ textAlign:"center", marginTop:50 }}>
      {step===1 && (
        <>
          <h2>Register</h2>
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <label>
            <input type="checkbox" checked={twoStepEnabled} onChange={()=>setTwoStepEnabled(!twoStepEnabled)} />
            2-Step Verification
          </label>
          <button onClick={handleRegister}>Register</button>
        </>
      )}
      {step===2 && (
        <>
          <h2>Enter Code</h2>
          <input placeholder="Code" value={code} onChange={e=>setCode(e.target.value)} />
          <button onClick={handleVerify}>Verify & Register</button>
        </>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}
