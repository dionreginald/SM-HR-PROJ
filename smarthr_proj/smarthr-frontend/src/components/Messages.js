import React, { useEffect, useState, useRef } from 'react';
import DashboardNavbar from './DashboardNavbar';

export default function Messages() {
  const admin = JSON.parse(localStorage.getItem('admin'));
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Load employees with last message snippet and auto-select first employee
  useEffect(() => {
    fetch('http://localhost/smarthr_proj/employee_list_with_last_message.php')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEmployees(data.employees);
          if (data.employees.length > 0) {
            setSelectedEmployeeId(data.employees[0].id); // auto-select first employee
          }
        }
      })
      .catch(err => console.error(err));
  }, []);

  // Load messages when employee selected
  useEffect(() => {
    if (!selectedEmployeeId) {
      setMessages([]);
      return;
    }
    fetch(`http://localhost/smarthr_proj/get_messages.php?employee_id=${selectedEmployeeId}&admin_id=${admin.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setMessages(data.messages);
      })
      .catch(err => console.error(err));
  }, [selectedEmployeeId, admin.id]);

  // Scroll to bottom on messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message handler
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedEmployeeId) return;

    const payload = {
      sender_type: 'admin',
      sender_id: admin.id,
      receiver_id: selectedEmployeeId,
      receiver_type: 'employee',
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
        alert(data.message || 'Failed to send message');
      }
    } catch (err) {
      console.error(err);
      alert('Server error, please try again.');
    }
  };

  return (
    <>
      <DashboardNavbar />
      <div
        style={{
          display: 'flex',
          height: '90vh',
          maxWidth: 1000,
          margin: '20px auto',
          border: '1px solid #ccc',
          borderRadius: 8,
          overflow: 'hidden',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        {/* Employees list */}
        <div
          style={{
            width: '30%',
            borderRight: '1px solid #ddd',
            overflowY: 'auto',
            backgroundColor: '#f5f5f5',
          }}
        >
          <h3 style={{ padding: '10px', borderBottom: '1px solid #ddd', margin: 0 }}>
            Employees
          </h3>
          {employees.length === 0 && <p style={{ padding: '10px' }}>No employees found</p>}
          {employees.map(emp => (
            <div
              key={emp.id}
              onClick={() => setSelectedEmployeeId(emp.id)}
              style={{
                cursor: 'pointer',
                padding: '10px',
                backgroundColor: selectedEmployeeId === emp.id ? '#d0e7ff' : 'transparent',
                borderBottom: '1px solid #ddd',
                userSelect: 'none',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={e => {
                if (selectedEmployeeId !== emp.id) e.currentTarget.style.backgroundColor = '#e0e7ff';
              }}
              onMouseLeave={e => {
                if (selectedEmployeeId !== emp.id) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <strong>{emp.full_name}</strong>
              <p style={{ fontSize: '0.85rem', color: '#555', margin: '4px 0 0' }}>
                {emp.last_message
                  ? emp.last_message.content.slice(0, 30) +
                    (emp.last_message.content.length > 30 ? '...' : '')
                  : 'No messages yet'}
              </p>
            </div>
          ))}
        </div>

        {/* Chat area */}
        <div
          style={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
          }}
        >
          {/* Chat header */}
          <div
            style={{
              padding: '10px',
              borderBottom: '1px solid #ddd',
              fontWeight: 'bold',
              backgroundColor: '#f0f0f0',
            }}
          >
            {selectedEmployeeId
              ? employees.find(e => e.id === selectedEmployeeId)?.full_name || 'Loading...'
              : 'Select an employee to chat'}
          </div>

          {/* Messages */}
          <div
            style={{
              flexGrow: 1,
              padding: '10px',
              overflowY: 'auto',
              backgroundColor: '#e5ddd5',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {!selectedEmployeeId && (
              <p style={{ marginTop: 20, color: '#555' }}>No chat selected</p>
            )}

            {messages.map(msg => (
              <div
                key={msg.id ?? msg.timestamp}
                style={{
                  alignSelf: msg.sender_type === 'admin' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.sender_type === 'admin' ? '#dcf8c6' : 'white',
                  padding: '10px 15px',
                  borderRadius: '20px',
                  maxWidth: '60%',
                  boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
                  wordBreak: 'break-word',
                }}
              >
                {msg.content}
                <div
                  style={{
                    fontSize: '0.7rem',
                    textAlign: 'right',
                    marginTop: 5,
                    color: '#888',
                  }}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          {selectedEmployeeId && (
            <div
              style={{
                padding: 10,
                borderTop: '1px solid #ddd',
                backgroundColor: '#f9f9f9',
              }}
            >
              <textarea
                rows={2}
                placeholder="Type a message"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                style={{
                  width: '100%',
                  resize: 'none',
                  padding: 8,
                  borderRadius: 5,
                  border: '1px solid #ccc',
                  fontSize: '1rem',
                }}
                onKeyDown={e => {
                  // Optional: send message on Enter key (without Shift)
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                style={{
                  marginTop: 8,
                  padding: '10px 20px',
                  backgroundColor: '#075e54',
                  color: 'white',
                  border: 'none',
                  borderRadius: 5,
                  cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                }}
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
