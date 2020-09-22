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
  document.getElementById('confirmModalNo').innerHTML = "NO";
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

//Removes exam from database
deleteExam = (id) => {
  document.getElementById(id).remove();
  $.ajax({
    url: 'exams-my/' + id,
    method: 'delete'
  })
}


editExam = (id) => {
  $.ajax({
    url: 'edit-exam/' + id,
    method: 'GET',
    success: (res) => {
      window.location.href = "exams";
    }
  });
}

templateExam = (id) => {
  $.ajax({
    url: 'template-exam/' + id,
    method: 'GET',
    success: (res) => {
      window.location.href = "exams";
    }
  });
}

//Creates a small form in the current modal, for submitting an email
shareExam = () => {
  let content = `<form onSubmit="return submitShareForm(event)">
                  <div class="input-field">
                    <label for="name">Email</label>
                    <input type="email" id="email" name="email" required>
                  </div> 
                  <button class="btn waves-effect waves-light right" type="submit"> 
                    SHARE<i class="material-icons right">send</i>
                  </button> 
                </form>`;
  document.getElementById('confirmModalNo').innerHTML = "CANCEl";
  document.getElementById('confirmModalYes').classList.add("disabled");
  document.getElementById('confirmModalContent').innerHTML = content;
}

//When the email form is submitted, load the user id, load the question details, and upload a copy of that exam to the new user
submitShareForm = (event) => {
  event.preventDefault();
  let email = event.target.elements.email.value;
  document.getElementById('confirmModalContent').innerHTML = '<p>Sharing exam...</p>'
  $.ajax({
    url: 'users/' + email,
    method: 'GET',
    success: (res) => {
      if (res) {
        let userId = res._id;
        //Find exam by id
        $.ajax({
          url: 'exams-my/' + currentExamID,
          method: 'GET',
          dataType: 'json',
          success: (res) => {
            if (res.exam) {
              let exam = res.exam;
              //Upload new exam
              $.ajax({
                url: 'exams/' + userId,
                method: 'POST',
                data: exam,
                success: (res) => {
                  if (res === 'true') {
                    document.getElementById('confirmModalContent').innerHTML = '<p>Exam shared.</p>';
                  } else if (res === 'false') {
                    document.getElementById('confirmModalContent').innerHTML = '<p>Error sharing exam.</p>';
                  }
                }
              });
            } else {
              document.getElementById('confirmModalContent').innerHTML = '<p>Error fetching exam.</p>';
            }
          }
        });
      } else { //Could not find user
        document.getElementById('confirmModalContent').innerHTML = '<p>Could not find user.</p>';
      }
    },
    error: () => {
      document.getElementById('confirmModalContent').innerHTML = '<p>Error sharing exam.</p>';
    }
  });
  document.getElementById('confirmModalNo').innerHTML = "CLOSE";
  document.getElementById('confirmModalYes').classList.add('modal-close');
}

//Issue if someone shares an exam with you and you want to edit the questions 