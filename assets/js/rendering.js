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

const TotRendering = {};

////////////////////////////////////////////////////////////////////////////////
// Sections
////////////////////////////////////////////////////////////////////////////////

TotRendering.sections = [
  "",
  "First tell us a few things about the work",
  "Now, let’s find out whether the work is eligible for termination",
  "Information about the work",
];

TotRendering.currentSection = 0;

////////////////////////////////////////////////////////////////////////////////
// Template basics
////////////////////////////////////////////////////////////////////////////////

TotRendering.questionTemplate =
  '\
<form class="question-form">\
  <div class="form-group">\
    <label class="question-label"></label><br>\
    <p class="help-block"></p> \
  </div>\
</form>';

TotRendering.createQuestion = () => {
  return jQuery(TotRendering.questionTemplate);
};

TotRendering.common = (config) => {
  let question = TotRendering.createQuestion();
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
    Navigation.disableNext();
  } else {
    Navigation.enableNext();
  }
  return question;
};

////////////////////////////////////////////////////////////////////////////////
// Multiple choice questions (radio buttons)
////////////////////////////////////////////////////////////////////////////////

TotRendering.radio = (config) => {
  let question = TotRendering.common(config);
  let form_group = question.find(".form-group");
  let name = `input ${config.variable}`;
  // If we are returning to this via the back button, get the previous value
  let existing_value = TotValues[config.variable];
  let radio_button_values = config.values || ["yes", "no"];
  radio_button_values.forEach((value) => {
    let radio_button = `<label class="radio-inline"><input type="radio" name=${name} value="${value}">${value}</label>`
    if (value == existing_value) {
      radio_button = `<label class="radio-inline"><input type="radio" name=${name} checked="checked" value="${value}">${value}</label>`
    }

    form_group.append(jQuery(radio_button));
  });
  // When the user makes a choice, go straight to the next question
  form_group.find(':input[type="radio"]').click(() => {
    Navigation.enableNext();
    jQuery("#button-question-next").click();
  });
  return question;
};

////////////////////////////////////////////////////////////////////////////////
// Text input
////////////////////////////////////////////////////////////////////////////////

TotRendering.makeTextLengthHandler = (element, min_length, optional) => {
  return () => {
    let length = element.val().length;
    if ((optional && length == 0) || length >= min_length) {
      Navigation.enableNext();
    } else {
      Navigation.disableNext();
    }
  };
};

TotRendering.text = (config) => {
  let question = TotRendering.common(config);
  let form_group = question.find(".form-group");
  let name = "input-" + config.variable;
  let text_field = jQuery(`<input type="text" class="form-control text-question" id="${config.variable}" placeholder="${config.placeholder || ""}" >`
  );
  form_group.append(text_field);
  // Set the label
  let label = question.find(".question-label").prop("for", name);
  if (TotValues[config.variable]) {
    form_group.find("text-question").val(TotValues[config.variable]);
  }
  let existing_value = TotValues[config.variable];
  // Ensure next isn't enabled until enough characters are entered
  let min_length = config.min_length || 4;
  let text_field_element = question.find(".text-question");
  let validator = TotRendering.makeTextLengthHandler(
    text_field_element,
    min_length,
    config.optional
  );
  text_field_element.on("keyup", validator);
  text_field_element.on("change", validator);
  // If we are returning to the field and the value has already been set, use it
  if (existing_value !== undefined) {
    text_field.val(TotValues[config.variable]);
  }
  return question;
};

////////////////////////////////////////////////////////////////////////////////
// Year input (text subtype)
////////////////////////////////////////////////////////////////////////////////

TotRendering.year = (config) => {
  let question = TotRendering.text(config);
  let text_field = question.find(".text-question");
  TotValidation.allowOnlyNumbers(text_field);
  text_field.prop("maxlength", 4);
  text_field.prop("placeholder", "1977");
  return question;
};

////////////////////////////////////////////////////////////////////////////////
// Render html UI from config specification
////////////////////////////////////////////////////////////////////////////////

TotRendering.render = (config) => {
  let result = undefined;
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
};

TotRendering.transitionTo = (config) => {
  let question = TotRendering.render(config);
  jQuery(".question-form").slideUp("fast", () => {
    jQuery(this).remove();
  });
  jQuery("#question-rendering-area").append(question);
  question.slideDown("fast");
};
