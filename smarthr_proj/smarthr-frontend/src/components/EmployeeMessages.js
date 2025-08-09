import React, { useEffect, useState, useRef } from 'react';

export default function EmployeeMessages() {
  const employee = JSON.parse(localStorage.getItem('employee')); // employee info
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages between employee and admin
  useEffect(() => {
    if (!employee) return;

    fetch(`http://localhost/smarthr_proj/get_messages.php?employee_id=${employee.id}&admin_id=1`) // Assuming single admin with ID 1
      .then(res => res.json())
      .then(data => {
        if (data.success) setMessages(data.messages);
      })
      .catch(err => console.error('Error fetching messages:', err));
  }, [employee]);

  // Send a message from employee to admin
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const payload = {
      sender_type: 'employee',
      sender_id: employee.id,
      receiver_id: 1, // Admin ID
      receiver_type: 'admin',
      content: newMessage.trim(),
    };

    try {
      const res = await fetch('http://localhost/smarthr_proj/send_message.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, data.message]);
        setNewMessage('');
      } else {
        alert(data.message || 'Failed to send message.');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Server error. Please try again later.');
    }
  };

  if (!employee) {
    return <p>Please log in to view messages.</p>;
  }

  return (
    <>
      <div style={{ padding: 20, maxWidth: 600, margin: 'auto' }}>
        <h2>Messages with Admin</h2>

        <div
          style={{
            border: '1px solid #ccc',
            padding: 10,
            height: 300,
            overflowY: 'auto',
            backgroundColor: '#f9f9f9',
            marginBottom: 10,
          }}
        >
          {messages.length === 0 ? (
            <p>No messages yet.</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id ?? msg.timestamp} // Use id or fallback to timestamp as key
                style={{
                  textAlign: msg.sender_type === 'employee' ? 'right' : 'left',
                  marginBottom: 8,
                }}
              >
                <strong>{msg.sender_type === 'employee' ? 'You' : 'Admin'}:</strong>
                <p
                  style={{
                    display: 'inline-block',
                    padding: 10,
                    background: msg.sender_type === 'employee' ? '#007bff' : '#e0e0e0',
                    color: msg.sender_type === 'employee' ? '#fff' : '#000',
                    borderRadius: 10,
                    maxWidth: '70%',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.message ?? msg.content}
                </p>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <textarea
          placeholder="Type your message here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 10, resize: 'vertical' }}
          rows={3}
        />

        <button
          onClick={handleSend}
          disabled={!newMessage.trim()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer',
          }}
        >
          Send Message
        </button>
      </div>
    </>
  );
}
