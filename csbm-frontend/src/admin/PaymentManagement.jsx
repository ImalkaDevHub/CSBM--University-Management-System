import { useState, useEffect } from 'react'

const PaymentManagement = () => {
  const [payments, setPayments] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': `Bearer ${token}`
      }
      try {
        const [paymentsRes, statsRes] = 
          await Promise.all([
            fetch('/api/payments/admin/all', 
              { headers }),
            fetch('/api/payments/admin/stats', 
              { headers })
          ])

        if (paymentsRes.ok) {
          const data = await paymentsRes.json()
          setPayments(data)
        }
        if (statsRes.ok) {
          const data = await statsRes.json()
          setStats(data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleRefund = async (paymentId) => {
    if (!window.confirm(
      'Are you sure you want to refund this payment?'
    )) return

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `/api/payments/admin/refund/${paymentId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      if (res.ok) {
        setPayments(prev => prev.map(p =>
          p._id === paymentId
            ? { ...p, status: 'refunded' }
            : p
        ))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = filter === 'all'
    ? payments
    : payments.filter(p => 
        p.status === filter
      )

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">
          Payment Management
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          View and manage all student payments.
        </p>
      </div>

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-4 gap-6 mb-8">
          
          {/* Total Revenue */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="p-3 bg-green-50 rounded-xl text-xl w-fit mb-3">
              💰
            </div>
            <p className="text-slate-500 text-sm">
              Total Revenue
            </p>
            <p className="text-3xl font-black text-slate-900 mt-1">
              LKR {stats.totalRevenue?.toLocaleString()}
            </p>
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 to-emerald-500"/>
          </div>

          {/* Total Transactions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="p-3 bg-blue-50 rounded-xl text-xl w-fit mb-3">
              📋
            </div>
            <p className="text-slate-500 text-sm">
              Transactions
            </p>
            <p className="text-3xl font-black text-slate-900 mt-1">
              {stats.totalTransactions}
            </p>
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 to-blue-600"/>
          </div>

          {/* Course Revenue */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="p-3 bg-purple-50 rounded-xl text-xl w-fit mb-3">
              🎓
            </div>
            <p className="text-slate-500 text-sm">
              Course Revenue
            </p>
            <p className="text-3xl font-black text-slate-900 mt-1">
              LKR {stats.courseRevenue?.toLocaleString()}
            </p>
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-400 to-purple-600"/>
          </div>

          {/* Workshop Revenue */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="p-3 bg-cyan-50 rounded-xl text-xl w-fit mb-3">
              🎪
            </div>
            <p className="text-slate-500 text-sm">
              Workshop Revenue
            </p>
            <p className="text-3xl font-black text-slate-900 mt-1">
              LKR {stats.workshopRevenue?.toLocaleString()}
            </p>
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-400 to-cyan-600"/>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'completed', 'pending', 'failed', 'refunded'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${filter === f ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Payments table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="grid grid-cols-6 px-6 py-4 bg-slate-50 border-b border-slate-200">
          {['Student', 'Order ID', 'Item', 'Type', 'Amount', 'Status/Action'].map(h => (
            <p key={h} className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {h}
            </p>
          ))}
        </div>

        {/* Rows */}
        {loading ? (
          [1,2,3,4,5].map(i => (
            <div key={i} className="h-16 bg-slate-50 animate-pulse border-b border-slate-100 mx-4 my-2 rounded-xl"/>
          ))
        ) : filtered.length > 0 ? (
          filtered.map((payment, i) => (
            <div key={i} className="grid grid-cols-6 px-6 py-5 border-b border-slate-100 hover:bg-slate-50 items-center transition">
              
              {/* Student */}
              <div className="pr-4">
                <p className="font-semibold text-slate-900 text-sm truncate">
                  {payment.studentName || payment.student?.name || 'Student'}
                </p>
                <p className="text-slate-400 text-xs truncate">
                  {payment.studentEmail || payment.student?.email}
                </p>
              </div>

              {/* Order ID */}
              <p className="font-mono text-blue-600 text-xs truncate pr-4">
                {payment.orderId}
              </p>

              {/* Item */}
              <p className="text-slate-700 text-sm font-medium truncate pr-4">
                {payment.itemName}
              </p>

              {/* Type */}
              <span className={`rounded-full px-3 py-1 text-xs font-bold w-fit ${payment.paymentType === 'course' ? 'bg-purple-100 text-purple-700' : 'bg-cyan-100 text-cyan-700'}`}>
                {payment.paymentType?.toUpperCase()}
              </span>

              {/* Amount */}
              <p className="font-black text-slate-900 text-sm truncate pr-4">
                LKR {payment.amount?.toLocaleString()}
              </p>

              {/* Status + Action */}
              <div className="flex flex-col items-start gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${payment.status === 'completed' ? 'bg-green-100 text-green-700' : payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : payment.status === 'refunded' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                  {payment.status?.toUpperCase()}
                </span>
                {payment.status === 'completed' && (
                  <button
                    onClick={() => handleRefund(payment._id)}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold hover:underline"
                  >
                    Refund
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center">
            <div className="text-5xl mb-4">💳</div>
            <p className="font-bold text-slate-900">
              No Payments Found
            </p>
            <p className="text-slate-400 text-sm mt-2">
              No payments match this filter.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentManagement
