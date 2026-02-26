import { Link } from 'react-router-dom';
import { XCircle, ArrowRight, RefreshCw } from 'lucide-react';

export default function MvpCancel() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-dark-50 px-4 py-12">
      <div className="card max-w-lg w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-4">
          <XCircle size={36} />
        </div>
        <h1 className="text-2xl font-bold text-dark-900 mb-2">Payment Cancelled</h1>
        <p className="text-dark-500 mb-6">
          The MVP approval payment was not completed. You can try again at any time.
          The application will continue in demo mode until payment is received.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-outline inline-flex items-center justify-center gap-2">
            <ArrowRight size={16} /> Return Home
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} /> Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
