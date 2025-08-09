import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FileUploader from './FileUploader';

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '',
    age: '',
    dob: '',
    address: '',
    email: '',
    phone_number: '',
    profile_pic: '',
    police_check_report: '',
    nic_copy: '',
    cv: '',
    hourly_rate: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`http://localhost/smarthr_proj/employee_edit.php?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setForm(data.employee);
        } else {
          setMessage('Employee not found');
        }
      })
      .catch(() => setMessage('Error fetching employee data'));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Update file URL in form state when file upload completes
  const handleFileUpload = (fieldName) => (url) => {
    setForm(prev => ({ ...prev, [fieldName]: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost/smarthr_proj/employee_update.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...form }),
    });

    const data = await res.json();
    if (data.success) {
      alert('Employee updated ✅');
      navigate('/dashboard/employees');
    } else {
      setMessage(data.message || 'Update failed');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Employee</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        {/* Render all fields except id, created_at, password_hash */}
        {Object.entries(form).map(([key, value]) => {
          if (['id', 'created_at', 'password_hash'].includes(key)) return null;

          // For file fields, show FileUploader instead of text input
          if (['profile_pic', 'police_check_report', 'nic_copy', 'cv'].includes(key)) {
            return (
              <div key={key}>
                <label>{key.replace(/_/g, ' ')}</label><br />
                <FileUploader
                  label={`Upload ${key.replace(/_/g, ' ')}`}
                  onUpload={handleFileUpload(key)}
                />
                {value && (
                  <p>
                    Current file: <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>
                  </p>
                )}
              </div>
            );
          }

          // For other fields, normal text input
          return (
            <div key={key}>
              <label>{key.replace(/_/g, ' ')}</label><br />
              <input
                type={key === 'hourly_rate' ? 'number' : 'text'}
                step={key === 'hourly_rate' ? '0.01' : undefined}
                name={key}
                value={value}
                onChange={handleChange}
                style={{ width: '100%', marginBottom: 12, padding: 8 }}
              />
            </div>
          );
        })}
        <button type="submit" style={{ padding: 10 }}>Update</button>
      </form>
    </div>
  );
}
