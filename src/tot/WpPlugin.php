<?php
namespace CreativeCommons_TOT\tot;

abstract class WpPlugin
{
    /**
     * @var Array holds the plugin data/options
     */
    protected $data;

    public function __construct()
    {
        // ensure this script was not called directly
        if ( ! defined( 'ABSPATH' ) ) {
            exit;
        }
        $this->data = [];
    }

    /**
     * This will only work in 5.3 or later and WP 3.8 allows 2.4.2+ ... 
     */
    public function generateHtml()
    {
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
        return $tot_tool_html;
    }
}
