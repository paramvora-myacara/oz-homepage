'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calculator, AlertTriangle, ChevronDown, UserCheck, Clock } from 'lucide-react';
import { 
  GAIN_AMOUNT_OPTIONS, 
  calculateTaxSavings,
  formatCurrency,
  getGainAmountLabel,
  TAX_CALC_CONFIG
} from '../../../lib/taxCalculator';
import { trackUserEvent } from '../../../lib/analytics/trackUserEvent';
import { useAuth } from '../../../lib/auth/AuthProvider';

const TIMING_OPTIONS = [
  { 
    id: 'before-180', 
    label: 'More than 180 days ago', 
    value: 'before-180',
    display: 'More than 180 days ago',
    eligible: false
  },
  { 
    id: 'within-180', 
    label: 'Within the last 180 days', 
    value: 'within-180',
    display: 'Within the last 180 days',
    eligible: true
  },
  { 
    id: 'future', 
    label: 'In the future', 
    value: 'future',
    display: 'Expected in the future',
    eligible: true
  }
];

const STEPS = [
  {
    id: 'capital-gain-status',
    title: 'Capital Gain Status',
    subtitle: 'Have you had a capital gain that you want to defer?',
    icon: UserCheck
  },
  {
    id: 'gain-timing',
    title: 'Timing',
    subtitle: 'When did you have your capital gain?',
    icon: Clock
  },
  {
    id: 'gain-amount',
    title: 'Capital Gain Amount',
    subtitle: 'Roughly how much capital gain are you re-investing?',
    icon: Calculator
  }
];

const CAPITAL_GAIN_STATUS_OPTIONS = [
  {
    id: 'yes',
    label: 'Yes',
    value: true,
    display: 'Yes, I have capital gains to defer'
  },
  {
    id: 'no',
    label: 'No',
    value: false,
    display: 'No, I don\'t have capital gains'
  }
];

// Minimum gain amount for OZ eligibility
const MIN_ELIGIBLE_GAIN_AMOUNT = 375000; 

// Hardcoded tax rate: 20% federal + 3.8% NIIT = 23.8%
const HARDCODED_TAX_RATE = 0.238;

export default function EmbeddedTaxCalculator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    capitalGainStatus: null,
    gainTiming: null,
    gainAmount: null
  });
  const [showResults, setShowResults] = useState(false);
  const [calculationResults, setCalculationResults] = useState(null);
  const [isEligible, setIsEligible] = useState(true);
  const { user } = useAuth();

  const handleStepComplete = (stepId, value) => {
    const newFormData = { ...formData, [stepId]: value };
    setFormData(newFormData);

    // If user selects "No" for capital gain status, immediately show not eligible
    if (stepId === 'capitalGainStatus' && value === false) {
      setIsEligible(false);
      setShowResults(true);
      if (user) trackUserEvent('tax_calculator_used', { eligible: false });
      return;
    }

    // Check timing eligibility
    if (stepId === 'gainTiming') {
      const timingOption = TIMING_OPTIONS.find(opt => opt.value === value);
      if (timingOption && !timingOption.eligible) {
        setIsEligible(false);
        setShowResults(true);
        if (user) trackUserEvent('tax_calculator_used', { eligible: false });
        return;
      }
    }

    // Check eligibility based on gain amount
    if (stepId === 'gainAmount') {
      if (value < MIN_ELIGIBLE_GAIN_AMOUNT) {
        setIsEligible(false);
        setShowResults(true);
        if (user) trackUserEvent('tax_calculator_used', { eligible: false });
        return;
      }
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate results
      const results = calculateTaxSavings(
        newFormData.gainAmount,
        HARDCODED_TAX_RATE,
        true 
      );
      setCalculationResults(results);
      setIsEligible(true);
      setShowResults(true);

      if (user) {
        trackUserEvent('tax_calculator_used', {
          eligible: true,
          totalSavings: results.totalSavings
        });
      }
    }
  };

  const handleBack = () => {
    if (showResults) {
      handleReset();
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setFormData({
      capitalGainStatus: null,
      gainTiming: null,
      gainAmount: null
    });
    setShowResults(false);
    setCalculationResults(null);
    setIsEligible(true);
  };

  const currentStepData = STEPS[currentStep];

  if (showResults) {
    if (!isEligible) {
      return (
        <section className="py-12 md:py-20 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
           <div className="max-w-4xl mx-auto px-6">
              <IneligibleScreen onBack={handleReset} onReset={handleReset} formData={formData} />
           </div>
        </section>
      );
    }
    if (calculationResults) {
      return (
        <section className="py-12 md:py-20 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-4xl mx-auto px-6">
            <ResultsScreen results={calculationResults} onReset={handleReset} />
          </div>
        </section>
      );
    }
  }

  return (
    <section className="py-12 md:py-20 bg-white dark:bg-black relative overflow-hidden" id="tax-calculator">
      
      <div className="max-w-2xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h2 className="text-3xl md:text-5xl font-bold text-black dark:text-white mb-4">
            Calculate Your Tax Savings
          </h2>
          <p className="text-lg text-black/60 dark:text-white/60 font-light">
            See exactly how much federal capital gains tax you can defer and reduce.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-black/60 dark:text-white/60">
              Step {currentStep + 1} of {STEPS.length}
            </span>
          </div>
          <div className="w-full bg-black/5 dark:bg-white/5 rounded-full h-1.5">
            <div 
              className="bg-primary h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-card rounded-3xl p-6 md:p-10 bg-white/80 dark:bg-black/40 border border-black/5 dark:border-white/10 shadow-xl"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 text-primary rounded-2xl mb-4">
                <currentStepData.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-semibold text-black dark:text-white mb-2">
                {currentStepData.title}
              </h3>
              <p className="text-base text-black/60 dark:text-white/60">
                {currentStepData.subtitle}
              </p>
            </div>

            {/* Step Options Renderers */}
            <div className="space-y-3">
            {currentStep === 0 && (
                <>
                {CAPITAL_GAIN_STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleStepComplete('capitalGainStatus', option.value)}
                    className="w-full p-5 text-left bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 rounded-xl border border-black/5 dark:border-white/5 transition-all duration-200 group flex items-center justify-between"
                  >
                    <span className="text-lg font-medium text-black dark:text-white">{option.display}</span>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                  </button>
                ))}
                </>
            )}

            {currentStep === 1 && (
                <>
                {TIMING_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleStepComplete('gainTiming', option.value)}
                    className="w-full p-5 text-left bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 rounded-xl border border-black/5 dark:border-white/5 transition-all duration-200 group flex items-center justify-between"
                  >
                    <span className="text-lg font-medium text-black dark:text-white">{option.display}</span>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                  </button>
                ))}
                </>
            )}

            {currentStep === 2 && (
                <>
                {GAIN_AMOUNT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleStepComplete('gainAmount', option.value)}
                    className="w-full p-5 text-left bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 rounded-xl border border-black/5 dark:border-white/5 transition-all duration-200 group flex items-center justify-between"
                  >
                     <div>
                        <div className="text-lg font-medium text-black dark:text-white">{option.label}</div>
                        <div className="text-sm text-gray-500">{option.display}</div>
                     </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                  </button>
                ))}
                </>
            )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {currentStep > 0 && (
            <button
                onClick={handleBack}
                className="flex items-center gap-2 mt-6 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors mx-auto text-sm"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to previous step
            </button>
        )}
      </div>
    </section>
  );
}

function IneligibleScreen({ onBack, onReset, formData }) {
  const getReason = () => {
    if (!formData.capitalGainStatus) return "You need capital gains to defer.";
    if (formData.gainTiming === 'before-180') return "The 180-day reinvestment deadline has passed.";
    if (formData.gainAmount && formData.gainAmount < MIN_ELIGIBLE_GAIN_AMOUNT) return "Investment minimums may apply.";
    return "You may not currently qualify.";
  };

  return (
    <div className="text-center animate-fadeIn max-w-2xl mx-auto">
      <div className="glass-card rounded-3xl p-8 md:p-12 bg-white/80 dark:bg-black/40 border border-black/5 dark:border-white/10 shadow-xl">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full mb-6">
            <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
            Not Currently Eligible
        </h2>
        <p className="text-lg text-black/60 dark:text-white/60 mb-8">
            {getReason()}
        </p>
        <button
            onClick={onReset}
            className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
            Start Over
        </button>
      </div>
    </div>
  );
}

function ResultsScreen({ results, onReset }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="text-center animate-fadeIn max-w-3xl mx-auto">
      <div className="glass-card rounded-3xl p-8 md:p-12 bg-white/80 dark:bg-black/40 border border-black/5 dark:border-white/10 shadow-xl relative overflow-hidden">
        {/* Confetti or glow effect could go here */}
        
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full mb-6">
            <Calculator className="w-8 h-8" />
        </div>

        <h2 className="text-3xl font-bold text-black dark:text-white mb-2">
            Estimated Tax Savings
        </h2>
        <p className="text-black/60 dark:text-white/60 mb-8">
            Federal capital gains tax you could defer/avoid
        </p>

        <div className="mb-10">
            <span className="text-5xl md:text-6xl font-bold text-green-600 dark:text-green-500 tracking-tight">
                {formatCurrency(results.totalSavings)}
            </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5">
                <div className="text-sm text-black/60 dark:text-white/60 mb-1">Tax Without OZ</div>
                <div className="text-xl font-semibold text-red-500">{formatCurrency(results.taxWithoutOZ)}</div>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5">
                <div className="text-sm text-black/60 dark:text-white/60 mb-1">Tax With OZ</div>
                <div className="text-xl font-semibold text-green-500">{formatCurrency(results.taxWithOZ)}</div>
            </div>
        </div>

        <button
            onClick={onReset}
            className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
            Calculate Again
        </button>
        
        <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 text-xs text-black/40 dark:text-white/40">
            *Estimates based on current federal rates. Consult a tax professional.
        </div>
      </div>
    </div>
  );
}
