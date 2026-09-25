import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  GraduationCap,
  Lock,
  Mail,
  User,
  Building,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { UserRole } from '../types';

interface DemoAccount {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  badgeColor: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: 'student@campus.edu',
    password: 'demo1234',
    role: 'student',
    name: 'Alice Johnson (Student)',
    badgeColor: '#0284c7',
  },
  {
    email: 'faculty@campus.edu',
    password: 'demo1234',
    role: 'faculty',
    name: 'Dr. Robert Singh (Faculty)',
    badgeColor: '#d97706',
  },
  {
    email: 'admin@campus.edu',
    password: 'demo1234',
    role: 'admin',
    name: 'Admin Kumar (Campus Admin)',
    badgeColor: '#db2777',
  },
];

const LoginPage: React.FC = () => {
  const [tab, setTab] = useState<'login' | 'register' | 'demo'>('login');
  const [loading, setLoading] = useState<boolean>(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState<{
    name: string;
    email: string;
    password: string;
    role: UserRole;
    department: string;
    block: string;
    rollNumber: string;
  }>({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: '',
    block: '',
    rollNumber: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      toast.success('Authentication successful! Welcome to SmartCampus.');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(registerForm);
      toast.success('Campus account established! Welcome.');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (account: DemoAccount) => {
    setLoading(true);
    try {
      await login(account.email, account.password);
      toast.success(`Signed in as ${account.name}`);
      navigate('/dashboard');
    } catch (err) {
      toast.error('Demo authentication failed. Ensure backend service is active.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-in">
        {/* Logo & Headline */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <GraduationCap size={32} />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
            SmartCampus <span style={{ color: 'var(--primary)' }}>OS</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Unified Real-Time Campus Intelligence Platform
          </p>
        </div>

        {/* Tab Controls */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => setTab('login')}
            id="login-tab"
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => setTab('register')}
            id="register-tab"
          >
            Create Account
          </button>
          <button
            type="button"
            className={`auth-tab ${tab === 'demo' ? 'active' : ''}`}
            onClick={() => setTab('demo')}
            id="demo-tab"
          >
            Demo Accounts ⚡
          </button>
        </div>

        {/* Sign In Tab */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} id="login-form">
            <div className="form-group">
              <label className="form-label">Campus Email</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type="email"
                  placeholder="student@campus.edu"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
                  required
                  id="login-email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                required
                id="login-password"
              />
            </div>

            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
              type="submit"
              disabled={loading}
              id="login-submit-btn"
            >
              {loading ? 'Authenticating...' : 'Sign In to Campus OS'}
            </button>

            {/* Quick Demo Fill Pills */}
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                Quick 1-Click Demo Fill
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => {
                      setLoginForm({ email: acc.email, password: acc.password });
                    }}
                    style={{
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--surface-glass-border)',
                      borderRadius: 'var(--radius-xs)',
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      color: 'var(--text-secondary)',
                      textTransform: 'capitalize',
                    }}
                  >
                    {acc.role}
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* Register Tab */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} id="register-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Maya Patel"
                value={registerForm.name}
                onChange={(e) => setRegisterForm((f) => ({ ...f, name: e.target.value }))}
                required
                id="reg-name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Campus Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="you@campus.edu"
                value={registerForm.email}
                onChange={(e) => setRegisterForm((f) => ({ ...f, email: e.target.value }))}
                required
                id="reg-email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="Min 8 characters"
                value={registerForm.password}
                onChange={(e) => setRegisterForm((f) => ({ ...f, password: e.target.value }))}
                required
                id="reg-password"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={registerForm.role}
                  onChange={(e) => setRegisterForm((f) => ({ ...f, role: e.target.value as UserRole }))}
                  id="reg-role"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Block Assignment</label>
                <select
                  className="form-select"
                  value={registerForm.block}
                  onChange={(e) => setRegisterForm((f) => ({ ...f, block: e.target.value }))}
                  id="reg-block"
                >
                  <option value="">Select Block</option>
                  {['A', 'B', 'C', 'D', 'Admin'].map((b) => (
                    <option key={b} value={b}>
                      Block {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Department / Program</label>
              <input
                className="form-input"
                type="text"
                placeholder="Computer Science & Engineering"
                value={registerForm.department}
                onChange={(e) => setRegisterForm((f) => ({ ...f, department: e.target.value }))}
                id="reg-department"
              />
            </div>

            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
              type="submit"
              disabled={loading}
              id="register-submit-btn"
            >
              {loading ? 'Creating account...' : 'Create Campus Profile'}
            </button>
          </form>
        )}

        {/* Demo Accounts Quick Launch Tab */}
        {tab === 'demo' && (
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.2rem', textAlign: 'center' }}>
              Instant role demonstration profiles. Click any profile to log in immediately without typing passwords.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {DEMO_ACCOUNTS.map((acc) => (
                <div
                  key={acc.role}
                  className="demo-account-card"
                  onClick={() => quickLogin(acc)}
                  id={`demo-${acc.role}-btn`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-xs)',
                        background: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {acc.role === 'admin' ? (
                        <ShieldCheck size={20} />
                      ) : acc.role === 'faculty' ? (
                        <BookOpen size={20} />
                      ) : (
                        <GraduationCap size={20} />
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                        {acc.name}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        {acc.email}
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={16} color="var(--primary)" />
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.78rem', color: 'var(--text-light)' }}>
              Password for all demo accounts: <strong style={{ color: 'var(--text-primary)' }}>demo1234</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
