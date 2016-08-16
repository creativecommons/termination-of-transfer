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
// Validation of values and of UI state
////////////////////////////////////////////////////////////////////////////////

var Validation = {};

// Naughty. If we're going to monkeypatch we should have a file for these

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

Validation.allowOnlyNumbers = function (element) {
  // http://stackoverflow.com/a/995193
  element.keydown(function (e) {
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
        // Allow: Ctrl+A, Command+A
        (e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) ||
        // Allow: home, end, left, right, down, up
        (e.keyCode >= 35 && e.keyCode <= 40)) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57))
        && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  });
};

// false here means no errors, a string means errors

Validation.validDate = function () {
  var text_field = $('.text-question');
  var date = text_field.val();
  var result = false;
  var errors = [];
  if (! date.match(/[0-9]{4}/)) {
    errors.push("date must be four digits");
  }
  if (parseInt(date) > Values.current_year) {
    errors.push("date must be in the past");
  }
  if (errors.length != 0) {
    result = errors.join().capitalizeFirstLetter() + '.';
  }
  return result;
};
