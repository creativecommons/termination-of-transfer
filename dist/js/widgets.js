"use strict";

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

var TotAnswers = {};
TotAnswers.resetAnswers = function () {
  jQuery("#answers-table-rows").empty();
};
TotAnswers.appendAnswer = function (myId, label, value) {
  if (!label) {
    label = jQuery("#".concat(myId)).parent().find("label").first().text();
  }
  // If the user has gone back and is changing the answer, first remove it
  TotAnswers.removeAnswer(myId);
  jQuery("#answers-table-rows").append("<tr id=\"answer-row-".concat(myId, "\"><td>").concat(label, "</td><td align=\"right\">").concat(value, "</td></tr>"));
};
TotAnswers.removeAnswer = function (myId) {
  jQuery("#answer-row-".concat(myId)).remove();
};

////////////////////////////////////////////////////////////////////////////////
// Notifications and other notices
////////////////////////////////////////////////////////////////////////////////

var TotNotifications = {};
TotNotifications.clearAlerts = function () {
  jQuery("#alert-area").empty();
};
TotNotifications.setAlert = function (message) {
  TotNotifications.clearAlerts();
  jQuery("#alert-area").append("<div class=\"alert alert-warning\" role=\"alert\">".concat(message, "</div>"));
};
TotNotifications.setEncouragement = function (message) {
  TotNotifications.clearAlerts();
  jQuery("#alert-area").append("<div class=\"alert alert-success\" role=\"alert\">".concat(message, "</div>"));
};
TotNotifications.displayAnswersHint = function () {
  jQuery("#answers-table-rows").append('<tr id="answers-table-row-placeholder"><td>As you respond to the questions we\'ll save the answers here.</td></tr>');
};
TotNotifications.removeAnswersHint = function () {
  jQuery("#answers-table-row-placeholder").remove();
};
TotNotifications.displayResultArea = function () {
  jQuery("#result-area").removeClass("hidden");
};
TotNotifications.hideResultArea = function () {
  jQuery("#result-area").addClass("hidden");
};
TotNotifications.setResultAreaMessage = function (obj, panelClass) {
  jQuery("#result-area").addClass(panelClass);
  jQuery("#result-area-title").html(obj.title);
  jQuery("#result-area-message").html(obj.description);
};

////////////////////////////////////////////////////////////////////////////////
// Navigation of questions
////////////////////////////////////////////////////////////////////////////////

var TotNavigation = {};
var progressStack = [];

// These return true so we can use them as "handlers" in simpleNextQuestion

TotNavigation.disableNext = function () {
  jQuery("#button-question-next").prop("disabled", true);
  return true;
};
TotNavigation.disablePrevious = function () {
  jQuery("#button-question-back").prop("disabled", true);
  return true;
};
TotNavigation.enableNext = function () {
  jQuery("#button-question-next").prop("disabled", false);
  return true;
};
TotNavigation.enablePrevious = function () {
  jQuery("#button-question-back").prop("disabled", false);
  return true;
};
TotNavigation.showNextPrevious = function () {
  jQuery("#question-progress-buttons").removeClass("hidden");
};
TotNavigation.hideQuestions = function () {
  jQuery("#questionnaire-section").addClass("hidden");
  jQuery(".form-group").addClass("hidden");
};
TotNavigation.showQuestions = function () {
  jQuery("#questionnaire-section").removeClass("hidden");
  jQuery(".form-group").removeClass("hidden");
};
TotNavigation.hideNoJSWarning = function () {};
TotNavigation.showAnswersTable = function () {
  jQuery("#answers-table").removeClass("hidden");
};

// After this, do not restart the questionnaire, reload the page to restart

TotNavigation.finishQuestions = function () {
  TotNavigation.hideQuestions();
  TotNotifications.displayResultArea();
  TotNavigation.disableNext();
  jQuery("#button-restart").removeClass("hidden");
};
TotNavigation.unfinishQuestions = function () {
  TotNavigation.showQuestions();
  TotNotifications.hideResultArea();
  jQuery("#button-restart").addClass("hidden");
};
