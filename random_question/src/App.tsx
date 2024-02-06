import React, { createRef, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [name, setName] = useState(generateRandomName())
  const [questionsList, setQuestionsList] = useState<{
    question: string;
    hightlight: boolean;
    choices: {
      choice: string;
      answer: boolean;
      selected: boolean;
    }[];
  }[]>([])
  const [topPlayer, setTopPlayer] = useState(getTopPlayer)

  const selectRandomQuestions = () => {
    const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);
    const randomQuestions = shuffledQuestions.slice(0, 20);
    setQuestionsList(randomQuestions);
  };

  useEffect(() => {
    selectRandomQuestions();
  }, []);

  return (
    <div className="App">
      <div className='flex justify-start ml-4 mt-4'>
        <div className='w-96 flex flex-col p-2 border-2 border-black rounded-md'>
          <div className='border-2 border-black rounded-md p-2 mb-2'>LeaderBoard</div>
          <div>
            {
              topPlayer.map((value, key) => {
                return (
                  <div key={key} className='mb-2 flex'>
                    <div className='w-1/2'>{value.name}</div>
                    <div className='w-1/2'>{value.score}</div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
      <div className='flex flex-col items-start ml-4 mt-4'>
        <div id='name' className='inline-flex flex-col p-2 border-2 border-black rounded-md'>
          <div className='mb-2'>current name : {name}</div>
          <input id='name-input' placeholder='new name' className='border-2 border-black rounded-md pl-2 mb-2' type="text" />
          <button onClick={(e) => {
            const parent = e.currentTarget.parentElement
            const nameInput = parent?.querySelector("#name-input")
            if (!nameInput || !(nameInput instanceof HTMLInputElement)) {
              alert("something went wrong input")
              return
            }
            const nameValue = nameInput.value
            if (!nameValue) {
              alert("name cannot be empty")
            }
            setName(nameValue)
          }} className='border-2 border-black rounded-md'>update</button>
        </div>
      </div>
      <div id='question' className='flex flex-col items-start ml-4 mt-4'>
        {
          questionsList.map((question, questionKey) => {
            return (
              <div key={questionKey} className='flex flex-col items-start mb-4'>
                <div className={question.hightlight === true ? 'text-red-500' : '' + ' mb-2'}>{questionKey + 1}. {question.question}</div>
                {
                  question.choices.map((choice, choiceKey) => {
                    return (
                      <div key={choiceKey} className='choice'>
                        <input checked={!!choice.selected} onChange={(e) => { updateQuestionList(e, choice, choiceKey, question, questionKey) }} className='mr-2' type="checkbox" name="" id="" />
                        {choice.choice}
                      </div>
                    )
                  })
                }
              </div>
            )
          })
        }
      </div>
      <div className='flex flex-col items-start ml-4 mt-4'>
        <button onClick={submitAnswer} className='border-2 border-black rounded-md p-3'>submit answer</button>
      </div>
    </div>
  );

  function getTopPlayer() {
    try {
      const storage = localStorage.getItem("topPlayer")
      if (!storage) {
        localStorage.setItem("topPlayer", JSON.stringify(top10Default))
        return top10Default
      }

      return JSON.parse(storage) as [{ name: string, score: number }]
    }
    catch (err) {
      console.log(err)
      localStorage.clear()
      localStorage.setItem("topPlayer", JSON.stringify(top10Default))
      return top10Default
    }
  }

  function updateQuestionList(
    e: React.ChangeEvent<HTMLInputElement>,
    choice: {
      choice: string;
      answer: boolean;
      selected: boolean;
    },
    choiceKey: number,
    question: {
      question: string;
      choices: {
        choice: string;
        answer: boolean;
        selected: boolean;
      }[];
    },
    questionKey: number
  ) {

    const questionElement = e.currentTarget.parentElement?.parentElement
    if (!questionElement) {
      alert("some thing went wrong update question list")
      return
    }

    const newQuestionList = [...questionsList]

    //reset checkbox
    for (let choice of newQuestionList[questionKey].choices) {
      choice.selected = false
    }

    //set checkbox
    newQuestionList[questionKey].choices[choiceKey].selected = true

    setQuestionsList(newQuestionList)
  }

  function submitAnswer() {
    let point = 0
    const newQuestionList = [...questionsList]
    for (let question of newQuestionList) {

      let selected = false

      for (let choice of question.choices) {
        if (choice.selected === true) {
          selected = true
          if (choice.answer === true) {
            point = point + 1
            question.hightlight = false
          }
          if (choice.answer === false) {
            question.hightlight = true
          }
        }
      }

      if (selected === false) {
        alert("not all question is answered")
        return
      }
    }

    let newTopPlayer = [...getTopPlayer()]
    newTopPlayer.push({ name: name, score: point })

    for (let i = newTopPlayer.length - 2; i >= 0; i--) {
      if (point >= newTopPlayer[i].score) {
        const temp = newTopPlayer[i]
        newTopPlayer[i] = newTopPlayer[i + 1]
        newTopPlayer[i + 1] = temp
      }
    }

    newTopPlayer.pop()
    console.log(newTopPlayer)
    //save new Top player
    localStorage.setItem("topPlayer", JSON.stringify(newTopPlayer))

    setTopPlayer(newTopPlayer)
    setQuestionsList(newQuestionList)
    alert(`you got ${point} point`)
  }
}

export default App;

function generateRandomName() {
  const allNames = [
    'Elijah',
    'Olivia',
    'Liam',
    'Emma',
    'Noah',
    'Ava',
    'Sophia',
    'Jackson',
    'Mia',
    'Lucas',
    'Isaac',
    'Amelia',
    'Ethan',
    'Aiden',
    'Harper',
    'Aria',
    'Caden',
    'Scarlett',
    'Mason',
    'Abigail',
    'Evelyn',
    'Logan',
    'Grace',
    'Caleb',
    'Zoe',
    'Owen',
    'Avery',
    'Hudson',
    'Chloe',
    'Ella'
  ];
  const randomIndex = Math.floor(Math.random() * allNames.length);
  return allNames[randomIndex];
}

const allQuestions = [
  {
    "question": "4 + 2 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "5", "answer": false, "selected": false },
      { "choice": "6", "answer": true, "selected": false },
      { "choice": "7", "answer": false, "selected": false },
      { "choice": "8", "answer": false, "selected": false }
    ]
  },
  {
    "question": "10 - 5 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "3", "answer": false, "selected": false },
      { "choice": "4", "answer": false, "selected": false },
      { "choice": "5", "answer": true, "selected": false },
      { "choice": "6", "answer": false, "selected": false }
    ]
  },
  {
    "question": "2 + 3 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "4", "answer": false, "selected": false },
      { "choice": "5", "answer": true, "selected": false },
      { "choice": "6", "answer": false, "selected": false },
      { "choice": "7", "answer": false, "selected": false }
    ]
  },
  {
    "question": "8 - 3 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "4", "answer": false, "selected": false },
      { "choice": "5", "answer": true, "selected": false },
      { "choice": "6", "answer": false, "selected": false },
      { "choice": "7", "answer": false, "selected": false }
    ]
  },
  {
    "question": "5 + 4 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "8", "answer": false, "selected": false },
      { "choice": "9", "answer": true, "selected": false },
      { "choice": "10", "answer": false, "selected": false },
      { "choice": "11", "answer": false, "selected": false }
    ]
  },
  {
    "question": "9 - 2 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "6", "answer": false, "selected": false },
      { "choice": "7", "answer": true, "selected": false },
      { "choice": "8", "answer": false, "selected": false },
      { "choice": "9", "answer": false, "selected": false }
    ]
  },
  {
    "question": "3 + 6 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "8", "answer": false, "selected": false },
      { "choice": "9", "answer": true, "selected": false },
      { "choice": "10", "answer": false, "selected": false },
      { "choice": "11", "answer": false, "selected": false }
    ]
  },
  {
    "question": "7 - 4 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "2", "answer": false, "selected": false },
      { "choice": "3", "answer": true, "selected": false },
      { "choice": "4", "answer": false, "selected": false },
      { "choice": "5", "answer": false, "selected": false }
    ]
  },
  {
    "question": "6 + 3 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "8", "answer": false, "selected": false },
      { "choice": "9", "answer": true, "selected": false },
      { "choice": "10", "answer": false, "selected": false },
      { "choice": "11", "answer": false, "selected": false }
    ]
  },
  {
    "question": "12 - 5 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "6", "answer": false, "selected": false },
      { "choice": "7", "answer": true, "selected": false },
      { "choice": "8", "answer": false, "selected": false },
      { "choice": "9", "answer": false, "selected": false }
    ]
  },
  {
    "question": "4 + 5 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "8", "answer": false, "selected": false },
      { "choice": "9", "answer": true, "selected": false },
      { "choice": "10", "answer": false, "selected": false },
      { "choice": "11", "answer": false, "selected": false }
    ]
  },
  {
    "question": "9 - 4 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "4", "answer": false, "selected": false },
      { "choice": "5", "answer": true, "selected": false },
      { "choice": "6", "answer": false, "selected": false },
      { "choice": "7", "answer": false, "selected": false }
    ]
  },
  {
    "question": "7 + 2 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "8", "answer": false, "selected": false },
      { "choice": "9", "answer": true, "selected": false },
      { "choice": "10", "answer": false, "selected": false },
      { "choice": "11", "answer": false, "selected": false }
    ]
  },
  {
    "question": "12 - 3 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "6", "answer": false, "selected": false },
      { "choice": "7", "answer": false, "selected": false },
      { "choice": "8", "answer": false, "selected": false },
      { "choice": "9", "answer": true, "selected": false }
    ]
  },
  {
    "question": "8 + 3 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "10", "answer": false, "selected": false },
      { "choice": "11", "answer": true, "selected": false },
      { "choice": "12", "answer": false, "selected": false },
      { "choice": "13", "answer": false, "selected": false }
    ]
  },
  {
    "question": "10 - 2 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "7", "answer": false, "selected": false },
      { "choice": "8", "answer": true, "selected": false },
      { "choice": "9", "answer": false, "selected": false },
      { "choice": "10", "answer": false, "selected": false }
    ]
  },
  {
    "question": "5 + 4 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "8", "answer": false, "selected": false },
      { "choice": "9", "answer": true, "selected": false },
      { "choice": "10", "answer": false, "selected": false },
      { "choice": "11", "answer": false, "selected": false }
    ]
  },
  {
    "question": "11 - 6 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "4", "answer": false, "selected": false },
      { "choice": "5", "answer": true, "selected": false },
      { "choice": "6", "answer": false, "selected": false },
      { "choice": "7", "answer": false, "selected": false }
    ]
  },
  {
    "question": "6 + 3 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "8", "answer": false, "selected": false },
      { "choice": "9", "answer": true, "selected": false },
      { "choice": "10", "answer": false, "selected": false },
      { "choice": "11", "answer": false, "selected": false }
    ]
  },
  {
    "question": "12 - 4 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "6", "answer": false, "selected": false },
      { "choice": "7", "answer": false, "selected": false },
      { "choice": "8", "answer": true, "selected": false },
      { "choice": "9", "answer": false, "selected": false }
    ]
  },
  {
    "question": "4 * 2 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "5", "answer": false, "selected": false },
      { "choice": "6", "answer": false, "selected": false },
      { "choice": "7", "answer": false, "selected": false },
      { "choice": "8", "answer": true, "selected": false }
    ]
  },
  {
    "question": "6 * 3 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "16", "answer": false, "selected": false },
      { "choice": "17", "answer": false, "selected": false },
      { "choice": "18", "answer": true, "selected": false },
      { "choice": "19", "answer": false, "selected": false }
    ]
  },
  {
    "question": "8 * 4 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "28", "answer": false, "selected": false },
      { "choice": "32", "answer": true, "selected": false },
      { "choice": "36", "answer": false, "selected": false },
      { "choice": "40", "answer": false, "selected": false }
    ]
  },
  {
    "question": "5 * 5 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "20", "answer": false, "selected": false },
      { "choice": "25", "answer": true, "selected": false },
      { "choice": "30", "answer": false, "selected": false },
      { "choice": "35", "answer": false, "selected": false }
    ]
  },
  {
    "question": "9 * 2 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "15", "answer": false, "selected": false },
      { "choice": "16", "answer": false, "selected": false },
      { "choice": "17", "answer": false, "selected": false },
      { "choice": "18", "answer": true, "selected": false }
    ]
  },
  {
    "question": "7 * 4 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "24", "answer": false, "selected": false },
      { "choice": "28", "answer": true, "selected": false },
      { "choice": "32", "answer": false, "selected": false },
      { "choice": "36", "answer": false, "selected": false }
    ]
  },
  {
    "question": "10 * 3 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "28", "answer": false, "selected": false },
      { "choice": "30", "answer": true, "selected": false },
      { "choice": "32", "answer": false, "selected": false },
      { "choice": "34", "answer": false, "selected": false }
    ]
  },
  {
    "question": "6 * 6 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "30", "answer": false, "selected": false },
      { "choice": "36", "answer": true, "selected": false },
      { "choice": "42", "answer": false, "selected": false },
      { "choice": "48", "answer": false, "selected": false }
    ]
  },
  {
    "question": "8 * 5 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "35", "answer": false, "selected": false },
      { "choice": "40", "answer": true, "selected": false },
      { "choice": "45", "answer": false, "selected": false },
      { "choice": "50", "answer": false, "selected": false }
    ]
  },
  {
    "question": "12 * 3 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "32", "answer": false, "selected": false },
      { "choice": "33", "answer": false, "selected": false },
      { "choice": "38", "answer": false, "selected": false },
      { "choice": "36", "answer": true, "selected": false }
    ]
  },
  {
    "question": "15 * 2 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "25", "answer": false, "selected": false },
      { "choice": "30", "answer": true, "selected": false },
      { "choice": "35", "answer": false, "selected": false },
      { "choice": "40", "answer": false, "selected": false }
    ]
  },
  {
    "question": "9 * 4 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "32", "answer": false, "selected": false },
      { "choice": "36", "answer": true, "selected": false },
      { "choice": "40", "answer": false, "selected": false },
      { "choice": "44", "answer": false, "selected": false }
    ]
  },
  {
    "question": "7 * 3 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "20", "answer": false, "selected": false },
      { "choice": "25", "answer": false, "selected": false },
      { "choice": "22", "answer": false, "selected": false },
      { "choice": "21", "answer": true, "selected": false }
    ]
  },
  {
    "question": "10 * 5 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "45", "answer": false, "selected": false },
      { "choice": "50", "answer": true, "selected": false },
      { "choice": "55", "answer": false, "selected": false },
      { "choice": "60", "answer": false, "selected": false }
    ]
  },
  {
    "question": "12 * 2 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "22", "answer": false, "selected": false },
      { "choice": "24", "answer": true, "selected": false },
      { "choice": "26", "answer": false, "selected": false },
      { "choice": "28", "answer": false, "selected": false }
    ]
  },
  {
    "question": "6 * 4 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "20", "answer": false, "selected": false },
      { "choice": "24", "answer": true, "selected": false },
      { "choice": "28", "answer": false, "selected": false },
      { "choice": "32", "answer": false, "selected": false }
    ]
  },
  {
    "question": "15 / 3 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "3", "answer": false, "selected": false },
      { "choice": "4", "answer": false, "selected": false },
      { "choice": "5", "answer": true, "selected": false },
      { "choice": "6", "answer": false, "selected": false }
    ]
  },
  {
    "question": "18 / 2 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "7", "answer": false, "selected": false },
      { "choice": "8", "answer": false, "selected": false },
      { "choice": "9", "answer": true, "selected": false },
      { "choice": "10", "answer": false, "selected": false }
    ]
  },
  {
    "question": "20 / 4 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "4", "answer": false, "selected": false },
      { "choice": "5", "answer": true, "selected": false },
      { "choice": "6", "answer": false, "selected": false },
      { "choice": "7", "answer": false, "selected": false }
    ]
  },
  {
    "question": "7 / 7 = ?",
    "hightlight": false,
    "choices": [
      { "choice": "1", "answer": true, "selected": false },
      { "choice": "7", "answer": false, "selected": false },
      { "choice": "70", "answer": false, "selected": false },
      { "choice": "0", "answer": false, "selected": false }
    ]
  }
]

const top10Default = [
  { name: "Elijah", score: 15 },
  { name: "Olivia", score: 14 },
  { name: "Liam", score: 13 },
  { name: "Emma", score: 12 },
  { name: "Noah", score: 10 },
  { name: "Ava", score: 9 },
  { name: "Sophia", score: 8 },
  { name: "Jackson", score: 7 },
  { name: "Mia", score: 6 },
  { name: "Lucas", score: 5 },
]

