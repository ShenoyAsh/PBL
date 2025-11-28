import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const CreateRequest = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const hospitals = [
    'City General Hospital',
    'Metro Medical Center',
    'Unity Health Hospital',
    'Central Community Hospital',
    'Prestige Medical Center'
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // In a real app, you would make an API call here
      console.log('Submitting request:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // On success
      setSubmitSuccess(true);
      reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting request:', error);
      setSubmitError('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Create Blood Request
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Fill in the details below to request blood units from donors.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4
        ">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        </div>
      </div>

      {submitSuccess && (
        <div className="rounded-md bg-green-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Blood request submitted successfully!
              </p>
            </div>
          </div>
        </div>
      )}

      {submitError && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{submitError}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Patient Information</h3>
              <p className="mt-1 text-sm text-gray-500">Details about the patient in need.</p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">
                    Patient Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="patientName"
                    {...register('patientName', { required: 'Patient name is required' })}
                    className={`mt-1 block w-full border ${errors.patientName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {errors.patientName && (
                    <p className="mt-1 text-sm text-red-600">{errors.patientName.message}</p>
                  )}
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="patientAge" className="block text-sm font-medium text-gray-700">
                    Patient Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="patientAge"
                    min="0"
                    max="120"
                    {...register('patientAge', { 
                      required: 'Age is required',
                      min: { value: 0, message: 'Age must be a positive number' },
                      max: { value: 120, message: 'Please enter a valid age' }
                    })}
                    className={`mt-1 block w-full border ${errors.patientAge ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {errors.patientAge && (
                    <p className="mt-1 text-sm text-red-600">{errors.patientAge.message}</p>
                  )}
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">
                    Blood Type Required <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="bloodType"
                    {...register('bloodType', { required: 'Blood type is required' })}
                    className={`mt-1 block w-full border ${errors.bloodType ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  >
                    <option value="">Select blood type</option>
                    {bloodTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.bloodType && (
                    <p className="mt-1 text-sm text-red-600">{errors.bloodType.message}</p>
                  )}
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="unitsRequired" className="block text-sm font-medium text-gray-700">
                    Units Required <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="unitsRequired"
                    min="1"
                    max="10"
                    {...register('unitsRequired', { 
                      required: 'Number of units is required',
                      min: { value: 1, message: 'At least 1 unit is required' },
                      max: { value: 10, message: 'Maximum 10 units per request' }
                    })}
                    className={`mt-1 block w-full border ${errors.unitsRequired ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {errors.unitsRequired && (
                    <p className="mt-1 text-sm text-red-600">{errors.unitsRequired.message}</p>
                  )}
                </div>

                <div className="col-span-6">
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                    Reason for Request <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="reason"
                      rows={3}
                      {...register('reason', { 
                        required: 'Reason is required',
                        minLength: { value: 10, message: 'Please provide more details (at least 10 characters)' },
                        maxLength: { value: 500, message: 'Reason is too long (max 500 characters)' }
                      })}
                      className={`shadow-sm block w-full border ${errors.reason ? 'border-red-300' : 'border-gray-300'} rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder="Briefly explain the reason for this blood request..."
                    />
                    {errors.reason && (
                      <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Hospital Details</h3>
              <p className="mt-1 text-sm text-gray-500">Where the blood is needed.</p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6">
                  <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700">
                    Hospital Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="hospitalName"
                    {...register('hospitalName', { required: 'Hospital name is required' })}
                    className={`mt-1 block w-full border ${errors.hospitalName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  >
                    <option value="">Select a hospital</option>
                    {hospitals.map((hospital) => (
                      <option key={hospital} value={hospital}>
                        {hospital}
                      </option>
                    ))}
                    <option value="other">Other (please specify)</option>
                  </select>
                  {errors.hospitalName && (
                    <p className="mt-1 text-sm text-red-600">{errors.hospitalName.message}</p>
                  )}
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700">
                    Doctor in Charge <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="doctorName"
                    {...register('doctorName', { required: 'Doctor\'s name is required' })}
                    className={`mt-1 block w-full border ${errors.doctorName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {errors.doctorName && (
                    <p className="mt-1 text-sm text-red-600">{errors.doctorName.message}</p>
                  )}
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="contactNumber"
                    {...register('contactNumber', { 
                      required: 'Contact number is required',
                      pattern: {
                        value: /^[0-9\-+()\s]+$/,
                        message: 'Please enter a valid phone number'
                      },
                      minLength: { value: 8, message: 'Phone number is too short' },
                      maxLength: { value: 20, message: 'Phone number is too long' }
                    })}
                    className={`mt-1 block w-full border ${errors.contactNumber ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="e.g. +1 (555) 123-4567"
                  />
                  {errors.contactNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactNumber.message}</p>
                  )}
                </div>

                <div className="col-span-6">
                  <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">
                    Urgency Level <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <input
                        id="urgent"
                        type="radio"
                        value="urgent"
                        {...register('urgency', { required: 'Please select an urgency level' })}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <label htmlFor="urgent" className="ml-3">
                        <span className="block text-sm font-medium text-red-700">Urgent</span>
                        <span className="block text-xs text-gray-500">Needed within 24 hours</span>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="high"
                        type="radio"
                        value="high"
                        {...register('urgency')}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <label htmlFor="high" className="ml-3">
                        <span className="block text-sm font-medium text-orange-600">High</span>
                        <span className="block text-xs text-gray-500">Needed within 3 days</span>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="normal"
                        type="radio"
                        value="normal"
                        {...register('urgency')}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        defaultChecked
                      />
                      <label htmlFor="normal" className="ml-3">
                        <span className="block text-sm font-medium text-blue-600">Normal</span>
                        <span className="block text-xs text-gray-500">Needed within a week</span>
                      </label>
                    </div>
                  </div>
                  {errors.urgency && (
                    <p className="mt-1 text-sm text-red-600">{errors.urgency.message}</p>
                  )}
                </div>

                <div className="col-span-6">
                  <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700">
                    Additional Notes
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="additionalNotes"
                      rows={3}
                      {...register('additionalNotes', {
                        maxLength: { value: 1000, message: 'Notes are too long (max 1000 characters)' }
                      })}
                      className="shadow-sm block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Any additional information that might help..."
                    />
                    {errors.additionalNotes && (
                      <p className="mt-1 text-sm text-red-600">{errors.additionalNotes.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRequest;
