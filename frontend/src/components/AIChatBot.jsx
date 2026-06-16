import { useEffect, useRef, useState } from 'react';
import aiService from '../services/aiService';
import { PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/solid';

const initialMessages = [
  {
    role: 'assistant',
    text: 'Hello, I am your Agro AI assistant. Ask me about crop disease prediction, fertilizer recommendations, live shop locations, or weather-smart farming.',
  },
];

const CHAT_HISTORY_KEY = 'agroai_chat_history';

const promptSuggestions = [
  'Recommend fertilizer for tomato during rainy season.',
  'How can I prevent leaf blight in wheat crops?',
  'Find nearby fertilizer shops for my location.',
  'What should I do if my potato leaves are yellowing?',
];

const AIChatBot = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      () => {
        setLocation(null);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  useEffect(() => {
    const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.warn('Unable to parse chat history', error);
      }
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const saveHistory = (nextHistory) => {
    setHistory(nextHistory);
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(nextHistory));
  };

  const addHistoryEntry = (question, answer) => {
    const nextHistory = [
      { question, answer, createdAt: new Date().toISOString() },
      ...history,
    ].slice(0, 20);
    saveHistory(nextHistory);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(CHAT_HISTORY_KEY);
  };

  const sendMessage = async (messageText) => {
    const trimmed = messageText?.trim();
    if (!trimmed || loading) return;

    const userMessage = { role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await aiService.chat({ message: trimmed, location });
      const answer = response.data.answer || 'I am unable to provide a suggestion at the moment.';
      setMessages((prev) => [...prev, { role: 'assistant', text: answer }]);
      addHistoryEntry(trimmed, answer);
    } catch (err) {
      setError(err.response?.data?.message || 'Chatbot service is unavailable right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (event) => {
    event.preventDefault();
    await sendMessage(input);
  };

  const handleSuggestedPrompt = async (prompt) => {
    setInput(prompt);
    await sendMessage(prompt);
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-[2.5rem] border border-white/10 bg-slate-950/70 p-6 shadow-glass">
      <div className="space-y-3 rounded-[2rem] border border-white/10 bg-slate-900/80 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/90">AI assistant</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Ask anything about crops, disease, fertilizer and farm location.</h1>
          </div>
          <span className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300">{location ? 'Live location enabled' : 'Location disabled'}</span>
        </div>
        <p className="text-slate-400">Use natural language to get fertilizer suggestions, disease treatment steps, or nearby shop recommendations.</p>

        <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/90 p-4">
          <div className="flex items-center gap-2 text-cyan-200">
            <SparklesIcon className="h-4 w-4" />
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">Smart capabilities</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {['Disease triage', 'Fertilizer plan', 'Weather-smart tips', 'Supplier lookup'].map((chip) => (
              <span key={chip} className="rounded-full border border-cyan-400/20 bg-cyan-400/8 px-3 py-1.5 text-xs text-cyan-100">{chip}</span>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-400">The assistant blends live location context with expert agronomy guidance for fast, practical decisions.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {promptSuggestions.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSuggestedPrompt(prompt)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-300 hover:bg-white/10"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`rounded-3xl p-5 ${message.role === 'assistant' ? 'bg-slate-900/80 text-slate-200' : 'bg-cyan-500/10 text-cyan-100'}`}>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{message.role === 'assistant' ? 'Agro AI' : 'You'}</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{message.text}</p>
          </div>
        ))}
        {loading && (
          <div className="animate-pulse rounded-3xl bg-slate-900/80 p-5 text-sm text-slate-400">Generating insight...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 md:flex-row md:items-center">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about crop disease, fertilizer, or local shops..."
          className="min-h-[56px] flex-1 rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-4 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-3xl bg-cyan-400 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <PaperAirplaneIcon className="mr-2 h-5 w-5" />
          Send
        </button>
      </form>

      {error && <p className="rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-200">{error}</p>}

      <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Chat history</p>
            <p className="text-slate-400">Recent prompts and responses are stored locally for fast reference.</p>
          </div>
          <button type="button" onClick={clearHistory} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-300 transition hover:bg-white/10">
            Clear history
          </button>
        </div>
        {history.length ? (
          <div className="space-y-4">
            {history.map((entry, index) => (
              <div key={`${entry.createdAt}-${index}`} className="rounded-3xl bg-slate-950/80 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{new Date(entry.createdAt).toLocaleString()}</p>
                <p className="mt-2 text-sm text-cyan-200">Q: {entry.question}</p>
                <p className="mt-2 text-sm text-slate-300">A: {entry.answer}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">No history yet. Ask a question to populate past chats.</p>
        )}
      </div>
    </div>
  );
};

export default AIChatBot;