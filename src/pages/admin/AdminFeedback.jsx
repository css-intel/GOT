import { useState, useEffect } from 'react';
import { MessageSquare, Trash2, RefreshCw, Clock, Hash, AlertCircle } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFeedback = async () => {
    setLoading(true);
    try {
      const data = await api.getFeedback();
      setFeedback(data);
    } catch (err) {
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFeedback(); }, []);

  const handleDelete = async (id) => {
    try {
      await api.deleteFeedback(id);
      setFeedback(prev => prev.filter(f => f.id !== id));
      toast.success('Feedback removed');
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="animate-spin rounded-full h-8 w-8 border-2 border-primary-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare size={22} className="text-primary-400" />
            Client Feedback
          </h2>
          <p className="text-sm text-dark-500 mt-1">
            {feedback.length} submission{feedback.length !== 1 ? 's' : ''} from client demo
          </p>
        </div>
        <button
          onClick={loadFeedback}
          className="flex items-center gap-2 bg-dark-800 hover:bg-dark-700 border border-dark-700 text-dark-400 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card !p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center">
            <MessageSquare size={18} className="text-primary-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">{feedback.length}</div>
            <div className="text-xs text-dark-500">Total Feedback</div>
          </div>
        </div>
        <div className="card !p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
            <Hash size={18} className="text-amber-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">{Math.max(0, 3 - feedback.length)}</div>
            <div className="text-xs text-dark-500">Free Edits Left</div>
          </div>
        </div>
        <div className="card !p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
            <Clock size={18} className="text-emerald-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">
              {feedback.length > 0
                ? new Date(feedback[feedback.length - 1].timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })
                : '—'
              }
            </div>
            <div className="text-xs text-dark-500">Last Submitted</div>
          </div>
        </div>
      </div>

      {/* Feedback list */}
      {feedback.length === 0 ? (
        <div className="card !py-16 text-center">
          <div className="w-16 h-16 bg-dark-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} className="text-dark-600" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Feedback Yet</h3>
          <p className="text-sm text-dark-500 max-w-sm mx-auto">
            When clients submit feedback through the floating widget, their submissions will appear here for your review.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedback.map((item, i) => (
            <div
              key={item.id}
              className="card !p-5 hover:border-dark-600 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Edit number badge */}
                  <div className="w-8 h-8 bg-primary-500/15 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary-400">#{item.editNumber}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-dark-200 leading-relaxed whitespace-pre-wrap">{item.text}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-dark-600">
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(item.timestamp).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </span>
                      <span>Edit {item.editNumber} of 3</span>
                    </div>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="opacity-0 group-hover:opacity-100 text-dark-600 hover:text-rose-400 transition-all p-1.5 rounded-lg hover:bg-rose-500/10"
                  title="Delete this feedback"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
