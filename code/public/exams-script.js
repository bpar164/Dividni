let instructionSections = []; 
let questionList = document.getElementById('questionList');
let sortable = Sortable.create(questionList);

checkBoxChanged = (checkbox, divName) => {
  checkbox.checked ? createTextArea(divName) : removeTextArea(divName);
}

//Create the HTML for the TinyMCE editor
createTextArea = (divName) => {
  let newdiv = createHTMLElement('div', divName + "TextArea", ['input-field', 'tinymce-description']);
  document.getElementById(divName).appendChild(newdiv);
  loadTextArea();
}

//Create an HTML element and add the required classes
createHTMLElement = (element, id, classList) => {
  let newEle = document.createElement(element);
  newEle.id = id;
  for (let i = 0; i < classList.length; i++) {
    newEle.classList.add(classList[i]);
  }
  return newEle;
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
        document.getElementById('previewModalContent').innerHTML = '<p>Could not find question.</p>';
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

liCheckBoxChanged = (id) => {
  $("#" + id).toggleClass('teal lighten-4');
}

//Event listener for btnInstructions to create textArea and additional buttons - used when instruction section is created for first time
document.getElementById("btnInstructions").addEventListener("click", () => {
  createInstructionTextAreaAndButtons();
  //Add corresponding onClick listeners to buttons
  document.getElementById("btnSave").addEventListener("click", () => {
    //Save instruction section (if there is content)
    if (!(tinyMCE.get('instructionSectionsTextArea').getContent() === '')) {
      let sectionId = (instructionSections.push(tinyMCE.get('instructionSectionsTextArea').getContent()) - 1);
      //Create li item to append to display list
      let instructionItem = createHTMLElement('li', 'is' + sectionId, ['collection-item', 'teal', 'lighten-4']);
      instructionItem.setAttribute("name", "Instruction Section #" + (sectionId + 1));
      instructionItem.innerHTML =  
      `<div>Instruction Section #` + (sectionId + 1) + `<a href="#!" class="secondary-content">
          <label><input type="checkbox" onChange="liCheckBoxChanged('is` + sectionId + `');" checked/><span></span></label></a>  
        <a href="#previewModal" class="secondary-content modal-trigger" onClick="previewInstructionSection(` + sectionId + `);"><i class="material-icons">zoom_in</i></a> 
        <a href="#" class="secondary-content" onClick="editInstructionSection(` + sectionId + `);"><i class="material-icons">edit</i></a> 
      </div>`; 
      document.getElementById('questionList').appendChild(instructionItem); 
    }
    removeInstructionSection();
  }); 
  document.getElementById("btnCancel").addEventListener("click", () => {
    removeInstructionSection();
  }); 
});

createInstructionTextAreaAndButtons = () => {
   //If the textArea already exists, remove it 
   if (document.getElementById("instructionSectionsTextArea") !== null) {
    removeInstructionSection();
  }
  createTextArea('instructionSections');
  document.getElementById("btnInstructions").classList.add('disabled');
  //Create save and cancel buttons
  let btnSave = createHTMLElement('a', 'btnSave', ['waves-effect', 'waves-light', 'btn-small']);
  btnSave.innerHTML = 'Save';
  let btnCancel = createHTMLElement('a', 'btnCancel', ['waves-effect', 'waves-light', 'btn-small', 'right']);
  btnCancel.innerHTML = 'Cancel';
  //Add buttons to display 
  document.getElementById('instructionSections').appendChild(btnSave);
  document.getElementById('instructionSections').appendChild(btnCancel);
}

//Remove the textArea and buttons
removeInstructionSection = () => {
  removeTextArea('instructionSections');
  document.getElementById('instructionSections').removeChild(btnSave);
  document.getElementById('instructionSections').removeChild(btnCancel);
  document.getElementById("btnInstructions").classList.remove('disabled');
}

//Fetch instruction section and display in modal
previewInstructionSection = (id) => {
  document.getElementById('previewModalContent').innerHTML = instructionSections[id];
}

//Make changes to existing instruction section element
editInstructionSection = (id) => {
  createInstructionTextAreaAndButtons(); 
  //Load contents into textArea
  tinyMCE.get('instructionSectionsTextArea').setContent(instructionSections[id]);
  //Add corresponding onClick listeners to buttons
  document.getElementById("btnSave").addEventListener("click", () => {
    let temp = tinyMCE.get('instructionSectionsTextArea').getContent();
    if (!(temp === '')) {
      instructionSections[id] = temp;
    }
    removeInstructionSection();
  }); 
  document.getElementById("btnCancel").addEventListener("click", () => {
    removeInstructionSection();
  }); 
}

//Preview exam and display in modal
previewExam = () => {
  document.getElementById('generate').classList.remove('disabled');
  document.getElementById('previewModalContent').innerHTML = generateExamPreviewContent();
}

//Creates the HTML content for the preview modal
generateExamPreviewContent = () => {
  //Clear the content
  content = '';
  //Build the content using the values with formatting 
  content += '<b>Name: </b>' + document.getElementById('name').value + '</br>';
  content += '</br><b>Paper Count: </b>' + document.getElementById('paperCount').value + '</br>';
  document.getElementById('coverPageCheckBox').checked ?
    content += '</br><b>Cover Page:</b></br>' + tinyMCE.get('coverPageTextArea').getContent() + '</br>' : null; 
  let selectedQuestionIds =  fetchAllSelectedQuestionIds(); 
  let selectedQuestionNames = fetchAllSelectedQuestionNames(selectedQuestionIds);
  content += '</br><b>Questions:</b><ol>';
  selectedQuestionNames.forEach(qName => {
    content += '<li>' + qName + '</li>';
  });
  content += '</ol>'; 
  document.getElementById('appendixCheckBox').checked ?
    content += '</br><b>Appendix:</b></br>' + tinyMCE.get('appendixTextArea').getContent() + '</br>' : null; 
  return content;
}

fetchAllSelectedQuestionIds = () => {
  let selectedQuestions = document.querySelectorAll('#questions>ul>li.teal'); 
  let selectedQuestionIds = [];
  for (let i = 0; i < selectedQuestions.length; i++) {
    selectedQuestionIds.push(selectedQuestions[i].id);
  }
  return selectedQuestionIds;
}

fetchAllSelectedQuestionNames = (selectedQuestionIds) => {
  let selectedQuestionNames = [];
  for (let i = 0; i < selectedQuestionIds.length; i++) {
    selectedQuestionNames.push(document.getElementById(selectedQuestionIds[i]).getAttribute('name'));
  }
  return selectedQuestionNames;
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
  let selectedQuestionIds = fetchAllSelectedQuestionIds();
  let questionFound = false;
  selectedQuestionIds.forEach(qId => {
    if (qId.length === 24) { //All questions have ids of length 24 
      questionFound = true;
    } 
  });
  if (!(questionFound)) {
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
        //Exam not generated
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
  exam.questionList = createExamQuestionList();
  //The following values can be empty:
  document.getElementById('coverPageCheckBox').checked ? exam.coverPage = tinyMCE.get('coverPageTextArea').getContent() : exam.coverPage = null;
  document.getElementById('appendixCheckBox').checked ? exam.appendix = tinyMCE.get('appendixTextArea').getContent() : exam.appendix = null;
  return exam;
}

createExamQuestionList = () => {
  let selectedQuestionIds = fetchAllSelectedQuestionIds();
  let questionList = [];
  let instructionSectionsIndex = 0;
  for (let i = 0; i < selectedQuestionIds.length; i++) {
    let tempQuestion = {};
    if (selectedQuestionIds[i].length === 24) { //All questions have ids of length 24 
      tempQuestion.type = 'mc';
      tempQuestion.id = selectedQuestionIds[i];
      tempQuestion.contents = null;
    } else {
      tempQuestion.type = 'is';
      tempQuestion.id = selectedQuestionIds[i];
      tempQuestion.contents = instructionSections[instructionSectionsIndex];
      instructionSectionsIndex++;
    }
    questionList.push(tempQuestion);
  }
  return questionList;
}

 

 