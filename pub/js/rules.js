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


var Rules = {};

Rules.simpleYesNoRule = function (variable_id, yesValue, noValue) {
  return function () {
    var result = undefined;
    if (Values[variable_id] == 'yes') {
      result = yesValue;
    } else {
      result = noValue;
    }
    return result;
  };
};

Rules.jumpToSectionThree = 's3q3a';
Rules.jumpToFinish = 'finish';

Rules.conclusion = function (conclusion) {
  Values.conclusion = conclusion;
  return Rules.jumpToFinish;
};

Rules.conclusionPDF = function (conclusion) {
  Rules.conclusion(conclusion);
  Values.conclusion_generate_pdf = true;
  return Rules.jumpToSectionThree;
};

Rules.addFlag = function(flag) {
  Values.flags.push(flag);
};

////////////////////////////////////////////////////////////////////////////////
// Calculated/inferred properties
////////////////////////////////////////////////////////////////////////////////

Rules.is203 = function () {
  return (Values.conclusion == "A.iii");
};

Rules.is304 = function () {
  return (['A.i', 'A.ii', 'A.i-ii'].indexOf(Values.conclusion) > -1);
};


Rules.hasPublicDomainFlags = function () {
  var result = false;
  for (var i = 0; i < Values.flags.length; i++) {
    if (Values.flags[i][0] == 'B') {
      result = true;
    }
  }
  return result;
};

Rules.beforeEndOfNoticeWindow = function () {
  return ((Values.notice_end != undefined)
          && (Values.notice_end >= Values.current_year))
    || ((Values.d_notice_end != undefined)
        && (Values.d_notice_end >= Values.current_year))
    || ((Values.p_notice_end != undefined)
        && (Values.p_notice_end >= Values.current_year));
};

////////////////////////////////////////////////////////////////////////////////
// Section N Analyses
////////////////////////////////////////////////////////////////////////////////

Rules.section304Analysis = function () {
  // Note that this is part of the logic from the section 203 analysis
  var result = 's1q1f';
  if (Values.k_year < 1978) {
    result = 's2q2a';
    if ((Values.pub_year == undefined) && (Values.reg_year == undefined)) {
      result = Rules.conclusion('B.vii');
    } else {
      // If the work is both registered and published use the minimum of them.
      if ((Values.reg_year != undefined)
         && (Values.pub_year != undefined)) {
        Values.cright_year = Math.min(Values.pub_year,
                                      Values.reg_year);
      }
      // Otherwise use whichever value is set. One *will* be set here, see top.
      else {
        Values.cright_year = Values.reg_year || Values.pub_year;
      }
      Values.cright_year = Math.min(Values.cright_year, 1978);
      if (Values.cright_year < 1950) {
        Rules.addFlag('B.iv');
      }
      Values.term_begin = Values.cright_year + 56;
      Values.term_begin = Math.max(Values.term_begin, 1978);
      Values.term_end = Values.term_begin + 5;
      Values.notice_begin = Values.term_begin - 10;
      Values.notice_end = Values.term_end - 2;
      if (Values.notice_begin > Values.current_year) {
        Rules.addFlag('A.i.a');
      } else if (Values.notice_end < Values.current_year) {
        if (Values.cright_year < 1938) {
          Values.d_term_begin = Values.term_begin + 19;
          Values.d_term_end = Values.d_term_begin + 5;
          Values.d_notice_begin = Values.d_term_begin - 10;
          Values.d_notice_end = Values.d_term_end - 2;
          if (Values.d_notice_begin > Values.current_year) {
            Rules.addFlag('A.iii.a');
          } else if (Values.notice_end < Values.current_year) {
            Rules.addFlag('A.ii.a');
          } else {
            result = Rules.conclusion('B.ii');
          }
        }
      } else {
        // Here for clarity / to reflect decision tree structure
        // But note that we set it as the result above.
        result = 's2q2a';
      }
    }
    if ((Values.d_term_begin != undefined)
	&& (Values.term_begin != undefined)) {
        Rules.addFlag('E.i');
    }
  }
  return result;
};

Rules.section203Analysis = function () {
  var result = 's2q2a';
  if (Values.k_year > 1977) {
    if (Values.pub_right == 'yes' ) {
      if (Values.pub_year != undefined) {
        Values.term_begin = Math.min(Values.pub_year + 35 , Values.k_year + 40);
      } else {
        Values.term_begin = Values.k_year + 40;
      }
    } else if ((Values.pub_year != Values.k_year)
               || (Values.pub_right == 'no'))  {
      Values.term_begin = Values.k_year + 35;
    }
    console.log(Values.term_begin);
    if (Values.term_begin != undefined) {
      Values.term_end = Values.term_begin + 5;
      Values.notice_begin = Values.term_begin - 10;
      Values.notice_end = Values.term_end - 2;
      if (Values.notice_begin > Values.current_year) {
        Rules.addFlag('A.i.a');
      } else if (Values.notice_end < Values.current_year) {
        Rules.addFlag('A.ii.a');
      }
    }
    if (Values.pub_right == undefined) {
      Values.p_term_begin = Values.k_year + 40;
      if (Values.pub_year != undefined) {
        Values.p_term_begin = Math.min(Values.pub_year + 35,
                                       Values.p_term_begin);
      }
      Values.p_term_end = Values.p_term_begin  + 5;
      Values.p_notice_begin = Values.p_term_begin - 10;
      Values.p_notice_end = Values.p_term_end - 2;
      if (Values.p_notice_begin > Values.current_year) {
        Rules.addFlag('A.i.a');
      } else if (Values.p_notice_end < Values.current_year) {
        Rules.addFlag('A.ii.a');
      }
    }
  }  
  if ((Values.p_term_begin != undefined)
      && (Values.term_begin != undefined)) {
      Rules.addFlag('E.ii');
  }
  return result;
};


////////////////////////////////////////////////////////////////////////////////
// Section 1
////////////////////////////////////////////////////////////////////////////////

// When was the work created?

Rules.s1q1a = 's1q1b';

// Has the work been published?

Rules.s1q1b = Rules.simpleYesNoRule('work_published',
                                    's1q1bi',
                                    's1q1c');

// When was the work first published?

Rules.s1q1bi = function () {
  var result = undefined;
  if (Values.pub_year < 1923) {
    result = Rules.conclusion('B.viii');
  } else if (Values.pub_year < 1990)
    result = 's1q1bi2';
  else {
    result = 's1q1d';
  }
  return result;
};

// Works from 1989 and earlier usually display a copyright notice...

Rules.s1q1bi2 = function () {
  var result = undefined;
  if (Values.copyright_notice == 'yes') {
    result = 's1q1c';
  } else if (Values.copyright_notice == 'no') {
    // The same
    result = 's1q1c';
    if (Values.pub_year < 1989) {
      Rules.addFlag('B.i');
    } else {
      Rules.addFlag('B.ii');
    }
  } else /* maybe */ {
    result = 's1q1c';
    Rules.addFlag('B.iii');
  }
  return result;
};

// Has the work been registered with the United State Copyright Office?

Rules.s1q1c = function () {
  var result = undefined;
  if (Values.work_registered == 'yes') {
    result = 's1q1ci';
  } else if (Values.work_registered == 'no') {
    result = 's1q1d';
  } else /* don't know */ {
    // If someone doesn't know, continue without asking for registration number
    result = 's1q1d';
  }
  return result;
};

// When was the work registered with the United States Copyright Office?

Rules.s1q1ci = 's1q1d';

// For s1q1d,
// What is the date of the agreement or transfer? ...

Rules.s1q1d = function () {
  // Intercept the result so we can add encouragement if things look good
  var result = Rules.section304Analysis();
  if ((result != Rules.jumpToFinish)
      && Rules.beforeEndOfNoticeWindow()
      && (! Rules.hasPublicDomainFlags())) {
    Notifications.setEncouragement("Both notice window and copyright status look good, let's get some more details!");
  }
  return result;
};

// Did the agreement or transfer include the right of publication?

Rules.s1q1f = function () {
  // Intercept the result so we can add encouragement if things look good
  var result = Rules.section203Analysis();
  if ((result != Rules.jumpToFinish)
      && Rules.beforeEndOfNoticeWindow()
      && (! Rules.hasPublicDomainFlags())) {
    Notifications.setEncouragement("Both notice window and copyright status look good, let's get some more details!");
  }
  return result;
};


Rules.section203Analysis;

////////////////////////////////////////////////////////////////////////////////
// Section 2
////////////////////////////////////////////////////////////////////////////////

// Is the agreement or transfer you want to terminate part of a last will...

Rules.s2q2a = function () {
  var result = undefined;
  if (Values.last_will == 'yes') {
    result = Rules.conclusion('B.iv');
  } else {
    if ((Values.creation_year > 1977)
        || (((Values.pub_year == undefined) || (Values.pub_year > 1977))
            && ((Values.reg_year == undefined) || (Values.reg_year > 1977)))) {
      result = 's2q2bi';
    } else {
      result = 's2q2c';
    }
  }
  return result;
};

// Are any of the authors still alive?
// It's i) because the conditional logic that starts b is included in a

Rules.s2q2bi = function () {
  var result = undefined;
  if (Values.any_authors_alive == 'yes') {
    result = 's2q2c'
  } else {
    result = 's2q2bi2';
  }
  return result;
};

// What is the year the last surviving author died?

Rules.s2q2bi2 = function () {
  var result = undefined;
  // creation_year is always set, pub_year may not be, death will be here
  if (Values.creation_year > 1977) {
    Values.pd = Values.death + 71;
  } else if ((Values.pub_year != undefined)
             && (Values.pub_year < 2003)) {
    Values.pd = Math.max((Values.death + 71), 2048);
  } else {
    Values.pd = Math.max((Values.death + 71), 2003);
  }
  // pd *will* have been set in the if/else block
  if (Values.current_year > Values.pd) {
    result = Rules.conclusion('B.viii');
  } else {
    result = 's2q2c';
  }
  return result;
};

// Was the work created within the scope of the author’s employment?

Rules.s2q2c = function () {
  var result = undefined;
  if (Values.within_scope_of_employment == 'yes') {
    if (Values.creation_year > 1977) {
      result = 's2q2ci';
    } else {
      result = Rules.conclusion('B.i');
    }
  } else {
    result = 's2q2d';
  }
  return result
};

// Was there an express agreement between you...

Rules.s2q2ci = function () {
  var result = undefined;
   if (Values.express_agreement == 'yes') {
    result = 's2q2d';
   } else {
     result = Rules.conclusion('B.i');
  }
  return result;
};

// Was the work created in response to a special order or commission?

Rules.s2q2d = function () {
  var result = undefined;
  if (Values.special_order == 'yes') {
    if (Values.creation_year < 1978) {
      Rules.addFlag('D.i');
      result = 's2q2e';
    } else {
      result = 's2q2di';
    }
  } else {
    result = 's2q2e';
  }
  return result
};

// Was there a signed written agreement regarding the special order...

Rules.s2q2di = function () {
  var result = undefined;
  if (Values.signed_written_agreement == 'yes') {
    if (Values.creation_year < 1978) {
      result = Rules.conclusion('B.iii');
    } else {
      result = 's2q2dia';
    }
  } else {
    result = 's2q2e';
  }
  return result
};

// Was the work created for use as one of the following? ...

Rules.s2q2dia = function () {
  var result = undefined;
  if (Values.created_as_part_of_motion_picture == 'yes') {
    result = Rules.conclusion('C.ii');
  } else if (Values.created_as_part_of_motion_picture == 'no') {
    result = 's2q2e';
  } else /* don't know */ {
    Rules.addFlag('D.ii');
    result = 's2q2e';
  }
  return result;
};

// Has the original transfer since been renegotiated or altered?

Rules.s2q2e = function () {
  var result = 's2q2f';
  if (Values.renego == 'yes') {
    Rules.addFlag('C.i');
  } else if (Values.renego == 'no') {
    // Continue
  } else /* don't know */ {
    Rules.addFlag('C.ii');
  }
  return result;
};

// Did one or more of the authors or artists enter into the agreement...

Rules.s2q2f = function () {
  var result = undefined;
  if (Values.authors_entered_agreement == 'yes') {
    if (Values.k_year < 1978) {
      result = Rules.conclusionPDF('A.i-ii');
    } else /*if (k_year > 1977)*/ {
      result = Rules.conclusionPDF('A.iii');
    }
  } else {
    if (Values.k_year < 1978) {
      result = 's2q2fii';
    } else /*if (Values.k_year > 1977)*/ {
      result = Rules.conclusion('B.vi');
    }
  }
  return result;
};

// Was the agreement or transfer made by a member of...

Rules.s2q2fii = function () {
  var result = undefined;
  if (Values.agreement_by_family_or_executor) {
    result = Rules.conclusionPDF('A.i-ii');
  } else {
    result = Rules.conclusion('B.v');
  }
  return result
 };


// Title of Work

Rules.s3q3a = function () {
  var result = undefined;
  if (Values.work_registered == 'yes') {
    result = 's3q3b';
  } else {
    result = 's3q3d';
  }
  return result
};

// Copyright Registration Number
// Note that 3c was deleted, so we go to 3d (renumber?)
Rules.s3q3b = 's3q3d';

// Description of the Agreement or Transfer

Rules.s3q3d = 's3q3e';

// Please list all authors or artists of the work

Rules.s3q3e = 'finish';
