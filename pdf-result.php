<?php
require_once plugin_dir_path(__FILE__) . 'vendor/autoload.php';

use CreativeCommons_TOT\ResultPdf;

/*
    Termination of Transfer - tool to help in returning authors rights.
    Copyright (C) 2016, 2017  Creative Commons Corporation.

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

function cc_tot_pdf_result() 
{
    $result = new ResultPdf();
    $result->init();
    return $result->generatePdf();
}

cc_tot_pdf_result();
