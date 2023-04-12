<?php
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

// if uninstall.php is not called by WordPress, kill process
if (!defined(WP_UNINSTALL_PLUGIN)) {
    die;
}

// if the termination-of-transfer-tool shortcode exists, remove it
if (shortcode_exists('termination-of-transfer-tool')) { 
    remove_shortcode('termination-of-transfer-tool');
}