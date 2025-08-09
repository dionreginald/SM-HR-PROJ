import React, { useState, useEffect } from 'react';
import DashboardNavbar from './DashboardNavbar';

export default function Profile() {
  const adminData = JSON.parse(localStorage.getItem('admin'));

  // --- Profile Info states ---
  const [currentInfo, setCurrentInfo] = useState({
    username: '',
    full_name: '',
    position: '',
    email: '',
    phone: '',
  });

  const [form, setForm] = useState({
    full_name: '',
    position: '',
    email: '',
    phone: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // --- Change Password states ---
  const [passForm, setPassForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [passMessage, setPassMessage] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    if (!adminData?.id) return;

    fetch(`http://localhost/smarthr_proj/admin_get_profile.php?id=${adminData.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const admin = data.admin;
          setCurrentInfo({
            username: admin.username || '',
            full_name: admin.full_name || '',
            position: admin.position || '',
            email: admin.email || '',
            phone: admin.phone || '',
          });
        } else {
          setMessage('Failed to fetch admin info');
        }
        setLoading(false);
      })
      .catch(() => {
        setMessage('Error fetching admin info');
        setLoading(false);
      });
  }, [adminData]);

  // Profile form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Updating...');

    try {
      const res = await fetch('http://localhost/smarthr_proj/admin_update_profile.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: adminData.id, ...form }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Profile updated successfully ✅');

        setCurrentInfo(prev => ({
          ...prev,
          full_name: form.full_name.trim() !== '' ? form.full_name : prev.full_name,
          position: form.position.trim() !== '' ? form.position : prev.position,
          email: form.email.trim() !== '' ? form.email : prev.email,
          phone: form.phone.trim() !== '' ? form.phone : prev.phone,
        }));

        setForm({
          full_name: '',
          position: '',
          email: '',
          phone: '',
        });
      } else {
        setMessage('Failed to update ❌');
      }
    } catch {
      setMessage('Error updating profile ❌');
    }
  };

  // Password change handlers
  const handlePassChange = (e) => {
    const { name, value } = e.target;
    setPassForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePassSubmit = async (e) => {
    e.preventDefault();

    if (passForm.new_password !== passForm.confirm_password) {
      setPassMessage('New passwords do not match');
      return;
    }

    setPassLoading(true);
    setPassMessage('');

    try {
      const res = await fetch('http://localhost/smarthr_proj/admin_change_password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: adminData.id,
          current_password: passForm.current_password,
          new_password: passForm.new_password,
        }),
      });

      const data = await res.json();
      setPassMessage(data.message || 'Password update response received');
    } catch {
      setPassMessage('Error updating password');
    }

    setPassLoading(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <DashboardNavbar />
      <div style={{ display: 'flex', gap: 30, padding: 30 }}>
        {/* Left panel: current info (read-only) */}
        <div style={{ flex: 1, borderRight: '1px solid #ddd', paddingRight: 20 }}>
          <h3>Current Profile Info</h3>
          <p><strong>Username:</strong> {currentInfo.username}</p>
          <p><strong>Full Name:</strong> {currentInfo.full_name}</p>
          <p><strong>Position:</strong> {currentInfo.position}</p>
          <p><strong>Email:</strong> {currentInfo.email}</p>
          <p><strong>Phone:</strong> {currentInfo.phone}</p>
        </div>

        {/* Right panel: forms */}
        <div style={{ flex: 1 }}>
          <h3>Update Info</h3>
          {message && (
            <p style={{ color: message.includes('successfully') ? 'green' : 'red' }}>
              {message}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <label>Full Name</label><br />
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter full name"
              autoComplete="off"
            />

            <label>Position</label><br />
            <input
              name="position"
              value={form.position}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter position"
              autoComplete="off"
            />

            <label>Email</label><br />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter email"
              autoComplete="off"
            />

            <label>Phone</label><br />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter phone number"
              autoComplete="off"
            />

            <button type="submit" style={buttonStyle}>Update</button>
          </form>

          <hr style={{ margin: '40px 0' }} />

          <h3>Change Password</h3>
          {passMessage && (
            <p style={{ color: passMessage.toLowerCase().includes('success') ? 'green' : 'red' }}>
              {passMessage}
            </p>
          )}
          <form onSubmit={handlePassSubmit}>
            <label>Current Password</label><br />
            <input
              type="password"
              name="current_password"
              value={passForm.current_password}
              onChange={handlePassChange}
              required
              style={inputStyle}
            />

            <label>New Password</label><br />
            <input
              type="password"
              name="new_password"
              value={passForm.new_password}
              onChange={handlePassChange}
              required
              style={inputStyle}
            />

            <label>Confirm New Password</label><br />
            <input
              type="password"
              name="confirm_password"
              value={passForm.confirm_password}
              onChange={handlePassChange}
              required
              style={inputStyle}
            />

            <button type="submit" disabled={passLoading} style={buttonStyle}>
              {passLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

// Styles
const inputStyle = {
  width: '100%',
  padding: 8,
  marginBottom: 10,
  borderRadius: 5,
  border: '1px solid #ccc',
  fontSize: 16,
};

const buttonStyle = {
  width: '100%',
  padding: 10,
  backgroundColor: '#007bff',
  color: 'white',
  fontWeight: 'bold',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
};
