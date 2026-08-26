import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/mockData';
import { Header } from './Header';

interface HelpCenterViewProps {
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
}

export const HelpCenterView: React.FC<HelpCenterViewProps> = ({
  onOpenSearch,
  onOpenNotifications
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [contactSent, setContactSent] = useState(false);
  const [contactMsg, setContactMsg] = useState('');

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMsg.trim()) return;
    setContactSent(true);
    setContactMsg('');
    setTimeout(() => setContactSent(false), 4000);
  };

  return (
    <div id="help-center-view" className="max-w-[1280px] w-full mx-auto pb-16 animate-in fade-in duration-300">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-2">
        <div>
          <span className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider">Support & FAQ</span>
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-[#2D2926] tracking-tight mt-1">
            Help Center
          </h2>
          <p className="text-sm md:text-base text-[#6B665E] mt-1">
            Learn about anonymous evaluations, deadlines, and university quality assurance.
          </p>
        </div>

        <Header onOpenSearch={onOpenSearch} onOpenNotifications={onOpenNotifications} />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: FAQ Accordion */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-headline text-xl font-bold text-[#2D2926] mb-2">
            Frequently Asked Questions
          </h3>

          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-5 ambient-shadow border border-[#E5E1D9] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex justify-between items-center text-left font-semibold text-sm md:text-base text-[#2D2926] cursor-pointer"
                >
                  <span>{item.question}</span>
                  <span className="material-symbols-outlined text-[#5A5A40]">
                    {isOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {isOpen && (
                  <p className="mt-3 text-xs md:text-sm text-[#6B665E] leading-relaxed border-t border-[#E5E1D9] pt-3 animate-in fade-in">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Contact Academic Office Form */}
        <div>
          <div className="bg-white rounded-2xl p-6 ambient-shadow border border-[#E5E1D9]">
            <h3 className="font-headline text-lg font-bold text-[#2D2926] mb-1">
              Contact Evaluation Support
            </h3>
            <p className="text-xs text-[#8A7E6A] mb-4">
              Need help with a submission or have technical questions?
            </p>

            {contactSent ? (
              <div className="p-4 bg-[#E2EBD8] text-[#3D5A20] rounded-xl text-xs font-semibold flex items-center gap-2 border border-[#A3B18A]">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Your query has been submitted to the academic support desk.</span>
              </div>
            ) : (
              <form onSubmit={handleSendQuery} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#6B665E] mb-1">Subject</label>
                  <input
                    type="text"
                    defaultValue="Course Evaluation Clarification"
                    className="w-full p-2.5 bg-[#FAF9F7] border border-[#E5E1D9] rounded-xl text-xs text-[#2D2926] focus:ring-2 focus:ring-[#5A5A40] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B665E] mb-1">Message</label>
                  <textarea
                    rows={4}
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    placeholder="Describe your inquiry or question..."
                    className="w-full p-2.5 bg-[#FAF9F7] border border-[#E5E1D9] rounded-xl text-xs text-[#2D2926] focus:ring-2 focus:ring-[#5A5A40] focus:outline-none resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-semibold rounded-full btn-shadow transition-all cursor-pointer"
                >
                  Send Inquiry
                </button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-[#E5E1D9] text-[11px] text-[#8A7E6A] space-y-1">
              <p>📍 Academic Quality & Accreditation Office</p>
              <p>✉️ evaluations@university.edu</p>
              <p>🕒 Mon–Fri, 9:00 AM – 5:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
