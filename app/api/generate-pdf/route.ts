import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { formId } = await request.json();
    
    if (!formId) {
      return NextResponse.json({ error: 'Form ID is required' }, { status: 400 });
    }

    // Get form data from database
    const [rows] = await pool.query(
      `SELECT 
        id, intake_data, signature_data, signature_file_path, pdf_path, declaration_name, submitted_at, status,
        intake_name, intake_address, intake_postal_code, intake_city, intake_mobile_phone, intake_home_phone,
        intake_birth_date, intake_birth_place, intake_nationality, intake_marital_status, intake_email,
        intake_emergency_number, intake_emergency_name, intake_hobbies, intake_sport, intake_clothing_size, intake_pants_size,
        intake_education_name, intake_education_diploma, intake_bhv_diploma, intake_bhv_valid_until,
        intake_vca_diploma, intake_vca_valid_until, intake_ehbo_diploma, intake_ehbo_valid_until,
        intake_driver_license, intake_own_transport, intake_dutch_write, intake_dutch_speak, intake_english_write, intake_english_speak,
        intake_benefits, intake_debts, intake_availability, intake_police_record, intake_criminal_activities_ack,
        intake_motivation_why_bms, intake_motivation_goal, intake_motivation_work_important, intake_vacation_plans, intake_aspirant_why_course,
        intake_additional_comments, intake_declaration_name, intake_signature_date
      FROM forms WHERE id = ?`,
      [formId]
    );

    if (!rows || (rows as any[]).length === 0) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    const form = (rows as any[])[0];

    // Generate HTML content for PDF
    const htmlContent = generateFormHTML(form);

    return NextResponse.json({ 
      success: true,
      html: htmlContent,
      formData: form
    });

  } catch (error: any) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

function generateFormHTML(form: any): string {
  const formatValue = (value: any) => value || 'N/A';
  const formatDate = (date: string) => date ? new Date(date).toLocaleDateString('nl-NL') : 'N/A';

  return `
    <!DOCTYPE html>
    <html lang="nl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BMS Security - Intake Formulier</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: Arial, sans-serif;
                line-height: 1.4;
                color: #000;
                background: white;
                margin: 0;
                padding: 20px;
            }
            
            .document-container {
                max-width: 210mm;
                margin: 0 auto;
                background: white;
                border: 1px solid #000;
            }
            
            .document-header {
                background: white;
                color: #000;
                padding: 20px;
                border-bottom: 2px solid #000;
            }
            
            .company-logo {
                text-align: center;
                margin-bottom: 20px;
            }
            
            .logo-icon {
                font-size: 24px;
                font-weight: bold;
                color: #000;
                margin-bottom: 10px;
            }
            
            .company-info h1 {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 5px;
            }
            
            .company-info p {
                font-size: 14px;
                font-weight: normal;
            }
            
            .document-title {
                text-align: center;
                margin-top: 20px;
            }
            
            .document-title h2 {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 5px;
            }
            
            .document-title .subtitle {
                font-size: 14px;
                font-weight: normal;
            }
            
            .document-meta {
                margin-top: 20px;
                padding: 10px;
                border: 1px solid #000;
                font-size: 12px;
            }
            
            .meta-item {
                margin-bottom: 5px;
            }
            
            .meta-item .icon {
                font-weight: bold;
            }
            
            .document-body {
                padding: 20px;
            }
            
            .section {
                margin-bottom: 20px;
                border: 1px solid #000;
            }
            
            .section-header {
                background: white;
                color: #000;
                padding: 10px;
                border-bottom: 1px solid #000;
                font-weight: bold;
                font-size: 14px;
            }
            
            .section-icon {
                margin-right: 8px;
                font-weight: bold;
            }
            
            .section-content {
                padding: 15px;
            }
            
            .field-grid {
                display: table;
                width: 100%;
            }
            
            .field {
                display: table-row;
            }
            
            .field-label {
                font-weight: bold;
                font-size: 12px;
                padding: 5px 10px;
                border-bottom: 1px solid #ccc;
                display: table-cell;
                width: 30%;
                vertical-align: top;
            }
            
            .field-value {
                padding: 5px 10px;
                border-bottom: 1px solid #ccc;
                font-size: 12px;
                display: table-cell;
                width: 70%;
                vertical-align: top;
            }
            
            .field-full {
                display: table-row;
            }
            
            .field-value.long-text {
                white-space: pre-wrap;
                line-height: 1.3;
            }
            
            .signature-section {
                text-align: center;
                padding: 15px;
                border: 1px solid #000;
                margin-top: 10px;
            }
            
            .signature-label {
                font-weight: bold;
                font-size: 12px;
                margin-bottom: 10px;
            }
            
            .signature-image {
                max-width: 300px;
                max-height: 150px;
                border: 1px solid #000;
                margin: 0 auto;
                display: block;
            }
            
            .signature-placeholder {
                padding: 20px;
                font-style: italic;
                border: 1px solid #ccc;
            }
            
            .document-footer {
                background: white;
                padding: 20px;
                border-top: 1px solid #000;
                text-align: center;
                font-size: 12px;
            }
            
            .company-motto {
                font-weight: bold;
                margin-bottom: 10px;
            }
            
            .footer-meta {
                font-size: 10px;
            }
            
            @media print {
                body {
                    background: white;
                    padding: 0;
                }
                
                .document-container {
                    border: none;
                    max-width: none;
                }
            }
            
            @page {
                margin: 15mm;
                size: A4;
            }
        </style>
    </head>
    <body>
        <div class="document-container">
            <div class="document-header">
                <div class="company-logo">
                    <div class="logo-icon">BMS Security</div>
                    <div class="company-info">
                        <h1>INTAKE FORMULIER</h1>
                        <p>Kandidaat Informatie & Profiel</p>
                    </div>
                </div>
                
                <div class="document-meta">
                    <div class="meta-item">
                        <span class="icon">ID:</span>
                        <span>${form.id}</span>
                    </div>
                    <div class="meta-item">
                        <span class="icon">Datum:</span>
                        <span>${formatDate(form.submitted_at)}</span>
                    </div>
                    <div class="meta-item">
                        <span class="icon">Naam:</span>
                        <span>${formatValue(form.intake_name)}</span>
                    </div>
                </div>
            </div>

            <div class="document-body">
                <div class="section">
                    <div class="section-header">
                        <span class="section-icon">01</span>
                        Persoonlijke Gegevens
                    </div>
                    <div class="section-content">
                        <div class="field-grid">
                            <div class="field">
                                <div class="field-label">Volledige Naam</div>
                                <div class="field-value">${formatValue(form.intake_name)}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">Email Adres</div>
                                <div class="field-value">${formatValue(form.intake_email)}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">Telefoon Mobiel</div>
                                <div class="field-value">${form.intake_mobile_phone ? `06-${form.intake_mobile_phone}` : 'N/A'}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">Telefoon Thuis</div>
                                <div class="field-value">${formatValue(form.intake_home_phone)}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">Geboortedatum</div>
                                <div class="field-value">${formatValue(form.intake_birth_date)}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">Geboorteplaats</div>
                                <div class="field-value">${formatValue(form.intake_birth_place)}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">Nationaliteit</div>
                                <div class="field-value">${formatValue(form.intake_nationality)}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">Burgerlijke Staat</div>
                                <div class="field-value">${formatValue(form.intake_marital_status)}</div>
                            </div>
                            <div class="field field-full">
                                <div class="field-label">Volledig Adres</div>
                                <div class="field-value">${formatValue(form.intake_address)}, ${formatValue(form.intake_postal_code)} ${formatValue(form.intake_city)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-header">
                        <span class="section-icon">02</span>
                        Noodcontact Informatie
                    </div>
                    <div class="section-content">
                        <div class="field-grid">
                            <div class="field">
                                <div class="field-label">Noodcontact Naam</div>
                                <div class="field-value">${formatValue(form.intake_emergency_name)}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">Noodcontact Telefoon</div>
                                <div class="field-value">${formatValue(form.intake_emergency_number)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-header">
                        <span class="section-icon">03</span>
                        Persoonlijke Profiel
                    </div>
                    <div class="section-content">
                        <div class="field-grid">
                            <div class="field">
                                <div class="field-label">Hobby's & Interesses</div>
                                <div class="field-value">${formatValue(form.intake_hobbies)}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">Sport Activiteiten</div>
                                <div class="field-value">${formatValue(form.intake_sport)}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">Kledingmaat</div>
                                <div class="field-value">${formatValue(form.intake_clothing_size)}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">Broekmaat</div>
                                <div class="field-value">${formatValue(form.intake_pants_size)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-header">
                        <span class="section-icon">04</span>
                        Opleidingen & Certificeringen
                    </div>
                    <div class="section-content">
                        <div class="field-grid">
                            <div class="field field-full">
                                <div class="field-label">Hoofdopleiding</div>
                                <div class="field-value">${formatValue(form.intake_education_name)}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">Diploma Status</div>
                                <div class="field-value">${formatValue(form.intake_education_diploma)}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">BHV Certificaat</div>
                                <div class="field-value">${formatValue(form.intake_bhv_diploma)}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">BHV Geldig Tot</div>
                                <div class="field-value">${formatValue(form.intake_bhv_valid_until)}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">VCA Certificaat</div>
                                <div class="field-value">${formatValue(form.intake_vca_diploma)}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">VCA Geldig Tot</div>
                                <div class="field-value">${formatValue(form.intake_vca_valid_until)}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">EHBO Certificaat</div>
                                <div class="field-value">${formatValue(form.intake_ehbo_diploma)}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">EHBO Geldig Tot</div>
                                <div class="field-value">${formatValue(form.intake_ehbo_valid_until)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-header">
                        <span class="section-icon">05</span>
                        Vervoer & Taalvaardigheden
                    </div>
                    <div class="section-content">
                        <div class="field-grid">
                            <div class="field">
                                <div class="field-label">Rijbewijs</div>
                                <div class="field-value">${formatValue(form.intake_driver_license)}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">Eigen Vervoer</div>
                                <div class="field-value">${formatValue(form.intake_own_transport)}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">Nederlands - Schrijven</div>
                                <div class="field-value">${formatValue(form.intake_dutch_write)}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">Nederlands - Spreken</div>
                                <div class="field-value">${formatValue(form.intake_dutch_speak)}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">Engels - Schrijven</div>
                                <div class="field-value">${formatValue(form.intake_english_write)}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">Engels - Spreken</div>
                                <div class="field-value">${formatValue(form.intake_english_speak)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-header">
                        <span class="section-icon">06</span>
                        Financiële Situatie & Achtergrond
                    </div>
                    <div class="section-content">
                        <div class="field-grid">
                            <div class="field">
                                <div class="field-label">Uitkering Status</div>
                                <div class="field-value">${formatValue(form.intake_benefits)}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">Politie Aanraking</div>
                                <div class="field-value">${formatValue(form.intake_police_record)}</div>
                            </div>
                            <div class="field field-full">
                                <div class="field-label">Schulden Situatie</div>
                                <div class="field-value long-text">${formatValue(form.intake_debts)}</div>
                            </div>
                            <div class="field field-full">
                                <div class="field-label">Criminele Activiteiten Erkentenis</div>
                                <div class="field-value long-text">${formatValue(form.intake_criminal_activities_ack)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-header">
                        <span class="section-icon">07</span>
                        Motivatie & Doelen
                    </div>
                    <div class="section-content">
                        <div class="field-grid">
                            <div class="field field-full">
                                <div class="field-label">Waarom BMS Security?</div>
                                <div class="field-value long-text">${formatValue(form.intake_motivation_why_bms)}</div>
                            </div>
                            <div class="field field-full">
                                <div class="field-label">Carrière Doelen</div>
                                <div class="field-value long-text">${formatValue(form.intake_motivation_goal)}</div>
                            </div>
                            <div class="field field-full">
                                <div class="field-label">Belangrijke Werkwaarden</div>
                                <div class="field-value long-text">${formatValue(form.intake_motivation_work_important)}</div>
                            </div>
                            <div class="field field-full">
                                <div class="field-label">Vakantie Plannen</div>
                                <div class="field-value long-text">${formatValue(form.intake_vacation_plans)}</div>
                            </div>
                            <div class="field field-full">
                                <div class="field-label">Opleiding Motivatie</div>
                                <div class="field-value long-text">${formatValue(form.intake_aspirant_why_course)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-header">
                        <span class="section-icon">08</span>
                        Verklaring & Toestemming
                    </div>
                    <div class="section-content">
                        <div class="field-grid">
                            <div class="field field-full">
                                <div class="field-label">Aanvullende Opmerkingen</div>
                                <div class="field-value long-text">${formatValue(form.intake_additional_comments)}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">Naam in Verklaring</div>
                                <div class="field-value">${formatValue(form.intake_declaration_name)}</div>
                            </div>
                            <div class="field">
                                <div class="field-label">Datum Handtekening</div>
                                <div class="field-value">${formatValue(form.intake_signature_date)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                ${form.signature_data && form.signature_data.startsWith('data:image/') ? `
                <div class="section">
                    <div class="section-header">
                        <span class="section-icon">09</span>
                        Digitale Handtekening
                    </div>
                    <div class="section-content">
                        <div class="signature-section">
                            <div class="signature-label">Handtekening van Kandidaat</div>
                            <img src="${form.signature_data}" alt="Digitale Handtekening" class="signature-image" />
                        </div>
                    </div>
                </div>
                ` : `
                <div class="section">
                    <div class="section-header">
                        <span class="section-icon">09</span>
                        Handtekening
                    </div>
                    <div class="section-content">
                        <div class="signature-section">
                            <div class="signature-placeholder">
                                Geen digitale handtekening beschikbaar
                            </div>
                        </div>
                    </div>
                </div>
                `}
            </div>

            <div class="document-footer">
                <div class="company-motto">BMS Security - Professional Security Services</div>
                <div class="footer-meta">Document gegenereerd op ${new Date().toLocaleString('nl-NL')}</div>
            </div>
        </div>
    </body>
    </html>
  `;
}
