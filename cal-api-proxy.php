<?php

/**
 * @param whitelist
 * @param curl_opts
 * @param zlib
 */


if (!defined('ABSPATH')){
    echo 'you have reached this page in error';
    // exit; // Exit file if accessed directly
}

// BUILD THE GOOGLE CALENDAR API URL
$parse_uri = explode( 'wp-content', $_SERVER['SCRIPT_FILENAME'] );
require_once( $parse_uri[0] . 'wp-load.php' );
$baseURL = "https://www.googleapis.com/calendar/v3/calendars/";
$gmailAccount = get_option( 'mgca_options_gmail_account' );
$baseURL2 = "/events?";
$gcalAPIKey = "key=".get_option( 'mgca_options_gcal_api_key' );
$baseURL3 = "&maxResults=9999&orderBy=startTime&singleEvents=true";
$url = $baseURL . $gmailAccount . $baseURL2 . $gcalAPIKey . $baseURL3;
// echo $url;

// https://www.googleapis.com/calendar/v3/calendars/bensevcik%40gmail.com/events?key=AIzaSyAJV0pH9dpVwdNZeLajIGsIpjcPu3tVgAE&maxResults=2
// $url = "http://data.ncaa.com/casablanca/scoreboard/football/fbs/2019/01/scoreboard.json";


// RUN CURL AND ECHO RESULT
// google requires tls the whole way, so it's hard to develop on localhost :(
$handle = curl_init();
curl_setopt($handle, CURLOPT_URL, $url);
// Set the result output to be a string.
curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
$output = curl_exec($handle);
curl_close($handle);
echo $output;


// // Get normalized headers and such
// $headers = array_change_key_case(getallheaders());
// $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
// $url = $headers['x-proxy-url'] ?? null;
// $cookie = $headers['x-proxy-cookie'] ?? null;
// // Check that we have a URL
// if( ! $url)
// 	failure(400, "X-Proxy-Url header missing");
// // Check that the URL looks like an absolute URL
// if( ! parse_url($url, PHP_URL_SCHEME))
// 	failure(400, "Not an absolute URL: $url");
// // Check referer hostname
// if( ! parse_url($headers['referer'] ?? null, PHP_URL_HOST) == $_SERVER['HTTP_HOST'])
// 	failure(403, "Invalid referer");
// // Check whitelist, if not empty
// if( ! array_reduce($whitelist ?? [], 'is_bad', [$url, false]))
// 	failure(403, "Not whitelisted: $url");
// // Remove ignored headers
// $ignore = [
// 	'cookie',
// 	'content-length',
// 	'host',
// 	'x-proxy-url',
// 	'x-proxy-cookie',
// 	];
// $headers = array_diff_key($headers, array_flip($ignore));
// // Set proxied cookie if we got one
// if($cookie)
// 	$headers['Cookie'] = $cookie;
// // Format headers for curl
// foreach($headers as $key => &$value)
// 	$value = ucwords($key, '-').": $value";
// // Init curl
// $curl = curl_init();
// $maxredirs = $opts[CURLOPT_MAXREDIRS] ?? 20;
// do
// {
// 	// Set options
// 	curl_setopt_array($curl,
// 		[
// 			CURLOPT_URL => $url,
// 			CURLOPT_HTTPHEADER => $headers,
// 			CURLOPT_HEADER => true,
// 		]
// 		+ ($curl_opts ?? []) +
// 		[
// 			CURLOPT_FOLLOWLOCATION => true,
// 			CURLOPT_MAXREDIRS => $maxredirs,
// 		]);
// 	// Method specific options
// 	switch($method)
// 	{
// 		case 'HEAD':
// 			curl_setopt($curl, CURLOPT_NOBODY, true);
// 			break;
// 		case 'GET':
// 			break;
// 		case 'PUT':
// 		case 'POST':
// 		case 'DELETE':
// 		default:
// 			curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
// 			curl_setopt($curl, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
// 			break;
// 	}
// 	// Perform request
// 	ob_start();
// 	curl_exec($curl);
// 	$out = ob_get_clean();
// 	// Light error handling
// 	if(curl_errno($curl))
// 	switch(curl_errno($curl))
// 	{
// 		// Connect timeout => Service Unavailable
// 		case 7:
// 			failure(503, $curl);
// 		// Operation timeout => Gateway Timeout
// 		case 28:
// 			failure(504, $curl);
// 		// Other errors => Service Unavailable
// 		default:
// 			failure(503, $curl);
// 	}
// 	// HACK: Workaround if not following, which happened once...
// 	$url = curl_getinfo($curl, CURLINFO_REDIRECT_URL);
// }
// while($url and --$maxredirs > 0);
// // Get curl info and close handler
// $info = curl_getinfo($curl);
// curl_close($curl);
// // Remove any existing headers
// header_remove();
// // Use zlib, if acceptable
// ini_set('zlib.output_compression', $zlib ?? 'On');
// // Get content and headers
// $content = substr($out, $info['header_size']);
// $headers = substr($out, 0, $info['header_size']);
// // Rename Set-Cookie header
// $headers = preg_replace('/^Set-Cookie:/im', 'X-Proxy-Set-Cookie:', $headers);
// // Output headers
// foreach(explode("\r\n", $headers) as $h)
// 	// HACK: Prevent chunked encoding issues (Issue #1)
// 	if( ! preg_match('/^Transfer-Encoding:/i', $h))
// 		header($h, false);
// // HACK: Prevent gzip issue (Issue #1)
// header('Content-Length: '.strlen($content), true);
// // Output content
// echo $content;
// function failure(int $status, $text)
// {
// 	if(is_resource($text))
// 		$text = sprintf('[%s] %s', curl_errno($text), curl_error($text));
// 	http_response_code($status);
// 	header("X-Proxy-Curl-Error: $text");
// 	exit($text);
// }
// function is_bad($carry, array $rule): bool
// {
// 	static $url;
// 	if(is_array($carry))
// 	{
// 		$url = parse_url($carry[0]);
// 		$url['raw'] = $carry[0];
// 		$carry = $carry[1];
// 	}
// 	// Equals full URL
// 	if(isset($rule[0]))
// 		return $carry or $url['raw'] == $rule[0];
	
// 	// Regex matches URL
// 	if(isset($rule['regex']))
// 		return $carry or preg_match($rule['regex'], $url['raw']);
// 	// Components in rule matches same components in URL
// 	return $carry or $rule == array_intersect_key($url, $rule);
// }