<?php
/**
 * Foreman AI Admin Functions
 *
 * @package Foreman_AI
 * @author  colorgraphicz
 */

defined( 'ABSPATH' ) || exit;

/**
 * Get all submission emails
 */
function foreman_get_submission_emails() {
	$args = array(
		'post_type'      => 'foreman_submission',
		'posts_per_page' => -1,
		'post_status'    => 'any',
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
			$emails[] = array( 'id' => $sub->ID, 'name' => $sub->post_title, 'email' => $e );
		}
	}
	return $emails;
}

/**
 * Add admin menu pages
 */
function foreman_admin_menu() {
	add_submenu_page(
		'edit.php?post_type=foreman_submission',
		'Campaigns',
		'Campaigns',
		'manage_options',
		'foreman-campaigns',
		'foreman_campaigns_page'
	);
}
add_action( 'admin_menu', 'foreman_admin_menu' );

/**
 * Custom columns for Submissions list table
 */
function foreman_submission_columns( $columns ) {
	$columns = array(
		'cb'       => '<input type="checkbox" />',
		'title'    => 'Name',
		'email'    => 'Email',
		'package'  => 'Package',
		'date'     => 'Date',
	);
	return $columns;
}
add_filter( 'manage_foreman_submission_posts_columns', 'foreman_submission_columns' );

function foreman_submission_column_data( $column, $post_id ) {
	switch ( $column ) {
		case 'email':
			echo esc_html( get_post_meta( $post_id, '_submission_email', true ) );
			break;
		case 'package':
			echo esc_html( get_post_meta( $post_id, '_submission_package', true ) );
			break;
	}
}
add_action( 'manage_foreman_submission_posts_custom_column', 'foreman_submission_column_data', 10, 2 );

/**
 * Make columns sortable
 */
function foreman_submission_sortable_columns( $columns ) {
	$columns['email']   = 'email';
	$columns['package'] = 'package';
	return $columns;
}
add_filter( 'manage_edit-foreman_submission_sortable_columns', 'foreman_submission_sortable_columns' );

/**
 * Add export button
 */
function foreman_admin_export_button() {
	global $post_type;
	if ( 'foreman_submission' === $post_type ) {
		echo '<div class="alignleft actions" style="margin-left:8px;"><a href="' . esc_url( add_query_arg( 'export_csv', '1' ) ) . '" class="button button-primary">Export CSV</a></div>';
	}
}
add_action( 'restrict_manage_posts', 'foreman_admin_export_button' );

/**
 * Handle CSV export
 */
function foreman_export_csv() {
	if ( ! isset( $_GET['export_csv'] ) || ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$args = array(
		'post_type'      => 'foreman_submission',
		'posts_per_page' => -1,
		'post_status'    => 'any',
	);

	$submissions = get_posts( $args );

	header( 'Content-Type: text/csv; charset=utf-8' );
	header( 'Content-Disposition: attachment; filename=foreman-submissions-' . date( 'Y-m-d' ) . '.csv' );

	$output = fopen( 'php://output', 'w' );
	fputcsv( $output, array( 'Name', 'Email', 'Package', 'Message', 'Date' ) );

	foreach ( $submissions as $post ) {
		fputcsv( $output, array(
			$post->post_title,
			get_post_meta( $post->ID, '_submission_email', true ),
			get_post_meta( $post->ID, '_submission_package', true ),
			$post->post_content,
			$post->post_date,
		) );
	}

	fclose( $output );
	exit;
}
add_action( 'admin_init', 'foreman_export_csv' );

/**
 * Campaigns admin page
 */
function foreman_campaigns_page() {
	if ( isset( $_POST['foreman_save_campaign'] ) && check_admin_referer( 'foreman_campaign_nonce' ) ) {
		$campaigns   = get_option( 'foreman_campaigns', array() );
		$subject     = sanitize_text_field( wp_unslash( $_POST['campaign_subject'] ) );
		$content     = sanitize_textarea_field( wp_unslash( $_POST['campaign_content'] ) );

		$extra_emails = array();
		if ( ! empty( $_POST['campaign_extra_emails'] ) ) {
			$raw = sanitize_textarea_field( wp_unslash( $_POST['campaign_extra_emails'] ) );
			$parts = preg_split( '/[,\r\n]+/', $raw );
			foreach ( $parts as $p ) {
				$p = sanitize_email( trim( $p ) );
				if ( is_email( $p ) ) {
					$extra_emails[] = $p;
				}
			}
		}

		if ( isset( $_FILES['campaign_csv'] ) && UPLOAD_ERR_OK === $_FILES['campaign_csv']['error'] ) {
			$tmp = $_FILES['campaign_csv']['tmp_name'];
			if ( ( $handle = fopen( $tmp, 'r' ) ) !== false ) {
				while ( ( $data = fgetcsv( $handle ) ) !== false ) {
					foreach ( $data as $field ) {
						$e = sanitize_email( trim( $field ) );
						if ( is_email( $e ) && ! in_array( $e, $extra_emails, true ) ) {
							$extra_emails[] = $e;
						}
					}
				}
				fclose( $handle );
			}
		}

		$campaigns[] = array(
			'subject'      => $subject,
			'content'      => $content,
			'created'      => current_time( 'mysql' ),
			'extra_emails' => $extra_emails,
		);
		update_option( 'foreman_campaigns', $campaigns );
		// Init progress so Pause button shows immediately
		$progress = get_option( 'foreman_campaign_progress', array() );
		$last_idx = count( $campaigns ) - 1;
		if ( ! isset( $progress[ $last_idx ] ) ) {
			$progress[ $last_idx ] = array( 'offset' => 0, 'sent' => 0, 'total' => 0, 'paused' => false );
			update_option( 'foreman_campaign_progress', $progress );
		}
		echo '<div class="notice notice-success"><p>Campaign saved. Extra emails: ' . count( $extra_emails ) . '. It will be sent on the next hourly cron (50/hr).</p></div>';
	}

	if ( isset( $_GET['toggle_pause_campaign'] ) ) {
		$idx = intval( $_GET['toggle_pause_campaign'] );
		$progress = get_option( 'foreman_campaign_progress', array() );
		if ( ! isset( $progress[ $idx ] ) ) {
			$progress[ $idx ] = array( 'offset' => 0, 'sent' => 0, 'total' => 0, 'paused' => false );
		}
		$progress[ $idx ]['paused'] = ! isset( $progress[ $idx ]['paused'] ) || ! $progress[ $idx ]['paused'];
		update_option( 'foreman_campaign_progress', $progress );
		$status = $progress[ $idx ]['paused'] ? 'paused' : 'resumed';
		echo '<div class="notice notice-info"><p>Campaign ' . $status . '.</p></div>';
	}

	if ( isset( $_GET['reset_campaign_progress'] ) ) {
		$idx = intval( $_GET['reset_campaign_progress'] );
		$progress = get_option( 'foreman_campaign_progress', array() );
		if ( isset( $progress[ $idx ] ) ) {
			unset( $progress[ $idx ] );
			update_option( 'foreman_campaign_progress', $progress );
			echo '<div class="notice notice-info"><p>Campaign batch progress reset. It will restart from the beginning on the next cron run.</p></div>';
		}
	}

	if ( isset( $_GET['reset_all_progress'] ) && wp_verify_nonce( $_GET['_wpnonce'], 'reset_all_progress' ) ) {
		delete_option( 'foreman_campaign_progress' );
		echo '<div class="notice notice-info"><p>All campaign batch progress has been reset.</p></div>';
	}

	if ( isset( $_GET['delete_campaign'] ) ) {
		$idx       = intval( $_GET['delete_campaign'] );
		$campaigns = get_option( 'foreman_campaigns', array() );
		if ( isset( $campaigns[ $idx ] ) ) {
			unset( $campaigns[ $idx ] );
			$campaigns = array_values( $campaigns );
			update_option( 'foreman_campaigns', $campaigns );
			$progress = get_option( 'foreman_campaign_progress', array() );
			unset( $progress[ $idx ] );
			update_option( 'foreman_campaign_progress', array_values( $progress ) );
			echo '<div class="notice notice-success"><p>Campaign deleted.</p></div>';
		}
	}

	if ( isset( $_POST['send_campaign_selected'] ) && check_admin_referer( 'send_campaign_selected' ) ) {
		$idx         = intval( $_POST['campaign_idx'] );
		$selected    = isset( $_POST['selected_emails'] ) ? (array) $_POST['selected_emails'] : array();
		$campaigns   = get_option( 'foreman_campaigns', array() );
		if ( isset( $campaigns[ $idx ] ) && ! empty( $selected ) ) {
			$campaign   = $campaigns[ $idx ];
			$sent_count = 0;
			foreach ( $selected as $email ) {
				$email = sanitize_email( $email );
				if ( is_email( $email ) && wp_mail( $email, $campaign['subject'], $campaign['content'] ) ) {
					$sent_count++;
				}
			}
			$campaigns[ $idx ]['last_sent']    = current_time( 'mysql' );
			$campaigns[ $idx ]['sent_count']   = isset( $campaigns[ $idx ]['sent_count'] ) ? $campaigns[ $idx ]['sent_count'] + $sent_count : $sent_count;
			update_option( 'foreman_campaigns', $campaigns );
			echo '<div class="notice notice-success"><p>Campaign sent to ' . esc_html( $sent_count ) . ' selected recipients.</p></div>';
		} else {
			echo '<div class="notice notice-error"><p>No recipients selected or campaign not found.</p></div>';
		}
	}

	if ( isset( $_GET['send_campaign'] ) && isset( $_GET['_wpnonce'] ) && wp_verify_nonce( $_GET['_wpnonce'], 'send_campaign' ) ) {
		$idx       = intval( $_GET['send_campaign'] );
		$campaigns = get_option( 'foreman_campaigns', array() );
		if ( isset( $campaigns[ $idx ] ) ) {
			$campaign   = $campaigns[ $idx ];
			$emails     = foreman_get_all_campaign_emails( $campaign );
			$sent_count = 0;
			foreach ( $emails as $email ) {
				if ( wp_mail( $email, $campaign['subject'], $campaign['content'] ) ) {
					$sent_count++;
				}
			}
			$campaigns[ $idx ]['last_sent']    = current_time( 'mysql' );
			$campaigns[ $idx ]['sent_count']   = isset( $campaigns[ $idx ]['sent_count'] ) ? $campaigns[ $idx ]['sent_count'] + $sent_count : $sent_count;
			update_option( 'foreman_campaigns', $campaigns );
			echo '<div class="notice notice-success"><p>Campaign sent to ' . esc_html( $sent_count ) . ' recipients (includes extra emails).</p></div>';
		} else {
			echo '<div class="notice notice-error"><p>Campaign not found.</p></div>';
		}
	}

	$campaigns  = get_option( 'foreman_campaigns', array() );
	$recipients = foreman_get_submission_emails();
	?>
	<div class="wrap">
	<h1>Email Campaigns</h1>
	<p>Create bulk email campaigns. Cron schedule: <strong>hourly</strong> (sends 50 emails per hour per campaign automatically). You can also send manually to all or selected recipients below.</p>

	<div class="notice notice-info inline">
		<p><strong>Available Recipients:</strong> <?php echo count( $recipients ); ?> submissions with email addresses. Extra emails can be added per campaign via CSV or text input below.</p>
	</div>

	<h2>Create New Campaign</h2>
	<form method="post" style="max-width:600px;" enctype="multipart/form-data">
		<?php wp_nonce_field( 'foreman_campaign_nonce' ); ?>
		<table class="form-table">
			<tr><th><label for="campaign_subject">Subject</label></th><td><input type="text" name="campaign_subject" id="campaign_subject" class="regular-text" required /></td></tr>
			<tr><th><label for="campaign_content">Content</label></th><td><textarea name="campaign_content" id="campaign_content" rows="8" class="large-text" required></textarea></td></tr>
			<tr><th><label for="campaign_extra_emails">Extra Emails</label></th><td><textarea name="campaign_extra_emails" id="campaign_extra_emails" rows="4" class="large-text" placeholder="one@example.com&#10;two@example.com&#10;three@example.com"></textarea><p class="description">Add extra email addresses (one per line, or comma-separated). These will be merged with form submissions for sending.</p></td></tr>
			<tr><th><label for="campaign_csv">CSV Import</label></th><td><input type="file" name="campaign_csv" id="campaign_csv" accept=".csv" /><p class="description">Upload a CSV file with email addresses in any column. Extra emails from CSV are merged with the textarea above.</p></td></tr>
		</table>
		<p class="submit"><button type="submit" name="foreman_save_campaign" class="button button-primary">Save Campaign</button></p>
	</form>

	<h2>Saved Campaigns</h2>
	<?php
	$progress = get_option( 'foreman_campaign_progress', array() );
	if ( empty( $campaigns ) ) : ?>
		<p>No campaigns yet.</p>
	<?php else : ?>
		<?php foreach ( $campaigns as $i => $c ) :
		$extra_count = isset( $c['extra_emails'] ) ? count( $c['extra_emails'] ) : 0;
		$p = isset( $progress[ $i ] ) ? $progress[ $i ] : array();
		$p_sent = isset( $p['sent'] ) ? intval( $p['sent'] ) : 0;
		$p_total = isset( $p['total'] ) ? intval( $p['total'] ) : 0;
		$p_comp = isset( $p['completed'] ) && $p['completed'];
		$p_paused = isset( $p['paused'] ) && $p['paused'];
		$pct = $p_total > 0 ? round( $p_sent / $p_total * 100 ) : 0;
		?>
		<hr style="margin:24px 0;">
		<form method="post" style="max-width:900px;">
			<?php wp_nonce_field( 'send_campaign_selected' ); ?>
			<input type="hidden" name="campaign_idx" value="<?php echo esc_attr( $i ); ?>" />
			<table class="wp-list-table widefat fixed striped">
				<thead>
					<tr>
						<th colspan="5">
							<strong style="font-size:14px;"><?php echo esc_html( $c['subject'] ); ?></strong>
							<span style="color:#666;margin-left:16px;">Created: <?php echo esc_html( $c['created'] ); ?></span>
							<span style="color:#666;margin-left:16px;">Last Sent: <?php echo isset( $c['last_sent'] ) ? esc_html( $c['last_sent'] ) : '—'; ?></span>
							<span style="color:#666;margin-left:16px;">Total Sent: <?php echo isset( $c['sent_count'] ) ? intval( $c['sent_count'] ) : '0'; ?></span>
							<?php if ( $extra_count > 0 ) : ?><span style="color:#666;margin-left:16px;">Extra: <?php echo $extra_count; ?> emails</span><?php endif; ?>
							<?php if ( $p_total > 0 ) : ?><span style="color:#666;margin-left:16px;">Batch: <?php echo $p_sent; ?>/<?php echo $p_total; ?> (<?php echo $pct; ?>%)</span><?php if ( $p_comp ) : ?><span style="color:#2e7d32;margin-left:8px;">&#10003; Complete</span><?php endif; ?><?php if ( $p_paused ) : ?><span style="color:#d63638;margin-left:8px;font-weight:bold;">&#9646;&#9646; Paused</span><?php endif; ?><?php endif; ?>
						</th>
					</tr>
					<?php if ( $p_total > 0 && ! $p_comp ) : ?>
					<tr><td colspan="5" style="padding:4px 8px;"><div style="background:#f0f0f1;height:6px;border-radius:3px;overflow:hidden;"><div style="background:#2271b1;height:100%;width:<?php echo $pct; ?>%;"></div></div><span style="font-size:11px;color:#666;">Sent <?php echo $p_sent; ?>/<?php echo $p_total; ?> in batches of 50/hr</span></td></tr>
					<?php endif; ?>
					<tr>
						<th style="width:40px;"><input type="checkbox" onchange="document.querySelectorAll('.email-cb-<?php echo esc_attr( $i ); ?>').forEach(function(e){e.checked=this.checked})" /></th>
						<th>Name</th>
						<th>Email</th>
						<th>Package</th>
						<th>Date</th>
					</tr>
				</thead>
				<tbody>
					<?php if ( empty( $recipients ) ) : ?>
					<tr><td colspan="5">No recipients found.</td></tr>
					<?php else : ?>
					<?php foreach ( $recipients as $r ) : ?>
					<tr>
						<td><input type="checkbox" name="selected_emails[]" value="<?php echo esc_attr( $r['email'] ); ?>" class="email-cb-<?php echo esc_attr( $i ); ?>" /></td>
						<td><?php echo esc_html( $r['name'] ); ?></td>
						<td><?php echo esc_html( $r['email'] ); ?></td>
						<td><?php echo esc_html( get_post_meta( $r['id'], '_submission_package', true ) ); ?></td>
						<td><?php echo esc_html( get_the_date( '', $r['id'] ) ); ?></td>
					</tr>
					<?php endforeach; ?>
					<?php endif; ?>
				</tbody>
			</table>
			<p class="submit" style="margin-top:8px;">
				<button type="submit" name="send_campaign_selected" class="button button-primary" onclick="return confirm('Send to selected recipients?')">Send to Selected</button>
				<a href="<?php echo esc_url( wp_nonce_url( add_query_arg( 'send_campaign', $i ), 'send_campaign' ) ); ?>" class="button" onclick="return confirm('Send to ALL <?php echo count( $recipients ); ?> recipients?')">Send to All</a>
				<?php if ( ! $p_comp ) : ?>
				<a href="<?php echo esc_url( add_query_arg( 'toggle_pause_campaign', $i ) ); ?>" class="button"><?php echo $p_paused ? '&#9654; Resume' : '&#9646;&#9646; Pause'; ?></a>
				<?php endif; ?>
				<a href="<?php echo esc_url( add_query_arg( 'reset_campaign_progress', $i ) ); ?>" class="button" onclick="return confirm('Reset batch sending progress? This will restart from the beginning on next cron.')">Reset Progress</a>
				<a href="<?php echo esc_url( add_query_arg( 'delete_campaign', $i ) ); ?>" class="button" onclick="return confirm('Delete this campaign?')">Delete Campaign</a>
			</p>
		</form>
		<?php endforeach; ?>
	<?php endif; ?>
	</div>
	<?php
}
