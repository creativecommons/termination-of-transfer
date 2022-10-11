<?php
namespace CreativeCommons_TOT\tot;

/**
 * Serves as a container for the plugin
 */
class Plugin extends WpPlugin implements \ArrayAccess
{
    public function run()
    {
        // Loop on data
        foreach( $this->data as $key => $option ){ 
            if( \is_callable($option) ){
              $option = $this[$key];
            }
            if( \is_object( $option ) ){
              $reflection = new \ReflectionClass( $option );
              if( $reflection->hasMethod( 'run' ) ){
                $option->run(); // Call run method on object
              }
            }
          }
    }

    public function offsetSet( $offset, $value ) {
        $this->data[$offset] = $value;
    }

    public function offsetExists($offset) {
        return isset( $this->data[$offset] );
    }

    public function offsetUnset($offset) {
        unset( $this->data[$offset] );
    }

    public function offsetGet($offset) {
        if( \is_callable($this->data[$offset]) ){
        return \call_user_func( $this->data[$offset], $this );
        }
        return isset( $this->data[$offset] ) ? $this->data[$offset] : null;
    }
}
