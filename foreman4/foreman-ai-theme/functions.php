<?php
/**
 * Foreman AI Theme Functions
 *
 * @package Foreman_AI
 * @author  colorgraphicz
 * @version 1.0.0
 */

defined( 'ABSPATH' ) || exit;

define( 'FOREMAN_THEME_VERSION', '1.0.0' );
define( 'FOREMAN_THEME_DIR', get_template_directory() );
define( 'FOREMAN_THEME_URI', get_template_directory_uri() );

if ( ! function_exists( 'foreman_setup' ) ) {
	function foreman_setup() {
		add_theme_support( 'automatic-feed-links' );
		add_theme_support( 'title-tag' );
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'custom-logo', array(
			'height'      => 60,
			'width'       => 200,
			'flex-height' => true,
			'flex-width'  => true,
		) );
		add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
		add_theme_support( 'align-wide' );
		add_theme_support( 'responsive-embeds' );
		add_theme_support( 'wp-block-styles' );

		register_nav_menus( array(
			'primary'      => esc_html__( 'Primary Menu', 'foreman-ai' ),
			'footer-col-1' => esc_html__( 'Footer Column 1 (Workspace Tools)', 'foreman-ai' ),
			'footer-col-2' => esc_html__( 'Footer Column 2 (Resources)', 'foreman-ai' ),
			'footer-col-3' => esc_html__( 'Footer Column 3 (Legal & Regulatory)', 'foreman-ai' ),
		) );

		set_post_thumbnail_size( 1200, 675, true );
	}
}
add_action( 'after_setup_theme', 'foreman_setup' );

function foreman_content_width() {
	$GLOBALS['content_width'] = 1280;
}
add_action( 'after_setup_theme', 'foreman_content_width', 0 );

function foreman_scripts() {
	wp_enqueue_style( 'foreman-fonts', 'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,100..900;1,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Space+Grotesk:wght@300..700&display=swap', array(), null );
	wp_enqueue_style( 'foreman-style', get_stylesheet_uri(), array( 'foreman-fonts' ), FOREMAN_THEME_VERSION );

	wp_enqueue_script( 'foreman-theme', FOREMAN_THEME_URI . '/assets/js/theme.js', array(), FOREMAN_THEME_VERSION, true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}

	wp_localize_script( 'foreman-theme', 'foreman_ajax', array(
		'ajax_url' => admin_url( 'admin-ajax.php' ),
		'nonce'    => wp_create_nonce( 'foreman_contact_nonce' ),
	) );
}
add_action( 'wp_enqueue_scripts', 'foreman_scripts' );

/**
 * Widget Areas
 */
function foreman_widgets_init() {
	register_sidebar( array(
		'name'          => esc_html__( 'Blog Sidebar', 'foreman-ai' ),
		'id'            => 'sidebar-blog',
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	) );

	register_sidebar( array(
		'name'          => esc_html__( 'Footer Column 1', 'foreman-ai' ),
		'id'            => 'footer-1',
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h4 class="footer-widget-title">',
		'after_title'   => '</h4>',
	) );

	register_sidebar( array(
		'name'          => esc_html__( 'Footer Column 2', 'foreman-ai' ),
		'id'            => 'footer-2',
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h4 class="footer-widget-title">',
		'after_title'   => '</h4>',
	) );

	register_sidebar( array(
		'name'          => esc_html__( 'Footer Column 3', 'foreman-ai' ),
		'id'            => 'footer-3',
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h4 class="footer-widget-title">',
		'after_title'   => '</h4>',
	) );

	register_sidebar( array(
		'name'          => esc_html__( 'Footer Column 4', 'foreman-ai' ),
		'id'            => 'footer-4',
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h4 class="footer-widget-title">',
		'after_title'   => '</h4>',
	) );
}
add_action( 'widgets_init', 'foreman_widgets_init' );

/**
 * Email Filters
 */
function foreman_wp_mail_from( $original ) {
	return 'contact@foremanai.colorgraphicz.in';
}
add_filter( 'wp_mail_from', 'foreman_wp_mail_from' );

function foreman_wp_mail_from_name( $original ) {
	return 'Foreman AI';
}
add_filter( 'wp_mail_from_name', 'foreman_wp_mail_from_name' );

/**
 * AJAX Contact Handler
 */
function foreman_handle_contact() {
	if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], 'foreman_contact_nonce' ) ) {
		wp_send_json_error( array( 'message' => 'Security verification failed.' ) );
	}

	$name    = isset( $_POST['name'] ) ? sanitize_text_field( wp_unslash( $_POST['name'] ) ) : '';
	$email   = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '';
	$package = isset( $_POST['package'] ) ? sanitize_text_field( wp_unslash( $_POST['package'] ) ) : '';
	$message = isset( $_POST['message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['message'] ) ) : '';
	$captcha   = isset( $_POST['captcha'] ) ? sanitize_text_field( wp_unslash( $_POST['captcha'] ) ) : '';
	$captchaOp = isset( $_POST['captcha_op'] ) ? sanitize_text_field( wp_unslash( $_POST['captcha_op'] ) ) : '';

	if ( empty( $name ) || empty( $email ) || empty( $message ) ) {
		wp_send_json_error( array( 'message' => 'Please fill in all required fields.' ) );
	}

	if ( ! empty( $captchaOp ) ) {
		$parts = explode( '+', $captchaOp );
		if ( count( $parts ) === 2 && is_numeric( $parts[0] ) && is_numeric( $parts[1] ) ) {
			$expected = (int) $parts[0] + (int) $parts[1];
			if ( (int) $captcha !== $expected ) {
				wp_send_json_error( array( 'message' => 'Incorrect security answer. Please try again.' ) );
			}
		}
	}

	$admin_email = 'project.colorgraphicz@gmail.com';
	$subject     = sprintf( 'Foreman AI Contact — %s', $name );
	$body        = "Operator: $name\nEmail: $email\nPackage: $package\nMessage:\n$message";
	wp_mail( $admin_email, $subject, $body );

	$user_subject = 'Thank you for contacting Foreman AI';
	$user_body    = "Hello $name,\n\nThank you for reaching out. Our team will review your transmission and get back to you shortly.\n\nBest regards,\nForeman AI Team";
	wp_mail( $email, $user_subject, $user_body );

	$post_data = array(
		'post_title'   => $name,
		'post_content' => $message,
		'post_type'    => 'foreman_submission',
		'post_status'  => 'publish',
	);
	$post_id = wp_insert_post( $post_data );
	if ( $post_id ) {
		update_post_meta( $post_id, '_submission_email', $email );
		update_post_meta( $post_id, '_submission_package', $package );
	}

	wp_send_json_success( array( 'message' => 'Transmission broadcast complete.' ) );
}
add_action( 'wp_ajax_foreman_contact', 'foreman_handle_contact' );
add_action( 'wp_ajax_nopriv_foreman_contact', 'foreman_handle_contact' );

/**
 * Register Submissions CPT
 */
function foreman_register_submissions() {
	$labels = array(
		'name'               => 'Submissions',
		'singular_name'      => 'Submission',
		'menu_name'          => 'Contact Submissions',
		'all_items'          => 'All Submissions',
		'view_item'          => 'View Submission',
		'search_items'       => 'Search Submissions',
		'not_found'          => 'No submissions found.',
		'not_found_in_trash' => 'No submissions in trash.',
	);
	$args   = array(
		'labels'              => $labels,
		'public'              => false,
		'show_ui'             => true,
		'show_in_menu'        => true,
		'menu_position'       => 25,
		'menu_icon'           => 'dashicons-email-alt',
		'capability_type'     => 'post',
		'capabilities'        => array( 'create_posts' => 'do_not_allow' ),
		'map_meta_cap'        => true,
		'supports'            => array( 'title', 'editor', 'custom-fields' ),
		'rewrite'             => false,
	);
	register_post_type( 'foreman_submission', $args );
}
add_action( 'init', 'foreman_register_submissions' );

/**
 * Email Campaign Cron
 */
function foreman_cron_schedule( $schedules ) {
	$schedules['foreman_weekly'] = array(
		'interval' => WEEK_IN_SECONDS,
		'display'  => 'Once Weekly',
	);
	$schedules['foreman_hourly'] = array(
		'interval' => HOUR_IN_SECONDS,
		'display'  => 'Once Hourly',
	);
	return $schedules;
}
add_filter( 'cron_schedules', 'foreman_cron_schedule' );

if ( ! wp_next_scheduled( 'foreman_campaign_cron' ) ) {
	wp_schedule_event( time(), 'foreman_hourly', 'foreman_campaign_cron' );
}

function foreman_get_all_campaign_emails( $campaign ) {
	$args = array(
		'post_type'      => 'foreman_submission',
		'posts_per_page' => -1,
		'meta_query'     => array(
			array(
				'key'     => '_submission_email',
				'value'   => '',
				'compare' => '!=',
			),
		),
	);
	$submissions = get_posts( $args );
	$emails      = array();
	foreach ( $submissions as $sub ) {
		$e = get_post_meta( $sub->ID, '_submission_email', true );
		if ( is_email( $e ) ) {
			$emails[] = $e;
		}
	}
	if ( isset( $campaign['extra_emails'] ) && is_array( $campaign['extra_emails'] ) ) {
		foreach ( $campaign['extra_emails'] as $e ) {
			$e = sanitize_email( trim( $e ) );
			if ( is_email( $e ) && ! in_array( $e, $emails, true ) ) {
				$emails[] = $e;
			}
		}
	}
	return $emails;
}

function foreman_run_campaign() {
	$campaigns = get_option( 'foreman_campaigns', array() );
	if ( empty( $campaigns ) ) {
		return;
	}

	$progress = get_option( 'foreman_campaign_progress', array() );
	$batch    = 50;
	$updated  = false;

	foreach ( $campaigns as $i => $campaign ) {
		if ( isset( $progress[ $i ]['paused'] ) && $progress[ $i ]['paused'] ) {
			continue;
		}

		$subject = isset( $campaign['subject'] ) ? $campaign['subject'] : 'Foreman AI Update';
		$content = isset( $campaign['content'] ) ? $campaign['content'] : '';

		$emails = foreman_get_all_campaign_emails( $campaign );
		if ( empty( $emails ) ) {
			continue;
		}

		$offset       = isset( $progress[ $i ]['offset'] ) ? $progress[ $i ]['offset'] : 0;
		$total        = count( $emails );
		$batch_emails = array_slice( $emails, $offset, $batch );

		if ( empty( $batch_emails ) ) {
			continue;
		}

		$sent = 0;
		foreach ( $batch_emails as $email ) {
			if ( wp_mail( $email, $subject, $content ) ) {
				$sent++;
			}
		}

		$progress[ $i ]['offset'] = $offset + count( $batch_emails );
		$progress[ $i ]['sent']   = isset( $progress[ $i ]['sent'] ) ? $progress[ $i ]['sent'] + $sent : $sent;
		$progress[ $i ]['total']  = $total;
		$updated                  = true;

		if ( $progress[ $i ]['offset'] >= $total ) {
			$progress[ $i ]['completed'] = true;
			$campaigns[ $i ]['last_sent']  = current_time( 'mysql' );
			$campaigns[ $i ]['sent_count'] = isset( $campaigns[ $i ]['sent_count'] ) ? $campaigns[ $i ]['sent_count'] + $progress[ $i ]['sent'] : $progress[ $i ]['sent'];
		}
	}

	if ( $updated ) {
		update_option( 'foreman_campaigns', $campaigns );
		update_option( 'foreman_campaign_progress', $progress );
	}
}
add_action( 'foreman_campaign_cron', 'foreman_run_campaign' );

/**
 * Customizer: Social Media Links
 */
function foreman_customize_register( $wp_customize ) {
	$wp_customize->add_section( 'foreman_social', array(
		'title'    => 'Social Media',
		'priority' => 130,
	) );

	$socials = array( 'linkedin' => 'LinkedIn', 'youtube' => 'YouTube', 'facebook' => 'Facebook', 'instagram' => 'Instagram', 'twitter' => 'Twitter' );

	foreach ( $socials as $key => $label ) {
		$wp_customize->add_setting( "foreman_social_$key", array(
			'default'           => '',
			'sanitize_callback' => 'esc_url_raw',
			'type'              => 'theme_mod',
		) );

		$wp_customize->add_control( "foreman_social_$key", array(
			'label'       => $label,
			'section'     => 'foreman_social',
			'type'        => 'url',
			'input_attrs' => array( 'placeholder' => "https://$key.com/..." ),
		) );
	}

	// --- Front Page Content ---
	$wp_customize->add_section( 'foreman_front_page', array(
		'title'    => 'Front Page Content',
		'priority' => 125,
	) );

	$front_fields = array(
		'foreman_hero_badge'      => array( 'label' => 'Hero Badge Text', 'default' => 'Live AI bidding system linked', 'type' => 'text' ),
		'foreman_hero_heading'    => array( 'label' => 'Hero Heading (HTML allowed)', 'default' => 'Win the bid before you <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-purple to-secondary font-black">leave the truck.</span>', 'type' => 'textarea' ),
		'foreman_hero_subheading' => array( 'label' => 'Hero Subheading (HTML allowed)', 'default' => 'Automate itemized estimates, coordinate local code compliance, and lock raw material inventories directly from the field. Skip paperwork after hours.', 'type' => 'textarea' ),
		'foreman_stat1_label'     => array( 'label' => 'Stat Box 1 — Label', 'default' => 'Estimating Confidence', 'type' => 'text' ),
		'foreman_stat1_value'     => array( 'label' => 'Stat Box 1 — Value', 'default' => '98.4%', 'type' => 'text' ),
		'foreman_stat1_pct'       => array( 'label' => 'Stat Box 1 — Bar %', 'default' => '98.4', 'type' => 'text' ),
		'foreman_stat2_label'     => array( 'label' => 'Stat Box 2 — Label', 'default' => 'Contract Generation', 'type' => 'text' ),
		'foreman_stat2_value'     => array( 'label' => 'Stat Box 2 — Value', 'default' => '1.2 SECS', 'type' => 'text' ),
		'foreman_stat2_subtext'   => array( 'label' => 'Stat Box 2 — Subtext', 'default' => 'Parsed 4,291 materials variables.', 'type' => 'text' ),
		'foreman_extra_sections'  => array( 'label' => 'Extra Sections (HTML)', 'default' => '', 'type' => 'textarea' ),
	);

	foreach ( $front_fields as $key => $f ) {
		$wp_customize->add_setting( $key, array(
			'default'           => $f['default'],
			'sanitize_callback' => 'wp_kses_post',
			'type'              => 'theme_mod',
		) );
		$wp_customize->add_control( $key, array(
			'label'       => $f['label'],
			'section'     => 'foreman_front_page',
			'type'        => $f['type'],
		) );
	}
}
add_action( 'customize_register', 'foreman_customize_register' );

/**
 * Include Admin
 */
if ( is_admin() ) {
	require_once FOREMAN_THEME_DIR . '/inc/admin.php';
}

/**
 * Theme activation — auto-create pages and flush rewrite rules
 */
function foreman_theme_activation() {
	foreman_register_submissions();

	$pages = array(
		'home' => array(
			'title'   => 'Home',
			'content' => '',
		),
		'blog' => array(
			'title'   => 'Blog',
			'content' => '',
		),
		'terms-of-service' => array(
			'title'   => 'Terms of Service',
			'content' => '<!-- wp:paragraph --><p>Terms of Service for Foreman AI. By using this platform you agree to the terms outlined herein.</p><!-- /wp:paragraph -->',
		),
		'privacy-policy' => array(
			'title'   => 'Privacy Policy',
			'content' => '<!-- wp:paragraph --><p>Privacy Policy for Foreman AI. We respect your privacy and protect your data.</p><!-- /wp:paragraph -->',
		),
		'procurement-policy' => array(
			'title'   => 'Procurement Policy',
			'content' => '<!-- wp:paragraph --><p>Procurement policy for supplier linkages and material sourcing.</p><!-- /wp:paragraph -->',
		),
		'tls-security' => array(
			'title'   => 'TLS Security',
			'content' => '<!-- wp:paragraph --><p>TLS Security information for Foreman AI encrypted communications.</p><!-- /wp:paragraph -->',
		),
	);

	foreach ( $pages as $slug => $page ) {
		$existing = get_page_by_path( $slug );
		if ( ! $existing ) {
			wp_insert_post( array(
				'post_title'   => $page['title'],
				'post_content' => $page['content'],
				'post_status'  => 'publish',
				'post_type'    => 'page',
				'post_name'    => $slug,
			) );
		}
	}

	$home_id = get_page_by_path( 'home' );
	$blog_id = get_page_by_path( 'blog' );
	if ( $home_id && $blog_id ) {
		update_option( 'page_on_front', $home_id->ID );
		update_option( 'page_for_posts', $blog_id->ID );
		update_option( 'show_on_front', 'page' );
	}

	flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'foreman_theme_activation' );

/**
 * Show notice on front page editor that front-page.php template is active
 */
function foreman_front_page_notice() {
	$screen = get_current_screen();
	if ( 'page' === $screen->id && get_option( 'page_on_front' ) == get_the_ID() ) {
		add_action( 'edit_form_after_title', function() {
			echo '<div class="notice notice-info inline"><p>This page uses the <strong>front-page.php</strong> template. Content entered in the editor appears between the Hero and Estimator sections. To edit the Hero headings, stat boxes, and other template text, go to <strong>Appearance → Customize → Front Page Content</strong>.</p></div>';
		} );
	}
}
add_action( 'current_screen', 'foreman_front_page_notice' );
