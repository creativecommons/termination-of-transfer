<?php
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

require __DIR__ . '/../vendor/autoload.php';

////////////////////////////////////////////////////////////////////////////////
// Make sure we have the data to decode
////////////////////////////////////////////////////////////////////////////////

if (! isset($_POST['data'])) {
    exit('No data provided.');
}

////////////////////////////////////////////////////////////////////////////////
// Decode the data
////////////////////////////////////////////////////////////////////////////////

$data = json_decode($_POST['data'], true);

////////////////////////////////////////////////////////////////////////////////
// Make sure the data is well-structured
////////////////////////////////////////////////////////////////////////////////

if (!isset($data['report_timestamp'])) {
    exit('Report timestamp not provided.');
}

if (!isset($data['conclusion'])) {
    exit('Conclusion not provided.');
}

if (!isset($data['flags'])) {
    exit('Flags not provided.');
}

if (!isset($data['details'])) {
    exit('Details not provided.');
}

////////////////////////////////////////////////////////////////////////////////
// Flag and conclusion expansion
////////////////////////////////////////////////////////////////////////////////

$results_json = file_get_contents(__DIR__ . '/js/results.json');
$results_strings = json_decode($results_json, $assoc=true);

$flags = array_map(function ($spec) {
    global $results_strings;
    $path = explode('.', $spec);
    return [$results_strings['Flag'][$path[0]]['title'],
            $results_strings['Flag'][$path[0]][$path[1]]['b']];
},
    $data['flags']);

$conclusion_path = explode('.', $data['conclusion']);
$conclusion_section = $results_strings['Conclusion'][$conclusion_path[0]];
$conclusion_title = $conclusion_section['title'];
$conclusion_details = $conclusion_section[$conclusion_path[1]];
$conclusion_subtitle = $conclusion_details['title'];
$conclusion_description = $conclusion_details['description'];

////////////////////////////////////////////////////////////////////////////////
// Fill out the template with the details from the provided data
////////////////////////////////////////////////////////////////////////////////

$now_timestamp = intval($data['report_timestamp']);

$smarty = new Smarty;
$smarty->setCompileDir(__DIR__ . '/../templates_c');
$smarty->assign('date', date('jS F Y', $now_timestamp));
$smarty->assign('flags', $flags);
$smarty->assign('details', $data['details']);
$smarty->assign('conclusion_title', $conclusion_title);
$smarty->assign('conclusion_subtitle', $conclusion_subtitle);
$smarty->assign('conclusion_description', $conclusion_description);
$html = $smarty->fetch(__DIR__ . '/../template/result.tpl');

////////////////////////////////////////////////////////////////////////////////
// Generate and return the PDF
////////////////////////////////////////////////////////////////////////////////

$mpdf = new mPDF();
$mpdf->WriteHTML($html);
$mpdf->Output('ToT.pdf', 'I');
