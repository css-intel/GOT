// Stripe webhook no longer needed — payments are handled via Venmo.
// This file is kept as a placeholder. Admin manually confirms payments.
export async function handler(event) {
  return { statusCode: 200, body: JSON.stringify({ message: 'Payments handled via Venmo' }) };
}
