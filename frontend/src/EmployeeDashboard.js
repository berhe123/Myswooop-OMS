import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosConfig';
import './EmployeeDashboard.css';

function EmployeeDashboard({ user, onLogout }) {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMainTab, setActiveMainTab] = useState('tasks');
  const [activeProductTab, setActiveProductTab] = useState('franchise');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [productData, setProductData] = useState({
    franchise: { arrivedProducts: 0, soldProducts: 0, testedProducts: 0, bookedProducts: 0 },
    oa: { arrivedProducts: 0, soldProducts: 0, testedProducts: 0, bookedProducts: 0 },
    repair: { totalRepaired: 0 },
    return: { totalReturn: 0 }
  });
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAllocations();
    // NOTE: Removed auto-refresh interval - causing data refresh issues
  }, []);

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      console.log('📥 Fetching allocations for user:', user?.username);
      const response = await axiosInstance.get('/allocations');
      console.log('✅ Allocations fetched successfully:', response.data);
      console.log('📊 Total allocations:', response.data.length);
      
      if (response.data && response.data.length > 0) {
        response.data.forEach(a => {
          console.log(`  - Task: ${a.taskType}, Date: ${a.allocatedDate}, Employee: ${a.name}`);
        });
      } else {
        console.log('ℹ️ No allocations found for this employee');
      }
      
      setAllocations(response.data || []);
    } catch (error) {
      console.error('❌ Error fetching allocations:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const getTodayAllocations = () => {
    const today = new Date().toISOString().split('T')[0];
    console.log('🔍 Filtering allocations for today:', today);
    console.log('📦 All allocations available:', allocations);
    
    const todayAllocations = allocations.filter(a => {
      if (!a.allocatedDate) {
        console.warn('⚠️ Allocation missing allocatedDate:', a);
        return false;
      }
      
      // Extract just the date part (YYYY-MM-DD) from allocatedDate
      const allocationDate = a.allocatedDate.substring(0, 10);
      const matches = allocationDate === today;
      
      if (!matches) {
        console.log(`   ℹ️ Allocation ${a.id}: ${allocationDate} (not today, today is ${today})`);
      } else {
        console.log(`   ✅ Allocation ${a.id}: ${a.taskType} - ${allocationDate} (matches today!)`);
      }
      
      return matches;
    });
    
    console.log(`📊 Found ${todayAllocations.length} allocations for today`);
    return todayAllocations;
  };

  const handleProductDataChange = (category, field, value) => {
    setProductData({
      ...productData,
      [category]: {
        ...productData[category],
        [field]: parseInt(value) || 0
      }
    });
  };

  const handleSubmitProducts = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const authToken = localStorage.getItem('token');
      const today = new Date().toISOString().split('T')[0];

      await axiosInstance.post('/products/daily-registration', {
        date: today,
        category: activeProductTab,
        data: productData[activeProductTab]
      });

      alert(`${activeProductTab.toUpperCase()} daily registration submitted successfully!`);
      
      // Reset the form for this category
      if (activeProductTab === 'franchise' || activeProductTab === 'oa') {
        setProductData({
          ...productData,
          [activeProductTab]: { arrivedProducts: 0, soldProducts: 0, testedProducts: 0, bookedProducts: 0 }
        });
      } else if (activeProductTab === 'repair') {
        setProductData({
          ...productData,
          repair: { totalRepaired: 0 }
        });
      } else {
        setProductData({
          ...productData,
          return: { totalReturn: 0 }
        });
      }
    } catch (error) {
      console.error('Error submitting products:', error);
      alert('Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('❌ New passwords do not match');
      return;
    }

    try {
      const authToken = localStorage.getItem('token');
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

  const todayTasks = getTodayAllocations();

  return (
    <div className="employee-dashboard">
      <header className="employee-header">
        <div className="brand-logo">
          <span className="brand-text">MySwooop Employee Dashboard</span>
        </div>
        <div className="user-info">
          <div className="profile-menu-container">
            <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="profile-btn">
              👤 Settings
            </button>
            {showProfileMenu && (
              <div className="profile-dropdown">
                <button onClick={() => { setShowPasswordModal(true); setShowProfileMenu(false); }} className="dropdown-item">
                  🔐 Change Password
                </button>
                <hr className="dropdown-divider" />
                <button onClick={onLogout} className="dropdown-item logout-item">
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Horizontal Tab Navigation */}
      <div className="employee-tabs">
        <button
          className={`tab ${activeMainTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveMainTab('tasks')}
        >
          My Allocated Tasks
        </button>
        <button
          className={`tab ${activeMainTab === 'registration' ? 'active' : ''}`}
          onClick={() => setActiveMainTab('registration')}
        >
          Daily Report Products
        </button>
      </div>

      <div className="employee-content">
        {/* TAB 1: ALLOCATED TASKS & DEPARTMENT INFO */}
        {activeMainTab === 'tasks' && (
          <>
            <div className="dashboard-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2>📋 Your Allocated Tasks Today</h2>
                <button 
                  onClick={fetchAllocations}
                  disabled={loading}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    opacity: loading ? 0.6 : 1
                  }}
                  title="Click to refresh and get latest allocated tasks from admin"
                >
                  🔄 {loading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
              {loading ? (
                <p>Loading tasks...</p>
              ) : todayTasks.length === 0 ? (
                <div className="no-tasks">
                  <div className="no-tasks-icon">📭</div>
                  <p><strong>No tasks allocated for today.</strong></p>
                  <p>Please check back later or contact your administrator.</p>
                </div>
              ) : (
                <div className="tasks-list">
                  {todayTasks.map((task, index) => (
                    <div key={task.id} className="task-card">
                      <div className="task-header-row">
                        <div className="task-number-badge">Task #{index + 1}</div>
                        <span className={`task-badge task-${task.taskType.toLowerCase()}`}>
                          {task.taskType}
                        </span>
                      </div>
                      
                      <div className="task-content">
                        <p className="task-subtitle">Employee Name</p>
                        <h3 className="task-employee-name">{task.name}</h3>
                        
                        <div className="task-divider"></div>
                        
                        <div className="task-details-grid">
                          <div className="task-detail-item">
                            <span className="detail-icon">⏰</span>
                            <div>
                              <span className="detail-label">Allocated Time:</span>
                              <span className="detail-value">{new Date(task.allocatedDate).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="task-footer">
                        <span className="status-badge">✓ Active</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="task-info">
              <h3>🏢 Department Information</h3>
              <div className="info-box">
                <h4>OA</h4>
                <p>Responsible for managing orders and administrative tasks.</p>
              </div>
              <div className="info-box">
                <h4>🏢 Franchise</h4>
                <p>Responsible for franchise-related activities and management.</p>
              </div>
              <div className="info-box">
                <h4>🔧 Repair</h4>
                <p>Responsible for product repair and maintenance activities.</p>
              </div>
              <div className="info-box">
                <h4>↩️ Return</h4>
                <p>Responsible for handling product returns and exchanges.</p>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: DAILY REGISTRATION PRODUCTS */}
        {activeMainTab === 'registration' && (
          <div className="daily-registration-section">
            <div className="registration-header">
              <h2>Daily Report Products</h2>
              <p className="section-description">Report your daily activities and product movements</p>
            </div>

            <div className="product-tabs">
              <button
                className={`tab-link ${activeProductTab === 'franchise' ? 'active' : ''}`}
                onClick={() => setActiveProductTab('franchise')}
              >
                🏢 Franchise
              </button>
              <button
                className={`tab-link ${activeProductTab === 'oa' ? 'active' : ''}`}
                onClick={() => setActiveProductTab('oa')}
              >
                📋 OA
              </button>
              <button
                className={`tab-link ${activeProductTab === 'repair' ? 'active' : ''}`}
                onClick={() => setActiveProductTab('repair')}
              >
                🔧 Repair
              </button>
              <button
                className={`tab-link ${activeProductTab === 'return' ? 'active' : ''}`}
                onClick={() => setActiveProductTab('return')}
              >
                ↩️ Return
              </button>
            </div>

            <form onSubmit={handleSubmitProducts} className="product-registration-form">
              {(activeProductTab === 'franchise' || activeProductTab === 'oa') && (
                <div className="form-grid">
                  <div className="form-group">
                    <label>Arrived Products:</label>
                    <input
                      type="number"
                      min="0"
                      value={productData[activeProductTab].arrivedProducts}
                      onChange={(e) => handleProductDataChange(activeProductTab, 'arrivedProducts', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Sold Products:</label>
                    <input
                      type="number"
                      min="0"
                      value={productData[activeProductTab].soldProducts}
                      onChange={(e) => handleProductDataChange(activeProductTab, 'soldProducts', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Tested Products:</label>
                    <input
                      type="number"
                      min="0"
                      value={productData[activeProductTab].testedProducts}
                      onChange={(e) => handleProductDataChange(activeProductTab, 'testedProducts', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Booked Products:</label>
                    <input
                      type="number"
                      min="0"
                      value={productData[activeProductTab].bookedProducts}
                      onChange={(e) => handleProductDataChange(activeProductTab, 'bookedProducts', e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {activeProductTab === 'repair' && (
                <div className="form-group">
                  <label>Total Number of Repaired Products:</label>
                  <input
                    type="number"
                    min="0"
                    value={productData.repair.totalRepaired}
                    onChange={(e) => handleProductDataChange('repair', 'totalRepaired', e.target.value)}
                    required
                  />
                </div>
              )}

              {activeProductTab === 'return' && (
                <div className="form-group">
                  <label>Total Number of Return Products:</label>
                  <input
                    type="number"
                    min="0"
                    value={productData.return.totalReturn}
                    onChange={(e) => handleProductDataChange('return', 'totalReturn', e.target.value)}
                    required
                  />
                </div>
              )}

              <button type="submit" className="btn-submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Daily Report'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🔐 Change Password</h2>
              <button onClick={() => setShowPasswordModal(false)} className="modal-close">✕</button>
            </div>
            <form onSubmit={handleChangePassword} className="password-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  required
                  placeholder="Enter your current password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  required
                  placeholder="Enter new password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
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
    </div>
  );
}

export default EmployeeDashboard;
