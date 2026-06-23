<?php get_header(); ?>

<div class="single-post">
<?php while ( have_posts() ) : the_post(); ?>
<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
<div class="single-header">
<?php
the_category( ' ' );
the_title( '<h1>', '</h1>' );
?>
<div class="single-meta">
<span><?php echo get_the_date(); ?></span>
<span><?php the_author(); ?></span>
</div>
</div>

<?php if ( has_post_thumbnail() ) : ?>
<div class="single-feat-img">
<?php the_post_thumbnail( 'full' ); ?>
</div>
<?php endif; ?>

<div class="single-content">
<?php the_content(); ?>
</div>

<div class="single-nav">
<div class="nav-previous"><?php previous_post_link( '%link', '&larr; Previous Post' ); ?></div>
<div class="nav-next"><?php next_post_link( '%link', 'Next Post &rarr;' ); ?></div>
</div>

<?php comments_template(); ?>
</article>
<?php endwhile; ?>
</div>

<?php get_footer(); ?>
