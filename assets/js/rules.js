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

Rules.simpleYesNoRule = (variable_id, yesValue, noValue) => {
  return () =>  {
    var result = undefined;
    if (TotValues[variable_id] == 'yes') {
      result = yesValue;
    } else {
      result = noValue;
    }
    return result;
  };
};

Rules.jumpToFinish = 'finish';

Rules.conclusion = (conclusion) => {
  TotValues.conclusion = conclusion;
  return Rules.jumpToFinish;
};

Rules.conclusionPDF = (conclusion) => {
  Rules.conclusion(conclusion);
  TotValues.conclusion_generate_pdf = true;
  return Rules.jumpToFinish;
};

Rules.addFlag = (flag) => {
  TotValues.flags.push(flag);
};

////////////////////////////////////////////////////////////////////////////////
// Calculated/inferred properties
////////////////////////////////////////////////////////////////////////////////

Rules.is203 = () =>  {
  return (TotValues.conclusion == "A.iii");
};

Rules.is304 = () =>  {
  return (['A.i', 'A.ii', 'A.i-ii'].indexOf(TotValues.conclusion) > -1);
};

Rules.hasPublicDomainFlags = () =>  {
  var result = false;
  for (var i = 0; i < TotValues.flags.length; i++) {
    if (TotValues.flags[i][0] == 'B') {
      result = true;
    }
  }
  return result;
};

Rules.beforeEndOfNoticeWindow = () =>  {
  return ((TotValues.notice_end != undefined)
      && (TotValues.notice_end >= TotValues.current_year))
    || ((TotValues.d_notice_end != undefined)
    && (TotValues.d_notice_end >= TotValues.current_year))
    || ((TotValues.p_notice_end != undefined)
    && (TotValues.p_notice_end >= TotValues.current_year));
};

////////////////////////////////////////////////////////////////////////////////
// Section N Analyses
////////////////////////////////////////////////////////////////////////////////

Rules.section304Analysis = () =>  {
  // Note that this is part of the logic from the section 203 analysis
  var result = 's1q1f';
  if (TotValues.k_year < 1978) {
    result = 's2q2a';
    Rules.addFlag('F.i');
    if ((TotValues.pub_year > 1977) && (TotValues.reg_year > 1977)) {
      result = Rules.conclusion('B.vii');
    } else {
      // Under the 1909 Act, copyright term begins at the earlier of
      // the registration date and the publication date.
      // If the work is both registered and published use the minimum of them.
      if ((TotValues.reg_year != undefined)
          && (TotValues.pub_year != undefined)) {
            TotValues.cright_year = Math.min(TotValues.pub_year,
                                          TotValues.reg_year);
      }
      // Otherwise use whichever value is set. One *will* be set here, see top.
      else {
        TotValues.cright_year = TotValues.reg_year || TotValues.pub_year;
      }
      TotValues.cright_year = Math.min(TotValues.cright_year, 1978);
      TotValues.term_begin = TotValues.cright_year + 56;
      TotValues.term_begin = Math.max(TotValues.term_begin, 1978);
      TotValues.term_end = TotValues.term_begin + 5;
      TotValues.notice_begin = TotValues.term_begin - 10;
      TotValues.notice_end = TotValues.term_end - 2;
      // If the we're presently before the 304(c) window, then we don't have to worry about 304(d)
	if (TotValues.notice_begin > TotValues.current_year) {
        Rules.addFlag('A.i.a');
       // Following Copyright Office guidance, works copyrighted before 1940 may also be eligible for termination under 304d
       } else if (TotValues.cright_year < 1940) {
          Rules.addFlag('F.ii');
          TotValues.d_term_begin = TotValues.term_begin + 19;
          TotValues.d_term_end = TotValues.d_term_begin + 5;
          TotValues.d_notice_begin = TotValues.d_term_begin - 10;
          TotValues.d_notice_end = TotValues.d_term_end - 2;
          if (TotValues.cright_year > 1936) {
            Rules.addFlag('G.i');
          }
          if (TotValues.cright_year == 1939) {
            Rules.addFlag('G.ii.a');
          }
          if (TotValues.d_notice_begin > TotValues.current_year) {
            // time traveler flag -- applies where the present day is between
            // the 304(c) and 304(d) notice windows
            Rules.addFlag('A.iii.a');
          } else if (TotValues.d_notice_end < TotValues.current_year) {
            Rules.addFlag('A.ii.a');
          }
       } else if (TotValues.notice_end < TotValues.current_year) {
         Rules.addFlag('A.ii.a');
       } else {
         // Here for clarity / to reflect decision tree structure
         // But note that we set it as the result above.
         result = 's2q2a';
       }
    }
    if ((TotValues.d_term_begin != undefined)
        && (TotValues.term_begin != undefined)) {
      Rules.addFlag('E.i');
    }
  }
  return result;
};

Rules.section203Analysis = () =>  {
  var result = 's2q2a';
  if (typeof TotValues.grant_pub_year !== 'undefined') {
    Rules.addFlag('F.iv');
  }
  TotValues.triggering_pub_year = TotValues.grant_pub_year || TotValues.pub_year;
  if (TotValues.k_year > 1977) {
    Rules.addFlag('F.iii');
    if (TotValues.pub_right == 'yes' ) {
      if (TotValues.triggering_pub_year != undefined) {
        TotValues.term_begin = Math.min(TotValues.triggering_pub_year + 35 ,
                                     TotValues.k_year + 40);
      } else {
        TotValues.term_begin = TotValues.k_year + 40;
      }
    } else if ((TotValues.triggering_pub_year != TotValues.k_year)
           || (TotValues.pub_right == 'no'))  {
      TotValues.term_begin = TotValues.k_year + 35;
    }
    if (TotValues.term_begin != undefined) {
      TotValues.term_end = TotValues.term_begin + 5;
      TotValues.notice_begin = TotValues.term_begin - 10;
      TotValues.notice_end = TotValues.term_end - 2;
      if (TotValues.notice_begin > TotValues.current_year) {
        Rules.addFlag('A.i.a');
      } else if (TotValues.notice_end < TotValues.current_year) {
        Rules.addFlag('A.ii.a');
      }
    }
    if (TotValues.pub_right == 'maybe') {
      TotValues.p_term_begin = TotValues.k_year + 40;
      if (TotValues.triggering_pub_year != undefined) {
        TotValues.p_term_begin = Math.min(TotValues.triggering_pub_year + 35,
                                       TotValues.p_term_begin);
      }
      TotValues.p_term_end = TotValues.p_term_begin  + 5;
      TotValues.p_notice_begin = TotValues.p_term_begin - 10;
      TotValues.p_notice_end = TotValues.p_term_end - 2;
      if (TotValues.p_notice_begin > TotValues.current_year) {
        Rules.addFlag('A.i.a');
      } else if (TotValues.p_notice_end < TotValues.current_year) {
        Rules.addFlag('A.ii.a');
      }
    }
  }
  if ((TotValues.p_term_begin != undefined)
      && (TotValues.term_begin != undefined)) {
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

Rules.s1q1bi = 's1q1bii';

// When was the work first published under the grant?
// Note that the condition is based on s1q1b, we are inserting this question
// after 'When was the work first published?' and *then* going on to the
// questions about registration/notices or not.

Rules.s1q1bii = () =>  {
  var result = undefined;
  if (TotValues.pub_year < 1923) {
    result = Rules.conclusion('B.viii');
  } else if (TotValues.pub_year < 1990)
    result = 's1q1bi2';
  else {
    result = 's1q1d';
  }
  return result;
};

// Works from 1989 and earlier usually display a copyright notice...

Rules.s1q1bi2 = () =>  {
  var result = undefined;
  if (TotValues.copyright_notice == 'yes') {
    result = 's1q1c';
  } else if (TotValues.copyright_notice == 'no') {
    // The same
    result = 's1q1c';
    if (TotValues.pub_year < 1989) {
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

Rules.s1q1c = () =>  {
  var result = undefined;
  if (TotValues.work_registered == 'yes') {
    result = 's1q1ci';
  } else if (TotValues.work_registered == 'no') {
    result = 's1q1d';
  } else /* don't know */ {
    // If someone doesn't know, continue without asking for registration number
    result = 's1q1d';
  }
  return result;
};

// When was the work registered with the United States Copyright Office?

Rules.s1q1ci = () =>  {
  var result = undefined;
  if (TotValues.reg_year < 1923) {
    result = Rules.conclusion('B.viii');
  } else {
    result = 's1q1d';
  }
  return result;
};

// For s1q1d,
// What is the date of the agreement or transfer? ...

Rules.s1q1d = () =>  {
  var result = undefined;
  if (TotValues.user_inputted_k_year != TotValues.k_year) {
    Rules.addFlag('H.i');
  }
  if ((TotValues.k_year < 1978)
      && ((TotValues.pub_year == undefined)
      && (TotValues.reg_year == undefined))) {
      result = Rules.conclusion('B.vii');
  } else {
    // Intercept the result so we can add encouragement if things look good
    result = Rules.section304Analysis();
    if ((result != Rules.jumpToFinish)
    && Rules.beforeEndOfNoticeWindow()
    && (! Rules.hasPublicDomainFlags())) {
    TotNotifications.setEncouragement("Both notice window and copyright status look good, let's get some more details!");
    }
  }
  return result;
};

// Did the agreement or transfer include the right of publication?

Rules.s1q1f = () =>  {
  // Intercept the result so we can add encouragement if things look good
  var result = Rules.section203Analysis();
  if ((result != Rules.jumpToFinish)
      && Rules.beforeEndOfNoticeWindow()
      && (! Rules.hasPublicDomainFlags())) {
    TotNotifications.setEncouragement("Both notice window and copyright status look good, let's get some more details!");
  }
  return result;
};


Rules.section203Analysis;

////////////////////////////////////////////////////////////////////////////////
// Section 2
////////////////////////////////////////////////////////////////////////////////

// Is the agreement or transfer you want to terminate part of a last will...

Rules.s2q2a = () =>  {
  var result = undefined;
  if (TotValues.last_will == 'yes') {
    result = Rules.conclusion('B.iv');
  } else {
    if ((TotValues.creation_year > 1977)
    || (((TotValues.pub_year == undefined) || (TotValues.pub_year > 1977))
        && ((TotValues.reg_year == undefined) || (TotValues.reg_year > 1977)))) {
      result = 's2q2bi';
    } else {
      result = 's2q2c';
    }
  }
  return result;
};

// Are any of the authors still alive?
// It's i) because the conditional logic that starts b is included in a

Rules.s2q2bi = () =>  {
  var result = undefined;
  if (TotValues.any_authors_alive == 'yes') {
    result = 's2q2c'
  } else {
    result = 's2q2bi2';
  }
  return result;
};

// What is the year the last surviving author died?

Rules.s2q2bi2 = () =>  {
  var result = undefined;
  // creation_year is always set, pub_year may not be, death will be here
  if (TotValues.creation_year > 1977) {
    TotValues.pd = TotValues.death + 71;
  } else if ((TotValues.pub_year != undefined)
     && (TotValues.pub_year < 2003)) {
    TotValues.pd = Math.max((TotValues.death + 71), 2048);
  } else {
    TotValues.pd = Math.max((TotValues.death + 71), 2003);
  }
  // pd *will* have been set in the if/else block
  if (TotValues.current_year > TotValues.pd) {
    result = Rules.conclusion('B.viii');
  } else {
    result = 's2q2c';
  }
  return result;
};

// Was the work created within the scope of the author’s employment?

Rules.s2q2c = () =>  {
  var result = undefined;
  if (TotValues.within_scope_of_employment == 'yes') {
    if (TotValues.creation_year > 1977) {
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

Rules.s2q2ci = () =>  {
  var result = undefined;
   if (TotValues.express_agreement == 'yes') {
    result = 's2q2d';
   } else {
     result = Rules.conclusion('B.i');
  }
  return result;
};

// Was the work created in response to a special order or commission?

Rules.s2q2d = () =>  {
  var result = undefined;
  if (TotValues.special_order == 'yes') {
    if (TotValues.creation_year < 1978) {
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

Rules.s2q2di = () =>  {
  var result = undefined;
  if (TotValues.signed_written_agreement == 'yes') {
    if (TotValues.creation_year < 1978) {
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

Rules.s2q2dia = () =>  {
  var result = undefined;
  if (TotValues.created_as_part_of_motion_picture == 'yes') {
    result = Rules.conclusion('C.ii');
  } else if (TotValues.created_as_part_of_motion_picture == 'no') {
    result = 's2q2e';
  } else /* don't know */ {
    Rules.addFlag('D.ii');
    result = 's2q2e';
  }
  return result;
};

// Has the original transfer since been renegotiated or altered?

Rules.s2q2e = () =>  {
  var result = 's2q2f';
  if (TotValues.renego == 'yes') {
    Rules.addFlag('C.i');
  } else if (TotValues.renego == 'no') {
    // Continue
  } else /* don't know */ {
    Rules.addFlag('C.ii');
  }
  return result;
};

// Did one or more of the authors or artists enter into the agreement...

Rules.s2q2f = () =>  {
  var result = undefined;
  if (TotValues.authors_entered_agreement == 'yes') {
    if (TotValues.k_year < 1978) {
      result = Rules.conclusionPDF('A.i-ii');
    } else /*if (k_year > 1977)*/ {
      result = Rules.conclusionPDF('A.iii');
    }
  } else {
    if (TotValues.k_year < 1978) {
      result = 's2q2fii';
    } else /*if (TotValues.k_year > 1977)*/ {
      result = Rules.conclusion('B.vi');
    }
  }
  return result;
};

// Was the agreement or transfer made by a member of...

Rules.s2q2fii = () =>  {
  var result = undefined;
  if (TotValues.agreement_by_family_or_executor) {
    result = Rules.conclusionPDF('A.i-ii');
  } else {
    result = Rules.conclusion('B.v');
  }
  return result
 };
