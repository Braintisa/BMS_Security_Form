# Testing Checklist

## Client Side Testing

- [ ] Access http://localhost:3000
- [ ] Fill out all form fields
- [ ] Click "Download Form Template" button
  - [ ] PDF downloads successfully
- [ ] Fill out the PDF template manually
- [ ] Upload the filled PDF
- [ ] Submit the form
  - [ ] Success message displays
  - [ ] Form data is saved to database

## Admin Side Testing

- [ ] Access http://localhost:3000/admin
- [ ] Login with admin/admin123
  - [ ] Dashboard loads successfully
- [ ] View submitted forms table
  - [ ] All submitted forms are listed
  - [ ] Form details are visible
- [ ] Click "View" on any form
  - [ ] Modal opens
  - [ ] All form details are displayed
  - [ ] Download PDF button works
- [ ] Click "Download Submitted PDF"
  - [ ] PDF file downloads
  - [ ] File is the same as uploaded
- [ ] Logout
  - [ ] Redirects to login page

## Database Testing

- [ ] Connect to database
- [ ] Check `forms` table
  - [ ] All submitted forms are in table
  - [ ] Data matches submitted form
- [ ] Check `admins` table
  - [ ] Admin user exists
  - [ ] Password is hashed

## Error Handling

- [ ] Submit form without required fields
  - [ ] Validation errors display
- [ ] Submit form without PDF
  - [ ] Error message displays
- [ ] Try to access admin without login
  - [ ] Redirects to login page
- [ ] Login with wrong credentials
  - [ ] Error message displays

## Performance

- [ ] Form submission is quick (< 2 seconds)
- [ ] Admin dashboard loads quickly
- [ ] PDF downloads are instant
- [ ] No console errors

## Notes

- Database: bms_form_submit
- Host: 142.91.102.23
- Default Admin: admin/admin123
- Upload Directory: /uploads
- Template Location: /public/form_template_for_manual_download.pdf

