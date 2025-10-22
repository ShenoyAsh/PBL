import React, { useState, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

export default function BloodBankModal({ isOpen, onClose }) {
  const [banks, setBanks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // URL to the static file on the server
  const csvUrl = (process.env.REACT_APP_API_URL || 'http://localhost:5001') + '/static/blood_banks.csv';

  useEffect(() => {
    if (isOpen) {
      const fetchBanks = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(csvUrl);
          if (!res.ok) throw new Error('Network response was not ok');
          
          const text = await res.text();
          
          // Simple CSV parser
          const rows = text.split('\n').filter(Boolean);
          const headers = rows[0].split(',');
          const data = rows.slice(1).map(row => {
            const values = row.split(',');
            return headers.reduce((obj, header, i) => {
              obj[header.trim()] = values[i].trim();
              return obj;
            }, {});
          });
          
          setBanks(data);
          
        } catch (err) {
          toast.error('Failed to load blood bank directory.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchBanks();
    }
  }, [isOpen, csvUrl]);


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
              <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Blood Bank Directory
                </DialogTitle>
                <a 
                    href={csvUrl} 
                    download="blood_banks.csv"
                    className="absolute top-4 right-4 rounded-md bg-light-green px-3 py-1 text-sm font-medium text-primary-green hover:bg-green-200"
                >
                    Download CSV
                </a>
                
                <div className="mt-4 max-h-[60vh] overflow-auto">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {banks.map((bank, i) => (
                                <tr key={i}>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{bank.Name}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{bank.City}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{bank.Phone}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{bank.Address}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  )}
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}