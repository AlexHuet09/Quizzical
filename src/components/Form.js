import React from "react";

export default function Form({
  categories,
  handleSubmit,
  formData,
  handleChange,
}) {
  const categoryList = categories.map((category) => (
    <option key={category.id} value={category.id} id={category.id}>
      {category.name}
    </option>
  ));

  return (
    <div className="formList">
      <form onSubmit={handleSubmit}>
        <label>Select Category:&nbsp; </label>
        <select
          value={formData.category}
          onChange={handleChange}
          name="category"
        >
          <option key="Any Category" id="Any Category" value="">
            Any Category
          </option>
          {categoryList}
        </select>

        <br />

        <label>Select Difficulty:&nbsp; </label>
        <select
          value={formData.difficulty}
          onChange={handleChange}
          name="difficulty"
        >
          <option value="">Any difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <br />
        <label> Select Type:&nbsp; </label>
        <select value={formData.type} onChange={handleChange} name="type">
          <option value="multiple">Multiple Choice</option>
          <option value="boolean">True / False</option>
        </select>
        <br />
        <label htmlFor="amount">Numbers of Questions:&nbsp; </label>
        <input
          className="amount-input"
          type="number"
          name="number"
          value={formData.number}
          onChange={handleChange}
          min="5"
          max="25"
        ></input>
        <br />
        <button className="quiz-button">Start Quizz</button>
      </form>
    </div>
  );
}
