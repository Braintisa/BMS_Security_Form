# Getting Started Guide

## Quick Start

1. **Database Setup** (Already Done!)
   ```bash
   npm run setup
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Client Form: http://localhost:3000
   - Admin Login: http://localhost:3000/admin

## Default Admin Credentials

- **Username:** admin
- **Password:** admin123

⚠️ **Important:** Change the password after first login in production!

## How to Use

### For End Users (Client Side)

1. Go to http://localhost:3000
2. Fill out the form with your information:
   - Name (required)
   - Email (required)
   - Phone (required)
   - Address (required)
   - Service Type (optional)
   - Message (optional)
3. Click "Download Form Template (DOCX)"
4. Fill out the Word document template
5. Save the document as PDF
6. Upload the converted PDF
7. Click "Submit Form"
8. You'll receive a confirmation message

### For Administrators

1. Go to http://localhost:3000/admin
2. Login with admin credentials
3. View all submitted forms in the dashboard
4. Click "View" to see detailed form information
5. Download PDFs as needed
6. Click "Logout" when done

## Features

✅ Interactive web form
✅ Word document (DOCX) template download
✅ PDF file upload functionality
✅ Admin dashboard
✅ Secure authentication
✅ Form listing with details
✅ PDF download capability

## Troubleshooting

### Database Connection Error
- Verify database credentials in `lib/db.ts`
- Ensure database server is accessible
- Check firewall settings

### PDF Upload Fails
- Check if `uploads/` folder exists
- Verify file permissions
- Check file size limits

### Admin Login Not Working
- Ensure database setup completed
- Try resetting admin password in database
- Check browser console for errors

## File Structure

```
├── app/
│   ├── page.tsx              # Client form page
│   ├── admin/
│   │   ├── page.tsx          # Admin login
│   │   └── dashboard/page.tsx # Admin dashboard
│   ├── api/                   # API routes
│   └── globals.css            # Global styles
├── lib/
│   └── db.ts                  # Database connection
├── uploads/                   # PDF storage
├── public/                    # Static files
└── setup.js                   # Database setup script
```

## Production Deployment

1. Update environment variables
2. Run `npm run build`
3. Start with `npm start`
4. Configure reverse proxy (nginx)
5. Set up SSL certificate
6. Configure automated backups

## Support

For issues or questions, contact the development team.

