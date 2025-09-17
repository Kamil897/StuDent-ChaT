import React, { useState } from "react";
import axios from "axios";
import s from "./AISimulation.module.scss";

const API_MAIN = "http://localhost:7777";

export default function AISimulation() {
  const [mode, setMode] = useState("writing"); // writing | reading
  const [essay, setEssay] = useState("");
  const [readingAnswers, setReadingAnswers] = useState(Array(40).fill(""));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function checkWriting() {
    try {
      setLoading(true);
      const res = await axios.post(`${API_MAIN}/ielts/writing/score`, {
        essay,
        userId: 1,
      });
      setResult(res.data);
    } catch (err) {
      console.error("IELTS Writing error:", err);
      setResult({ error: true });
    } finally {
      setLoading(false);
    }
  }

  async function checkReading() {
    try {
      setLoading(true);
      const res = await axios.post(`${API_MAIN}/ielts/reading/score`, {
        testId: "cambridge-16-test-1",
        answers: readingAnswers,
        userId: 1,
      });
      setResult(res.data);
    } catch (err) {
      console.error("IELTS Reading error:", err);
      setResult({ error: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={s.container}>
      <h1 className={s.title}>IELTS Simulation</h1>

      {/* Переключатель Writing / Reading */}
      <div className={s.switcher}>
        <button
          onClick={() => setMode("writing")}
          className={`${s.button} ${
            mode === "writing" ? s.buttonActive : s.buttonInactive
          }`}
        >
          Writing
        </button>
        <button
          onClick={() => setMode("reading")}
          className={`${s.button} ${
            mode === "reading" ? s.buttonActive : s.buttonInactive
          }`}
        >
          Reading
        </button>
      </div>

      {/* Writing */}
      {mode === "writing" && (
        <div className={s.card}>
          <textarea
            className={s.textarea}
            rows={10}
            placeholder="Write your essay here..."
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
          />
          <button onClick={checkWriting} className={`${s.button} ${s.buttonActive}`}>
            {loading ? "Checking..." : "Check Essay"}
          </button>
        </div>
      )}

      {/* Reading */}
      {mode === "reading" && (
        <div className={s.card}>
          <h2 className={s.title}>Reading Test</h2>
          <div className={s.inputGrid}>
            {readingAnswers.map((ans, i) => (
              <input
                key={i}
                className={s.input}
                placeholder={String(i + 1)}
                value={ans}
                onChange={(e) => {
                  const copy = [...readingAnswers];
                  copy[i] = e.target.value;
                  setReadingAnswers(copy);
                }}
              />
            ))}
          </div>
          <button onClick={checkReading} className={`${s.button} ${s.buttonActive}`}>
            {loading ? "Checking..." : "Check Answers"}
          </button>
        </div>
      )}

      {/* Результаты */}
      {result && (
        <div className={s.resultCard}>
          {mode === "writing" && !result.error && (
            <>
              <h2 className={s.title}>Writing Result</h2>
              <table className={s.table}>
                <tbody>
                  <tr className={s.tableRow}>
                    <td className={s.tableCell}>Task Response</td>
                    <td
                      className={
                        result.task_response < 5
                          ? s.scoreLow
                          : result.task_response < 7
                          ? s.scoreMid
                          : s.scoreHigh
                      }
                    >
                      {result.task_response}
                    </td>
                  </tr>
                  <tr className={s.tableRow}>
                    <td className={s.tableCell}>Coherence & Cohesion</td>
                    <td className={s.tableCell}>{result.coherence_cohesion}</td>
                  </tr>
                  <tr className={s.tableRow}>
                    <td className={s.tableCell}>Lexical Resource</td>
                    <td className={s.tableCell}>{result.lexical_resource}</td>
                  </tr>
                  <tr className={s.tableRow}>
                    <td className={s.tableCell}>Grammar</td>
                    <td className={s.tableCell}>{result.grammar}</td>
                  </tr>
                  <tr className={s.tableRow}>
                    <td className={s.tableCell}>Overall</td>
                    <td className={`${s.tableCell} ${s.scoreHigh}`}>{result.overall}</td>
                  </tr>
                </tbody>
              </table>
              <div className={s.feedback}>{result.feedback}</div>
            </>
          )}

          {mode === "reading" && !result.error && (
            <>
              <h2 className={s.title}>Reading Result</h2>
              <p>
                Correct: <span className={s.scoreHigh}>{result.correct}</span> /{" "}
                {result.total}
              </p>
              <p>
                Band: <span className={s.scoreHigh}>{result.band}</span>
              </p>
            </>
          )}

          {result.error && <p className={s.scoreLow}>Error: Failed to get result</p>}
        </div>
      )}
    </div>
  );
}
