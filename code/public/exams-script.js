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

$("#examForm").submit((event) => {
  event.preventDefault();
  //If cover page or appendix is checked, there must be some content
  if (document.getElementById('coverPageCheckBox').checked) {
    let coverPageContent = tinyMCE.get('coverPageTextArea').getContent();
    console.log(coverPageContent)
  }
  if (document.getElementById('appendixCheckBox').checked) {
    let appendixContent = tinyMCE.get('appendixTextArea').getContent();
    console.log(appendixContent)
  }
});

 

 