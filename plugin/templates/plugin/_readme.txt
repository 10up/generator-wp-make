=== <%= opts.projectTitle %> ===
Contributors:      <%= opts.authorName %>
Donate link:       <%= opts.authorUrl %>
Tags: 
Requires at least: <%= opts.wp_min %>
Tested up to:      <%= opts.wp_tested %>
Stable tag:        0.1.0
<% if ( opts.license ) { %>License:           <%= opts.license %><% } %>
<% if ( opts.licenseuri ) { %>License URI:       <%= opts.licenseuri %><% } %>

<%= opts.description %>

== Description ==



== Installation ==

= Manual Installation =

1. Upload the entire `/<%= basename %>` directory to the `/wp-content/plugins/` directory.
2. Activate <%= opts.projectTitle %> through the 'Plugins' menu in WordPress.

== Frequently Asked Questions ==


== Screenshots ==


== Changelog ==

= 0.1.0 =
* First release

== Upgrade Notice ==

= 0.1.0 =
First Release
