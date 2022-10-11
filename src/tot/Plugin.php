<?php
namespace CreativeCommons_TOT\tot;

/**
 * Handles HTML generating nd shortcode logics
 */
class Plugin
{
    public function run()
    {
        
    }
    /**
     * This will only work in 5.3 or later and WP 3.8 allows 2.4.2+ ... 
     */
    protected function generateHtml()
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

    /**
     * 
     * @param $atts
     */
    public function handleShortcode( $atts ){
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
        return $this->generateHtml();
    }
}
