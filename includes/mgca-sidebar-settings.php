<?php

/**
 * @internal never define functions inside callbacks.
 * these functions could be run multiple times; this would result in a fatal error.
 */
 
/**
 * custom option and settings
 */
function mgca_settings_init() {
// REGISTER SETTINGS IN 'mgca' PAGE (FOUND ON SIDEBAR)
    register_setting( 'mgca', 'mgca_options_gcal_api_key', 'esc_attr' );
    register_setting( 'mgca', 'mgca_options_gmail_account', 'esc_attr' );

    
// REGISTER SECTION IN "mgca" PAGE
    add_settings_section(
    'mgca_section_developers', // Section ID
    'Required Settings', // Section Title
    'mgca_section_developers_cb',  // Callback
    'mgca' // Page this section shows up on
    );
    
// REGISTER GCAL API FIELD in the "mgca_section_developers" section, inside the plugin settings page which is found on the sidebar
    add_settings_field(
        'mgca_field_gcal_api_key', // Slug-name to identify the field. Used to be option ID? as of WP 4.6 this value is used only internally
        // use $args' label_for to populate the id inside the callback
        'Google Calendar Api Key:', // Title, outputs as the label for the field
        'mgca_field_gcal_api_key_cb', // Callback function that fills the field with desired form inputs. The function should echo its output.
        'mgca', // Choose which settings page this field will appear on 
        'mgca_section_developers',
        [ 
            'label_for' => 'mgca_field_gcal_api_key',
            'class' => 'mgca_row',
            'mgca_custom_data' => 'custom',
        ]
    );
// REGISTER GMAIL FIELD in the "mgca_section_developers" section, inside the plugin settings page which is found on the sidebar
    add_settings_field(
        'mgca_field_gmail_account', // Slug-name to identify the field. Used to be option ID? as of WP 4.6 this value is used only internally
        // use $args' label_for to populate the id inside the callback
        'Gmail account (ie: example@gmail.com):', // Title, outputs as the label for the field
        'mgca_field_gmail_account_cb', // Callback function that fills the field with desired form inputs. The function should echo its output.
        'mgca', // Choose which settings page this field will appear on 
        'mgca_section_developers', // Choose which section of the settings page to show the box
        // $args array for optional extra arguments used when outputting the field
        [ 
            'label_for' => 'mgca_field_gmail_account',
            'class' => 'mgca_row',
            'mgca_custom_data' => 'custom',
        ]
    );
}
    

// REGISTER mgca_settings_init to the admin_init action hook
add_action( 'admin_init', 'mgca_settings_init' );


// ADD_SETTINGS_SECTION CALLBACK
// section callbacks can accept an $args parameter, which is an array.
// $args have the following keys defined: title, id, callback.
// the values are defined at the add_settings_section() function.
function mgca_section_developers_cb( $args ) {
    ?>
    <p id="<?php echo esc_attr( $args['id'] ); ?>"><?php esc_html_e( 'Enter your Google Calendar information. Documentation on generating a Google Calendar api key is a work in progress.', 'mgca' ); ?></p>
    <?php
}



// FIRST SETTINGS FIELD CALLBACK FOR API KEY INFO
// field callbacks can accept an $args parameter, which is an array.
// $args is defined at the add_settings_field() function.
// wordpress has magic interaction with the following keys: label_for, class.
// the "label_for" key value is used for the "for" attribute of the <label>.
// the "class" key value is used for the "class" attribute of the <tr> containing the field.
// you can add custom key value pairs to be used inside your callbacks.
function mgca_field_gcal_api_key_cb( $args ) {
    // get the value of the setting we've registered with register_setting()
    $option = get_option( 'mgca_options_gcal_api_key' );
    // output the field
    ?>
    <input 
        id="<?php echo esc_attr( $args['label_for'] ); ?>"
        type="text"
        data-custom="custom"
        name="mgca_options_gcal_api_key"
        value="<?php echo $option; ?>"
    >
    <?php
}

// SECOND SETTINGS FIELD CALLBACK FOR GMAIL ACCOUNT INFO
// field callbacks can accept an $args parameter, which is an array.
// $args is defined at the add_settings_field() function.
// wordpress has magic interaction with the following keys: label_for, class.
// the "label_for" key value is used for the "for" attribute of the <label>.
// the "class" key value is used for the "class" attribute of the <tr> containing the field.
// you can add custom key value pairs to be used inside your callbacks.
function mgca_field_gmail_account_cb( $args ) {
    // get the value of the setting we've registered with register_setting()
    $option = get_option( 'mgca_options_gmail_account' );
    // output the field
    ?>

    <input 
        id="<?php echo esc_attr( $args['label_for'] ); ?>"
        type="text"
        data-custom="custom"
        name="mgca_options_gmail_account"
        value="<?php echo $option ?>"
    >
    <?php
}



/**
* top level menu
*/
function mgca_options_gcal_api_key_page() {
    // add top level menu page
    add_menu_page(
    'Map Google Calendar Appointment Plugin Settings', // H1 inside page
    'Map G-Cal', // The name of the sidebar link
    'manage_options', // the capability required for this menu to be displayed to the user
    'mgca', // The slug name to refer to this menu by. Should be unique for this menu page and only include lowercase alphanumeric, dashes, and underscores characters to be compatible with sanitize_key().
    'mgca_options_page_html', // callback function to output the content for this page
    'dashicons-calendar-alt' // optional url to the icon for this menu, could use a base64-encoded SVG disicons, or pass 'none' to allow for icon via css
    );
}

/**
* register our mgca_options_gcal_api_key_page to the admin_menu action hook
*/
add_action( 'admin_menu', 'mgca_options_gcal_api_key_page' );

/**
* top level menu:
* callback functions
*/
function mgca_options_page_html() {
    // check user capabilities
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }

    // add error/update messages

    // check if the user have submitted the settings
    // wordpress will add the "settings-updated" $_GET parameter to the url
    if ( isset( $_GET['settings-updated'] ) ) {
        // add settings saved message with the class of "updated"
        add_settings_error( 'mgca_messages', 'mgca_message', __( 'Settings Saved', 'mgca' ), 'updated' );
    }

    // show error/update messages
    settings_errors( 'mgca_messages' );
    ?>
    <div class="wrap">
    <h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
    <form action="options.php" method="post">
    <?php
    // output security fields for the registered setting "mgca"
    settings_fields( 'mgca' );
    // output setting sections and their fields
    // (sections are registered for "mgca", each field is registered to a specific section)
    do_settings_sections( 'mgca' );
    // output save settings button
    submit_button( 'Save Settings' );
    ?>
    </form>
    </div>
    <?php
}