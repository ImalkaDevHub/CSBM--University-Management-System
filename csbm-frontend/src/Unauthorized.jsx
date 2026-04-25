import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-center">
            <div className="max-w-md bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
                <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-600">
                    <ShieldAlert size={40} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-4">Access Denied</h1>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    You do not have the required permissions to view this page. If you believe this is an error, please contact the IT department.
                </p>
                <Link 
                    to="/" 
                    className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;
