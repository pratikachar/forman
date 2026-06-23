<?php
/**
 * Non-AJAX form fallback handler
 *
 * @package Foreman_AI
 */

defined( 'ABSPATH' ) || exit;

if ( ! isset( $_POST['foreman_submit'] ) ) {
	wp_safe_redirect( home_url( '/#comms-terminal' ) );
	exit;
}

$name    = isset( $_POST['name'] ) ? sanitize_text_field( wp_unslash( $_POST['name'] ) ) : '';
$email   = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '';
$package = isset( $_POST['package'] ) ? sanitize_text_field( wp_unslash( $_POST['package'] ) ) : '';
$message = isset( $_POST['message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['message'] ) ) : '';
$captcha = isset( $_POST['captcha'] ) ? sanitize_text_field( wp_unslash( $_POST['captcha'] ) ) : '';

if ( empty( $name ) || empty( $email ) || empty( $message ) ) {
	wp_safe_redirect( home_url( '/#comms-terminal?error=required' ) );
	exit;
}

$expected = isset( $_POST['captcha_hash'] ) ? sanitize_text_field( wp_unslash( $_POST['captcha_hash'] ) ) : '';
$sum      = isset( $_POST['captcha_sum'] ) ? sanitize_text_field( wp_unslash( $_POST['captcha_sum'] ) ) : '';

if ( empty( $expected ) || empty( $sum ) || wp_hash( $sum ) !== $expected ) {
	wp_safe_redirect( home_url( '/#comms-terminal?error=captcha' ) );
	exit;
}

$admin_email = 'project.colorgraphicz@gmail.com';
$subject     = sprintf( 'Foreman AI Contact — %s (Fallback)', $name );
$body        = "Operator: $name\nEmail: $email\nPackage: $package\nMessage:\n$message";
wp_mail( $admin_email, $subject, $body );

$user_subject = 'Thank you for contacting Foreman AI';
$user_body    = "Hello $name,\n\nThank you for reaching out (fallback form). Our team will review your transmission and get back to you shortly.\n\nBest regards,\nForeman AI Team";
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

wp_safe_redirect( home_url( '/#comms-terminal?success=1' ) );
exit;
