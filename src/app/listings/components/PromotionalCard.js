"use client";
import { useState } from "react";
import { Plus, Mail, User, MessageSquare, X } from "lucide-react";
import { useAuth } from "../../../lib/auth/AuthProvider";
import { trackUserEvent } from "../../../lib/analytics/trackUserEvent";

export default function PromotionalCard() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const { user } = useAuth();

  const handleOpenForm = async () => {
    setShowForm(true);
    
    // Prefill user data if available
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || "",
        email: user.email || ""
      }));
    }

    // Track analytics event
    await trackUserEvent("listing_inquiry_started", {
      source: "promotional_card",
      timestamp: new Date().toISOString()
    });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSubmitStatus(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit to existing "Schedule a Call" endpoint
      const response = await fetch('/api/calendar/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: `Listing Inquiry: ${formData.message}`,
          source: 'oz_listing_promotional_card'
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        
        // Track successful submission
        await trackUserEvent("listing_inquiry_submitted", {
          source: "promotional_card",
          success: true,
          timestamp: new Date().toISOString()
        });

        // Reset form after delay
        setTimeout(() => {
          setFormData({ name: "", email: "", message: "" });
          handleCloseForm();
        }, 2000);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      
      // Track failed submission
      await trackUserEvent("listing_inquiry_submitted", {
        source: "promotional_card",
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Promotional Card */}
      <div 
        className="group relative flex flex-col h-full bg-white dark:bg-gradient-to-br dark:from-gray-900/95 dark:via-gray-900/90 dark:to-black/95 dark:backdrop-blur-xl rounded-2xl overflow-hidden border-2 border-dashed border-primary-300 dark:border-primary-500/70 dark:ring-1 dark:ring-white/10 cursor-pointer transition-all duration-500 hover:shadow-2xl dark:shadow-[0_8px_32px_rgba(255,255,255,0.04)] dark:hover:shadow-[0_16px_48px_rgba(255,255,255,0.08)] card-hover focus-ring"
        onClick={handleOpenForm}
        tabIndex={0}
        role="button"
        aria-label="Add your OZ listing here"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpenForm();
          }
        }}
      >
        {/* Placeholder to match image height of other cards */}
        <div className="relative aspect-video w-full bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:via-primary-800/20 dark:to-primary-900/40 flex items-center justify-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 dark:bg-primary-800/60 dark:backdrop-blur-sm dark:ring-1 dark:ring-primary-500/50 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-lg dark:shadow-primary-500/30">
            <Plus className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>
        </div>

        {/* Content */}
        <div className="pt-4 pb-6 px-6 text-center flex flex-col items-center space-y-3 dark:bg-gradient-to-b dark:from-transparent dark:to-black/20">
          <h3 className="text-2xl font-bold text-primary-900 dark:text-primary-100 dark:drop-shadow-sm">
            Your OZ Listing Here
          </h3>
          <p className="text-primary-700 dark:text-primary-300 max-w-sm mx-auto leading-relaxed">
            Showcase your Opportunity Zone investment to qualified investors. 
            Get started with our listing platform today.
          </p>
          <span className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg dark:shadow-primary-500/30">
            <Mail className="w-5 h-5 mr-2" />
            Get Started
          </span>
        </div>

        {/* Hover Effect Border - Same as listing cards */}
        <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-primary-500/20 dark:group-hover:ring-primary-400/30 transition-all duration-300 pointer-events-none" />
      </div>

      {/* Contact Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gradient-to-b dark:from-gray-900/95 dark:to-black/95 dark:backdrop-blur-xl rounded-2xl shadow-2xl dark:shadow-[0_16px_48px_rgba(255,255,255,0.1)] max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-600/50 dark:ring-1 dark:ring-white/10">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-600/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  List Your OZ Investment
                </h2>
                <button
                  onClick={handleCloseForm}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6">
              {submitStatus === 'success' ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 dark:ring-1 dark:ring-green-500/50 rounded-full mx-auto flex items-center justify-center shadow-lg dark:shadow-green-500/20">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Thank You!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We've received your inquiry and will contact you soon about listing your Opportunity Zone investment.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-500/50 rounded-lg bg-white dark:bg-gray-800/70 dark:backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-colors dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)]"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-500/50 rounded-lg bg-white dark:bg-gray-800/70 dark:backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-colors dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)]"
                      placeholder="Enter your email address"
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-1" />
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-500/50 rounded-lg bg-white dark:bg-gray-800/70 dark:backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-colors resize-none dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)]"
                      placeholder="Tell us about your Opportunity Zone investment opportunity..."
                    />
                  </div>

                  {/* Error State */}
                  {submitStatus === 'error' && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400">
                        There was an error submitting your request. Please try again.
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 shadow-lg dark:shadow-primary-500/30"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5" />
                        <span>Send Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 