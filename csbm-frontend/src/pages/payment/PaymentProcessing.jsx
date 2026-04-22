import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentProcessing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentData, course } = location.state || {};

  useEffect(() => {
    if (paymentData) {
      const timer = setTimeout(() => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://sandbox.payhere.lk/pay/checkout';

        Object.entries(paymentData).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [paymentData]);

  if (!paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-surface text-on-surface">
        <p>No payment data found. Returning...</p>
        {setTimeout(() => navigate('/student-dashboard'), 2000) && null}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-surface font-body text-on-surface">
      <style>{`
        @keyframes custom-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-slow-spin {
          animation: custom-spin 2s linear infinite;
        }
        .shimmer-bg {
          background: linear-gradient(90deg, #f2f3ff 25%, #ffffff 50%, #f2f3ff 75%);
          background-size: 200% 100%;
          animation: shimmer 2.5s infinite linear;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      
      {/* Background Decorative Blobs */}
      <div className="top-[-10%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-primary-fixed-dim/20 blur-[120px] absolute"></div>
      <div className="bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] rounded-full bg-secondary-fixed/30 blur-[100px] absolute"></div>

      {/* Processing Card */}
      <div className="relative z-10 w-full max-w-lg bg-surface-container-lowest rounded-lg shadow-sm p-12 text-center flex flex-col items-center gap-8 border border-outline-variant/10">
        
        {/* Logo block */}
        <div className="relative">
          <div className="w-24 h-24 flex items-center justify-center bg-primary rounded-2xl shadow-lg transform rotate-3">
            <span className="material-symbols-outlined text-white text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white shadow-md transform -rotate-12 border-2 border-surface-container-lowest">
            <span className="material-symbols-outlined text-xl">school</span>
          </div>
        </div>

        {/* Status text */}
        <div className="space-y-4 w-full">
          <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">Processing Payment</h1>
          <p className="text-on-surface-variant font-medium leading-relaxed max-w-xs mx-auto">
            Please wait while we redirect you to the secure confirmation portal.
          </p>
        </div>

        {/* Large spinner */}
        <div className="relative py-4">
          <div className="w-24 h-24 rounded-full border-4 border-surface-container-high"></div>
          <div className="absolute top-4 inset-0 w-24 h-24 rounded-full border-4 border-transparent border-t-primary animate-slow-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Transaction details card */}
        <div className="w-full bg-surface-container-low rounded-xl p-6 flex flex-col gap-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-on-surface-variant font-medium">Academic Portal</span>
            <span className="font-bold text-on-surface">CSBM Campus</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-on-surface-variant font-medium">Session ID</span>
            <span className="font-mono text-xs bg-surface-container-highest px-2 py-0.5 rounded text-on-surface font-bold">
              {paymentData.order_id || 'Generating...'}
            </span>
          </div>
        </div>

        {/* Security Note */}
        <div className="w-full bg-green-50 rounded-xl p-4 flex items-center gap-4 border border-green-100/50 text-left">
          <div className="bg-white p-2 rounded-lg shadow-sm shrink-0">
            <span className="material-symbols-outlined text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
          </div>
          <div>
            <p className="text-sm font-bold text-green-800">Secure Transaction</p>
            <p className="text-xs text-green-700/80 mt-0.5 font-medium">Bank-grade 256-bit SSL encryption active</p>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-0 w-full text-center z-20">
        <span className="text-on-surface-variant text-sm mr-2 font-medium">Taking too long?</span>
        <button 
          onClick={() => navigate('/payment/summary', { state: { course } })}
          className="text-primary font-bold hover:underline"
        >
          Click here to retry
        </button>
      </div>

      {/* Shimmer overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] shimmer-bg z-50"></div>
    </div>
  );
};

export default PaymentProcessing;
