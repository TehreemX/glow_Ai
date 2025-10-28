import { useState, useEffect, useRef } from 'react';

// Mock data - replace with your actual SKINCARE_DATA
const SKINCARE_DATA = [
  {
    id: 1,
    age: 25,
    gender: 'female',
    skinType: 'oily',
    concern: 'acne',
    chatbot_response: '🌟 Morning Routine:\n• Gentle foaming cleanser\n• Salicylic acid toner\n• Oil-free moisturizer\n• SPF 50 sunscreen\n\n🌙 Night Routine:\n• Double cleanse\n• Benzoyl peroxide treatment\n• Niacinamide serum\n• Light gel moisturizer'
  },
  {
    id: 2,
    age: 30,
    gender: 'female',
    skinType: 'dry',
    concern: 'wrinkles',
    chatbot_response: '🌟 Morning Routine:\n• Cream cleanser\n• Hyaluronic acid serum\n• Vitamin C serum\n• Rich moisturizer\n• SPF 50 sunscreen\n\n🌙 Night Routine:\n• Gentle cleanser\n• Retinol serum\n• Peptide cream\n• Night cream'
  }
];

function findBestMatch(profile, data) {
  let bestMatch = null;
  let highestScore = 0;

  data.forEach(entry => {
    let score = 0;
    if (entry.skinType === profile.skinType) score += 3;
    if (entry.concern === profile.concern) score += 3;
    if (entry.gender === profile.gender) score += 1;
    if (Math.abs(entry.age - profile.age) < 10) score += 2;

    if (score > highestScore) {
      highestScore = score;
      bestMatch = entry;
    }
  });

  return bestMatch;
}

function generateGenericAdvice(profile) {
  return `💡 General Skincare Routine for ${profile.skinType} skin:\n\n🌅 Morning:\n• Gentle cleanser\n• Toner\n• Serum for ${profile.concern}\n• Moisturizer\n• SPF 30+\n\n🌙 Evening:\n• Cleanser\n• Treatment\n• Night cream`;
}

function App() {
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState('initial');
  const [profile, setProfile] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const messagesEnd = useRef(null);
  const hasInitialized = useRef(false);

  const features = [
    { icon: '🤖', title: 'AI-Powered Analysis', desc: 'Advanced algorithms analyze your skin profile.' },
    { icon: '📊', title: '100+ Database Entries', desc: 'Comprehensive skincare knowledge base.' },
    { icon: '⚡', title: 'Instant Results', desc: 'Get recommendations in seconds.' },
    { icon: '🎯', title: 'Precision Matching', desc: 'Accurate scoring algorithm.' },
    { icon: '🔒', title: 'Privacy First', desc: 'No data storage or tracking.' },
    { icon: '💡', title: 'Expert Advice', desc: 'Dermatologist-approved practices.' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showChatbot && !hasInitialized.current && step === 'initial') {
      hasInitialized.current = true;
      setMessages([]);
      setTimeout(() => {
        addBotMessage("Hey there! 👋");
        setTimeout(() => {
          showTyping();
          setTimeout(() => {
            addBotMessage("I'm GlowAI, your personal skincare companion! 😊");
            setTimeout(() => {
              showTyping();
              setTimeout(() => {
                addBotMessage("I'm here to help you discover the perfect skincare routine tailored just for you! ✨");
                setTimeout(() => {
                  showTyping();
                  setTimeout(() => {
                    addBotMessage("Before we dive in, I'd love to get to know your skin better. Is that okay? 🌟");
                    setStep('greeting');
                  }, 800);
                }, 1200);
              }, 800);
            }, 1200);
          }, 800);
        }, 1000);
      }, 500);
    }
  }, [showChatbot, step]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addBotMessage = (text) => {
    setIsTyping(false);
    setMessages(prev => [...prev, { type: 'bot', text }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { type: 'user', text }]);
  };

  const showTyping = () => {
    setIsTyping(true);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    addUserMessage(input);
    showTyping();
    setTimeout(() => processInput(input), 800);
    setInput('');
  };

  const processInput = (value) => {
    const val = value.toLowerCase().trim();

    // Conversational responses at any time
    if (val.includes('hi') || val.includes('hello') || val.includes('hey')) {
      addBotMessage("Hello! 👋 So nice to hear from you again! 😊");
      if (step === 'greeting' || step === 'initial') {
        setTimeout(() => {
          showTyping();
          setTimeout(() => {
            addBotMessage("Ready to find your perfect skincare routine? Let's do this! 💪");
            setTimeout(() => {
              showTyping();
              setTimeout(() => {
                addBotMessage("First, can you tell me how old you are? Just type the number! 🎂");
                setStep('age');
              }, 800);
            }, 1000);
          }, 800);
        }, 1000);
      }
      return;
    }

    if (val.includes('thank') || val.includes('thanks')) {
      addBotMessage("Aww, you're so welcome! 💕 I'm always here to help you glow! ✨");
      return;
    }

    if (val.includes('bye') || val.includes('goodbye') || val.includes('see you')) {
      addBotMessage("Aww, leaving so soon? 🥺");
      setTimeout(() => {
        showTyping();
        setTimeout(() => {
          addBotMessage("Take care of that beautiful skin! See you soon! ✨👋");
        }, 800);
      }, 1000);
      return;
    }

    if (val.includes('help') || val === '?' || val.includes('what') && val.includes('do')) {
      addBotMessage("I'm here to help you find the perfect skincare routine! 💝");
      setTimeout(() => {
        showTyping();
        setTimeout(() => {
          addBotMessage("Just answer my questions honestly, and I'll match you with the best skincare recommendations from my database! 🎯");
        }, 800);
      }, 1000);
      return;
    }

    if (val.includes('how are you') || val.includes('how r u')) {
      addBotMessage("I'm doing great, thank you for asking! 🥰");
      setTimeout(() => {
        showTyping();
        setTimeout(() => {
          addBotMessage("I'm excited to help you with your skincare journey! Ready to get started? 🌟");
        }, 800);
      }, 1000);
      return;
    }

    // Main conversation flow
    switch (step) {
      case 'greeting':
        if (val.includes('yes') || val.includes('sure') || val.includes('ok') || val.includes('yeah') || val.includes('yep')) {
          addBotMessage("Yay! I'm so excited! 🎉");
          setTimeout(() => {
            showTyping();
            setTimeout(() => {
              addBotMessage("Let's start with something simple - how old are you? Just type the number! 🎂");
              setStep('age');
            }, 800);
          }, 1000);
        } else if (val.includes('no') || val.includes('not') || val.includes('nope')) {
          addBotMessage("Oh no worries at all! 😊");
          setTimeout(() => {
            showTyping();
            setTimeout(() => {
              addBotMessage("Take your time! Whenever you're ready, just let me know and we can start! 💕");
            }, 800);
          }, 1000);
        } else {
          addBotMessage("I didn't quite catch that! 😅");
          setTimeout(() => {
            showTyping();
            setTimeout(() => {
              addBotMessage("Can we start with some questions about your skin? Just say 'yes' or 'no'! 😊");
            }, 800);
          }, 1000);
        }
        break;

      case 'age':
        const age = parseInt(value);
        if (age >= 10 && age <= 100) {
          setProfile(prev => ({ ...prev, age }));
          addBotMessage(`${age} years young! That's awesome! 🎉`);
          setTimeout(() => {
            showTyping();
            setTimeout(() => {
              addBotMessage("You know what? Age is just a number! Every age has its own beauty! ✨");
              setTimeout(() => {
                showTyping();
                setTimeout(() => {
                  addBotMessage("Now, just so I can personalize this better - are you male or female? 🌸");
                  setStep('gender');
                }, 800);
              }, 1200);
            }, 800);
          }, 1000);
        } else if (value.match(/\d+/) && (age < 10 || age > 100)) {
          addBotMessage("Hmm, that doesn't seem quite right! 🤔");
          setTimeout(() => {
            showTyping();
            setTimeout(() => {
              addBotMessage("Could you give me your actual age? Something between 10-100! 😊");
            }, 800);
          }, 1000);
        } else {
          addBotMessage("Oops! I need a number please! 😅");
          setTimeout(() => {
            showTyping();
            setTimeout(() => {
              addBotMessage("How old are you? Just type the number like '25' or '30'! 🎂");
            }, 800);
          }, 1000);
        }
        break;

      case 'gender':
        if (val === 'male' || val === 'female' || val.includes('man') || val.includes('woman') || val.includes('boy') || val.includes('girl')) {
          const gender = val === 'male' || val.includes('man') || val.includes('boy') ? 'male' : 'female';
          setProfile(prev => ({ ...prev, gender }));
          const emoji = gender === 'male' ? '👨' : '👩';
          addBotMessage(`Got it! ${emoji}`);
          setTimeout(() => {
            showTyping();
            setTimeout(() => {
              addBotMessage("Perfect! Now let's talk about your skin! This is where it gets interesting! 🌟");
              setTimeout(() => {
                showTyping();
                setTimeout(() => {
                  addBotMessage("Everyone's skin is unique and beautiful in its own way! ✨");
                  setTimeout(() => {
                    showTyping();
                    setTimeout(() => {
                      addBotMessage("Which of these best describes your skin?\n\n• Oily (shiny, greasy feeling)\n• Dry (tight, flaky)\n• Normal (balanced, not too oily or dry)\n• Combination (oily T-zone, dry cheeks)\n• Sensitive (easily irritated or red)");
                      setStep('skintype');
                    }, 800);
                  }, 1200);
                }, 800);
              }, 1000);
            }, 800);
          }, 1000);
        } else {
          addBotMessage("I didn't quite catch that! 😅");
          setTimeout(() => {
            showTyping();
            setTimeout(() => {
              addBotMessage("Are you male or female? Just type one of those! 😊");
            }, 800);
          }, 1000);
        }
        break;

      case 'skintype':
        const skinTypes = ['oily', 'dry', 'normal', 'combination', 'sensitive'];
        const matchedType = skinTypes.find(type => val.includes(type));
        
        if (matchedType) {
          setProfile(prev => ({ ...prev, skinType: matchedType }));
          
          const responses = {
            oily: "Oily skin! I totally get it! 💧 Don't worry though, we'll find you something amazing that keeps that shine under control!",
            dry: "Dry skin needs some extra love! 💕 We're going to get you all hydrated and glowing!",
            normal: "Lucky you! Normal skin is such a blessing! 🍀 But we can still make it even better!",
            combination: "Combination skin - the best of both worlds! ⚖️ We'll balance it out perfectly!",
            sensitive: "Sensitive skin needs gentle care, and I know exactly what you need! 🌸 We'll keep it calm and happy!"
          };
          
          addBotMessage(responses[matchedType]);
          setTimeout(() => {
            showTyping();
            setTimeout(() => {
              addBotMessage("Okay, almost done! Just one more thing! 🎯");
              setTimeout(() => {
                showTyping();
                setTimeout(() => {
                  addBotMessage("What's your main skin concern? What bothers you the most? 🤔");
                  setTimeout(() => {
                    showTyping();
                    setTimeout(() => {
                      addBotMessage("Pick the one that bugs you the most:\n\n• Acne (breakouts, pimples)\n• Dryness (flaky, tight skin)\n• Blackheads (clogged pores)\n• Wrinkles (fine lines, aging)\n• Dark circles (under eyes)\n• Redness (irritation)\n• Large pores\n• Hyperpigmentation (dark spots)");
                      setStep('concern');
                    }, 800);
                  }, 1200);
                }, 800);
              }, 1000);
            }, 800);
          }, 1200);
        } else {
          addBotMessage("Hmm, I didn't quite get that! 🤔");
          setTimeout(() => {
            showTyping();
            setTimeout(() => {
              addBotMessage("Could you pick from: oily, dry, normal, combination, or sensitive? 😊");
            }, 800);
          }, 1000);
        }
        break;

      case 'concern':
        const concerns = {
          'acne': 'acne',
          'pimple': 'acne',
          'breakout': 'acne',
          'zit': 'acne',
          'dryness': 'dryness',
          'dry': 'dryness',
          'flaky': 'dryness',
          'tight': 'dryness',
          'blackhead': 'blackheads',
          'blackheads': 'blackheads',
          'clogged': 'blackheads',
          'pore': 'blackheads',
          'wrinkle': 'wrinkles',
          'wrinkles': 'wrinkles',
          'aging': 'wrinkles',
          'fine line': 'wrinkles',
          'dark circle': 'darkcircles',
          'darkcircles': 'darkcircles',
          'under eye': 'darkcircles',
          'redness': 'redness',
          'red': 'redness',
          'irritation': 'redness',
          'large pore': 'largepores',
          'largepores': 'largepores',
          'big pore': 'largepores',
          'hyperpigmentation': 'hyperpigmentation',
          'dark spot': 'hyperpigmentation',
          'pigmentation': 'hyperpigmentation',
          'uneven': 'hyperpigmentation'
        };
        
        let matchedConcern = null;
        for (const [key, value] of Object.entries(concerns)) {
          if (val.includes(key)) {
            matchedConcern = value;
            break;
          }
        }
        
        if (matchedConcern) {
          const finalProfile = { ...profile, concern: matchedConcern };
          setProfile(finalProfile);
          setStep('analyzing');
          
          const concernResponses = {
            acne: "Acne troubles! Ugh, I totally understand! 😤 But don't worry, we're going to tackle this together! 💪",
            dryness: "Dry skin is no fun at all! 😔 But guess what? We're going to bring back all that moisture and make your skin super soft! 💧",
            blackheads: "Those pesky blackheads! 😤 Time to unclog those pores and make them squeaky clean! 🎯",
            wrinkles: "Fighting aging like a pro! 👏 Let's keep that youthful, radiant glow going strong! ✨",
            darkcircles: "Dark circles making you look tired? Not on my watch! 👀 We'll brighten that up!",
            redness: "Redness and irritation? 😔 We'll calm that down and get your skin feeling happy again! 🌸",
            largepores: "Large pores? I got you! 🔬 Time to minimize them and smooth things out!",
            hyperpigmentation: "Dark spots? Say no more! 🌟 Let's even out that gorgeous skin tone!"
          };
          
          addBotMessage(concernResponses[matchedConcern]);
          
          setTimeout(() => {
            showTyping();
            setTimeout(() => {
              addBotMessage("Alright! I've got everything I need! 📋✨");
              setTimeout(() => {
                showTyping();
                setTimeout(() => {
                  addBotMessage("Give me just a moment while I search through my database of 100+ skincare recommendations to find YOUR perfect match! 🔍");
                  setTimeout(() => {
                    showTyping();
                    setTimeout(() => {
                      addBotMessage("*searching through profiles...*");
                      setTimeout(() => {
                        showTyping();
                        setTimeout(() => {
                          generateRecommendation(finalProfile);
                        }, 1200);
                      }, 1000);
                    }, 800);
                  }, 1200);
                }, 800);
              }, 1000);
            }, 800);
          }, 1200);
        } else {
          addBotMessage("Hmm, I'm not sure I understood that concern! 😅");
          setTimeout(() => {
            showTyping();
            setTimeout(() => {
              addBotMessage("Could you pick one from the list I mentioned? Like acne, dryness, wrinkles, etc.? 🤔");
            }, 800);
          }, 1000);
        }
        break;

      case 'done':
        if (val.includes('restart') || val.includes('start over') || val.includes('again') || val.includes('new')) {
          addBotMessage("Absolutely! Let's start fresh! 🔄✨");
          setTimeout(() => {
            showTyping();
            setTimeout(() => {
              addBotMessage("Starting a new consultation for you...");
              setTimeout(() => {
                setProfile({});
                setStep('initial');
                setMessages([]);
                hasInitialized.current = false;
                setShowChatbot(false);
                setTimeout(() => setShowChatbot(true), 100);
              }, 800);
            }, 800);
          }, 1000);
        } else if (val.includes('question') || val.includes('ask')) {
          addBotMessage("Of course! Ask me anything! I'm here to help! 💕");
          setTimeout(() => {
            showTyping();
            setTimeout(() => {
              addBotMessage("You can ask about the products, the routine, ingredients, or anything skincare-related! 😊");
            }, 800);
          }, 1000);
        } else {
          addBotMessage("I'm here if you need anything! 😊");
          setTimeout(() => {
            showTyping();
            setTimeout(() => {
              addBotMessage("Want another consultation? Just type 'restart'! Or ask me any skincare questions you have! 💕");
            }, 800);
          }, 1000);
        }
        break;

      default:
        addBotMessage("Hmm, I'm not sure what you mean! 🤔");
        setTimeout(() => {
          showTyping();
          setTimeout(() => {
            addBotMessage("But that's okay! Let's keep going with your skincare consultation! 😊");
          }, 800);
        }, 1000);
    }
  };

  const generateRecommendation = (finalProfile) => {
    const bestMatch = findBestMatch(finalProfile, SKINCARE_DATA);
    
    addBotMessage("🎉 Found your perfect routine!");
    
    setTimeout(() => {
      showTyping();
      setTimeout(() => {
        let response = `📋 Your Profile:\n\n`;
        response += `👤 Age: ${finalProfile.age}\n`;
        response += `${finalProfile.gender === 'male' ? '👨' : '👩'} Gender: ${finalProfile.gender}\n`;
        response += `✨ Skin: ${finalProfile.skinType}\n`;
        response += `🎯 Concern: ${finalProfile.concern}\n`;
        
        addBotMessage(response);
        
        setTimeout(() => {
          showTyping();
          setTimeout(() => {
            if (bestMatch) {
              addBotMessage(`💡 Your Routine:\n\n${bestMatch.chatbot_response}`);
            } else {
              addBotMessage(generateGenericAdvice(finalProfile));
            }
            
            setTimeout(() => {
              showTyping();
              setTimeout(() => {
                addBotMessage("🥗 Tips:\n\n💧 Drink water\n😴 Sleep well\n☀️ Use SPF 30+\n🥑 Eat healthy");
                setTimeout(() => {
                  addBotMessage("That's it! Type 'restart' for a new consultation! 😊");
                  setStep('done');
                }, 1200);
              }, 800);
            }, 1500);
          }, 800);
        }, 1000);
      }, 800);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isTyping) handleSend();
  };

  const quickReply = (text) => {
    setInput(text);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Navbar */}
      <nav style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>✨ GlowAI</div>
        <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', margin: 0, padding: 0 }}>
          <li><a href="#home" style={{ color: 'white', textDecoration: 'none' }}>Home</a></li>
          <li><a href="#features" style={{ color: 'white', textDecoration: 'none' }}>Features</a></li>
          <li><a href="#about" onClick={(e) => { e.preventDefault(); setShowAbout(true); }} style={{ color: 'white', textDecoration: 'none', cursor: 'pointer' }}>About</a></li>
          <li><a href="#contact" onClick={(e) => { e.preventDefault(); setShowContact(true); }} style={{ color: 'white', textDecoration: 'none', cursor: 'pointer' }}>Contact</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section id="home" style={{ 
        padding: '4rem 2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          Your <span style={{ color: '#ffd700' }}>AI-Powered</span> Skincare Journey
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Get personalized skincare recommendations powered by advanced RAG technology.
        </p>
        <div>
          <button 
            onClick={() => { setShowChatbot(true); setStep('initial'); hasInitialized.current = false; }}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              backgroundColor: '#ffd700',
              color: '#333',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginRight: '1rem'
            }}
          >
            Start Consultation
          </button>
          <a href="#features" style={{
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            backgroundColor: 'transparent',
            color: 'white',
            border: '2px solid white',
            borderRadius: '50px',
            textDecoration: 'none',
            display: 'inline-block'
          }}>
            Learn More
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '4rem 2rem', backgroundColor: 'white' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem', color: '#333' }}>
          Why Choose GlowAI?
        </h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '3rem' }}>
          Intelligent, personalized, and always improving
        </p>
        
        {/* Slideshow */}
        <div style={{ 
          maxWidth: '600px',
          margin: '0 auto 3rem',
          padding: '2rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{features[currentFeature].icon}</div>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: '#333' }}>
            {features[currentFeature].title}
          </h3>
          <p style={{ color: '#666' }}>{features[currentFeature].desc}</p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
            {features.map((_, idx) => (
              <span
                key={idx}
                onClick={() => setCurrentFeature(idx)}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: idx === currentFeature ? '#667eea' : '#ddd',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {features.map((feature, idx) => (
            <div key={idx} style={{
              padding: '2rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '15px',
              textAlign: 'center',
              transition: 'transform 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#333' }}>
                {feature.title}
              </h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        backgroundColor: '#2d3748',
        color: 'white',
        padding: '3rem 2rem 1rem'
      }}>
        <div style={{ 
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>GlowAI</h3>
            <p style={{ color: '#a0aec0' }}>Your AI-Powered Skincare Assistant</p>
            <p style={{ color: '#a0aec0', fontSize: '0.9rem' }}>
              Personalized recommendations using RAG technology.
            </p>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#home" style={{ color: '#a0aec0', textDecoration: 'none' }}>Home</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#features" style={{ color: '#a0aec0', textDecoration: 'none' }}>Features</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#about" onClick={(e) => { e.preventDefault(); setShowAbout(true); }} 
                   style={{ color: '#a0aec0', textDecoration: 'none', cursor: 'pointer' }}>
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" onClick={(e) => { e.preventDefault(); setShowContact(true); }} 
                   style={{ color: '#a0aec0', textDecoration: 'none', cursor: 'pointer' }}>
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Connect With Us</h4>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                 style={{ color: '#a0aec0' }}>Instagram</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                 style={{ color: '#a0aec0' }}>Facebook</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                 style={{ color: '#a0aec0' }}>Twitter</a>
            </div>
          </div>
        </div>
        
        <div style={{ 
          borderTop: '1px solid #4a5568',
          paddingTop: '1rem',
          textAlign: 'center',
          color: '#a0aec0'
        }}>
          <p>&copy; 2025 GlowAI. All rights reserved. | Powered by RAG Technology</p>
        </div>
      </footer>

      {/* About Modal */}
      {showAbout && (
        <div onClick={() => setShowAbout(false)} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '15px',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button onClick={() => setShowAbout(false)} style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              border: 'none',
              background: 'none',
              fontSize: '2rem',
              cursor: 'pointer',
              color: '#666'
            }}>×</button>
            <h2 style={{ marginBottom: '1rem', color: '#333' }}>About GlowAI</h2>
            <p style={{ marginBottom: '1rem', color: '#666' }}>
              GlowAI is an advanced AI-powered skincare consultation platform using RAG technology.
            </p>
            <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: '#333' }}>Our Mission</h3>
            <p style={{ color: '#666' }}>
              Make professional skincare advice accessible through AI technology.
            </p>
            <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: '#333' }}>Technology</h3>
            <p style={{ color: '#666' }}>
              Built with React and RAG (Retrieval-Augmented Generation) technology with 100+ skincare routines.
            </p>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContact && (
        <div onClick={() => setShowContact(false)} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '15px',
            maxWidth: '500px',
            position: 'relative'
          }}>
            <button onClick={() => setShowContact(false)} style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              border: 'none',
              background: 'none',
              fontSize: '2rem',
              cursor: 'pointer',
              color: '#666'
            }}>×</button>
            <h2 style={{ marginBottom: '1rem', color: '#333' }}>Contact Us</h2>
            <p style={{ marginBottom: '1.5rem', color: '#666' }}>
              Have questions? We'd love to hear from you!
            </p>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem', marginRight: '1rem' }}>📧</span>
                <div>
                  <strong>Email</strong>
                  <p style={{ margin: 0, color: '#666' }}>support@glowaai.com</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem', marginRight: '1rem' }}>💬</span>
                <div>
                  <strong>WhatsApp</strong>
                  <p style={{ margin: 0, color: '#666' }}>+1 (234) 567-8900</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chatbot */}
      {showChatbot && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '380px',
          height: '600px',
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '1rem',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ fontSize: '2rem' }}>🤖</div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>GlowAI Assistant</h3>
                <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>Online</span>
              </div>
            </div>
            <button 
              onClick={() => setShowChatbot(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >✕</button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            backgroundColor: '#f8f9fa'
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: msg.type === 'bot' ? 'flex-start' : 'flex-end',
                marginBottom: '1rem',
                gap: '0.5rem'
              }}>
                {msg.type === 'bot' && (
                  <div style={{ fontSize: '1.5rem' }}>🤖</div>
                )}
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '15px',
                  maxWidth: '70%',
                  backgroundColor: msg.type === 'bot' ? 'white' : '#667eea',
                  color: msg.type === 'bot' ? '#333' : 'white',
                  whiteSpace: 'pre-line',
                  fontSize: '0.9rem',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}>
                  {msg.text}
                </div>
                {msg.type === 'user' && (
                  <div style={{ fontSize: '1.5rem' }}>👤</div>
                )}
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '1.5rem' }}>🤖</div>
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '15px',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#667eea', marginRight: '4px', animation: 'bounce 1.4s infinite' }}></span>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#667eea', marginRight: '4px', animation: 'bounce 1.4s infinite 0.2s' }}></span>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#667eea', animation: 'bounce 1.4s infinite 0.4s' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          {/* Quick Replies - REMOVED */}

          {/* Input */}
          <div style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: '0.5rem'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isTyping}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                borderRadius: '25px',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '25px',
                backgroundColor: input.trim() && !isTyping ? '#667eea' : '#ccc',
                color: 'white',
                cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0);
            opacity: 0.5;
          } 
          40% { 
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default App;