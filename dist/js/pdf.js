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
// PDF Generation
// (browser-side data preparation and call to server)
////////////////////////////////////////////////////////////////////////////////

var TotPdf = {};
TotPdf.url = "".concat(jQuery("script[src*='/termination-of-transfer/dist/js/pdf.js']").attr("src").replace(/dist\/js\/pdf\.js.*$/, ""), "pdf-result.php");
TotPdf.appendProperty = function (details, key, value) {
  var mapping = {
    key: key,
    value: value
  };
  details.push(mapping);
};
TotPdf.append203Windows = function (details) {
  var notice = "";
  var termination = "";
  if (TotValues.notice_begin != undefined) {
    notice += "".concat(TotValues.notice_begin, "-").concat(TotValues.notice_end);
    termination += "".concat(TotValues.term_begin, "-").concat(TotValues.term_end);
  }
  if (TotValues.p_term_begin != undefined) {
    if (notice != "") {
      notice += " or ";
      termination += " or ";
    }
    notice += "".concat(TotValues.p_notice_begin, "-").concat(TotValues.p_notice_end);
    termination += "".concat(TotValues.p_term_begin, "-").concat(TotValues.p_term_end);
  }
  TotPdf.appendProperty(details, '&sect; 203 <a href="https://rightsback.org/glossary/#notice_window" target="_blank">notice window</a>', notice);
  TotPdf.appendProperty(details, '&sect; 203 <a href="https://rightsback.org/glossary/#termination_window" target="_blank">termination window</a>', termination);
};
TotPdf.append304Windows = function (details) {
  TotPdf.appendProperty(details, '&sect; 304(c) <a href="https://rightsback.org/glossary/#notice_window" target="_blank">notice window</a> begins', TotValues.notice_begin);
  TotPdf.appendProperty(details, '&sect; 304(c) <a href="https://rightsback.org/glossary/#notice_window" target="_blank">notice window</a> ends', TotValues.notice_end);
  TotPdf.appendProperty(details, '&sect; 304(c) <a href="https://rightsback.org/glossary/#termination_window" target="_blank">termination window</a> begins', TotValues.term_begin);
  TotPdf.appendProperty(details, '&sect; 304(c) <a href="https://rightsback.org/glossary/#termination_window" target="_blank">termination window</a> ends', TotValues.term_end);
  if (TotValues.d_notice_begin != undefined) {
    TotPdf.appendProperty(details, '&sect; 304(d) <a href="https://rightsback.org/glossary/#notice_window" target="_blank">notice window</a> begins', TotValues.d_notice_begin);
    TotPdf.appendProperty(details, '&sect; 304(d) <a href="https://rightsback.org/glossary/#notice_window" target="_blank">notice window</a> ends', TotValues.d_notice_end);
    TotPdf.appendProperty(details, '&sect; 304(d) <a href="https://rightsback.org/glossary/#termination_window" target="_blank">termination window</a> begins', TotValues.d_term_begin);
    TotPdf.appendProperty(details, '&sect; 304(d) <a href="https://rightsback.org/glossary/#termination_window" target="_blank">termination window</a> ends', TotValues.d_term_end);
  }
};
TotPdf.appendWindows = function (details) {
  if (TotRules.is203()) {
    TotPdf.append203Windows(details);
  } else if (TotRules.is304()) {
    TotPdf.append304Windows(details);
  }
};
TotPdf.details = function () {
  var details = [];
  Object.getOwnPropertyNames(totVarsToTitles).forEach(function (key) {
    if (TotValues[key] != undefined && TotValues[key] != "") {
      TotPdf.appendProperty(details, totVarsToTitles[key], TotValues[key]);
    }
  });
  TotPdf.appendWindows(details);
  return details;
};
TotPdf.request = function () {
  var data = {
    report_timestamp: TotValues.current_date.getTime() / 1000,
    flags: TotValues.flags.sort(),
    // Sorts inline & returns, so OK here
    conclusion: TotValues.conclusion,
    details: TotPdf.details()
  };
  var totform = document.createElement("FORM");
  totform.setAttribute("action", TotPdf.url);
  totform.setAttribute("method", "post");
  totform.setAttribute("enctype", "multipart/form-data");
  totform.setAttribute("target", "_blank");
  var data_field = document.createElement("INPUT");
  data_field.setAttribute("type", "hidden");
  data_field.setAttribute("name", "data");
  data_field.setAttribute("value", JSON.stringify(data));
  totform.appendChild(data_field);
  jQuery("body").append(totform);
  totform.submit();
};