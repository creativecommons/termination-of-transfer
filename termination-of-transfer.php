<?php
use CreativeCommons_TOT\tot\Plugin;
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


/*
Plugin Name: Termination of Tranfer Tool
Plugin URI: https://github.com/creativecommons/termination-of-transfer
Version: 1.0.0
Author: Creative Commons Corporation
Author URI: https://github.com/creativecommons/
Requires PHP: 5.4.0
*/

add_action('plugins_loaded', 'termination_of_contract_tool_init');

function termination_of_contract_tool_init()
{
    $toc = new Plugin();
    $toc['path'] = realpath( plugin_dir_path( __FILE__ ) ) . DIRECTORY_SEPARATOR;
    $toc['url'] = plugin_dir_url( __FILE__ );
    $toc['version'] = '2.0.0';
    $toc->run();
}
?>
