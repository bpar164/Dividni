 let correctCount = 0;
 let incorrectCount = 0;
 let currentType;
 const minCorrectTruth = 1;
 const minIncorrectTruth = 4;
 const minCorrectXYZ = 3;
 const minIncorrectXYZ = 3;
 const limit = 25;

 /*Creates the answer slots, based on the question types
 Transfers existing answers when switching between types*/
createAnswers = (type) => {
  currentType = type;
  //Enable both add answer and preview buttons
  document.getElementById('addCorrect').classList.remove("disabled");
  document.getElementById('addIncorrect').classList.remove("disabled");
  document.getElementById('preview').classList.remove("disabled");
  //Fetch any existing answers 
  let correctAnswers = [];
  for (i = 1; i <= correctCount; i++) {
    ans = document.getElementById('correctAnswers[' + i + ']').value;
    if (!(ans === '')) { correctAnswers.push(ans) } //Only add non-empty answers to array
  }
  let incorrectAnswers = [];
  for (i = 1; i <= incorrectCount; i++) {
    ans = document.getElementById('incorrectAnswers[' + i + ']').value;
    if (!(ans === '')) { incorrectAnswers.push(ans) } //Only add non-empty answers to array
  }
  //Clear answer divs
  document.getElementById('correct').innerHTML = '';
  document.getElementById('incorrect').innerHTML = '';
  //Reset counts
  correctCount = 0;
  incorrectCount = 0;
 //Add the correct number of correct and incorrect answers for the corresponding type
  if (type === 'Truth') {
    createCorrectAnswers(minCorrectTruth, correctAnswers, true);
    createIncorrectAnswers(minIncorrectTruth, incorrectAnswers, true);
  }
  else if (type === 'Xyz') {
    createCorrectAnswers(minCorrectXYZ, correctAnswers, true);
    createIncorrectAnswers(minIncorrectXYZ, incorrectAnswers, true);
  }
  console.log(correctAnswers)
  if (correctAnswers.length >= 1) { //Create slots for any remaining correct answers
    createCorrectAnswers(correctAnswers.length, correctAnswers, false);
  }
  if (incorrectAnswers.length >= 1) { //Create slots for any remaining incorrect answers
    createIncorrectAnswers(incorrectAnswers.length, incorrectAnswers, false);
  }
}

//Helps createAnswer to call addAnswer a specified number of times
createCorrectAnswers = (numAnswers, correctAnswers, required) => {
  for (i = 1; i <= numAnswers; i++) {
    let existingVal = null;
    if (correctAnswers.length >= 1) { //Add any existing answers to the slots
      existingVal = correctAnswers[0];
      correctAnswers.shift(); // Remove the first element
    }
    addAnswer('correct', required, existingVal);
  }
}

//Helps createAnswer to call addAnswer a specified number of times
createIncorrectAnswers = (numAnswers, incorrectAnswers, required) => {
  for (i = 1; i <= numAnswers; i++) {
    let existingVal = null;
    if (incorrectAnswers.length >= 1) { //Add any existing answers to the slots
      existingVal = incorrectAnswers[0];
      incorrectAnswers.shift(); // Remove the first element
    } 
    addAnswer('incorrect', required, existingVal);
  }
}

addAnswer = (divName, isRequired, value) => {
  if ((correctCount <= limit) && (divName === 'correct')) {
    correctCount++;
    var newdiv = document.createElement('div');
    newdiv.classList.add("input-field");
    newdiv.innerHTML = "<input type='text' id='correctAnswers[" + correctCount + "]'" + "name='correctAnswers[" + (correctCount) + "]'" + (isRequired ? 'required' : '') + (value ? ' value=' + value : '') + ">";
    document.getElementById(divName).appendChild(newdiv);
  }
  else if ((incorrectCount <= limit) && (divName === 'incorrect')) {
    incorrectCount++;
    var newdiv = document.createElement('div');
    newdiv.classList.add("input-field");
    newdiv.innerHTML = "<input type='text' id='incorrectAnswers[" + incorrectCount + "]'" + "name='incorrectAnswers[" + (incorrectCount) + "]'" + (isRequired ? 'required' : '') + (value ? ' value=' + value : '') + ">";
    document.getElementById(divName).appendChild(newdiv);
  }

  previewAnswer = () => {
    //Enable the generate button
    document.getElementById('generate').classList.remove("disabled");
    //Clear the content
    content = '';
    //Fetch the values from the form
    content += '<b>Name: </b>' + document.getElementById('name').value + '</br>';
    content += '</br><b>Type: </b>' + currentType + '</br>';
    content += '</br><b>Marks: </b>' + document.getElementById('marks').value + '</br>';
    content += '</br><b>Question Text:</b></br>' + document.getElementById('questionText').value + '</br>';
    content += '</br><b>Correct Answers:</b><ol>';
    for (i = 1; i <= correctCount; i++) {
      content += '<li>' + document.getElementById('correctAnswers[' + i + ']').value + '</li>';
    }
    content += '</ol>';
    content += '<b>Incorrect Answers:</b><ol>';
    for (i = 1; i <= incorrectCount; i++) {
      content += '<li>' + document.getElementById('incorrectAnswers[' + i + ']').value + '</li>';
    }
    content += '</ol>';
    //Add the values to the display content
    document.getElementById('previewModalContent').innerHTML = content;
  }
}




