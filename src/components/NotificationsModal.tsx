import React from 'react';
import { useFeedback } from '../context/FeedbackContext';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const { notifications, markAllNotificationsRead } = useFeedback();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center p-4 pt-20">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full ambient-shadow animate-in zoom-in-95 duration-200 border border-[#E5E1D9]">
        <div className="flex justify-between items-center pb-3 border-b border-[#E5E1D9]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#5A5A40]">notifications</span>
            <h3 className="font-headline font-bold text-base text-[#2D2926]">Evaluation Alerts</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="text-[11px] text-[#5A5A40] hover:underline font-semibold cursor-pointer"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 text-[#8A7E6A] hover:text-[#2D2926] hover:bg-[#F2EDE4] rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-3 max-h-80 overflow-y-auto">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-xl border transition-all ${
                n.read
                  ? 'bg-[#FAF9F7] border-[#E5E1D9] text-[#6B665E]'
                  : 'bg-[#F2EDE4] border-[#D4C3A3] text-[#2D2926] font-medium'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span
                  className={`material-symbols-outlined text-[18px] mt-0.5 ${
                    n.type === 'urgent'
                      ? 'text-[#8A5A40]'
                      : n.type === 'success'
                      ? 'text-[#3D5A20]'
                      : 'text-[#5A5A40]'
                  }`}
                >
                  {n.type === 'urgent'
                    ? 'priority_high'
                    : n.type === 'success'
                    ? 'check_circle'
                    : 'info'}
                </span>
                <div className="flex-1">
                  <p className="text-xs leading-snug">{n.title}</p>
                  <span className="text-[10px] text-[#8A7E6A] mt-1 block">{n.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2 bg-[#F2EDE4] hover:bg-[#E5E1D9] text-[#2D2926] rounded-full text-xs font-semibold transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};
