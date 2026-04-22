import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const orderId = searchParams.get('order_id');
  const navigate = useNavigate();

  const isCancelled = status === 'cancelled';

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen flex flex-col relative overflow-hidden">
      <style>{`
        .main-gradient {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%);
        }
        .cta-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .error-banner {
          background: linear-gradient(135deg, #ba1a1a 0%, #ef4444 100%);
        }
      `}</style>
      
      {/* Header */}
      <header className="w-full h-20 flex items-center justify-center bg-white/80 backdrop-blur-md z-20 border-b border-outline-variant/10">
        <h1 className="text-2xl font-black text-primary tracking-tight font-headline">CSBM Campus</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6 md:p-12 z-20">
        
        <div className="w-full max-w-2xl bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden border border-outline-variant/20">
          
          {/* Top Error Banner */}
          <div className="error-banner h-4 w-full"></div>

          {/* Card Content */}
          <div className="p-8 md:p-12 flex flex-col items-center text-center">
            
            {/* Status Icon Container */}
            <div className="mb-8 relative">
              <div className="w-24 h-24 rounded-full bg-error-container flex items-center justify-center">
                <span className="material-symbols-outlined text-error text-5xl font-bold">close</span>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-surface-container-high rounded-full flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-primary text-sm font-bold">priority_high</span>
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-3xl md:text-4xl font-extrabold font-headline text-on-surface mb-4 tracking-tight">
              {isCancelled ? 'Payment Cancelled' : 'Payment Failed'}
            </h2>
            
            {/* Description */}
            <p className="text-on-surface-variant text-lg max-w-md mb-10 leading-relaxed font-medium">
              {isCancelled 
                ? 'Your payment was cancelled. No charges were made to your account.' 
                : 'We encountered an issue while processing your transaction. Your account has not been charged.'}
            </p>

            {/* Transaction Details Card */}
            <div className="w-full bg-surface-container-low rounded-2xl p-6 mb-10 text-left border border-outline-variant/10">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-outline text-[18px]">info</span>
                <span className="font-bold uppercase tracking-wider text-xs text-on-surface-variant">TRANSACTION DETAILS</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-surface-container-highest pb-3">
                  <span className="text-sm font-medium text-on-surface-variant">Error Code</span>
                  <span className="font-mono text-xs font-bold text-error bg-error-container/50 px-2 py-1 rounded">
                    {isCancelled ? 'ERR_CANCELLED' : 'ERR_PAYMENT_FAILED'}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-surface-container-highest pb-3">
                  <span className="text-sm font-medium text-on-surface-variant">Reason</span>
                  <span className="text-sm font-bold text-on-surface text-right">
                    {isCancelled ? 'Cancelled by user' : 'Payment could not be processed'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-sm font-medium text-on-surface-variant">Transaction ID</span>
                  <span className="text-sm font-bold text-on-surface font-mono">{orderId || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Next Steps Buttons */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <button 
                onClick={() => navigate(-1)}
                className="flex flex-col items-center justify-center p-6 rounded-2xl group hover:-translate-y-1 transition-transform cursor-pointer cta-gradient text-white shadow-md border border-transparent"
              >
                <span className="material-symbols-outlined text-3xl mb-3 transition-transform group-hover:rotate-180 duration-500">refresh</span>
                <span className="font-bold font-headline text-sm">Try Again</span>
              </button>

              <button 
                className="flex flex-col items-center justify-center p-6 rounded-2xl group hover:-translate-y-1 transition-transform cursor-pointer bg-surface-container-high text-on-primary-fixed-variant hover:bg-surface-container-highest shadow-sm border border-outline-variant/10"
              >
                <span className="material-symbols-outlined text-3xl mb-3">account_balance</span>
                <span className="font-bold font-headline text-sm text-center">Pay on Campus</span>
              </button>

              <button 
                className="flex flex-col items-center justify-center p-6 rounded-2xl group hover:-translate-y-1 transition-transform cursor-pointer bg-surface-container-high text-on-surface hover:bg-surface-container-highest shadow-sm border border-outline-variant/10"
              >
                <span className="material-symbols-outlined text-3xl mb-3">contact_support</span>
                <span className="font-bold font-headline text-sm text-center">Contact Support</span>
              </button>
            </div>

            {/* Return Link */}
            <button 
              onClick={() => navigate('/student-dashboard')}
              className="text-primary font-bold text-sm flex items-center justify-center gap-2 hover:underline group"
            >
              <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
              Return to Student Dashboard
            </button>
          </div>
        </div>
      </main>

      {/* Decorative Blob */}
      <div className="hidden lg:block fixed bottom-20 -right-20 pointer-events-none opacity-20 z-0">
        <div className="w-96 h-96 main-gradient rounded-full blur-3xl"></div>
      </div>

      {/* Footer */}
      <footer className="z-20 w-full p-8 text-center border-t border-outline-variant/10 bg-surface">
        <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">
          © 2024 CSBM Campus Academic Portal - Secure Institutional Billing
        </p>
      </footer>
    </div>
  );
};

export default PaymentFailed;
