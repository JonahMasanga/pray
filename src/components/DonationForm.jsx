import { useEffect, useRef } from 'react';
import { paymentConfig } from '@/lib/payment-config';

export default function DonationForm() {
  const paypalRef = useRef(null);

  useEffect(() => {
    const renderButton = () => {
      if (window.paypal?.HostedButtons && paypalRef.current) {
        paypalRef.current.innerHTML = '';
        window.paypal.HostedButtons({
          hostedButtonId: paymentConfig.paypal.hostedButtonId,
        }).render(paypalRef.current);
      }
    };
    if (window.paypal) {
      renderButton();
    } else {
      const interval = setInterval(() => {
        if (window.paypal) {
          clearInterval(interval);
          renderButton();
        }
      }, 200);
      return () => clearInterval(interval);
    }
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
