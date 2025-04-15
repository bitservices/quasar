// src/boot/paystack.js
export default async ({ app, router, Vue }) => {
  console.log(app,router,Vue)
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => {
      console.log('Paystack script loaded successfully');
    };
    document.body.appendChild(script);
  };
  