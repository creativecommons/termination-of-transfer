<?php
namespace CreativeCommons_TOT;

use Smarty;
use Mpdf\Mpdf;
/*
    Termination of Transfer - tool to help in returning authors rights.
    Copyright (C) 2016, 2017 Creative Commons Corporation.

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

class ResultPdf
{
    public $data;

    protected $results_strings;

    protected $flags;

    protected $conclusion_path;

    protected $conclusion_section;

    protected $conclusion_title;

    protected $conclusion_details;

    protected $conclusion_subtitle;

    protected $conclusion_description;

    public function __construct()
    {
        ////////////////////////////////////////////////////////////////////////////////
        // Make sure we have the data to decode
        ////////////////////////////////////////////////////////////////////////////////

        if (! isset($_POST['data'])) {
            exit('No data provided.');
        }
    }

    public function init()
    {
        $this->validate();
        $this->getFlags();
    }

    public function validate()
    {
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
        $this->data = $data;
    }

    public function flagTitleAndDescription ($spec)
    {
        $results_json = file_get_contents(\dirname(__DIR__ ). '/js/results.json');
        $this->results_strings = json_decode($results_json, true);
        $path = explode('.', $spec);
        // A, B, C, D
        $section = $this->results_strings['Flag'][$path[0]];
        // i, ii, iii
        $subsection = $section[$path[1]];
        // For historical reasons, some flags take their section title and have
        // their description under 'b', and others have their own title and their
        // description under 'description'
        if (array_key_exists('description', $subsection)) {
            $title = $subsection['title'];
            $description = $subsection['description'];
        } else {
            $title = $section['title'];
            $description = $subsection['b'];
        }
        return [$title, $description];
    }

    public function getFlags()
    {
        ////////////////////////////////////////////////////////////////////////////////
        // Flag and conclusion expansion
        ////////////////////////////////////////////////////////////////////////////////
        $this->flags = array_map([$this, 'flagTitleAndDescription'], $this->data['flags']);
        $this->conclusion_path = explode('.', $this->data['conclusion']);
        $this->conclusion_section = $this->results_strings['Conclusion'][$this->conclusion_path[0]];
        $this->conclusion_title = $this->conclusion_section['title'];
        $this->conclusion_details = $this->conclusion_section[$this->conclusion_path[1]];
        $this->conclusion_subtitle = $this->conclusion_details['title'];
        $this->conclusion_description = $this->conclusion_details['description'];
    }

    public function generatePdf()
    {
        ////////////////////////////////////////////////////////////////////////////////
        // Fill out the template with the details from the provided data
        ////////////////////////////////////////////////////////////////////////////////

        $now_timestamp = intval($this->data['report_timestamp']);

        $smarty = new Smarty;
        $smarty->setCompileDir(\dirname(__DIR__) . '/../templates_c');
        $smarty->assign('date', date('jS F Y', $now_timestamp));
        $smarty->assign('flags', $this->flags);
        $smarty->assign('details', $this->data['details']);
        $smarty->assign('conclusion_title', $this->conclusion_title);
        $smarty->assign('conclusion_subtitle', $this->conclusion_subtitle);
        $smarty->assign('conclusion_description', $this->conclusion_description);
        $html = $smarty->fetch(\dirname(__DIR__) . '/../template/result.tpl');

        ////////////////////////////////////////////////////////////////////////////////
        // Generate and return the PDF
        ////////////////////////////////////////////////////////////////////////////////

        $mpdf = new mPDF();
        $mpdf->WriteHTML($html);
        return $mpdf->Output('ToT.pdf', 'I');
    }
}

$result = new ResultPdf();
$result->init();
return $result->generatePdf();
