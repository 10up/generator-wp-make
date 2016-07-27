import component from './component/component';

if ( window.addEventListener ) {
	window.addEventListener( 'DOMContentLoaded', component, false );
} else if ( window.attachEvent ) {
	window.attachEvent( 'onload', component );
}

if ( 'complete' === document.readyState ) {
	component();
}
