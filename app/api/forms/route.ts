import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Parse intake form data
    const intakeForm = (formData.get('intakeForm') as string) || null;
    const signatureData = (formData.get('signatureData') as string) || null;
    
    let intakeData = null;
    if (intakeForm) {
      try {
        intakeData = JSON.parse(intakeForm);
      } catch (error) {
        console.error('Error parsing intake form:', error);
        return NextResponse.json(
          { error: 'Invalid intake form data' },
          { status: 400 }
        );
      }
    }

    // Handle PDF upload (optional)
    let pdfFileName = null;
    const pdfFile = formData.get('pdfFile');
    if (pdfFile && pdfFile !== '' && typeof pdfFile === 'object' && 'arrayBuffer' in pdfFile) {
      try {
        const bytes = await pdfFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'uploads');
        try {
          await fs.access(uploadsDir);
        } catch {
          await fs.mkdir(uploadsDir, { recursive: true });
        }

        // Get filename from the file object
        const fileName = (pdfFile as any).name || 'uploaded_file.pdf';
        
        // Save PDF file
        pdfFileName = `${Date.now()}_${fileName}`;
        const pdfPath = path.join(uploadsDir, pdfFileName);
        await fs.writeFile(pdfPath, buffer);
      } catch (error) {
        console.error('PDF upload error:', error);
        // Continue without PDF if upload fails
      }
    }

    // Handle signature data (base64 image)
    let signatureFileName = null;
    if (signatureData && signatureData.startsWith('data:image/')) {
      try {
        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'uploads');
        try {
          await fs.access(uploadsDir);
        } catch {
          await fs.mkdir(uploadsDir, { recursive: true });
        }

        // Convert base64 to buffer
        const base64Data = signatureData.replace(/^data:image\/[a-z]+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Save signature file
        signatureFileName = `signature_${Date.now()}.png`;
        const signaturePath = path.join(uploadsDir, signatureFileName);
        await fs.writeFile(signaturePath, buffer);
      } catch (error) {
        console.error('Signature save error:', error);
        // Continue without signature file if save fails
      }
    }

    // Insert form data into database with new schema
    const [result] = await pool.query(
      `INSERT INTO forms (
        intake_data, signature_data, signature_file_path, pdf_path, declaration_name,
        intake_name, intake_address, intake_postal_code, intake_city, intake_mobile_phone, intake_home_phone,
        intake_birth_date, intake_birth_place, intake_nationality, intake_marital_status, intake_email,
        intake_emergency_number, intake_emergency_name, intake_hobbies, intake_sport, intake_clothing_size, intake_pants_size,
        intake_education_name, intake_education_diploma, intake_bhv_diploma, intake_bhv_valid_until,
        intake_vca_diploma, intake_vca_valid_until, intake_ehbo_diploma, intake_ehbo_valid_until,
        intake_driver_license, intake_own_transport, intake_dutch_write, intake_dutch_speak, intake_english_write, intake_english_speak,
        intake_benefits, intake_debts, intake_availability, intake_police_record, intake_criminal_activities_ack,
        intake_motivation_why_bms, intake_motivation_goal, intake_motivation_work_important, intake_vacation_plans, intake_aspirant_why_course,
        intake_additional_comments, intake_declaration_name, intake_signature_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        intakeForm, // Store JSON in intake_data column
        signatureData, // Store base64 signature data
        signatureFileName,
        pdfFileName,
        intakeData?.declarationName || null,
        
        // Personal Information
        intakeData?.name || null,
        intakeData?.address || null,
        intakeData?.postalCode || null,
        intakeData?.city || null,
        intakeData?.mobilePhone || null,
        intakeData?.homePhone || null,
        intakeData?.birthDate || null,
        intakeData?.birthPlace || null,
        intakeData?.nationality || null,
        intakeData?.maritalStatus || null,
        intakeData?.email || null,
        
        // Emergency Contact
        intakeData?.emergencyNumber || null,
        intakeData?.emergencyName || null,
        
        // Personal Details
        intakeData?.hobbies || null,
        intakeData?.sport || null,
        intakeData?.clothingSize || null,
        intakeData?.pantsSize || null,
        
        // Education
        intakeData?.educationName || null,
        intakeData?.educationDiploma || null,
        intakeData?.bhvDiploma || null,
        intakeData?.bhvValidUntil || null,
        intakeData?.vcaDiploma || null,
        intakeData?.vcaValidUntil || null,
        intakeData?.ehboDiploma || null,
        intakeData?.ehboValidUntil || null,
        
        // Transport & Languages
        intakeData?.driverLicense || null,
        intakeData?.ownTransport || null,
        intakeData?.dutchWrite || null,
        intakeData?.dutchSpeak || null,
        intakeData?.englishWrite || null,
        intakeData?.englishSpeak || null,
        
        // Benefits & Availability
        intakeData?.benefits || null,
        intakeData?.debts || null,
        JSON.stringify(intakeData?.availability || null), // Store availability as JSON string
        
        // Background & Motivation
        intakeData?.policeRecord || null,
        intakeData?.criminalActivitiesAck || null,
        intakeData?.motivationWhyBms || null,
        intakeData?.motivationGoal || null,
        intakeData?.motivationWorkImportant || null,
        intakeData?.vacationPlans || null,
        intakeData?.aspirantWhyCourse || null,
        
        // Declaration
        intakeData?.additionalComments || null,
        intakeData?.declarationName || null,
        intakeData?.signatureDate || null
      ]
    );

    return NextResponse.json({ 
      message: 'Form submitted successfully',
      id: (result as any).insertId 
    });
  } catch (error: any) {
    console.error('Form submission error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get('authorization');

    // Check authorization (admin access)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    // In production, verify the JWT token here
    // For simplicity, we'll skip this step

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
      FROM forms ORDER BY submitted_at DESC`
    );

    return NextResponse.json({ forms: rows });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}