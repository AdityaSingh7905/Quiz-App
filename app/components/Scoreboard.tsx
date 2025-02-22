interface ScoreboardProps {
  score: number;
  total: number;
  attempted: number;
  unattempted: number;
  correct: number;
  incorrect: number;
}

const Scoreboard = ({
  score,
  total,
  attempted,
  unattempted,
  correct,
  incorrect,
}: ScoreboardProps) => {
  return (
    // separate component for scoreboard items
    <div className="scoreboard bg-gray-100 p-6 rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
      <p className="text-lg">
        Total Questions: <span className="font-bold">{total}</span>
      </p>
      <p className="text-lg">
        Attempted: <span className="font-bold text-blue-500">{attempted}</span>
      </p>
      <p className="text-lg">
        Unattempted:{" "}
        <span className="font-bold text-yellow-500">{unattempted}</span>
      </p>
      <p className="text-lg">
        Correct Answers:{" "}
        <span className="font-bold text-green-600">{correct}</span>
      </p>
      <p className="text-lg">
        Incorrect Answers:{" "}
        <span className="font-bold text-red-600">{incorrect}</span>
      </p>
      <p className="text-lg mt-4 font-bold text-gray-800">
        Final Score: <span className="text-green-600 text-xl">{score}</span> /{" "}
        {total}
      </p>
    </div>
  );
};

export default Scoreboard;
