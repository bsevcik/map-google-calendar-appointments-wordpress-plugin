<?php
/** 
 * Plugin Name: Map Google Calendar Appointments
 * Plugin URI: wordpress.bensevcik.com/map-calendar-plugin
 * Description: See Google Maps of your upcoming Google Calendar appointments
 * Author: Ben Sevcik
 * Author URI: BenSevcik.com
 * Version: 1.0
*/

//  EXIT IF ACCESSED DIRECTLY
if (!defined('ABSPATH')){
    echo 'you have reached this page in error';
    exit;
}

// LOAD SCRIPTS
require_once(plugin_dir_path(__FILE__).'/includes/mgca-scripts.php');
require_once(plugin_dir_path(__FILE__).'/includes/mgca-sidebar-settings.php');

// SET [mgca] SHORTCODE
function mgca_func( $atts ) {
	$a = shortcode_atts( array(
		'minShowing' => '4',
		'maxShowing' => '6',
	), $atts );

    // return "minShowing = {$a['minShowing']}";
    return 
        '<section id="googleMapSection">
        <p>Choose A Date To See Where We\'ll Be!</p>
        <input type="date" id="datePicker" value="" /><br />
        <!-- <h1>Upcoming Events</h1> -->
        <div id="eventMapLinks"></div>
        </section>';
}
add_shortcode( 'mgca', 'mgca_func' );




// function eg_settings_api_init() {
//     // Add the section to reading settings so we can add our
//     // fields to it
//     add_settings_section(
//        'eg_setting_section',
//        'Example settings section in reading',
//        'eg_setting_section_callback_function',
//        'reading'
//    );
    
//     // Add the field with the names and function to use for our new
//     // settings, put it in our new section
//     add_settings_field(
//        'eg_setting_name',
//        'Example setting Name',
//        'eg_setting_callback_function',
//        'reading',
//        'eg_setting_section'
//    );
    
//     // Register our setting so that $_POST handling is done for us and
//     // our callback function just has to echo the <input>
//     register_setting( 'reading', 'eg_setting_name' );
// } // eg_settings_api_init()

// add_action( 'admin_init', 'eg_settings_api_init' );

 
// // ------------------------------------------------------------------
// // Settings section callback function
// // ------------------------------------------------------------------
// //
// // This function is needed if we added a new section. This function 
// // will be run at the start of our section
// //

// function eg_setting_section_callback_function() {
//     echo '<p>Intro text for our settings section</p>';
// }

// // ------------------------------------------------------------------
// // Callback function for our example setting
// // ------------------------------------------------------------------
// //
// // creates a checkbox true/false option. Other types are surely possible
// //

// function eg_setting_callback_function() {
//     echo '<input name="eg_setting_name" id="eg_setting_name" type="checkbox" value="1" class="code" ' . checked( 1, get_option( 'eg_setting_name' ), false ) . ' /> Explanation text';
// }