import React from "react";
import "../quizzical.css";
export default function Answer({
  shuffled_answers,
  toggleSelectedAnswer,
  endgame,
  questionId,
  answerId,
}) {
  const answerList = shuffled_answers.map((answer) => {
    let styles = {
      backgroundColor: answer.isSelected ? "cornflowerblue" : "white",
      border: answer.isSelected ? "none" : "1px solid black",
    };
    if (endgame) {
      styles = {
        backgroundColor: answer.isCorrect
          ? "#94D7A2"
          : answer.isSelected && !answer.isCorrect
          ? "#F8BCBC"
          : "transparent",
        opacity:
          answer.isCorrect && answer.isSelected
            ? "1"
            : answer.isCorrect && !answer.isSelected
            ? "0.8"
            : !answer.isCorrect && answer.isSelected
            ? "0.8"
            : "0.6",
        cursor: "default",
        border: answer.isCorrect
          ? "none"
          : answer.isSelected && !answer.isCorrect
          ? "none"
          : "1px solid var(--darkblue)",
        color: answer.isSelected && !answer.isCorrect ? "#A45252" : "white",
      };
    }
    return (
      <button
        className="answer-button"
        style={styles}
        key={answer.id}
        id={answer.id}
        onClick={() =>
          endgame ? null : toggleSelectedAnswer(answer.id, questionId)
        }
      >
        {answer.answerName}
      </button>
    );
  });
  return (
    <div id={answerId} className="answer-container">
      <div className="btn-wrapper">{answerList}</div>
    </div>
  );
}
