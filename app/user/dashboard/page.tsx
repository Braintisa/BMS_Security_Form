'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserDashboard() {
  const router = useRouter();
  const [token, setToken] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | '' ; text: string }>({ type: '', text: '' });

  useEffect(() => {
    const t = localStorage.getItem('userToken') || '';
    if (!t) {
      router.push('/login');
      return;
    }
    setToken(t);
    try {
      const payload = JSON.parse(atob(t.split('.')[1] || ''));
      setUserEmail(payload?.email || '');
      setUserName(payload?.name || '');
    } catch {}
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    router.push('/login');
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Nieuw wachtwoord moet minimaal 8 tekens zijn.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Wachtwoorden komen niet overeen.' });
      return;
    }
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Wachtwoord wijzigen mislukt');
      setMessage({ type: 'success', text: 'Wachtwoord succesvol gewijzigd.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Wachtwoord wijzigen mislukt' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="p-6 flex items-center justify-between" style={{ backgroundColor: '#555425' }}>
            <div>
              <h1 className="text-2xl font-bold text-white">BMS Security</h1>
              <p className="text-white/90 text-sm">Gebruikersdashboard</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg font-semibold text-white transition-all shadow-md"
              style={{ backgroundColor: '#6a6840' }}
              onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = '#4f4d2f'}
              onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = '#6a6840'}
            >
              Uitloggen
            </button>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600">Ingelogd als</p>
              <p className="text-lg font-semibold text-gray-900">{userName || 'Gebruiker'} ({userEmail})</p>
            </div>

            {message.text && (
              <div 
                className={`mb-6 p-4 rounded-lg border-2 ${message.type === 'success' ? 'text-[#555425]' : 'text-red-800'}`}
                style={message.type === 'success' ? { backgroundColor: '#f5f5f0', borderColor: '#555425' } : { backgroundColor: '#fef2f2', borderColor: '#fecaca' }}
              >
                <p className="font-semibold">{message.text}</p>
              </div>
            )}

            <div className="border-2 rounded-xl p-6" style={{ borderColor: '#555425' }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#555425' }}>Profiel</h2>
              <p className="text-sm text-gray-600 mb-6">Wijzig hier uw wachtwoord.</p>
              <form onSubmit={changePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Huidig wachtwoord</label>
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nieuw wachtwoord</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bevestig nieuw wachtwoord</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" required />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="text-white px-6 py-3 rounded-lg transition-all font-semibold shadow-md hover:shadow-lg disabled:opacity-50"
                  style={{ backgroundColor: loading ? '#9ca38f' : '#555425' }}
                  onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = '#6a6840'; }}
                  onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = '#555425'; }}
                >
                  {loading ? 'Opslaan...' : 'Wachtwoord wijzigen'}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}


