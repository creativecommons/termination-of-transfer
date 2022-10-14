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
// Control of the html UI
////////////////////////////////////////////////////////////////////////////////

//var Widgets = {};

////////////////////////////////////////////////////////////////////////////////
// Visual display of the user's responses
////////////////////////////////////////////////////////////////////////////////

const Answers = {};

Answers.resetAnswers = function () {
  jQuery('#answers-table-rows').empty();
};

Answers.appendAnswer = function (myId, label, value) {
  if (! label) {
    label = jQuery('#' + myId + '> label').first().text();
  }
  // If the user has gone back and is changing the answer, first remove it
  Answers.removeAnswer(myId);
  jQuery('#answers-table-rows').append('<tr id="answer-row-' + myId + '"><td>'
				       + label + '</td><td align="right">'
				       + value  + '</td></tr>');
};

Answers.removeAnswer = function (myId) {
  jQuery('#answer-row-' + myId).remove();
};

////////////////////////////////////////////////////////////////////////////////
// Notifications and other notices
////////////////////////////////////////////////////////////////////////////////

var Notifications = {};

Notifications.clearAlerts = function () {
  jQuery('#alert-area').empty();
};

Notifications.setAlert = function (message) {
  Notifications.clearAlerts();
  jQuery('#alert-area').append('<div class="alert alert-warning" role="alert">'
                               + message
                               + '</div>');
};

Notifications.setEncouragement = function (message) {
  Notifications.clearAlerts();
  jQuery('#alert-area').append('<div class="alert alert-success" role="alert">'
                               + message
                               + '</div>');
};

Notifications.displayAnswersHint = function () {
  jQuery('#answers-table-rows').append('<tr id="answers-table-row-placeholder"><td>As you respond to the questions we\'ll save the answers here.</td></tr>');
};

Notifications.removeAnswersHint = function () {
  jQuery('#answers-table-row-placeholder').remove();
};

Notifications.displayResultArea = function () {
  jQuery('#result-area').removeClass('hidden');
};

Notifications.hideResultArea = function () {
  jQuery('#result-area').addClass('hidden');
};

Notifications.setResultAreaMessage = function (obj, panelClass) {
  jQuery('#result-area').addClass(panelClass);
  jQuery('#result-area-title').html(obj.title);
  jQuery('#result-area-message').html(obj.description);
};

////////////////////////////////////////////////////////////////////////////////
// Navigation of questions
////////////////////////////////////////////////////////////////////////////////

var Navigation = {};

Navigation.progressStack = [];

// These return true so we can use them as "handlers" in simpleNextQuestion

Navigation.disableNext = function () {
  jQuery('#button-question-next').prop("disabled", true);
  return true;
};

Navigation.disablePrevious = function () {
  jQuery('#button-question-back').prop("disabled", true);
  return true;
};

Navigation.enableNext = function () {
  jQuery('#button-question-next').prop("disabled", false);
  return true;
};

Navigation.enablePrevious = function () {
  jQuery('#button-question-back').prop("disabled", false);
  return true;
};

Navigation.showNextPrevious = function () {
  jQuery("#question-progress-buttons").removeClass('hidden');
};

Navigation.hideQuestions = function () {
  jQuery('#questionnaire-section').addClass('hidden');
  jQuery('.form-group').addClass('hidden');
};

Navigation.showQuestions = function () {
  jQuery('#questionnaire-section').removeClass('hidden');
  jQuery('.form-group').removeClass('hidden');
};

Navigation.hideNoJSWarning = function () {
};

Navigation.showAnswersTable = function () {
  jQuery("#answers-table").removeClass('hidden');
};

// After this, do not restart the questionnaire, reload the page to restart

Navigation.finishQuestions = function () {
  Navigation.hideQuestions();
  Notifications.displayResultArea();
  Navigation.disableNext();
  jQuery("#button-restart").removeClass('hidden');
};

Navigation.unfinishQuestions = function () {
  Navigation.showQuestions();
  Notifications.hideResultArea();
  jQuery("#button-restart").addClass('hidden');
};
