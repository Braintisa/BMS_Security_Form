'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Form {
  id: number;
  intake_data?: string;
  signature_data?: string;
  signature_file_path?: string;
  pdf_path?: string;
  declaration_name?: string;
  submitted_at: string;
  status?: string;
  
  // Individual intake fields for easy access
  intake_name?: string;
  intake_address?: string;
  intake_postal_code?: string;
  intake_city?: string;
  intake_mobile_phone?: string;
  intake_home_phone?: string;
  intake_birth_date?: string;
  intake_birth_place?: string;
  intake_nationality?: string;
  intake_marital_status?: string;
  intake_email?: string;
  intake_emergency_number?: string;
  intake_emergency_name?: string;
  intake_hobbies?: string;
  intake_sport?: string;
  intake_clothing_size?: string;
  intake_pants_size?: string;
  intake_education_name?: string;
  intake_education_diploma?: string;
  intake_bhv_diploma?: string;
  intake_bhv_valid_until?: string;
  intake_vca_diploma?: string;
  intake_vca_valid_until?: string;
  intake_ehbo_diploma?: string;
  intake_ehbo_valid_until?: string;
  intake_driver_license?: string;
  intake_own_transport?: string;
  intake_dutch_write?: string;
  intake_dutch_speak?: string;
  intake_english_write?: string;
  intake_english_speak?: string;
  intake_benefits?: string;
  intake_debts?: string;
  intake_availability?: string;
  intake_police_record?: string;
  intake_criminal_activities_ack?: string;
  intake_motivation_why_bms?: string;
  intake_motivation_goal?: string;
  intake_motivation_work_important?: string;
  intake_vacation_plans?: string;
  intake_aspirant_why_course?: string;
  intake_additional_comments?: string;
  intake_declaration_name?: string;
  intake_signature_date?: string;
}

interface IntakeForm {
  name?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  mobilePhone?: string;
  homePhone?: string;
  birthDate?: string;
  birthPlace?: string;
  nationality?: string;
  maritalStatus?: string;
  email?: string;
  emergencyNumber?: string;
  emergencyName?: string;
  hobbies?: string;
  sport?: string;
  clothingSize?: string;
  pantsSize?: string;
  educationName?: string;
  educationDiploma?: string;
  bhvDiploma?: string;
  bhvValidUntil?: string;
  vcaDiploma?: string;
  vcaValidUntil?: string;
  ehboDiploma?: string;
  ehboValidUntil?: string;
  driverLicense?: string;
  ownTransport?: string;
  dutchWrite?: string;
  dutchSpeak?: string;
  englishWrite?: string;
  englishSpeak?: string;
  benefits?: string;
  debts?: string;
  availability?: string;
  policeRecord?: string;
  criminalActivitiesAck?: string;
  motivationWhyBms?: string;
  motivationGoal?: string;
  motivationWorkImportant?: string;
  vacationPlans?: string;
  aspirantWhyCourse?: string;
}

export default function AdminDashboard() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted'>('all');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [signingUpId, setSigningUpId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin');
      return;
    }
    fetchForms(token);
  }, [router]);

  const fetchForms = async (token: string) => {
    try {
      const response = await fetch('/api/forms', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setForms(data.forms);
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin');
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id: number) => {
    try {
      const response = await fetch(`/api/forms/${id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedForm(data.form);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error fetching form details:', error);
    }
  };

  const handleDownloadPDF = (pdfPath: string) => {
    const encodedPath = btoa(pdfPath);
    window.open(`/api/forms/download/${encodedPath}`, '_blank');
  };

  const handleGeneratePDF = async (formId: number) => {
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formId }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Create a new window with the HTML content
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(data.html);
          newWindow.document.close();
          
          // Wait for content to load, then trigger print
          newWindow.onload = () => {
            setTimeout(() => {
              newWindow.print();
            }, 500);
          };
        }
      } else {
        console.error('Failed to generate PDF');
        alert('Er is een fout opgetreden bij het genereren van de PDF');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Er is een fout opgetreden bij het genereren van de PDF');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin');
  };

  const filteredForms = forms
    .filter(form =>
      form.intake_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.intake_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.intake_city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.intake_mobile_phone?.includes(searchTerm) ||
      form.declaration_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(form => statusFilter === 'all' ? true : (form.status || 'pending') === statusFilter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#555425] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-1" style={{ color: '#555425' }}>BMS Security</h1>
              <p className="text-sm text-gray-600">Admin Dashboard - Formulieren Overzicht</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-md"
              style={{ backgroundColor: '#555425', color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6a6840'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#555425'}
            >
              Uitloggen
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4" style={{ borderColor: '#555425' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Intake Formulieren</p>
                <p className="text-3xl font-bold mt-2" style={{ color: '#555425' }}>{forms.length}</p>
              </div>
              <div className="text-4xl opacity-20" style={{ color: '#555425' }}>📋</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4" style={{ borderColor: '#6a6840' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vandaag</p>
                <p className="text-3xl font-bold mt-2" style={{ color: '#555425' }}>
                  {forms.filter(f => {
                    const today = new Date();
                    const submitted = new Date(f.submitted_at);
                    return today.toDateString() === submitted.toDateString();
                  }).length}
                </p>
              </div>
              <div className="text-4xl opacity-20" style={{ color: '#555425' }}>📅</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4" style={{ borderColor: '#6a6840' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Deze Week</p>
                <p className="text-3xl font-bold mt-2" style={{ color: '#555425' }}>
                  {forms.filter(f => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(f.submitted_at) >= weekAgo;
                  }).length}
                </p>
              </div>
              <div className="text-4xl opacity-20" style={{ color: '#555425' }}>📊</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4" style={{ borderColor: '#6a6840' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Met PDF</p>
                <p className="text-3xl font-bold mt-2" style={{ color: '#555425' }}>
                  {forms.filter(f => f.pdf_path).length}
                </p>
              </div>
              <div className="text-4xl opacity-20" style={{ color: '#555425' }}>📄</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Zoeken op naam, email, BSN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#555425] transition-all"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#555425] transition-all"
              >
                <option value="all">Alle statussen</option>
                <option value="pending">Pending</option>
                <option value="accepted">Al aangemeld</option>
              </select>
            </div>
          </div>
        </div>

        {/* Forms Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4" style={{ backgroundColor: '#555425' }}>
            <h2 className="text-xl font-semibold text-white">Ingediende Formulieren</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Naam</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Telefoon</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Stad</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Datum</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Acties</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredForms.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      <p className="text-lg">Geen formulieren gevonden</p>
                      <p className="text-sm mt-2">Er zijn nog geen ingediende formulieren</p>
                    </td>
                  </tr>
                ) : (
                  filteredForms.map((form) => (
                    <tr key={form.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        #{form.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {form.intake_name || form.declaration_name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {form.intake_mobile_phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {form.intake_city || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(form.submitted_at).toLocaleDateString('nl-NL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(form.id)}
                            className="px-4 py-2 rounded-lg font-semibold text-white transition-all transform hover:scale-105 shadow-md"
                            style={{ backgroundColor: '#555425' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6a6840'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#555425'}
                          >
                            Bekijken
                          </button>
                          {form.status !== 'accepted' && (
                            <>
                              <button
                                onClick={async () => {
                                  if (!confirm('Weet u zeker dat u dit formulier wilt verwijderen?')) return;
                                  try {
                                    setDeletingId(form.id);
                                    const res = await fetch(`/api/forms/${form.id}`, { method: 'DELETE' });
                                    if (!res.ok) throw new Error('Verwijderen mislukt');
                                    fetchForms(localStorage.getItem('adminToken') || '');
                                  } catch (err) {
                                    alert('Verwijderen mislukt');
                                  } finally {
                                    setDeletingId(null);
                                  }
                                }}
                                disabled={deletingId === form.id || signingUpId === form.id}
                                className="px-4 py-2 rounded-lg font-semibold text-white transition-all transform hover:scale-105 shadow-md disabled:opacity-60"
                                style={{ backgroundColor: '#555425' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6a6840'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#555425'}
                              >
                                {deletingId === form.id ? 'Verwijderen…' : 'Verwijderen'}
                              </button>
                              <button
                                onClick={async () => {
                                  const defaultEmail = form.intake_email || '';
                                  const email = defaultEmail || prompt('Voer e-mail in voor account aanmaak:') || '';
                                  if (!email) return;
                                  try {
                                    setSigningUpId(form.id);
                                    const res = await fetch('/api/admin/signup', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ formId: form.id, email })
                                    });
                                    const data = await res.json();
                                    if (!res.ok) throw new Error(data.error || 'Signup mislukt');
                                    alert('Account aangemaakt en e-mail verzonden.');
                                    fetchForms(localStorage.getItem('adminToken') || '');
                                  } catch (err: any) {
                                    alert(err?.message || 'Signup mislukt');
                                  } finally {
                                    setSigningUpId(null);
                                  }
                                }}
                                disabled={signingUpId === form.id || deletingId === form.id}
                                className="px-4 py-2 rounded-lg font-semibold text-white transition-all transform hover:scale-105 shadow-md disabled:opacity-60"
                                style={{ backgroundColor: '#555425' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6a6840'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#555425'}
                              >
                                {signingUpId === form.id ? 'Aanmelden…' : 'Sign up'}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            <div className="sticky top-0 px-6 py-4 flex justify-between items-center border-b-2" style={{ backgroundColor: '#555425', borderColor: '#6a6840' }}>
              <h3 className="text-2xl font-bold text-white">Formulier Details - ID: {selectedForm.id}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-gray-200 text-3xl font-bold transition-colors"
              >
                ×
              </button>
            </div>

            <div className="px-8 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Intake Form Data */}
              {/* Form Details */}
              <div className="space-y-6">
                {/* Personal Information Section */}
                <div className="border-2 rounded-lg p-6" style={{ borderColor: '#555425' }}>
                  <h4 className="text-lg font-bold mb-4" style={{ color: '#555425' }}>👤 Persoonlijke Gegevens</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Naam</label>
                      <p className="text-gray-900">{selectedForm.intake_name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Adres</label>
                      <p className="text-gray-900">{selectedForm.intake_address || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Postcode</label>
                      <p className="text-gray-900">{selectedForm.intake_postal_code || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Woonplaats</label>
                      <p className="text-gray-900">{selectedForm.intake_city || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Telefoon Mobiel</label>
                      <p className="text-gray-900">{selectedForm.intake_mobile_phone ? `06-${selectedForm.intake_mobile_phone}` : 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Telefoon Thuis</label>
                      <p className="text-gray-900">{selectedForm.intake_home_phone || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Geboortedatum</label>
                      <p className="text-gray-900">{selectedForm.intake_birth_date || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Geboorteplaats</label>
                      <p className="text-gray-900">{selectedForm.intake_birth_place || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Nationaliteit</label>
                      <p className="text-gray-900">{selectedForm.intake_nationality || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Burgerlijke Staat</label>
                      <p className="text-gray-900">{selectedForm.intake_marital_status || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Email</label>
                      <p className="text-gray-900">{selectedForm.intake_email || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact Section */}
                <div className="border-2 rounded-lg p-6" style={{ borderColor: '#555425' }}>
                  <h4 className="text-lg font-bold mb-4" style={{ color: '#555425' }}>🚨 Noodcontact</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Noodnummer</label>
                      <p className="text-gray-900">{selectedForm.intake_emergency_number || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Naam Noodcontact</label>
                      <p className="text-gray-900">{selectedForm.intake_emergency_name || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Personal Details Section */}
                <div className="border-2 rounded-lg p-6" style={{ borderColor: '#555425' }}>
                  <h4 className="text-lg font-bold mb-4" style={{ color: '#555425' }}>🎯 Persoonlijke Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Hobby's</label>
                      <p className="text-gray-900">{selectedForm.intake_hobbies || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Sport</label>
                      <p className="text-gray-900">{selectedForm.intake_sport || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Kledingmaat</label>
                      <p className="text-gray-900">{selectedForm.intake_clothing_size || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Broekmaat</label>
                      <p className="text-gray-900">{selectedForm.intake_pants_size || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Education Section */}
                <div className="border-2 rounded-lg p-6" style={{ borderColor: '#555425' }}>
                  <h4 className="text-lg font-bold mb-4" style={{ color: '#555425' }}>🎓 Opleidingen</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700">Opleiding</label>
                      <p className="text-gray-900">{selectedForm.intake_education_name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Diploma</label>
                      <p className="text-gray-900">{selectedForm.intake_education_diploma || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">BHV Diploma</label>
                      <p className="text-gray-900">{selectedForm.intake_bhv_diploma || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">BHV Geldig Tot</label>
                      <p className="text-gray-900">{selectedForm.intake_bhv_valid_until || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">VCA Diploma</label>
                      <p className="text-gray-900">{selectedForm.intake_vca_diploma || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">VCA Geldig Tot</label>
                      <p className="text-gray-900">{selectedForm.intake_vca_valid_until || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">EHBO Diploma</label>
                      <p className="text-gray-900">{selectedForm.intake_ehbo_diploma || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">EHBO Geldig Tot</label>
                      <p className="text-gray-900">{selectedForm.intake_ehbo_valid_until || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Transport & Languages Section */}
                <div className="border-2 rounded-lg p-6" style={{ borderColor: '#555425' }}>
                  <h4 className="text-lg font-bold mb-4" style={{ color: '#555425' }}>🚗 Vervoer & Talen</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Rijbewijs</label>
                      <p className="text-gray-900">{selectedForm.intake_driver_license || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Eigen Vervoer</label>
                      <p className="text-gray-900">{selectedForm.intake_own_transport || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Nederlands Schrijven</label>
                      <p className="text-gray-900">{selectedForm.intake_dutch_write || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Nederlands Spreken</label>
                      <p className="text-gray-900">{selectedForm.intake_dutch_speak || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Engels Schrijven</label>
                      <p className="text-gray-900">{selectedForm.intake_english_write || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Engels Spreken</label>
                      <p className="text-gray-900">{selectedForm.intake_english_speak || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Benefits & Background Section */}
                <div className="border-2 rounded-lg p-6" style={{ borderColor: '#555425' }}>
                  <h4 className="text-lg font-bold mb-4" style={{ color: '#555425' }}>💰 Uitkering & Achtergrond</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Uitkering</label>
                      <p className="text-gray-900">{selectedForm.intake_benefits || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Politie Aanraking</label>
                      <p className="text-gray-900">{selectedForm.intake_police_record || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700">Schulden</label>
                      <p className="text-gray-900 whitespace-pre-line">{selectedForm.intake_debts || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700">Criminele Activiteiten Erkentenis</label>
                      <p className="text-gray-900 whitespace-pre-line">{selectedForm.intake_criminal_activities_ack || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Motivation Section */}
                <div className="border-2 rounded-lg p-6" style={{ borderColor: '#555425' }}>
                  <h4 className="text-lg font-bold mb-4" style={{ color: '#555425' }}>💭 Motivatie</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Waarom BMS Security?</label>
                      <p className="text-gray-900 whitespace-pre-line">{selectedForm.intake_motivation_why_bms || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Wat wilt u bereiken?</label>
                      <p className="text-gray-900 whitespace-pre-line">{selectedForm.intake_motivation_goal || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Wat vindt u belangrijk in werk?</label>
                      <p className="text-gray-900 whitespace-pre-line">{selectedForm.intake_motivation_work_important || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Vakantie Plannen</label>
                      <p className="text-gray-900 whitespace-pre-line">{selectedForm.intake_vacation_plans || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Waarom deze opleiding?</label>
                      <p className="text-gray-900 whitespace-pre-line">{selectedForm.intake_aspirant_why_course || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Signature Display Section */}
                <div className="border-2 rounded-lg p-6" style={{ borderColor: '#555425' }}>
                  <h4 className="text-lg font-bold mb-4" style={{ color: '#555425' }}>✍️ Handtekening</h4>
                  <div className="space-y-4">
                    {selectedForm.signature_data && selectedForm.signature_data.startsWith('data:image/') ? (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Digitale Handtekening</label>
                        <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
                          <img 
                            src={selectedForm.signature_data} 
                            alt="Handtekening" 
                            className="max-w-full h-auto max-h-64 mx-auto"
                            style={{ border: '1px solid #ddd', borderRadius: '4px' }}
                          />
                        </div>
                      </div>
                    ) : selectedForm.signature_file_path ? (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Handtekening Bestand</label>
                        <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                          <p className="text-gray-600 text-center">
                            📄 Handtekening bestand beschikbaar: {selectedForm.signature_file_path}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Handtekening</label>
                        <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                          <p className="text-gray-600 text-center">Geen handtekening beschikbaar</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Declaration Section */}
                <div className="border-2 rounded-lg p-6" style={{ borderColor: '#555425' }}>
                  <h4 className="text-lg font-bold mb-4" style={{ color: '#555425' }}>📝 Verklaring</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Aanvullende Opmerkingen</label>
                      <p className="text-gray-900 whitespace-pre-line">{selectedForm.intake_additional_comments || 'N/A'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700">Naam in Verklaring</label>
                        <p className="text-gray-900">{selectedForm.intake_declaration_name || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700">Datum Handtekening</label>
                        <p className="text-gray-900">{selectedForm.intake_signature_date || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submission Info */}
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                <h4 className="text-lg font-bold mb-4" style={{ color: '#555425' }}>📋 Submission Info</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Ingediend Op</label>
                    <p className="text-gray-900">{new Date(selectedForm.submitted_at).toLocaleString('nl-NL')}</p>
                  </div>
                  {selectedForm.status && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Status</label>
                      <p className="text-gray-900">{selectedForm.status}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Download Buttons */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleGeneratePDF(selectedForm.id)}
                  className="px-8 py-3 rounded-lg font-bold text-white transition-all transform hover:scale-105 shadow-lg"
                  style={{ backgroundColor: '#555425' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6a6840'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#555425'}
                >
                  📄 Generate Complete PDF
                </button>
                {selectedForm.pdf_path && (
                  <button
                    onClick={() => handleDownloadPDF(selectedForm.pdf_path!)}
                    className="px-8 py-3 rounded-lg font-bold text-white transition-all transform hover:scale-105 shadow-lg"
                    style={{ backgroundColor: '#555425' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6a6840'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#555425'}
                  >
                    📥 Download Original PDF
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
