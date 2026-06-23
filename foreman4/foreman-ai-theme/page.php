<?php get_header(); ?>

<div class="page-content">
<?php while ( have_posts() ) : the_post(); ?>
<h1><?php the_title(); ?></h1>
<div class="entry-content">
<?php the_content(); ?>
</div>
<?php endwhile; ?>
</div>

<?php get_footer(); ?>
