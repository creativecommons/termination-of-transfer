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
  input: 'year'
};

// Works from 1989 and earlier usually display a copyright notice...

Questions.s1q1bi2 = {
  question: 'Works from 1989 and earlier usually display a copyright notice. Did the work have a copyright notice?',
  variable: 'copyright_notice',
  input: 'radio',
  values: ['yes', 'no', 'maybe']
};

// Has the work been registered with the United State Copyright Office?

Questions.s1q1c = {
  question: 'Has the work been registered with the United State Copyright Office?',
  variable: 'work_registered',
  input: 'radio'
};

// When was the work registered with the United States Copyright Office?

Questions.s1q1ci = {
  question: 'When was the work registered with the United States Copyright Office?',
  variable: 'reg_year',
  input: 'year'
};

// What is the date of the agreement or transfer? ...

Questions.s1q1d = {
  question: 'What is the date of the agreement or transfer?<br>If the agreement predates the work’s creation, please enter the creation year.',
  variable: 'k_year',
  input: 'year',
  validate: function () {
    return Validation.basicValidDate()
      || ((parseInt($('.text-question').val()) < Values.creation_year)
          ? 'If the agreement predates the work’s creation, please enter the creation year.'
          : false);
  }
};

// Did the agreement or transfer include the right of publication?

Questions.s1q1f =  {
  // Last question in section 1, so set this if we've arrived via back button
  section: 1,
  question: 'Did the agreement or transfer include the right of publication?',
  variable: 'pub_right',
  input: 'radio',
  values: ['yes', 'no', 'maybe'],
  post: function () {
    // Intercept the result so we can add encouragement if things look good
    var result = Rules.section203Analysis();
    if (result.indexOf('Question' != -1)) {
        Notifications.setEncouragement("Both notice window and copyright status look good, let's get some more details!");
    }
  }
};

////////////////////////////////////////////////////////////////////////////////
// Section Two
////////////////////////////////////////////////////////////////////////////////

// Is the agreement or transfer you want to terminate part of a last will...

Questions.s2q2a =  {
  // First question in section 2
  section: 2,
  question: 'Is the agreement or transfer you want to terminate part of a last will and testament?',
  variable: 'last_will',
  input: 'radio'
};

// Was the work created within the scope of the author’s employment?

Questions.s2q2b =  {
  question: "Was the work created within the scope of the author’s employment?",
  variable: 'within_scope_of_employment',
  input: 'radio'
};

// Was there an express agreement between you...

Questions.s2q2bi =  {
  question: 'Was there an express agreement between you, the author or artist, and your, or his or her, employer to not treat the work as a work for hire?',
  variable: 'express_agreement',
  input: 'radio'
};

// Was the work created in response to a special order or commission

Questions.s2q2c =  {
  question: 'Was the work created in response to a special order or commission by some other person or company?',
  variable: 'special_order',
  input: 'radio'
};

// Was there a signed written agreement regarding the special order...

Questions.s2q2ci =  {
  question: 'Was there a signed written agreement regarding the special order or commission which explicitly refers to the work as a &quot;work for hire&quot;?',
  variable: 'signed_written_agreement',
  input: 'radio'
};

// Was the work created for use as one of the following? ...

Questions.s2q2cia = {
  question: 'Was the work created for use as one of the following? — a contribution to a collective work, part of a motion picture or other audiovisual work; a translation; a test; answer material for a test; an atlas; as an instructional text (text and/or graphics)?',
  variable: 'created_as_part_of_motion_picture',
  input: 'radio',
  values: ["yes", "no", "don't know"]
};

// Has the original transfer since been renegotiated or altered?

Questions.s2q2d = {
  question: 'Has the original transfer since been renegotiated or altered?',
  variable: 'renego',
  input: 'radio',
  values: ["yes", "no", "don't know"]
};

// Did one or more of the authors or artists enter into the agreement...

Questions.s2q2e =  {
  question: 'Did one or more of the authors or artists enter into the agreement or transfer?',
  variable: 'authors_entered_agreement',
  input: 'radio'
};

// s2q2ei is part of the rule for s2q2e

// Was the agreement or transfer made by a member of...

Questions.s2q2eii =  {
  // Last question in section 2, so set section if we're going back
  section: 2,
  question: "Was the agreement or transfer made by a member of the author or artist's immediate family, or by the executors?<br><i>For more information about which family members qualify, check out the FAQ.</i>",
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
  variable: 'work_title',
  optional: true
};

// Copyright Registration Number

Questions.s3q3b = {
  question: 'Copyright Registration Number',
  variable: 'work_copyright_reg_num',
  min_length: 1
};

// Tell us about the Agreement or Transfer...
Questions.s3q3c = {
  question: 'Tell us about the Agreement or Transfer [optional]',
  variable: 'work_agreement_type',
  input: 'radio',
  values: ['assignment', 'exclusive license', 'non-exclusive license'],
  optional: true
};

// Description of the Agreement or Transfer...

Questions.s3q3d = {
  question: 'Description of the Agreement or Transfer [optional]',
  variable: 'work_agreement_desc',
  optional: true
};

// Please list all authors or artists of the work

Questions.s3q3e = {
  question: 'Please list all authors or artists of the work',
  variable: 'work_authors',
  min_length: 1
};

////////////////////////////////////////////////////////////////////////////////
// Storing answers
////////////////////////////////////////////////////////////////////////////////

Questions.validateAnswer = function () {
  var result = true;
  var question = Questions[Questions.current_question];
  if (question.validation) {
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
  case 'date':
    answer = parseInt($('.text-question').val());
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
  var warnings = Questions.validateAnswer();
  var result = false;
  if (warnings === true) {
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

Questions.setButtons = function () {
  if (Questions.current_question != Questions.first_question) {
    Widgets.enablePrevious();
    $('#button-question-next').click(next);
  } else {
    $('#button-question-previous').unbind("click");
    Widgets.disablePrevious();
  }
  // We need "next" to get to the result from the final question
  /*if (Questions.current_question != Questions.last_question) {
    Widgets.enableNext();
  } else {
    $('#button-question-next').unbind("click");
    Widgets.disableNext();
  }*/
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
    if (question.pre) {
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
    if (id == 'finish') {
      Questions.finish();
    } else {
      Questions.progress_stack.push(id);
      Questions.transitionQuestion(id);
    }
  }
};

Questions.previousQuestion = function () {
  // Don't pop past the very first item
  if (Questions.progress_stack.length > 1) {
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
  Notifications.displayResultArea();
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
  Questions.transitionQuestion(Questions.first_question);
};
