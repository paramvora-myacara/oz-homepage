"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon, ChevronRightIcon, SparklesIcon, BuildingOfficeIcon, DocumentCheckIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const steps = {
  welcome: 0,
  question1: 1,
  question1Followup: 2,
  question2: 3,
  question2Options: 4,
  confirmation: 5,
};

export default function QOZBSupportPage() {
  const [currentStep, setCurrentStep] = useState(steps.welcome);
  const [question1Answer, setQuestion1Answer] = useState(null);
  const [question2Answer, setQuestion2Answer] = useState(null);
  const [question2Followup, setQuestion2Followup] = useState(null);
  const [confirmationType, setConfirmationType] = useState(null);
  const router = useRouter();

  const handleQuestion1 = (answer) => {
    setQuestion1Answer(answer);
    if (answer === true) {
      setCurrentStep(steps.question2);
    } else {
      setCurrentStep(steps.question1Followup);
    }
  };

  const handleQuestion1Followup = (answer) => {
    if (answer === true) {
      setConfirmationType("qof_consultation");
      setCurrentStep(steps.confirmation);
    } else {
      // Exit flow
      router.push("/");
    }
  };

  const handleQuestion2 = (answer) => {
    setQuestion2Answer(answer);
    if (answer === true) {
      setConfirmationType("listing");
      setCurrentStep(steps.confirmation);
    } else {
      setCurrentStep(steps.question2Options);
    }
  };

  const handleQuestion2Option = (option) => {
    setQuestion2Followup(option);
    if (option === "a" || option === "c") {
      setConfirmationType("qozb_consultation");
    } else if (option === "b") {
      setConfirmationType("securities_attorney");
    } else if (option === "d") {
      setConfirmationType("legal_formation");
    }
    setCurrentStep(steps.confirmation);
  };

  const handleBack = () => {
    if (currentStep === steps.question2) {
      setCurrentStep(steps.question1);
      setQuestion1Answer(null);
    } else if (currentStep === steps.question2Options) {
      setCurrentStep(steps.question2);
      setQuestion2Answer(null);
    } else if (currentStep === steps.question1Followup) {
      setCurrentStep(steps.question1);
      setQuestion1Answer(null);
    } else if (currentStep === steps.question1) {
      setCurrentStep(steps.welcome);
      setQuestion1Answer(null);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case steps.welcome:
        return <WelcomeScreen onStart={() => setCurrentStep(steps.question1)} />;
      case steps.question1:
        return (
          <Question1Screen
            answer={question1Answer}
            onAnswer={handleQuestion1}
            onBack={handleBack}
          />
        );
      case steps.question1Followup:
        return (
          <Question1FollowupScreen
            onAnswer={handleQuestion1Followup}
            onBack={handleBack}
          />
        );
      case steps.question2:
        return (
          <Question2Screen
            answer={question2Answer}
            onAnswer={handleQuestion2}
            onBack={handleBack}
          />
        );
      case steps.question2Options:
        return (
          <Question2OptionsScreen
            selected={question2Followup}
            onSelect={handleQuestion2Option}
            onBack={handleBack}
          />
        );
      case steps.confirmation:
        return (
          <ConfirmationScreen
            type={confirmationType}
            onBack={() => setCurrentStep(steps.question2)}
          />
        );
      default:
        return <WelcomeScreen onStart={() => setCurrentStep(steps.question1)} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F8F9FA] dark:bg-black px-4 sm:px-6 lg:px-8 overflow-hidden flex items-center justify-center pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16">
      {/* Grid Background */}
      <div
        className="absolute inset-0 z-0 opacity-[0.6] dark:opacity-[0.3]"
        style={{
          backgroundImage: `linear-gradient(#D1D5DB 1px, transparent 1px), linear-gradient(90deg, #D1D5DB 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 70%)'
        }}
      />
      <div className="w-full max-w-4xl xl:max-w-5xl mx-auto relative z-10">
        {/* Progress Indicator */}
        {currentStep !== steps.welcome && currentStep !== steps.confirmation && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-lg p-3 sm:p-4"
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-sm sm:text-base font-semibold text-navy/70 dark:text-gray-400">
                Step {currentStep} of {steps.question2Options}
              </span>
            </div>
            <div className="w-full bg-gray-200/50 dark:bg-gray-800/50 rounded-full h-1.5 sm:h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / steps.question2Options) * 100}%` }}
                className="bg-primary h-1.5 sm:h-2 rounded-full transition-all duration-300"
              />
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Welcome Screen
function WelcomeScreen({ onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center w-full"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          y: [0, -10, 0]
        }}
        transition={{ 
          duration: 0.5,
          y: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 transition-all duration-500 w-full max-w-3xl sm:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[56px] font-extrabold text-navy dark:text-white mb-4 sm:mb-6 leading-tight sm:whitespace-nowrap">
          Welcome to OZ Listings!
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-navy/80 dark:text-gray-400 mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-xl sm:max-w-2xl mx-auto px-2 sm:px-0">
          Answer a few quick questions so we can guide you to the right solution.
        </p>
        <button
          onClick={onStart}
          className="inline-flex items-center h-12 sm:h-14 md:h-[60px] px-6 sm:px-8 bg-primary text-white font-semibold text-lg sm:text-xl md:text-2xl rounded-lg hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
        >
          Start Questionnaire
          <ChevronRightIcon className="ml-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
        </button>
      </motion.div>
    </motion.div>
  );
}

// Question 1 Screen
function Question1Screen({ answer, onAnswer, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: [0, -8, 0]
      }}
      transition={{ 
        y: {
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 transition-all duration-500"
    >
      <button
        onClick={onBack}
        className="text-primary dark:text-primary-light mb-4 sm:mb-6 md:mb-8 hover:underline font-medium text-sm sm:text-base md:text-lg"
      >
        ← Back
      </button>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-navy dark:text-white mb-4 sm:mb-6 md:mb-8">
        Question #1
      </h2>
      <p className="text-lg sm:text-xl md:text-2xl text-navy/80 dark:text-gray-300 mb-6 sm:mb-8 md:mb-10 leading-relaxed">
        Do you have a QOZB project you'd like to list on OZListings.com?
      </p>

      <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
        <OptionButton
          selected={answer === true}
          onClick={() => onAnswer(true)}
          label="YES"
        />
        <OptionButton
          selected={answer === false}
          onClick={() => onAnswer(false)}
          label="NO"
        />
      </div>

      {answer === true && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-base text-navy/70 dark:text-gray-400 italic font-medium"
        >
          Proceed to Question #2
        </motion.div>
      )}
    </motion.div>
  );
}

// Question 1 Followup Screen
function Question1FollowupScreen({ onAnswer, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: [0, -8, 0]
      }}
      transition={{ 
        y: {
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 transition-all duration-500"
    >
      <button
        onClick={onBack}
        className="text-primary dark:text-primary-light mb-4 sm:mb-6 md:mb-8 hover:underline font-medium text-sm sm:text-base md:text-lg"
      >
        ← Back
      </button>

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-navy dark:text-white mb-4 sm:mb-6 md:mb-8">
        Follow-up Question
      </h2>
      <p className="text-lg sm:text-xl md:text-2xl text-navy/80 dark:text-gray-300 mb-6 sm:mb-8 md:mb-10 leading-relaxed">
        Do you have questions about forming your Qualified Opportunity Fund (QOF)
        to invest in QOZB projects?
      </p>

      <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
        <OptionButton
          selected={false}
          onClick={() => onAnswer(true)}
          label="YES"
        />
        <OptionButton
          selected={false}
          onClick={() => onAnswer(false)}
          label="NO"
        />
      </div>

      <div className="mt-6 sm:mt-8 md:mt-10 p-4 sm:p-5 md:p-6 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20">
        <p className="text-sm sm:text-base font-semibold text-navy dark:text-gray-300 mb-2">
          If YES: Schedule a FREE 30-Minute Consultation
        </p>
        <p className="text-xs sm:text-sm text-navy/70 dark:text-gray-400 italic">
          Speak with our advisory team
        </p>
      </div>
    </motion.div>
  );
}

// Question 2 Screen
function Question2Screen({ answer, onAnswer, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: [0, -8, 0]
      }}
      transition={{ 
        y: {
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 transition-all duration-500"
    >
      <button
        onClick={onBack}
        className="text-primary dark:text-primary-light mb-4 sm:mb-6 md:mb-8 hover:underline font-medium text-sm sm:text-base md:text-lg"
      >
        ← Back
      </button>

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-navy dark:text-white mb-4 sm:mb-6 md:mb-8">
        Question #2
      </h2>
      <p className="text-lg sm:text-xl md:text-2xl text-navy/80 dark:text-gray-300 mb-6 sm:mb-8 md:mb-10 leading-relaxed">
        Do you have your QOZB formed and ready to accept QOF investors today?
      </p>

      <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
        <OptionButton
          selected={answer === true}
          onClick={() => onAnswer(true)}
          label="YES"
        />
        <OptionButton
          selected={answer === false}
          onClick={() => onAnswer(false)}
          label="NO"
        />
      </div>

      {answer === true && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 sm:mt-8"
        >
          <button className="w-full sm:w-auto h-12 sm:h-14 md:h-[60px] px-6 sm:px-8 bg-primary text-white font-semibold text-lg sm:text-xl md:text-2xl rounded-lg hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200">
            Click here to list your project now
          </button>
        </motion.div>
      )}

      {answer === false && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm sm:text-base text-navy/70 dark:text-gray-400 italic mt-4 sm:mt-6 font-medium"
        >
          Please select the option that best describes your situation:
        </motion.div>
      )}
    </motion.div>
  );
}

// Question 2 Options Screen
function Question2OptionsScreen({ selected, onSelect, onBack }) {
  const options = [
    {
      id: "a",
      title: "I'm not sure if my QOZB project is properly formed and ready to accept investors.",
      question: "Can OZListings direct me to a QOZB advisor for a FREE 30-minute consultation?",
      buttonText: "Yes, schedule my consultation",
    },
    {
      id: "b",
      title: "My QOZB is formed, but I don't know if my offering documents are compliant to accept QOF investors.",
      question: "Can OZListings direct me to a securities attorney for a FREE 30-minute consultation?",
      buttonText: "Yes, connect me with a securities attorney",
    },
    {
      id: "c",
      title: "I have a project in a QOZB, but I don't know how to convert it into a QOZB property eligible for QOF investment.",
      question: "Can you direct me to a QOZB advisor for a FREE 30-minute consultation?",
      buttonText: "Yes, schedule my consultation",
    },
    {
      id: "d",
      title: "I need to properly form my QOZB through a licensed, experienced QOZB attorney to ensure my project can accept QOF investors —and I'd like to access discounted flat-fee services by registering through OZListings.com.",
      buttonText: "Register & Access Discounted Legal Formation",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: [0, -8, 0]
      }}
      transition={{ 
        y: {
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 transition-all duration-500"
    >
      <button
        onClick={onBack}
        className="text-primary dark:text-primary-light mb-4 sm:mb-6 md:mb-8 hover:underline font-medium text-sm sm:text-base md:text-lg"
      >
        ← Back
      </button>

      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-navy dark:text-white mb-6 sm:mb-8 md:mb-10">
        Please select the option that best describes your situation:
      </h2>

      <div className="space-y-3 sm:space-y-4">
        {options.map((option, index) => {
          // Convert option id (a, b, c, d) to number for delay calculation
          const optionNumber = option.id.charCodeAt(0) - 97; // a=0, b=1, c=2, d=3
          
          return (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: 1, 
              y: [0, -6, 0]
            }}
            transition={{ 
              opacity: { delay: optionNumber * 0.1, duration: 0.3 },
              y: {
                duration: 4 + optionNumber * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: optionNumber * 0.2 + 0.3
              }
            }}
            whileHover={{ y: -4, scale: 1.01 }}
            className={`p-4 sm:p-5 md:p-6 lg:p-8 border-2 rounded-xl cursor-pointer transition-all bg-white/60 dark:bg-gray-900/60 backdrop-blur-md ${
              selected === option.id
                ? "border-primary bg-primary/10 dark:bg-primary/20 shadow-lg"
                : "border-gray-200/50 dark:border-gray-700/50 hover:border-primary/50 dark:hover:border-primary/30"
            }`}
            onClick={() => onSelect(option.id)}
          >
            <div className="flex items-start">
              <div
                className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full border-2 flex items-center justify-center mr-3 sm:mr-4 md:mr-5 mt-1 ${
                  selected === option.id
                    ? "border-primary bg-primary"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {selected === option.id && (
                  <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-navy dark:text-white mb-3 sm:mb-4 md:mb-5 leading-relaxed">
                  {option.id.toUpperCase()}. {option.title}
                </p>
                {option.question && (
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-navy/70 dark:text-gray-400 mb-5 sm:mb-6 md:mb-7 leading-relaxed">
                    {option.question}
                  </p>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(option.id);
                  }}
                  className="w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-primary text-white text-lg sm:text-xl md:text-2xl font-semibold rounded-lg hover:bg-primary-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200"
                >
                  {option.buttonText}
                </button>
              </div>
            </div>
          </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// Confirmation Screen
function ConfirmationScreen({ type, onBack }) {
  const confirmations = {
    qof_consultation: {
      title: "Consultation Request Submitted",
      message: "Your consultation request has been submitted. Our team will contact you shortly to schedule your FREE 30-minute session.",
      icon: ClockIcon,
      color: "blue",
    },
    listing: {
      title: "You're Ready to List Your Project",
      message: "Click below to complete your OZListings profile.",
      buttonText: "Create My Listing",
      buttonAction: () => {
        // Would navigate to listing creation
        console.log("Navigate to listing creation");
      },
      icon: BuildingOfficeIcon,
      color: "green",
    },
    qozb_consultation: {
      title: "Consultation Request Submitted",
      message: "Your consultation request has been submitted. Our team will contact you shortly to schedule your FREE 30-minute session with a QOZB advisor.",
      icon: ClockIcon,
      color: "blue",
    },
    securities_attorney: {
      title: "Consultation Request Submitted",
      message: "Your consultation request has been submitted. Our team will contact you shortly to connect you with a securities attorney for your FREE 30-minute consultation.",
      icon: DocumentCheckIcon,
      color: "purple",
    },
    legal_formation: {
      title: "Registration Submitted",
      message: "Your registration has been submitted. Our team will contact you shortly to help you access discounted legal formation services.",
      icon: DocumentCheckIcon,
      color: "indigo",
    },
  };

  const confirmation = confirmations[type] || confirmations.qof_consultation;
  const IconComponent = confirmation.icon || CheckIcon;
  const colorClasses = {
    green: {
      bg: "bg-green-100 dark:bg-green-900/30",
      icon: "text-green-600 dark:text-green-400",
      accent: "bg-green-50 dark:bg-green-900/10",
      border: "border-green-200 dark:border-green-800",
    },
    blue: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      icon: "text-blue-600 dark:text-blue-400",
      accent: "bg-blue-50 dark:bg-blue-900/10",
      border: "border-blue-200 dark:border-blue-800",
    },
    purple: {
      bg: "bg-purple-100 dark:bg-purple-900/30",
      icon: "text-purple-600 dark:text-purple-400",
      accent: "bg-purple-50 dark:bg-purple-900/10",
      border: "border-purple-200 dark:border-purple-800",
    },
    indigo: {
      bg: "bg-indigo-100 dark:bg-indigo-900/30",
      icon: "text-indigo-600 dark:text-indigo-400",
      accent: "bg-indigo-50 dark:bg-indigo-900/10",
      border: "border-indigo-200 dark:border-indigo-800",
    },
  };
  const colors = colorClasses[confirmation.color] || colorClasses.blue;

  return (
    <div className="w-full">
      {/* Decorative background elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto"
      >
        {/* Decorative arc */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-64 h-32"
        >
          <svg
            viewBox="0 0 200 100"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 0 100 Q 100 20 200 100"
              stroke="currentColor"
              strokeWidth="2"
              className={colors.icon}
              opacity="0.3"
            />
          </svg>
        </motion.div>

        {/* Main content card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: [0, -12, 0]
          }}
          transition={{ 
            duration: 0.5,
            y: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 transition-all duration-500 w-full`}
        >
          {/* Decorative corner elements */}
          <div className="absolute top-0 left-0 w-20 h-20">
            <div className={`absolute top-4 left-4 w-12 h-12 rounded-full ${colors.bg} opacity-50`}></div>
          </div>
          <div className="absolute bottom-0 right-0 w-20 h-20">
            <div className={`absolute bottom-4 right-4 w-12 h-12 rounded-full ${colors.bg} opacity-50`}></div>
          </div>

          <div className="text-center relative z-10">
            {/* Success icon with animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.8, delay: 0.3 }}
              className={`w-20 h-20 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg`}
            >
              <IconComponent className={`w-12 h-12 ${colors.icon}`} />
            </motion.div>

            {/* Sparkle decoration */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="absolute top-8 right-8"
            >
              <SparklesIcon className={`w-6 h-6 ${colors.icon} opacity-60`} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="absolute bottom-8 left-8"
            >
              <SparklesIcon className={`w-5 h-5 ${colors.icon} opacity-40`} />
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-navy dark:text-white mb-4 sm:mb-6 md:mb-8 leading-tight px-2 sm:px-0"
            >
              {confirmation.title}
            </motion.h2>

            {/* Message */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-navy/80 dark:text-gray-400 mb-8 sm:mb-10 md:mb-12 max-w-xl sm:max-w-2xl mx-auto leading-relaxed px-4 sm:px-0"
            >
              {confirmation.message}
            </motion.p>

            {/* Action button */}
            {confirmation.buttonText && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <button
                  onClick={confirmation.buttonAction}
                  className="group relative h-12 sm:h-14 md:h-[60px] px-6 sm:px-8 bg-primary text-white font-semibold text-lg sm:text-xl md:text-2xl rounded-lg hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {confirmation.buttonText}
                    <ChevronRightIcon className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </motion.div>
            )}

            {/* Additional info cards for listing confirmation */}
            {type === "listing" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-8 sm:mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4"
              >
                {[
                  { icon: BuildingOfficeIcon, text: "Reach Qualified Investors" },
                  { icon: DocumentCheckIcon, text: "Verified Listings Only" },
                  { icon: SparklesIcon, text: "Premium Placement" },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + idx * 0.1 }}
                    whileHover={{ y: -6, scale: 1.05 }}
                    className={`bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-xl p-4 sm:p-5 md:p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    <item.icon className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${colors.icon} mx-auto mb-2 sm:mb-3`} />
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-navy dark:text-gray-300 font-semibold">
                      {item.text}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Reusable Option Button Component
function OptionButton({ selected, onClick, label }) {
  return (
    <motion.button
      onClick={onClick}
      animate={{ 
        y: [0, -5, 0]
      }}
      transition={{ 
        y: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`w-full p-4 sm:p-5 md:p-6 text-left border-2 rounded-xl transition-all bg-white/60 dark:bg-gray-900/60 backdrop-blur-md ${
        selected
          ? "border-primary bg-primary/10 dark:bg-primary/20 shadow-lg"
          : "border-gray-200/50 dark:border-gray-700/50 hover:border-primary/50 dark:hover:border-primary/30"
      }`}
    >
      <div className="flex items-center">
        <div
          className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full border-2 flex items-center justify-center mr-3 sm:mr-4 md:mr-5 ${
            selected
              ? "border-primary bg-primary"
              : "border-gray-300 dark:border-gray-600"
          }`}
        >
          {selected && <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />}
        </div>
        <span className="text-sm sm:text-base md:text-lg font-semibold text-navy dark:text-white">
          {label}
        </span>
      </div>
    </motion.button>
  );
}
