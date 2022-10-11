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
}
