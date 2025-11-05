'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
  const [showProfile, setShowProfile] = useState(false);

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
      // Keep modal open but show success; alternatively, close after success:
      // setShowProfile(false);
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Wachtwoord wijzigen mislukt' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Navbar */}
      <div className="w-full" style={{ backgroundColor: "#555425" }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2 sm:gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-8 sm:w-16 sm:h-10 rounded overflow-hidden bg-white">
              <Image
                src="/logo.jpg"
                alt="Site logo"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <span className="text-white font-semibold">BMS Security</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                setMessage({ type: "", text: "" });
                setShowProfile(true);
              }}
              className="px-3 sm:px-4 py-2 rounded-lg font-semibold text-white text-sm sm:text-base transition-all shadow-md"
              style={{ backgroundColor: "#6a6840" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor =
                  "#4f4d2f")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor =
                  "#6a6840")
              }
            >
              Profiel
            </button>
            <button
              onClick={handleLogout}
              className="px-3 sm:px-4 py-2 rounded-lg font-semibold text-white text-sm sm:text-base transition-all shadow-md"
              style={{ backgroundColor: "#6a6840" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor =
                  "#4f4d2f")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor =
                  "#6a6840")
              }
            >
              Uitloggen
            </button>
          </div>
        </div>
      </div>

      {/* Empty dashboard content area */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-xl p-4">
              <h2
                className="text-lg font-semibold mb-4"
                style={{ color: "#555425" }}
              >
                Menu
              </h2>
              <div className="flex flex-col gap-2 text-gray-500">
                <button className="w-full text-left px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50">
                  Dashboard
                </button>
                <button className="w-full text-left px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50">
                  Rapporten
                </button>
                <button className="w-full text-left px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50">
                  Taken
                </button>
                <button className="w-full text-left px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50">
                  Medewerkers
                </button>
                <button className="w-full text-left px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50">
                  Dienstregelingen
                </button>
                <button className="w-full text-left px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50">
                  Instellingen
                </button>
                <button className="w-full text-left px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50">
                  Hulp
                </button>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 text-center text-gray-600">
              Welkom{userName ? `, ${userName}` : ""}. Dit is uw dashboard.
            </div>
          </main>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowProfile(false)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ backgroundColor: "#555425" }}
            >
              <h3 className="text-white font-semibold">Profiel</h3>
              <button
                onClick={() => setShowProfile(false)}
                className="text-white/90 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <p className="text-sm text-gray-600">Geregistreerd e-mail</p>
                <p className="text-lg font-semibold text-gray-900 break-all">
                  {userEmail}
                </p>
              </div>

              {message.text && (
                <div
                  className={`mb-6 p-4 rounded-lg border-2 ${
                    message.type === "success"
                      ? "text-[#555425]"
                      : "text-red-800"
                  }`}
                  style={
                    message.type === "success"
                      ? { backgroundColor: "#f5f5f0", borderColor: "#555425" }
                      : { backgroundColor: "#fef2f2", borderColor: "#fecaca" }
                  }
                >
                  <p className="font-semibold">{message.text}</p>
                </div>
              )}

              <form onSubmit={changePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Huidig wachtwoord
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nieuw wachtwoord
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bevestig nieuw wachtwoord
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowProfile(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
                  >
                    Sluiten
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="text-white px-6 py-2 rounded-lg transition-all font-semibold shadow-md hover:shadow-lg disabled:opacity-50"
                    style={{ backgroundColor: loading ? "#9ca38f" : "#555425" }}
                    onMouseEnter={(e) => {
                      if (!loading)
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          "#6a6840";
                    }}
                    onMouseLeave={(e) => {
                      if (!loading)
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          "#555425";
                    }}
                  >
                    {loading ? "Opslaan..." : "Wachtwoord wijzigen"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


