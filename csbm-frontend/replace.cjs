const fs = require('fs');

const replacement = `const PaymentHistoryContent = () => {
  const totalPaid = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + (p.amount || 0), 0)
  
  const pendingCount = payments
    .filter(p => p.status === 'pending').length

  return (
    <div className="px-12 py-8 bg-surface min-h-screen font-body">
      
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black font-headline text-on-surface tracking-tight">
          Payment History
        </h1>
        <p className="text-on-surface-variant mt-2 font-medium">
          Track all your transactions and download invoices.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        
        {/* Total Paid */}
        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-green-600 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                payments
              </span>
            </div>
            <span className="text-xs font-bold text-green-600 px-2 py-1 bg-green-50 rounded-lg">
              Total
            </span>
          </div>
          <p className="text-sm font-bold text-on-surface-variant mb-1">
            Total Paid
          </p>
          <p className="text-3xl font-black font-headline text-on-surface">
            LKR {totalPaid.toLocaleString()}
          </p>
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-b-2xl"/>
        </div>

        {/* Total Transactions */}
        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                receipt_long
              </span>
            </div>
            <span className="text-xs font-bold text-on-surface-variant px-2 py-1 bg-slate-50 rounded-lg">
              All Time
            </span>
          </div>
          <p className="text-sm font-bold text-on-surface-variant mb-1">
            Transactions
          </p>
          <p className="text-3xl font-black font-headline text-on-surface">
            {payments.length}
          </p>
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-b-2xl"/>
        </div>

        {/* Pending */}
        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-orange-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                pending_actions
              </span>
            </div>
            <span className="text-xs font-bold text-orange-500 px-2 py-1 bg-orange-50 rounded-lg">
              {pendingCount} Pending
            </span>
          </div>
          <p className="text-sm font-bold text-on-surface-variant mb-1">
            Pending Payments
          </p>
          <p className="text-3xl font-black font-headline text-on-surface">
            {pendingCount}
          </p>
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-orange-500 rounded-b-2xl"/>
        </div>
      </div>

      {/* Payments List */}
      {payments.length > 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
          
          {/* Table Header */}
          <div className="grid grid-cols-5 px-8 py-5 bg-surface-container-low border-b border-outline-variant/20">
            {['Order ID', 'Description', 'Type', 'Amount', 'Status'].map(h => (
              <p key={h} className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                {h}
              </p>
            ))}
          </div>

          {/* Table Rows */}
          {payments.map((payment, i) => (
            <div key={i} className="grid grid-cols-5 px-8 py-6 border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors items-center group">
              
              {/* Order ID */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-surface-container rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-on-surface-variant text-lg">
                    receipt_long
                  </span>
                </div>
                <div>
                  <p className="font-mono text-primary text-xs font-bold">
                    {payment.orderId?.slice(0, 12)}
                  </p>
                  <p className="text-on-surface-variant text-[10px] mt-0.5">
                    {new Date(payment.createdAt || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-on-surface font-semibold text-sm truncate pr-4">
                {payment.itemName}
              </p>

              {/* Type Badge */}
              <span className={\`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold w-fit \${payment.paymentType === 'course' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}\`}>
                {payment.paymentType === 'course' ? '🎓 Course' : '🎪 Workshop'}
              </span>

              {/* Amount */}
              <div>
                <p className="font-black font-headline text-on-surface">
                  LKR {payment.amount?.toLocaleString()}
                </p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">
                  {payment.currency || 'LKR'}
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className={\`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold \${payment.status === 'completed' ? 'bg-green-50 text-green-700' : payment.status === 'pending' ? 'bg-orange-50 text-orange-600' : payment.status === 'refunded' ? 'bg-blue-50 text-blue-600' : 'bg-error-container text-error'}\`}>
                  <span className={\`w-1.5 h-1.5 rounded-full \${payment.status === 'completed' ? 'bg-green-500' : payment.status === 'pending' ? 'bg-orange-400' : payment.status === 'refunded' ? 'bg-blue-400' : 'bg-error'}\`}/>
                  {payment.status?.charAt(0).toUpperCase() + payment.status?.slice(1)}
                </span>
              </div>
            </div>
          ))}

          {/* Footer */}
          <div className="px-8 py-5 bg-surface-container-low flex justify-between items-center">
            <p className="text-xs text-on-surface-variant font-medium">
              Showing {payments.length} transaction{payments.length !== 1 ? 's' : ''}
            </p>
            <button className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
              <span className="material-symbols-outlined text-sm">download</span> Export All
            </button>
          </div>
        </div>

      ) : (
        /* Empty State */
        <div className="bg-surface-container-lowest rounded-2xl p-20 text-center shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: \`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23004ac6' fill-opacity='1'%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/svg%3E")\` }} />
          <div className="relative z-10">
            <div className="w-24 h-24 bg-surface-container rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <span className="material-symbols-outlined text-on-surface-variant text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>credit_card_off</span>
            </div>
            <h3 className="text-2xl font-black font-headline text-on-surface mb-3">No Transactions Yet</h3>
            <p className="text-on-surface-variant max-w-sm mx-auto leading-relaxed">
              Your payment history will appear here once you complete your first course enrollment payment.
            </p>
            <button
              onClick={() => setActivePanel('courses')}
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold font-headline rounded-xl shadow-lg hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined">school</span> Browse Courses
            </button>
          </div>
        </div>
      )}
    </div>
  )
}`;

let code = fs.readFileSync('src/StudentDashboard.jsx', 'utf8');
const start = code.indexOf('const PaymentHistoryContent =');
const searchString = '\n  const SettingsContent =';
let end = code.indexOf(searchString);

if (start !== -1 && end !== -1) {
  code = code.substring(0, start) + replacement + code.substring(end);
  fs.writeFileSync('src/StudentDashboard.jsx', code);
  console.log('Successfully replaced PaymentHistoryContent');
} else {
  console.error('Could not find start or end markers');
}
