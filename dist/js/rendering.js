"use strict";

var _this = void 0;
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
// Rendering UI elements for input
////////////////////////////////////////////////////////////////////////////////

var TotRendering = {
  currentSection: 0,
  sections: ["", "First tell us a few things about the work", "Now, let’s find out whether the work is eligible for termination", "Information about the work"],
  questionTemplate: "\n    <form class=\"question-form\">\n      <div class=\"form-group\">\n        <label class=\"question-label\"></label>\n        <br>\n        <p class=\"help-block\"></p> \n      </div>\n    </form>",
  createQuestion: function createQuestion() {
    return jQuery(TotRendering.questionTemplate);
  },
  common: function common(config) {
    var question = TotRendering.createQuestion();
    // If this is a question in a different section, change the section header
    // Section is 1-based, so we can use a simple logical and here.
    if (config.section && config.section != TotRendering.currentSection) {
      jQuery("#section-title").html(TotRendering.sections[config.section]).fadeIn();
    }
    question.find(".question-label").html(config.question);
    if (config.explanation) {
      question.find(".help-block").html(config.explanation);
    }
    question.css("display", "none");
    // If we're entering this value for the first time (not via the back button)
    // and this isn't an optional value
    // don't let the user continue until they enter a value here.
    if (TotValues[config.variable] === undefined && !config.optional) {
      TotNavigation.disableNext();
    } else {
      TotNavigation.enableNext();
    }
    return question;
  },
  radio: function radio(config) {
    // Multiple choice questions (radio buttons)
    var question = TotRendering.common(config);
    var form_group = question.find(".form-group");
    var name = "input_".concat(config.variable);
    // If we are returning to this via the back button, get the previous value
    var existing_value = TotValues[config.variable];
    var radio_button_values = config.values || ["yes", "no"];
    radio_button_values.forEach(function (value) {
      var radio_button = "<label class=\"radio-inline\"><input type=\"radio\" name=\"".concat(name, "\" value=\"").concat(value, "\">").concat(value, "</label>");
      if (value == existing_value) {
        radio_button = "<label class=\"radio-inline\"><input type=\"radio\" name=\"".concat(name, "\" checked=\"checked\" value=\"").concat(value, "\">").concat(value, "</label>");
      }
      form_group.append(jQuery(radio_button));
    });
    // When the user makes a choice, go straight to the next question
    form_group.find(':input[type="radio"]').on("click", function () {
      TotNavigation.enableNext();
      jQuery("#button-question-next").click();
    });
    return question;
  },
  makeTextLengthHandler: function makeTextLengthHandler(element, min_length, optional) {
    // text input validator handler
    return function () {
      var length = element.val().length;
      if (optional && length == 0 || length >= min_length) {
        TotNavigation.enableNext();
      } else {
        TotNavigation.disableNext();
      }
    };
  },
  text: function text(config) {
    // Text input
    var question = TotRendering.common(config);
    var form_group = question.find(".form-group");
    // const name = "input-" + config.variable;
    var text_field = jQuery("<input type=\"text\" class=\"form-control text-question\" id=\"".concat(config.variable, "\" placeholder=\"").concat(config.placeholder || "", "\" >"));
    form_group.append(text_field);
    // Set the label
    // const label = question.find(".question-label").prop("for", name);
    if (TotValues[config.variable]) {
      form_group.find("text-question").val(TotValues[config.variable]);
    }
    var existing_value = TotValues[config.variable];
    // Ensure next isn't enabled until enough characters are entered
    var min_length = config.min_length || 4;
    var text_field_element = question.find(".text-question");
    var validator = TotRendering.makeTextLengthHandler(text_field_element, min_length, config.optional);
    text_field_element.on("keyup", validator);
    text_field_element.on("change", validator);
    // If we are returning to the field and the value has already been set, use it
    if (existing_value !== undefined) {
      text_field.val(TotValues[config.variable]);
    }
    return question;
  },
  year: function year(config) {
    // Year input (text subtype)
    var question = TotRendering.text(config);
    var text_field = question.find(".text-question");
    TotValidation.allowOnlyNumbers(text_field);
    text_field.prop("maxlength", 4);
    text_field.prop("placeholder", "1977");
    return question;
  },
  render: function render(config) {
    // Render html UI from config specification
    var result = undefined;
    switch (config.input) {
      case "radio":
        result = TotRendering.radio(config);
        break;
      case "year":
        result = TotRendering.year(config);
        break;
      case "text":
      // Fall through to default
      default:
        result = TotRendering.text(config);
        break;
    }
    return result;
  },
  transitionTo: function transitionTo(config) {
    var question = TotRendering.render(config);
    jQuery(".question-form").slideUp("fast", function () {
      jQuery(_this).remove();
    });
    jQuery("#question-rendering-area").append(question);
    question.slideDown("fast");
  }
};