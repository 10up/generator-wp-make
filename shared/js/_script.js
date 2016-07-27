/**
 * <%= opts.projectTitle %>
 * <%= opts.projectHome %>
 *
 * Copyright (c) <%= new Date().getFullYear() %> <%= opts.authorName %>
 * <% if ( opts.license ) { %>Licensed under the <%= opts.license %> license.<% } %>
 */
// Import dependencies.
import component from './component/component';

if ( window.addEventListener ) {
	// Initiate our script once the Document Object Model is set.
	window.addEventListener( 'DOMContentLoaded', component, false );
} else if ( window.attachEvent ) {
	// Internet Explorer fallback. Initiate our script 'onload'.
	window.attachEvent( 'onload', component );
}

// Initiate our script if it is loaed after the Document ready state is already complete.
if ( 'complete' === document.readyState ) {
	component();
}
