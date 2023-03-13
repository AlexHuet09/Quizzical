import React from "react";

export default function Question({
  question,
  questionId,
}) {

  return (
    <div id={questionId} className="question-container">
      <h3 className="question-title">{question}</h3>
    </div>
  );
}
