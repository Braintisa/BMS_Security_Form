#!/bin/bash

echo "Setting up SSL certificate for bmssecurity.work.gd..."
echo ""

# Check if DNS is resolving correctly
CURRENT_IP=$(dig +short bmssecurity.work.gd | tail -1)
CORRECT_IP="142.91.102.23"

echo "Current DNS points to: $CURRENT_IP"
echo "Should point to: $CORRECT_IP"
echo ""

if [ "$CURRENT_IP" = "$CORRECT_IP" ]; then
    echo "✓ DNS is configured correctly!"
    echo "Obtaining SSL certificate..."
    sudo certbot --nginx -d bmssecurity.work.gd -d www.bmssecurity.work.gd --non-interactive --agree-tos --email admin@bmssecurity.work.gd --redirect
    if [ $? -eq 0 ]; then
        echo ""
        echo "✓ SSL certificate installed successfully!"
        echo "Your application is now accessible at:"
        echo "  https://bmssecurity.work.gd"
        echo "  https://www.bmssecurity.work.gd"
    fi
else
    echo "✗ DNS is not configured correctly yet."
    echo "Please update your DNS records:"
    echo "  Type: A Record"
    echo "  Name: @ (or blank)"
    echo "  Value: 142.91.102.23"
    echo "  TTL: 3600 (or default)"
    echo ""
    echo "  Type: A Record"
    echo "  Name: www"
    echo "  Value: 142.91.102.23"
    echo "  TTL: 3600 (or default)"
    echo ""
    echo "After updating DNS, wait a few minutes and run this script again."
fi


