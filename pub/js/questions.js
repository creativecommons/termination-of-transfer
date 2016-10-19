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

////////////////////////////////////////////////////////////////////////////////
// Presentation of questions, and main flow of control
// (This is slightly overloaded)
////////////////////////////////////////////////////////////////////////////////

var Questions = {};

////////////////////////////////////////////////////////////////////////////////
// Section One
////////////////////////////////////////////////////////////////////////////////

// When was the work created?

Questions.s1q1a = {
  section: 1,
  question: 'When was the work created?',
  explanation:'The year in which a work was created can affect its copyright status and its treatment under U.S. copyright law. Most importantly, the tool is concerned with whether a worked was made before or after January 1, 1978, when the most recent overhaul of U.S. copyright went into effect.',   
  variable: 'creation_year',
  input: 'year',
  pre: function () {
    Navigation.disablePrevious();
    Notifications.displayAnswersHint();
  },
  post: function () {
    Notifications.removeAnswersHint();
  }
};

// Has the work been published?

Questions.s1q1b = {
  question: 'Has the work been published?',
  explanation:'Whether a work has been published can affect its copyright status and factor into the timing of a termination right. Note that "publication" has a particular meaning in U.S. copyright law, as discussed in our <a href="../glossary.php#publication_date" title="Termination of Transfer: Glossary">glossary</a>.',
  variable: 'work_published',
  input: 'radio',
  pre: function () {
    Navigation.enablePrevious();
  }
};

// When was the work first published?

Questions.s1q1bi = {
  variable: 'pub_year',
  question: 'When was the work first published?',
  explanation:'When a work was published can affect its copyright status and factor into the timing of a termination right. Note that "publication" has a particular meaning in U.S. copyright law, as discussed in our <a href="../glossary.php#publication_date" title="Termination of Transfer: Glossary">glossary</a>.',
  input: 'year',
  validate: function () {
    return Validation.validDate()
      || ((parseInt($('.text-question').val()) < Values.creation_year)
          ? 'The publication date cannot be earlier than the creation date.'
          : false);
  }

};

// Works from 1989 and earlier usually display a copyright notice...

Questions.s1q1bi2 = {
  question: 'Published works from 1989 and earlier usually display a copyright notice. Did the work have a copyright notice?',
  explanation:'For U.S. works published in certain years, U.S. law required that they feature a "copyright notice" in order to receive copyright. Whether or not the published version featured a copyright notice can affect the copyright status of these works.',	
  variable: 'copyright_notice',
  input: 'radio',
  values: ['yes', 'no', 'maybe']
};

// Has the work been registered with the United State Copyright Office?

Questions.s1q1c = {
  question: 'Has the work been registered with the United State Copyright Office?',
  explanation:'Before 1989, registration was one of the ways authors could secure copyright in their work. Whether a work was reigstered can affect copyright status and the timing of termination right.',  
  variable: 'work_registered',
  input: 'radio',
  values: ['yes', 'no'] //, "don't know"] GitHub issue #33
};

// When was the work registered with the United States Copyright Office?

Questions.s1q1ci = {
  question: 'When was the work registered with the United States Copyright Office? (Leave blank if unknown)',
  explanation:'Before 1989, registration was one of the ways authors could secure copyright in their work. When a work was reigstered can affect copyright status and the timing of termination right.',  
  variable: 'reg_year',
  input: 'year',
  optional: true
};

// What is the date of the agreement or transfer? ...

Questions.s1q1d = {
  question: 'What is the date of the agreement or transfer?',
  explanation:'When a transfer took place determines the particular set of termination rules that will be applicable. The timing of a transfer is also needed to in order to know when an author might be able to exercise their termination rights.',
  variable: 'k_year',
  input: 'year',
  validate: function () {
    var errors = Validation.validDate();
    // If the date is before the creation year, use the creation year instead
    if ((errors == false)
        && (parseInt($('.text-question').val()) < Values.creation_year)) {
      $('.text-question').val(Values.creation_year);
    }
    return errors;
  }
};

// Did the agreement or transfer include the right of publication?

Questions.s1q1f =  {
  // Last question in section 1, so set this if we've arrived via back button
  section: 1,
  question: 'Did the agreement or transfer include the right of publication?',
  explanation:'If a <a href="../glossary.php/#agreement" title="Termination of Transfer: Glossary">transfer</a> from 1978 or later includes the right of <a href="../glossary.php#publication_date" title="Termination of Transfer: Glossary">publication</a>, there is a different set of rules for determining when the transfer is eligible for termination.',	
  variable: 'pub_right',
  input: 'radio',
  values: ['yes', 'no', 'maybe']
};

////////////////////////////////////////////////////////////////////////////////
// Section Two
////////////////////////////////////////////////////////////////////////////////

// Is the agreement or transfer you want to terminate part of a last will...

Questions.s2q2a =  {
  // First question in section 2
  section: 2,
  question: 'Is the agreement or transfer you want to terminate part of a <a href="http://labs.creativecommons.org/demos/termination-of-transfer/glossary.php#will" title="Termination of Transfer: Glossary">last will and testament</a>?',	
  variable: 'last_will',
  input: 'radio'
};

// Are any of the authors still alive?

Questions.s2q2bi = {
  question: 'Are <i>any</i> of the <a href="http://labs.creativecommons.org/demos/termination-of-transfer/glossary.php#author" title="Termination of Transfer: Glossary">authors or artists</a> still alive?',
  explanation:'The copyright term for many works is based on the life of the author.',	
  variable: 'any_authors_alive',
  input: 'radio'
};

// What is the year the last surviving author died?

Questions.s2q2bi2 = {
  question: 'What is the year the last surviving <a href="http://labs.creativecommons.org/demos/termination-of-transfer/glossary.php#author" title="Termination of Transfer: Glossary">author or artist</a> died?',
  explanation:'The copyright term for many works is based on the life of the author.',
  variable: 'death',
  input: 'year'
};

// Was the work created within the scope of the author’s employment?

Questions.s2q2c =  {
  question: 'Was the work created within the <a href="http://labs.creativecommons.org/demos/termination-of-transfer/glossary.php#scope_of_employment" title="Termination of Transfer: Glossary">scope of the author’s employment</a>?',	
  variable: 'within_scope_of_employment',
  input: 'radio'
};

// Was there an express agreement between you...

Questions.s2q2ci =  {
  question: 'Was there an express agreement between you, the author or artist, and your, or his or her, employer to not treat the work as a <a href="http://labs.creativecommons.org/demos/termination-of-transfer/glossary.php#work_for_hire" title="Termination of Transfer: Glossary">work for hire</a>?',
  variable: 'express_agreement',
  input: 'radio'
};

// Was the work created in response to a special order or commission

Questions.s2q2d =  {
  question: 'Was the work created in response to a <a href="http://labs.creativecommons.org/demos/termination-of-transfer/glossary.php#work_for_hire" title="Termination of Transfer: Glossary">special order or commission</a> by some other person or company?',
  variable: 'special_order',
  input: 'radio'
};

// Was there a signed written agreement regarding the special order...

Questions.s2q2di =  {
  question: 'Was there a signed written agreement regarding the special order or commission which explicitly refers to the work as a <a href="../glossary.php#work_for_hire" title="Termination of Transfer: Glossary">work for hire</a>?',
  variable: 'signed_written_agreement',
  input: 'radio'
};

// Was the work created for use as one of the following? ...

Questions.s2q2dia = {
  question: 'Was the work created for use as one of the following? — <ul><li>a contribution to a collective work; a part of a motion picture or other audiovisual work;</li> <li>a translation;</li> <li>a <a href="http://labs.creativecommons.org/demos/termination-of-transfer/glossary.php#supplementary_work" title="Termination of Transfer: Glossary">supplementary work</a> (such as a foreword, afterword, table, editorial note, musical arrangement, bibliography, appendix, or index);</li> <li>a <a href="http://labs.creativecommons.org/demos/termination-of-transfer/glossary.php#compilation" title="Termination of Transfer: Glossary">compilation</a>;</li> <li>an <a href="../glossary.php#instructional_text" title="Termination of Transfer: Glossary">instructional text (text and/or graphics)</a>;</li> <li>a test or answer material for a test; or as an atlas?</li></ul?>',
  variable: 'created_as_part_of_motion_picture',
  input: 'radio',
  values: ["yes", "no", "don't know"]
};

// Has the original transfer since been renegotiated or altered?

Questions.s2q2e = {
  question: 'Has the original transfer since been renegotiated or altered?',
  variable: 'renego',
  input: 'radio',
  values: ["yes", "no", "don't know"]
};

// Did one or more of the authors or artists enter into the agreement...

Questions.s2q2f =  {
  question: 'Did one or more of the <a href="http://labs.creativecommons.org/demos/termination-of-transfer/glossary.php#author" title="Termination of Transfer: Glossary">authors or artists</a> enter into the agreement or transfer?',
  variable: 'authors_entered_agreement',
  input: 'radio'
};

// s2q2ei is part of the rule for s2q2e

// Was the agreement or transfer made by a member of...

Questions.s2q2eii =  {
  // Last question in section 2, so set section if we're going back
  section: 2,
  question: 'Was the agreement or transfer made by a member of the <a href="http://labs.creativecommons.org/demos/termination-of-transfer/glossary.php#author" title="Termination of Transfer: Glossary">author or artists\'s</a> immediate family, or by the executors?<br><i>For more information about which family members qualify, check out the FAQ.</i>',
  variable: 'agreement_by_family_or_executor',
  input: 'radio'
};

////////////////////////////////////////////////////////////////////////////////
// Section Three
////////////////////////////////////////////////////////////////////////////////

// Title of Work...

Questions.s3q3a = {
  // First question in section 3
  section: 3,
  question: 'Title of Work [optional]',
  explanation: 'This optional information entry is provided for your records only; we do not monitor or collect it and it does not effect the outcome of the tool',
  variable: 'work_title',
  placeholder: 'Work Title',
  optional: true
};

// Copyright Registration Number

Questions.s3q3b = {
  question: 'Copyright Registration Number [optional]',
  explanation: 'This optional information entry is provided for your records only; we do not monitor or collect it and it does not effect the outcome of the tool',	
  variable: 'work_copyright_reg_num',
  placeholder: 'TX0000124166',
  optional: true
};

// Tell us about the Agreement or Transfer...
Questions.s3q3c = {
  question: 'Tell us about the Agreement or Transfer [optional]',
  explanation: 'This optional information entry is provided for your records only; we do not monitor or collect it and it does not effect the outcome of the tool',	
  variable: 'work_agreement_type',
  input: 'radio',
  values: ['assignment', 'exclusive license', 'non-exclusive license'],
  optional: true
};

// Description of the Agreement or Transfer...

Questions.s3q3d = {
  question: 'Description of the Agreement or Transfer [optional]',
  explanation: 'This optional information entry is provided for your records only; we do not monitor or collect it and it does not effect the outcome of the tool',	
  variable: 'work_agreement_desc',
  placeholder: 'About the agreement',
  optional: true
};

// Please list all authors or artists of the work

Questions.s3q3e = {
  question: 'Please list all authors or artists of the work',
  explanation: 'This optional information entry is provided for your records only; we do not monitor or collect it and it does not effect the outcome of the tool',	
  variable: 'work_authors',
  placeholder: 'A. N. Other',
  min_length: 1
};

////////////////////////////////////////////////////////////////////////////////
// Storing answers
////////////////////////////////////////////////////////////////////////////////

Questions.validateAnswer = function () {
  var result = false;
  var question = Questions[Questions.current_question];
  if (question['validate']) {
    result = question.validate();
  } else if (question.type == 'year') {
    result = Validation.validDate();
  } else if (question.type == 'text') {
    // If the text has a minimum length, check it
    if ($('.text-question').val().length < question.min_chars) {
      result = 'Answer is too short, it must be at least '
        + question.min_chars + 'characters';
    }
  }
  // We don't worry about radio buttons
  return result
};

Questions.getAnswer = function () {
  var question = Questions[Questions.current_question];
  var answer = undefined;
  switch (question.input) {
  case 'radio':
    answer = $(':input[type="radio"]:checked').val();
    break;
  case 'year':
    if ((question.optional != true)
        || ((question.optional == true) && $('.text-question').val() != '')) {
      answer = parseInt($('.text-question').val());
    }
    break;
  case 'year_or_empty':
    if ($('.text-question').val() != '') {
      answer = parseInt($('.text-question').val());
    }
    break;
  case 'text':
    // Fall through to default
  default:
    answer = $('.text-question').val();
    break;
  }
  return answer;
};

Questions.processAnswer = function () {
  var result = false;
  var warnings = Questions.validateAnswer();
  if (warnings === false) {
    var question = Questions[Questions.current_question];
    var answer = Questions.getAnswer();
    Values[question.variable] = answer;
    // FIXME: handle converting radio buttons to correct store values
    //        while recording their label in the answers table
    if (answer) {
      Answers.appendAnswer(question.variable, question.question, answer);
    }
    Notifications.clearAlerts();
    result = true;
  } else {
    Notifications.setAlert(warnings);
  }
  return result;
};

////////////////////////////////////////////////////////////////////////////////
// Flag and result lookup
// These messages are stored in a json file so we can also use them in the PDF
////////////////////////////////////////////////////////////////////////////////

Questions.resultMap = undefined;
// Asynchronous fetch of data that is accessed synchronously.
// This data won't be used until after several questions, so this is tolerable.
$.getJSON("js/results.json",
          function (result) {
            resultMap = result;
          });

Questions.getResultDetails = function (specifier) {
  var path = specifier.split('.');
  var result = resultMap['Conclusion'][path[0]][path[1]];
  return result
};

////////////////////////////////////////////////////////////////////////////////
// Flow of control
////////////////////////////////////////////////////////////////////////////////

Questions.first_question = 's1q1a';
Questions.last_question = 's3q3e';

Questions.progress_stack = [];

Questions.start = function () {
  $('.questionnaire-section, .question-progress-buttons').removeClass('hidden');
  $('.no-javascript-alert').addClass('hidden');
  $('#button-question-back').prop("disabled", true);
  Rendering.transitionTo(Questions.first_question);
};

Questions.transitionQuestion = function (next_question) {
  var previous_question = Questions[Questions.current_question];
  if (previous_question) {
    if(previous_question.post) {
      previous_question.post();
    }
  }
  if (next_question == 'FINISH') {
    Questions.finish();
  } else {
    Questions.current_question = next_question;
    var question = Questions[Questions.current_question];
    if (question['pre']) {
      question.pre();
    }
    Rendering.transitionTo(question);
    // Scroll down to make sure the input UI is visible
    $('html,body').animate({
      scrollTop: $('#button-question-next').offset().top}, 'slow');
  }
};

Questions.nextQuestionID = function () {
  var next_question = Questions.current_question;
  var rule = Rules[Questions.current_question];
  if (typeof rule == 'function') {
    next_question = rule();
  } else {
    next_question = rule;
  }
  return next_question;
};

Questions.nextQuestion = function () {
  // If the answer was OK, move on
  if (Questions.processAnswer()) {
    var id = Questions.nextQuestionID();
    Questions.progress_stack.push(id);
    if (id == 'finish') {
      Questions.finish();
    } else {
      Questions.transitionQuestion(id);
    }
  }
};

Questions.previousQuestion = function () {
  // If we are going back from *after* the last question, re-enable UI
  if (Questions.progress_stack[Questions.progress_stack.length - 1]
      == 'finish') {
    Navigation.unfinishQuestions();
  }
  // Don't pop past the very first item
  if (Questions.progress_stack.length > 0) {
    // Clear current answer
    var current_question = Questions[Questions.current_question];
    delete Values[current_question.variable];
    Answers.removeAnswer(current_question.variable);
    // Go back
    var previous_question =
        Questions.progress_stack[Questions.progress_stack.length - 2];
    Questions.transitionQuestion(previous_question);
    Questions.progress_stack.pop();
    Notifications.clearAlerts();
  }
};

Questions.finish = function () {
  var obj = Questions.getResultDetails(Values.conclusion);
  Values.termination_type = obj.title;
  Notifications.setResultAreaMessage(obj, 'panel-success');
  Navigation.finishQuestions();
  if (Values.conclusion_generate_pdf) {
    PDF.request();
  }
};

Questions.start = function () {
  Values.reset();
  Navigation.showQuestions();
  Navigation.showAnswersTable();
  Navigation.showNextPrevious();
  $('#button-question-next').click(Questions.nextQuestion);
  $('#button-question-back').click(Questions.previousQuestion);
  // When the user presses "return" in a text area, move to next question
  $('#question-rendering-area').on('submit', function () {
    if ($('#button-question-next').is(':enabled')) {
      $('#button-question-next').click();
    }
    return false;
  });
  Questions.transitionQuestion(Questions.first_question);
  Questions.progress_stack.push(Questions.first_question);
};
