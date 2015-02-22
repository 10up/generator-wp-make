<?php
/**
 * <%= opts.projectTitle %> library autoloader.
 *
 * @author    <%= ( '' !== opts.authorName ) ? opts.authorName : 'me' %> <<%= opts.authorEmail %>>
 * @copyright 2015 <%= ( '' !== opts.authorName ) ? opts.authorName : 'me' %>
 * @license   http://www.opensource.org/licenses/mit-license.html
 * @version   0.0.1
 */
namespace TenUp\<%= namespace %>;
if ( version_compare( PHP_VERSION, "5.4", "<" ) ) {
	trigger_error( '<%= opts.projecTitle %> requires PHP version 5.4 or higher', E_USER_ERROR );
}
// Require files
// if ( ! class_exists( '\\TenUp\\<%= namespace %>\\Sub_Namespace' ) ) {
//     require_once __DIR__ . '/php/functions/sub_namespace.php';
// }

// Bootstrap
// Sub_Namespace\setup();