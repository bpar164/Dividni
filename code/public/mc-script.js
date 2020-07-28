 let correctCount = 0;
 let incorrectCount = 0;
 let currentType;
 const minCorrectTruth = 1;
 const minIncorrectTruth = 4;
 const minCorrectXYZ = 3;
 const minIncorrectXYZ = 3;
 const limit = 25;
 let currentQuestionID;
 let currentQuestionName;

 $(document).ready(function(){
  //Check if there is data for a question that needs to be populated
  let questionMode = document.getElementById('questionMode');
  if (questionMode) { 
    populateQuestionForm(questionMode.getAttribute('data-question-id'), questionMode.getAttribute('data-question-action'))
  }
  tinymce.init({
    selector: '.tinymce-description', 
    height: '15em',
    menubar: '',
    toolbar: 'undo redo | styleselect | bold italic underline strikethrough superscript subscript removeformat | bullist numlist table | ',
    plugins: [ 'lists table' ]
  });
});

loadAnswerEditor = () => {
  tinymce.init({
    selector: '.tinymce-small',
    height: '7.5em',
    menubar: '',
    toolbar: 'undo redo | styleselect | bold italic underline strikethrough superscript subscript removeformat | '
  });
}

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
    ans = tinyMCE.get('correctAnswers[' + i + ']').getContent();
    if (!(ans === '')) { correctAnswers.push(ans) } //Only add non-empty answers to array
  }
  let incorrectAnswers = [];
  for (i = 1; i <= incorrectCount; i++) {
    ans = tinyMCE.get('incorrectAnswers[' + i + ']').getContent();
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
  let newdiv = document.createElement('div');
  let newpar = document.createElement('p');
  newdiv.classList.add("input-field");
  newdiv.classList.add("tinymce-small");
  isRequired ? newdiv.classList.add("required-field") : null;
  let identifier;
  if ((correctCount <= limit) && (divName === 'correct')) {
    correctCount++;
    identifier = 'correctAnswers[' + correctCount + ']';
    newdiv.id = identifier;
    newdiv.name = identifier;
    document.getElementById(divName).appendChild(newdiv);
    document.getElementById(divName).appendChild(newpar);
    loadAnswerEditor();
    value ? tinyMCE.get(identifier).setContent(value) : null;
  }
  else if ((incorrectCount <= limit) && (divName === 'incorrect')) {
    incorrectCount++;
    identifier = 'incorrectAnswers[' + incorrectCount + ']';
    newdiv.id = identifier;
    newdiv.name = identifier;
    document.getElementById(divName).appendChild(newdiv);
    document.getElementById(divName).appendChild(newpar);
    loadAnswerEditor();
    value ? tinyMCE.get(identifier).setContent(value) : null;
  }
}

previewAnswer = () => {
  //Enable the generate button
  document.getElementById('generate').classList.remove("disabled");
  //Call a function to create the question object
  question = fetchFormValues();
  //Call a function to generate the content
  content = generatePreviewContent(question);
  //Add the values to the display content
  document.getElementById('previewModalContent').innerHTML = content;
}

//Fetches all values from the form
fetchFormValues = () => {
  //Create the question object by fetching values from the form
  question = {};
  question.name = document.getElementById('name').value;
  question.type = currentType;
  question.marks = document.getElementById('marks').value;
  question.questionText = tinyMCE.get('questionText').getContent();
  question.correctAnswers = [];
  for (i = 1; i <= correctCount; i++) {
    question.correctAnswers.push(tinyMCE.get('correctAnswers[' + i + ']').getContent());
  }
  question.incorrectAnswers = [];
  for (i = 1; i <= incorrectCount; i++) {
    question.incorrectAnswers.push(tinyMCE.get('incorrectAnswers[' + i + ']').getContent());
  }
  return question;
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

$("#questionForm").submit((event) => {
  event.preventDefault();
  //Display options modal
  $('#optionsModal').modal('open');
  //Check that all required text fields have values
  let requiredFields = document.getElementsByClassName('required-field');
  let missingFieldIDs = [];
  let missingRequired = false;
  Array.from(requiredFields).forEach(field => {
    if (tinyMCE.get(field.id).getContent() === '') {
      missingRequired = true;
      missingFieldIDs.push(field.id);
    }
  });
  if (missingRequired) {
    let content = '<p>Please complete the following fields:<ul>'
    missingFieldIDs.forEach(id => {
      content += '<li>' + id + '</li>'
    });
    content += '</ul></p>';
    document.getElementById('optionsModalContent').innerHTML = content;
    document.getElementById('optionsModalRetry').classList.remove("disabled");
  } else { //All required fields filled in
    document.getElementById('optionsModalRetry').classList.add("disabled");
    //Generate the question
    generateQuestion();
  } 
});

generateQuestion = () => {
  document.getElementById('optionsModalContent').innerHTML = '<p>Generating question...</p>';
  //Get the values from the form
  let question = fetchFormValues();
  $.ajax({
    url: 'multiple-choice-preview',
    method: 'POST',
    data: question,
    success: (res) => {
      if (res === 'true') {
        //Question generated
        document.getElementById('optionsModalContent').innerHTML = '<p>Question generated.</p>';
      } else if (res === 'false') {
        //Question not generated
        document.getElementById('optionsModalContent').innerHTML = '<p>Error generating question.</p>';
        document.getElementById('optionsModalRetry').classList.remove("disabled");
      }  
    },
    error: () => {
      document.getElementById('optionsModalContent').innerHTML = '<p>Error generating question.</p>';
      document.getElementById('optionsModalRetry').classList.remove("disabled");
    }
  });
  document.getElementById('optionsModalCreate').classList.remove("disabled");
  document.getElementById('optionsModalView').classList.remove("disabled");
}

setCurrentQuestion = (id, name) => {
  currentQuestionID = id;
  currentQuestionName = name;
}

confirmDialog = (action) => {
  let content = '<p>';
  //Build the display string and set the correct onClick function for the yes button
  if (action === 'DELETE') {
    content += 'Delete question:</br><b>' + currentQuestionName + '</b>';
    document.getElementById('confirmModalYes').setAttribute('onClick', `deleteQuestion('` + currentQuestionID + `');`);
  } else if (action === 'EDIT') {
    content += 'Edit question:</br><b>' + currentQuestionName + '</b>';
    //document.getElementById('confirmModalYes').setAttribute('onClick', `editQuestion('` + currentQuestionID + `');`);
  } else if (action === 'TEMPLATE') {
    content += 'Use the following question as a template:</br><b>' + currentQuestionName + '</b>';
    document.getElementById('confirmModalYes').setAttribute('onClick', `templateQuestion('` + currentQuestionID + `');`);
  }
  content += '</p>'
  //Set the contents of the modal
  document.getElementById('confirmModalContent').innerHTML = content;
}

previewQuestion = () => {
  document.getElementById('previewModalContent').innerHTML = '<p>Fetching question...</p>';
  $.ajax({
    url: 'multiple-choice-my/' + currentQuestionID,
    method: 'GET',
    dataType: 'json',
    success: (res) => {
      if (res.question) {
        //Call a function to generate the content
        content = generatePreviewContent(res.question);
        //Add the content to the display
        document.getElementById('previewModalContent').innerHTML = content;
      } else {
        document.getElementById('previewModalContent').innerHTML = '<p>Error fetching question.</p>';
      }  
    },
    error: () => {
      document.getElementById('previewModalContent').innerHTML = '<p>Error fetching question.</p>';
    }
  });
}

deleteQuestion = (id) => {
  document.getElementById(id).remove();
  $.ajax({
    url : 'multiple-choice-my/' + id,
    method : 'delete'
  })
}

templateQuestion = (id) => {
  $.ajax({
    url: 'template-question/' + id,
    method: 'GET',
    success: (res) => {
      window.location.href ="multiple-choice";
    }
  });
}

populateQuestionForm = (id, action) => {
  //Fetch question
  $.ajax({
    url: 'multiple-choice-my/' + id,
    method: 'GET',
    dataType: 'json',
    success: (res) => {
      if (!(res.question)) {
        //Display message if no question found
        $('#previewModal').modal();
        document.getElementById('previewModalContent').innerHTML = '<p>Error loading question.</p>';
      } else {
        //Populate form
        document.getElementById('name').value = res.question.name;
        if (res.question.type === "Truth") {
          document.getElementById('truth').setAttribute("checked", true);
        } else {
          document.getElementById('xyz').setAttribute("checked", true);
        }
        document.getElementById('marks').value = res.question.marks;
        /*question.type = currentType;
        question.marks = document.getElementById('marks').value;
        question.questionText = tinyMCE.get('questionText').getContent();
        question.correctAnswers = [];
        for (i = 1; i <= correctCount; i++) {
          question.correctAnswers.push(tinyMCE.get('correctAnswers[' + i + ']').getContent());
        }
        question.incorrectAnswers = [];
        for (i = 1; i <= incorrectCount; i++) {
          question.incorrectAnswers.push(tinyMCE.get('incorrectAnswers[' + i + ']').getContent());
        }*/
      }  
    },
    error: () => {
      $('#previewModal').modal();
      document.getElementById('previewModalContent').innerHTML = '<p>Error loading question.</p>';
    }
  });
}








  




