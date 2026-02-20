import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCustomers: 0,
    totalDrivers: 0,
    recentRegistrations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin-login');
      return;
    }

    // Simulate loading dashboard data
    setTimeout(() => {
      setStats({
        totalUsers: 156,
        totalCustomers: 98,
        totalDrivers: 58,
        recentRegistrations: [
          { name: 'John Doe', type: 'Customer', date: '2024-01-15' },
          { name: 'Jane Smith', type: 'Driver', date: '2024-01-14' },
          { name: 'Mike Johnson', type: 'Customer', date: '2024-01-13' },
          { name: 'Sarah Wilson', type: 'Driver', date: '2024-01-12' }
        ]
      });
      setLoading(false);
    }, 1500);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminId');
    navigate('/admin-login');
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-brand">
          <span className="admin-logo">🔐</span>
          <h1>Admin Dashboard</h1>
        </div>
        <div className="admin-user">
          <span>👤 {localStorage.getItem('adminId') || 'Admin'}</span>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🧑‍💼</div>
            <div className="stat-info">
              <h3>{stats.totalCustomers}</h3>
              <p>Customers</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🚗</div>
            <div className="stat-info">
              <h3>{stats.totalDrivers}</h3>
              <p>Drivers</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-info">
              <h3>+12%</h3>
              <p>Growth Rate</p>
            </div>
          </div>
        </div>

        <div className="admin-content">
          <section className="recent-registrations">
            <h2>Recent Registrations</h2>
            <div className="registrations-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Registration Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentRegistrations.map((user, index) => (
                    <tr key={index}>
                      <td>{user.name}</td>
                      <td>
                        <span className={`user-type ${user.type.toLowerCase()}`}>
                          {user.type === 'Customer' ? '🧑‍💼' : '🚗'} {user.type}
                        </span>
                      </td>
                      <td>{user.date}</td>
                      <td>
                        <span className="status active">✅ Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="admin-actions">
            <h2>Quick Actions</h2>
            <div className="action-grid">
              <button className="action-btn">
                <span className="action-icon">👥</span>
                <span>Manage Users</span>
              </button>
              <button className="action-btn">
                <span className="action-icon">🚗</span>
                <span>Manage Vehicles</span>
              </button>
              <button className="action-btn">
                <span className="action-icon">📊</span>
                <span>View Reports</span>
              </button>
              <button className="action-btn">
                <span className="action-icon">⚙️</span>
                <span>Settings</span>
              </button>
              <button className="action-btn">
                <span className="action-icon">💰</span>
                <span>Transactions</span>
              </button>
              <button className="action-btn">
                <span className="action-icon">📧</span>
                <span>Notifications</span>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
