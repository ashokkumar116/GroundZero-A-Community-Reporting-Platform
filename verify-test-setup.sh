#!/bin/bash

echo "=========================================="
echo "Test Setup Verification"
echo "=========================================="
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

errors=0

echo "Checking backend test structure..."
[ -f "Server/__tests__/controllers/adminControllers.test.js" ] && echo -e "${GREEN}✓${NC} Backend test file exists" || { echo -e "${RED}✗${NC} Backend test file missing"; ((errors++)); }
[ -f "Server/jest.config.js" ] && echo -e "${GREEN}✓${NC} Jest configuration exists" || { echo -e "${RED}✗${NC} Jest configuration missing"; ((errors++)); }

echo ""
echo "Checking frontend test structure..."
[ -f "Client/src/__tests__/components/Overlays/ActionsOverlay.test.jsx" ] && echo -e "${GREEN}✓${NC} ActionsOverlay test exists" || { echo -e "${RED}✗${NC} ActionsOverlay test missing"; ((errors++)); }
[ -f "Client/src/__tests__/components/Modals/ProfileEditModal.test.jsx" ] && echo -e "${GREEN}✓${NC} ProfileEditModal test exists" || { echo -e "${RED}✗${NC} ProfileEditModal test missing"; ((errors++)); }
[ -f "Client/src/__tests__/pages/AdminPages/ManageUsers.test.jsx" ] && echo -e "${GREEN}✓${NC} ManageUsers test exists" || { echo -e "${RED}✗${NC} ManageUsers test missing"; ((errors++)); }
[ -f "Client/vitest.config.js" ] && echo -e "${GREEN}✓${NC} Vitest configuration exists" || { echo -e "${RED}✗${NC} Vitest configuration missing"; ((errors++)); }
[ -f "Client/src/__tests__/setup.js" ] && echo -e "${GREEN}✓${NC} Test setup file exists" || { echo -e "${RED}✗${NC} Test setup file missing"; ((errors++)); }

echo ""
echo "Checking documentation..."
[ -f "TESTING.md" ] && echo -e "${GREEN}✓${NC} Testing documentation exists" || { echo -e "${RED}✗${NC} Testing documentation missing"; ((errors++)); }
[ -f "TEST_SUMMARY.md" ] && echo -e "${GREEN}✓${NC} Test summary exists" || { echo -e "${RED}✗${NC} Test summary missing"; ((errors++)); }

echo ""
echo "=========================================="
if [ $errors -eq 0 ]; then
    echo -e "${GREEN}All checks passed! ✓${NC}"
    echo ""
    echo "Next steps:"
    echo "1. cd Server && npm install"
    echo "2. cd Client && npm install"
    echo "3. Run tests with: ./run-tests.sh"
else
    echo -e "${RED}$errors check(s) failed ✗${NC}"
    exit 1
fi
echo "=========================================="