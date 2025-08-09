import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function EmployeeDetails() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`http://localhost/smarthr_proj/employee_get.php?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEmployee(data.employee);
        } else {
          setError('Employee not found');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching employee');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{color:'red'}}>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Employee Details</h2>
      <Link to="/dashboard/employees">← Back to Employees List</Link>
      <div style={{ marginTop: 20 }}>
        <p><strong>Full Name:</strong> {employee.full_name}</p>
        <p><strong>Age:</strong> {employee.age}</p>
        <p><strong>DOB:</strong> {employee.dob}</p>
        <p><strong>Address:</strong> {employee.address}</p>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Phone Number:</strong> {employee.phone_number}</p>
        <p><strong>Hourly Rate:</strong> ${employee.hourly_rate}</p>
        <p><strong>Created At:</strong> {employee.created_at}</p>
        {employee.profile_pic && (
          <>
            <strong>Profile Picture:</strong><br />
            <img src={employee.profile_pic} alt="Profile" style={{ maxWidth: 150, marginTop: 10 }} />
          </>
        )}
        {/* Similarly add links or embed previews for police_check_report, nic_copy, cv if URLs */}
      </div>
    </div>
  );
}
