import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      const fetchPayment = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`/api/payments/check/${orderId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            setPayment(data);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchPayment();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const downloadInvoice = () => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('CSBM Campus', 20, 20);
      doc.setFontSize(10);
      doc.text('Payment Invoice', 20, 30);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 20);
      doc.text(`Invoice: ${payment?.orderId || orderId}`, 150, 30);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('Item:', 20, 60);
      doc.setFont('helvetica', 'bold');
      doc.text(payment?.itemName || 'Course', 60, 60);
      
      doc.setFont('helvetica', 'normal');
      doc.text('Amount:', 20, 75);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text(`LKR ${payment?.amount?.toLocaleString() || '0'}`, 60, 75);
      
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.text('Status:', 20, 90);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(16, 185, 129);
      doc.text('COMPLETED', 60, 90);
      
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 270, 210, 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('CSBM Campus | Colombo 03 | info@csbm.edu.lk', 20, 283);
      
      doc.save(`CSBM-Invoice-${payment?.orderId || orderId}.pdf`);
    });
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-surface font-body confetti-bg">
      <style>{`
        .confetti-bg {
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232563eb' fill-opacity='0.05'%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3Crect x='50' y='20' width='4' height='4' rx='1'/%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
      
      <div className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden z-10 border border-outline-variant/20">
        
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 py-12 flex flex-col items-center justify-center text-white relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="20" cy="80" r="15" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="80" cy="20" r="25" fill="none" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>

          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 ring-8 ring-white/10 relative z-10">
            <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          
          <h1 className="font-headline text-3xl font-extrabold tracking-tight mb-2 relative z-10 text-center px-4">
            Payment Successful
          </h1>
          <p className="text-white/90 text-lg relative z-10 font-medium px-4 text-center">
            Your enrollment is now confirmed.
          </p>
        </div>

        {/* Receipt Body */}
        <div className="p-8 md:p-12">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h2 className="font-headline text-on-surface text-xl font-bold">Payment Receipt</h2>
              <p className="text-sm text-outline mt-1 font-medium">A copy has been sent to your email.</p>
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold tracking-wider uppercase">
              COMPLETED
            </div>
          </div>

          {/* Transaction Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 pb-8">
            <div>
              <p className="text-xs font-label text-outline uppercase tracking-widest mb-1 font-semibold">Order ID</p>
              <p className="font-headline font-bold text-on-surface">#{payment?.orderId || orderId}</p>
            </div>
            <div>
              <p className="text-xs font-label text-outline uppercase tracking-widest mb-1 font-semibold">Payment ID</p>
              <p className="font-headline font-bold text-on-surface">{payment?.payherePaymentId || 'N/A'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-label text-outline uppercase tracking-widest mb-1 font-semibold">Course / Item</p>
              <p className="font-headline font-bold text-on-surface">{payment?.itemName || 'Loading...'}</p>
            </div>
            <div>
              <p className="text-xs font-label text-outline uppercase tracking-widest mb-1 font-semibold">Amount Paid</p>
              <p className="font-headline font-bold text-primary text-2xl">LKR {payment?.amount?.toLocaleString() || '0'}</p>
            </div>
            <div>
              <p className="text-xs font-label text-outline uppercase tracking-widest mb-1 font-semibold">Date & Method</p>
              <div className="flex flex-col gap-1">
                <p className="font-headline font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-outline">credit_card</span>
                  {payment?.paymentMethod || 'Online'}
                </p>
                <p className="text-sm font-medium text-on-surface-variant">
                  {new Date(payment?.paidAt || Date.now()).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 pt-8 border-t border-surface-container-high">
            <button 
              onClick={downloadInvoice}
              className="w-full py-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl font-bold shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2 font-headline"
            >
              <span className="material-symbols-outlined">download</span>
              Download Invoice (PDF)
            </button>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate('/student-dashboard')}
                className="bg-surface-container-high text-on-surface rounded-xl py-4 flex items-center justify-center gap-2 font-bold font-headline hover:bg-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">dashboard</span>
                Dashboard
              </button>
              <button 
                onClick={() => {
                  navigate('/student-dashboard');
                }}
                className="bg-surface-container-high text-on-surface rounded-xl py-4 flex items-center justify-center gap-2 font-bold font-headline hover:bg-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">school</span>
                View Courses
              </button>
            </div>
          </div>

        </div>

        {/* Footer Note */}
        <div className="bg-surface-container-low p-6 text-center border-t border-surface-container-high">
          <p className="text-sm text-on-surface-variant italic font-medium leading-relaxed">
            Thank you for choosing CSBM Campus. We're excited to have you in the classroom!
          </p>
        </div>
      </div>

      {/* Payment Card Logos */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
        <span className="font-headline font-black text-on-surface text-xl tracking-tighter">VISA</span>
        <span className="font-headline font-black text-on-surface text-xl tracking-tighter">mastercard</span>
        <span className="font-headline font-black text-on-surface text-xl tracking-tighter text-blue-600">PayHere</span>
      </div>

      {/* Decorative 3D Element */}
      <div className="hidden lg:block absolute bottom-10 right-10 pointer-events-none opacity-20">
        <div className="bg-gradient-to-br from-primary to-cyan-400 rounded-3xl rotate-12 w-48 h-48 flex items-center justify-center shadow-2xl">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6">
            <span className="material-symbols-outlined text-white text-7xl" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PaymentSuccess;
