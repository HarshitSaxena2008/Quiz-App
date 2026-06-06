
let startBtn = document.querySelector(".start-msg");
let question = document.querySelector(".question");
let head = document.querySelector(".head");
let body = document.querySelector("body");
let content = document.querySelector(".content");
let quesCount = document.querySelector(".Question-count");
let choices = document.querySelectorAll(".choice");
let msg = document.querySelector(".msg");
let resetBtn = document.querySelector(".reset");
let nextBtn = document.querySelector(".next");
let winner =document.querySelector(".winner");
let winMsg = document.querySelector(".win-msg");
let retry = document.querySelector(".Retry");
let game = document.querySelector(".game");

let topic;
let noOfQues;
let questionCount = 0;
let correctCount = 0;
let correctAns ;
let userAns;
let obj;

const API_KEY = "AQ.Ab8RN6JrKGwi06iX0XCjUoXqSUKuyg9bmDb4YcNqvEAw6qebJA";
async function generateMCQ(topic) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
                        Generate EXACTLY ${noOfQues} MCQs on ${topic}.

                        Return ONLY valid JSON.

                        Format:
                        [
                          {
                            "question": "string",
                            "options": ["option", "option", "option", "option"],
                            "correct_answer": "A"
                          }
                        ]

                        No markdown.
                        No explanation.
                        No extra text.
                        `
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    // console.log("STATUS:", response.status)
    // console.log("FULL DATA:", data);

    if (!response.ok) {
      console.log("API ERROR:", data.error.message);
      return null;
    }

    const text = data.candidates[0].content.parts[0].text;
    let cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

    return cleaned;

  } catch (err) {
    console.log("ERROR:", err);
  }
}

const reset = () => {
    questionCount = 0;
    correctCount = 0 ;
    head.style = "";
    head.innerText = "⭐!! Quiz Arena !!⭐";
    content.classList.add("hide");
    startBtn.classList.remove("hide");
    body.style = "" ;
    choices.style = "";
    msg.style = "";
    msg.innerText = "None";
    enableButtons();
    winner.classList.add("hide");
    game.style = "";
    startBtn.style.pointerEvents ="";
    startBtn.innerText = "Start Challenge😎?";
}
const layoutChanges = () => {
    startBtn.classList.add("hide");
    body.style.backgroundColor = "#0B0F1A";
    head.style.textShadow = " 0 0 12px rgba(212,175,55,.25)";
    head.style.fontFamily = "cinzel,serif";
    head.style.color = "#F4C430";
    head.style.fontWeight = "900";
    head.innerText = "Challenge Begin";
    head.style.marginTop = "1rem" ;
    content.classList.remove("hide");
}

const getData =  async () => {
    console.log("fetching...")
    let data = await generateMCQ(topic);
    data = JSON.parse(data);
    console.log(typeof data); // first question
    console.log(data);  // first question options
    return data;
}

const setQuestion = (obj , i) => {
    question.innerText = obj[i].question;
    choices.forEach((choice , j ) => {
      choice.innerText = obj[i].options[j];
    })
    correctAns =  obj[i].correct_answer;
    quesCount.innerText = `Question : ${i+1} / ${noOfQues}`;
    msg.style = "";
    msg.innerText = "None";
}

const showQuestion = async () => {
    obj = await getData();
    setQuestion(obj,questionCount);
    questionCount++;
    layoutChanges();

}

startBtn.addEventListener("click", () => {
  startBtn.innerText = "Waiting...";
  topic = prompt("Enter topic : ");
  noOfQues = prompt("Number Of Question : ");
  startBtn.style.pointerEvents ="none";
  showQuestion();
});

const showWinner = () => {
    content.classList.add("hide");
    head.innerText = "Challenge Ended!";
    winner.classList.remove("hide");
    head.style.marginTop = "10rem";
    game.style.height = "20vh";
}
const checkQuestion = () => {
    if( userAns === correctAns ){
        correctCount++;
        return true;
    } 
    return false;
}

const ChangesAfterCheck = (choice) => {
    let flag = checkQuestion(); 
    let correctChoice = document.querySelector(`#${correctAns}`);
    if( flag ) {
        choice.style.backgroundColor = "#0F9D58"
        msg.style.backgroundColor = "#0F9D58";
        msg.innerText = "Correct";
    } else {
        correctChoice.style.backgroundColor = "#0F9D58";
        choice.style.backgroundColor = "red"
        msg.style.backgroundColor = "red";
        msg.innerText = "Wrong";
    }
    if( questionCount == noOfQues) {
      if( correctCount == noOfQues ) winMsg.innerText = `Outstanding, Your score is ${correctCount} / ${noOfQues}`;
      else if( correctCount > noOfQues/2) winMsg.innerText = `Excellent, Your score is ${correctCount} / ${noOfQues}`;
      else if( correctCount < noOfQues/3) winMsg.innerText = `Fair, Your score is ${correctCount} / ${noOfQues}`;
      else if( correctCount == 0 ) winMsg.innerText = `Poor, Your score is ${correctCount} / ${noOfQues}`;
      else winMsg.innerText = `Good, Your score is ${correctCount} / ${noOfQues}`;
    setTimeout(showWinner,2000);
    }
}

const disableButtons = () => {
    choices.forEach( (choice) => { 
        choice.style.pointerEvents = "none";
    })
}

const enableButtons = () => {
    choices.forEach( (choice) => { 
        choice.style.pointerEvents = "";
        choice.style ="";
    })
}

choices.forEach( (choice) => {
    choice.addEventListener("click",() => {
        userAns = choice.getAttribute("id");
        ChangesAfterCheck(choice);
        disableButtons();
    });
});

resetBtn.addEventListener("click",reset);
retry.addEventListener("click" , reset);
nextBtn.addEventListener("click", () =>{
    enableButtons();
    setQuestion(obj , questionCount);
    questionCount++;
});