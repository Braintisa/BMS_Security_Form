'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function Home() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [signatureData, setSignatureData] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentSection, setCurrentSection] = useState<number>(1);
  const initialIntake = {
    name: '',
    address: '',
    postalCode: '',
    city: '',
    mobilePhone: '',
    homePhone: '',
    birthDate: '',
    birthPlace: '',
    nationality: '',
    maritalStatus: '',
    email: '',
    emergencyNumber: '',
    emergencyName: '',
    hobbies: '',
    sport: '',
    clothingSize: '',
    pantsSize: '',
    educationName: '',
    educationDiploma: '',
    bhvDiploma: '',
    bhvValidUntil: '',
    vcaDiploma: '',
    vcaValidUntil: '',
    ehboDiploma: '',
    ehboValidUntil: '',
    driverLicense: '',
    ownTransport: '',
    dutchWrite: '',
    dutchSpeak: '',
    englishWrite: '',
    englishSpeak: '',
    benefits: '',
    debts: '',
    availability: '',
    policeRecord: '',
    criminalActivitiesAck: '',
    motivationWhyBms: '',
    motivationGoal: '',
    motivationWorkImportant: '',
    vacationPlans: '',
    aspirantWhyCourse: '',
    additionalComments: '',
    signatureDate: '',
    declarationName: ''
  };
  const [intake, setIntake] = useState(initialIntake);

  const onIntakeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setIntake(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  // Signature pad functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let x, y;
    if ('touches' in e) {
      x = (e.touches[0].clientX - rect.left) * scaleX;
      y = (e.touches[0].clientY - rect.top) * scaleY;
    } else {
      x = (e.clientX - rect.left) * scaleX;
      y = (e.clientY - rect.top) * scaleY;
    }

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let x, y;
    if ('touches' in e) {
      x = (e.touches[0].clientX - rect.left) * scaleX;
      y = (e.touches[0].clientY - rect.top) * scaleY;
    } else {
      x = (e.clientX - rect.left) * scaleX;
      y = (e.clientY - rect.top) * scaleY;
    }

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    saveSignature();
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL('image/png');
      setSignatureData(dataURL);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignatureData('');
      }
    }
  };

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, []);

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/form_template_for_manual_download.pdf';
    link.download = 'form_template_for_manual_download.pdf';
    link.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if PDF is uploaded
    if (!pdfFile) {
      toast.error('Please upload a PDF file before submitting.');
      setMessage({ type: 'error', text: 'Please upload a PDF file before submitting.' });
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const data = new FormData();
      
      // Add PDF file (required)
      data.append('pdfFile', pdfFile);

      // Add intake form JSON
      data.append('intakeForm', JSON.stringify(intake));

      // Add signature data
      data.append('signatureData', signatureData);

      const response = await fetch('/api/forms', {
        method: 'POST',
        body: data
      });

      const result = await response.json();

      if (response.ok) {
        // Show success toast
        toast.success('Formulier succesvol ingediend! Uw gegevens zijn ontvangen.', {
          duration: 5000,
        });
        
        // Also set the inline message for backup
        setMessage({ type: 'success', text: 'Formulier succesvol ingediend! Uw gegevens zijn ontvangen.' });
        
        // Reset form after successful submission
        setTimeout(() => {
          setPdfFile(null);
          setSignatureData('');
          clearSignature();
          setIntake(initialIntake);
          setCurrentSection(1);
          setMessage({ type: '', text: '' });
        }, 1200);
      } else {
        // Show error toast
        toast.error(result.error || 'Er is een fout opgetreden bij het indienen van het formulier. Probeer het opnieuw.');
        setMessage({ type: 'error', text: result.error || 'Er is een fout opgetreden bij het indienen van het formulier. Probeer het opnieuw.' });
      }
    } catch (error) {
      // Show error toast
      toast.error('Er is een onverwachte fout opgetreden. Probeer het alstublieft opnieuw.');
      setMessage({ type: 'error', text: 'Er is een onverwachte fout opgetreden. Probeer het alstublieft opnieuw.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Cover Image Section */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden">
        <Image
          src="/cover.jpg"
          alt="BMS Security Cover"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#555425]/90 to-[#555425]/80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">BMS Security</h1>
            <p className="text-xl md:text-2xl">Your Trusted Security Partner</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header with Logo */}
        <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
          <div className="p-6" style={{ backgroundColor: '#555425' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                  <Image
                    src="/logo.jpg"
                    alt="BMS Security Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="text-white">
                  <h2 className="text-2xl font-bold">Intake Formulier</h2>
                  <p className="opacity-90">Vul het intake formulier in voor BMS Security</p>
                </div>
              </div>
              <div className="hidden md:flex flex-col text-white text-right">
                <p className="text-sm font-semibold">Bekwaam</p>
                <p className="text-sm font-semibold">Moedig</p>
                <p className="text-sm font-semibold">Servicegericht</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white rounded-2xl shadow-xl mb-8 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold" style={{ color: '#555425' }}>INTAKE FORMULIER BMS</h2>
            <div className="text-sm font-semibold" style={{ color: '#555425' }}>
              Sectie {currentSection} van 4
            </div>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((section) => (
              <div key={section} className="flex-1 flex items-center">
                <div
                  className={`flex-1 h-3 rounded-full transition-all ${
                    currentSection >= section
                      ? 'bg-[#555425]'
                      : 'bg-gray-300'
                  }`}
                />
                {section < 4 && (
                  <div
                    className={`w-3 h-3 rounded-full transition-all mx-2 ${
                      currentSection > section
                        ? 'bg-[#555425]'
                        : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section Navigation Buttons - Top */}
        {currentSection > 1 && (
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={() => setCurrentSection(currentSection - 1)}
              className="px-6 py-2 rounded-lg font-semibold text-white transition-all transform hover:scale-105 shadow-md"
              style={{ backgroundColor: '#6a6840' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#555425')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6a6840')}
            >
              ← Vorige
            </button>
          </div>
        )}

        {/* Section 1: Personal Information */}
        {currentSection === 1 && (
        <div className="bg-white rounded-2xl shadow-xl mb-8 p-8">
            <h3 className="text-xl font-bold mb-6" style={{ color: '#555425' }}>
              Sectie 1: Persoonlijke Gegevens
            </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Naam</label>
              <input name="name" value={intake.name} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Adres</label>
              <input name="address" value={intake.address} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Postcode</label>
              <input name="postalCode" value={intake.postalCode} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Woonplaats</label>
              <input name="city" value={intake.city} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Telefoon mobiel</label>
              <input name="mobilePhone" value={intake.mobilePhone} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Telefoon thuis</label>
              <input name="homePhone" value={intake.homePhone} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Geboortedatum</label>
              <input type="date" name="birthDate" value={intake.birthDate} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Geboorteplaats</label>
              <input name="birthPlace" value={intake.birthPlace} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nationaliteit</label>
              <input name="nationality" value={intake.nationality} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Burgerlijke Staat</label>
              <input name="maritalStatus" value={intake.maritalStatus} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email adres</label>
              <input type="email" name="email" value={intake.email} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
            </div>
            <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Noodnummer</label>
                <input name="emergencyNumber" value={intake.emergencyNumber} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Naam (noodgeval)</label>
                <input name="emergencyName" value={intake.emergencyName} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hobby’s</label>
              <input name="hobbies" value={intake.hobbies} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sport</label>
              <input name="sport" value={intake.sport} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Kledingmaat</label>
              <input name="clothingSize" value={intake.clothingSize} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Broekmaat</label>
              <input name="pantsSize" value={intake.pantsSize} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
            </div>
            </div>
            {/* Section 1 Navigation */}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentSection(2)}
                className="px-8 py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 shadow-md"
                style={{ backgroundColor: '#555425' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#6a6840')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#555425')}
              >
                Volgende →
              </button>
            </div>
          </div>
        )}

        {/* Section 2: Education, Skills & Background */}
        {currentSection === 2 && (
          <div className="bg-white rounded-2xl shadow-xl mb-8 p-8">
            <h3 className="text-xl font-bold mb-6" style={{ color: '#555425' }}>
              Sectie 2: Opleiding, Vaardigheden & Achtergrond
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Opleiding</label>
                <input name="educationName" value={intake.educationName} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Met / zonder diploma</label>
                <input name="educationDiploma" value={intake.educationDiploma} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
              </div>
            </div>

            <div className="md:col-span-2 grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">BHV diploma (ja/nee)</label>
                <input name="bhvDiploma" value={intake.bhvDiploma} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Geldig tot</label>
                <input type="date" name="bhvValidUntil" value={intake.bhvValidUntil} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
              </div>
            </div>

            <div className="md:col-span-2 grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">VCA diploma (ja/nee)</label>
                <input name="vcaDiploma" value={intake.vcaDiploma} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Geldig tot</label>
                <input type="date" name="vcaValidUntil" value={intake.vcaValidUntil} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
              </div>
            </div>

            <div className="md:col-span-2 grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">EHBO diploma (ja/nee)</label>
                <input name="ehboDiploma" value={intake.ehboDiploma} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Geldig tot</label>
                <input type="date" name="ehboValidUntil" value={intake.ehboValidUntil} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
              </div>
            </div>

            <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rijbewijs (ja/nee)</label>
                <input name="driverLicense" value={intake.driverLicense} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Eigen vervoer</label>
                <input name="ownTransport" value={intake.ownTransport} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
              </div>
            </div>

            <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nederlands - Schrijven</label>
                <select name="dutchWrite" value={intake.dutchWrite} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg">
                  <option value="">Selecteer</option>
                  <option>Slecht</option>
                  <option>Gemiddeld</option>
                  <option>Voldoende</option>
                  <option>Goed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nederlands - Spreken</label>
                <select name="dutchSpeak" value={intake.dutchSpeak} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg">
                  <option value="">Selecteer</option>
                  <option>Slecht</option>
                  <option>Gemiddeld</option>
                  <option>Voldoende</option>
                  <option>Goed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Engels - Schrijven</label>
                <select name="englishWrite" value={intake.englishWrite} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg">
                  <option value="">Selecteer</option>
                  <option>Slecht</option>
                  <option>Gemiddeld</option>
                  <option>Voldoende</option>
                  <option>Goed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Engels - Spreken</label>
                <select name="englishSpeak" value={intake.englishSpeak} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg">
                  <option value="">Selecteer</option>
                  <option>Slecht</option>
                  <option>Gemiddeld</option>
                  <option>Voldoende</option>
                  <option>Goed</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Uitkering (Nee / Ja, welke)</label>
              <input name="benefits" value={intake.benefits} onChange={onIntakeChange} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Schulden? (omschrijving)</label>
              <textarea name="debts" value={intake.debts} onChange={onIntakeChange} rows={2} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Beschikbaarheid (Ma t/m Zo; overdag/’s avonds/’s nachts)</label>
              <textarea name="availability" value={intake.availability} onChange={onIntakeChange} rows={3} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Politie / justitie in aanraking geweest (Nee / Ja, toelichting)</label>
              <textarea name="policeRecord" value={intake.policeRecord} onChange={onIntakeChange} rows={2} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Criminele activiteiten (verklaring)</label>
              <textarea name="criminalActivitiesAck" value={intake.criminalActivitiesAck} onChange={onIntakeChange} rows={3} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
            </div>
            </div>
            {/* Section 2 Navigation */}
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentSection(1)}
                className="px-8 py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 shadow-md"
                style={{ backgroundColor: '#6a6840' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#555425')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6a6840')}
              >
                ← Vorige
              </button>
              <button
                type="button"
                onClick={() => setCurrentSection(3)}
                className="px-8 py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 shadow-md"
                style={{ backgroundColor: '#555425' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#6a6840')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#555425')}
              >
                Volgende →
              </button>
            </div>
          </div>
        )}

        {/* Section 3: Motivation & Declaration */}
        {currentSection === 3 && (
          <div className="bg-white rounded-2xl shadow-xl mb-8 p-8">
            <h3 className="text-xl font-bold mb-6" style={{ color: '#555425' }}>
              Sectie 3: Motivatie & Verklaring
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Waarom wilt u bij BMS Security werken?</label>
              <textarea name="motivationWhyBms" value={intake.motivationWhyBms} onChange={onIntakeChange} rows={3} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Wat wilt u bereiken in de functie van beveiliger?</label>
              <textarea name="motivationGoal" value={intake.motivationGoal} onChange={onIntakeChange} rows={3} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
          </div>
          
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Wat vindt u belangrijk in uw werk? Wensen t.a.v. uw functie?</label>
              <textarea name="motivationWorkImportant" value={intake.motivationWorkImportant} onChange={onIntakeChange} rows={3} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
          </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Vakantieplannen</label>
              <textarea name="vacationPlans" value={intake.vacationPlans} onChange={onIntakeChange} rows={2} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
          </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Specifieke vraag (Aspirant): Waarom wilt u deze opleiding volgen?</label>
              <textarea name="aspirantWhyCourse" value={intake.aspirantWhyCourse} onChange={onIntakeChange} rows={3} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
            </div>
          </div>
            {/* Section 3 Navigation */}
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentSection(2)}
                className="px-8 py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 shadow-md"
                style={{ backgroundColor: '#6a6840' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#555425')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6a6840')}
              >
                ← Vorige
              </button>
              <button
                type="button"
                onClick={() => setCurrentSection(4)}
                className="px-8 py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 shadow-md"
                style={{ backgroundColor: '#555425' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#6a6840')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#555425')}
              >
                Volgende →
              </button>
            </div>
        </div>
        )}

        {/* Section 4: Declaration, Signature, PDF Upload & Submit */}
        {currentSection === 4 && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-xl font-bold mb-6" style={{ color: '#555425' }}>
                Sectie 4: Verklaring & Indienen
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-8 pt-0">
            {/* Success/Error Message */}
            {message.text && (
              <div 
                className={`mb-6 p-6 rounded-xl shadow-lg border-2 flex items-center gap-4 ${
                  message.type === 'success' ? 'text-[#555425]' : 'text-red-800'
                }`} 
                style={message.type === 'success' ? 
                  { backgroundColor: '#f5f5f0', borderColor: '#555425' } : 
                  { backgroundColor: '#fef2f2', borderColor: '#fecaca' }
                }
              >
                <div className="text-4xl">
                  {message.type === 'success' ? '✓' : '⚠️'}
                </div>
                <div>
                  <p className="font-bold text-lg">{message.text}</p>
                  {message.type === 'success' && (
                    <p className="text-sm mt-1 opacity-75">Het formulier wordt automatisch gereset...</p>
                  )}
                </div>
              </div>
            )}

            {/* Declaration and Signature Section */}
            <div className="bg-white rounded-2xl shadow-xl mb-8 p-8">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#555425' }}>Verklaring en Handtekening</h2>
              
              <div className="space-y-6">
                {/* Additional Comments */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Wat ik nog wil zeggen: (ruimte voor op- of aanmerkingen)
                  </label>
                  <textarea
                    name="additionalComments"
                    value={intake.additionalComments || ''}
                    onChange={onIntakeChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg resize-none focus:outline-none focus:border-[#555425]"
                    placeholder="Uw opmerkingen of aanmerkingen..."
                  />
                </div>

                {/* Declaration Text */}
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    Ik, <input 
                    type="text"
                      name="declarationName"
                      value={intake.declarationName || ''}
                      onChange={onIntakeChange}
                      className="inline-block border-b-2 border-gray-400 bg-transparent px-2 py-1 text-sm font-semibold min-w-[200px] focus:outline-none focus:border-[#555425]"
                      placeholder="Uw naam hier"
                    /> ben me ervan bewust dat, zodra BMS de aanvraag
                    voor een beveiligingspas start, eventuele kosten op mijn verhaald kunnen worden als ik me terugtrek
                    uit de procedure of als er voor mij geen beveiligingspas wordt afgegeven door Bijzondere Wetten
                    (€ 150,00).
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Bij het ondertekenen van dit intakeformulier belooft u dat u de gestelde vragen naar waarheid heeft
                    ingevuld en akkoord gaat met de inhoud van onze privacyverklaring, bedrijfsreglement en
                    toestemmingformulier.
                  </p>
            </div>

                {/* Signature Section */}
                <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Datum <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                      name="signatureDate"
                      value={intake.signatureDate || ''}
                      onChange={onIntakeChange}
                    required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#555425]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Handtekening <span className="text-red-500">*</span>
                  </label>
                    <div className="space-y-3">
                      {/* Digital Signature Pad */}
                      <div className="border-2 border-gray-300 rounded-lg bg-white">
                        <div className="p-2 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                          <p className="text-sm text-gray-600">Teken hier uw handtekening</p>
                          <button
                            type="button"
                            onClick={clearSignature}
                            className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                          >
                            Wissen
                          </button>
                        </div>
                        <canvas
                          ref={canvasRef}
                          width={400}
                          height={150}
                          className="w-full h-[150px] cursor-crosshair touch-none"
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          onTouchStart={startDrawing}
                          onTouchMove={draw}
                          onTouchEnd={stopDrawing}
                          style={{ touchAction: 'none' }}
                        />
                    </div>
                      
                      {signatureData && (
                        <div className="mt-2 p-2 border rounded-lg bg-green-50 border-green-200">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="text-sm text-green-700 font-semibold">Handtekening opgeslagen</p>
                          </div>
                      </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Template Section */}
            <div 
              className="border-2 rounded-xl p-6 mb-6" 
              style={{ backgroundColor: '#f5f5f0', borderColor: '#555425' }}
            >
              <div className="flex items-start gap-4">
                <div className="text-white rounded-full p-3" style={{ backgroundColor: '#555425' }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Download Form Template</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Download the PDF template, fill it out with your details, and upload it below.
                  </p>
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="text-white px-6 py-3 rounded-lg transition-all font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    style={{ backgroundColor: '#555425' }}
                    onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#6a6840'}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#555425'}
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download PDF Template
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Upload PDF Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Filled PDF Form <span className="text-red-500">*</span>
              </label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-all cursor-pointer bg-gray-50"
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#555425';
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f0';
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#d1d5db';
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#f9fafb';
                }}
              >
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="pdf-upload"
                  />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <div className="mb-4">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-4h4m-4 4v4m0 0h-4m4 4v-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    {pdfFile ? pdfFile.name : 'Click to upload PDF or drag and drop'}
                  </p>
                  <p className="text-xs text-gray-500">PDF files only</p>
                </label>
              </div>
              {pdfFile && (
                <div 
                  className="mt-4 p-3 border rounded-lg" 
                  style={{ backgroundColor: '#f5f5f0', borderColor: '#555425' }}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" style={{ color: '#555425' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-semibold" style={{ color: '#555425' }}>{pdfFile.name} selected</p>
                  </div>
                </div>
              )}
            </div>

            {/* Section 4 Navigation & Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setCurrentSection(3)}
                className="px-8 py-4 rounded-lg font-semibold text-white transition-all transform hover:scale-105 shadow-md"
                style={{ backgroundColor: '#6a6840' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#555425')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6a6840')}
              >
                ← Vorige
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 text-white px-8 py-4 rounded-lg transition-all font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{ backgroundColor: loading ? '#9ca38f' : '#555425' }}
                onMouseEnter={(e) => {
                  if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = '#6a6840';
                }}
                onMouseLeave={(e) => {
                  if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = '#555425';
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Submit Form
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600">
          <p className="mb-2">© 2024 BMS Security. All rights reserved.</p>
          <p className="text-sm">Bekwaam • Moedig • Servicegericht</p>
        </div>
      </div>
    </div>
  );
}
