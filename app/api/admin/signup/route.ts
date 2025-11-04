import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

async function sendEmail(to: string, subject: string, text: string, html?: string) {
  try {
    // Use require to avoid type dependency on @types/nodemailer
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodemailer: any = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "graslydias@gmail.com",
        pass: "jemsjoaeipuikldb",
      },
    });
    await transporter.sendMail({
      from: "graslydias@gmail.com",
      to,
      subject,
      text,
      html,
    });
    return { success: true };
  } catch (err) {
    console.error('Email send failed:', err);
    return { success: false };
  }
}

function generatePassword(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
  let pwd = '';
  for (let i = 0; i < length; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
}

export async function POST(request: Request) {
  try {
    const { formId, email: emailOverride } = await request.json();
    if (!formId) {
      return NextResponse.json({ error: 'formId is required' }, { status: 400 });
    }

    // Fetch form to retrieve email and name
    const [rows] = await pool.query(
      'SELECT id, intake_email, intake_name FROM forms WHERE id = ?',
      [formId]
    ) as any[];
    if ((rows as any).length === 0) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }
    const form = (rows as any)[0];
    const email = emailOverride || form.intake_email;
    if (!email) {
      return NextResponse.json({ error: 'Email not found on form; provide email' }, { status: 400 });
    }

    // Generate password and create user
    const plainPassword = generatePassword();
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    // Insert user
    await pool.query(
      'INSERT INTO users (form_id, email, password_hash, name) VALUES (?, ?, ?, ?)',
      [formId, email, passwordHash, form.intake_name || null]
    );

    // Optionally, mark form status
    await pool.query('UPDATE forms SET status = ? WHERE id = ?', ['accepted', formId]);

    // Compose email (HTML and text)
    const mailSubject = 'BMS Security - Account informatie';
    const baseUrl = "https://bms-security-form.vercel.app";
    const cleanedBase = baseUrl ? baseUrl.replace(/\/$/, '') : '';
    const loginUrl = cleanedBase ? `${cleanedBase}/login` : '#';
    const logoUrl = cleanedBase ? `${cleanedBase}/logo.jpg` : '';
    const brandColor = '#555425';
    const accentColor = '#6a6840';
    const mailText = `Beste ${form.intake_name || ''},\n\nU bent geselecteerd door BMS Security. Dit zijn uw inloggegevens:\n\nE-mail: ${email}\nWachtwoord: ${plainPassword}\n\nBewaar deze gegevens zorgvuldig.\n${baseUrl ? `Inloggen: ${loginUrl}` : ''}\n\nMet vriendelijke groet,\nBMS Security`;
    const mailHtml = `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BMS Security - Account informatie</title>
  <style>
    body { margin:0; padding:0; background:#f5f6f7; font-family: Arial, Helvetica, sans-serif; color:#1f2937; }
    .container { max-width:640px; margin:0 auto; padding:24px; }
    .card { background:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.08); }
    .header { background:${brandColor}; color:#ffffff; padding:20px 24px; display:flex; align-items:center; gap:12px; }
    .logo { width:52px; height:52px; border-radius:12px; background:#ffffff; display:flex; align-items:center; justify-content:center; overflow:hidden; }
    .logo img { width:52px; height:52px; object-fit:cover; display:block; }
    .headtext { display:flex; flex-direction:column; }
    .title { margin:0; font-size:22px; font-weight:700; line-height:1.2; }
    .subtitle { margin:4px 0 0 0; font-size:14px; opacity:0.92; }
    .content { padding:24px; }
    .greeting { font-size:16px; margin:0 0 12px 0; }
    .paragraph { font-size:14px; line-height:1.6; margin:0 0 16px 0; }
    .box { border:2px solid ${brandColor}; border-radius:12px; padding:16px; background:#f5f5f0; }
    .label { font-size:12px; color:#4b5563; margin:0; }
    .value { font-size:16px; font-weight:700; color:#111827; margin:4px 0 12px 0; }
    .button { display:inline-block; background:${brandColor}; color:#ffffff !important; text-decoration:none; padding:12px 20px; border-radius:10px; font-weight:700; letter-spacing:0.3px; cursorL: pointer; }
    .button:hover { background:${accentColor}; }
    .footer { padding:16px 24px 24px 24px; color:#6b7280; font-size:12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        ${logoUrl ? `<div class="logo"><img src="${logoUrl}" alt="BMS Security Logo" /></div>` : ''}
        <div class="headtext">
          <h1 class="title">BMS Security</h1>
          <p class="subtitle">Account informatie</p>
        </div>
      </div>
      <div class="content">
        <p class="greeting">Beste ${form.intake_name || 'kandidaat'},</p>
        <p class="paragraph">U bent geselecteerd door <strong>BMS Security</strong>. Hieronder vindt u uw inloggegevens. Bewaar deze informatie zorgvuldig.</p>
        <div class="box">
          <p class="label">E-mail</p>
          <p class="value">${email}</p>
          <p class="label">Tijdelijk wachtwoord</p>
          <p class="value">${plainPassword}</p>
        </div>
        ${baseUrl ? `<div style="margin-top:20px;">
          <a class="button" href="${loginUrl}?email=${encodeURIComponent(email)}&password=${encodeURIComponent(plainPassword)}" target="_blank" rel="noopener noreferrer">Inloggen</a>
        </div>` : ''}
        <p class="paragraph" style="margin-top:20px;">Bij de eerste keer inloggen adviseren wij om uw wachtwoord te wijzigen.</p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} BMS Security. Alle rechten voorbehouden.</p>
      </div>
    </div>
  </div>
</body>
</html>`;

    await sendEmail(email, mailSubject, mailText, mailHtml);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error && error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Er bestaat al een account met dit e-mailadres.' }, { status: 409 });
    }
    console.error('Signup error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


