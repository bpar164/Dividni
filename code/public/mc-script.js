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

 $(document).ready(() => {
   //Create questionText editor
  tinymce.init({
    selector: '.tinymce-description', 
    height: '15em',
    menubar: '',
    toolbar: 'undo redo | styleselect | bold italic underline strikethrough superscript subscript removeformat | bullist numlist table | ',
    plugins: [ 'lists table' ]
  });
  //Check if there is data for a question that needs to be populated
  let questionMode = document.getElementById('questionMode');
  if (questionMode) { 
    setTimeout(() => { populateQuestionForm(questionMode.getAttribute('data-question-id')); }, 500); //Give tinyMCE time to load
  }
});

//For question slots
loadAnswerEditors = () => {
  tinymce.init({
    selector: '.tinymce-small',
    height: '7.5em',
    menubar: '',
    toolbar: 'undo redo | styleselect | bold italic underline strikethrough superscript subscript removeformat | '
  });
}

 /*Creates the answer slots, based on the question types
 Transfers existing answers when switching between types*/
createAnswers = (type, correctAnswers, incorrectAnswers) => {
  currentType = type;
  //Enable both add answer and preview buttons
  document.getElementById('addCorrect').classList.remove("disabled");
  document.getElementById('addIncorrect').classList.remove("disabled");
  document.getElementById('preview').classList.remove("disabled");
  //Answers will be empty unless the method is called by template or edit
  if (!(correctAnswers)) { 
    //Fetch any existing answers 
    correctAnswers = [];
    for (i = 1; i <= correctCount; i++) {
      ans = tinyMCE.get('correctAnswers[' + i + ']').getContent();
      if (!(ans === '')) { correctAnswers.push(ans) } //Only add non-empty answers to array
    }
    incorrectAnswers = [];
    for (i = 1; i <= incorrectCount; i++) {
      ans = tinyMCE.get('incorrectAnswers[' + i + ']').getContent();
      if (!(ans === '')) { incorrectAnswers.push(ans) } //Only add non-empty answers to array
    }
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

//Creates the actual HTML answer slot
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
    loadAnswerEditors();
    value ? tinyMCE.get(identifier).setContent(value) : null;
  }
  else if ((incorrectCount <= limit) && (divName === 'incorrect')) {
    incorrectCount++;
    identifier = 'incorrectAnswers[' + incorrectCount + ']';
    newdiv.id = identifier;
    newdiv.name = identifier;
    document.getElementById(divName).appendChild(newdiv);
    document.getElementById(divName).appendChild(newpar);
    loadAnswerEditors();
    value ? tinyMCE.get(identifier).setContent(value) : null;
  }
}

//Calls methods to create and populate the preview window
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

//Creates the HTML content for the preview window
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

//When form is submitted, check for required fields and generate the options modal
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
    //Check if question is being edited or being created
    let questionMode = document.getElementById('questionMode');
    if ((questionMode) && (questionMode.getAttribute('data-question-action') === 'EDIT')) {
      updateQuestion(questionMode.getAttribute('data-question-id')); //Edit question
    } else {
      generateQuestion(); //Create question
    }
  } 
});

//Make the actual request to add the question to the database
generateQuestion = () => {
  document.getElementById('optionsModalContent').innerHTML = '<p>Generating question...</p>';
  //Get the values from the form
  let question = fetchFormValues();
  $.ajax({
    url: 'multiple-choice',
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

//Make the actual request to update the question in the database
updateQuestion = (id) => {
  document.getElementById('optionsModalContent').innerHTML = '<p>Editing question...</p>';
  //Get the values from the form
  let question = fetchFormValues();
  $.ajax({
    url: 'multiple-choice/' + id,
    method: 'PUT',
    data: question,
    success: (res) => {
      if (res === 'true') {
        //Question updated
        document.getElementById('optionsModalContent').innerHTML = '<p>Question edited.</p>';
      } else if (res === 'false') {
        //Question not updated
        document.getElementById('optionsModalContent').innerHTML = '<p>Error editing question.</p>';
        document.getElementById('optionsModalRetry').classList.remove("disabled");
      }  
    },
    error: () => {
      document.getElementById('optionsModalContent').innerHTML = '<p>Error editing question.</p>';
      document.getElementById('optionsModalRetry').classList.remove("disabled");
    }
  });
  document.getElementById('optionsModalCreate').classList.remove("disabled");
  document.getElementById('optionsModalView').classList.remove("disabled");
}

//Used when a question in a list is clicked-on 
setCurrentQuestion = (id, name) => {
  currentQuestionID = id;
  currentQuestionName = name;
}

//Creates a confirmation modal
confirmDialog = (action) => {
  //Reset buttons
  document.getElementById('confirmModalNo').innerHTML= "NO";
  document.getElementById('confirmModalYes').classList.remove("disabled");
  //Build the display string and set the correct onClick function for the yes button
  let content = '<p>';
  if (action === 'DELETE') {
    content += 'Delete question:</br><b>' + currentQuestionName + '</b>';
    document.getElementById('confirmModalYes').setAttribute('onClick', `deleteQuestion('` + currentQuestionID + `');`);
  } else if (action === 'EDIT') {
    content += 'Edit question:</br><b>' + currentQuestionName + '</b>';
    document.getElementById('confirmModalYes').setAttribute('onClick', `editQuestion('` + currentQuestionID + `');`);
  } else if (action === 'TEMPLATE') {
    content += 'Use the following question as a template:</br><b>' + currentQuestionName + '</b>';
    document.getElementById('confirmModalYes').setAttribute('onClick', `templateQuestion('` + currentQuestionID + `');`);
  } else if (action === 'SHARE') {
    content += 'Share the following question with a different user:</br><b>' + currentQuestionName + '</b>';
    document.getElementById('confirmModalYes').classList.remove('modal-close');
    document.getElementById('confirmModalYes').setAttribute('onClick', `shareQuestion('` + currentQuestionID + `');`);
  }
  content += '</p>'
  //Set the contents of the modal
  document.getElementById('confirmModalContent').innerHTML = content;
}

//Fetches question from database and displays it
previewQuestion = () => {
  document.getElementById('previewModalContent').innerHTML = '<p>Fetching question...</p>';
  $.ajax({
    url: 'multiple-choice-my/' + currentQuestionID,
    method: 'GET',
    dataType: 'json',
    success: (res) => {
      if (res.question) {
        //Call a function to generate the HTML content
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

//Removes question from database
deleteQuestion = (id) => {
  document.getElementById(id).remove();
  $.ajax({
    url : 'multiple-choice-my/' + id,
    method : 'delete'
  })
}

//Sets the id value and 'edit' in the backend and redirects to the create page
editQuestion = (id) => {
  $.ajax({
    url: 'edit-question/' + id,
    method: 'GET',
    success: (res) => {
      window.location.href ="multiple-choice";
    }
  });
}

//Sets the id value and 'template' in the backend and redirects to the create page
templateQuestion = (id) => {
  $.ajax({
    url: 'template-question/' + id,
    method: 'GET',
    success: (res) => {
      window.location.href ="multiple-choice";
    }
  });
}

//
shareQuestion = () => {
  let content = `<form onSubmit="return submitShareForm(event)">
                  <div class="input-field">
                    <label for="name">Email</label>
                    <input type="email" id="email" name="email" required>
                  </div> 
                  <button class="btn waves-effect waves-light right" type="submit"> 
                    SHARE<i class="material-icons right">send</i>
                  </button> 
                </form>`;
  document.getElementById('confirmModalNo').innerHTML= "CANCEl";
  document.getElementById('confirmModalYes').classList.add("disabled");
  document.getElementById('confirmModalContent').innerHTML = content;
}

submitShareForm = (event) => {
  event.preventDefault();
  let email = event.target.elements.email.value;
  document.getElementById('confirmModalContent').innerHTML = '<p>Sharing question...</p>'
  $.ajax({
    url: 'users/' + email,
    method: 'GET',
    success: (res) => {
      if (res) {
        //Find question by id
        console.log(res._id);
        //Insert the question into the database

      } else { //Could not find user
        document.getElementById('confirmModalContent').innerHTML= '<p>Could not find user.</p>';
      }
    },
    error: () => {
      document.getElementById('confirmModalContent').innerHTML = '<p>Error sharing question.</p>';
    }
  });
  document.getElementById('confirmModalNo').innerHTML= "CLOSE";
}


  



populateQuestionForm = (id) => {
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
        let correctAnswers = res.question.correctAnswers;
        let incorrectAnswers = res.question.incorrectAnswers;
        createAnswers(res.question.type, correctAnswers, incorrectAnswers);
        tinyMCE.get('questionText').setContent(res.question.questionText);
      }  
    },
    error: () => {
      $('#previewModal').modal();
      document.getElementById('previewModalContent').innerHTML = '<p>Error loading question.</p>';
    }
  });
}








  




