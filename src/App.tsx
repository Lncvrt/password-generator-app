import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import '@fontsource/lexend';
import "./App.css";

function App() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(8);
  const [copied, setCopied] = useState(false);

  const presets = [6, 8, 12, 16, 24, 32, 50, 100, 200, 250];

  useEffect(() => {
    generatePassword();
  }, [length]);

  async function generatePassword() {
    setPassword(await invoke("generate_password", { length }));
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <main className="container">
      <h1>Password Generator</h1>
      <p>Select a length, or use the slider for a custom value.</p>

      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          generatePassword();
        }}
      >
        <div className="slider-section">
          <label htmlFor="password-length">Password Length: {length}</label>
          <input
            id="password-length"
            type="range"
            min="6"
            max="250"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            step="1"
          />
        </div>

        <div className="preset-buttons">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              className="preset-btn"
              onClick={() => setLength(preset)}
            >
              {preset}
            </button>
          ))}
        </div>
      </form>

      {password && (
        <div className="result-section">
          <p className="password-display">{password}</p>
          <div className="result-buttons">
            <button
              className="copy-btn"
              onClick={copyToClipboard}
              disabled={copied}
            >
              {copied ? "Copied" : "Copy"}
            </button>
            <button className="copy-btn" onClick={generatePassword}>Regenerate</button>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
