let mcQuestionList = [];

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
      console.log(mcQuestionList.length);
    } else {
      //Remove from mc list
      mcQuestionList.splice(mcQuestionList.indexOf(id), 1);
      console.log(mcQuestionList.length);
    }
  } else {//type is 'adv'
    if (checkbox.checked) {
      //Add to adv list
      
    } else {
      //Remove from adv list
      
    }
  }
}

$("#examForm").submit((event) => {
  event.preventDefault();
  //Display options modal
  $('#optionsModal').modal('open');
  //If cover page or appendix is checked, there must be some content
  let content = '<p>Please complete the following sections, or uncheck the corresponding box:<ul>';
  if (document.getElementById('coverPageCheckBox').checked) {
    if (tinyMCE.get('coverPageTextArea').getContent() === '') {
      content += '<li>Cover Page</li>';
    }   
  }
  if (document.getElementById('appendixCheckBox').checked) {
    if (tinyMCE.get('appendixTextArea').getContent() === '') {
      content += '<li>Appendix</li>';
    }   
  }
  content += '</ul></p>';
  document.getElementById('optionsModalContent').innerHTML = content;
  document.getElementById('optionsModalRetry').classList.remove("disabled");

  //Check at least one question 

  //Generate exam - re-add class list of disabled, change content
});

 

 