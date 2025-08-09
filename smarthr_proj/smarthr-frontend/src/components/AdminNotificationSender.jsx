import React, { useState } from 'react';
import axios from 'axios';

export default function AdminNotificationSender() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    setStatusMsg('');

    if (!title.trim() || !message.trim()) {
      setStatusMsg('Title and message are required.');
      return;
    }

    const payload = {
      title: title.trim(),
      message: message.trim(),
      employee_id: null, // Always send to ALL employees
    };

    axios
      .post('http://localhost/smarthr_proj/send_notification.php', payload)
      .then(res => {
        if (res.data.status === 'success') {
          setStatusMsg('Notification sent successfully!');
          setTitle('');
          setMessage('');
        } else {
          setStatusMsg(res.data.message || 'Failed to send notification');
        }
      })
      .catch(() => setStatusMsg('Error sending notification'));
  };

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '20px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2>Send Notification to All Employees</h2>
      {statusMsg && (
        <p
          style={{
            color: statusMsg.includes('success') ? 'green' : 'red',
            fontWeight: 'bold',
          }}
          role="alert"
        >
          {statusMsg}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="title">Title:</label>
          <br />
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="message">Message:</label>
          <br />
          <textarea
            id="message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={5}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
          }}
        >
          Send to All Employees
        </button>
      </form>
    </div>
  );
}
