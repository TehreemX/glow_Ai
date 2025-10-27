import { useState, useEffect, useRef } from 'react';
import './App.css';
import { SKINCARE_DATA } from './data/skincare_dataset';
import { findBestMatch, generateGenericAdvice } from './utils/ragMatcher';

function App() {
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState('age');
  const [profile, setProfile] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const messagesEnd = useRef(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (showChatbot && !hasInitialized.current) {
      hasInitialized.current = true;
      setTimeout(() => {
        addMessage('bot', "Hello! 👋 I'm GlowAI, your personal skincare assistant.\n\nI'll help you find the perfect skincare routine.\n\nLet's start! What's your age?");
      }, 500);
    }
  }, [showChatbot]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (type, text) => {
    setIsTyping(false);
    setMessages(prev => [...prev, { type, text }]);
  };

  const showTyping = () => {
    setIsTyping(true);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    addMessage('user', input);
    showTyping();
    setTimeout(() => processInput(input), 800);
    setInput('');
  };

  const processInput = (value) => {
    const val = value.toLowerCase().trim();

    if (step === 'age') {
      const age = parseInt(value);
      if (age >= 10 && age <= 100) {
        setProfile(prev => ({ ...prev, age }));
        setStep('gender');
        addMessage('bot', "Great! What's your gender? (male/female)");
      } else {
        addMessage('bot', "Please enter a valid age between 10 and 100");
      }
    }
    else if (step === 'gender') {
      if (val === 'male' || val === 'female') {
        setProfile(prev => ({ ...prev, gender: val }));
        setStep('skintype');
        addMessage('bot', "What's your skin type?\n\n• Oily\n• Dry\n• Normal\n• Combination\n• Sensitive");
      } else {
        addMessage('bot', "Please type 'male' or 'female'");
      }
    }
    else if (step === 'skintype') {
      const types = ['oily', 'dry', 'normal', 'combination', 'sensitive'];
      if (types.includes(val)) {
        setProfile(prev => ({ ...prev, skinType: val }));
        setStep('concern');
        addMessage('bot', "What's your main skin concern?\n\n• Acne\n• Dryness\n• Blackheads\n• Wrinkles\n• Dark circles\n• Redness\n• Large pores\n• Hyperpigmentation");
      } else {
        addMessage('bot', "Please choose from: oily, dry, normal, combination, or sensitive");
      }
    }
    else if (step === 'concern') {
      const concerns = ['acne', 'dryness', 'blackheads', 'wrinkles', 'darkcircles', 'redness', 'largepores', 'hyperpigmentation'];
      const matched = concerns.find(c => val.replace(/\s/g, '').includes(c));
      
      if (matched) {
        const finalProfile = { ...profile, concern: matched };
        setProfile(finalProfile);
        setStep('done');
        
        addMessage('bot', "🔍 Analyzing your profile...\n⚡ Running RAG matching...");
        
        setTimeout(() => {
          showTyping();
          setTimeout(() => {
            const bestMatch = findBestMatch(finalProfile, SKINCARE_DATA);
            
            let response = `✨ RAG Analysis Complete!\n\n📋 Your Profile:\n• Age: ${finalProfile.age}\n• Gender: ${finalProfile.gender}\n• Skin Type: ${finalProfile.skinType}\n• Concern: ${matched}\n\n`;
            
            if (bestMatch) {
              response += `🎯 Match Found!\n📊 Entry #${bestMatch.id}\n\n💡 Recommendations:\n${bestMatch.chatbot_response}\n\n`;
            } else {
              response += `⚠️ No exact match\n${generateGenericAdvice(finalProfile)}\n\n`;
            }
            
            response += `🥗 Tips:\n• 8-10 glasses water daily\n• 7-8 hours sleep\n• SPF 30+ daily\n• Healthy diet\n\nType 'restart' for new consultation!`;
            
            addMessage('bot', response);
          }, 1500);
        }, 1000);
      }
    }
    else if (step === 'done') {
      if (val.includes('restart')) {
        setProfile({});
        setStep('age');
        setMessages([]);
        hasInitialized.current = false;
        setTimeout(() => {
          hasInitialized.current = true;
          addMessage('bot', "Let's start fresh! What's your age?");
        }, 300);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const quickReply = (text) => {
    setInput(text);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">✨ GlowAI</div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="bg-shape shape1"></div>
        <div className="bg-shape shape2"></div>
        <div className="bg-shape shape3"></div>
        
        <div className="hero-content">
          <div className="hero-text">
            <h1>Your <span className="highlight">AI-Powered</span> Skincare Journey Starts Here</h1>
            <p>Get personalized skincare recommendations powered by advanced RAG technology. Chat with our AI assistant and discover the perfect routine for your skin.</p>
            <div className="cta-buttons">
              <button className="btn btn-primary" onClick={() => setShowChatbot(true)}>Start Consultation</button>
              <a href="#features" className="btn btn-secondary">Learn More</a>
            </div>
          </div>
          
          <div className="hero-image">
            <div className="floating-card">
              <div className="card-icon">🧠</div>
              <h3 className="card-title">RAG Technology</h3>
              <p className="card-desc">Advanced Retrieval-Augmented Generation for accurate, personalized skincare advice based on 100+ expert recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <h2 className="section-title">Why Choose GlowAI?</h2>
        <p className="section-subtitle">Intelligent, personalized, and always improving</p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3 className="feature-title">AI-Powered Analysis</h3>
            <p className="feature-desc">Advanced algorithms analyze your skin profile to provide tailored recommendations.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">100+ Database Entries</h3>
            <p className="feature-desc">Comprehensive skincare knowledge base covering all skin types and concerns.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">Instant Results</h3>
            <p className="feature-desc">Get personalized recommendations in seconds with our smart matching system.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3 className="feature-title">Precision Matching</h3>
            <p className="feature-desc">Weighted scoring algorithm ensures the most accurate recommendations.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3 className="feature-title">Privacy First</h3>
            <p className="feature-desc">Your data stays private. No storage, no tracking, complete confidentiality.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3 className="feature-title">Expert Advice</h3>
            <p className="feature-desc">Recommendations based on dermatologist-approved skincare practices.</p>
          </div>
        </div>
      </section>

      {/* Chatbot Float Button */}
      <div className={`chatbot-float ${showChatbot ? 'active' : ''}`} onClick={() => setShowChatbot(!showChatbot)}>
        {showChatbot ? '×' : '💬'}
      </div>

      {/* Chatbot Popup */}
      {showChatbot && (
        <div className="chatbot-popup active">
          <div className="chatbot-header">
            <h3>🤖 GlowAI Assistant</h3>
            <button className="close-btn" onClick={() => setShowChatbot(false)}>×</button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.type}`}>
                <div className="avatar">{msg.type === 'bot' ? '🤖' : '👤'}</div>
                <div className="bubble">{msg.text}</div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="avatar">🤖</div>
                <div className="bubble typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEnd} />
          </div>

          {step === 'gender' && (
            <div className="quick-buttons">
              <button onClick={() => quickReply('male')}>Male</button>
              <button onClick={() => quickReply('female')}>Female</button>
            </div>
          )}

          {step === 'skintype' && (
            <div className="quick-buttons">
              {['Oily', 'Dry', 'Normal', 'Combination', 'Sensitive'].map(type => (
                <button key={type} onClick={() => quickReply(type)}>{type}</button>
              ))}
            </div>
          )}

          <div className="input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isTyping}
            />
            <button onClick={handleSend} disabled={isTyping}>
              {isTyping ? '⏳' : '➤'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;