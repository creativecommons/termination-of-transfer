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

PDF.appendProperty = function (details, key, value) {
  var mapping = {key: key,
                 value: value};
  details.push(mapping);
};

PDF.append203Windows = function (details) {
  var notice = '';
  var termination = '';

  if (Values.notice_begin != undefined) {
    notice += Values.notice_begin + '-' + Values.notice_end;
    termination += Values.term_begin + '-' + Values.term_end
  }

  if (Values.p_term_begin != undefined) {
    if (notice != '') {
      notice += ' or ';
      termination += ' or ';
    }
    notice += Values.p_notice_begin + '-' + Values.p_notice_end;
    termination += Values.p_term_begin + '-' + Values.p_term_end;
  }

  PDF.appendProperty(details, '&sect; 203 <a href="https://labs.creativecommons.org/demos/termination-of-transfer/glossary.php#notice_window" target="_blank">notice window</a>', notice);
  PDF.appendProperty(details, '&sect; 203 <a href="https://labs.creativecommons.org/demos/termination-of-transfer/glossary.php#termination_window" target="_blank">termination window</a>', termination);
};

PDF.append304Windows = function (details) {
  PDF.appendProperty(details, '&sect; 304(c) <a href="https://labs.creativecommons.org/demos/termination-of-transfer/glossary.php#notice_window" target="_blank">notice window</a> begins',
                     Values.notice_begin);
  PDF.appendProperty(details, '&sect; 304(c) <a href="https://labs.creativecommons.org/demos/termination-of-transfer/glossary.php#notice_window" target="_blank">notice window</a> ends',
                     Values.notice_end);
  PDF.appendProperty(details, '&sect; 304(c) <a href="https://labs.creativecommons.org/demos/termination-of-transfer/glossary.php#termination_window" target="_blank">termination window</a> begins',
                     Values.term_begin);
  PDF.appendProperty(details, '&sect; 304(c) <a href="https://labs.creativecommons.org/demos/termination-of-transfer/glossary.php#termination_window" target="_blank">termination window</a> ends',
                     Values.term_end);
  if (Values.d_notice_begin != undefined) {
    PDF.appendProperty(details, '&sect; 304(d) <a href="https://labs.creativecommons.org/demos/termination-of-transfer/glossary.php#notice_window" target="_blank">notice window</a> begins',
                       Values.d_notice_begin);
    PDF.appendProperty(details, '&sect; 304(d) <a href="https://labs.creativecommons.org/demos/termination-of-transfer/glossary.php#notice_window" target="_blank">notice window</a> ends',
                       Values.d_notice_end);
    PDF.appendProperty(details, '&sect; 304(d) <a href="https://labs.creativecommons.org/demos/termination-of-transfer/glossary.php#termination_window" target="_blank">termination window</a> begins',
                       Values.d_term_begin);
    PDF.appendProperty(details, '&sect; 304(d) <a href="https://labs.creativecommons.org/demos/termination-of-transfer/glossary.php#termination_window" target="_blank">termination window</a> ends',
                       Values.d_term_end);
  }
};

PDF.appendWindows = function (details) {
  if (Rules.is203()) {
    PDF.append203Windows(details);
  } else if (Rules.is304()) {
    PDF.append304Windows(details);
  }
};

PDF.details = function () {
  var details = [];
  Object.getOwnPropertyNames(varsToTitles).forEach(function (key) {
    if ((Values[key] != undefined)
        && (Values[key] != '')) {
      PDF.appendProperty(details, varsToTitles[key], Values[key]);
    }
  });
  PDF.appendWindows(details);
  return details;
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
