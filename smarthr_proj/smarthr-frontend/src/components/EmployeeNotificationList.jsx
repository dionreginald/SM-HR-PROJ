import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function EmployeeNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState('');

  // Assuming employee info (with id) is stored in localStorage as JSON string
  const employee = JSON.parse(localStorage.getItem('employee'));

  useEffect(() => {
    if (!employee?.id) {
      setMessage('Employee not logged in');
      return;
    }

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`http://localhost/smarthr_proj/get_notifications.php?employee_id=${employee.id}`);
        if (res.data.status === 'success') {
          setNotifications(res.data.data);
          setMessage('');
        } else {
          setMessage('Failed to load notifications');
        }
      } catch (error) {
        setMessage('Error loading notifications');
      }
    };

    fetchNotifications();
  }, [employee]);

  useEffect(() => {
  if (!employee?.id) {
    setMessage('Employee not logged in');
    return;
  }

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`http://localhost/smarthr_proj/get_notifications.php?employee_id=${employee.id}`);
      if (res.data.status === 'success') {
        setNotifications(res.data.data);
        setMessage('');
        // Immediately mark as read after loading
        await axios.post(`http://localhost/smarthr_proj/mark_all_notifications_read.php`, {
          employee_id: employee.id
        });
      } else {
        setMessage('Failed to load notifications');
      }
    } catch (error) {
      setMessage('Error loading notifications');
    }
  };

  fetchNotifications();
}, [employee]);

  return (
    <div style={{ maxWidth: 600, margin: '20px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Your Notifications</h2>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      {notifications.length === 0 && !message && <p>No notifications to show.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {notifications.map(n => (
          <li key={n.id} style={{
            backgroundColor: n.is_read ? '#f0f0f0' : '#dff0d8',
            padding: 10,
            marginBottom: 10,
            borderRadius: 4,
          }}>
            <strong>{n.title}</strong><br />
            <span>{n.message}</span><br />
            <small>{new Date(n.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
