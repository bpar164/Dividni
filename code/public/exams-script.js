let questionList = [];

checkBoxChanged = (checkbox, divName) => {
  if (checkbox.checked) {
    createTextArea(divName);
  } else {
    removeTextArea(divName);
  }
}

//Create the HTML for the TinyMCE editor
createTextArea = (divName) => {
  let newdiv = document.createElement('div');
  newdiv.classList.add('input-field');
  newdiv.classList.add('tinymce-description');
  newdiv.id = divName + "TextArea";
  document.getElementById(divName).appendChild(newdiv);
  loadTextArea();
}

//Initialize TinyMCE editor
loadTextArea = () => {
  tinymce.init({
    selector: '.tinymce-description', 
    height: '30em',
    menubar: '',
    toolbar: 'undo redo | styleselect | bold italic underline strikethrough superscript subscript removeformat | bullist numlist table | ',
    plugins: [ 'lists table' ]
  });
}

//Remove textArea from the div
removeTextArea = (divName) => {
  let divID = divName + "TextArea";
  tinymce.remove('#' + divID);
  document.getElementById(divName).removeChild(document.getElementById(divID));
}

//Fetch question and display in modal
previewQuestion = (id) => {
  document.getElementById('previewModalContent').innerHTML = '<p>Fetching question...</p>';
  $.ajax({
    url: 'multiple-choice-my/' + id,
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

//Creates the HTML content for the preview modal
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

questionCheckBoxChanged = (checkbox, id) => {
  if (checkbox.checked) {
    //Add to list
    questionList.push(id);
  } else {
    //Remove from list
    questionList.splice(questionList.indexOf(id), 1);
  }
}

$("#examForm").submit((event) => {
  event.preventDefault();
  //Display options modal
  $('#optionsModal').modal('open');
  let missingRequired = false;
  //If cover page or appendix is checked, there must be some content
  let content = '<p>Please fix the following issues:<ul>';
  if (document.getElementById('coverPageCheckBox').checked) {
    if (tinyMCE.get('coverPageTextArea').getContent() === '') {
      missingRequired = true;
      content += '<li>Complete cover page, or uncheck the corresponding box.</li>';
    }   
  }
  if (document.getElementById('appendixCheckBox').checked) {
    if (tinyMCE.get('appendixTextArea').getContent() === '') {
      missingRequired = true;
      content += '<li>Complete appendix, or uncheck the corresponding box.</li>';
    }   
  }
  //At least one question must be checked
  if (questionList.length < 1) {
    missingRequired = true;
    content += '<li>Select at least one question.</li>';
  }
  content += '</ul></p>';
  //Generate exam if all requirements are met, otherwise display message
  if (!(missingRequired)) {
    content = '<p>Generating exam...</p>';
    document.getElementById('optionsModalRetry').classList.add("disabled");
    generateExam();
  } else {
    document.getElementById('optionsModalRetry').classList.remove("disabled");
  }
  document.getElementById('optionsModalContent').innerHTML = content;
});

generateExam = () => {
  //Get the values from the form
  let exam = fetchFormValues();
  $.ajax({
    url: 'exams/currentUserID',
    method: 'POST',
    data: exam,
    success: (res) => {
      if (res === 'true') {
        //Exam generated
        document.getElementById('optionsModalContent').innerHTML = '<p>Exam generated.</p>';
      } else if (res === 'false') {
        //Question not generated
        document.getElementById('optionsModalContent').innerHTML = '<p>Error generating exam.</p>';
        document.getElementById('optionsModalRetry').classList.remove("disabled");
      }  
    },
    error: () => {
      document.getElementById('optionsModalContent').innerHTML = '<p>Error generating exam.</p>';
      document.getElementById('optionsModalRetry').classList.remove("disabled");
    }
  });
  document.getElementById('optionsModalCreate').classList.remove("disabled");
  document.getElementById('optionsModalView').classList.remove("disabled");
}

fetchFormValues = () => {
  exam = {};
  exam.name = document.getElementById('name').value;
  exam.paperCount = document.getElementById('paperCount').value;
  //The following values can be empty:
  document.getElementById('coverPageCheckBox').checked ? exam.coverPage = tinyMCE.get('coverPageTextArea').getContent() : exam.coverPage = null;
  exam.questionList = questionList;
  document.getElementById('appendixCheckBox').checked ? exam.appendix = tinyMCE.get('appendixTextArea').getContent() : exam.appendix = null;
  return exam;
}
 

 