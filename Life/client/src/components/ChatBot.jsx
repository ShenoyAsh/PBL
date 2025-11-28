import React, { useState } from 'react';

const rules = [
  {
    pattern: /cold|fever|flu/i,
    response: 'If you have a cold or fever, please wait until you are fully recovered before donating blood.'
  },
  {
    pattern: /document|paper|id/i,
    response: 'You will need a valid photo ID (Aadhaar, PAN, or driving license) and proof of age to donate.'
  },
  {
    pattern: /nearest|blood bank|location|where/i,
    response: 'You can find the nearest blood bank using our map feature or by searching with your pincode.'
  },
  {
    pattern: /eligible|weight|age|health/i,
    response: 'Eligibility: Age 18-65, weight above 50kg, no major health issues. Answer our eligibility questions for a quick check.'
  },
  {
    pattern: /thank|thanks|bye/i,
    response: 'You’re welcome! If you have more questions, just ask.'
  }
];

function getBotResponse(input) {
  for (let rule of rules) {
    if (rule.pattern.test(input)) {
      return rule.response;
    }
  }
  return 'Sorry, I did not understand. Please ask about donation, documents, eligibility, or blood banks.';
}

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! Ask me anything about blood donation.' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    const botMsg = { sender: 'bot', text: getBotResponse(input) };
    setMessages([...messages, userMsg, botMsg]);
    setInput('');
  };

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, maxWidth: 350, background: '#f9f9f9' }}>
      <div style={{ height: 200, overflowY: 'auto', marginBottom: 8 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.sender === 'bot' ? 'left' : 'right', margin: '4px 0' }}>
            <span style={{ fontWeight: msg.sender === 'bot' ? 'bold' : 'normal' }}>{msg.sender === 'bot' ? '🤖' : '🧑'} </span>
            {msg.text}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your question..."
          style={{ flex: 1, padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
          onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
        />
        <button onClick={sendMessage} style={{ marginLeft: 8, padding: '6px 12px', borderRadius: 4, background: '#e11d48', color: '#fff', border: 'none' }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
