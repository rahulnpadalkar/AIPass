import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfettiExplosion from "react-confetti-explosion";

const smallProps = {
  force: 0.4,
  duration: 2200,
  particleCount: 30,
  width: 400,
};

export default function Home() {
  const [result, setResult] = useState("");
  const [userInput, setUserInput] = useState();
  const [isExploding, setIsExploding] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setUserInput("");
      setIsExploding(true);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <Head>
        <title>SafePassword - Generate safe passwords using AI</title>
        <link rel="icon" href="/brain.png" />
      </Head>

      <main className={styles.main}>
        <img src="/brain.png" className={styles.icon} />
        <h3>Generate memorable and safe passwords using AI</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="password"
            placeholder="Enter a text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <input type="submit" value="✨ Generate password" />
        </form>
        {isExploding && (
          <ConfettiExplosion
            {...smallProps}
            onComplete={() => {
              setIsExploding(false);
            }}
          />
        )}
        <div className={styles.result}>
          <div className={styles.password}>
            <div style={{ width: "70%" }}>{result}</div>
            <div
              style={{
                marginLeft: "1.5rem",
                background: "#10a37f",
                padding: "0.3rem",
                cursor: "pointer",
                borderRadius: "0.3rem",
                color: "White",
                width: "30%",
              }}
              onClick={() => {
                navigator.clipboard.writeText(result);
                toast.success("Copied! 👍", {
                  style: { background: "#10a37f" },
                });
              }}
            >
              Copy
            </div>
          </div>
        </div>
      </main>
      <ToastContainer position="bottom-center" theme="colored" />
    </div>
  );
}
