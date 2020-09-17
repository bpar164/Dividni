let currentExamID;
let currentExamName;

//Used when an exam in the list is clicked-on 
setCurrentExam = (id, name) => {
    currentExamID = id;
    currentExamName = name;
  }
  
  //Creates a confirmation modal
  confirmDialog = (action) => {
    //Reset buttons
    document.getElementById('confirmModalNo').innerHTML= "NO";
    document.getElementById('confirmModalYes').classList.remove("disabled");
    //Build the display string and set the correct onClick function for the yes button
    let content = '<p>';
    if (action === 'DELETE') {
      content += 'Delete exam:</br><b>' + currentExamName + '</b>';
      document.getElementById('confirmModalYes').setAttribute('onClick', `deleteExam('` + currentExamID + `');`);
    } else if (action === 'EDIT') {
      content += 'Edit exam:</br><b>' + currentExamName + '</b>';
      document.getElementById('confirmModalYes').setAttribute('onClick', `editExam('` + currentExamID + `');`);
    } else if (action === 'TEMPLATE') {
      content += 'Use the following exam as a template:</br><b>' + currentExamName + '</b>';
      document.getElementById('confirmModalYes').setAttribute('onClick', `templateExam('` + currentExamID + `');`);
    } else if (action === 'SHARE') {
      content += 'Share the following exam with a different user:</br><b>' + currentExamName + '</b>';
      document.getElementById('confirmModalYes').classList.remove('modal-close');
      document.getElementById('confirmModalYes').setAttribute('onClick', `shareExam('` + currentExamID + `');`);
    }
    content += '</p>'
    //Set the contents of the modal
    document.getElementById('confirmModalContent').innerHTML = content;
  }
  
  //Fetches exam from database and displays it
  previewExam = () => {
    document.getElementById('previewModalContent').innerHTML = '<p>Fetching exam...</p>';
    $.ajax({
      url: 'exams-my/' + currentExamID,
      method: 'GET',
      dataType: 'json',
      success: (res) => {
        if (res.exam) {
          //Call a function to generate the HTML content
          content = generateExamPreviewContent(res.exam);
          //Add the content to the display
          document.getElementById('previewModalContent').innerHTML = content;
        } else {
          document.getElementById('previewModalContent').innerHTML = '<p>Error fetching exam.</p>';
        }  
      },
      error: () => {
        document.getElementById('previewModalContent').innerHTML = '<p>Error fetching exam.</p>';
      }
    });
  }

  //Creates the HTML content for the preview modal
generateExamPreviewContent = (exam) => {
    //Clear the content
    content = '';
    //Build the content using the values with formatting 
    content += '<b>Name: </b>' + exam.name + '</br>';
    content += '</br><b>Paper Count: </b>' + exam.paperCount + '</br>';
    exam.coverPage !== "" ?
      content += '</br><b>Cover Page:</b></br>' + exam.coverPage + '</br>' : null; 
    content += '</br><b>Questions:</b><ol>';
    exam.questionList.forEach(question => {
      content += '<li>' + question.name + '</li>';
    });
    content += '</ol>'; 
    exam.appendix !== "" ?
      content += '</br><b>Appendix:</b></br>' + exam.appendix + '</br>' : null;  
    content += '</br><b>Exam type: </b>' + exam.examType + '</br>';
    return content;
  }
  
  deleteExam = (id) => {
    console.log('Delete', id);
  }
  
  editExam = (id) => {
    console.log('Edit', id);
  }
  
  templateExam = (id) => {
    console.log('Template', id);
  }
  
  shareExam = (id) => {
    console.log('Share', id);
  }