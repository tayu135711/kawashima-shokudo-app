// ------------------------------------------------------------------
// モックデータ層。バックエンド実装後は fetch('/api/...') に差し替える想定。
// ------------------------------------------------------------------

const STATUS_LABELS = {
  pending_payment: '決済待ち',
  ordered: '注文確定',
  accepted: '店舗受付済み',
  preparing: '調理中',
  ready: '受け取り待ち',
  assigned: '配達中',
  delivered: '配達完了',
  cancelled: 'キャンセル',
};

// 状態遷移表（仕様書「状態遷移図」シートと一致）
const STATUS_ORDER = ['pending_payment', 'ordered', 'accepted', 'preparing', 'ready', 'assigned', 'delivered'];

const STORES = [
  { id: 's1', name: 'かに定食 川島', desc: '創業以来の味を、そのまま食卓へ。', rating: 4.6, eta: '25分〜', accent: 'crab' },
  { id: 's2', name: '港町どんぶり亭', desc: '旬の魚介を使った丼専門店。', rating: 4.3, eta: '35分〜', accent: 'gold' },
  { id: 's3', name: '麺屋 潮', desc: '潮だしの効いたラーメン・そば。', rating: 4.1, eta: '20分〜', accent: 'sea' },
];

const MENUS = {
  s1: [
    { id: 'm1', category: '定食', name: 'かに味噌汁定食', price: 1280, published: true },
    { id: 'm2', category: '定食', name: '焼き蟹御膳', price: 1680, published: true },
    { id: 'm3', category: '丼', name: 'かにクリームコロッケ丼', price: 1180, published: true },
    { id: 'm4', category: 'ドリンク', name: '緑茶', price: 200, published: true },
    { id: 'm5', category: '丼', name: '季節の特選丼', price: 1450, published: false },
  ],
  s2: [
    { id: 'm6', category: '丼', name: '海鮮ちらし丼', price: 1520, published: true },
    { id: 'm7', category: '丼', name: 'まぐろ漬け丼', price: 1280, published: true },
  ],
  s3: [
    { id: 'm8', category: '麺類', name: '塩ラーメン', price: 980, published: true },
    { id: 'm9', category: '麺類', name: '味噌ラーメン', price: 1020, published: true },
  ],
};

function getStore(id) { return STORES.find(s => s.id === id); }
function getMenuItem(storeId, menuId) { return (MENUS[storeId] || []).find(m => m.id === menuId); }

// ---------------- カート（customer / sessionStorage） ----------------
function getCart() {
  const raw = sessionStorage.getItem('kawashima_cart');
  return raw ? JSON.parse(raw) : { storeId: null, items: [] };
}
function setCart(cart) { sessionStorage.setItem('kawashima_cart', JSON.stringify(cart)); }
function clearCart() { sessionStorage.removeItem('kawashima_cart'); }

function addToCart(storeId, menuId) {
  const cart = getCart();
  if (cart.storeId && cart.storeId !== storeId) {
    if (!confirm('別のお店の商品がカートに入っています。カートを空にして追加しますか？')) return;
    cart.items = [];
  }
  cart.storeId = storeId;
  const existing = cart.items.find(i => i.menuId === menuId);
  if (existing) existing.qty += 1;
  else cart.items.push({ menuId, qty: 1 });
  setCart(cart);
}

function cartLines() {
  const cart = getCart();
  return cart.items.map(i => ({ ...i, menu: getMenuItem(cart.storeId, i.menuId) })).filter(l => l.menu);
}
function cartTotal() {
  return cartLines().reduce((sum, l) => sum + l.menu.price * l.qty, 0);
}
function cartCount() {
  return cartLines().reduce((sum, l) => sum + l.qty, 0);
}

// ---------------- 注文（全ロール共通 / localStorage） ----------------
function getOrders() {
  const raw = localStorage.getItem('kawashima_orders');
  return raw ? JSON.parse(raw) : [];
}
function saveOrders(orders) { localStorage.setItem('kawashima_orders', JSON.stringify(orders)); }

function createOrderFromCart(customerName) {
  const cart = getCart();
  const store = getStore(cart.storeId);
  const lines = cartLines();
  const total = cartTotal();
  const order = {
    id: 'o' + Date.now(),
    storeId: cart.storeId,
    storeName: store ? store.name : '不明な店舗',
    customerName: customerName || 'ゲスト',
    items: lines.map(l => ({ name: l.menu.name, qty: l.qty, price: l.menu.price })),
    total,
    status: 'pending_payment',
    courier: null,
    createdAt: new Date().toISOString(),
  };
  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
  return order;
}

function getOrder(id) { return getOrders().find(o => o.id === id); }

function updateOrderStatus(id, status) {
  const orders = getOrders();
  const order = orders.find(o => o.id === id);
  if (!order) return null;
  order.status = status;
  saveOrders(orders);
  return order;
}

function assignCourier(id, courierName) {
  const orders = getOrders();
  const order = orders.find(o => o.id === id);
  if (!order) return null;
  order.status = 'assigned';
  order.courier = courierName;
  saveOrders(orders);
  return order;
}

function statusBadgeClass(status) {
  if (status === 'delivered') return 'badge-done';
  if (status === 'cancelled') return 'badge-cancel';
  if (status === 'pending_payment' || status === 'ordered') return 'badge-wait';
  return 'badge-progress';
}
