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

const TotRules = {};

TotRules.simpleYesNoRule = (variable_id, yesValue, noValue) => {
  return () => {
    let result = undefined;
    if (TotValues[variable_id] == "yes") {
      result = yesValue;
    } else {
      result = noValue;
    }
    return result;
  };
};

TotRules.jumpToFinish = "finish";

TotRules.conclusion = (conclusion) => {
  TotValues.conclusion = conclusion;
  return TotRules.jumpToFinish;
};

TotRules.conclusionPDF = (conclusion) => {
  TotRules.conclusion(conclusion);
  TotValues.conclusion_generate_pdf = true;
  return TotRules.jumpToFinish;
};

TotRules.addFlag = (flag) => {
  TotValues.flags.push(flag);
};

////////////////////////////////////////////////////////////////////////////////
// Calculated/inferred properties
////////////////////////////////////////////////////////////////////////////////

TotRules.is203 = () => {
  return TotValues.conclusion == "A.iii";
};

TotRules.is304 = () => {
  return ["A.i", "A.ii", "A.i-ii"].indexOf(TotValues.conclusion) > -1;
};

TotRules.hasPublicDomainFlags = () => {
  let result = false;
  for (let i = 0; i < TotValues.flags.length; i++) {
    if (TotValues.flags[i][0] == "B") {
      result = true;
    }
  }
  return result;
};

TotRules.beforeEndOfNoticeWindow = () => {
  return (
    (TotValues.notice_end != undefined &&
      TotValues.notice_end >= TotValues.current_year) ||
    (TotValues.d_notice_end != undefined &&
      TotValues.d_notice_end >= TotValues.current_year) ||
    (TotValues.p_notice_end != undefined &&
      TotValues.p_notice_end >= TotValues.current_year)
  );
};

////////////////////////////////////////////////////////////////////////////////
// Section N Analyses
////////////////////////////////////////////////////////////////////////////////

TotRules.section304Analysis = () => {
  // Note that this is part of the logic from the section 203 analysis
  let result = "s1q1f";
  if (TotValues.k_year < 1978) {
    result = "s2q2a";
    TotRules.addFlag("F.i");
    if (TotValues.pub_year > 1977 && TotValues.reg_year > 1977) {
      result = TotRules.conclusion("B.vii");
    } else {
      // Under the 1909 Act, copyright term begins at the earlier of
      // the registration date and the publication date.
      // If the work is both registered and published use the minimum of them.
      if (TotValues.reg_year != undefined && TotValues.pub_year != undefined) {
        TotValues.cright_year = Math.min(
          TotValues.pub_year,
          TotValues.reg_year,
        );
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
        TotRules.addFlag("A.i.a");
        // Following Copyright Office guidance, works copyrighted before 1940 may also be eligible for termination under 304d
      } else if (TotValues.cright_year < 1940) {
        TotRules.addFlag("F.ii");
        TotValues.d_term_begin = TotValues.term_begin + 19;
        TotValues.d_term_end = TotValues.d_term_begin + 5;
        TotValues.d_notice_begin = TotValues.d_term_begin - 10;
        TotValues.d_notice_end = TotValues.d_term_end - 2;
        if (TotValues.cright_year > 1936) {
          TotRules.addFlag("G.i");
        }
        if (TotValues.cright_year == 1939) {
          TotRules.addFlag("G.ii.a");
        }
        if (TotValues.d_notice_begin > TotValues.current_year) {
          // time traveler flag -- applies where the present day is between
          // the 304(c) and 304(d) notice windows
          TotRules.addFlag("A.iii.a");
        } else if (TotValues.d_notice_end < TotValues.current_year) {
          TotRules.addFlag("A.ii.a");
        }
      } else if (TotValues.notice_end < TotValues.current_year) {
        TotRules.addFlag("A.ii.a");
      } else {
        // Here for clarity / to reflect decision tree structure
        // But note that we set it as the result above.
        result = "s2q2a";
      }
    }
    if (
      TotValues.d_term_begin != undefined &&
      TotValues.term_begin != undefined
    ) {
      TotRules.addFlag("E.i");
    }
  }
  return result;
};

TotRules.section203Analysis = () => {
  let result = "s2q2a";
  if (typeof TotValues.grant_pub_year !== "undefined") {
    TotRules.addFlag("F.iv");
  }
  TotValues.triggering_pub_year =
    TotValues.grant_pub_year || TotValues.pub_year;
  if (TotValues.k_year > 1977) {
    TotRules.addFlag("F.iii");
    if (TotValues.pub_right == "yes") {
      if (TotValues.triggering_pub_year != undefined) {
        TotValues.term_begin = Math.min(
          TotValues.triggering_pub_year + 35,
          TotValues.k_year + 40,
        );
      } else {
        TotValues.term_begin = TotValues.k_year + 40;
      }
    } else if (
      TotValues.triggering_pub_year != TotValues.k_year ||
      TotValues.pub_right == "no"
    ) {
      TotValues.term_begin = TotValues.k_year + 35;
    }
    if (TotValues.term_begin != undefined) {
      TotValues.term_end = TotValues.term_begin + 5;
      TotValues.notice_begin = TotValues.term_begin - 10;
      TotValues.notice_end = TotValues.term_end - 2;
      if (TotValues.notice_begin > TotValues.current_year) {
        TotRules.addFlag("A.i.a");
      } else if (TotValues.notice_end < TotValues.current_year) {
        TotRules.addFlag("A.ii.a");
      }
    }
    if (TotValues.pub_right == "maybe") {
      TotValues.p_term_begin = TotValues.k_year + 40;
      if (TotValues.triggering_pub_year != undefined) {
        TotValues.p_term_begin = Math.min(
          TotValues.triggering_pub_year + 35,
          TotValues.p_term_begin,
        );
      }
      TotValues.p_term_end = TotValues.p_term_begin + 5;
      TotValues.p_notice_begin = TotValues.p_term_begin - 10;
      TotValues.p_notice_end = TotValues.p_term_end - 2;
      if (TotValues.p_notice_begin > TotValues.current_year) {
        TotRules.addFlag("A.i.a");
      } else if (TotValues.p_notice_end < TotValues.current_year) {
        TotRules.addFlag("A.ii.a");
      }
    }
  }
  if (
    TotValues.p_term_begin != undefined &&
    TotValues.term_begin != undefined
  ) {
    TotRules.addFlag("E.ii");
  }
  return result;
};

////////////////////////////////////////////////////////////////////////////////
// Section 1
////////////////////////////////////////////////////////////////////////////////

// When was the work created?

TotRules.s1q1a = "s1q1b";

// Has the work been published?

TotRules.s1q1b = TotRules.simpleYesNoRule("work_published", "s1q1bi", "s1q1c");

// When was the work first published?

TotRules.s1q1bi = "s1q1bii";

// When was the work first published under the grant?
// Note that the condition is based on s1q1b, we are inserting this question
// after 'When was the work first published?' and *then* going on to the
// questions about registration/notices or not.

TotRules.s1q1bii = () => {
  let result = undefined;
  if (TotValues.pub_year < 1923) {
    result = TotRules.conclusion("B.viii");
  } else if (TotValues.pub_year < 1990) result = "s1q1bi2";
  else {
    result = "s1q1d";
  }
  return result;
};

// Works from 1989 and earlier usually display a copyright notice...

TotRules.s1q1bi2 = () => {
  let result = undefined;
  if (TotValues.copyright_notice == "yes") {
    result = "s1q1c";
  } else if (TotValues.copyright_notice == "no") {
    // The same
    result = "s1q1c";
    if (TotValues.pub_year < 1989) {
      TotRules.addFlag("B.i");
    } else {
      TotRules.addFlag("B.ii");
    }
  } /* maybe */ else {
    result = "s1q1c";
    TotRules.addFlag("B.iii");
  }
  return result;
};

// Has the work been registered with the United State Copyright Office?

TotRules.s1q1c = () => {
  let result = undefined;
  if (TotValues.work_registered == "yes") {
    result = "s1q1ci";
  } else if (TotValues.work_registered == "no") {
    result = "s1q1d";
  } /* don't know */ else {
    // If someone doesn't know, continue without asking for registration number
    result = "s1q1d";
  }
  return result;
};

// When was the work registered with the United States Copyright Office?

TotRules.s1q1ci = () => {
  let result = undefined;
  if (TotValues.reg_year < 1923) {
    result = TotRules.conclusion("B.viii");
  } else {
    result = "s1q1d";
  }
  return result;
};

// For s1q1d,
// What is the date of the agreement or transfer? ...

TotRules.s1q1d = () => {
  let result = undefined;
  if (TotValues.user_inputted_k_year != TotValues.k_year) {
    TotRules.addFlag("H.i");
  }
  if (
    TotValues.k_year < 1978 &&
    TotValues.pub_year == undefined &&
    TotValues.reg_year == undefined
  ) {
    result = TotRules.conclusion("B.vii");
  } else {
    // Intercept the result so we can add encouragement if things look good
    result = TotRules.section304Analysis();
    if (
      result != TotRules.jumpToFinish &&
      TotRules.beforeEndOfNoticeWindow() &&
      !TotRules.hasPublicDomainFlags()
    ) {
      TotNotifications.setEncouragement(
        "Both notice window and copyright status look good, let's get some more details!",
      );
    }
  }
  return result;
};

// Did the agreement or transfer include the right of publication?

TotRules.s1q1f = () => {
  // Intercept the result so we can add encouragement if things look good
  let result = TotRules.section203Analysis();
  if (
    result != TotRules.jumpToFinish &&
    TotRules.beforeEndOfNoticeWindow() &&
    !TotRules.hasPublicDomainFlags()
  ) {
    TotNotifications.setEncouragement(
      "Both notice window and copyright status look good, let's get some more details!",
    );
  }
  return result;
};

TotRules.section203Analysis;

////////////////////////////////////////////////////////////////////////////////
// Section 2
////////////////////////////////////////////////////////////////////////////////

// Is the agreement or transfer you want to terminate part of a last will...

TotRules.s2q2a = () => {
  let result = undefined;
  if (TotValues.last_will == "yes") {
    result = TotRules.conclusion("B.iv");
  } else {
    if (
      TotValues.creation_year > 1977 ||
      ((TotValues.pub_year == undefined || TotValues.pub_year > 1977) &&
        (TotValues.reg_year == undefined || TotValues.reg_year > 1977))
    ) {
      result = "s2q2bi";
    } else {
      result = "s2q2c";
    }
  }
  return result;
};

// Are any of the authors still alive?
// It's i) because the conditional logic that starts b is included in a

TotRules.s2q2bi = () => {
  let result = undefined;
  if (TotValues.any_authors_alive == "yes") {
    result = "s2q2c";
  } else {
    result = "s2q2bi2";
  }
  return result;
};

// What is the year the last surviving author died?

TotRules.s2q2bi2 = () => {
  let result = undefined;
  // creation_year is always set, pub_year may not be, death will be here
  if (TotValues.creation_year > 1977) {
    TotValues.pd = TotValues.death + 71;
  } else if (TotValues.pub_year != undefined && TotValues.pub_year < 2003) {
    TotValues.pd = Math.max(TotValues.death + 71, 2048);
  } else {
    TotValues.pd = Math.max(TotValues.death + 71, 2003);
  }
  // pd *will* have been set in the if/else block
  if (TotValues.current_year > TotValues.pd) {
    result = TotRules.conclusion("B.viii");
  } else {
    result = "s2q2c";
  }
  return result;
};

// Was the work created within the scope of the author’s employment?

TotRules.s2q2c = () => {
  let result = undefined;
  if (TotValues.within_scope_of_employment == "yes") {
    if (TotValues.creation_year > 1977) {
      result = "s2q2ci";
    } else {
      result = TotRules.conclusion("B.i");
    }
  } else {
    result = "s2q2d";
  }
  return result;
};

// Was there an express agreement between you...

TotRules.s2q2ci = () => {
  let result = undefined;
  if (TotValues.express_agreement == "yes") {
    result = "s2q2d";
  } else {
    result = TotRules.conclusion("B.i");
  }
  return result;
};

// Was the work created in response to a special order or commission?

TotRules.s2q2d = () => {
  let result = undefined;
  if (TotValues.special_order == "yes") {
    if (TotValues.creation_year < 1978) {
      TotRules.addFlag("D.i");
      result = "s2q2e";
    } else {
      result = "s2q2di";
    }
  } else {
    result = "s2q2e";
  }
  return result;
};

// Was there a signed written agreement regarding the special order...

TotRules.s2q2di = () => {
  let result = undefined;
  if (TotValues.signed_written_agreement == "yes") {
    if (TotValues.creation_year < 1978) {
      result = TotRules.conclusion("B.iii");
    } else {
      result = "s2q2dia";
    }
  } else {
    result = "s2q2e";
  }
  return result;
};

// Was the work created for use as one of the following? ...

TotRules.s2q2dia = () => {
  let result = undefined;
  if (TotValues.created_as_part_of_motion_picture == "yes") {
    result = TotRules.conclusion("C.ii");
  } else if (TotValues.created_as_part_of_motion_picture == "no") {
    result = "s2q2e";
  } /* don't know */ else {
    TotRules.addFlag("D.ii");
    result = "s2q2e";
  }
  return result;
};

// Has the original transfer since been renegotiated or altered?

TotRules.s2q2e = () => {
  let result = "s2q2f";
  if (TotValues.renego == "yes") {
    TotRules.addFlag("C.i");
  } else if (TotValues.renego == "no") {
    // Continue
  } /* don't know */ else {
    TotRules.addFlag("C.ii");
  }
  return result;
};

// Did one or more of the authors or artists enter into the agreement...

TotRules.s2q2f = () => {
  let result = undefined;
  if (TotValues.authors_entered_agreement == "yes") {
    if (TotValues.k_year < 1978) {
      result = TotRules.conclusionPDF("A.i-ii");
    } /*if (k_year > 1977)*/ else {
      result = TotRules.conclusionPDF("A.iii");
    }
  } else {
    if (TotValues.k_year < 1978) {
      result = "s2q2fii";
    } /*if (TotValues.k_year > 1977)*/ else {
      result = TotRules.conclusion("B.vi");
    }
  }
  return result;
};

// Was the agreement or transfer made by a member of...

TotRules.s2q2fii = () => {
  let result = undefined;
  if (TotValues.agreement_by_family_or_executor) {
    result = TotRules.conclusionPDF("A.i-ii");
  } else {
    result = TotRules.conclusion("B.v");
  }
  return result;
};
