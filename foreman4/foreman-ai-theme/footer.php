</main>

<button id="back-to-top" onclick="window.scrollTo({top:0,behavior:'smooth'})" class="fixed bottom-6 right-6 z-50 bg-brand-purple hover:bg-brand-blue text-white p-3 rounded-full shadow-2xl border border-brand-purple/40 hover:scale-110 transition-transform duration-300 cursor-pointer animate-fade-in flex items-center justify-center glow-primary" style="display:none" title="Back to Top">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
</button>

<div id="proposal-modal" class="hidden fixed inset-0 bg-background/90 z-50 flex items-center justify-center p-4 backdrop-blur-md">
<div class="bg-surface-container border border-outline-variant rounded-sm w-full max-w-2xl max-h-[80vh] shadow-2xl relative flex flex-col">
<div class="flex items-center justify-between p-4 border-b border-outline-variant/30 flex-shrink-0">
<h3 class="font-headline-lg text-lg text-white font-bold">Contract Proposal — Foreman AI</h3>
<button onclick="closeProposal()" class="text-on-surface-variant hover:text-white font-label-mono text-sm font-bold cursor-pointer">&#10005; CLOSE</button>
</div>
<div class="overflow-y-auto p-6 space-y-5 text-left flex-grow">
<div class="border-b-4 border-brand-purple pb-5 flex flex-col sm:flex-row justify-between items-start gap-4">
<div><h3 class="font-headline-lg text-3xl font-black text-white">FOREMAN AI INC.</h3><p class="text-[10px] font-label-mono text-brand-blue uppercase tracking-widest">Live Field Generated Bidding Agreement</p></div>
<div class="text-right sm:text-right font-label-mono text-xs text-on-surface-variant"><p>DATE: <span id="prop-date">6/22/2026</span></p><p>HASH: #BID-<span id="prop-hash">843129</span></p><p class="text-green-400 font-bold">STATUS: BINDING / PRE-APPROVED</p></div>
</div>
<div class="grid grid-cols-2 gap-4 text-xs font-label-mono text-on-surface-variant border-b border-outline-variant/30 pb-4">
<div><p class="uppercase text-[10px] font-bold text-brand-purple mb-1">CONTRACTOR REPRESENTATION</p><p class="text-white font-bold">FOREMAN AUTOMATIC SYSTEM CLIENT</p><p>LICENSE #GC-901844-EL</p></div>
<div><p class="uppercase text-[10px] font-bold text-brand-blue mb-1">PROSPECTIVE CLIENT</p><p class="text-white font-bold" id="prop-client">D. MILLER DEVELOPMENTS</p><p>PROJECT: <span id="prop-project">SITE G-2 ELECTRICAL FITOUT</span></p></div>
</div>
<div class="space-y-2 font-label-mono text-xs"><div class="font-bold border-b border-brand-purple/20 pb-2 text-brand-purple">ITEMIZED DISPOSITION</div><div class="divide-y divide-outline-variant/30" id="prop-items-list"><div class="flex justify-between py-2 items-center text-on-surface-variant font-bold border-t border-brand-purple/20 pt-2"><span>Labor Duration Component (<span id="prop-labor-hours">14</span> hours @ $<span id="prop-labor-rate">85</span>/hr)</span><span class="text-white" id="prop-labor-cost">$1,190.00</span></div></div>
</div>
<div class="bg-surface-dim p-4 rounded-sm border border-outline-variant/40 space-y-2 font-label-mono text-xs">
<div class="flex justify-between text-on-surface-variant"><span>Materials Subtotal:</span><span class="text-white" id="prop-materials">$0.00</span></div>
<div class="flex justify-between text-on-surface-variant"><span>Crew Deployment & Labor:</span><span class="text-white" id="prop-labor">$1,190.00</span></div>
<div class="flex justify-between text-on-surface-variant"><span>Adjustment Factor (<span id="prop-markup-pct">20</span>% Markup):</span><span class="text-white" id="prop-markup">$238.00</span></div>
<div class="flex justify-between text-on-surface-variant border-b border-outline-variant/20 pb-2"><span>Tax Surcharge (<span id="prop-tax-pct">8.5</span>%):</span><span class="text-white" id="prop-tax">$121.38</span></div>
<div class="flex justify-between text-sm font-bold pt-2"><span class="text-brand-purple">BINDING COLD CONTRACT SUM:</span><span class="text-white text-base" id="prop-total">$1,549.38</span></div>
</div>
<div class="border-t border-outline-variant/40 pt-4 space-y-2"><p class="text-[10px] text-on-surface-variant leading-relaxed">*LEGALLY BINDING STATEMENT: This proposal presents a live price calculated using supplier API linkages. Sourced raw resources are locked in inventory for 24 hours from timestamp above. Authorized signers acknowledge prices are valid and complete upon mutual transmission.</p>
<div class="grid grid-cols-2 gap-8 pt-5"><div class="border-b border-outline-variant/50 h-10 flex items-end"><span class="text-[10px] font-label-mono text-on-surface-variant/70 uppercase">CREW REPRESENTATIVE</span></div><div class="border-b border-outline-variant/50 h-10 flex items-end"><span class="text-[10px] font-label-mono text-on-surface-variant/70 uppercase">CLIENT AUTHORIZATION</span></div></div>
</div>
</div>
<div class="flex gap-4 p-4 border-t border-outline-variant/30 flex-shrink-0">
<button onclick="printProposal()" class="bg-brand-blue hover:bg-brand-purple text-white font-label-mono text-xs px-6 py-2.5 rounded-sm uppercase tracking-wider flex items-center gap-1.5 transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>Print Document</button>
<button onclick="copyProposal()" class="bg-surface-variant hover:bg-surface-bright text-white font-label-mono text-xs px-6 py-2.5 rounded-sm uppercase tracking-wider transition-colors"><span id="prop-copy-btn">Copy Agreement Text</span></button>
</div>
</div>
</div>

<footer class="bg-surface-container-lowest border-t border-outline-variant/60 w-full mt-auto relative">
<div class="grid grid-cols-1 md:grid-cols-4 gap-8 px-6 sm:px-6 py-16 max-w-7xl mx-auto text-left text-xs font-label-mono">
<div class="col-span-1 space-y-6">
<a class="flex items-center gap-2" href="<?php echo esc_url( home_url( '/' ) ); ?>">
<?php
if ( has_custom_logo() ) {
	the_custom_logo();
} else {
	echo '<img src="' . esc_url( FOREMAN_THEME_URI . '/Foreman-AI_logo_3.png' ) . '" alt="Foreman AI" class="h-10 w-auto" />';
}
?>
</a>
<p class="text-on-surface-variant max-w-sm leading-relaxed uppercase">Field intelligence for the modern job site. Automating tedious paperwork so contractors can build the world.</p>
<div class="flex items-center gap-4 pt-2">
<?php
$social_links = array(
	'linkedin'  => '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
	'youtube'   => '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
	'facebook'  => '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
	'instagram' => '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>',
	'twitter'   => '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>',
);
$has_social = false;
foreach ( $social_links as $key => $icon ) {
	$url = get_theme_mod( "foreman_social_$key", '' );
	if ( $url ) {
		$has_social = true;
		echo '<a href="' . esc_url( $url ) . '" class="p-2 border border-outline-variant/50 rounded-sm hover:border-brand-purple hover:text-brand-purple text-on-surface-variant transition-colors" target="_blank" rel="noopener noreferrer" title="' . esc_attr( ucfirst( $key ) ) . '">' . $icon . '</a>';
	}
}
if ( ! $has_social ) {
	echo '<p class="text-[10px] text-on-surface-variant/50">Configure social links in <strong>Appearance → Customize → Social Media</strong></p>';
}
?>
</div>
<p class="text-[10px] text-on-surface-variant/50">&copy; <?php echo date( 'Y' ); ?> FOREMAN AI INC. ALL REGIONAL SYSTEMS SECURED.</p>
</div>

<?php
$footer_menus = array(
	array( 'location' => 'footer-col-1', 'title' => 'Workspace Tools', 'fallback' => array(
		array( '#estimator', 'CAD Estimator' ), array( '#procurement', 'Sourcing Radar' ), array( '#features', 'Features' ),
		array( '#spline-3d-canvas', '3D Workspace' ), array( '#comms-terminal', 'Contact Terminal' ),
		array( '#pricing', 'License Structures' ), array( home_url( '/blog' ), 'Blog' ),
	) ),
	array( 'location' => 'footer-col-2', 'title' => 'Resources', 'fallback' => array(
		array( '#comms-terminal', 'Contact Support' ), array( '#estimator', 'Documentation' ), array( '#pricing', 'API Reference' ),
	) ),
	array( 'location' => 'footer-col-3', 'title' => 'Legal & Regulatory', 'fallback' => array(
		array( home_url( '/terms-of-service' ), 'Terms of Service' ), array( home_url( '/privacy-policy' ), 'Privacy Policy' ),
		array( home_url( '/procurement-policy' ), 'Procurement Policy' ), array( home_url( '/tls-security' ), 'Standard TLS Secured' ),
	) ),
);
foreach ( $footer_menus as $col ) {
	echo '<div class="col-span-1 space-y-3">';
	echo '<h4 class="text-brand-blue font-bold uppercase tracking-widest">' . esc_html( $col['title'] ) . '</h4>';
	if ( has_nav_menu( $col['location'] ) ) {
		wp_nav_menu( array(
			'theme_location' => $col['location'],
			'container'      => false,
			'menu_class'     => 'space-y-2',
			'fallback_cb'    => false,
			'depth'          => 1,
			'items_wrap'     => '<ul class="%2$s">%3$s</ul>',
		) );
	} else {
		echo '<ul class="space-y-2">';
		foreach ( $col['fallback'] as $link ) {
			echo '<li><a class="text-on-surface-variant hover:text-white transition-colors" href="' . esc_url( $link[0] ) . '">' . esc_html( $link[1] ) . '</a></li>';
		}
		echo '</ul>';
	}
	echo '</div>';
}
?>
</div>
</footer>
</div>
<?php wp_footer(); ?>
</body>
</html>
