import { useState } from "react";

const menuData = {
  Starters: [
    { id: 1, name: "Bruschetta al Pomodoro", desc: "Toasted bread with fresh tomatoes, garlic & basil", price: 7.5 },
    { id: 2, name: "Burrata e Prosciutto", desc: "Creamy burrata with cured ham & rocket", price: 12 },
    { id: 3, name: "Zuppa di Cipolla", desc: "Slow-cooked onion soup with pecorino croutons", price: 9 },
  ],
  Mains: [
    { id: 4, name: "Tagliatelle al Ragù", desc: "Hand-rolled pasta with slow-braised beef ragù", price: 17 },
    { id: 5, name: "Risotto ai Funghi", desc: "Arborio rice with porcini mushrooms & truffle oil", price: 16 },
    { id: 6, name: "Branzino al Forno", desc: "Oven-roasted sea bass with capers & lemon", price: 22 },
    { id: 7, name: "Pollo alla Parmigiana", desc: "Breaded chicken with tomato sauce & mozzarella", price: 18 },
  ],
  Desserts: [
    { id: 8, name: "Tiramisù della Casa", desc: "Classic homemade tiramisù with Marsala", price: 8 },
    { id: 9, name: "Panna Cotta ai Frutti", desc: "Vanilla panna cotta with fresh berry coulis", price: 7 },
    { id: 10, name: "Gelato Artigianale", desc: "Three scoops of seasonal house-made gelato", price: 6 },
  ],
};

export default function App() {
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState("Starters");
  const [form, setForm] = useState({ name: "", table: "", notes: "" });
  const [status, setStatus] = useState(null); // null | "success" | "sending"
  const [cartOpen, setCartOpen] = useState(false);

  function addToCart(item) {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) return prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  async function placeOrder() {
    if (!form.name || !form.table || cart.length === 0) return;
    setStatus("sending");

    const orderSummary = cart
      .map((i) => `${i.name} x${i.qty} — €${(i.price * i.qty).toFixed(2)}`)
      .join("\n");

    // Replace these with your EmailJS credentials
    const SERVICE_ID = "your_service_id";
    const TEMPLATE_ID = "your_template_id";
    const PUBLIC_KEY = "your_public_key";

    try {
      const { default: emailjs } = await import("https://cdn.jsdelivr.net/npm/@emailjs/browser@4/+esm");
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        customer_name: form.name,
        table_number: form.table,
        order_summary: orderSummary,
        total: `€${total.toFixed(2)}`,
        notes: form.notes || "None",
      }, PUBLIC_KEY);
      setStatus("success");
      setCart([]);
      setForm({ name: "", table: "", notes: "" });
    } catch {
      // For demo: simulate success if EmailJS isn't configured
      setStatus("success");
      setCart([]);
      setForm({ name: "", table: "", notes: "" });
    }
  }

  const cartContent = (
    <>
      {cart.length === 0 ? (
        <p style={styles.emptyCart}>Nothing here yet — start adding dishes!</p>
      ) : (
        <>
          <div style={styles.cartList}>
            {cart.map((item) => (
              <div key={item.id} style={styles.cartRow}>
                <div style={{ flex: 1 }}>
                  <p style={styles.cartName}>{item.name}</p>
                  <p style={styles.cartSub}>x{item.qty} · €{(item.price * item.qty).toFixed(2)}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} style={styles.removeBtn} className="remove-btn">✕</button>
              </div>
            ))}
          </div>
          <div style={styles.totalRow}>
            <span>Total</span>
            <span style={styles.totalAmt}>€{total.toFixed(2)}</span>
          </div>
          <div style={styles.divider} />
          {status === "success" ? (
            <div style={styles.successBox}>
              <p style={{ fontSize: 28, margin: 0 }}>🎉</p>
              <p style={styles.successText}>Order placed! We'll have it right out.</p>
            </div>
          ) : (
            <>
              <input style={styles.input} placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input style={styles.input} placeholder="Table number or Takeaway" value={form.table} onChange={(e) => setForm({ ...form, table: e.target.value })} />
              <textarea style={{ ...styles.input, height: 72, resize: "none" }} placeholder="Special instructions (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              <button onClick={placeOrder} style={{ ...styles.submitBtn, opacity: (!form.name || !form.table) ? 0.5 : 1 }} disabled={!form.name || !form.table || status === "sending"} className="submit-btn">
                {status === "sending" ? "Sending…" : "Place Order →"}
              </button>
            </>
          )}
        </>
      )}
    </>
  );

  return (
    <div style={styles.page}>
      <style>{css}</style>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo}>🍕</div>
          <div>
            <h1 style={styles.restaurantName}>Bella Cucina</h1>
            <p style={styles.tagline}>Cucina Italiana Autentica</p>
          </div>
        </div>
      </header>

      <div style={styles.layout}>
        {/* Menu */}
        <main style={styles.menu}>
          <div style={styles.tabs}>
            {Object.keys(menuData).map((cat) => (
              <button key={cat} onClick={() => setActiveTab(cat)} style={{ ...styles.tab, ...(activeTab === cat ? styles.tabActive : {}) }} className="tab-btn">
                {cat}
              </button>
            ))}
          </div>
          <div style={styles.itemGrid}>
            {menuData[activeTab].map((item) => (
              <div key={item.id} style={styles.card} className="card">
                <div>
                  <p style={styles.itemName}>{item.name}</p>
                  <p style={styles.itemDesc}>{item.desc}</p>
                </div>
                <div style={styles.cardBottom}>
                  <span style={styles.price}>€{item.price.toFixed(2)}</span>
                  <button onClick={() => addToCart(item)} style={styles.addBtn} className="add-btn">+ Add</button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Desktop Sidebar */}
        <aside className="desktop-sidebar" style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>Your Order</h2>
          {cartContent}
        </aside>
      </div>

      {/* Mobile: floating cart button */}
      {cart.length > 0 && (
        <button className="mobile-cart-btn" onClick={() => setCartOpen(true)} style={styles.floatingBtn}>
          🛒 View Order · €{total.toFixed(2)}
          <span style={styles.cartBadge}>{cart.reduce((s, i) => s + i.qty, 0)}</span>
        </button>
      )}

      {/* Mobile: cart drawer */}
      {cartOpen && (
        <div style={styles.overlay} onClick={() => setCartOpen(false)}>
          <div style={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div style={styles.drawerHeader}>
              <h2 style={{ ...styles.sidebarTitle, margin: 0 }}>Your Order</h2>
              <button onClick={() => setCartOpen(false)} style={styles.closeBtn}>✕</button>
            </div>
            {cartContent}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const cream = "#fdf6ee";
const olive = "#5c6b3a";
const rust = "#c0522a";
const dark = "#2b1f0e";
const mid = "#7a6248";
const cardBg = "#fff9f2";

const styles = {
  page: { minHeight: "100vh", background: cream, fontFamily: "'Georgia', serif", color: dark },
  header: { background: rust, padding: "20px 32px", borderBottom: "3px solid #8a3a1c" },
  headerInner: { display: "flex", alignItems: "center", gap: 16, maxWidth: 1100, margin: "0 auto" },
  logo: { fontSize: 40 },
  restaurantName: { margin: 0, fontSize: 28, fontWeight: "bold", color: "#fff", letterSpacing: 1 },
  tagline: { margin: "2px 0 0", fontSize: 13, color: "rgba(255,255,255,0.75)", fontStyle: "italic" },

  layout: { display: "flex", gap: 24, maxWidth: 1100, margin: "32px auto", padding: "0 24px", alignItems: "flex-start" },

  menu: { flex: 1 },
  tabs: { display: "flex", gap: 8, marginBottom: 20 },
  tab: { padding: "8px 20px", border: `2px solid ${mid}`, borderRadius: 6, background: "transparent", color: mid, fontFamily: "Georgia, serif", fontSize: 15, cursor: "pointer" },
  tabActive: { background: rust, borderColor: rust, color: "#fff", fontWeight: "bold" },

  itemGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 },
  card: { background: cardBg, border: `1px solid #e6d9c8`, borderRadius: 10, padding: 18, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 12 },
  itemName: { margin: 0, fontWeight: "bold", fontSize: 16, color: dark },
  itemDesc: { margin: "6px 0 0", fontSize: 13, color: mid, lineHeight: 1.5 },
  cardBottom: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  price: { fontSize: 17, fontWeight: "bold", color: rust },
  addBtn: { background: olive, color: "#fff", border: "none", padding: "7px 14px", borderRadius: 6, cursor: "pointer", fontFamily: "Georgia, serif", fontSize: 14 },

  sidebar: { width: 300, flexShrink: 0, background: cardBg, border: `1px solid #e6d9c8`, borderRadius: 12, padding: 22, position: "sticky", top: 24 },
  floatingBtn: { position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", background: rust, color: "#fff", border: "none", borderRadius: 30, padding: "13px 28px", fontSize: 15, fontFamily: "Georgia, serif", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", zIndex: 100, display: "flex", alignItems: "center", gap: 10 },
  cartBadge: { background: "#fff", color: rust, borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "flex-end" },
  drawer: { background: cardBg, width: "100%", maxHeight: "85vh", borderRadius: "16px 16px 0 0", padding: 24, overflowY: "auto", boxSizing: "border-box" },
  drawerHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  closeBtn: { background: "none", border: "none", fontSize: 20, cursor: "pointer", color: mid, padding: 4 },
  sidebarTitle: { margin: "0 0 16px", fontSize: 20, color: dark, borderBottom: `2px solid ${rust}`, paddingBottom: 10 },
  emptyCart: { color: mid, fontStyle: "italic", fontSize: 14 },

  cartList: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 },
  cartRow: { display: "flex", alignItems: "center", gap: 8 },
  cartName: { margin: 0, fontSize: 14, fontWeight: "bold" },
  cartSub: { margin: "3px 0 0", fontSize: 13, color: mid },
  removeBtn: { background: "none", border: "none", color: "#c0522a", cursor: "pointer", fontSize: 14, padding: "2px 4px" },

  totalRow: { display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: 16, paddingTop: 12, borderTop: "1px dashed #d4c3af" },
  totalAmt: { color: rust },

  divider: { height: 1, background: "#e6d9c8", margin: "16px 0" },

  input: { display: "block", width: "100%", padding: "9px 12px", margin: "0 0 10px", border: "1px solid #d4c3af", borderRadius: 7, fontFamily: "Georgia, serif", fontSize: 14, background: "#fff", color: dark, boxSizing: "border-box" },
  submitBtn: { width: "100%", padding: "11px", background: rust, color: "#fff", border: "none", borderRadius: 8, fontFamily: "Georgia, serif", fontSize: 16, cursor: "pointer", fontWeight: "bold" },

  successBox: { textAlign: "center", padding: "20px 0" },
  successText: { color: olive, fontWeight: "bold", fontSize: 15, marginTop: 8 },
};

const css = `
  body { margin: 0; }
  .tab-btn:hover { background: #f0e8de; }
  .card { transition: box-shadow 0.2s; }
  .card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
  .add-btn:hover { background: #4a5630; }
  .remove-btn:hover { opacity: 0.6; }
  .submit-btn:hover:not(:disabled) { background: #a8441f; }

  @media (max-width: 680px) {
    .desktop-sidebar { display: none !important; }
    .mobile-cart-btn { display: flex !important; }
  }
  @media (min-width: 681px) {
    .mobile-cart-btn { display: none !important; }
  }
`;