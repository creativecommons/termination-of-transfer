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


/*
Plugin Name: Termination of Tranfer Tool
Plugin URI: https://github.com/creativecommons/termination-of-transfer
Version: 1.0.0
Author: Creative Commons Corporation
Author URI: https://github.com/creativecommons/
*/

// This will only work in 5.3 or later and WP 3.8 allows 2.4.2+ ...
$tot_tool_html = <<<'EOD'
       <div class="panel panel-info hidden" id="answers-table">
         <div class="panel-heading">
           <h3 class="panel-title">Your answers</h3>
         </div>
         <div class="panel-body">
           <table class="table table-striped">
             <tbody id="answers-table-rows">
             </tbody>
           </table>
         </div>
       </div>

       <div class="panel panel-primary hidden" id="questionnaire-section">
        <div class="panel-heading">
          <h3 class="panel-title" id="section-title"></h3>
        </div>
        <div class="panel-body" id="question-rendering-area">
        </div>
       </div>

      <div id="alert-area">
      </div>

      <div class="panel hidden" id="result-area">
        <div class="panel-heading">
          <h3 class="panel-title" id="result-area-title"></h3>
        </div>
        <div class="panel-body" id="result-area-message">
        </div>
      </div>

      <div class="hidden" id="question-progress-buttons">
        <button class="btn btn-default" id="button-question-back">Back</button>
        <button class="btn btn-default" id="button-question-next">Next</button>
        <a href="."
           class="btn btn-default hidden"
           id="button-restart">Restart</a>
      </div>
EOD;


//[termination-of-transfer-tool]
function tot_tool_handle_shortcode( $atts ){
    global $tot_tool_html;
    wp_enqueue_script("jquery");
    wp_enqueue_script( 'tot-values',
                       plugins_url( 'js/values.js', __FILE__ ) );
    wp_enqueue_script( 'tot-rules',
                       plugins_url( 'js/rules.js', __FILE__ ) );
    wp_enqueue_script( 'tot-validation',
                       plugins_url( 'js/validation.js', __FILE__ ) );
    wp_enqueue_script( 'tot-widgets',
                       plugins_url( 'js/widgets.js', __FILE__ ) );
    wp_enqueue_script( 'tot-rendering',
                       plugins_url( 'js/rendering.js', __FILE__ ) );
    wp_enqueue_script( 'tot-pdf',
                       plugins_url( 'js/pdf.js', __FILE__ ) );
    wp_enqueue_script( 'tot-questions',
                       plugins_url( 'js/questions.js', __FILE__ ) );
	return $tot_tool_html;
}

add_shortcode( 'termination-of-transfer-tool',
               'tot_tool_handle_shortcode' );
