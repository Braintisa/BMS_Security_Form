# Domain Setup for bmssecurity.work.gd

## Current Status

✅ **Next.js application** - Built and running on port 3000  
✅ **Nginx configuration** - Created for bmssecurity.work.gd  
✅ **Reverse proxy** - Configured to proxy to localhost:3000  
⏳ **SSL certificate** - Pending DNS configuration  

## ⚠️ IMPORTANT: DNS Configuration Required

Your domain **bmssecurity.work.gd** is currently pointing to **162.120.184.60**, but your VPS IP is **142.91.102.23**.

### To Fix DNS (Required):

1. Log in to your domain provider (work.gd)
2. Go to DNS Management
3. Update/create these DNS records:

#### Record 1: Root Domain
- **Type:** A Record
- **Name:** @ (or leave blank)
- **Value:** `142.91.102.23`
- **TTL:** 3600 (or default)

#### Record 2: WWW Subdomain
- **Type:** A Record  
- **Name:** www
- **Value:** `142.91.102.23`
- **TTL:** 3600 (or default)

4. Wait 5-15 minutes for DNS propagation

### To Get SSL Certificate (After DNS is Fixed):

Run this command once DNS is pointing to the correct IP:

```bash
cd /opt/BMS_Security_Form_Submit
sudo ./setup-ssl.sh
```

Or manually:

```bash
sudo certbot --nginx -d bmssecurity.work.gd -d www.bmssecurity.work.gd --non-interactive --agree-tos --email admin@bmssecurity.work.gd --redirect
```

## Accessing Your Application

Once DNS is configured correctly:

- **With HTTP (before SSL):** http://bmssecurity.work.gd
- **With HTTPS (after SSL):** https://bmssecurity.work.gd

### Pages:
- Client Form: `http://bmssecurity.work.gd`
- Admin Login: `http://bmssecurity.work.gd/admin`
- Admin Dashboard: `http://bmssecurity.work.gd/admin/dashboard`

## Server Details

- **VPS IP:** 142.91.102.23
- **App is running on:** localhost:3000
- **Listening on:** 0.0.0.0:3000 (accessible externally)
- **Nginx proxy:** Configured for port 80/443 → 3000

## Application URLs (Direct IP Access)

While waiting for DNS:
- http://142.91.102.23:3000
- http://142.91.102.23:3000/admin

## Managing the Application

### Check if app is running:
```bash
ps aux | grep next
```

### View app logs:
```bash
journalctl -u bms-form-app -f  # if running as a service
# or
pm2 logs  # if using pm2
```

### Restart the app:
```bash
cd /opt/BMS_Security_Form_Submit
npm start
```

### Check nginx status:
```bash
sudo systemctl status nginx
```

### Reload nginx config:
```bash
sudo systemctl reload nginx
```

### Test nginx config:
```bash
sudo nginx -t
```

## Verification Commands

```bash
# Check DNS resolution
dig +short bmssecurity.work.gd

# Check if app is listening
netstat -tuln | grep 3000

# Test HTTP connectivity
curl -I http://localhost:3000

# Check SSL certificate (after setup)
sudo certbot certificates
```

## Next Steps

1. **Update DNS records** in your domain provider's dashboard
2. Wait for DNS propagation (5-15 minutes)
3. Run the SSL setup script: `sudo ./setup-ssl.sh`
4. Your application will be accessible at https://bmssecurity.work.gd

## Troubleshooting

### If domain doesn't resolve:
- Check DNS settings in your domain provider
- Use `dig bmssecurity.work.gd` to check current IP
- Wait longer for DNS propagation (up to 48 hours in rare cases)

### If SSL certificate fails:
- Make sure port 80 and 443 are open in firewall
- Check that DNS is pointing to the correct IP (142.91.102.23)
- Verify domain is accessible from the internet

### If app is not responding:
```bash
# Check if app is running
ps aux | grep next

# Check nginx logs
sudo tail -f /var/log/nginx/error.log

# Restart nginx
sudo systemctl restart nginx
```


