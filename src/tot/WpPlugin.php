<?php
namespace CreativeCommons_TOT\tot;

abstract class WpPlugin
{
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
