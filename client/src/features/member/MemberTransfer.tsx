import React, { useState } from 'react';
import { apiClient } from '../../services/api';
import { Send, KeyRound, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

const MemberTransfer: React.FC = () => {
  // --- UI STATE ---
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // --- FORM STATE ---
  const [receiverId, setReceiverId] = useState(''); // 🚨 UPDATED: Now uses ID
  const [pvAmount, setPvAmount] = useState('');
  const [authCode, setAuthCode] = useState('');

  const colors = { navy: '#1d3557', green: '#03ac13', blue: '#2563eb' };

  // --- HANDLERS ---
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setError(null); setSuccess(null);

    // Basic Validation
    if (receiverId.length !== 7) {
      setError("The receiver's ID must be exactly 7 digits.");
      setIsLoading(false);
      return;
    }

    try {
      // Calls the secure Member-only endpoint
      await apiClient('/distributors/transfer-pv/request-otp', {
        method: 'POST',
        body: JSON.stringify({
          receiver_company_id: receiverId, 
          pv_amount: parseFloat(pvAmount)
        })
      });
      
      setSuccess("Authorization code sent to your email!");
      setStep(2); // Move to OTP step
    } catch (err: any) {
      setError(err.message || "Failed to request OTP. Check your PV balance and ensure the receiver ID is correct.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setError(null); setSuccess(null);

    try {
      const response = await apiClient('/distributors/transfer-pv/execute', {
        method: 'POST',
        body: JSON.stringify({
          receiver_company_id: receiverId, // 🚨 UPDATED payload key
          pv_amount: parseFloat(pvAmount),
          auth_code: authCode
        })
      });
      
      setSuccess(`Transfer complete! ${pvAmount} PV successfully sent to ID: ${receiverId}. New Balance: ${response.new_balance} PV`);
      
      // Reset form
      setReceiverId('');
      setPvAmount('');
      setAuthCode('');
      setStep(1);
    } catch (err: any) {
      setError(err.message || "Invalid or expired authorization code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-black uppercase tracking-tight" style={{ color: colors.navy }}>
          Send PV to Team
        </h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
          Secure Peer-to-Peer Transfer
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
        
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`h-2 rounded-full transition-all duration-300 ${step >= 1 ? 'w-12 bg-blue-600' : 'w-4 bg-slate-200'}`} />
          <div className={`h-2 rounded-full transition-all duration-300 ${step >= 2 ? 'w-12 bg-blue-600' : 'w-4 bg-slate-200'}`} />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3 text-red-700">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100 flex items-start gap-3 text-green-700">
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">{success}</p>
          </div>
        )}

        {/* STEP 1: INITIATE TRANSFER */}
        {step === 1 && (
          <form onSubmit={handleRequestOTP} className="space-y-5 animate-in slide-in-from-left-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Receiver's Official ID</label>
              <input required type="text" maxLength={7} value={receiverId} onChange={(e) => setReceiverId(e.target.value)} placeholder="e.g. 0012345" className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:border-blue-500 transition-all font-bold text-slate-800 tracking-widest" />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Amount to Send (PV)</label>
              <input required type="number" min="1" step="0.1" value={pvAmount} onChange={(e) => setPvAmount(e.target.value)} placeholder="e.g. 50" className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:border-blue-500 transition-all font-black text-slate-800" />
            </div>

            <button type="submit" disabled={isLoading} className="w-full mt-6 flex items-center justify-center gap-2 text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg hover:opacity-90 disabled:opacity-50 transition-all bg-blue-600">
              {isLoading ? 'Verifying...' : <><Send size={14} /> Continue & Request OTP</>}
            </button>
          </form>
        )}

        {/* STEP 2: VERIFY OTP */}
        {step === 2 && (
          <form onSubmit={handleExecuteTransfer} className="space-y-5 animate-in slide-in-from-right-4">
            <button type="button" onClick={() => setStep(1)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 hover:text-slate-700 transition-colors mb-4">
              <ArrowLeft size={12} /> Back
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 mb-3">
                <KeyRound size={20} />
              </div>
              <p className="text-xs font-bold text-slate-600">Enter the 6-digit code sent to your email to authorize sending <span className="text-blue-600 font-black">{pvAmount} PV</span> to ID: <span className="text-slate-900 font-black">{receiverId}</span>.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 text-center block">Authorization Code</label>
              <input required type="text" maxLength={6} value={authCode} onChange={(e) => setAuthCode(e.target.value)} placeholder="000000" className="w-full px-4 py-4 text-2xl text-center tracking-[0.5em] bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:border-blue-500 transition-all font-black text-slate-800" />
            </div>

            <button type="submit" disabled={isLoading || authCode.length !== 6} className="w-full mt-6 flex items-center justify-center gap-2 text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg hover:opacity-90 disabled:opacity-50 transition-all bg-green-600">
              {isLoading ? 'Executing Transfer...' : 'Confirm & Transfer PV'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default MemberTransfer;