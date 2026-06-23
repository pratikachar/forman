<article id="post-<?php the_ID(); ?>" <?php post_class( 'blog-card' ); ?>>
<?php if ( has_post_thumbnail() ) : ?>
<div class="blog-card-thumb">
<a href="<?php the_permalink(); ?>"><?php the_post_thumbnail( 'large' ); ?></a>
</div>
<?php endif; ?>
<div class="blog-card-body">
<div class="blog-card-cat"><?php the_category( ', ' ); ?></div>
<h2 class="blog-card-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
<div class="blog-card-excerpt"><?php the_excerpt(); ?></div>
<div class="blog-card-meta">
<span><?php echo get_the_date(); ?></span>
<span><?php comments_number( '0 Comments', '1 Comment', '% Comments' ); ?></span>
</div>
</div>
</article>
