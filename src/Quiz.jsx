import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';

const questions = [
  {
    text: "You arrive at your weekend escape destination. What's the first thing you want to do?",
    options: [
      { text: "Settle into your room with a good book and relax.", persona: "Alex" },
      { text: "Head out immediately to find the most popular local hangout.", persona: "Sarah" },
      { text: "Take a quiet stroll around the neighborhood, then maybe meet up with a friend later.", persona: "Jordan" },
      { text: "Either sleep the whole afternoon or instantly go skydiving, depending entirely on the vibe.", persona: "Taylor" },
    ]
  },
  {
    text: "It's Saturday morning. Your friends want to go to a crowded outdoor market. Your reaction?",
    options: [
      { text: "Politely decline and enjoy a solitary morning coffee.", persona: "Alex" },
      { text: "Awesome! I love being in the middle of the hustle and bustle.", persona: "Sarah" },
      { text: "I'll go for an hour or two, then find a quiet spot to recharge.", persona: "Jordan" },
      { text: "I might be the life of the party there, or I might get overwhelmed and leave in 5 minutes.", persona: "Taylor" },
    ]
  },
  {
    text: "You have a free afternoon with no itinerary. How do you spend it?",
    options: [
      { text: "Visiting a quiet museum or art gallery alone.", persona: "Alex" },
      { text: "Joining a spontaneous group activity like beach volleyball.", persona: "Sarah" },
      { text: "Going to a cozy bookstore cafe, maybe chatting with the barista.", persona: "Jordan" },
      { text: "Either deep diving into a new hobby alone or throwing an impromptu party.", persona: "Taylor" },
    ]
  },
  {
    text: "Dinner time! Where are we eating?",
    options: [
      { text: "Ordering room service or finding a quiet, dimly lit restaurant.", persona: "Alex" },
      { text: "The trendiest, loudest, most packed restaurant in town.", persona: "Sarah" },
      { text: "A nice local spot with a lively but not overwhelming atmosphere.", persona: "Jordan" },
      { text: "Could be fine dining, could be a hot dog stand—it's completely unpredictable.", persona: "Taylor" },
    ]
  },
  {
    text: "You meet some fellow travelers. How do you interact?",
    options: [
      { text: "Keep to myself or offer a brief nod.", persona: "Alex" },
      { text: "Introduce myself immediately and invite them to hang out.", persona: "Sarah" },
      { text: "Have a friendly chat, but eventually excuse myself if it gets too energetic.", persona: "Jordan" },
      { text: "Talk their ear off for hours, or completely ignore them. No in-between.", persona: "Taylor" },
    ]
  },
  {
    text: "Your phone rings. It's a group FaceTime call from home.",
    options: [
      { text: "Let it go to voicemail. I'll text them later.", persona: "Alex" },
      { text: "Answer immediately and loudly share everything I've done.", persona: "Sarah" },
      { text: "Answer it, chat for a few minutes, then say I have to go.", persona: "Jordan" },
      { text: "Either I'm the one who initiated the call, or my phone has been on airplane mode all weekend.", persona: "Taylor" },
    ]
  },
  {
    text: "It's starting to rain heavily. What's the plan?",
    options: [
      { text: "Perfect. Blanket, tea, and zero guilt about staying indoors.", persona: "Alex" },
      { text: "Let's find a crowded indoor pub or club!", persona: "Sarah" },
      { text: "Watch a movie with a friend or two.", persona: "Jordan" },
      { text: "Dance in the rain, or complain about it incessantly.", persona: "Taylor" },
    ]
  },
  {
    text: "You stumble across a karaoke bar. What role do you play?",
    options: [
      { text: "Sit in the darkest corner, sipping a drink and observing.", persona: "Alex" },
      { text: "First one on stage, singing top 40 hits.", persona: "Sarah" },
      { text: "I'll do one duet if pressured, then go back to watching.", persona: "Jordan" },
      { text: "Either I refuse to enter the building, or I'm doing a 10-minute Queen medley.", persona: "Taylor" },
    ]
  },
  {
    text: "It's the final night of the escape. How are you feeling?",
    options: [
      { text: "Relieved. I'm ready for my own bed.", persona: "Alex" },
      { text: "Devastated. I want to extend the trip and invite more people.", persona: "Sarah" },
      { text: "Satisfied. It was a good balance, but I'm okay with going home.", persona: "Jordan" },
      { text: "Either completely exhausted or suddenly struck with limitless energy for an all-nighter.", persona: "Taylor" },
    ]
  },
  {
    text: "On the journey back home, how do you pass the time?",
    options: [
      { text: "Headphones on, eyes closed, ignoring the world.", persona: "Alex" },
      { text: "Chatting continuously with whoever is next to me.", persona: "Sarah" },
      { text: "Listening to a podcast, maybe having intermittent light conversation.", persona: "Jordan" },
      { text: "Either orchestrating a full-car singalong or maintaining absolute dead silence.", persona: "Taylor" },
    ]
  }
];

const shuffleOptions = (options) => {
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const sendResultEmail = (name, email, personaTitle) => {
  if (!email) {
    console.log("No email provided for logged-in user, skipping EmailJS delivery.");
    return false;
  }

  // SECRETS: Currently hardcoded for test. 
  // TODO [SECURITY]: Move these into a .env file later for production (e.g., VITE_EMAILJS_SERVICE_ID)
  const SERVICE_ID = 'service_nw5vswi';
  const TEMPLATE_ID = 'template_6jtrkvp';
  const PUBLIC_KEY = 'syZFJLNoM1ky0Nbl2';

  const getBadgeUrl = (personaObj) => {
    switch (personaObj) {
      case 'The Thoughtful Architect': return 'https://yourwebsite.com/assets/alex.png';
      case 'The Radiant Connector': return 'https://yourwebsite.com/assets/sarah.png';
      case 'The Balanced Voyager': return 'https://yourwebsite.com/assets/jordan.png';
      case 'The Dynamic Catalyst': return 'https://yourwebsite.com/assets/taylor.png';
      default: return '';
    }
  };

  console.log(`[EmailJS Triggered] Intended for: ${email}, Persona: ${personaTitle}`);

  const templateParams = {
    name: name,
    email: email,
    persona_title: personaTitle,
    badge_url: getBadgeUrl(personaTitle),
  };

  emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
    .then((response) => {
      console.log('SUCCESS! Email sent.', response.status, response.text);
    })
    .catch((error) => {
      console.error('FAILED to send email.', error);
    });

  return true;
};

// Minimalist Icons Removed per requirements

const LoadingScreen = () => {
  const messages = [
    'Reading your social frequency...',
    'Calculating your energy DNA...',
    'Meeting your persona...'
  ];
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 1100);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      className="w-full flex-grow flex flex-col items-center justify-center text-center pb-20 mt-12"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="w-16 h-16 rounded-full bg-white mb-12 shadow-[0_0_40px_rgba(255,255,255,0.4)]"
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={msgIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-[#888] font-mono tracking-[0.2em] text-xs md:text-sm uppercase h-6"
        >
          {messages[msgIndex]}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

const ResultPage = ({ persona, currentUserName, userEmail, onReset }) => {
  const [emailDispatched, setEmailDispatched] = useState(false);

  const personasData = {
    Alex: {
      title: "The Thoughtful Architect",
      description: "You thrive in quiet moments of reflection. You prefer deep, meaningful experiences over loud, crowded ones. You carefully design your downtime to recharge and explore the world at your own deliberate pace.",
      image: "/assets/alex.png"
    },
    Sarah: {
      title: "The Radiant Connector",
      description: "You are the life of the adventure, energized by bustling environments, new connections, and shared experiences. You dive headfirst into the action and leave a trail of enthusiasm wherever you go.",
      image: "/assets/sarah.png"
    },
    Jordan: {
      title: "The Balanced Voyager",
      description: "You are the master of the middle ground. As a true Ambivert, you seamlessly transition between social environments and solitary recharge time, finding the perfect equilibrium in any situation.",
      image: "/assets/jordan.png"
    },
    Taylor: {
      title: "The Dynamic Catalyst",
      description: "You defy categorization. Your energy is a dynamic wildcard—capable of both deep introspective dives and explosive spontaneous adventures. You keep everyone guessing, including yourself.",
      image: "/assets/taylor.png"
    }
  };

  const data = personasData[persona];

  useEffect(() => {
    if (userEmail && !emailDispatched) {
      const success = sendResultEmail(currentUserName, userEmail, data.title);
      if (success) {
        setEmailDispatched(true);
      }
    }
  }, [userEmail, currentUserName, data.title, emailDispatched]);

  const handleRetake = () => {
    setEmailDispatched(false);
    onReset();
  };

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="relative w-full flex-grow flex flex-col items-center justify-start text-center pb-12 pt-8 overflow-hidden"
    >
      <div className="relative z-10 w-full flex flex-col items-center max-w-md md:max-w-4xl px-4 pointer-events-auto">
        <h2 className="text-sm md:text-base text-[#888] mb-2 font-mono tracking-[0.2em] italic">
          {currentUserName}, your identity is discovered.
        </h2>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-light tracking-tight mb-4 text-white w-full leading-tight">
          <span className="font-medium text-white">{data.title}</span>
        </h1>

        {emailDispatched && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-xs text-blue-300 font-mono tracking-widest uppercase mt-4 mb-2 animate-pulse"
          >
            A copy of your identity has been dispatched to your inbox.
          </motion.p>
        )}

        <motion.img
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          src={data.image}
          alt={data.title}
          className="w-48 sm:w-64 h-auto mx-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] my-8 object-contain"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />

        <p className="text-[#aaa] max-w-lg leading-relaxed mb-16 font-light text-sm md:text-base px-4">
          {data.description}
        </p>

        <button
          onClick={handleRetake}
          className="px-6 py-4 sm:px-8 border border-white/20 text-white text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-500 focus:outline-none mb-16 flex-shrink-0 w-full sm:w-auto"
        >
          Retake Journey
        </button>

        {/* Signature */}
        <div className="mt-auto w-full pt-8 flex justify-center">
          <p className="text-[#444] text-[10px] sm:text-xs tracking-[0.3em] uppercase font-mono border-t border-[#1a1a1a] w-full max-w-xs sm:max-w-md pt-8">
            Nanyi Namaskaram — Hashim
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const QuizSkeleton = ({ currentUserName, userEmail }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState({ Alex: 0, Sarah: 0, Jordan: 0, Taylor: 0 });
  const [isFinished, setIsFinished] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    if (currentQuestionIndex < questions.length) {
      setCurrentOptions(shuffleOptions(questions[currentQuestionIndex].options));
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const calculateResult = () => {
    let maxScore = -1;
    let winner = 'Alex';

    const personas = Object.keys(scores);
    personas.forEach((persona) => {
      if (scores[persona] > maxScore) {
        maxScore = scores[persona];
        winner = persona;
      } else if (scores[persona] === maxScore) {
        if (persona === 'Jordan' || winner === 'Jordan') {
          winner = 'Jordan';
        }
      }
    });

    return winner;
  };

  const handleOptionClick = (persona) => {
    if (isFinished || isCalculating || currentQuestionIndex >= questions.length) return;

    if (!['Alex', 'Sarah', 'Jordan', 'Taylor'].includes(persona)) return;

    setScores((prevScores) => {
      const newScores = { ...prevScores, [persona]: prevScores[persona] + 1 };
      console.log(`[Persona Selected] | Current Scores:`, newScores);
      return newScores;
    });

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsCalculating(true);
    }
  };

  useEffect(() => {
    let timer;
    if (isCalculating) {
      const winner = calculateResult();
      sendResultEmail(currentUserName, userEmail, winner);

      timer = setTimeout(() => {
        setIsCalculating(false);
        setIsFinished(true);
      }, 3500);
    }
    return () => clearTimeout(timer);
  }, [isCalculating, currentUserName, userEmail]);

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setScores({ Alex: 0, Sarah: 0, Jordan: 0, Taylor: 0 });
    setIsFinished(false);
    setIsCalculating(false);
  };

  const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;

  if (currentOptions.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center p-6 font-sans antialiased overflow-y-auto w-full">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
          body { font-family: 'Inter', sans-serif; background-color: #050505; color: white; margin: 0; }
        `}
      </style>

      <div className="w-full max-w-md sm:max-w-2xl md:max-w-4xl mx-auto flex flex-col min-h-full">
        {(!isFinished && !isCalculating && !showIntro) && (
          <div className="w-full h-1 bg-[#1a1a1a] absolute top-0 left-0">
            <motion.div
              className="h-full bg-white transition-all duration-500 ease-out"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}

        {/* Navigation & Utilities */}
        <div className="flex justify-between items-center mb-8 md:mb-12 w-full pt-6 border-b border-[#1a1a1a] pb-6">
          <div className="text-xs uppercase tracking-[0.3em] text-[#666] font-semibold">
            Endu'vert
          </div>
          <button
            onClick={handleReset}
            className="text-xs uppercase tracking-[0.2em] text-[#666] hover:text-white transition-colors duration-300 focus:outline-none"
            aria-label="Reset Quiz"
          >
            Reset
          </button>
        </div>

        <AnimatePresence mode="wait">
          {showIntro ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.8 } }}
              className="flex-grow flex items-center justify-center text-center -mt-20"
            >
              <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight leading-relaxed max-w-2xl px-6">
                Okay <span className="font-medium">{currentUserName || 'Traveler'}</span>, the car is packed.
                <br /><span className="text-[#888]">Let's find your frequency.</span>
              </h2>
            </motion.div>
          ) : isCalculating ? (
            <LoadingScreen key="loadingScreen" />
          ) : !isFinished ? (
            <motion.div
              key={`question-${currentQuestionIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.4 } }}
              className="w-full flex-grow flex flex-col items-center"
            >
              <div className="text-xs text-[#555] mb-8 md:mb-12 tracking-[0.3em] font-mono">
                QUESTION {String(currentQuestionIndex + 1).padStart(2, '0')} / {questions.length}
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-white text-center mb-12 md:mb-16 leading-relaxed md:leading-snug max-w-3xl">
                {questions[currentQuestionIndex]?.text}
              </h2>

              {/* 2x2 Grid Desktop, Vertical List Mobile */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12">
                {currentOptions.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOptionClick(option.persona)}
                    className="group relative flex flex-col items-center justify-center p-6 md:p-8 min-h-[140px] border border-white/20 bg-[#0a0a0a] hover:bg-white/5 hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] active:border-white transition-all duration-500 text-center focus:outline-none overflow-hidden"
                    aria-label={`Select option: ${option.text}`}
                  >
                    {/* Subtle radio circle indicator that pulses on hover */}
                    <div className="opacity-0 group-hover:opacity-100 absolute top-4 md:top-5 scale-0 group-hover:scale-100 transition-all duration-500 ease-out flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse"></div>
                    </div>

                    <div className="text-base md:text-lg text-[#888] group-hover:text-[#eee] transition-colors duration-500 font-light leading-relaxed font-sans w-full mt-2">
                      {option.text}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <ResultPage
              key="resultPage"
              persona={calculateResult()}
              currentUserName={currentUserName}
              userEmail={userEmail}
              onReset={handleReset}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuizSkeleton;
