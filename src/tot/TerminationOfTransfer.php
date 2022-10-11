<?php
namespace CreativeCommons_TOT\tot;

/**
 * Handles HTML generating nd shortcode logics
 */
class TerminationOfTransfer
{
    protected $data;

    protected $scripts;

    protected $styles;

    public function __construct(Plugin $params)
    {
        $data = [
            'name' => $params['name'],
            'version' => $params['version'],
            'html' => $params->generateHtml()
        ];
        $this->scripts = $params['scripts'];
        $this->styles = $params['styles'];
        $this->data = $data;
    }

    protected function registerScripts()
    {
        foreach ($this->scripts as $value) {
            $script = \explode('/', $value);
            if (isset($script[1])) {
                $n = $script[1];
                wp_enqueue_script( "tot-$n", plugins_url( "src/$value.js", __FILE__ ) );
            } else {
                wp_enqueue_script($value);
            }
        }
    }

    protected function registerStyles()
    {
        foreach ($this->styles as $value) {
            $style = \explode('/', $value);
            if (isset($style[1])) {
                $n = $style[1];
                wp_enqueue_style( "tot-style-$n", plugins_url( "src/$value.css", __FILE__ ) );
            } else {
                wp_enqueue_style($value);
            }
        }
    }

    public function run()
    {
        if ( ! version_compare( PHP_VERSION, '5.4', '>=' ) ) {
            add_action( 'admin_notices', 'fail_php_version' );
        } elseif ( ! version_compare( get_bloginfo( 'version' ), '4.0', '>=' ) ) {
            add_action( 'admin_notices', 'fail_wp_version' );
        } else {
            add_shortcode( 'termination-of-transfer-tool', [$this, 'handleShortcode'] );
        }
    }
    

    /**
     * 
     * @param $atts Array
     */
    public function handleShortcode( $atts = [] )
    {
        $this->registerScripts();
        $this->registerStyles();
        return $this->data['html'];
    }

    /**
     * Notice for minimum PHP version.
     *
     * Warning when the site does not meet the minimum required PHP version.
     *
     * @return void
     */
    public function fail_php_version() {
        /* translators: %s: PHP version */
        $v = $this->data['version'];
        $n = $this->data['name'];
        $message = sprintf( "Version $v of $n requires PHP version %s+, plugin is currently NOT RUNNING", '5.4' );
        $html_message = sprintf( '<div class="error">%s</div>', wpautop( $message ) );
        echo wp_kses_post( $html_message );
    }

    /**
     * Notice for minimum WordPress version.
     *
     * Warning when the site does not meet the minimum required WordPress version.
     *
     * @return void
     */
    public function fail_wp_version() {
        /* translators: %s: WordPress version */
        $v = $this->data['version'];
        $n = $this->data['name'];
        $message      = sprintf( "Version $v of $n requires WordPress version %s+. Because you are using an earlier version, the plugin is currently NOT RUNNING", '4.0' );
        $html_message = sprintf( '<div class="error">%s</div>', wpautop( $message ) );
        echo wp_kses_post( $html_message );
    }
}