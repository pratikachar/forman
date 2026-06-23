<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<?php
$desc = is_front_page()
	? 'Foreman AI automates construction estimating, blueprint takeoffs, and material procurement. Win bids faster with real-time electrical, plumbing, and HVAC cost calculations for contractors.'
	: get_bloginfo( 'description' );
?>
<meta name="description" content="<?php echo esc_attr( $desc ); ?>" />
<meta name="keywords" content="construction estimating software, construction takeoff software, electrical estimating, plumbing estimating, HVAC estimating, contractor bid software, blueprint takeoff, material procurement, construction management, foreman AI, field intelligence, construction automation, job site estimating" />
<meta name="robots" content="index, follow" />
<meta name="author" content="Foreman AI Inc." />
<link rel="canonical" href="<?php echo esc_url( get_permalink() ?: home_url( '/' ) ); ?>" />
<link rel="icon" type="image/x-icon" href="<?php echo esc_url( FOREMAN_THEME_URI . '/favicon.ico' ); ?>" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<meta property="og:title" content="<?php echo esc_attr( wp_get_document_title() ); ?>" />
<meta property="og:description" content="<?php echo esc_attr( $desc ); ?>" />
<meta property="og:type" content="<?php echo is_singular() ? 'article' : 'website'; ?>" />
<meta property="og:url" content="<?php echo esc_url( get_permalink() ?: home_url( '/' ) ); ?>" />
<meta property="og:image" content="<?php echo esc_url( FOREMAN_THEME_URI . '/images/hero-bg.jpg' ); ?>" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="<?php echo esc_attr( wp_get_document_title() ); ?>" />
<meta name="twitter:description" content="<?php echo esc_attr( $desc ); ?>" />

<?php wp_head(); ?>
</head>
<body <?php body_class( 'bg-background text-on-background font-body-md overflow-x-hidden antialiased flex flex-col min-h-screen relative' ); ?>>
<?php wp_body_open(); ?>
<div class="grain-overlay"></div>
<div id="app" class="bg-background text-on-background font-body-md overflow-x-hidden antialiased flex flex-col min-h-screen relative">
<nav class="backdrop-blur-xl w-full fixed top-0 z-50 transition-all duration-300 nav-glow bg-background/95 border-b border-outline-variant/30 shadow-lg" id="mainNav">
<div class="flex justify-between items-center w-full px-6 sm:px-6 max-w-7xl mx-auto py-4">
<a class="flex items-center gap-2.5 group transition-transform duration-300 hover:scale-[1.02]" href="<?php echo esc_url( home_url( '/' ) ); ?>">
<?php
if ( has_custom_logo() ) {
	the_custom_logo();
} else {
	echo '<img src="' . esc_url( FOREMAN_THEME_URI . '/Foreman-AI_logo_3.png' ) . '" alt="Foreman AI" class="h-10 w-auto" />';
}
?>
</a>

<?php
if ( has_nav_menu( 'primary' ) ) {
	wp_nav_menu( array(
		'theme_location' => 'primary',
		'menu_class'     => 'hidden md:flex items-center gap-8',
		'container'      => false,
		'items_wrap'     => '<div class="%2$s">%3$s</div>',
		'fallback_cb'    => false,
	) );
} else {
?>
<div class="hidden md:flex items-center gap-8">
<a class="text-on-surface-variant font-label-mono text-[11px] uppercase tracking-wider hover:text-brand-blue transition-colors" href="#estimator">CAD Estimator</a>
<a class="text-on-surface-variant font-label-mono text-[11px] uppercase tracking-wider hover:text-brand-blue transition-colors" href="#procurement">Sourcing Radar</a>
<a class="text-on-surface-variant font-label-mono text-[11px] uppercase tracking-wider hover:text-brand-blue transition-colors" href="#features">Features</a>
<a class="text-on-surface-variant font-label-mono text-[11px] uppercase tracking-wider hover:text-brand-blue transition-colors" href="#pricing">Pricing</a>
<a class="text-on-surface-variant font-label-mono text-[11px] uppercase tracking-wider hover:text-brand-blue transition-colors" href="#spline-3d-canvas">3D Workspace</a>
<a class="text-on-surface-variant font-label-mono text-[11px] uppercase tracking-wider hover:text-brand-blue transition-colors" href="#comms-terminal">Contact</a>
<a class="text-on-surface-variant font-label-mono text-[11px] uppercase tracking-wider hover:text-brand-blue transition-colors" href="<?php echo esc_url( get_permalink( get_option( 'page_for_posts' ) ) ?: home_url( '/blog' ) ); ?>">Blog</a>
</div>
<?php } ?>

<div class="flex items-center gap-4">
<a class="hidden sm:inline-flex bg-brand-purple text-white font-label-mono text-[10px] uppercase font-bold px-5 py-2 rounded-sm tracking-wider hover:bg-brand-blue transition-all duration-300 glow-primary" href="#pricing">Start Free Trial</a>
<button class="md:hidden text-on-surface-variant hover:text-brand-blue p-1.5" onclick="toggleMobileMenu()" id="mobile-menu-btn">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="menu-icon-open"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="menu-icon-close" class="hidden"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
</button>
</div>
</div>

<div id="mobile-menu" class="hidden md:hidden bg-background/95 border-b border-outline-variant p-6 space-y-4 absolute top-full left-0 w-full backdrop-blur-lg">
<?php
if ( has_nav_menu( 'primary' ) ) {
	wp_nav_menu( array(
		'theme_location' => 'primary',
		'menu_class'     => 'space-y-4',
		'container'      => false,
		'items_wrap'     => '<ul class="%2$s">%3$s</ul>',
		'fallback_cb'    => false,
		'depth'          => 1,
	) );
} else {
?>
<a class="block text-on-surface-variant font-label-mono text-xs uppercase hover:text-brand-blue" href="#estimator" onclick="closeMobileMenu()">CAD Estimator Workspace</a>
<a class="block text-on-surface-variant font-label-mono text-xs uppercase hover:text-brand-blue" href="#procurement" onclick="closeMobileMenu()">Supplier links</a>
<a class="block text-on-surface-variant font-label-mono text-xs uppercase hover:text-brand-blue" href="#features" onclick="closeMobileMenu()">Platform Features</a>
<a class="block text-on-surface-variant font-label-mono text-xs uppercase hover:text-brand-blue" href="#pricing" onclick="closeMobileMenu()">Bidding Tiers</a>
<a class="block text-on-surface-variant font-label-mono text-xs uppercase hover:text-brand-blue" href="#spline-3d-canvas" onclick="closeMobileMenu()">3D Workspace</a>
<a class="block text-on-surface-variant font-label-mono text-xs uppercase hover:text-brand-blue" href="#comms-terminal" onclick="closeMobileMenu()">Contact</a>
<a class="block text-on-surface-variant font-label-mono text-xs uppercase hover:text-brand-blue" href="#" onclick="closeMobileMenu()">Blog</a>
<a class="block w-full text-center bg-brand-purple hover:bg-brand-blue text-white font-label-mono text-[11px] uppercase py-3 rounded-sm tracking-wider mt-6" href="#pricing" onclick="closeMobileMenu()">Start Free Trial</a>
<?php } ?>
</div>
</nav>
<main class="flex-grow pt-[72px]">
