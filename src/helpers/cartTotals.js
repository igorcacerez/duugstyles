function asNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function calculateSubtotal(cart = []) {
  return cart.reduce((sum, item) => sum + asNumber(item.price) * asNumber(item.quantity || 1), 0);
}

function calculateDiscount(subtotal, coupon) {
  if (!coupon || subtotal <= 0) return 0;

  const value = asNumber(coupon.value);
  if (coupon.type === 'percent') return Math.min(subtotal, subtotal * (value / 100));
  return Math.min(subtotal, value);
}

function calculateCartTotals(cart = [], coupon = null, shipping = 0) {
  const subtotal = calculateSubtotal(cart);
  const discount = calculateDiscount(subtotal, coupon);
  const shippingCost = asNumber(shipping);
  const total = Math.max(0, subtotal - discount + shippingCost);

  return { subtotal, discount, shipping: shippingCost, total };
}

module.exports = { calculateCartTotals, calculateDiscount, calculateSubtotal };
