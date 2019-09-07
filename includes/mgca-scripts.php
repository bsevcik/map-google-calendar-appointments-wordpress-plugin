<?php
// ADD SCRIPTS
function mgca_add_scripts(){
    // ADD MAIN CSS
    wp_enqueue_style('mgca-main-style', plugins_url(). '/map-google-calendar-appointments/css/style.css');
    // ADD MAIN JS
    wp_enqueue_script('mgca-main-script', plugins_url(). '/map-google-calendar-appointments/js/main.js');
}

add_action('wp_enqueue_scripts', 'mgca_add_scripts');