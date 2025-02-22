"use client";
import React, { useState, useEffect } from "react";
import { questionsList } from "../utils/questions";
import Timer from "./Timer";
import Scoreboard from "./Scoreboard";
import { openDB } from "idb";

type Question = {
  id: number;
  question: string;
  options?: string[];
  correctAnswer: string;
  difficulty: string;
};

interface QuizProps {
  selectedDifficulty: string | null;
  setSelectedDifficulty: (selectedDifficulty: string | null) => void;
}

const Quiz = ({ selectedDifficulty, setSelectedDifficulty }: QuizProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // userInput validate function
  const validateInput = (input: string) => {
    if (input.trim().length > 0) return true;
    return false;
  };
  // managing user input states
  const [userInput, setUserInput] = useState<string>("");
  const [inputIsTouched, setInputIsTouched] = useState(false);
  const inputIsValid = validateInput(userInput);
  const inputHasError = !inputIsValid && inputIsTouched;

  // states for managing scoreboard items
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const [feedback, setFeedback] = useState<string>("");
  const [resetTrigger, setResetTrigger] = useState(0);

  // states for managing streaks
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");

  useEffect(() => {
    if (showScore) {
      saveAttempt();
    }
  }, [showScore]);

  useEffect(() => {
    const fetchQuestions = () => {
      // Filter questions by selected difficulty
      const filteredQuestions = questionsList.filter(
        (q: Question) => q.difficulty === selectedDifficulty
      );
      // Shuffle questions using Fisher-Yates algorithm
      const shuffledQuestions = [...filteredQuestions].sort(
        () => Math.random() - 0.5
      );
      // Select first 10 questions (or as needed)
      setQuestions(shuffledQuestions.slice(0, 10));
    };

    fetchQuestions();
  }, [selectedDifficulty]);

  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer);
    setAttempted(attempted + 1);
    checkAnswer(answer);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const submitInputAnswer = () => {
    if (inputIsValid) {
      setAttempted(attempted + 1);
      checkAnswer(userInput);
    }
  };

  const checkAnswer = (answer: string) => {
    const correctAnswer = questions[currentQuestion].correctAnswer;
    if (
      answer.toString().toLowerCase() === correctAnswer.toString().toLowerCase()
    ) {
      setScore(score + 1);
      setCorrect(correct + 1);
      setFeedback("Correct! ✅");
      setShowCorrectAnswer(false);
      setStreak(streak + 1);
      if (streak + 1 > highestStreak) setHighestStreak(streak + 1);
    } else {
      setIncorrect(incorrect + 1);
      setFeedback("Incorrect ❌");
      setShowCorrectAnswer(true);
      setCorrectAnswer(correctAnswer);
      setStreak(0);
    }

    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const getBadge = (streak: number) => {
    if (streak >= 10) return "Quiz Master";
    if (streak >= 5) return "Streak Pro";
    if (streak >= 3) return "Rising Star";
    return "";
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setUserInput("");
      setInputIsTouched(false);
      setFeedback("");
      setShowCorrectAnswer(false);
      setResetTrigger((prev) => prev + 1);
    } else {
      setShowScore(true);
    }
  };

  const quitQuiz = () => {
    setShowScore(true);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setUserInput("");
    setInputIsTouched(false);
    setScore(0);
    setAttempted(0);
    setCorrect(0);
    setIncorrect(0);
    setShowScore(false);
    setFeedback("");
    setResetTrigger((prev) => prev + 1);
    setSelectedDifficulty(null);
    setShowCorrectAnswer(false);
    setCorrectAnswer("");
  };

  // saving attempt history in indexed DB
  const saveAttempt = async () => {
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
    const tx = db.transaction("attempts", "readwrite");
    const store = tx.objectStore("attempts");
    await store.add({
      score,
      total: questions.length,
      attempted,
      unattempted: questions.length - attempted,
      correct,
      incorrect,
      timestamp: Date.now(),
    });
  };

  return (
    <>
      {showScore ? (
        <div className="text-center">
          <Scoreboard
            score={score}
            total={questions.length}
            attempted={attempted}
            unattempted={questions.length - attempted}
            correct={correct}
            incorrect={incorrect}
          />
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={restartQuiz}
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="text-center max-w-xl mx-auto p-6 bg-white border border-gray-200 shadow-lg rounded-lg overflow-auto">
          <div className="text-center mb-4">
            <p className="text-lg font-semibold">
              Current Streak: <span className="text-green-600">{streak}</span>
            </p>
            <p className="text-md text-gray-600">
              Best Streak:{" "}
              <span className="text-blue-500">{highestStreak}</span>
            </p>
          </div>
          {getBadge(streak) && (
            <div className="mt-4 bg-yellow-300 text-black px-4 py-2 rounded-lg shadow-md">
              🎉{getBadge(streak)}
            </div>
          )}
          <Timer
            onTimeUp={() => setCurrentQuestion((prev) => prev + 1)}
            duration={30}
            resetTrigger={resetTrigger}
          />
          <h2 className="text-lg font-semibold my-4 break-words">
            {questions.length > 0
              ? questions[currentQuestion].question
              : "Loading..."}
          </h2>
          {questions.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {questions[currentQuestion].options ? (
                questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    className={`py-2 px-4 text-white font-semibold rounded-lg transition duration-300 ${
                      selectedAnswer === option
                        ? "bg-green-500"
                        : "bg-blue-400 hover:bg-blue-500"
                    }`}
                    onClick={() => handleAnswerClick(option)}
                  >
                    {option}
                  </button>
                ))
              ) : (
                <div className="col-span-2">
                  <input
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    onBlur={() => setInputIsTouched(true)}
                    className={`border p-2 w-full rounded-md ${
                      inputHasError
                        ? "border-red-500 bg-red-100"
                        : "border-gray-300"
                    }`}
                    placeholder="Type your answer..."
                  />
                  {inputHasError && (
                    <p className="text-red-500 text-sm mt-1">
                      ⚠ Please enter your input
                    </p>
                  )}
                  <button
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    onClick={submitInputAnswer}
                  >
                    Submit Answer
                  </button>
                </div>
              )}
            </div>
          )}
          <p className="text-lg font-semibold mt-2">{feedback}</p>
          {showCorrectAnswer && (
            <p className="text-md text-red-500 font-semibold">
              Correct Answer: {correctAnswer}
            </p>
          )}
          <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            onClick={quitQuiz}
          >
            Quit
          </button>
        </div>
      )}
    </>
  );
};

export default Quiz;
