let paypalPromise = null;

export function loadPayPalSdk() {
  if (window.paypal) return Promise.resolve(window.paypal);
  if (paypalPromise) return paypalPromise;

  paypalPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src =
      'https://www.paypal.com/sdk/js?client-id=BAAT-dKjhafLIh_UK3LkezEdQNfO6oMxUHGVPD11EgMlr5RmulE6l0VLXovlUlr7we_XBf7W7uB9nio-3I&components=hosted-buttons&disable-funding=venmo&currency=USD';
    script.async = true;
    script.onload = () => resolve(window.paypal);
    script.onerror = () => {
      paypalPromise = null;
      reject(new Error('Failed to load PayPal SDK'));
    };
    document.body.appendChild(script);
  });

  return paypalPromise;
}
