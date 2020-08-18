let mcQuestionList = [];
let advQuestionList = [];

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

questionCheckBoxChanged = (checkbox, id, type) => {
  if (type === 'mc') {
    if (checkbox.checked) {
      //Add to mc list
      mcQuestionList.push(id);
    } else {
      //Remove from mc list
      mcQuestionList.splice(mcQuestionList.indexOf(id), 1);
    }
  } else {//type is 'adv'
    if (checkbox.checked) {
      //Add to adv list
      advQuestionList.push(id);
    } else {
      //Remove from adv list
      advQuestionList.splice(mcQuestionList.indexOf(id), 1);
    }
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
  if ((mcQuestionList.length < 1) && (advQuestionList.length < 1)) {
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
  console.log('Generating exam')
  //Get the values from the form
  let exam = fetchFormValues();
  console.log(exam);
  //Post
}

fetchFormValues = () => {
  exam = {};
  exam.name = document.getElementById('name').value;
  exam.paperCount = document.getElementById('paperCount').value;
  //The following values can be empty:
  document.getElementById('coverPageCheckBox').checked ? exam.coverPage = tinyMCE.get('coverPageTextArea').getContent() : exam.coverPage = null;
  exam.mcQuestionList = mcQuestionList;
  exam.advQuestionList = advQuestionList;
  document.getElementById('appendixCheckBox').checked ? exam.appendix = tinyMCE.get('appendixTextArea').getContent() : exam.appendix = null;
  return exam;
}
 

 