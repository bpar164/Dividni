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
}

previewAnswer = () => {
  //Enable the generate button
  document.getElementById('generate').classList.remove("disabled");
  //Create the question object by fetching values from the form
  question = {};
  question.name = document.getElementById('name').value;
  question.type = currentType;
  question.marks = document.getElementById('marks').value;
  question.questionText = document.getElementById('questionText').value;
  question.correctAnswers = [];
  for (i = 1; i <= correctCount; i++) {
    question.correctAnswers.push(document.getElementById('incorrectAnswers[' + i + ']').value);
  }
  question.incorrectAnswers = [];
  for (i = 1; i <= incorrectCount; i++) {
    question.incorrectAnswers.push(document.getElementById('incorrectAnswers[' + i + ']').value);
  }
  //Call a function to generate the content
  content = generatePreviewContent(question);
  //Add the values to the display content
  document.getElementById('previewModalContent').innerHTML = content;
}

generatePreviewContent = (question) => {
  //Clear the content
  content = '';
  //Build the content using the values with formatting 
  content += '<b>Name: </b>' + question.name + '</br>';
  content += '</br><b>Type: </b>' + question.type + '</br>';
  content += '</br><b>Marks: </b>' + question.marks + '</br>';
  content += '</br><b>Question Text:</b></br>' + question.questionText + '</br>';
  content += '</br><b>Correct Answers:</b><ol>';
  question.correctAnswers.forEach(ans => {
    content += '<li>' + ans + '</li>';
  });
  content += '</ol>';
  content += '<b>Incorrect Answers:</b><ol>';
  question.incorrectAnswers.forEach(ans => {
    content += '<li>' + ans + '</li>';
  });
  content += '</ol>'; 
  return content;
}

//For the my questions section
previewMyQuestion = (name, type, marks, questionText, correctAnswers, incorrectAnswers) => {
  //Create the question object 
  question = {};
  question.name = name;
  question.type = type;
  question.marks = marks;
  question.questionText = questionText;
  question.correctAnswers = correctAnswers.split(',');
  question.incorrectAnswers = incorrectAnswers.split(',');
  //Call a function to generate the content
  content = generatePreviewContent(question);
  //Add the values to the display content
  document.getElementById('previewModalContent').innerHTML = content;
}

confirmDialog = (action, name, id) => {
  let content = '<p>';
  //Build the display string and set the correct onClick function for the yes button
  if (action === 'DELETE') {
    content += 'Delete question:</br><b>' + name + '</b>';
    document.getElementById('confirmModalYes').setAttribute('onClick', `deleteQuestion('` + id + `');`);
  }
  content += '</p>'
  //Set the contents of the modal
  document.getElementById('confirmModalContent').innerHTML = content;
}

deleteQuestion = (id) => {
  document.getElementById(id).remove();
  $.ajax({
    url : 'multiple-choice-my/' + id,
    method : 'delete'
  })
}
  




