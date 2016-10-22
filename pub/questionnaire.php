<?php
/*
    Termination of Transfer - tool to help in returning authors rights.
    Copyright (C) 2016  Creative Commons Corporation.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

$page = 'Questionnaire';
include_once __DIR__ . '/../include/header.php';
?>

       <h2>Returning Author's Rights: The Termination of Transfer Tool [BETA]</h2>

       <div class="panel panel-default">
         <div class="panel-body">
          <p><small>This website and Termination of Transfer Tool are currently in public beta, and are provided to the public solely for the purposes of testing for receiving feedback on functionality and substantive accuracy. All information and functionality is subject to change, and may not be accurate.</p>

             <p>Please note that the content provided on this website and the Termination of Transfer Tool itself are intended solely for educational purposes and do not constitute legal advice. Termination of transfers is a complex area specific to United States law requiring the analysis of many factors. As a result, nothing on this website can be expected to accurately predict whether any given person has a right to terminate a copyright assignment. Only a licensed attorney can properly evaluate the circumstances specific to each copyrighted work and determine whether a transfer of copyright is terminable. If you believe that you may have a right to terminate a transfer of copyright, you should consult an attorney. Neither Authors Alliance nor Creative Commons provide legal advice, and your use of this website and of the Termination of Transfer Tool does not create an attorney-client relationship. In addition, please note that the information on this website might not be current—please see below of the date of our last review.</p>

           Date last reviewed: October 18, 2016</small></p>
         </div>
       </div>

       <div class="alert alert-danger" role="alert"
            id="no-javascript-alert"><strong>We're sorry!</strong> You&apos;ll need JavaScript enabled to use this tool.</div>
       <script>
         // Hide this quickly if JS is supported
         document.getElementById('no-javascript-alert').className += ' hidden';
       </script>

       <div class="panel panel-info hidden" id="answers-table">
         <div class="panel-heading">
           <h3 class="panel-title">Your answers</h3>
         </div>
         <div class="panel-body">
           <table class="table table-striped">
             <tbody id="answers-table-rows">
             </tbody>
           </table>
         </div>
       </div>

       <div class="panel panel-primary hidden" id="questionnaire-section">
        <div class="panel-heading">
          <h3 class="panel-title" id="section-title"></h3>
        </div>
        <div class="panel-body" id="question-rendering-area">
        </div>
       </div>

      <div id="alert-area">
      </div>

      <div class="panel hidden" id="result-area">
        <div class="panel-heading">
          <h3 class="panel-title" id="result-area-title"></h3>
        </div>
        <div class="panel-body" id="result-area-message">
        </div>
      </div>

      <div class="hidden" id="question-progress-buttons">
        <button class="btn btn-default" id="button-question-back">Back</button>
        <button class="btn btn-default" id="button-question-next">Next</button>
        <a href="questionnaire.php"
           class="btn btn-default hidden"
           id="button-restart">Restart</a>
      </div>

      <div>&nbsp;</div>

<?php
$footer_extra='<script src="js/values.js"></script>
    <script src="js/rules.js"></script>
    <script src="js/validation.js"></script>
    <script src="js/widgets.js"></script>
    <script src="js/rendering.js"></script>
    <script src="js/pdf.js"></script>
    <script src="js/questions.js"></script>
    <script>
      Questions.start();
    </script>';
include_once __DIR__ . '/../include/footer.php';
?>
