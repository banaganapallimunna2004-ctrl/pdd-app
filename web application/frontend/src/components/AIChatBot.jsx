import React, { useEffect, useRef, useState } from 'react';
import {
  Bot,
  Clock,
  Leaf,
  Loader2,
  MapPin,
  MessageSquareText,
  Send,
  Sparkles,
  Trash2,
  UserRound,
  Mic,
} from 'lucide-react';
import aiService from '../services/aiService';
import { useTranslation } from '../i18n';

const CHAT_HISTORY_KEY = 'agroai_chat_history';

const AIChatBot = () => {
  const { t } = useTranslation();
  
  const initialMessages = [
    {
      role: 'assistant',
      text: t('chatWelcome') || 'Namaste! I am your AgroAI Agronomist. Tell me your crop variety, current weather conditions, or any disease symptoms you notice on the leaves, and I will recommend localized solutions.',
    },
  ];

  const promptSuggestions = [
    t('chatQ1') || 'My tomato leaves have dark brown spots with yellow halos. What is it?',
    t('chatQ2') || 'What is the ideal NPK fertilizer schedule for rice in flowering stage?',
    t('chatQ3') || 'How to prevent fungal blight in humid monsoon conditions?',
    t('chatQ4') || 'Recommend organic bio-pesticides for aphid infestation in corn.',
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      () => setLocation(null),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  useEffect(() => {
    const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
    if (!savedHistory) return;

    try {
      setHistory(JSON.parse(savedHistory));
    } catch (storageError) {
      console.warn('Unable to parse chat history', storageError);
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
    ].slice(0, 12);
    saveHistory(nextHistory);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(CHAT_HISTORY_KEY);
  };

  const clearConversation = () => {
    setMessages(initialMessages);
    setError(null);
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
      const response = await aiService.chat({
        message: trimmed,
        location,
        history: messages.slice(-6),
      });

      const reply = response.data?.reply || response.data?.message || 'I have analyzed your crop query. Continue monitoring soil moisture and ensure adequate ventilation between plant rows.';
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
      addHistoryEntry(trimmed, reply);
    } catch (err) {
      const fallback = 'Fungal disease risks increase with high leaf moisture. Ensure proper canopy aeration, avoid overhead sprinkler irrigation in late afternoon, and apply copper-based organic fungicides if lesions expand.';
      setMessages((prev) => [...prev, { role: 'assistant', text: fallback }]);
      addHistoryEntry(trimmed, fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      sendMessage(transcript);
    };
    recognition.start();
  };

  return (
    <div className="flex h-[720px] flex-col rounded-[2.5rem] border border-white/15 bg-white/[0.08] backdrop-blur-2xl shadow-2xl overflow-hidden select-text text-white">
      {/* Chat Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-5 bg-black/40">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-green-500 text-white shadow-lg shadow-emerald-900/40 border border-emerald-400/30">
            <Bot className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-base font-black text-white">{t('chatbotTitle')}</h2>
            <p className="text-xs font-medium text-emerald-100/70">{t('chatbotSubtitle')}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-300">
            <MapPin className="h-3.5 w-3.5" />
            {location ? t('liveFarmLocation') : t('liveFarmLocation')}
          </span>
          <button
            type="button"
            onClick={clearConversation}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-[10px] font-black uppercase text-white/80 transition hover:bg-white/[0.15] cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t('clearChat')}
          </button>
        </div>
      </div>

      {/* Quick Suggestions Strip */}
      <div className="border-b border-white/10 bg-black/30 p-3.5">
        <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-emerald-300">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          {t('suggestedQuestions')}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {promptSuggestions.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => sendMessage(prompt)}
              className="shrink-0 rounded-xl border border-white/10 bg-white/[0.06] hover:bg-emerald-500/20 hover:border-emerald-400/40 px-3.5 py-1.5 text-left text-xs font-medium text-white/90 transition cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((message, index) => {
          const isAssistant = message.role === 'assistant';
          return (
            <div key={`${message.role}-${index}`} className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
              {isAssistant && (
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-green-500 text-white shadow-md border border-emerald-400/30">
                  <Leaf className="h-4 w-4" />
                </span>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3.5 shadow-lg leading-relaxed text-xs sm:text-sm ${
                  isAssistant
                    ? 'border border-white/15 bg-black/60 text-white backdrop-blur-xl'
                    : 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-emerald-950/60 border border-emerald-400/40'
                }`}
              >
                <div className={`mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${isAssistant ? 'text-emerald-300' : 'text-white/80'}`}>
                  {isAssistant ? <Bot className="h-3 w-3" /> : <UserRound className="h-3 w-3" />}
                  {isAssistant ? t('chatbotTitle') : t('farmerName')}
                </div>
                <p className="whitespace-pre-wrap font-medium">{message.text}</p>
              </div>

              {!isAssistant && (
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/20 border border-white/30 text-white shadow-md">
                  <UserRound className="h-4 w-4" />
                </span>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 text-xs font-semibold text-emerald-300 w-fit">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
            {t('typingAssistant')}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="border-t border-rose-500/30 bg-rose-950/80 px-5 py-2.5 text-xs font-semibold text-rose-200">
          {error}
        </div>
      )}

      {/* Input Box Form */}
      <form onSubmit={handleSend} className="border-t border-white/10 bg-black/50 p-4">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder={t('chatbotPlaceholder')}
            className="flex-1 rounded-2xl border border-white/15 bg-white/[0.08] px-4 py-3 text-xs sm:text-sm text-white placeholder-white/40 outline-none focus:border-emerald-400 transition resize-none"
          />
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={startVoiceInput}
              className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-center ${
                isListening
                  ? 'bg-rose-500/30 border-rose-400 text-rose-300 animate-pulse'
                  : 'bg-white/[0.08] border-white/15 text-white/80 hover:bg-white/[0.15]'
              }`}
              title={t('voiceInput')}
            >
              <Mic className="h-4 w-4" />
            </button>

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 border border-emerald-400/40 text-white font-bold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-950/60 cursor-pointer flex items-center justify-center"
              title={t('sendChat')}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
        <p className="mt-2 text-[10px] text-white/50">{t('secureProcessingDesc')}</p>
      </form>
    </div>
  );
};

export default AIChatBot;
