import { useEffect, useRef } from 'react';
import { paymentConfig } from '@/lib/payment-config';
import { loadPayPalSdk } from '@/lib/loadPayPalSdk';

export default function DonationForm() {
  const paypalRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    loadPayPalSdk()
      .then((paypal) => {
        if (!cancelled && paypal?.HostedButtons && paypalRef.current) {
          paypalRef.current.innerHTML = '';
          paypal.HostedButtons({
            hostedButtonId: paymentConfig.paypal.hostedButtonId,
          }).render(paypalRef.current);
        }
      })
      .catch(() => {
        if (!cancelled && paypalRef.current) {
          paypalRef.current.innerHTML =
            '<p class="text-sm text-red-400 text-center">Unable to load payment button. Please try again later.</p>';
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-stone-100">
      <div ref={paypalRef} className="paypal-container min-h-[50px]"></div>
      <p className="text-xs text-stone-400 leading-relaxed mt-4 text-center">
        Click the button above to donate securely with PayPal or a debit/credit card
        (Visa, Mastercard, American Express, etc.).
      </p>
    </div>
  );
}
