import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosConfig';
import './AdminDashboard.css';

function AdminDashboard({ user, onLogout }) {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: 'employee123'
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [allocatingEmployee, setAllocatingEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('manage');
  const [registrations, setRegistrations] = useState([]);
  const [registrationFilter, setRegistrationFilter] = useState(new Date().toISOString().split('T')[0]);

  const token = localStorage.getItem('token');

  // Debug token on component mount
  useEffect(() => {
    if (!token) {
      console.warn('No token found in localStorage');
    } else {
      console.log('Token found:', token.substring(0, 20) + '...');
    }
  }, [token]);

  useEffect(() => {
    fetchEmployees();
    fetchRegistrations();
  }, [registrationFilter]);

  const fetchEmployees = async () => {
    try {
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        console.warn('No token available for fetchEmployees');
        return;
      }
      const response = await axiosInstance.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        console.warn('No token available for fetchRegistrations');
        return;
      }
      const response = await axiosInstance.get(`/products/registrations/date/${registrationFilter}`);
      setRegistrations(response.data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name || !formData.email || !formData.username || !formData.password) {
      alert('Please fill in all required fields');
      return;
    }

    // Get fresh token
    const authToken = localStorage.getItem('token');
    
    // Check if token exists
    if (!authToken) {
      alert('Session expired. Please login again.');
      return;
    }

    try {
      console.log('Sending request with token:', authToken.substring(0, 20) + '...');
      const response = await axiosInstance.post('/employees', formData);
      
      alert(`Employee "${formData.name}" added successfully!`);
      fetchEmployees();
      setFormData({
        name: '',
        email: '',
        phone: '',
        username: '',
        password: 'employee123'
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding employee:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to add employee';
      alert(`Error: ${errorMsg}`);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      try {
        const authToken = localStorage.getItem('token');
        console.log('Deleting employee:', id);
        console.log('Token:', authToken?.substring(0, 20) + '...');
        
        const response = await axiosInstance.delete(`/employees/${id}`);
        
        console.log('Delete response:', response.data);
        fetchEmployees();
        alert('✓ Employee deleted successfully');
      } catch (error) {
        console.error('Error deleting employee:', error);
        console.error('Error response:', error.response?.data);
        alert('❌ Error: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  const handleEditEmployee = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    try {
      const authToken = localStorage.getItem('token');
      console.log('Updating employee:', selectedEmployee.id);
      console.log('Update data:', { name: selectedEmployee.name, email: selectedEmployee.email, phone: selectedEmployee.phone });
      
      const response = await axiosInstance.put(`/employees/${selectedEmployee.id}`, {
        name: selectedEmployee.name,
        email: selectedEmployee.email,
        phone: selectedEmployee.phone
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      console.log('Update response:', response.data);
      alert('✓ Employee updated successfully');
      fetchEmployees();
      setSelectedEmployee(null);
    } catch (error) {
      console.error('Error updating employee:', error);
      console.error('Error response:', error.response?.data);
      alert('❌ Error: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('❌ New passwords do not match');
      return;
    }

    try {
      await axiosInstance.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      alert('✓ Password changed successfully');
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      alert('❌ Error: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleAllocateTask = async (taskType) => {
    if (!allocatingEmployee) return;

    try {
      await axiosInstance.post('/allocations', {
        employeeId: allocatingEmployee.id,
        taskType: taskType,
        allocatedDate: new Date().toISOString()
      });
      setAllocatingEmployee(null);
      alert(`Task "${taskType}" allocated to ${allocatingEmployee.name}`);
    } catch (error) {
      console.error('Error allocating task:', error);
      alert('Error: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="brand-logo">
          <span className="brand-text">MySwooop Admin Dashboard</span>
        </div>
        <div className="user-info">
          <div className="profile-menu-container">
            <button 
              className="profile-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              title="Account settings"
            >
              👤 Account
            </button>
            {showProfileMenu && (
              <div className="profile-dropdown">
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    setShowPasswordModal(true);
                    setShowProfileMenu(false);
                  }}
                >
                  🔑 Change Password
                </button>
                <button 
                  className="dropdown-item dropdown-logout"
                  onClick={onLogout}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🔐 Change Password</h2>
              <button onClick={() => setShowPasswordModal(false)} className="modal-close">✕</button>
            </div>
            <form onSubmit={handleChangePassword} className="password-form">
              <div className="form-group">
                <label htmlFor="admin-currentPassword">Current Password</label>
                <input
                  type="password"
                  id="admin-currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                  placeholder="Enter your current password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="admin-newPassword">New Password</label>
                <input
                  type="password"
                  id="admin-newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  placeholder="Enter new password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="admin-confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="admin-confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                  placeholder="Confirm new password"
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn-submit">Change Password</button>
                <button type="button" onClick={() => setShowPasswordModal(false)} className="btn-cancel">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-tabs">
        <button
          className={activeTab === 'manage' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('manage')}
        >
          Manage Employees
        </button>
        <button
          className={activeTab === 'allocate' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('allocate')}
        >
          Allocate Tasks
        </button>
        <button
          className={activeTab === 'products' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('products')}
        >
          Track Products
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'manage' && (
          <div className="manage-employees">
            <div className="section-header">
              <h2>Employee Management</h2>
              <button
                className="btn-primary"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Cancel' : 'Add New Employee'}
              </button>
            </div>

            {showForm && (
              <form className="employee-form" onSubmit={handleAddEmployee}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name:</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone:</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Username:</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Password:</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="e.g., employee123"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary">Add Employee</button>
              </form>
            )}

            {selectedEmployee && (
              <div className="modal-overlay" onClick={() => setSelectedEmployee(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h3>Edit Employee</h3>
                  <form onSubmit={handleEditEmployee}>
                    <div className="form-group">
                      <label>Name:</label>
                      <input
                        type="text"
                        value={selectedEmployee.name}
                        onChange={(e) => setSelectedEmployee({ ...selectedEmployee, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email:</label>
                      <input
                        type="email"
                        value={selectedEmployee.email}
                        onChange={(e) => setSelectedEmployee({ ...selectedEmployee, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone:</label>
                      <input
                        type="text"
                        value={selectedEmployee.phone || ''}
                        onChange={(e) => setSelectedEmployee({ ...selectedEmployee, phone: e.target.value })}
                      />
                    </div>
                    <div className="modal-buttons">
                      <button type="submit" className="btn-primary">Save Changes</button>
                      <button type="button" className="btn-secondary" onClick={() => setSelectedEmployee(null)}>Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="employees-list">
              {employees.length === 0 ? (
                <p>No employees yet.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp.id}>
                        <td>{emp.name}</td>
                        <td>{emp.email}</td>
                        <td>{emp.phone}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-secondary"
                              onClick={() => setSelectedEmployee(emp)}
                              title="Edit employee"
                            >
                              Edit
                            </button>
                            <button
                              className="btn-danger"
                              onClick={() => handleDeleteEmployee(emp.id)}
                              title="Delete employee"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'allocate' && (
          <div className="allocate-tasks">
            <h2>Allocate Tasks to Employees</h2>
            <div className="employees-list">
              {employees.length === 0 ? (
                <p>No employees to allocate.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp.id}>
                        <td>{emp.name}</td>
                        <td>{emp.email}</td>
                        <td>
                          <button
                            className="btn-secondary"
                            onClick={() => setAllocatingEmployee(emp)}
                          >
                            Allocate Task
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {allocatingEmployee && (
              <div className="allocation-modal">
                <div className="modal-content">
                  <h3>Allocate Task for {allocatingEmployee.name}</h3>
                  <div className="task-buttons">
                    <button
                      className="btn-task"
                      onClick={() => handleAllocateTask('OA')}
                    >
                      OA (Order Administration)
                    </button>
                    <button
                      className="btn-task"
                      onClick={() => handleAllocateTask('Franchise')}
                    >
                      Franchise
                    </button>
                  </div>
                  <button
                    className="btn-secondary"
                    onClick={() => setAllocatingEmployee(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="track-products">
            <div className="registrations-header">
              <h2>Daily Product Registrations Report</h2>
              <input
                type="date"
                value={registrationFilter}
                onChange={(e) => setRegistrationFilter(e.target.value)}
                className="date-filter"
              />
            </div>

            {registrations.length === 0 ? (
              <div className="no-registrations">
                <p>No product registrations for this date.</p>
              </div>
            ) : (
              <div className="registrations-container">
                {registrations.map((reg) => (
                  <div key={reg.id} className="registration-card">
                    <div className="card-header">
                      <h3>{reg.category.toUpperCase()}</h3>
                      <span className="employee-info">{reg.employeeName} ({reg.username})</span>
                    </div>
                    <div className="card-content">
                      {(reg.category === 'franchise' || reg.category === 'oa') && (
                        <div className="data-grid">
                          <div className="data-item">
                            <label>Arrived:</label>
                            <span className="value">{reg.arrivedProducts}</span>
                          </div>
                          <div className="data-item">
                            <label>Sold:</label>
                            <span className="value">{reg.soldProducts}</span>
                          </div>
                          <div className="data-item">
                            <label>Tested:</label>
                            <span className="value">{reg.testedProducts}</span>
                          </div>
                          <div className="data-item">
                            <label>Booked:</label>
                            <span className="value">{reg.bookedProducts}</span>
                          </div>
                        </div>
                      )}
                      {reg.category === 'repair' && (
                        <div className="data-item single">
                          <label>Total Repaired:</label>
                          <span className="value">{reg.totalRepaired}</span>
                        </div>
                      )}
                      {reg.category === 'return' && (
                        <div className="data-item single">
                          <label>Total Return:</label>
                          <span className="value">{reg.totalReturn}</span>
                        </div>
                      )}
                    </div>
                    <div className="card-footer">
                      <small>{new Date(reg.createdAt).toLocaleString()}</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
