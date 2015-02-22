<?php
/**
 * <%= opts.projectName %> library autoloader.
 *
 * @author    <%= ( '' !== opts.authorName ) ? opts.authorName : 'me' %> <<%= opts.authorEmail %>>
 * @copyright 2015 <%= ( '' !== opts.authorName ) ? opts.authorName : 'me' %>
 * @license   http://www.opensource.org/licenses/mit-license.html
 * @version   0.0.1
 */
namespace TenUp\<%= namespace %>;
if ( version_compare( PHP_VERSION, "5.4", "<" ) ) {
	trigger_error( "<%= opts.projectName %> requires PHP version 5.4 or higher", E_USER_ERROR );
}
// Require files
// if ( ! class_exists( '\\TenUp\\<%= namespace %>\\ClassName' ) ) {
//     require_once __DIR__ . '/php/filename.php';
// }

// Bootstrap
// ClassName\setup();