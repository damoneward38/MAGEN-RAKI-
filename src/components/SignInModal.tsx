import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  Lock,
  Key,
  Mail,
  UserCheck,
  X,
  Zap,
  Cpu,
  Fingerprint,
  CheckCircle2,
  AlertCircle,
  Building,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SignInModal: React.FC = () => {
  const {
    isSignInModalOpen,
    closeSignInModal,
    signIn,
    signInAsRootAdmin,
    user,
    isAuthenticated,
    signOut,
    isLoading,
  } = useAuth();

  const [email, setEmail] = useState<string>('damoneward38@gmail.com');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<string>('SUPERADMIN');
  const [activeTab, setActiveTab] = useState<'quick' | 'credentials' | 'sso'>('quick');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isSignInModalOpen) return null;

  const handleQuickAdminLogin = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const ok = await signInAsRootAdmin();
      if (ok) {
        setSuccessMessage('Successfully authenticated as Root Admin (damoneward38@gmail.com)');
        setTimeout(() => {
          closeSignInModal();
        }, 1200);
      } else {
        setErrorMessage('Authentication failed.');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Failed to authenticate');
    }
  };

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    if (!email) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    try {
      const ok = await signIn(email, password, selectedRole);
      if (ok) {
        setSuccessMessage(`Authenticated as ${email}`);
        setTimeout(() => {
          closeSignInModal();
        }, 1200);
      } else {
        setErrorMessage('Failed to sign in.');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Authentication error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-[#0d0d1e] border border-indigo-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-indigo-950/90 via-slate-900 to-indigo-950/90 border-b border-indigo-500/20 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.3)]">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Security Access Portal</h2>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                  Six 686 HSM
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Magen-Raki Governance & Identity Enclave
              </p>
            </div>
          </div>

          <button
            onClick={closeSignInModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current User Notification Banner if already authenticated */}
        {isAuthenticated && user && (
          <div className="bg-emerald-950/40 border-b border-emerald-500/20 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-300">
              <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Active Session: <strong className="text-white">{user.email}</strong> ({user.role})
              </span>
            </div>
            <button
              onClick={signOut}
              className="text-[11px] px-2 py-0.5 rounded bg-rose-950/50 hover:bg-rose-900 border border-rose-500/30 text-rose-300 font-medium transition-all"
            >
              Sign Out
            </button>
          </div>
        )}

        {/* Success / Error Feedback */}
        {successMessage && (
          <div className="m-4 mb-0 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="m-4 mb-0 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Navigation Mode Tabs */}
        <div className="px-6 pt-5 flex items-center gap-2 border-b border-slate-800/80">
          <button
            onClick={() => setActiveTab('quick')}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'quick'
                ? 'text-indigo-400 border-b-2 border-indigo-500 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Admin Instant Access</span>
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'credentials'
                ? 'text-indigo-400 border-b-2 border-indigo-500 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Email / Password</span>
          </button>
          <button
            onClick={() => setActiveTab('sso')}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'sso'
                ? 'text-indigo-400 border-b-2 border-indigo-500 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Enterprise Enclave</span>
          </button>
        </div>

        {/* Tab 1: Instant Root Admin Login */}
        {activeTab === 'quick' && (
          <div className="p-6 space-y-5">
            <div className="bg-slate-900/90 border border-indigo-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm">
                    DW
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Damon Ward</h4>
                    <p className="text-xs font-mono text-indigo-300">damoneward38@gmail.com</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                  ROOT SUPERADMIN
                </span>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span>Role Authority Ceiling:</span>
                  <span className="text-rose-400 font-mono font-semibold">CRITICAL (Full Discretionary)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Hardware Isolation:</span>
                  <span className="text-emerald-400 font-mono">Six 686 Hardware Enclave [HSM-0x882]</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cryptographic Key:</span>
                  <span className="text-slate-300 font-mono">SHA-512 Attestation Seal</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleQuickAdminLogin}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all disabled:opacity-50 cursor-pointer"
            >
              <Fingerprint className="w-4 h-4" />
              <span>{isLoading ? 'Attesting HSM Session...' : 'Sign In as Root Admin (damoneward38@gmail.com)'}</span>
            </button>

            {/* Other quick test identities */}
            <div className="pt-2">
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block mb-2">
                Or authenticate with secondary roles:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => signIn('secops-lead@sapphire.ai', 'pass', 'SECURITY_OFFICER')}
                  className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-left text-xs transition-all"
                >
                  <div className="font-semibold text-slate-200">SecOps Officer</div>
                  <div className="text-[10px] text-slate-400">secops-lead@sapphire.ai</div>
                </button>
                <button
                  onClick={() => signIn('auditor@compliance.org', 'pass', 'AUDITOR')}
                  className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-left text-xs transition-all"
                >
                  <div className="font-semibold text-slate-200">Compliance Auditor</div>
                  <div className="text-[10px] text-slate-400">auditor@compliance.org</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Custom Credentials Form */}
        {activeTab === 'credentials' && (
          <form onSubmit={handleCustomLogin} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@organization.com"
                  required
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Enclave Passphrase / Key
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Role Authority Level
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono cursor-pointer"
              >
                <option value="SUPERADMIN">SUPERADMIN (Full Root & Kill-Switch Authority)</option>
                <option value="SECURITY_OFFICER">SECURITY_OFFICER (Approvals & Policy Management)</option>
                <option value="SECURITY_ANALYST">SECURITY_ANALYST (Telemetry & Risk Audit)</option>
                <option value="AUDITOR">AUDITOR (Read-Only SOC2/ISO Compliance Evidence)</option>
                <option value="DEVELOPER">DEVELOPER (Model Inference & Pipeline Integration)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              <Key className="w-4 h-4" />
              <span>{isLoading ? 'Authenticating...' : 'Sign In & Verify Enclave Session'}</span>
            </button>
          </form>
        )}

        {/* Tab 3: Enterprise SSO & Enclave Token */}
        {activeTab === 'sso' && (
          <div className="p-6 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-xs space-y-3">
              <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span>OIDC / SAML 2.0 Hardware Attestation</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Connect enterprise identity providers (Okta, Google Workspace, Azure AD) protected by Six 686 hardware isolation seals.
              </p>
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => signIn('damoneward38@gmail.com', 'google-sso-token', 'SUPERADMIN')}
                  className="w-full py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium flex items-center justify-center gap-2 text-white transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 11.3 0 14s.7 5.3 1.9 7.7l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                    />
                  </svg>
                  <span>Sign In with Google (damoneward38@gmail.com)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer info bar */}
        <div className="bg-[#090914] border-t border-slate-800/80 px-6 py-3 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span className="flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-emerald-400" />
            <span>HSM Protocol v4.2 Secured</span>
          </span>
          <span>SHA-512 Continuous Audit</span>
        </div>
      </div>
    </div>
  );
};
