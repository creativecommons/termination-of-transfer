<?php
use CreativeCommons_TOT\tot\Plugin;
use CreativeCommons_TOT\tot\TerminationOfTransfer;

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
Requires PHP: 7.4.0
*/

add_action('plugins_loaded', 'termination_of_transfer_tool_init');

function termination_of_transfer_tool_init()
{
    $tot_plugin = new Plugin();
    // the instaled directory path
    $tot_plugin['path'] = realpath( plugin_dir_path( __FILE__ ) ) . DIRECTORY_SEPARATOR;
    // the instaled directory url
    $tot_plugin['url'] = plugin_dir_url( __FILE__ );
    // the current plugin version
    $tot_plugin['version'] = '2.0.0';
    // the plugin name
    $tot_plugin['name'] = 'Termination of Tranfer Tool';
    // the scripts to load, if prefixed with js/ then it's located in the plugin scripts folder
    $tot_plugin['scripts'] = [
        'jquery',
        'js/values',
        'js/rules',
        'js/validation',
        'js/widgets',
        'js/rendering',
        'js/pdf',
        'js/questions'
    ];
    // the styles to load, if prefixed with css/ then it's located in the plugin styles folder
    $tot_plugin['styles'] = [];
    // termination of transfer main logics
    $tot_plugin['tool'] = new TerminationOfTransfer($tot_plugin);
    $tot_plugin->run();
}
?>
