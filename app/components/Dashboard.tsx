"use client";
import React, { useState } from "react";
import { FaBars, FaTimes, FaPlay, FaThLarge, FaHistory } from "react-icons/fa";
import { motion } from "framer-motion";
import Quiz from "./Quiz";
import AttemptHistory from "./AttemptHistory";

export default function Dashboard() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [startQuiz, setStartQuiz] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  );
  const [showDifficultyLevel, setShowDifficultyLevel] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl p-5 transform ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">QuizBuzz App</h2>
          <button
            className="text-gray-600"
            onClick={() => setShowSidebar(false)}
          >
            <FaTimes size={24} />
          </button>
        </div>
        <div className="mt-6 space-y-2">
          <button
            className={`w-full flex items-center py-3 px-4 rounded-lg ${
              activeTab === "dashboard"
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
            onClick={() => {
              setActiveTab("dashboard");
              setStartQuiz(false);
              setSelectedDifficulty(null);
              setShowDifficultyLevel(false);
            }}
          >
            <FaThLarge className="mr-2" /> Dashboard
          </button>
          <button
            className={`w-full flex items-center py-3 px-4 rounded-lg ${
              activeTab === "attempt-history"
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("attempt-history")}
          >
            <FaHistory className="mr-2" /> Attempt History
          </button>
        </div>
      </div>

      {!showSidebar && (
        <button
          className="absolute top-4 left-4 text-gray-600"
          onClick={() => setShowSidebar(true)}
        >
          <FaBars size={24} />
        </button>
      )}

      <div className="flex-1 flex items-center justify-center p-6">
        {activeTab === "attempt-history" ? (
          <AttemptHistory />
        ) : startQuiz && selectedDifficulty ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl p-6 bg-white shadow-2xl rounded-xl text-center"
          >
            <Quiz
              selectedDifficulty={selectedDifficulty}
              setSelectedDifficulty={setSelectedDifficulty}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome to the Quiz Dashboard
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Start a quiz or check your past attempts.
            </p>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
              onClick={() => {
                setShowDifficultyLevel(true);
              }}
            >
              <FaPlay className="mr-2 inline-block" /> Start Quiz
            </button>
            {showDifficultyLevel && (
              <div className="flex flex-col items-center mt-4">
                <p className="text-lg font-semibold mb-2">Select Difficulty:</p>
                <div className="flex space-x-3">
                  {["Easy", "Medium", "Hard"].map((level) => (
                    <button
                      key={level}
                      className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
                      onClick={() => {
                        setSelectedDifficulty(level.toLowerCase());
                        setShowDifficultyLevel(false);
                        setStartQuiz(true);
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
