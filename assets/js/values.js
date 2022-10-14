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
// Storing answers and computed values
// Questions save their answers here,
// Rules consult these values and add their own.
////////////////////////////////////////////////////////////////////////////////

let TotValues = {};

TotValues.reset = () => {
  let now = new Date();
  TotValues = {
    current_date: now,
    current_year: now.getFullYear(),
    flags: [],
  };
};

//FIXME: Hello namespace pollution

const totVarsToTitles = {
  work_authors: "Author",
  work_title: "Title of Work",
  creation_year: "Creation Year",
  pub_year: "Publication Year",
  grant_pub_year: "Publication Year Under Grant",
  triggering_pub_year: "Triggering Publication Date",
  k_year: "Effective Grant Year",
  user_inputted_k_year: "User Entered Grant Year",
  reg_year: "Copyright Registration Year",
  work_copyright_reg_num: "Registration Number",
  termination_type: "Termination Type",
  work_agreement_type: "Agreement or Transfer Type",
  work_agreement_desc: "Agreement or Transfer Description",
  //'': 'Grantor',
};

let ValuesStack = {};

ValuesStack._stack = [];

ValuesStack.height = () => {
  return ValuesStack._stack.length;
};

ValuesStack.push = () => {
  // Handle the date not liking being serialized.
  let now = TotValues.current_date;
  ValuesStack._stack.push(TotValues);
  // Deep clone
  TotValues = JSON.parse(JSON.stringify(TotValues));
  TotValues.current_date = now;
};

ValuesStack.pop = () => {
  TotValues = ValuesStack._stack.pop();
};
