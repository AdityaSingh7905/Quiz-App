"use client";
import React, { useEffect, useState } from "react";
import { openDB } from "idb";

interface Attempt {
  id?: number;
  score: number;
  total: number;
  attempted: number;
  unattempted: number;
  correct: number;
  incorrect: number;
  timestamp: number;
}

const AttemptHistory: React.FC = () => {
  const [history, setHistory] = useState<Attempt[]>([]);

  useEffect(() => {
    // fetching stored data from the indexed DB
    const fetchHistory = async () => {
      const db = await openDB("quizDB", 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("attempts")) {
            db.createObjectStore("attempts", {
              keyPath: "id",
              autoIncrement: true,
            });
          }
        },
      });
      const tx = db.transaction("attempts", "readonly");
      const store = tx.objectStore("attempts");
      const allAttempts = (await store.getAll()) as Attempt[];
      setHistory(allAttempts.reverse());
    };

    fetchHistory();
  }, []);

  return (
    <div className="attempt-history bg-white p-6 rounded-lg shadow-lg mt-4 max-w-4xl mx-auto w-full">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Attempt History
      </h2>
      {history.length === 0 ? (
        <p className="text-gray-600 text-center">No previous attempts found.</p>
      ) : (
        <div className="overflow-hidden w-full">
          <table className="w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-blue-500 text-white text-left text-sm md:text-base">
                <th className="py-2 px-2 md:px-4">#</th>
                <th className="py-2 px-2 md:px-4">Score</th>
                <th className="py-2 px-2 md:px-4">Attempted</th>
                <th className="py-2 px-2 md:px-4">Unattempted</th>
                <th className="py-2 px-2 md:px-4">Correct</th>
                <th className="py-2 px-2 md:px-4">Incorrect</th>
                <th className="py-2 px-2 md:px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((attempt, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 text-gray-700 text-xs md:text-sm text-center"
                >
                  <td className="py-2 px-2 md:px-4 font-bold">{index + 1}</td>
                  <td className="py-2 px-2 md:px-4 font-semibold text-green-600">
                    {attempt.score} / {attempt.total}
                  </td>
                  <td className="py-2 px-2 md:px-4">{attempt.attempted}</td>
                  <td className="py-2 px-2 md:px-4">{attempt.unattempted}</td>
                  <td className="py-2 px-2 md:px-4 text-green-500">
                    {attempt.correct}
                  </td>
                  <td className="py-2 px-2 md:px-4 text-red-500">
                    {attempt.incorrect}
                  </td>
                  <td className="py-2 px-2 md:px-4 text-gray-500 text-xs md:text-sm">
                    {new Date(attempt.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttemptHistory;
