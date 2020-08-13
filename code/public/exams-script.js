$(document).ready(() => {
    //Create cover page editor
   tinymce.init({
     selector: '.tinymce-description', 
     height: '30em',
     menubar: '',
     toolbar: 'undo redo | styleselect | bold italic underline strikethrough superscript subscript removeformat | bullist numlist table | ',
     plugins: [ 'lists table' ]
   });
   //Add cover page content
   setTimeout(() => { setCoverPageContent() }, 500); //Give tinyMCE time to load
   ;
 });

 setCoverPageContent = () => {
  let content = 
    `<div>
      <div style="text-align: center;">
        <h1>THE UNIVERSITY OF RIVENDELL</h1>

        <br />
        <hr style="width: 50%; border: none; background-color: black; height: 1px;" />
        <h2>SECOND SEMESTER</h2>
        <h3>Campus:  Hithaeglir</h3>
        <hr style="width: 50%; border: none; background-color: black; height: 1px;" />
        <br />


        <h2>DEPARTMENT OF CONTEMPORARY STUDIES</h2>

        <h2>Local History</h2>

        <h3>(Time Allowed: 40 minutes)</h3>
      </div>
      <br /><br />
      <div id="Notes" style="font-size: 16pt;">
        <p>Note:</p>
        <ul>
            <li>
              Enter your name and student ID on the Teleform sheet.
              You should also enter your name and student ID on
              this question/answer book in the space provided.
            </li>
            <li>
              The version code for this question/answer book is
              <span style="border: 1px solid black; border-radius: 5px; font-weight: bolder;"
                    class="cws_code_q">$VER</span>.
              You MUST ensure that this version code is correctly shown in the Teleform sheet.
              If the version code is incorrect, you may not get marks
              for any of the questions in this assessment.
            </li>
            <li>
              You MUST retain this question/answer book until the marking is
              complete and you have received the mark or grade for this assessment.
            </li>
            <li>
              Each question is expected to have exactly 1 (one)
              correct answer. If you believe that a question has either
              NO or MULTIPLE correct answers, select the ONE
              you believe is most likely to be the intended answer.
            </li>
            <li>
              All questions carry equal marks.
            </li>
            <li>
              This assessment counts for 20% of your final grade.
            </li>
        </ul>
      </div>
      <br />
      <div id="NameId">
        <table style="width: 100%;">
            <tr>
              <td><b>Name</b>:</td>
              <td>......................................</td>
              <td rowspan="2" style="text-align: right;">
                  <span class="cws_code_q" style="text-align: right;">$CODE25</span>
              </td>
            </tr>
            <tr>
              <td><b>ID</b>:</td>
              <td>......................................</td>
            </tr>
        </table>
      </div>
      <p style="page-break-after: always;" />
    </div>`
  console.log(`Setting content`)
  tinyMCE.get('coverPage').setContent(content);
 }