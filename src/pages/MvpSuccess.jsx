import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function MvpSuccess() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-dark-50 px-4 py-12">
      <div className="card max-w-lg w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
          <CheckCircle size={36} />
        </div>
        <h1 className="text-2xl font-bold text-dark-900 mb-2">Thank You!</h1>
        <p className="text-dark-500 mb-6">
          Thank you. Development will continue. Once your Venmo payment is confirmed, full admin functionality will be unlocked.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          Continue <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
