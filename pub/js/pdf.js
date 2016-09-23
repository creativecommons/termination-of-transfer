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
// PDF Generation
// (browser-side data preparation and call to server)
////////////////////////////////////////////////////////////////////////////////

var PDF = {};

PDF.url = 'result-pdf.php';

PDF.appendWindowDetails = function (details) {
  var noticeWindow = Rules.noticeWindow();
  if (noticeWindow) {
    details.push({key: "Notice Window Beginning",
                  value: noticeWindow.beginning});
    details.push({key: "Notice Window Ending",
                  value: noticeWindow.ending});
  }
  var termWindow = Rules.terminationWindow();
  if (termWindow) {
    details.push({key: "Termination Window Beginning",
                  value: termWindow.beginning});
    details.push({key: "Termination Window Ending",
                  value: termWindow.ending});
  }
  return details;
};

PDF.details = function () {
  var details = [];
  Object.getOwnPropertyNames(varsToTitles).forEach(function (key) {
    if (Values[key] ) {
      var mapping = {key: varsToTitles[key],
                     value: Values[key]};
      details.push(mapping);
    }
  });
  return PDF.appendWindowDetails(details);
};

PDF.request = function () {
  var data = {report_timestamp: Values.current_date.getTime()/1000,
              flags: Values.flags.sort(), // Sorts inline & returns, so OK here
              conclusion: Values.conclusion,
              details: PDF.details(),
             };
  var totform = document.createElement("FORM");
  totform.setAttribute("action", PDF.url);
  totform.setAttribute("method", "post");
  totform.setAttribute("enctype", "multipart/form-data");
  totform.setAttribute("target", "_blank");
  var data_field = document.createElement("INPUT");
  data_field.setAttribute("type", "hidden");
  data_field.setAttribute("name", "data");
  data_field.setAttribute("value", JSON.stringify(data));
  totform.appendChild(data_field);
  $('body').append(totform);
  totform.submit();
};
