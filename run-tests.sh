#!/bin/bash

echo "=========================================="
echo "GroundZero Test Suite Runner"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to run backend tests
run_backend_tests() {
    echo -e "${YELLOW}Running Backend Tests...${NC}"
    echo ""
    cd Server
    if npm test; then
        echo -e "${GREEN}✓ Backend tests passed${NC}"
        echo ""
        return 0
    else
        echo -e "${RED}✗ Backend tests failed${NC}"
        echo ""
        return 1
    fi
    cd ..
}

# Function to run frontend tests
run_frontend_tests() {
    echo -e "${YELLOW}Running Frontend Tests...${NC}"
    echo ""
    cd Client
    if npm test; then
        echo -e "${GREEN}✓ Frontend tests passed${NC}"
        echo ""
        return 0
    else
        echo -e "${RED}✗ Frontend tests failed${NC}"
        echo ""
        return 1
    fi
    cd ..
}

# Main execution
backend_result=0
frontend_result=0

# Check if specific test suite is requested
if [ "$1" == "backend" ]; then
    run_backend_tests
    backend_result=$?
elif [ "$1" == "frontend" ]; then
    run_frontend_tests
    frontend_result=$?
else
    # Run both
    run_backend_tests
    backend_result=$?
    
    run_frontend_tests
    frontend_result=$?
fi

# Summary
echo "=========================================="
echo "Test Summary"
echo "=========================================="
if [ $backend_result -eq 0 ] && [ $frontend_result -eq 0 ]; then
    echo -e "${GREEN}All tests passed! ✓${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed ✗${NC}"
    exit 1
fi