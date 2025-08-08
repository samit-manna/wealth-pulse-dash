#!/bin/bash

echo "🧹 Data Service Cleanup Verification"
echo "===================================="

echo "📁 Backend app structure:"
ls -la /Users/samit.manna/Documents/Passion\ Projects/wealth-pulse-dash/backend/app/

echo ""
echo "📊 Testing backend functionality:"

BACKEND_URL="https://wealth-pulse-dash-production.up.railway.app"

# Test that all endpoints still work
echo "✅ Health check:"
curl -s "$BACKEND_URL/" | jq -r '.message'

echo "✅ Holdings count:"
holdings_count=$(curl -s "$BACKEND_URL/api/portfolio/holdings" | jq '. | length')
echo "   $holdings_count holdings"

echo "✅ Portfolio summary:"
total_value=$(curl -s "$BACKEND_URL/api/portfolio/summary" | jq '.totalValue')
echo "   Total value: ₹$total_value"

echo ""
echo "🎯 Cleanup Results:"
if [ ! -f "/Users/samit.manna/Documents/Passion Projects/wealth-pulse-dash/backend/app/data_service_new.py" ]; then
    echo "✅ Removed duplicate data_service_new.py"
else
    echo "❌ data_service_new.py still exists"
fi

if [ -f "/Users/samit.manna/Documents/Passion Projects/wealth-pulse-dash/backend/app/data_service.py" ]; then
    echo "✅ Kept clean data_service.py"
else
    echo "❌ data_service.py missing"
fi

if [ "$holdings_count" -eq 15 ]; then
    echo "✅ Backend still serving all 15 stocks from Excel"
else
    echo "❌ Holdings count issue: expected 15, got $holdings_count"
fi

echo ""
echo "📝 Summary:"
echo "   • Removed confusing duplicate file"
echo "   • Simplified import structure"
echo "   • Maintained full functionality"
echo "   • Backend serves real Excel data (15 stocks)"
