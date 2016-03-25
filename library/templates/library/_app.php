<?php
/**
 * <%= opts.projectTitle %> library autoloader.
 *
 * @author    <%= ( '' !== opts.authorName ) ? opts.authorName : 'me' %> <<%= opts.authorEmail %>>
 * @copyright <%= new Date().getFullYear() %> <%= ( '' !== opts.authorName ) ? opts.authorName : 'me' %>
 * <% if ( opts.licenseurl ) { %>@license   <%= opts.licenseuri %><% } %>
 * @version   0.1.0
 */
namespace <%= opts.root_namespace %>\<%= namespace %>;
if ( version_compare( PHP_VERSION, "<%= opts.php_min %>", "<" ) ) {
	trigger_error( '<%= opts.projecTitle %> requires PHP version <%= opts.php_min %> or higher', E_USER_ERROR );
}
// Require files
// if ( ! class_exists( '\\<%= opts.root_namespace %>\\<%= namespace %>\\Sub_Namespace' ) ) {
//     require_once __DIR__ . '/php/functions/sub_namespace.php';
// }

// Bootstrap
// Sub_Namespace\setup();