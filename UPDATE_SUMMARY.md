# BMS Security Form - Port 3001 Configuration

## ✅ Configuration Complete

The application is now running on **port 3001** instead of 3000 to avoid conflicts with other services.

## Current Status

✅ **Application running** on port 3001  
✅ **Nginx configured** to proxy to port 3001  
✅ **Firewall configured** with port 3001 open  
✅ **External access enabled** on 0.0.0.0:3001  

## Access URLs

### Direct IP Access:
- **Client Form:** http://142.91.102.23:3001
- **Admin Login:** http://142.91.102.23:3001/admin
- **Admin Dashboard:** http://142.91.102.23:3001/admin/dashboard

### After DNS Configuration:
- **HTTP:** http://bmssecurity.work.gd
- **HTTPS:** https://bmssecurity.work.gd (after SSL setup)

## Admin Credentials
- **Username:** admin
- **Password:** admin123

## Next Steps for Domain Setup

1. **Update DNS Records** at your domain provider (work.gd):
   - **A Record** for `@`: `142.91.102.23`
   - **A Record** for `www`: `142.91.102.23`

2. **Wait for DNS propagation** (5-15 minutes)

3. **Setup SSL certificate:**
   ```bash
   sudo certbot --nginx -d bmssecurity.work.gd -d www.bmssecurity.work.gd --non-interactive --agree-tos --email admin@bmssecurity.work.gd --redirect
   ```

## Firewall Status

Port 3001 is open:
- TCP 3001 - ALLOW
- TCP 3001 (IPv6) - ALLOW

## Managing the Application

### Check if running:
```bash
ps aux | grep "next start"
netstat -tuln | grep 3001
```

### Restart the application:
```bash
cd /opt/BMS_Security_Form_Submit
npm start
```

### View logs:
```bash
# Application logs are visible in the terminal where npm start was run
# Or use nohup if running in background
nohup npm start > /tmp/bms-app.log 2>&1 &
tail -f /tmp/bms-app.log
```

### Stop the application:
```bash
pkill -f "next start"
```

## Configuration Files Updated

1. **package.json** - Updated start script to use port 3001
2. **nginx** - Updated proxy_pass to point to localhost:3001
3. **firewall** - Added port 3001 to allowed ports

## Current Configuration

```
Application: Next.js 15.5.6
Port: 3001
Bind: 0.0.0.0 (accessible from all interfaces)
Database: MySQL on 142.91.102.23:3306
Database Name: bms_form_submit
```

## Troubleshooting

### If you can't access the application:

1. **Check if app is running:**
   ```bash
   netstat -tuln | grep 3001
   ```

2. **Test locally:**
   ```bash
   curl http://localhost:3001
   ```

3. **Test externally:**
   ```bash
   curl http://142.91.102.23:3001
   ```

4. **Check firewall:**
   ```bash
   sudo ufw status | grep 3001
   ```

5. **Check nginx:**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

6. **View nginx logs:**
   ```bash
   sudo tail -f /var/log/nginx/access.log
   sudo tail -f /var/log/nginx/error.log
   ```

## Testing Checklist

- [x] Application builds successfully
- [x] Application starts on port 3001
- [x] Port 3001 is open in firewall
- [x] Application is accessible via IP:142.91.102.23:3001
- [x] Nginx is configured to proxy to port 3001
- [ ] DNS is configured (pending user action)
- [ ] SSL certificate is installed (pending DNS)

