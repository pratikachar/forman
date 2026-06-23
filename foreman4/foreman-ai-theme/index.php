<?php get_header(); ?>

<div class="blog-header">
<h1><?php echo is_home() ? get_the_title( get_option( 'page_for_posts' ) ) : get_bloginfo( 'name' ); ?></h1>
<p><?php echo get_bloginfo( 'description' ); ?></p>
</div>

<div class="blog-grid">
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
	<?php get_template_part( 'template-parts/content', get_post_type() ); ?>
<?php endwhile; else : ?>
	<p style="text-align:center;grid-column:1/-1;color:var(--color-on-surface-variant);padding:4rem;">No posts found.</p>
<?php endif; ?>
</div>

<?php
the_posts_pagination( array(
	'mid_size'  => 2,
	'prev_text' => '&laquo;',
	'next_text' => '&raquo;',
	'class'     => 'pagination',
) );
?>

<?php get_footer(); ?>
