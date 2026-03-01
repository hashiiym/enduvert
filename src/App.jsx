import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signInWithPopup, signInAnonymously, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import QuizSkeleton from './Quiz';
import BlurText from './BlurText';
import ScrollReveal from './ScrollReveal';

const Hero = ({ onBegin, user, currentUserName, setCurrentUserName }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      setErrorMsg('');
      const result = await signInWithPopup(auth, googleProvider);
      setCurrentUserName(result.user.displayName || 'Traveler');
    } catch (error) {
      setErrorMsg("Google auth failed. Please try again.");
      console.error("Authentication failed:", error);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      let result;
      if (isRegistering) {
        result = await createUserWithEmailAndPassword(auth, email, password);
        setCurrentUserName(name || email.split('@')[0]);
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
        setCurrentUserName(result.user.displayName || name || email.split('@')[0]);
      }
    } catch (error) {
      setErrorMsg(error.message.replace('Firebase:', '').trim());
      console.error("Email auth failed:", error);
    }
  };

  const handleGuestSignIn = async () => {
    try {
      setErrorMsg('');
      const result = await signInAnonymously(auth);
      setCurrentUserName('Guest User');
    } catch (error) {
      setErrorMsg("Guest sign-in failed.");
      console.error("Anonymous auth failed:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setCurrentUserName('');
    } catch (error) {
      console.error("Sign-out failed", error);
    }
  };

  return (
    <motion.div
      key="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white font-sans antialiased p-6"
    >
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <BlurText
            text="Endu'vert"
            delay={100}
            animateBy="letters"
            direction="top"
            className="text-4xl md:text-5xl font-light tracking-tight text-white justify-center"
          />
          <p className="text-[#888] text-sm md:text-base tracking-[0.1em] uppercase font-mono">
            Discover your travel persona
          </p>
        </div>

        <div className="pt-8 w-full max-w-sm mx-auto">
          {currentUserName ? (
            <div className="space-y-8 animate-in fade-in duration-700 mt-4">
              <div className="flex flex-col items-center gap-4">
                {user && user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-16 h-16 rounded-full border border-[#333] shadow-lg" />
                ) : (
                  <div className="w-16 h-16 rounded-full border border-[#333] bg-[#0a0a0a] flex items-center justify-center text-[#555] shadow-lg">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <p className="text-xl font-light text-[#ccc] flex flex-col items-center gap-2">
                  <span className="text-white font-medium">{currentUserName}</span>
                  <button
                    onClick={handleSignOut}
                    className="text-[10px] uppercase tracking-widest text-[#555] hover:text-white transition-colors duration-300 border-b border-transparent hover:border-white pb-0.5 mt-1"
                  >
                    Sign Out
                  </button>
                </p>
              </div>
              <button
                onClick={onBegin}
                className="group relative px-8 py-4 bg-white text-black text-xs font-semibold uppercase tracking-[0.2em] transition-all hover:bg-[#e0e0e0] focus:outline-none overflow-hidden w-full"
              >
                <div className="absolute inset-0 w-0 bg-black/10 transition-all duration-500 ease-out group-hover:w-full" />
                <span className="relative">Begin Your Journey, {currentUserName.split(' ')[0]}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {errorMsg && (
                <p className="text-red-400 text-xs tracking-wider uppercase mb-4 animate-pulse">
                  {errorMsg}
                </p>
              )}

              <form onSubmit={handleEmailAuth} className="flex flex-col space-y-4">
                <div className="text-left">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#666] mb-4 block font-semibold text-center">Manual Entry</span>
                  <input
                    type="text"
                    placeholder="NAME"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 text-sm tracking-wider outline-none focus:border-white transition-colors placeholder:text-[#555] font-mono mb-4"
                    required={isRegistering} /* Make it required only for registration, or let users choose to put name on login if they want */
                  />
                  <input
                    type="email"
                    placeholder="EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 text-sm tracking-wider outline-none focus:border-white transition-colors placeholder:text-[#555] font-mono mb-4"
                    required
                  />
                  <input
                    type="password"
                    placeholder="PASSWORD"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 text-sm tracking-wider outline-none focus:border-white transition-colors placeholder:text-[#555] font-mono"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-white text-black hover:bg-[#e0e0e0] transition-colors text-xs font-bold tracking-[0.2em] uppercase mt-2"
                >
                  {isRegistering ? "Create Account" : "Sign In"}
                </button>
              </form>

              <div className="flex items-center justify-center text-xs tracking-wider text-[#666] uppercase mt-2">
                <button onClick={() => setIsRegistering(!isRegistering)} className="hover:text-white transition-colors underline-offset-4 hover:underline">
                  {isRegistering ? "Already have an account?" : "Need an account? Sign up"}
                </button>
              </div>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-[#333]"></div>
                <span className="flex-shrink-0 px-4 text-[#555] text-xs uppercase tracking-widest">or</span>
                <div className="flex-grow border-t border-[#333]"></div>
              </div>

              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full px-8 py-3 border border-[#333] hover:border-white text-[#aaa] hover:text-white bg-[#0a0a0a] hover:bg-[#111] transition-all duration-300 text-xs font-semibold uppercase tracking-[0.2em] focus:outline-none flex justify-center items-center gap-3"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>
                <button
                  onClick={handleGuestSignIn}
                  className="w-full px-8 py-3 border border-transparent hover:border-[#333] text-[#666] hover:text-[#aaa] transition-all duration-300 text-xs font-semibold uppercase tracking-[0.2em] focus:outline-none"
                >
                  Continue as Guest
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Manifesto = ({ onProceed }) => {
  return (
    <motion.div
      key="manifesto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      className="bg-[#050505] text-white overflow-x-hidden w-full relative selection:bg-white/20"
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&display=swap');
          html {
            scroll-behavior: smooth;
          }
        `}
      </style>

      {/* Intro block that appears above the fold */}
      <div className="h-[100svh] flex flex-col items-center justify-center relative px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="space-y-6 max-w-4xl"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-wide text-white leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            In the noise of the week, where do you resonate?
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl italic font-light text-[#888] tracking-normal mt-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            We map your social frequency to find your rhythm.
          </p>
        </motion.div>

        <div className="absolute bottom-10 inset-x-0 mx-auto flex flex-col items-center gap-4">
          <p className="text-[#888] text-[10px] sm:text-xs uppercase tracking-[0.3em] font-mono animate-pulse">
            Scroll downwards to explore
          </p>
          <div className="w-[1px] h-24 bg-gradient-to-b from-white/30 to-transparent"></div>
        </div>
      </div>

      {/* GSAP Scroll Reveal section */}
      <div className="min-h-[150vh] flex flex-col items-center justify-start py-[20vh] px-4 sm:px-8 text-3xl sm:text-4xl md:text-6xl font-light text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        <div className="max-w-4xl w-full flex flex-col justify-center gap-10">
          <ScrollReveal
            baseOpacity={0.1}
            enableBlur={true}
            baseRotation={3}
            blurStrength={4}
            textClassName="leading-relaxed font-sans font-bold text-4xl sm:text-5xl md:text-6xl"
          >
            The world is full of noise.
            A constant hum of expectations,
            schedules, and social signals.
            but beneath the static,
            there is a frequency that is yours alone.
            Some of us resonate in the quiet.
            Some of us spark in the crowd.
            We created Endu'vert to help you find that rhythm.
            To strip away the noise......and discover where you truly belong.
          </ScrollReveal>
        </div>
      </div>

      {/* Final Instructions and Proceed Button */}
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 sm:p-8 relative">
        <div className="max-w-md w-full flex flex-col items-center gap-12 z-10 px-4">
          <div
            className="text-[#F5F5F5] text-xs sm:text-sm font-light flex flex-col gap-3 text-center w-full opacity-80"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <p>Read carefully. Choose naturally.</p>
            <p>There are no wrong answers.</p>
            <p>Only your true frequency.</p>
            <p className="text-[#F59E0B] font-medium tracking-wide">
              Authentic choices ensure an accurate reveal.
            </p>
          </div>

          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'instant' });
              onProceed();
            }}
            className="group relative px-8 py-5 border border-white/20 bg-transparent text-white text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-700 focus:outline-none w-full sm:w-auto overflow-hidden hover:border-white"
          >
            <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
            <span className="relative z-10 group-hover:text-black transition-colors duration-500">Enter the Journey</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

function App() {
  // states: 'gateway' -> 'manifesto' -> 'quiz'
  const [appState, setAppState] = useState('gateway');
  const [user, setUser] = useState(null);
  const [currentUserName, setCurrentUserName] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.displayName) {
        setCurrentUserName(currentUser.displayName);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AnimatePresence mode="wait">
      {appState === 'gateway' && (
        <Hero
          key="gateway"
          onBegin={() => setAppState('manifesto')}
          user={user}
          currentUserName={currentUserName}
          setCurrentUserName={setCurrentUserName}
        />
      )}

      {appState === 'manifesto' && (
        <Manifesto
          key="manifesto"
          onProceed={() => setAppState('quiz')}
        />
      )}

      {appState === 'quiz' && (
        <motion.div
          key="quiz"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <QuizSkeleton currentUserName={currentUserName} userEmail={user?.email} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
