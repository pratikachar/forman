<?php get_header(); ?>

<div class="blog-header">
<h1><?php printf( 'Search Results: %s', get_search_query() ); ?></h1>
</div>

<form role="search" method="get" class="search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
<input type="search" class="search-field" placeholder="Search..." value="<?php echo get_search_query(); ?>" name="s" />
<button type="submit" class="search-submit">Search</button>
</form>

<div class="blog-grid">
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
	<?php get_template_part( 'template-parts/content', get_post_type() ); ?>
<?php endwhile; else : ?>
	<p style="text-align:center;grid-column:1/-1;color:var(--color-on-surface-variant);padding:4rem;">No results found for your search.</p>
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
