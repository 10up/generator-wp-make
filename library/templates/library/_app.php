<?php
/**
 * <%= opts.projectName %> library autoloader.
 *
 * @author    <%= ( '' !== opts.authorName ) ? opts.authorName : 'me' %> <<%= opts.authorEmail %>>
 * @copyright 2014 <%= ( '' !== opts.authorName ) ? opts.authorName : 'me' %>
 * @license   http://www.opensource.org/licenses/mit-license.html
 * @version   1.0.0
 */
namespace <%= opts.namespace %>\<%= opts.className %>\v1_0_0;
if ( version_compare( PHP_VERSION, "5.3", "<" ) ) {
	trigger_error( "<%= opts.projectName %> requires PHP version 5.3.0 or higher", E_USER_ERROR );
}
// Require files
// if ( ! class_exists( '\\<%= opts.namespace %>\\<%= opts.className %>\\v1_0_0\\ClassName' ) ) {
//     require_once __DIR__ . '/php/filename.php';
// }

// Bootstrap
// ClassName\setup();