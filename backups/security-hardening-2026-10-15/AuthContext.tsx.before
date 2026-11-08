import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthUser } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  token: string | null;
  signIn: (email: string, password?: string, role?: string) => Promise<boolean>;
  signInAsRootAdmin: () => Promise<boolean>;
  signOut: () => Promise<void>;
  isSignInModalOpen: boolean;
  setIsSignInModalOpen: (open: boolean) => void;
  openSignInModal: () => void;
  closeSignInModal: () => void;
}

const ROOT_ADMIN_EMAIL = 'damoneward38@gmail.com';

const defaultRootUser: AuthUser = {
  id: 'usr_damoneward38',
  email: ROOT_ADMIN_EMAIL,
  name: 'Damon Ward',
  role: 'SUPERADMIN',
  title: 'Root Security Officer & HSM Administrator',
  tenantId: 'six686-root',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  permissions: ['*', 'admin', 'override', 'killswitch', 'governance-signoff', 'enclave-attestation', 'compliance-audit'],
  maxRiskAuthority: 'CRITICAL',
  mfaAuthenticated: true,
  hsmSessionActive: true,
  createdAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('magen_auth_user');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse cached user:', e);
    }
    // Default to root admin damoneward38@gmail.com
    return defaultRootUser;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('magen_auth_token') || 'magen_sec_session_root_damoneward38';
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState<boolean>(false);

  // Sync session with backend
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedToken = localStorage.getItem('magen_auth_token');
        const res = await fetch('/api/auth/session', {
          headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            setToken(data.token);
            localStorage.setItem('magen_auth_user', JSON.stringify(data.user));
            localStorage.setItem('magen_auth_token', data.token);
          }
        }
      } catch (err) {
        console.warn('Could not verify session with server, keeping cached state:', err);
      }
    };
    checkSession();
  }, []);

  const signIn = async (email: string, _password?: string, role?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });

      if (!res.ok) {
        throw new Error('Login failed');
      }

      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('magen_auth_user', JSON.stringify(data.user));
        localStorage.setItem('magen_auth_token', data.token);
        setIsSignInModalOpen(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Sign-in error:', error);
      // Fallback local sign in for offline/dev resilience
      const normalizedEmail = email.trim().toLowerCase();
      const isAdmin = normalizedEmail === ROOT_ADMIN_EMAIL;
      const fallbackUser: AuthUser = isAdmin
        ? defaultRootUser
        : {
            id: `usr_${Date.now()}`,
            email: normalizedEmail,
            name: normalizedEmail.split('@')[0],
            role: (role as any) || 'SECURITY_ANALYST',
            title: 'Security Operations Analyst',
            tenantId: 'tenant-alpha',
            permissions: ['read:telemetry', 'execute:inference', 'view:audit'],
            maxRiskAuthority: 'MEDIUM',
            mfaAuthenticated: true,
            hsmSessionActive: false,
            createdAt: new Date().toISOString(),
          };

      setUser(fallbackUser);
      localStorage.setItem('magen_auth_user', JSON.stringify(fallbackUser));
      setIsSignInModalOpen(false);
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const signInAsRootAdmin = async (): Promise<boolean> => {
    return signIn(ROOT_ADMIN_EMAIL, 'admin-hsm-pass', 'SUPERADMIN');
  };

  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ token }),
        }).catch(() => {});
      }
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('magen_auth_user');
      localStorage.removeItem('magen_auth_token');
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.email === ROOT_ADMIN_EMAIL || user?.role === 'SUPERADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isLoading,
        token,
        signIn,
        signInAsRootAdmin,
        signOut,
        isSignInModalOpen,
        setIsSignInModalOpen,
        openSignInModal: () => setIsSignInModalOpen(true),
        closeSignInModal: () => setIsSignInModalOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
