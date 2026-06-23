(function() {
'use strict';

// --- Page Navigation (legal pages removed — WP handles this) ---
function showHome(sectionId) {
  if (sectionId) {
    setTimeout(function() {
      var el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
}

// --- Mobile Menu ---
function toggleMobileMenu() {
  var menu = document.getElementById('mobile-menu');
  var openIcon = document.getElementById('menu-icon-open');
  var closeIcon = document.getElementById('menu-icon-close');
  if (menu && menu.classList.contains('hidden')) {
    menu.classList.remove('hidden');
    if (openIcon) openIcon.classList.add('hidden');
    if (closeIcon) closeIcon.classList.remove('hidden');
  } else {
    closeMobileMenu();
  }
}
function closeMobileMenu() {
  var menu = document.getElementById('mobile-menu');
  var openIcon = document.getElementById('menu-icon-open');
  var closeIcon = document.getElementById('menu-icon-close');
  if (menu) menu.classList.add('hidden');
  if (openIcon) openIcon.classList.remove('hidden');
  if (closeIcon) closeIcon.classList.add('hidden');
}

// --- Back to Top ---
window.addEventListener('scroll', function() {
  var btn = document.getElementById('back-to-top');
  if (btn) btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
});

// --- Blueprint Takeoff State ---
var appState = {
  selectedTrade: 'electrical',
  activeTool: 'junction_box',
  zoom: 100,
  markers: [
    { id: '1', x: 25, y: 35, type: 'junction_box', label: 'UL Metallic J-Box', price: 3.25 },
    { id: '2', x: 45, y: 40, type: 'breaker', label: 'Square D 20A Breaker', price: 8.99 },
    { id: '3', x: 38, y: 72, type: 'cable_run', label: '12/2 Copper Run (10ft)', price: 45.99 }
  ],
  manualItems: [{ id: 'm1', name: 'Master Foreman Layout Labor', category: 'electrical', quantity: 1, unitPrice: 120.00, unit: 'Svc' }],
  laborHours: 14,
  laborRate: 85,
  markupPercent: 20,
  taxPercent: 8.5,
  pricingPeriod: 'monthly',
  selectedPkg: 'crew',
  gridItems: [
    { id: '1', name: 'CHASSIS PANEL', type: 'electrical', gridX: 1, gridY: 1, modelSymbol: '\u26a1' },
    { id: '2', name: 'JUNCTION HUB', type: 'electrical', gridX: 2, gridY: 3, modelSymbol: '\ud83c\udf9b\ufe0f' },
    { id: '3', name: 'PRESSURE VALVE', type: 'plumbing', gridX: 0, gridY: 2, modelSymbol: '\ud83d\udeb0' },
    { id: '4', name: 'PUMP ACTUATOR', type: 'plumbing', gridX: 3, gridY: 1, modelSymbol: '\ud83c\udf00' },
    { id: '5', name: 'STEEL COLUMN', type: 'structural', gridX: 2, gridY: 0, modelSymbol: '\ud83d\udd32' },
    { id: '6', name: 'I-BEAM JOIST', type: 'structural', gridX: 1, gridY: 2, modelSymbol: '\ud83e\udebc' }
  ],
  selectedPaletteIndex: 0,
  selectedPlacedId: null,
  activeTab: 'palette',
  activeLayer: 'electrical',
  toolMode: 'orbit',
  isOrbiting: true,
  rotation: -35,
  elevation: 30,
  scale: 1,
  panX: 0,
  panY: 0,
  autoOrbitInterval: null,
  engineMode: 'cad'
};

var ITEM_PRICES = { 'CHASSIS PANEL': 245, 'JUNCTION HUB': 85, 'PRESSURE VALVE': 120, 'PUMP ACTUATOR': 350, 'STEEL COLUMN': 410, 'I-BEAM JOIST': 195 };
var PALETTE_ITEMS = [
  { name: 'CHASSIS PANEL', type: 'electrical', symbol: '\u26a1', desc: 'Main distribution box node' },
  { name: 'JUNCTION HUB', type: 'electrical', symbol: '\ud83c\udf9b\ufe0f', desc: 'Conduit feeder intersection' },
  { name: 'PRESSURE VALVE', type: 'plumbing', symbol: '\ud83d\udeb0', desc: 'Flow velocity regulation node' },
  { name: 'PUMP ACTUATOR', type: 'plumbing', symbol: '\ud83c\udf00', desc: 'Active draft hydraulic system' },
  { name: 'STEEL COLUMN', type: 'structural', symbol: '\ud83d\udd32', desc: 'Compression dynamic load element' },
  { name: 'I-BEAM JOIST', type: 'structural', symbol: '\ud83e\udebc', desc: 'Horizontal deck shear support' }
];

var SUPPLIERS = [
  { id: 'copper_wire', name: 'COPPER CABLE 12/2 ROMEX ROLL (250FT)', price: 114.99, unit: 'Roll', stockStatus: 'IN STOCK', category: 'electrical' },
  { id: 'cable_run', name: 'COPPER CABLE 12/2 ROMEX ROW (10FT)', price: 4.59, unit: 'Pc', stockStatus: 'IN STOCK', category: 'electrical' },
  { id: 'breaker', name: 'SQUARE D QO 20 AMP BREAKER', price: 8.99, unit: 'Ea', stockStatus: 'IN STOCK', category: 'electrical' },
  { id: 'junction_box', name: 'UL METALLIC J-BOX 4-INCH', price: 3.25, unit: 'Ea', stockStatus: 'LOW STOCK', category: 'electrical' },
  { id: 'pvc_pipe', name: 'SCH 40 PVC PIPE 2-INCH x 10FT', price: 12.50, unit: 'Pc', stockStatus: 'IN STOCK', category: 'plumbing' },
  { id: 'brass_valve', name: 'APOLLO BRASS SHUTOFF BALL VALVE 3/4"', price: 24.95, unit: 'Ea', stockStatus: 'IN STOCK', category: 'plumbing' },
  { id: 'drain_trap', name: 'PVC P-TRAP ASSEMBLY 1-1/2"', price: 18.50, unit: 'Ea', stockStatus: 'LOW STOCK', category: 'plumbing' },
  { id: 'vent', name: 'STEEL FLOOR AIR REGISTER vent 4x10', price: 14.20, unit: 'Ea', stockStatus: 'IN STOCK', category: 'hvac' },
  { id: 'ducting', name: 'INSULATED FLEXIBLE DUCTING 6" x 25FT', price: 38.00, unit: 'Pc', stockStatus: 'IN STOCK', category: 'hvac' },
  { id: 'thermostat', name: 'HONEYWELL T3 INTUITIVE CONTROL SWITCH', price: 89.00, unit: 'Ea', stockStatus: 'OUT OF STOCK', category: 'hvac' }
];
var supplierFilter = 'all';

var TRADE_TOOLS = {
  electrical: [
    { id: 'junction_box', label: 'Junction Box', price: 3.25, color: '#4085EC' },
    { id: 'breaker', label: 'breaker 20A', price: 8.99, color: '#4F3A96' },
    { id: 'cable_run', label: '12/2 Copper Run (10ft)', price: 45.99, color: '#ffd6fa' }
  ],
  plumbing: [
    { id: 'pipe', label: '2" PVC Pipe x 10ft', price: 12.50, color: '#FFA9FE' },
    { id: 'valve', label: 'Brass Shutoff Valve', price: 24.95, color: '#faba73' },
    { id: 'junction_box', label: 'Drain Trap', price: 18.50, color: '#4085EC' }
  ],
  hvac: [
    { id: 'vent', label: 'Floor Air Vent', price: 14.20, color: '#ccbdff' },
    { id: 'conduit', label: 'Flexible Ducting x 25ft', price: 38.00, color: '#ffddbb' },
    { id: 'breaker', label: 'Thermostat Control Switch', price: 89.00, color: '#4F3A96' }
  ]
};

// --- Trade Switcher ---
function setTrade(trade) {
  appState.selectedTrade = trade;
  appState.activeTool = TRADE_TOOLS[trade][0].id;
  document.querySelectorAll('#trade-switcher button').forEach(function(b) {
    b.classList.remove('bg-brand-purple', 'text-white', 'shadow-md');
    b.classList.add('text-on-surface-variant', 'hover:text-white');
    if (b.dataset.trade === trade) {
      b.classList.add('bg-brand-purple', 'text-white', 'shadow-md');
      b.classList.remove('text-on-surface-variant', 'hover:text-white');
    }
  });
  renderTools();
  renderMarkers();
  var wm = document.getElementById('active-watermark');
  if (wm) wm.textContent = 'ACTIVE: ' + trade.toUpperCase() + ' INTERFACE';
}

function renderTools() {
  var container = document.getElementById('toolbox-container');
  if (!container) return;
  var tools = TRADE_TOOLS[appState.selectedTrade];
  container.innerHTML = '';
  tools.forEach(function(t) {
    var active = appState.activeTool === t.id;
    container.innerHTML += '<button class="p-3 rounded-sm border text-left flex items-center justify-between transition-all ' + (active ? 'border-brand-blue bg-brand-blue/10 text-white' : 'border-outline-variant bg-surface-dim hover:bg-surface-variant/50 text-on-surface-variant') + '" data-tool="' + t.id + '" onclick="setTool(\'' + t.id + '\')"><div><div class="font-semibold text-sm text-white flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full" style="background:' + t.color + '"></span>' + t.label + '</div><span class="font-label-mono text-xs text-on-surface-variant mt-1 block">$' + t.price.toFixed(2) + ' unit</span></div>' + (active ? '<span class="font-label-mono text-[10px] bg-brand-blue/20 text-brand-blue px-2 py-0.5 rounded-sm">ACTIVE</span>' : '') + '</button>';
  });
}

function setTool(id) { appState.activeTool = id; renderTools(); }

// --- Canvas Click to Add Markers ---
function setupCanvasClick() {
  var canvas = document.getElementById('canvas-click-area');
  if (!canvas) return;
  canvas.addEventListener('click', function(e) {
    var rect = this.getBoundingClientRect();
    var x = ((e.clientX - rect.left) / rect.width) * 100;
    var y = ((e.clientY - rect.top) / rect.height) * 100;
    var tools = TRADE_TOOLS[appState.selectedTrade];
    var current = tools.find(function(t) { return t.id === appState.activeTool; }) || tools[0];
    var marker = { id: Math.random().toString(36).substr(2, 9), x: x, y: y, type: current.id, label: current.label, price: current.price };
    appState.markers.push(marker);
    renderMarkers();
    updateEstimates();
  });
}

// --- Splite Slider ---
function setupSpliteSlider() {
  var container = document.getElementById('splite-container');
  if (!container) return;
  var left = document.getElementById('splite-left');
  var right = document.getElementById('splite-right');
  var handle = document.getElementById('splite-handle');
  var dragging = false;

  function setPos(pct) {
    pct = Math.max(5, Math.min(95, pct));
    if (left) left.style.clipPath = 'polygon(0 0, ' + pct + '% 0, ' + pct + '% 100%, 0 100%)';
    if (right) right.style.clipPath = 'polygon(' + pct + '% 0, 100% 0, 100% 100%, ' + pct + '% 100%)';
    if (handle) handle.style.left = pct + '%';
  }

  setPos(50);

  function onStart(e) {
    dragging = true;
    var rect = container.getBoundingClientRect();
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setPos(((clientX - rect.left) / rect.width) * 100);
  }
  function onMove(e) {
    if (!dragging) return;
    e.preventDefault();
    var rect = container.getBoundingClientRect();
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setPos(((clientX - rect.left) / rect.width) * 100);
  }
  function onEnd() { dragging = false; }

  container.addEventListener('mousedown', onStart);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);
  container.addEventListener('touchstart', onStart, { passive: true });
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend', onEnd);
}

// --- Zoom ---
function zoomInBP() { appState.zoom = Math.min(200, appState.zoom + 20); updateZoom(); }
function zoomOutBP() { appState.zoom = Math.max(50, appState.zoom - 20); updateZoom(); }
function updateZoom() {
  var label = document.getElementById('zoom-label');
  if (label) label.textContent = appState.zoom + '%';
  var el = document.getElementById('zoom-content');
  if (el) el.style.transform = 'scale(' + (appState.zoom / 100) + ')';
}

// --- File Upload ---
function setupFileUpload() {
  var input = document.getElementById('file-upload');
  var canvas = document.getElementById('blueprint-canvas');
  if (input && canvas) {
    input.addEventListener('change', function(e) {
      var file = e.target.files[0];
      if (file) {
        var reader = new FileReader();
        reader.onload = function(ev) {
          var img = document.createElement('img');
          img.src = ev.target.result;
          img.className = 'absolute inset-0 w-full h-full object-contain z-[1] pointer-events-none';
          img.id = 'uploaded-blueprint';
          var existing = document.getElementById('uploaded-blueprint');
          if (existing) existing.remove();
          var zoomContent = document.getElementById('zoom-content');
          if (zoomContent) zoomContent.insertBefore(img, zoomContent.querySelector('.z-5'));
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

// --- Markers ---
function renderMarkers() {
  var container = document.getElementById('markers-container');
  if (!container) return;
  container.innerHTML = '';
  appState.markers.forEach(function(m) {
    var tools = TRADE_TOOLS[appState.selectedTrade];
    var matched = tools.find(function(t) { return t.id === m.type; }) || { color: '#4085EC' };
    var el = document.createElement('div');
    el.className = 'absolute z-20 -translate-x-1/2 -translate-y-1/2 group';
    el.style.left = m.x + '%';
    el.style.top = m.y + '%';
    el.innerHTML = '<button onclick="deleteMarker(\'' + m.id + '\')" class="w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-lg relative transition-all duration-300 hover:scale-125" style="background:' + matched.color + '" title="Delete ' + m.label + '"><span class="absolute hidden group-hover:block whitespace-nowrap bg-background text-white text-[10px] font-mono px-2 py-1 rounded-sm border border-outline-variant -top-8 left-1/2 -translate-x-1/2 shadow-xl z-50">' + m.label + ' ($' + m.price.toFixed(2) + ') \u2022 Click to Remove</span><span class="ping absolute top-0 left-0 w-full h-full opacity-35" style="background:' + matched.color + '"></span></button>';
    container.appendChild(el);
  });
  var count = appState.markers.length;
  var btn = document.getElementById('clear-markers-btn');
  var label = document.getElementById('marker-count');
  if (label) label.textContent = count;
  if (btn) btn.classList.toggle('hidden', count === 0);
}

function deleteMarker(id) { appState.markers = appState.markers.filter(function(m) { return m.id !== id; }); renderMarkers(); updateEstimates(); }
function clearMarkers() { appState.markers = []; renderMarkers(); updateEstimates(); }

// --- Manual Items ---
function addManualItem(e) {
  e.preventDefault();
  var name = document.getElementById('item-name').value.trim();
  var qty = parseInt(document.getElementById('item-qty').value) || 1;
  var price = parseFloat(document.getElementById('item-price').value) || 0;
  if (!name) return false;
  appState.manualItems.push({ id: Math.random().toString(36).substr(2, 9), name: name, category: appState.selectedTrade, quantity: qty, unitPrice: price, unit: 'Pcs' });
  document.getElementById('item-name').value = '';
  document.getElementById('item-qty').value = '1';
  document.getElementById('item-price').value = '10';
  updateEstimates();
  return false;
}
function deleteManualItem(id) { appState.manualItems = appState.manualItems.filter(function(i) { return i.id !== id; }); updateEstimates(); }

// --- Estimate Calculations ---
function updateEstimates() {
  appState.laborHours = parseInt(document.getElementById('labor-hours').value) || 0;
  appState.laborRate = parseInt(document.getElementById('labor-rate').value) || 0;
  appState.markupPercent = parseFloat(document.getElementById('markup-percent').value) || 0;
  appState.taxPercent = parseFloat(document.getElementById('tax-percent').value) || 0;

  var lhLabel = document.getElementById('labor-hours-label');
  var lrLabel = document.getElementById('labor-rate-label');
  if (lhLabel) lhLabel.textContent = appState.laborHours + ' Hrs';
  if (lrLabel) lrLabel.textContent = '$' + appState.laborRate + '/Hr';

  var compiled = {};
  appState.markers.forEach(function(m) {
    if (compiled[m.type]) compiled[m.type].qty++;
    else compiled[m.type] = { name: m.label, qty: 1, price: m.price, unit: 'Ea' };
  });

  var materialsCost = Object.values(compiled).reduce(function(s, i) { return s + i.qty * i.price; }, 0) +
    appState.manualItems.reduce(function(s, i) { return s + i.quantity * i.unitPrice; }, 0);
  var laborCost = appState.laborHours * appState.laborRate;
  var subtotal = materialsCost + laborCost;
  var markupCost = subtotal * appState.markupPercent / 100;
  var taxableTotal = subtotal + markupCost;
  var taxCost = taxableTotal * appState.taxPercent / 100;
  var grandTotal = taxableTotal + taxCost;

  var fmt = function(v) { return '$' + v.toFixed(2); };

  var el;
  if (el = document.getElementById('materials-cost')) el.textContent = fmt(materialsCost);
  if (el = document.getElementById('val-labor-hours')) el.textContent = appState.laborHours;
  if (el = document.getElementById('labor-cost')) el.textContent = fmt(laborCost);
  if (el = document.getElementById('subtotal')) el.textContent = fmt(subtotal);
  if (el = document.getElementById('markup-cost')) el.textContent = fmt(markupCost) + ' (+' + appState.markupPercent + '%)';
  if (el = document.getElementById('grand-total')) el.textContent = fmt(grandTotal);

  renderItemList(compiled, materialsCost, laborCost, subtotal, markupCost, taxCost, grandTotal);
}

function renderItemList(compiled, materialsCost, laborCost, subtotal, markupCost, taxCost, grandTotal) {
  var list = document.getElementById('item-list');
  var empty = document.getElementById('empty-items-msg');
  if (!list) return;
  var compiledArr = Object.values(compiled);
  var hasItems = compiledArr.length > 0 || appState.manualItems.length > 0;
  if (empty) empty.style.display = hasItems ? 'none' : 'block';
  if (!hasItems) return;
  list.innerHTML = '';
  compiledArr.forEach(function(item) {
    list.innerHTML += '<div class="flex items-center justify-between p-3 bg-surface-dim/40 rounded-sm border border-outline-variant/30 text-xs font-label-mono text-on-surface-variant"><div class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-brand-blue rounded-full animate-pulse"></span><span class="text-white font-medium">' + item.name + '</span></div><div class="flex items-center gap-4"><span>' + item.qty + ' ' + item.unit + '</span><span class="text-white font-bold">$' + (item.qty * item.price).toFixed(2) + '</span></div></div>';
  });
  appState.manualItems.forEach(function(item) {
    list.innerHTML += '<div class="flex items-center justify-between p-3 bg-brand-purple/5 rounded-sm border border-brand-purple/20 text-xs font-label-mono"><div class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-brand-purple rounded-full"></span><span class="text-white font-medium">' + item.name + '</span></div><div class="flex items-center gap-4"><span>' + item.quantity + ' ' + item.unit + '</span><span class="text-white font-bold">$' + (item.quantity * item.unitPrice).toFixed(2) + '</span><button onclick="deleteManualItem(\'' + item.id + '\')" class="text-red-400 hover:text-red-300 transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button></div></div>';
  });
}

// --- Proposal Modal ---
function openProposal() {
  var compiled = {};
  appState.markers.forEach(function(m) {
    if (compiled[m.type]) compiled[m.type].qty++;
    else compiled[m.type] = { name: m.label, qty: 1, price: m.price, unit: 'Ea' };
  });
  var materialsCost = Object.values(compiled).reduce(function(s, i) { return s + i.qty * i.price; }, 0) +
    appState.manualItems.reduce(function(s, i) { return s + i.quantity * i.unitPrice; }, 0);
  var laborCost = appState.laborHours * appState.laborRate;
  var subtotal = materialsCost + laborCost;
  var markupCost = subtotal * appState.markupPercent / 100;
  var taxableTotal = subtotal + markupCost;
  var taxCost = taxableTotal * appState.taxPercent / 100;
  var grandTotal = taxableTotal + taxCost;

  var client = document.getElementById('client-name').value || 'D. MILLER DEVELOPMENTS';
  var project = document.getElementById('project-name').value || 'SITE G-2 ELECTRICAL FITOUT';

  document.getElementById('prop-date').textContent = new Date().toLocaleDateString();
  document.getElementById('prop-hash').textContent = Math.floor(100000 + Math.random() * 900000);
  document.getElementById('prop-client').textContent = client;
  document.getElementById('prop-project').textContent = project;
  document.getElementById('prop-labor-hours').textContent = appState.laborHours;
  document.getElementById('prop-labor-rate').textContent = appState.laborRate;
  document.getElementById('prop-labor-cost').textContent = '$' + laborCost.toFixed(2);
  document.getElementById('prop-materials').textContent = '$' + materialsCost.toFixed(2);
  document.getElementById('prop-labor').textContent = '$' + laborCost.toFixed(2);
  document.getElementById('prop-markup-pct').textContent = appState.markupPercent;
  document.getElementById('prop-markup').textContent = '$' + markupCost.toFixed(2);
  document.getElementById('prop-tax-pct').textContent = appState.taxPercent;
  document.getElementById('prop-tax').textContent = '$' + taxCost.toFixed(2);
  document.getElementById('prop-total').textContent = '$' + grandTotal.toFixed(2);

  var itemsList = document.getElementById('prop-items-list');
  itemsList.innerHTML = '';
  Object.values(compiled).concat(appState.manualItems.map(function(i) { return { name: i.name, qty: i.quantity, price: i.unitPrice }; })).forEach(function(item) {
    itemsList.innerHTML += '<div class="flex justify-between py-2 items-center text-on-surface-variant"><span>' + item.name + '</span><div class="flex gap-8"><span>' + item.qty + ' units</span><span class="text-white font-semibold">$' + (item.qty * item.price).toFixed(2) + '</span></div></div>';
  });
  itemsList.innerHTML += '<div class="flex justify-between py-2 items-center text-on-surface-variant font-bold border-t border-brand-purple/20 pt-2"><span>Labor Duration Component (' + appState.laborHours + ' hours @ $' + appState.laborRate + '/hr)</span><span class="text-white">$' + laborCost.toFixed(2) + '</span></div>';

  var modal = document.getElementById('proposal-modal');
  if (modal) modal.classList.remove('hidden');
}

function printProposal() {
  var client = document.getElementById('prop-client').textContent;
  var project = document.getElementById('prop-project').textContent;
  var date = document.getElementById('prop-date').textContent;
  var hash = document.getElementById('prop-hash').textContent;
  var itemsHtml = document.getElementById('prop-items-list').innerHTML;
  var materials = document.getElementById('prop-materials').textContent;
  var labor = document.getElementById('prop-labor').textContent;
  var markupPct = document.getElementById('prop-markup-pct').textContent;
  var markup = document.getElementById('prop-markup').textContent;
  var taxPct = document.getElementById('prop-tax-pct').textContent;
  var tax = document.getElementById('prop-tax').textContent;
  var total = document.getElementById('prop-total').textContent;

  var win = window.open('', '_blank');
  win.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Foreman AI - Binding Proposal</title><style>');
  win.document.write('body{font-family:monospace;padding:40px;color:#111;max-width:800px;margin:0 auto;}');
  win.document.write('h1{font-size:24px;font-weight:900;border-bottom:4px solid #4f3a96;padding-bottom:12px;}');
  win.document.write('.sub{color:#666;font-size:11px;text-transform:uppercase;letter-spacing:1px;}');
  win.document.write('.info{display:flex;justify-content:space-between;font-size:12px;margin:16px 0;padding-bottom:12px;border-bottom:1px solid #ddd;}');
  win.document.write('table{width:100%;border-collapse:collapse;font-size:12px;margin:16px 0;}');
  win.document.write('td,th{padding:8px 4px;border-bottom:1px solid #eee;text-align:left;}');
  win.document.write('th{color:#4f3a96;text-transform:uppercase;font-size:10px;letter-spacing:1px;}');
  win.document.write('.summary{background:#f5f3ff;padding:16px;border-radius:4px;font-size:12px;margin:16px 0;}');
  win.document.write('.summary div{display:flex;justify-content:space-between;padding:4px 0;}');
  win.document.write('.total{font-size:18px;font-weight:900;color:#4f3a96;text-align:center;padding:16px;border:2px solid #4f3a96;margin:16px 0;}');
  win.document.write('.sig{display:flex;justify-content:space-between;margin-top:32px;padding-top:16px;border-top:1px solid #ddd;}');
  win.document.write('.sig div{width:45%;border-bottom:1px solid #333;padding-bottom:8px;font-size:10px;text-transform:uppercase;color:#666;}');
  win.document.write('@media print{body{padding:20px;}}');
  win.document.write('</style></head><body>');
  win.document.write('<h1>FOREMAN AI INC.</h1>');
  win.document.write('<p class="sub">Live Field Generated Bidding Agreement</p>');
  win.document.write('<div class="info"><div><strong>CONTRACTOR:</strong> FOREMAN AUTOMATIC SYSTEM CLIENT<br>LICENSE #GC-901844-EL</div><div style="text-align:right"><strong>DATE:</strong> ' + date + '<br><strong>HASH:</strong> #BID-' + hash + '<br><strong>STATUS:</strong> BINDING / PRE-APPROVED</div></div>');
  win.document.write('<div class="info"><div><strong>CLIENT:</strong> ' + client + '</div><div><strong>PROJECT:</strong> ' + project + '</div></div>');
  win.document.write('<h4 style="color:#4f3a96;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-top:24px;">ITEMIZED DISPOSITION</h4>');
  win.document.write('<table><thead><tr><th>Item</th><th>Qty</th><th style="text-align:right">Amount</th></tr></thead><tbody>');
  var rows = itemsHtml.match(/<div class="flex justify-between py-2[^>]*>.*?<\/div><\/div>/g) || [];
  rows.forEach(function(r) {
    var nameMatch = r.match(/<span>([^<]*)<\/span><div class="flex gap-8">/);
    var qtyMatch = r.match(/<span>([0-9.]+) units<\/span>/);
    var amtMatch = r.match(/<span class="text-white font-semibold">\$([0-9,.]+)<\/span>/);
    if (nameMatch || r.includes('Labor Duration')) {
      var label = r.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      win.document.write('<tr><td>' + label + '</td><td></td><td style="text-align:right"></td></tr>');
    } else if (nameMatch) {
      win.document.write('<tr><td>' + nameMatch[1] + '</td><td>' + (qtyMatch ? qtyMatch[1] : '') + '</td><td style="text-align:right">' + (amtMatch ? '$' + amtMatch[1] : '') + '</td></tr>');
    }
  });
  win.document.write('</tbody></table>');
  win.document.write('<div class="summary"><div><span>Materials Subtotal:</span><span>' + materials + '</span></div><div><span>Crew Deployment & Labor:</span><span>' + labor + '</span></div><div><span>Adjustment Factor (' + markupPct + '% Markup):</span><span>' + markup + '</span></div><div><span>Tax Surcharge (' + taxPct + '%):</span><span>' + tax + '</span></div></div>');
  win.document.write('<div class="total">BINDING CONTRACT SUM: ' + total + '</div>');
  win.document.write('<p style="font-size:10px;color:#999;">*LEGALLY BINDING STATEMENT: This proposal presents a live price calculated using supplier API linkages. Sourced raw resources are locked in inventory for 24 hours from timestamp above. Authorized signers acknowledge prices are valid and complete upon mutual transmission.</p>');
  win.document.write('<div class="sig"><div>CREW REPRESENTATIVE</div><div>CLIENT AUTHORIZATION</div></div>');
  win.document.write('</body></html>');
  win.document.close();
  win.focus();
  setTimeout(function() { win.print(); }, 500);
}

function closeProposal() {
  var modal = document.getElementById('proposal-modal');
  if (modal) modal.classList.add('hidden');
}

function copyProposal() {
  var text = '=== FOREMAN AI BINDING PROPOSAL ===\nProject: ' + document.getElementById('prop-project').textContent + '\nClient: ' + document.getElementById('prop-client').textContent + '\nDate: ' + new Date().toLocaleDateString() + '\nStatus: APPROVED BINDING FIELD INITIALIZED\n\n--- ITEMIZED MATERIALS ---\n...\n--- LABOR & LOGISTICS ---\nLabor Rate: $' + appState.laborRate + '/Hr\nEstimated Duration: ' + appState.laborHours + ' Hours\nLabor Total: $' + (appState.laborHours * appState.laborRate).toFixed(2) + '\n\n--- SUMMARY CALCULATIONS ---\n...\nESTIMATED BINDING TOTAL: ' + document.getElementById('prop-total').textContent + '\nConfidence Score: 98.4% Live Verified API inventories linked.';
  navigator.clipboard.writeText(text);
  var btn = document.getElementById('copy-btn-text');
  if (btn) btn.textContent = 'Comms Dump Copied!';
  var btn2 = document.getElementById('prop-copy-btn');
  if (btn2) btn2.textContent = 'Copied!';
  setTimeout(function() { if (btn) btn.textContent = 'Copy Proposal Text Output'; if (btn2) btn2.textContent = 'Copy Agreement Text'; }, 2000);
}

// --- Pricing ---
function setPricing(period) {
  appState.pricingPeriod = period;
  var monthlyBtn = document.getElementById('pricing-monthly');
  var annuallyBtn = document.getElementById('pricing-annually');
  if (monthlyBtn) monthlyBtn.className = 'px-4 py-1.5 font-label-mono text-[10px] rounded-sm uppercase ' + (period === 'monthly' ? 'bg-brand-purple text-white shadow' : 'text-on-surface-variant hover:text-white');
  if (annuallyBtn) annuallyBtn.className = 'px-4 py-1.5 font-label-mono text-[10px] rounded-sm uppercase ' + (period === 'annually' ? 'bg-brand-purple text-white shadow' : 'text-on-surface-variant hover:text-white');
  var prices = { solo: period === 'monthly' ? '$79' : '$63', crew: period === 'monthly' ? '$149' : '$119', fleet: period === 'monthly' ? '$299' : '$239' };
  var solo = document.getElementById('price-solo');
  var crew = document.getElementById('price-crew');
  var fleet = document.getElementById('price-fleet');
  if (solo) solo.textContent = prices.solo;
  if (crew) crew.textContent = prices.crew;
  if (fleet) fleet.textContent = prices.fleet;
  updateFormSelect();
}

function selectPackage(pkg) {
  appState.selectedPkg = pkg;
  var sel = document.getElementById('contact-package');
  if (sel) sel.value = pkg;
  var el = document.getElementById('comms-terminal');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// --- Contact Form ---
var captchaAnswer = '13';
function generateCaptcha() {
  var v1 = Math.floor(Math.random() * 8) + 5;
  var v2 = Math.floor(Math.random() * 7) + 3;
  captchaAnswer = String(v1 + v2);
  var prob = document.getElementById('captcha-problem');
  if (prob) prob.textContent = 'Solve security check: What is ' + v1 + ' + ' + v2 + '?';
  var hashField = document.getElementById('contact-captcha-hash');
  if (hashField) hashField.value = captchaAnswer;
}

function setFormPricing(period) {
  appState.pricingPeriod = period;
  var monthlyBtn = document.getElementById('form-monthly');
  var annuallyBtn = document.getElementById('form-annually');
  if (monthlyBtn) monthlyBtn.className = 'px-3 py-1 text-[10px] font-label-mono uppercase rounded-sm transition-all ' + (period === 'monthly' ? 'bg-brand-purple text-white shadow' : 'text-on-surface-variant hover:text-white');
  if (annuallyBtn) annuallyBtn.className = 'px-3 py-1 text-[10px] font-label-mono uppercase rounded-sm transition-all ' + (period === 'annually' ? 'bg-brand-purple text-white shadow' : 'text-on-surface-variant hover:text-white');
  updateFormSelect();
}

function updateFormSelect() {
  var sel = document.getElementById('contact-package');
  if (!sel) return;
  var p = appState.pricingPeriod;
  sel.innerHTML = '<option value="solo">Solo Operator Plan ($' + (p === 'monthly' ? '79' : '63') + '/mo' + (p === 'annually' ? ' - Billed Annually' : '') + ')</option><option value="crew"' + (appState.selectedPkg === 'crew' ? ' selected' : '') + '>Crew Leader Workspace ($' + (p === 'monthly' ? '149' : '119') + '/mo' + (p === 'annually' ? ' - Billed Annually' : '') + ')</option><option value="fleet"' + (appState.selectedPkg === 'fleet' ? ' selected' : '') + '>Fleet Array Enterprise ($' + (p === 'monthly' ? '299' : '239') + '/mo' + (p === 'annually' ? ' - Billed Annually' : '') + ')</option>';
}

function showFormError(msg) {
  var err = document.getElementById('contact-error');
  var errText = document.getElementById('contact-error-text');
  if (errText) errText.textContent = msg;
  if (err) err.classList.remove('hidden');
}

function resetForm() {
  var success = document.getElementById('contact-success');
  var form = document.getElementById('contact-form');
  var progress = document.getElementById('contact-progress');
  if (success) success.classList.add('hidden');
  if (form) form.classList.remove('hidden');
  if (progress) progress.classList.add('hidden');
  var name = document.getElementById('contact-name');
  var email = document.getElementById('contact-email');
  var msg = document.getElementById('contact-message');
  var captcha = document.getElementById('contact-captcha');
  if (name) name.value = '';
  if (email) email.value = '';
  if (msg) msg.value = '';
  if (captcha) captcha.value = '';
  appState.pricingPeriod = 'monthly';
  appState.selectedPkg = 'crew';
  setFormPricing('monthly');
  updateFormSelect();
  generateCaptcha();
}

// --- AJAX Contact Form ---
function transmitForm(e) {
  e.preventDefault();
  var name = document.getElementById('contact-name').value.trim();
  var email = document.getElementById('contact-email').value.trim();
  var captcha = document.getElementById('contact-captcha').value.trim();
  var message = document.getElementById('contact-message').value.trim();
  var pkg = document.getElementById('contact-package').value;

  if (captcha !== captchaAnswer) {
    showFormError('SECURITY PROTOCOL REJECTED: Incorrect math challenge response. Please try again.');
    generateCaptcha();
    document.getElementById('contact-captcha').value = '';
    return;
  }
  if (!name || !email) {
    showFormError('TRANSMISSION FAIL: Please complete Operator Name and Comm Link Email fields.');
    return;
  }

  var errEl = document.getElementById('contact-error');
  if (errEl) errEl.classList.add('hidden');
  var form = document.getElementById('contact-form');
  if (form) form.classList.add('hidden');
  var progress = document.getElementById('contact-progress');
  if (progress) progress.classList.remove('hidden');

  var logs = ['SHIELD SYSTEM PROTOCOLS INITIATED...','CONNECTING TO CENTRAL SATELLITE ARRAY...','PARSING REGIONAL SUPPLY NETWORKS...','GENERATING AUTONOMOUS CONTRACT AGREEMENTS...','CONFIRMING LOCAL CODE COMPLIANCE FILINGS...','BROKERING INVENTORY LOCK PROTOCOLS...','DATA STREAM RECONCILED. COMMS LOCKED!'];
  var idx = 0;
  var bar = document.getElementById('progress-bar');
  var pct = document.getElementById('progress-percent');
  var logContainer = document.getElementById('progress-logs');
  if (logContainer) logContainer.innerHTML = '';

  var interval = setInterval(function() {
    if (idx < logs.length) {
      if (logContainer) logContainer.innerHTML += '<p class="py-1">\ud83d\udfe2 ' + logs[idx] + '</p>';
      var progressVal = Math.min(100, (idx + 1) * 15);
      if (bar) bar.style.width = progressVal + '%';
      if (pct) pct.textContent = progressVal;
      idx++;
    } else {
      clearInterval(interval);
      if (bar) bar.style.width = '100%';
      if (pct) pct.textContent = '100';

      // Actual AJAX call to WordPress
      var data = new FormData();
      data.append('action', 'foreman_contact');
      data.append('nonce', typeof foreman_ajax !== 'undefined' ? foreman_ajax.nonce : '');
      data.append('name', name);
      data.append('email', email);
      data.append('package', pkg);
      data.append('message', message);
      data.append('captcha', captcha);
      var capMatch = document.getElementById('captcha-problem').textContent.match(/What is (\d+) \+ (\d+)/);
      data.append('captcha_op', capMatch ? capMatch[1] + '+' + capMatch[2] : '');

      var xhr = new XMLHttpRequest();
      xhr.open('POST', typeof foreman_ajax !== 'undefined' ? foreman_ajax.ajax_url : '/wp-admin/admin-ajax.php');
      xhr.onload = function() {
        if (progress) progress.classList.add('hidden');
        if (xhr.status >= 200 && xhr.status < 300) {
          var success = document.getElementById('contact-success');
          if (success) success.classList.remove('hidden');
          var se = document.getElementById('success-email');
          if (se) se.textContent = email;
          var so = document.getElementById('success-operator');
          if (so) so.textContent = 'OPERATOR: ' + name.toUpperCase();
          var st = document.getElementById('success-tier');
          if (st) st.textContent = 'TIER: ' + appState.selectedPkg.toUpperCase() + ' (' + appState.pricingPeriod.toUpperCase() + ')';
        } else {
          showFormError('Transmission failed (HTTP ' + xhr.status + '). Please try again.');
          var form = document.getElementById('contact-form');
          if (form) form.classList.remove('hidden');
        }
      };
      xhr.onerror = function() {
        if (progress) progress.classList.add('hidden');
        showFormError('Network error. Please check your connection and try again.');
        var form = document.getElementById('contact-form');
        if (form) form.classList.remove('hidden');
      };
      xhr.send(data);
    }
  }, 700);
  return false;
}

// --- Suppliers ---
function filterSuppliers() { renderSuppliers(); }
function setSupplierFilter(filter) {
  supplierFilter = filter;
  document.querySelectorAll('#supplier-filters button').forEach(function(b) {
    b.classList.remove('bg-brand-blue/20', 'text-brand-blue', 'font-bold', 'border', 'border-brand-blue/30');
    b.classList.add('text-on-surface-variant', 'hover:text-white');
    if (b.dataset.filter === filter) {
      b.classList.add('bg-brand-blue/20', 'text-brand-blue', 'font-bold', 'border', 'border-brand-blue/30');
      b.classList.remove('text-on-surface-variant', 'hover:text-white');
    }
  });
  renderSuppliers();
}

function renderSuppliers() {
  var grid = document.getElementById('supplier-grid');
  if (!grid) return;
  var search = (document.getElementById('supplier-search').value || '').toLowerCase();
  var filtered = SUPPLIERS.filter(function(s) { return s.name.toLowerCase().includes(search) && (supplierFilter === 'all' || s.category === supplierFilter); });
  grid.innerHTML = '';
  if (filtered.length === 0) {
    grid.innerHTML = '<div class="w-full text-center py-8 text-xs font-label-mono text-on-surface-variant">No matching items found in commercial linked accounts.</div>';
    return;
  }
  filtered.forEach(function(item) {
    var plotted = appState.markers.filter(function(m) { return m.type === item.id; }).length;
    grid.innerHTML += '<div class="hud-border p-4 text-left group hover:bg-brand-purple/5 transition-colors flex flex-col justify-between w-full sm:w-[calc(50%-0.5rem)]"><div><div class="flex justify-between items-start mb-2"><span class="font-label-mono text-[9px] text-brand-blue uppercase tracking-wider">' + item.category.toUpperCase() + '</span><span class="font-label-mono text-[9px] px-1.5 py-0.5 rounded-sm ' + (item.stockStatus === 'IN STOCK' ? 'bg-green-500/10 text-green-400' : item.stockStatus === 'LOW STOCK' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400') + '">' + item.stockStatus + '</span></div><h5 class="font-medium text-xs text-white uppercase tracking-wide mb-3 min-h-[32px] line-clamp-2">' + item.name + '</h5></div><div class="flex items-end justify-between mt-2 pt-2 border-t border-outline-variant/30"><div><span class="font-label-mono text-[10px] text-on-surface-variant/70">SUPPLIER VALUE</span><p class="font-headline-lg text-lg text-white">$' + item.price.toFixed(2) + ' <span class="text-[10px] text-on-surface-variant">/' + item.unit + '</span></p></div><div class="flex items-center gap-2">' + (plotted > 0 ? '<span class="font-label-mono text-[10px] bg-brand-blue/15 text-brand-blue px-2 py-1 rounded-sm border border-brand-blue/30">Active: ' + plotted + '</span>' : '') + '<button ' + (item.stockStatus === 'OUT OF STOCK' ? 'disabled' : '') + ' onclick="procureItem(\'' + item.id + '\')" class="bg-brand-blue/90 hover:bg-brand-purple hover:scale-105 hover:shadow-lg disabled:bg-gray-800 disabled:text-gray-500 disabled:hover:scale-100 disabled:hover:shadow-none text-white p-2 rounded-sm transition-all flex items-center gap-1 text-[10px] font-label-mono uppercase tracking-wider cursor-pointer"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>Procure</button></div></div></div>';
  });
}

function procureItem(supplierId) {
  var s = SUPPLIERS.find(function(s) { return s.id === supplierId; });
  if (!s || s.stockStatus === 'OUT OF STOCK') return;
  var item = { id: Math.random().toString(36).substr(2, 9), name: s.name, category: s.category, quantity: 1, unitPrice: s.price, unit: s.unit };
  appState.manualItems.push(item);
  updateEstimates();
}

// --- 3D Scene ---
function set3DTab(tab) {
  appState.activeTab = tab;
  var tabP = document.getElementById('tab-palette');
  var tabPl = document.getElementById('tab-placed');
  if (tabP) tabP.className = 'tab-btn flex-1 py-1 px-1.5 text-[9px] font-label-mono uppercase tracking-wider text-center rounded-sm transition-all cursor-pointer ' + (tab === 'palette' ? 'bg-brand-purple text-white font-bold shadow-md' : 'text-slate-400 hover:text-white');
  if (tabPl) tabPl.className = 'tab-btn flex-1 py-1 px-1.5 text-[9px] font-label-mono uppercase tracking-wider text-center rounded-sm transition-all cursor-pointer ' + (tab === 'placed' ? 'bg-brand-purple text-white font-bold shadow-md' : 'text-slate-400 hover:text-white');
  var paletteItems = document.getElementById('palette-items');
  var inspectorContent = document.getElementById('inspector-content');
  if (paletteItems) paletteItems.style.display = tab === 'palette' ? 'block' : 'none';
  if (inspectorContent) inspectorContent.style.display = tab === 'placed' ? 'block' : 'none';
  if (tab === 'placed') renderInspector();
}

function selectPaletteItem(idx) {
  appState.selectedPaletteIndex = idx;
  var item = PALETTE_ITEMS[idx];
  appState.activeLayer = item.type;
  appState.toolMode = 'place';
  set3DLayer(item.type);
  document.querySelectorAll('.palette-item').forEach(function(el, i) {
    el.className = 'palette-item w-full flex items-start gap-2 p-2 rounded-sm border text-left transition-all cursor-pointer ' + (i === idx ? 'border-brand-purple bg-brand-purple/10 text-white' : 'border-white/5 hover:border-white/10 text-slate-400 bg-black/20');
  });
  var grid = document.getElementById('spline-grid');
  if (grid) grid.style.pointerEvents = '';
}

function set3DLayer(layer) {
  appState.activeLayer = layer;
  var indicatorLabel = document.getElementById('layer-indicator-label');
  if (indicatorLabel) indicatorLabel.textContent = layer + ' system active';
  document.querySelectorAll('#layer-electrical, #layer-plumbing, #layer-structural').forEach(function(b) {
    if (b.id === 'layer-' + layer) {
      b.className = 'px-2 py-1 sm:py-0.5 text-[8px] font-label-mono rounded-sm border uppercase transition-all cursor-pointer ' +
        (layer === 'electrical' ? 'border-brand-purple bg-brand-purple/15 text-white' : layer === 'plumbing' ? 'border-brand-blue bg-brand-blue/15 text-white' : 'border-slate-500 bg-slate-500/15 text-white');
    } else {
      b.className = 'px-2 py-1 sm:py-0.5 text-[8px] font-label-mono rounded-sm border uppercase transition-all cursor-pointer border-white/5 hover:border-white/10 text-slate-400 bg-black/40';
    }
  });
  renderGrid();
}

function setEngineMode(mode) {
  appState.engineMode = mode;
  var engineCad = document.getElementById('engine-cad');
  var engineWebgl = document.getElementById('engine-webgl');
  if (engineCad) engineCad.className = 'px-1.5 py-1 text-[8px] font-label-mono rounded-sm border uppercase transition-all cursor-pointer ' + (mode === 'cad' ? 'border-brand-purple bg-brand-purple/15 text-white' : 'border-white/5 hover:border-white/10 text-slate-400 bg-black/40');
  if (engineWebgl) engineWebgl.className = 'px-1.5 py-1 text-[8px] font-label-mono rounded-sm border uppercase transition-all cursor-pointer ' + (mode === 'webgl' ? 'border-brand-purple bg-brand-purple/15 text-white' : 'border-white/5 hover:border-white/10 text-slate-400 bg-black/40');
  var grid = document.getElementById('spline-grid');
  var scene = document.getElementById('spline-3d-scene');
  var transform = document.getElementById('spline-transform');
  if (mode === 'cad') {
    if (appState.isOrbiting) toggleAutoOrbit();
    if (transform) transform.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1) translate3d(0px,0px,0px)';
    if (grid) grid.className = 'w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] border-2 border-brand-blue/30 bg-brand-blue/10 relative flex flex-wrap';
    if (scene) scene.className = 'w-full min-h-[520px] bg-slate-950 rounded-xl overflow-hidden border border-brand-blue/30 relative flex flex-col md:flex-row shadow-2xl select-none';
  } else {
    if (transform) transform.style.transform = 'perspective(1000px) rotateX(30deg) rotateY(-35deg) scale(1) translate3d(0px,0px,0px)';
    if (grid) grid.className = 'w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] border-2 border-brand-purple/20 bg-slate-900/40 relative flex flex-wrap';
    if (scene) scene.className = 'w-full min-h-[520px] bg-slate-950 rounded-xl overflow-hidden border border-brand-purple/30 relative flex flex-col md:flex-row shadow-2xl select-none';
  }
}

function setToolMode(mode) {
  appState.toolMode = mode;
  var toolOrbit = document.getElementById('tool-orbit');
  var toolPan = document.getElementById('tool-pan');
  if (toolOrbit) toolOrbit.className = 'p-1.5 rounded-sm text-[9px] font-label-mono uppercase flex items-center gap-1 cursor-pointer transition-colors ' + (mode === 'orbit' ? 'bg-brand-purple text-white' : 'hover:bg-white/5 text-slate-400');
  if (toolPan) toolPan.className = 'p-1.5 rounded-sm text-[9px] font-label-mono uppercase flex items-center gap-1 cursor-pointer transition-colors ' + (mode === 'pan' ? 'bg-brand-blue text-white' : 'hover:bg-white/5 text-slate-400');
  var grid = document.getElementById('spline-grid');
  if (grid) {
    grid.style.pointerEvents = (mode === 'place') ? '' : 'none';
  }
}

function toggleAutoOrbit() {
  appState.isOrbiting = !appState.isOrbiting;
  var toolAuto = document.getElementById('tool-auto');
  if (toolAuto) toolAuto.className = 'p-1.5 rounded-sm text-[9px] font-label-mono uppercase flex items-center gap-1 cursor-pointer transition-colors ' + (appState.isOrbiting ? 'bg-emerald-600 text-white' : 'hover:bg-white/5 text-slate-500');
  if (appState.isOrbiting) startAutoOrbit();
  else if (appState.autoOrbitInterval) { clearInterval(appState.autoOrbitInterval); appState.autoOrbitInterval = null; }
}

function startAutoOrbit() {
  if (appState.autoOrbitInterval) clearInterval(appState.autoOrbitInterval);
  appState.autoOrbitInterval = setInterval(function() {
    if (appState.isOrbiting) {
      appState.rotation = (appState.rotation + 0.5) % 360;
      update3DTransform();
    }
  }, 40);
}

function renderGrid() {
  var grid = document.getElementById('spline-grid');
  if (!grid) return;
  grid.innerHTML = '';
  for (var r = 0; r < 4; r++) {
    for (var c = 0; c < 4; c++) {
      var items = appState.gridItems.filter(function(it) { return it.gridX === c && it.gridY === r; });
      var placed = items.find(function(it) { return it.type === appState.activeLayer; });
      var selected = appState.selectedPlacedId && items.some(function(it) { return it.id === appState.selectedPlacedId; });
      var cell = document.createElement('div');
      cell.className = 'w-1/4 h-1/4 border border-white/5 hover:border-brand-purple/40 hover:bg-brand-purple/5 transition-colors relative cursor-pointer flex items-center justify-center' + (selected ? ' bg-brand-purple/20 border-brand-purple/40' : '');
      cell.onclick = function(x, y) { return function() { handleGridCellClick(x, y); }; }(c, r);
      cell.innerHTML = '<span class="absolute top-1 left-1 text-[6px] font-mono text-slate-700 pointer-events-none">' + c + ',' + r + '</span>';
      if (placed) {
        var sel = appState.selectedPlacedId === placed.id;
        cell.innerHTML += '<div class="absolute w-8 h-8 sm:w-10 sm:h-10 rounded flex flex-col items-center justify-center transition-all ' + (sel ? 'bg-brand-purple text-white border border-brand-purple animate-pulse' : placed.type === 'electrical' ? 'bg-brand-purple/20 text-brand-purple border border-brand-purple/40' : placed.type === 'plumbing' ? 'bg-brand-blue/20 text-brand-blue border border-brand-blue/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40') + '" style="' + (sel ? 'box-shadow:0 0 15px rgba(138,43,226,0.6)' : '') + '"><span class="text-[10px] sm:text-sm select-none pointer-events-none">' + placed.modelSymbol + '</span><span class="text-[5px] sm:text-[6px] font-mono text-white/80 uppercase tracking-tighter truncate max-w-full px-0.5 select-none pointer-events-none">' + placed.name.split(' ')[0] + '</span></div>';
      }
      grid.appendChild(cell);
    }
  }
  update3DStats();
}

function handleGridCellClick(x, y) {
  if (appState.toolMode === 'orbit' || appState.toolMode === 'pan') {
    return; // let canvas drag handlers take over
  }
  if (appState.toolMode === 'place' && appState.activeTab === 'palette') {
    var existing = appState.gridItems.find(function(it) { return it.gridX === x && it.gridY === y && it.type === appState.activeLayer; });
    if (existing) { appState.selectedPlacedId = existing.id; renderGrid(); renderInspector(); return; }
    var template = PALETTE_ITEMS[appState.selectedPaletteIndex];
    var newItem = { id: Date.now().toString(), name: template.name, type: template.type, gridX: x, gridY: y, modelSymbol: template.symbol };
    appState.gridItems.push(newItem);
    appState.selectedPlacedId = newItem.id;
    renderGrid();
    renderInspector();
    update3DStats();
  } else {
    var matched = appState.gridItems.find(function(it) { return it.gridX === x && it.gridY === y && it.type === appState.activeLayer; });
    if (matched) { appState.selectedPlacedId = matched.id; }
    else if (appState.selectedPlacedId) {
      appState.gridItems = appState.gridItems.map(function(it) { return it.id === appState.selectedPlacedId ? { ...it, gridX: x, gridY: y } : it; });
      appState.selectedPlacedId = null;
    }
    renderGrid();
    renderInspector();
    update3DStats();
  }
}

function deleteSelectedGridItem() {
  if (!appState.selectedPlacedId) return;
  appState.gridItems = appState.gridItems.filter(function(it) { return it.id !== appState.selectedPlacedId; });
  appState.selectedPlacedId = null;
  renderGrid();
  renderInspector();
  update3DStats();
}

function clearAllGridItems() {
  appState.gridItems = [];
  appState.selectedPlacedId = null;
  renderGrid();
  renderInspector();
  update3DStats();
}

function renderInspector() {
  var list = document.getElementById('inspector-list');
  if (!list) return;
  list.innerHTML = '';
  if (appState.gridItems.length === 0) {
    list.innerHTML = '<div class="text-center py-8 border border-dashed border-white/5 rounded-sm bg-black/10"><span class="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">No Items Placed</span><span class="text-[7.5px] font-mono text-slate-600 uppercase block mt-1">Switch to Spawner card</span></div>';
    return;
  }
  appState.gridItems.forEach(function(item) {
    var sel = appState.selectedPlacedId === item.id;
    list.innerHTML += '<div onclick="selectGridItem(\'' + item.id + '\')" class="flex items-center justify-between p-2 rounded-sm border transition-all cursor-pointer ' + (sel ? 'border-brand-purple bg-brand-purple/10 text-white' : 'border-white/5 hover:border-white/10 bg-black/20 text-slate-300') + '"><div class="flex items-center gap-1.5 min-w-0"><span class="text-xs shrink-0">' + item.modelSymbol + '</span><div class="min-w-0"><span class="text-[9px] font-label-mono font-semibold block truncate uppercase">' + item.name + '</span><span class="text-[7px] font-mono text-slate-500 uppercase block">Layer: ' + item.type + ' // X:' + item.gridX + ' Y:' + item.gridY + '</span></div></div><button onclick="event.stopPropagation();deleteGridItemById(\'' + item.id + '\')" class="p-1 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded transition-colors cursor-pointer"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button></div>';
  });
  var tabPlaced = document.getElementById('tab-placed');
  if (tabPlaced) tabPlaced.textContent = '\ud83d\udccb Inspector (' + appState.gridItems.length + ')';
}

function selectGridItem(id) { appState.selectedPlacedId = id; renderGrid(); renderInspector(); updateSelectedPanel(); }
function deleteGridItemById(id) { appState.gridItems = appState.gridItems.filter(function(it) { return it.id !== id; }); if (appState.selectedPlacedId === id) appState.selectedPlacedId = null; renderGrid(); renderInspector(); update3DStats(); }

function updateSelectedPanel() {
  var panel = document.getElementById('selected-element-panel');
  var item = appState.gridItems.find(function(it) { return it.id === appState.selectedPlacedId; });
  if (item) {
    if (panel) panel.classList.remove('hidden');
    var nameEl = document.getElementById('selected-item-name');
    var coordsEl = document.getElementById('selected-item-coords');
    if (nameEl) nameEl.textContent = item.name;
    if (coordsEl) coordsEl.textContent = 'COORD: X' + item.gridX + ' // Y' + item.gridY;
  } else {
    if (panel) panel.classList.add('hidden');
  }
}

function update3DStats() {
  var total = appState.gridItems.reduce(function(s, it) { return s + (ITEM_PRICES[it.name] || 100); }, 0);
  var costEl = document.getElementById('est-materials-cost');
  var barEl = document.getElementById('est-progress-bar');
  if (costEl) costEl.textContent = '$' + total;
  if (barEl) barEl.style.width = Math.min(100, (appState.gridItems.length / 16) * 100) + '%';
  updateSelectedPanel();
}

function update3DTransform() {
  var el = document.getElementById('spline-transform');
  if (el) {
    el.style.transform = 'perspective(1000px) rotateX(' + appState.elevation + 'deg) rotateY(' + appState.rotation + 'deg) scale(' + appState.scale + ') translate3d(' + appState.panX + 'px, ' + appState.panY + 'px, 0px)';
    var hud = document.getElementById('spatial-hud');
    if (hud) hud.textContent = 'ROT: ' + Math.round(appState.rotation) + '\u00B0 / ELE: ' + Math.round(appState.elevation) + '\u00B0 / SCL: ' + appState.scale.toFixed(1) + 'x';
  }
}

function reset3DView() { appState.rotation = -35; appState.elevation = 30; appState.scale = 1; appState.panX = 0; appState.panY = 0; update3DTransform(); }
function zoom3DIn() { appState.scale = Math.min(2.5, appState.scale + 0.1); update3DTransform(); var label = document.getElementById('zoom-3d-label'); if (label) label.textContent = Math.round(appState.scale * 100) + '%'; }
function zoom3DOut() { appState.scale = Math.max(0.4, appState.scale - 0.1); update3DTransform(); var label = document.getElementById('zoom-3d-label'); if (label) label.textContent = Math.round(appState.scale * 100) + '%'; }

// --- 3D Orbit/Pan Drag ---
function setup3DCanvasDrag() {
  var canvas = document.getElementById('spline-3d-canvas');
  if (!canvas) return;
  var dragging = false, lastX = 0, lastY = 0;
  function dragHandler(e) {
    if (!canvas.contains(e.target)) return;
    if (e.target.closest('button')) return;
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.style.cursor = 'grabbing';
    if (appState.isOrbiting && (appState.toolMode === 'orbit' || appState.toolMode === 'pan')) { toggleAutoOrbit(); }
  }
  function onMove(e) {
    if (!dragging) return;
    var dx = e.clientX - lastX;
    var dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    if (appState.toolMode === 'orbit') {
      appState.rotation = (appState.rotation + dx * 0.5) % 360;
      appState.elevation = Math.max(-90, Math.min(90, appState.elevation - dy * 0.5));
    } else if (appState.toolMode === 'pan') {
      appState.panX += dx * (2 / appState.scale);
      appState.panY += dy * (2 / appState.scale);
    }
    update3DTransform();
  }
  function onUp() { dragging = false; canvas.style.cursor = appState.toolMode === 'orbit' ? 'grab' : 'grab'; }
  document.addEventListener('mousedown', dragHandler);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
  document.addEventListener('touchstart', function(e) {
    if (e.touches.length !== 1) return;
    if (!canvas.contains(e.target)) return;
    if (e.target.closest('button')) return;
    dragging = true;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
    if (appState.isOrbiting && (appState.toolMode === 'orbit' || appState.toolMode === 'pan')) { toggleAutoOrbit(); }
  }, { passive: true });
  document.addEventListener('touchmove', function(e) {
    if (!dragging || e.touches.length !== 1) return;
    var dx = e.touches[0].clientX - lastX;
    var dy = e.touches[0].clientY - lastY;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
    if (appState.toolMode === 'orbit') {
      appState.rotation = (appState.rotation + dx * 0.5) % 360;
      appState.elevation = Math.max(-90, Math.min(90, appState.elevation - dy * 0.5));
    } else if (appState.toolMode === 'pan') {
      appState.panX += dx * (2 / appState.scale);
      appState.panY += dy * (2 / appState.scale);
    }
    update3DTransform();
  }, { passive: true });
  document.addEventListener('touchend', function() { dragging = false; }, { passive: true });
}

// --- 3D Quote Modal ---
function open3DQuote() {
  var modal = document.getElementById('spline-quote-modal');
  if (modal) modal.classList.remove('hidden');
  var totalItemCost = appState.gridItems.reduce(function(s, it) { return s + (ITEM_PRICES[it.name] || 100); }, 0);
  var conduitLength = appState.gridItems.length * 15;
  var conduitCost = conduitLength * 12;
  var laborCost3d = 450 + (appState.gridItems.length * 85);
  var grand = totalItemCost + conduitCost + laborCost3d;

  var nodeCount = document.getElementById('quote-node-count');
  var hardwareTotal = document.getElementById('quote-hardware-total');
  var conduitTotal = document.getElementById('quote-conduit-cost');
  var laborTotal = document.getElementById('quote-labor-cost');
  var grandTotal = document.getElementById('quote-grand-total');
  if (nodeCount) nodeCount.textContent = appState.gridItems.length;
  if (hardwareTotal) hardwareTotal.textContent = '$' + totalItemCost.toFixed(2);
  if (conduitTotal) conduitTotal.textContent = '$' + conduitCost.toFixed(2);
  if (laborTotal) laborTotal.textContent = '$' + laborCost3d.toFixed(2);
  if (grandTotal) grandTotal.textContent = '$' + grand.toFixed(2);

  var list = document.getElementById('quote-items-list');
  if (!list) return;
  list.innerHTML = '';
  Object.keys(ITEM_PRICES).forEach(function(name) {
    var count = appState.gridItems.filter(function(it) { return it.name === name; }).length;
    if (count === 0) return;
    var uPrice = ITEM_PRICES[name];
    var sym = (PALETTE_ITEMS.find(function(p) { return p.name === name; }) || {}).symbol || '\ud83d\udce6';
    list.innerHTML += '<div class="flex justify-between items-center p-2 bg-slate-900 border border-white/5 rounded-sm"><div class="flex items-center gap-2"><span class="text-sm">' + sym + '</span><div><span class="text-[10px] font-label-mono font-bold text-white block uppercase">' + name + '</span><span class="text-[8px] font-mono text-slate-500 uppercase block">Unit Price: $' + uPrice + ' USD</span></div></div><div class="text-right"><span class="text-[10px] font-mono text-white/90 block">Qty: ' + count + '</span><span class="text-[9px] font-mono text-brand-purple font-semibold block">$' + (count * uPrice) + '</span></div></div>';
  });
  list.innerHTML += '<div class="flex justify-between items-center p-2 bg-slate-900/40 border border-dashed border-white/10 rounded-sm"><div class="flex items-center gap-2"><span class="text-sm">\ud83d\udd0c</span><div><span class="text-[10px] font-label-mono text-slate-350 block uppercase">CONDUIT & PIPELINES (Est. Grid Distance)</span><span class="text-[8px] font-mono text-slate-500 uppercase block">Calculated length: ' + conduitLength + ' LF</span></div></div><div class="text-right"><span class="text-[9px] font-mono text-white/90 block">Rate: $12 / LF</span><span class="text-[9px] font-mono text-brand-blue font-semibold block">$' + conduitCost + '</span></div></div>';
}

function close3DQuote() {
  var modal = document.getElementById('spline-quote-modal');
  var toast = document.getElementById('quote-submitted-toast');
  if (modal) modal.classList.add('hidden');
  if (toast) toast.classList.add('hidden');
}

function copyBOMSpec() {
  var raw = appState.gridItems.map(function(it) { return { name: it.name, system: it.type.toUpperCase(), coordinates: 'X:' + it.gridX + ' Y:' + it.gridY, estimated_price_usd: ITEM_PRICES[it.name] || 100 }; });
  navigator.clipboard.writeText(JSON.stringify(raw, null, 2));
  var btn = document.getElementById('copy-bom-text');
  if (btn) btn.textContent = '\u2713 Specifications Copied!';
  setTimeout(function() { if (btn) btn.textContent = '\ud83d\udccb Copy BOM Spec Code'; }, 2000);
}

function submit3DQuote() {
  var btn = document.getElementById('submit-quote-btn');
  if (btn) {
    btn.textContent = '\u2713 Dispatched to Wholesalers!';
    btn.className = 'flex-1 sm:flex-initial text-center py-2 px-5 rounded-md text-[9px] font-label-mono font-bold uppercase tracking-wider cursor-pointer shadow-lg active:scale-95 transition-all bg-emerald-600 hover:bg-emerald-500 text-white';
  }
  var toast = document.getElementById('quote-submitted-toast');
  if (toast) toast.classList.remove('hidden');
}

function dismissQuoteToast() {
  var toast = document.getElementById('quote-submitted-toast');
  if (toast) toast.classList.add('hidden');
}

// --- Init ---
document.addEventListener('DOMContentLoaded', function() {
  setupCanvasClick();
  renderTools();
  renderSuppliers();
  renderMarkers();
  renderGrid();
  updateEstimates();
  generateCaptcha();
  startAutoOrbit();
  setupFileUpload();
  setupSpliteSlider();
  setup3DCanvasDrag();

  // Attach form submit handler
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', transmitForm);
  }
});

// Expose to global scope for inline onclick handlers
window.updateEstimates = updateEstimates;
window.showHome = showHome;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.setTrade = setTrade;
window.setTool = setTool;
window.zoomInBP = zoomInBP;
window.zoomOutBP = zoomOutBP;
window.deleteMarker = deleteMarker;
window.clearMarkers = clearMarkers;
window.addManualItem = addManualItem;
window.deleteManualItem = deleteManualItem;
window.openProposal = openProposal;
window.printProposal = printProposal;
window.closeProposal = closeProposal;
window.copyProposal = copyProposal;
window.setPricing = setPricing;
window.selectPackage = selectPackage;
window.generateCaptcha = generateCaptcha;
window.setFormPricing = setFormPricing;
window.updateFormSelect = updateFormSelect;
window.transmitForm = transmitForm;
window.resetForm = resetForm;
window.filterSuppliers = filterSuppliers;
window.setSupplierFilter = setSupplierFilter;
window.procureItem = procureItem;
window.set3DTab = set3DTab;
window.selectPaletteItem = selectPaletteItem;
window.set3DLayer = set3DLayer;
window.setEngineMode = setEngineMode;
window.setToolMode = setToolMode;
window.toggleAutoOrbit = toggleAutoOrbit;
window.reset3DView = reset3DView;
window.zoom3DIn = zoom3DIn;
window.zoom3DOut = zoom3DOut;
window.deleteSelectedGridItem = deleteSelectedGridItem;
window.clearAllGridItems = clearAllGridItems;
window.selectGridItem = selectGridItem;
window.deleteGridItemById = deleteGridItemById;
window.open3DQuote = open3DQuote;
window.close3DQuote = close3DQuote;
window.copyBOMSpec = copyBOMSpec;
window.submit3DQuote = submit3DQuote;
window.dismissQuoteToast = dismissQuoteToast;

})();
