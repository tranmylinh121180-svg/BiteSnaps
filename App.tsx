import React, { useState, useEffect, useRef } from 'react';
import { ViewState, User, Post, Challenge, AnalysisResult } from './types';
import * as Storage from './services/storageService';
import * as Gemini from './services/geminiService';
import { Logo, Button, Input, TabIcon } from './components/UIComponents';
import { 
  HomeIcon, 
  CameraIcon, 
  ChartBarIcon, 
  UserIcon, 
  SparklesIcon, 
  FireIcon,
  ChevronRightIcon,
  ShareIcon,
  XMarkIcon,
  QrCodeIcon
} from '@heroicons/react/24/solid';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis } from 'recharts';

// --- SUB-COMPONENTS ---

// 1. ONBOARDING
const Onboarding = ({ onComplete }: { onComplete: (user: User) => void }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    setError('');
    if (step === 2.1 && !email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    if (step === 2.2 && username.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }
    if (step === 2.3 && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    
    if (step === 2.3) {
      setStep(3); // Go to Add Friends
    } else if (step === 3) {
      // Create User
      const newUser: User = {
        username,
        email,
        streak: 1,
        totalMeals: 0,
        eatingStyle: ['The Explorer'],
        friends: []
      };
      Storage.saveUser(newUser);
      onComplete(newUser);
    } else {
      setStep(prev => typeof prev === 'number' ? prev + (prev === 1 ? 1.1 : 0.1) : prev);
       // HACK: Simple step increment logic for 2.1, 2.2, 2.3 mapped linearly
       if(step === 1) setStep(2.1);
       if(step === 2.1) setStep(2.2);
       if(step === 2.2) setStep(2.3);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center fade-in">
            <Logo />
            <p className="text-gray-500 mt-4 text-lg">Capture your meals.<br/>Understand your rhythm.</p>
            <div className="mt-12 w-full space-y-4">
              <Button onClick={handleNext}>Sign In / Create Account</Button>
            </div>
          </div>
        );
      case 2.1:
        return (
          <div className="p-8 fade-in mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">What’s your email?</h2>
            <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <Button onClick={handleNext}>Continue</Button>
          </div>
        );
      case 2.2:
        return (
          <div className="p-8 fade-in mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Pick a username</h2>
            <Input label="Username" value={username} onChange={e => setUsername(e.target.value)} placeholder="@foodie" />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <Button onClick={handleNext}>Continue</Button>
          </div>
        );
      case 2.3:
        return (
          <div className="p-8 fade-in mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Secure your account</h2>
            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <Button onClick={handleNext}>Start BiteSnaps <span className="ml-2">→</span></Button>
          </div>
        );
      case 3:
        return (
          <div className="p-8 fade-in flex flex-col h-full justify-center text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Add Friends</h2>
            <p className="text-gray-500 mb-8">Share your meals in real time. No pressure.</p>
            <div className="flex justify-center gap-6 mb-12">
               {/* Mock Social Icons */}
               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">F</div>
               <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">I</div>
               <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-600">T</div>
            </div>
            <Button variant="secondary" onClick={handleNext}>Skip for now</Button>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="h-full bg-white">{renderStep()}</div>;
};

// 2. TUTORIAL
const Tutorial = ({ onFinish }: { onFinish: () => void }) => {
  const [step, setStep] = useState(0);

  const steps = [
    { title: "Capture Instantly", text: "Tap the camera button to snap what you're eating. No calories, just memories.", target: "bottom-center" },
    { title: "Your Feed", text: "See meals from friends and your own timeline.", target: "bottom-left" },
    { title: "Understand Patterns", text: "Check stats to see your eating habits over time.", target: "bottom-right" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 fade-in">
       <div className="bg-white p-6 rounded-2xl max-w-sm w-full shadow-2xl">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 mx-auto text-emerald-600">
             <SparklesIcon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{steps[step].title}</h3>
          <p className="text-gray-500 text-center mb-6">{steps[step].text}</p>
          <Button onClick={() => {
            if (step < steps.length - 1) setStep(step + 1);
            else onFinish();
          }}>
            {step < steps.length - 1 ? "Next" : "Got it"}
          </Button>
       </div>
    </div>
  );
};

// 3. CAMERA / POST CREATION
const Camera = ({ onPost, onCancel }: { onPost: () => void, onCancel: () => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    // Auto-open file dialog on mount if no image
    if (!image) fileInputRef.current?.click();
  }, [image]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      onCancel();
    }
  };

  const handlePost = async () => {
    if (!image) return;
    setAnalyzing(true);
    
    // 1. Analyze with Gemini
    const result = await Gemini.analyzeFoodImage(image);
    setAnalysis(result);
    setAnalyzing(false);

    // 2. Save Post
    const newPost: Post = {
      id: Date.now().toString(),
      userId: Storage.getUser()?.username || 'user',
      username: Storage.getUser()?.username || 'user',
      timestamp: Date.now(),
      imageUrl: image,
      caption: caption,
      analysis: result,
      likes: 0
    };
    Storage.savePost(newPost);
    
    // 3. Complete
    onPost();
  };

  if (analyzing) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white p-8 text-center fade-in">
        <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-6"></div>
        <h3 className="text-xl font-bold text-gray-800">Understanding your meal...</h3>
        <p className="text-gray-500 mt-2">Checking patterns, not calories.</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-col">
      <input 
        type="file" 
        accept="image/*" 
        capture="environment"
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />
      
      {image ? (
        <>
          <div className="relative flex-grow bg-black">
            <img src={image} alt="Meal" className="absolute inset-0 w-full h-full object-contain" />
            <button onClick={() => { setImage(null); fileInputRef.current?.click(); }} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full">
               <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6 bg-white rounded-t-3xl -mt-6 relative z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
            <h3 className="text-lg font-bold mb-4">Add a thought</h3>
            <textarea 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's going on right now?"
              className="w-full p-4 bg-gray-50 rounded-xl mb-6 resize-none outline-none focus:ring-2 focus:ring-emerald-100"
              rows={3}
            />
            <Button onClick={handlePost}>Post Snap</Button>
          </div>
        </>
      ) : (
         <div className="h-full flex items-center justify-center">
            <p>Opening Camera...</p>
         </div>
      )}
    </div>
  );
};

// 4. FEED
const Feed = ({ onRequestCamera }: { onRequestCamera: () => void }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setPosts(Storage.getPosts());
  }, []);

  if (posts.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <CameraIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">No meals yet</h3>
        <p className="text-gray-500 mb-6">Start your mindful journey by capturing your first meal.</p>
        <Button onClick={onRequestCamera}>Snap a Meal</Button>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pb-24 no-scrollbar">
      <div className="p-4 space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-xs font-bold text-emerald-700">
                    {post.username.substring(0,2).toUpperCase()}
                 </div>
                 <div>
                    <p className="font-bold text-sm text-gray-800">@{post.username}</p>
                    <p className="text-xs text-gray-400">{new Date(post.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                 </div>
              </div>
              {/* Only show analysis badge to owner */}
              {post.analysis && (
                 <div className="bg-emerald-50 px-2 py-1 rounded-lg">
                    <span className="text-xs font-medium text-emerald-600">{post.analysis.category[0]}</span>
                 </div>
              )}
            </div>
            <div className="relative aspect-square bg-gray-100">
              <img src={post.imageUrl} alt="Meal" className="w-full h-full object-cover" />
              {post.analysis && (
                 <div className="absolute bottom-4 left-4 right-4 glass-panel p-3 rounded-xl">
                    <p className="text-sm font-semibold text-gray-800">{post.analysis.foodName}</p>
                    {post.analysis.moodSuggestion && (
                       <p className="text-xs text-gray-500 italic">Mood: {post.analysis.moodSuggestion}</p>
                    )}
                 </div>
              )}
            </div>
            <div className="p-4">
               <p className="text-gray-700 text-sm">{post.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. STATS
const Stats = () => {
  const posts = Storage.getPosts();
  
  // Calculate Categories
  const categoryCounts: Record<string, number> = {};
  posts.forEach(p => {
     p.analysis?.category.forEach(c => {
        categoryCounts[c] = (categoryCounts[c] || 0) + 1;
     });
  });

  const pieData = Object.keys(categoryCounts).map(key => ({
     name: key,
     value: categoryCounts[key]
  })).sort((a,b) => b.value - a.value).slice(0, 5);

  const COLORS = ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'];

  return (
    <div className="h-full overflow-y-auto pb-24 p-6 no-scrollbar">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Rhythm</h2>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
         <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-400 text-xs font-semibold uppercase">Total Meals</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{posts.length}</p>
         </div>
         <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
             <p className="text-gray-400 text-xs font-semibold uppercase">Diversity</p>
             <p className="text-3xl font-bold text-gray-800 mt-1">{Object.keys(categoryCounts).length}</p>
         </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
         <h3 className="font-bold text-gray-700 mb-4">Top Categories</h3>
         {pieData.length > 0 ? (
           <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={pieData}
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {pieData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
             <div className="flex flex-wrap justify-center gap-2 mt-4">
                {pieData.map((d, i) => (
                   <div key={d.name} className="flex items-center gap-1 text-xs text-gray-500">
                      <div className="w-2 h-2 rounded-full" style={{background: COLORS[i % COLORS.length]}}></div>
                      {d.name}
                   </div>
                ))}
             </div>
           </div>
         ) : (
           <p className="text-center text-gray-400 py-10">Log meals to see patterns.</p>
         )}
      </div>

      <div className="bg-emerald-50 p-6 rounded-3xl">
         <div className="flex items-start gap-4">
            <SparklesIcon className="w-6 h-6 text-emerald-600 mt-1" />
            <div>
               <h3 className="font-bold text-emerald-800">Mindful Insight</h3>
               <p className="text-emerald-700 text-sm mt-1">
                 {pieData.length > 0 && pieData[0].name === 'Comfort' 
                   ? "You've been leaning into comfort foods. Make sure to check in on how you're feeling emotionally."
                   : "Great variety! Keeping your plate diverse helps with nutritional balance naturally."}
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

// 6. CHALLENGES
const Challenges = () => {
  const challenges = Storage.getChallenges();

  return (
    <div className="h-full overflow-y-auto pb-24 p-6 no-scrollbar">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tiny Habits</h2>
      
      <div className="space-y-4">
        {challenges.map(c => (
          <div key={c.id} className={`p-5 rounded-2xl border transition-all ${c.completed ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-100 shadow-sm'}`}>
             <div className="flex justify-between items-start mb-3">
                <div className="flex gap-3">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center ${c.completed ? 'bg-emerald-200 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.completed ? <SparklesIcon className="w-5 h-5"/> : <FireIcon className="w-5 h-5"/>}
                   </div>
                   <div>
                      <h3 className={`font-bold ${c.completed ? 'text-emerald-800' : 'text-gray-800'}`}>{c.title}</h3>
                      <p className="text-xs text-gray-500">{c.type === 'SOLO' ? 'Personal' : 'Community'}</p>
                   </div>
                </div>
                {c.completed && <span className="bg-emerald-200 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-full">DONE</span>}
             </div>
             <p className="text-gray-600 text-sm mb-4">{c.description}</p>
             
             {/* Progress Bar */}
             <div className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                  style={{width: `${Math.min(100, (c.currentCount / c.targetCount) * 100)}%`}}
                ></div>
             </div>
             <div className="flex justify-between text-xs text-gray-400">
                <span>Progress</span>
                <span>{c.currentCount} / {c.targetCount}</span>
             </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center text-gray-400 text-sm">
         <p>Snap meals to auto-complete challenges.</p>
      </div>
    </div>
  );
};

// 7. FOOD WRAPPED (Daily Recap)
const FoodWrapped = ({ onClose }: { onClose: () => void }) => {
  const posts = Storage.getPosts();
  const user = Storage.getUser();
  
  // Simple "Wrapped" logic
  const topCategory = posts.length > 0 
    ? posts[0].analysis?.category[0] || "Mystery"
    : "Nothing yet";

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 text-white flex flex-col fade-in">
       {/* Progress Bars (Mock) */}
       <div className="flex gap-1 p-2 pt-4">
          <div className="h-1 bg-white/50 flex-1 rounded-full overflow-hidden">
             <div className="h-full bg-white w-full animate-[width_5s_linear]"></div>
          </div>
       </div>

       <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
             <span className="text-4xl">🌱</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Today's Vibe</h2>
          <p className="text-xl font-light text-emerald-200 mb-8">
            You are The {user?.eatingStyle[0] || "Explorer"}.
          </p>
          
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl w-full max-w-xs mb-8">
             <p className="text-sm text-gray-300 uppercase tracking-widest mb-2">Top Category</p>
             <p className="text-2xl font-bold">{topCategory}</p>
          </div>

          <p className="text-gray-400 max-w-xs">
            "Every meal is a chance to nourish your body and your mind."
          </p>
       </div>

       <div className="p-8">
          <Button variant="secondary" onClick={onClose}>Close Wrap</Button>
       </div>
    </div>
  );
};

// 8. PROFILE & SHARING
const Profile = ({ onOpenWrapped }: { onOpenWrapped: () => void }) => {
  const user = Storage.getUser();
  const currentUrl = window.location.href; // Works dynamically for Vercel/localhost
  // Generate QR Code URL using a public API (no key needed)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="h-full overflow-y-auto pb-24 p-6 no-scrollbar">
      <div className="flex flex-col items-center text-center mt-4 mb-8">
         <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-3xl font-bold mb-4">
            {user?.username.substring(0,2).toUpperCase()}
         </div>
         <h2 className="text-2xl font-bold text-gray-800">@{user?.username}</h2>
         <p className="text-gray-400 text-sm">Joined recently</p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6">
         <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <QrCodeIcon className="w-5 h-5 text-emerald-600" />
            Share Your Journey
         </h3>
         <div className="flex flex-col items-center">
             <div className="p-2 bg-white border border-gray-100 rounded-xl shadow-sm mb-4">
                <img src={qrUrl} alt="QR Code" className="w-40 h-40" />
             </div>
             <p className="text-sm text-gray-500 text-center">
                Show this code to a friend to let them try BiteSnaps instantly.
             </p>
         </div>
      </div>

      <div className="space-y-4">
         <Button onClick={onOpenWrapped} className="bg-indigo-600 text-white shadow-indigo-200">
            <SparklesIcon className="w-5 h-5" />
            Check Daily Wrap
         </Button>
         
         <Button variant="secondary" onClick={() => { Storage.clearData(); window.location.reload(); }}>
             Sign Out
         </Button>
      </div>
    </div>
  );
};


// --- MAIN APP COMPONENT ---

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.ONBOARDING);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check local storage on load
    const storedUser = Storage.getUser();
    if (storedUser) {
      setUser(storedUser);
      // Check tutorial status
      if (Storage.hasSeenTutorial()) {
        setView(ViewState.FEED);
      } else {
        setView(ViewState.TUTORIAL);
      }
    }
  }, []);

  const handleLoginSuccess = (newUser: User) => {
    setUser(newUser);
    setView(ViewState.TUTORIAL);
  };

  const handleTutorialFinish = () => {
    Storage.setSeenTutorial();
    setView(ViewState.FEED);
  };

  const Nav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-end pb-6 z-40">
       <TabIcon 
          active={view === ViewState.FEED} 
          icon={<HomeIcon className="w-6 h-6" />} 
          label="Feed" 
          onClick={() => setView(ViewState.FEED)} 
       />
       <TabIcon 
          active={view === ViewState.STATS} 
          icon={<ChartBarIcon className="w-6 h-6" />} 
          label="Stats" 
          onClick={() => setView(ViewState.STATS)} 
       />
       
       {/* Floating Action Button for Camera */}
       <div className="-mt-8">
          <button 
             onClick={() => setView(ViewState.CAMERA)}
             className="w-16 h-16 bg-emerald-600 rounded-full shadow-lg shadow-emerald-200 flex items-center justify-center text-white transform hover:scale-105 transition-transform active:scale-95"
          >
             <CameraIcon className="w-8 h-8" />
          </button>
       </div>

       <TabIcon 
          active={view === ViewState.CHALLENGES} 
          icon={<FireIcon className="w-6 h-6" />} 
          label="Habits" 
          onClick={() => setView(ViewState.CHALLENGES)} 
       />
       <TabIcon 
          active={view === ViewState.PROFILE} 
          icon={<UserIcon className="w-6 h-6" />} 
          label="Profile" 
          onClick={() => setView(ViewState.PROFILE)} 
       />
    </div>
  );

  // View Routing
  const renderView = () => {
    switch(view) {
      case ViewState.ONBOARDING:
        return <Onboarding onComplete={handleLoginSuccess} />;
      case ViewState.TUTORIAL:
        return (
          <>
             <div className="h-full bg-gray-100 flex items-center justify-center">
               <Feed onRequestCamera={() => {}} /> {/* Background blurred in tutorial */}
             </div>
             <Tutorial onFinish={handleTutorialFinish} />
          </>
        );
      case ViewState.FEED:
        return (
          <>
            <div className="bg-white sticky top-0 z-30 px-6 py-4 shadow-sm flex justify-between items-center">
               <h1 className="text-xl font-bold text-gray-800">BiteSnaps</h1>
               <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
                  {user?.username.substring(0,2).toUpperCase()}
               </div>
            </div>
            <Feed onRequestCamera={() => setView(ViewState.CAMERA)} />
            <Nav />
          </>
        );
      case ViewState.STATS:
        return (
          <>
            <Stats />
            <Nav />
          </>
        );
      case ViewState.CHALLENGES:
        return (
           <>
             <Challenges />
             <Nav />
           </>
        );
      case ViewState.CAMERA:
        return <Camera onPost={() => setView(ViewState.FEED)} onCancel={() => setView(ViewState.FEED)} />;
      case ViewState.PROFILE:
        return (
           <>
             <Profile onOpenWrapped={() => setView(ViewState.WRAPPED)} />
             <Nav />
           </>
        );
      case ViewState.WRAPPED:
        return <FoodWrapped onClose={() => setView(ViewState.PROFILE)} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto h-[100dvh] bg-white shadow-2xl overflow-hidden relative">
      {renderView()}
    </div>
  );
}