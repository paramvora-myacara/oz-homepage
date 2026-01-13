'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calculator, AlertTriangle, FileText, Phone, ChevronDown, UserCheck, Clock, Calendar } from 'lucide-react';
import { 
  GAIN_AMOUNT_OPTIONS, 
  HOLD_PERIOD_OPTIONS,
  calculateTaxSavings,
  formatCurrency,
  formatPercentage,
  getGainAmountLabel,
  TAX_CALC_CONFIG
} from '../../../lib/taxCalculator';
import { trackUserEvent } from '../../../lib/analytics/trackUserEvent';
import ScheduleCallCTA from '../../components/ScheduleCallCTA';
import { useAuth } from '../../../lib/auth/AuthProvider';
import DramaticCountdown from '../../components/DramaticCountdown';


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
    id: 'gain-date',
    title: 'Date of Sale',
    subtitle: 'Enter the date of your capital gain (sale date)',
    icon: Calendar
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

// Minimum gain amount for OZ eligibility (based on previous investor eligibility logic)
const MIN_ELIGIBLE_GAIN_AMOUNT = 375000; // $250K-$500K option value

// Hardcoded tax rate: 20% federal + 3.8% NIIT = 23.8%
const HARDCODED_TAX_RATE = 0.238;

export default function TaxCalculatorPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    capitalGainStatus: null,
    gainTiming: null,
    gainDate: null,
    gainAmount: null
  });
  const [showResults, setShowResults] = useState(false);
  const [calculationResults, setCalculationResults] = useState(null);
  const [isEligible, setIsEligible] = useState(true);
  const router = useRouter();
  const { user } = useAuth();



  const handleStepComplete = (stepId, value) => {
    const newFormData = { ...formData, [stepId]: value };
    setFormData(newFormData);

    // If user selects "No" for capital gain status, immediately show not eligible
    if (stepId === 'capitalGainStatus' && value === false) {
      setIsEligible(false);
      setShowResults(true);
      
      // Track the event
      if (user) {
        trackUserEvent('tax_calculator_used', {
          capitalGainStatus: false,
          gainTiming: null,
          gainDate: null,
          gainAmountRange: null,
          eligible: false,
          totalSavings: 0
        });
      }
      return;
    }

    // Check timing eligibility
    if (stepId === 'gainTiming') {
      const timingOption = TIMING_OPTIONS.find(opt => opt.value === value);
      if (timingOption && !timingOption.eligible) {
        setIsEligible(false);
        setShowResults(true);
        
        // Track the event
        if (user) {
          trackUserEvent('tax_calculator_used', {
            capitalGainStatus: newFormData.capitalGainStatus,
            gainTiming: value,
            gainDate: null,
            gainAmountRange: null,
            eligible: false,
            totalSavings: 0
          });
        }
        return;
      }
    }

    // Check date eligibility (180 days rule)
    if (stepId === 'gainDate') {
      const saleDate = new Date(value);
      const deadline = new Date(saleDate.getTime() + (180 * 24 * 60 * 60 * 1000));
      const now = new Date();
      
      // If deadline is in the past, they missed the window (unless specific extensions apply, but keeping simple)
      /* 
         Note: If user selected "Future" in timing, value might be future date.
         If "Within 180 days", we check strictly.
         Actually, if deadline < now, it's ineligible.
      */
      if (deadline < now) {
         // Maybe just warn? But standard rule is 180 days.
         // If "gainTiming" was "within-180" but user enters a date 200 days ago, we should catch it.
         setIsEligible(false);
         setShowResults(true);
         return;
      }
    }

    // Check eligibility based on gain amount
    if (stepId === 'gainAmount') {
      if (value < MIN_ELIGIBLE_GAIN_AMOUNT) {
        setIsEligible(false);
        setShowResults(true);
        
        // Track the event
        if (user) {
          trackUserEvent('tax_calculator_used', {
            capitalGainStatus: newFormData.capitalGainStatus,
            gainTiming: newFormData.gainTiming,
            gainDate: newFormData.gainDate,
            gainAmountRange: null,
            eligible: false,
            totalSavings: 0
          });
        }
        return;
      }
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate results for eligible users using hardcoded tax rate and hold period
      const results = calculateTaxSavings(
        newFormData.gainAmount,
        HARDCODED_TAX_RATE,
        true // Always assume 10+ year hold for maximum benefit
      );
      setCalculationResults(results);
      setIsEligible(true);
      setShowResults(true);

      // Get the gain amount range for tracking
      const gainAmountOption = GAIN_AMOUNT_OPTIONS.find(opt => opt.value === newFormData.gainAmount);
      const gainAmountRange = gainAmountOption ? {
        min: gainAmountOption.min,
        max: gainAmountOption.max
      } : null;
      
      // Track the event
      if (user) {
        trackUserEvent('tax_calculator_used', {
          capitalGainStatus: newFormData.capitalGainStatus,
          gainTiming: newFormData.gainTiming,
          gainAmountRange: gainAmountRange,
          eligible: true,
          totalSavings: results.totalSavings
        });
      }
    }
  };

  const handleBack = () => {
    if (showResults) {
      router.push('/invest');
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push('/invest');
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
      return <IneligibleScreen onBack={handleBack} onReset={handleReset} formData={formData} />;
    }
    if (calculationResults) {
      return <ResultsScreen results={calculationResults} onBack={handleBack} onReset={handleReset} formData={formData} />;
    }
  }

  return (
    <div className="relative min-h-screen pt-20 sm:pt-24 md:pt-28 pb-8">
      {/* Grid Background */}
      <div className="fixed inset-0 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[600px] w-[600px] rounded-full bg-radial-gradient from-blue-500/10 to-transparent blur-[100px] pointer-events-none"></div>
      
      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy dark:text-white tracking-tight mb-4">
            OZ Tax Savings Calculator
          </h1>
          <p className="text-xl text-black/60 dark:text-white/60 font-light">
            Check how much tax you can save with Opportunity Zones
          </p>
        </div>



        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-black/60 dark:text-white/60">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <span className="text-sm text-black/60 dark:text-white/60">
              {Math.round(((currentStep + 1) / STEPS.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500"
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
            className="glass-card rounded-3xl p-4 sm:p-8 bg-white/80 dark:bg-black/20 border border-black/10 dark:border-white/10"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
                <currentStepData.icon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-black dark:text-white mb-2">
                {currentStepData.title}
              </h2>
              <p className="text-lg text-black/60 dark:text-white/60 font-light">
                {currentStepData.subtitle}
              </p>
            </div>

            {/* Step 1: Capital Gain Status */}
            {currentStep === 0 && (
              <div className="space-y-4">
                {/* Capital Gain Explanation */}
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    What counts as a capital gain?
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Capital gains include profits from selling stocks, bonds, real estate, businesses, or other investments. 
                    This includes both short-term (held less than 1 year) and long-term (held 1+ years) gains that are subject to federal capital gains tax.
                  </p>
                </div>

                {CAPITAL_GAIN_STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleStepComplete('capitalGainStatus', option.value)}
                    className="w-full p-6 text-left glass-card rounded-2xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xl font-semibold text-black dark:text-white mb-1">
                          {option.label}
                        </div>
                        <div className="text-sm text-black/60 dark:text-white/60">
                          {option.display}
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-black/40 dark:text-white/40 group-hover:text-primary transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Gain Timing */}
            {currentStep === 1 && (
              <div className="space-y-4">
                {TIMING_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleStepComplete('gainTiming', option.value)}
                    className="w-full p-6 text-left glass-card rounded-2xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xl font-semibold text-black dark:text-white mb-1">
                          {option.label}
                        </div>
                        <div className="text-sm text-black/60 dark:text-white/60">
                          {option.display}
                        </div>

                      </div>
                      <ArrowRight className="w-5 h-5 text-black/40 dark:text-white/40 group-hover:text-primary transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Date of Sale */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                 <div className="flex flex-col gap-4">
                    <label className="text-lg font-semibold text-black dark:text-white">When was the sale date?</label>
                    <input 
                        type="date" 
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full p-6 h-20 rounded-2xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/20 text-2xl font-bold text-center focus:ring-2 focus:ring-primary outline-none appearance-none"
                        onChange={(e) => {
                             if (e.target.value) {
                                  handleStepComplete('gainDate', e.target.value);
                             }
                        }}
                    />
                    <div className="flex items-center gap-2 justify-center text-sm text-black/40 dark:text-white/40 mt-2">
                        <Clock className="w-4 h-4" />
                        <span>Deadline is 180 days from this date</span>
                    </div>
                 </div>
              </div>
            )}

            {/* Step 3: Gain Amount */}
            {currentStep === 3 && (
              <div className="space-y-4">
                {GAIN_AMOUNT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleStepComplete('gainAmount', option.value)}
                    className="w-full p-6 text-left glass-card rounded-2xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xl font-semibold text-black dark:text-white mb-1">
                          {option.label}
                        </div>
                        <div className="text-sm text-black/60 dark:text-white/60">
                          {option.display}
                        </div>

                      </div>
                      <ArrowRight className="w-5 h-5 text-black/40 dark:text-white/40 group-hover:text-primary transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-end items-center mt-8">
          <div className="text-sm text-black/40 dark:text-white/40">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span>Not tax advice - consult your CPA for personalized guidance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IneligibleScreen({ onBack, onReset, formData }) {
  const getReason = () => {
    if (!formData.capitalGainStatus) {
      return "You need to have capital gains to defer in order to benefit from Opportunity Zone investments.";
    }
    if (formData.gainTiming === 'before-180') {
      return "The 180-day reinvestment deadline has passed for your capital gain. You must invest in a Qualified Opportunity Fund within 180 days of the gain realization.";
    }
    if (formData.gainAmount && formData.gainAmount < MIN_ELIGIBLE_GAIN_AMOUNT) {
      return "Based on current investment minimums, you may need a higher capital gain amount to qualify for most Opportunity Zone investments.";
    }
    return "Based on your responses, you may not currently qualify for Opportunity Zone investments.";
  };

  return (

      <div className="px-8 py-8 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#ff375f] to-[#ff6b8a] rounded-full mb-6"
          >
            <AlertTriangle className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-semibold text-black dark:text-white tracking-tight mb-4">
            Not Currently Eligible
          </h1>
          <p className="text-xl text-black/60 dark:text-white/60 font-light">
            Your tax savings potential: $0
          </p>
        </div>

        {/* Main Result Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="glass-card rounded-3xl p-8 bg-gradient-to-br from-[#ff375f]/5 to-[#ff6b8a]/5 border-2 border-[#ff375f]/20">
            <h2 className="text-2xl font-semibold text-[#ff375f] mb-4">
              You don't currently qualify for Opportunity Zone tax benefits
            </h2>
            <p className="text-lg text-black/70 dark:text-white/70 mb-6">
              {getReason()}
            </p>
            <div className="text-center">
              <p className="text-sm text-black/60 dark:text-white/60 mb-4">
                Our team can still help you explore future opportunities and answer questions about OZ investments.
              </p>
            </div>
          </div>
        </motion.div>

        <ScheduleCallCTA />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Start Over
          </button>
        </div>

            {/* Disclaimers */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="mt-8 text-center text-xs text-black/40 dark:text-white/40 space-y-2"
            >
              <p>
                Eligibility requirements may vary by investment. Contact our team for personalized guidance.
              </p>
            </motion.div>
          </div>
        </div>
  
    );
  }

function ResultsScreen({ results, onBack, onReset, formData }) {
  const [isCalculationExpanded, setIsCalculationExpanded] = useState(false);
  
  // Calculate deadline derived from formData
  const deadline = formData.gainDate 
    ? new Date(new Date(formData.gainDate).getTime() + (180 * 24 * 60 * 60 * 1000)).getTime()
    : null;
  
  // Use the corrected tax scenarios from the calculation
  const taxWithoutOZ = results.taxWithoutOZ;
  const taxWithOZ = results.taxWithOZ;

  const toggleCalculationExpanded = () => {
    setIsCalculationExpanded(!isCalculationExpanded);
  };
  
  const confettiTrigger = () => {
    console.log('🎉 Confetti for tax savings!');
  };

  return (

      <div className="px-8 py-8 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          
          <h1 className="text-4xl md:text-5xl font-semibold text-black dark:text-white tracking-tight mb-4">
            Your Tax Savings Estimate
          </h1>
          <p className="text-xl text-black/60 dark:text-white/60 font-light">
            Based on your Opportunity Zone investment strategy
          </p>
        </div>

        {/* Hero Number */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="glass-card rounded-3xl p-8 bg-green-500/5 border-2 border-green-500/20">
            <p className="text-lg text-black/60 dark:text-white/60 mb-2">
              You could defer/avoid approximately
            </p>
            <p className="text-4xl md:text-5xl font-bold text-green-500 mb-4">
              {formatCurrency(results.totalSavings)}
            </p>
            <p className="text-lg text-black/60 dark:text-white/60">
              in federal capital gains tax
            </p>
          </div>
        </motion.div>

        {/* Tax Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Without OZ */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card rounded-2xl p-4 bg-gradient-to-br from-[#ff375f]/5 to-[#ff6b8a]/5 border border-[#ff375f]/20"
          >
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
              Tax Without OZ
            </h3>
            <p className="text-2xl font-bold text-[#ff375f] mb-2">
              {formatCurrency(taxWithoutOZ)}
            </p>
            <p className="text-xs text-black/60 dark:text-white/60">
              Tax on original gain + tax on 4x appreciation
            </p>
          </motion.div>

          {/* With OZ */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="glass-card rounded-2xl p-4 bg-gradient-to-br from-[#1d4ed8]/5 to-[#3b82f6]/5 border border-[#1d4ed8]/20"
          >
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
              Tax With OZ
            </h3>
            <p className="text-2xl font-bold text-[#1d4ed8] mb-2">
              {formatCurrency(taxWithOZ)}
            </p>
            <p className="text-xs text-black/60 dark:text-white/60">
              Tax only on original gain (no tax on 4x appreciation)
            </p>
          </motion.div>
        </div>

        {/* Summary */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="glass-card rounded-2xl p-6 bg-white/80 dark:bg-black/20 border border-black/10 dark:border-white/10 mb-6"
        >
          {/* Header - Always Visible */}
          <div 
            className="flex items-center justify-between cursor-pointer" 
            onClick={toggleCalculationExpanded}
          >
            <h3 className="text-lg font-semibold text-black dark:text-white">
              Calculation Summary
            </h3>
            
            {/* Dropdown Arrow */}
            <div className={`transition-transform duration-200 ${isCalculationExpanded ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-5 h-5 text-black/60 dark:text-white/60" />
            </div>
          </div>

          {/* Expandable Details */}
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isCalculationExpanded 
                ? 'max-h-[400px] opacity-100 mt-4' 
                : 'max-h-0 opacity-0 mt-0'
            }`}
          >
            <div className={`transform transition-transform duration-300 ease-in-out ${
              isCalculationExpanded ? 'translate-y-0' : '-translate-y-4'
            }`}>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-black/60 dark:text-white/60">Federal Capital Gain Amount:</span>
                  <span className="text-black dark:text-white font-medium">{getGainAmountLabel(results.gainAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/60 dark:text-white/60">Federal Tax Rate:</span>
                  <span className="text-black dark:text-white font-medium">23.8% (20% Fed + 3.8% NIIT)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/60 dark:text-white/60">10-Year Investment Multiple:</span>
                  <span className="text-black dark:text-white font-medium">
                    4x
                  </span>
                </div>
                <div className="flex justify-between border-t border-black/10 dark:border-white/10 pt-3">
                  <span className="text-black/60 dark:text-white/60">Tax Without OZ (original + appreciation):</span>
                  <span className="text-black dark:text-white font-medium">{formatCurrency(results.taxWithoutOZ)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/60 dark:text-white/60">Tax With OZ (deferred original only):</span>
                  <span className="text-black dark:text-white font-medium">{formatCurrency(results.taxWithOZ)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {deadline && (
           <div className="mb-8">
              <DramaticCountdown targetDate={deadline} />
           </div>
        )}

        <ScheduleCallCTA />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <button
            onClick={onReset}
            className="px-6 py-3 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
          >
            Start Over
          </button>
        </div>

        {/* Disclaimers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-8 text-center text-xs text-black/40 dark:text-white/40 space-y-2"
        >
          <p>
            Last updated: {TAX_CALC_CONFIG.LAST_UPDATED} • {TAX_CALC_CONFIG.BILL_VERSION}
          </p>
          <p>
            This calculation is illustrative only and does not constitute tax advice.
          </p>
        </motion.div>
      </div>
      </div>

  );
} 