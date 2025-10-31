# BMS Security Form Submission Application

A Next.js-based form submission system for BMS Security with client-side form interface and admin dashboard.

## Features

### Client Side
- Interactive web form for submitting security service requests
- Downloadable Word document (DOCX) template for manual completion
- PDF upload functionality for filled documents (users convert DOCX to PDF)
- Real-time form validation
- Success/error messaging

### Admin Side
- Secure login system with JWT authentication
- Dashboard displaying all submitted forms
- View detailed form information in modal
- Download submitted PDF forms
- Logout functionality

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **PDF Handling**: PDF-lib

## Database Setup

### Connection Details
- Host: 142.91.102.23
- User: imesh
- Password: Imesh2001@
- Port: 3306
- Database: bms_form_submit

### Default Admin Credentials
- Username: admin
- Password: admin123

## Installation

1. Install dependencies:
```bash
npm install
```

2. Initialize the database:
Visit `http://localhost:3000/api/db-init` in your browser or run:
```bash
curl -X POST http://localhost:3000/api/db-init
```

3. Copy the template files:
Ensure `web_page_form.docx` is in the public folder (for manual download)

4. Start the development server:
```bash
npm run dev
```

## Usage

### Client Side
1. Navigate to `http://localhost:3000`
2. Fill out the form with required information
3. Click "Download Form Template (DOCX)" to get the Word document template
4. Fill out and sign the Word document
5. Save it as PDF
6. Upload the PDF version
7. Click "Submit Form"

### Admin Side
1. Navigate to `http://localhost:3000/admin`
2. Login with admin credentials
3. View all submitted forms in the dashboard
4. Click "View" to see form details
5. Download PDFs as needed

## Project Structure

```
form_submit/
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   └── login/route.ts       # Admin authentication
│   │   ├── db-init/route.ts          # Database initialization
│   │   └── forms/
│   │       ├── route.ts               # Form submission & listing
│   │       ├── [id]/route.ts         # Get form by ID
│   │       └── download/[filename]/route.ts  # PDF download
│   ├── admin/
│   │   ├── page.tsx                  # Admin login
│   │   └── dashboard/page.tsx        # Admin dashboard
│   ├── layout.tsx                    # Root layout
│   ├── globals.css                   # Global styles
│   └── page.tsx                      # Client form page
├── lib/
│   └── db.ts                         # Database connection
├── uploads/                          # Submitted PDF storage
├── public/                           # Static files
│   ├── web_page_form.docx           # Downloadable template for users
│   └── form_template_for_manual_download.pdf  # Reference for web form fields
└── package.json

```

## Database Schema

### Tables

#### admins
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- username (VARCHAR(50), UNIQUE, NOT NULL)
- password (VARCHAR(255), NOT NULL)
- created_at (TIMESTAMP)

#### forms
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- name (VARCHAR(100), NOT NULL)
- email (VARCHAR(100), NOT NULL)
- phone (VARCHAR(20), NOT NULL)
- address (TEXT, NOT NULL)
- service_type (VARCHAR(100))
- message (TEXT)
- pdf_path (VARCHAR(255))
- submitted_at (TIMESTAMP)
- status (VARCHAR(20), DEFAULT 'pending')

## Security Notes

1. Change the default admin password after first login
2. Update JWT_SECRET in production
3. Implement proper file upload validation
4. Add rate limiting for API routes
5. Use HTTPS in production
6. Implement CSRF protection

## Production Deployment

1. Set environment variables
2. Build the application: `npm run build`
3. Start production server: `npm start`
4. Ensure database is accessible
5. Configure reverse proxy (nginx)
6. Set up SSL certificate
7. Implement backup strategy for uploads

## License

© 2024 BMS Security. All rights reserved.

