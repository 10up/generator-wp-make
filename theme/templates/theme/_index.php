<?php
/**
 * The main template file
 *
 * @package <%= opts.projectTitle %>
 * @since 0.1.0
 */

get_header(); ?>

	<?php if ( have_posts() ) : ?>
		<?php while ( have_posts() ): the_post(); ?>
			<h2><?php the_title(); ?></h2>
			<?php the_content(); ?>
		<?php endwhile; ?>
	<?php endif; ?>

<?php get_footer();
