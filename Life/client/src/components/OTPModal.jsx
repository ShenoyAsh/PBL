import React, { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { Loader2 } from 'lucide-react';

export default function OTPModal({ isOpen, onClose, donorId, onSuccess }) {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('OTP must be 6 digits');
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await api.post(`/verify-donor/${donorId}`, { otp });
      toast.success(res.data.message);
      onSuccess(); // Call the success callback
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Verify Your Account
                </DialogTitle>
                <p className="mt-2 text-sm text-gray-500">
                  We've sent a 6-digit OTP to your email. Please enter it below.
                </p>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="otp" className="sr-only">OTP</label>
                    <input
                      type="text"
                      name="otp"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      className="block w-full rounded-md border-gray-300 text-center text-2xl tracking-[0.5em] shadow-sm focus:border-primary-green focus:ring-primary-green"
                      placeholder="_ _ _ _ _ _"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full justify-center rounded-md border border-transparent bg-primary-green py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-dark-green focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Verify'}
                  </button>
                  <button
                    type="button"
                    className="w-full text-center text-sm text-gray-500 hover:underline"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}