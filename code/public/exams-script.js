let questionList = [];
let blobQuestionContents = []; //For storing instruction section contents
let blobIncludeList = []; //Corresponds to blobList, true if blob included in submission

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

questionCheckBoxChanged = (checkbox, id) => {
  if (checkbox.checked) {
    questionList.push(id); //Add to list
  } else {
    questionList.splice(questionList.indexOf(id), 1); //Remove from list
  }
}

//Event listener for btnInstructions to create textArea and additional buttons - used when blob is created for first time
document.getElementById("btnInstructions").addEventListener("click", () => {
  createInstructionTextAreaAndButtons();
  //Add corresponding onClick listeners to buttons
  document.getElementById("btnSave").addEventListener("click", () => {
    //Save blob question
    if (!(tinyMCE.get('instructionSectionsTextArea').getContent() === '')) {
      //Get content from textArea
      blobQuestionContents.push(tinyMCE.get('instructionSectionsTextArea').getContent());
      //Automatically include question 
      blobIncludeList.push(true); 
      //Create li item to append to display list
      let instructionItem = createHTMLElement('li', '', ['collection-item']);
      instructionItem.innerHTML =  
      `<div>Instruction Section #` + blobQuestionContents.length + `<a href="#!" class="secondary-content">
          <label><input type="checkbox" onChange="blobCheckBoxChanged(this, ` + (blobQuestionContents.length-1) + `);" checked/><span></span></label></a>  
        <a href="#previewModal" class="secondary-content modal-trigger" onClick="previewBlob(` + (blobQuestionContents.length-1) + `);"><i class="material-icons">zoom_in</i></a> 
        <a href="#" class="secondary-content" onClick="editBlob(` + (blobQuestionContents.length-1) + `);"><i class="material-icons">edit</i></a> 
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

blobCheckBoxChanged = (checkbox, id) => {
  console.log('Before', blobQuestionContents, blobIncludeList);
  if (checkbox.checked) {
    //Add to include list
    blobIncludeList[id] = true;
    console.log('Add', blobQuestionContents, blobIncludeList);
  } else {
    //Remove from include list 
    blobIncludeList[id] = false;
    console.log('Remove', blobQuestionContents, blobIncludeList);
  }
}

//Fetch blob and display in modal
previewBlob = (id) => {
  document.getElementById('previewModalContent').innerHTML = blobQuestionContents[id];
}

//Make changes to existing blob element
editBlob = (id) => {
  createInstructionTextAreaAndButtons(); 
  //Load contents into textArea
  tinyMCE.get('instructionSectionsTextArea').setContent(blobQuestionContents[id]);
  //Add corresponding onClick listeners to buttons
  document.getElementById("btnSave").addEventListener("click", () => {
    let temp = tinyMCE.get('instructionSectionsTextArea').getContent();
    if (!(temp === '')) {
      blobQuestionContents[id] = temp;
    }
    removeInstructionSection();
  }); 
  document.getElementById("btnCancel").addEventListener("click", () => {
    removeInstructionSection();
  }); 
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
  //The following values can be empty:
  document.getElementById('coverPageCheckBox').checked ? exam.coverPage = tinyMCE.get('coverPageTextArea').getContent() : exam.coverPage = null;
  exam.questionList = questionList;
  (blobList.length > 0) ? exam.blobList = blobList : exam.blobList = null; 
  document.getElementById('appendixCheckBox').checked ? exam.appendix = tinyMCE.get('appendixTextArea').getContent() : exam.appendix = null;
  return exam;
}
 

 