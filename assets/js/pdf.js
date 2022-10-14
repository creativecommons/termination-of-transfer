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

PDF.url = jQuery("script[src*='/termination-of-transfer/assets/js/pdf.js']")
	       .attr('src').replace(/assets\/js\/pdf\.js.*$/, '')
	       + 'src/ResultPdf.php';

PDF.appendProperty = (details, key, value) => {
  var mapping = {key: key,
                 value: value};
  details.push(mapping);
};

PDF.append203Windows = (details)=> {
  var notice = '';
  var termination = '';

  if (TotValues.notice_begin != undefined) {
    notice += TotValues.notice_begin + '-' + TotValues.notice_end;
    termination += TotValues.term_begin + '-' + TotValues.term_end
  }

  if (TotValues.p_term_begin != undefined) {
    if (notice != '') {
      notice += ' or ';
      termination += ' or ';
    }
    notice += TotValues.p_notice_begin + '-' + TotValues.p_notice_end;
    termination += TotValues.p_term_begin + '-' + TotValues.p_term_end;
  }

  PDF.appendProperty(details, '&sect; 203 <a href="https://rightsback.org/glossary/#notice_window" target="_blank">notice window</a>', notice);
  PDF.appendProperty(details, '&sect; 203 <a href="https://rightsback.org/glossary/#termination_window" target="_blank">termination window</a>', termination);
};

PDF.append304Windows = (details) => {
  PDF.appendProperty(details, '&sect; 304(c) <a href="https://rightsback.org/glossary/#notice_window" target="_blank">notice window</a> begins',
                     TotValues.notice_begin);
  PDF.appendProperty(details, '&sect; 304(c) <a href="https://rightsback.org/glossary/#notice_window" target="_blank">notice window</a> ends',
                     TotValues.notice_end);
  PDF.appendProperty(details, '&sect; 304(c) <a href="https://rightsback.org/glossary/#termination_window" target="_blank">termination window</a> begins',
                     TotValues.term_begin);
  PDF.appendProperty(details, '&sect; 304(c) <a href="https://rightsback.org/glossary/#termination_window" target="_blank">termination window</a> ends',
                     TotValues.term_end);
  if (TotValues.d_notice_begin != undefined) {
    PDF.appendProperty(details, '&sect; 304(d) <a href="https://rightsback.org/glossary/#notice_window" target="_blank">notice window</a> begins',
                       TotValues.d_notice_begin);
    PDF.appendProperty(details, '&sect; 304(d) <a href="https://rightsback.org/glossary/#notice_window" target="_blank">notice window</a> ends',
                       TotValues.d_notice_end);
    PDF.appendProperty(details, '&sect; 304(d) <a href="https://rightsback.org/glossary/#termination_window" target="_blank">termination window</a> begins',
                       TotValues.d_term_begin);
    PDF.appendProperty(details, '&sect; 304(d) <a href="https://rightsback.org/glossary/#termination_window" target="_blank">termination window</a> ends',
                       TotValues.d_term_end);
  }
};

PDF.appendWindows = (details) => {
  if (Rules.is203()) {
    PDF.append203Windows(details);
  } else if (Rules.is304()) {
    PDF.append304Windows(details);
  }
};

PDF.details = () =>  {
  var details = [];
  Object.getOwnPropertyNames(totVarsToTitles).forEach( (key) => {
    if ((TotValues[key] != undefined)
        && (TotValues[key] != '')) {
      PDF.appendProperty(details, totVarsToTitles[key], TotValues[key]);
    }
  });
  PDF.appendWindows(details);
  return details;
};

PDF.request = () =>  {
  var data = {report_timestamp: TotValues.current_date.getTime()/1000,
              flags: TotValues.flags.sort(), // Sorts inline & returns, so OK here
              conclusion: TotValues.conclusion,
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
  jQuery('body').append(totform);
  totform.submit();
};
