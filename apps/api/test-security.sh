#!/bin/bash

echo "🔒 Security Features Test Script"
echo "================================"

# Base URL for the API
API_URL="http://localhost:3000"

echo ""
echo "1. Testing Rate Limiting on Login Endpoint"
echo "   (Should block after 5 attempts in 1 minute)"
echo ""

for i in {1..6}; do
  echo "Attempt $i:"
  curl -X POST "${API_URL}/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrongpassword"}' \
    -w "HTTP Status: %{http_code}\n" \
    -s -o /dev/null
  sleep 1
done

echo ""
echo "2. Testing Brute Force Protection"
echo "   (Account lockout after 5 failed attempts)"
echo ""

for i in {1..6}; do
  echo "Brute force attempt $i:"
  curl -X POST "${API_URL}/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@example.com","password":"wrongpassword"}' \
    -w "HTTP Status: %{http_code}\n" \
    -s -o /dev/null
  sleep 1
done

echo ""
echo "3. Testing Security Headers"
echo "   (Should show Helmet security headers)"
echo ""

curl -I "${API_URL}/" 2>/dev/null | grep -E "(X-|Strict-Transport-Security|Content-Security-Policy)"

echo ""
echo "4. Testing Registration Rate Limiting"
echo "   (Should allow medium rate limit)"
echo ""

curl -X POST "${API_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com","password":"TestPassword123!","firstName":"Test","lastName":"User"}' \
  -w "HTTP Status: %{http_code}\n" \
  -s -o /dev/null

echo ""
echo "🎯 Test completed! Check the console output above for security feature behavior."
echo ""
echo "📋 Security Features Implemented:"
echo "   ✅ Rate Limiting (5 login attempts/min, 30 general requests/min)"
echo "   ✅ Brute Force Protection (Account lockout after 5 failed attempts)"
echo "   ✅ IP Whitelisting/Blacklisting"
echo "   ✅ Security Headers (Helmet integration)"
echo "   ✅ Advanced Client Tracking (IP + User Agent hash)"
echo "   ✅ Security Event Logging"
echo ""
echo "🚀 Start the API server with: npm run start:dev"
echo "📖 Check logs for detailed security events"
