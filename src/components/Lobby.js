import React, { useEffect, useState } from "react";
import Form from "./Form";
import Question from "./Question";
import Answer from "./Answer";
import { decode } from "html-entities";
import arrayShuffle from "array-shuffle";
import { nanoid } from "nanoid";

export default function Lobby() {
  //state to store the data from the input option to get the proper api
  const [formData, setFormData] = useState({
    number: "5",
    category: "",
    difficulty: "",
    type: "multiple",
  });

  // state to count the correct answers

  // state to know if the game is over
  const [endgame, setEndGame] = useState(false);

  //state to store categories api
  const [categories, setCategories] = useState([]);

  //state to store the question and answer from the api
  const [data, setData] = useState([]);

  // state to know when the form is submitted to stop rendering the form component
  const [isStarted, setIsStarted] = useState(false);

  //function to handle the change in the form to update the formData state
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  //fetching the category data api and store it in the category state
  useEffect(() => {
    fetch(`https://opentdb.com/api_category.php`)
      .then((res) => res.json())
      .then((data) => setCategories(data.trivia_categories));
  }, []);

  //fetching the data of the question and answer into the data state
  useEffect(() => {
    fetch(
      `https://opentdb.com/api.php?amount=${formData.number}&category=${formData.category}&difficulty=${formData.difficulty}&type=${formData.type}`
    )
      .then((res) => res.json())
      .then((quizData) =>
        setData(
          quizData.results.map((question) => {
            let shuffledAnswers = arrayShuffle([
              question.correct_answer,
              ...question.incorrect_answers,
            ]);
            return {
              questionId: nanoid(),
              question: decode(question.question),
              shuffled_answers: shuffledAnswers.map((answer) => ({
                id: nanoid(),
                answerName: decode(answer),
                isCorrect: answer === question.correct_answer,
                isSelected: false,
              })),
            };
          })
        )
      );
  }, [formData]);
  //function to make sure only one answer is selected
  function toggleSelectedAnswer(id, questionId) {
    setData((prevQuestions) => {
      return prevQuestions.map((question) =>
        question.questionId === questionId
          ? {
              ...question,
              shuffled_answers: question.shuffled_answers.map((answer) => ({
                ...answer,
                isSelected: answer.id === id,
              })),
            }
          : question
      );
    });
  }
  //boolean variable to know if all question as been answered
  const isAllSelected = data.every((question) =>
    question.shuffled_answers
      ? question.shuffled_answers.some((answer) => answer.isSelected)
      : false
  );

  //function to count the correct answers
  function countCorrectAnswers() {
    let correct = 0;
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[0].shuffled_answers.length; j++) {
        if (
          data[i].shuffled_answers[j].isSelected &&
          data[i].shuffled_answers[j].isCorrect
        ) {
          correct++;
        }
      }
    }
    return correct;
  }

  let correctAnswers = countCorrectAnswers();

  //function that run when you want to submit your answer and endgame
  function submitAnswers() {
    if (isAllSelected && !endgame) {
      countCorrectAnswers();
      setEndGame(true);
    }
  }

  function playAgain() {
    setIsStarted(false);
    setEndGame(false);
    setData([]);
    setFormData({
      category: "",
      difficulty: "",
      type: "multiple",
      number: 5,
    });
    correctAnswers = 0;
  }

  // submit form function
  function toggleIsStarted(e) {
    e.preventDefault();
    setIsStarted(true);
  }

  //listing the question component
  const list = data?.map((list) => {
    return (
      <div className="listWrapper">
        <div className="questionDiv">
          <Question questionId={list.questionId} question={list.question} />
        </div>
        <div className="answerDiv">
          <Answer
            question={list.question}
            shuffled_answers={list.shuffled_answers}
            answerId={list.answerId}
            questionId={list.questionId}
            toggleSelectedAnswer={toggleSelectedAnswer}
            endgame={endgame}
          />
        </div>
      </div>
    );
  });
  return (
    <div className="lobby">
      {!isStarted && (
        <div className="intro-page">
          <h1 className="intro-title">Quizzical</h1>
          <Form
            handleChange={handleChange}
            handleSubmit={toggleIsStarted}
            formData={formData}
            categories={categories}
          />
        </div>
      )}
      {isStarted && (
        <div className="quiz-container">
          {list}
          <div className="quiz-footer">
            {!endgame && <button onClick={submitAnswers}>Check Answers</button>}
            {endgame && (
              <div className="endgame-button-wrap">
                <p className="score">
                  You have {correctAnswers}/{data.length} correct answers
                </p>
                <button
                  onClick={playAgain}
                  className="quiz-button play-again-btn"
                >
                  Play again?
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
