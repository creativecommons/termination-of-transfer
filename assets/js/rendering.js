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

var Rendering = {};

////////////////////////////////////////////////////////////////////////////////
// Sections
////////////////////////////////////////////////////////////////////////////////

Rendering.sections = [
  '',
  'First tell us a few things about the work',
  'Now, let’s find out whether the work is eligible for termination',
  'Information about the work'
];

Rendering.currentSection = 0;

////////////////////////////////////////////////////////////////////////////////
// Template basics
////////////////////////////////////////////////////////////////////////////////

Rendering.questionTemplate = '\
<form class="question-form">\
  <div class="form-group">\
    <label class="question-label"></label><br>\
    <p class="help-block"></p> \
  </div>\
</form>';

Rendering.createQuestion = () =>  {
  return jQuery(Rendering.questionTemplate);
};

Rendering.common = (config) => {
  var question = Rendering.createQuestion();
  // If this is a question in a different section, change the section header
  // Section is 1-based, so we can use a simple logical and here.
  if (config.section
      && (config.section != Rendering.currentSection)) {
    jQuery('#section-title').html(Rendering.sections[config.section]).fadeIn();
  }
  question.find('.question-label').html(config.question);
  if (config.explanation) {
    question.find('.help-block').html(config.explanation);
  }
  question.css("display", "none");
  // If we're entering this value for the first time (not via the back button)
  // and this isn't an optional value
  // don't let the user continue until they enter a value here.
  if((Values[config.variable] === undefined)
     && (! config.optional)) {
    Navigation.disableNext();
  } else {
    Navigation.enableNext();
  }
  return question;
};

////////////////////////////////////////////////////////////////////////////////
// Multiple choice questions (radio buttons)
////////////////////////////////////////////////////////////////////////////////

Rendering.radio = (config) => {
  var question = Rendering.common(config);
  var form_group = question.find('.form-group');
  var name = 'input-' + config.variable;
  // If we are returning to this via the back button, get the previous value
  var existing_value = Values[config.variable];
  var radio_button_values = config.values || ['yes', 'no'];
  radio_button_values.forEach( (value) => {
    var radio_button = '<label class="radio-inline"><input type="radio" name=' + name + '" value="' + value  +'"';
    if (value == existing_value) {
      radio_button += ' checked="checked"';
    }
    radio_button += '>' + value +'</label>';
    form_group.append(jQuery(radio_button));
  });
  // When the user makes a choice, go straight to the next question
  form_group.find(':input[type="radio"]').click(() =>  {
    Navigation.enableNext();
    jQuery('#button-question-next').click();
  });
  return question;
};

////////////////////////////////////////////////////////////////////////////////
// Text input
////////////////////////////////////////////////////////////////////////////////

Rendering.makeTextLengthHandler = (element, min_length, optional) => {
  return () =>  {
    var length = element.val().length;
    if ((optional && (length == 0))
        || (length >= min_length)) {
      Navigation.enableNext();
    } else {
      Navigation.disableNext();
    }
  };
};

Rendering.text = (config) => {
  var question = Rendering.common(config);
  var form_group = question.find('.form-group');
  var name = 'input-' + config.variable;
  var text_field = jQuery('<input type="text" class="form-control text-question" id="'
                     + config.variable +
                     '" placeholder="'
                     + (config.placeholder || '')
                     + '">');
  form_group.append(text_field);
  // Set the label
  var label = question.find('.question-label').prop('for', name);
  if (Values[config.variable]) {
    form_group.find('text-question').val(Values[config.variable]);
  }
  var existing_value = Values[config.variable];
  // Ensure next isn't enabled until enough characters are entered
  var min_length = config.min_length || 4;
  var text_field_element = question.find('.text-question');
  var validator = Rendering.makeTextLengthHandler(text_field_element,
                                                  min_length,
                                                  config.optional);
  text_field_element.on('keyup', validator);
  text_field_element.on('change', validator);
  // If we are returning to the field and the value has already been set, use it
  if (existing_value !== undefined) {
    text_field.val(Values[config.variable]);
  }
  return question;
};

////////////////////////////////////////////////////////////////////////////////
// Year input (text subtype)
////////////////////////////////////////////////////////////////////////////////

Rendering.year = (config) => {
  var question = Rendering.text(config);
  var text_field = question.find('.text-question');
  Validation.allowOnlyNumbers(text_field);
  text_field.prop('maxlength', 4);
  text_field.prop('placeholder', '1977');
  return question;
};

////////////////////////////////////////////////////////////////////////////////
// Render html UI from config specification
////////////////////////////////////////////////////////////////////////////////

Rendering.render = (config) => {
  var result = undefined;
  switch (config.input)  {
  case 'radio':
    result = Rendering.radio(config);
    break;
  case 'year':
    result = Rendering.year(config);
    break;
  case 'text':
    // Fall through to default
  default:
    result = Rendering.text(config);
    break;
  }
  return result;
};

Rendering.transitionTo = (config) => {
  var question = Rendering.render(config);
  jQuery('.question-form').slideUp("fast",
                              () =>  {
                                jQuery(this).remove();
                              });
  jQuery('#question-rendering-area').append(question);
  question.slideDown("fast");
};
