let count = document.querySelector(".questions-count span")
let spans = document.querySelector(".spans")
let quizArea = document.querySelector(".quiz_area")
let quizAnswers = document.querySelector(".quiz_answers")
let submit = document.querySelector(".submit")
let theBullets = document.querySelector(".bullets")
let results = document.querySelector(".results")
let countDown = document.querySelector(".counterdown")
let current = 0;
let rightAns = 0;
let countDownInterval;
function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200) {
            let questionsObj = JSON.parse(this.responseText)
            let questionsLength = questionsObj.length
            bullets(questionsLength)
            addQuestions(questionsObj[current],questionsLength)
            countdown(90,questionsLength)
            submit.onclick = function() {
                let theRightAns = questionsObj[current].right_ans
                current++;
                checkAns(theRightAns,questionsLength)
                quizArea.innerHTML=""
                quizAnswers.innerHTML=""
                addQuestions(questionsObj[current],questionsLength)
                onClass()
                showResults(questionsLength)
                clearInterval(countDownInterval)
                countdown(90,questionsLength)
            }
        }
    }
    myRequest.open("GET","html_quesitions.json",true);
    myRequest.send();
}
getQuestions()
function bullets(num) {
    count.innerHTML = num
    for(let i = 1; i <= num; i++) {
        let span = document.createElement("span")
        if (i === 1) {
            span.className = "on"
        }
        span.appendChild(document.createTextNode(i))
        spans.appendChild(span)
    }
}
function addQuestions(obj,count) {
    if(current < count) {
        let mainH = document.createElement("h2")
    let mainHText = document.createTextNode(obj.title)
    mainH.appendChild(mainHText)
    quizArea.appendChild(mainH)
    for (let i =1;i <= 4;i++) {
        let mainDiv = document.createElement("div")
        mainDiv.className = "answer"
        let radioInput = document.createElement("input")
        radioInput.name = "question"
        radioInput.type = "radio"
        radioInput.id = `ans_${i}`
        radioInput.dataset.answer = obj[`ans${i}`]
        let theLabel = document.createElement("label")
        theLabel.htmlFor = `ans_${i}`
        let theLabelText = document.createTextNode(obj[`ans${i}`])
        theLabel.appendChild(theLabelText)
        mainDiv.appendChild(radioInput)
        mainDiv.appendChild(theLabel)
        quizAnswers.appendChild(mainDiv)
        if(i === 1) {
            radioInput.checked = true
        }
    }
    }
}
function checkAns(rans,qcount) {
    let ans = document.getElementsByName("question")
    let choosenAns
    for(let i = 0 ; i < ans.length ; i++) {
        if(ans[i].checked) {
            choosenAns = ans[i].dataset.answer
        }
    }
    if(rans === choosenAns) {
        rightAns++;
    }
}
function onClass() {
    let bulletSpans = document.querySelectorAll(".spans span")
    let arrayOfSpans = Array.from(bulletSpans)
    arrayOfSpans.forEach((e,index) => {
        if(current === index) {
            e.className="on"
        }
    })
}
function showResults(count) {
    let theResults
    if(current === count) {
        quizArea.remove()
        quizAnswers.remove()
        submit.remove()
        theBullets.remove()
        if(rightAns > count/2 && rightAns < count) {
            theResults = `<span class="Good">Good</span>,You Answered ${rightAns} From ${count}`
        } else if (rightAns === count) {
            theResults = `<span class="perfect">Perfect</span>,You Answered ${rightAns} From ${count}`
        } else {
            theResults = `<span class="bad">Bad</span>,You Answered ${rightAns} From ${count}`
        }
        results.innerHTML = theResults
        results.style.padding = "10px"
        results.style.marginTop = "10px"
        results.style.backgroundColor = "white"
    }
}
function countdown(duration,count) {
    if (current < count) {
        let minutes,seconds
        countDownInterval = setInterval(() => {
            minutes = parseInt(duration / 60)
            seconds = parseInt(duration % 60)
            minutes = minutes < 10 ? `0${minutes}` : minutes
            seconds = seconds < 10 ? `0${seconds}` : seconds
            countDown.innerHTML = `${minutes}:${seconds}`
            if(--duration < 0) {
                clearInterval(countDownInterval)
                submit.click()
            }
        }, 1000);
    }
}