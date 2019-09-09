# map-google-calendar-appointments
A wordpress plugin to show Google Maps of upcoming Google Calendar Appointments

Activate the plugin, add your gmail account name and api key in the ‘Map G-Cal’ sidebar settings tab, and add the [mgca] shortcode on any page to see the maps!

Visit the official homepage of this plugin, https://wordpress.bensevcik.com/ to see a live sample of the plugin
 
REQUIREMENTS
 * This plugin requires a wordpress site running with a TLS certificate (https not just http)
 * Activate the Plugin
 * Share your calendar
 * Add your Gmail account name and API Key to the admin sidebar page named 'Map G-Cal' and hit save 
 * https://YOURWEBSITE/wp-admin/admin.php?page=mgca
 * It has been tested to work with wordpress 5.2.3 - Please submit an issue here in github if it breaks on earlier versions
 

SHARING YOUR CALENDAR:
 1. Go to: https://calendar.google.com/calendar/r/settings
 2. On the left side under "Settings for my calendars", click the name of the calendar you want to use.
 3. Under Access Permissions checkmark "Make available to public"
SIGN UP FOR GOOGLE API KEY
  1. Go to: https://developers.google.com/calendar/quickstart/js
  2. Click "Create API KEY" (a blue button)
  2b. It's best to restrict the key's usage in the API console
  3. Copy the API Key into https://YOURWEBSITE/wp-admin/admin.php?page=mgca
 

