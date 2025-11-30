# Testing Documentation

This document provides comprehensive information about the test suite for the GroundZero application.

## Overview

The project uses different testing frameworks for backend and frontend:

- **Backend (Server)**: Jest + Supertest + MongoDB Memory Server
- **Frontend (Client)**: Vitest + React Testing Library + Happy DOM

## Installation

### Backend Testing Dependencies

```bash
cd Server
npm install --save-dev jest supertest mongodb-memory-server @types/jest
```

### Frontend Testing Dependencies

```bash
cd Client
npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event happy-dom
```

## Running Tests

### Backend Tests

```bash
# Run all backend tests
cd Server
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test suite
npm run test:controllers

# Run with coverage
npm test -- --coverage
```

### Frontend Tests

```bash
# Run all frontend tests
cd Client
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run with coverage
npm test -- --coverage
```

## Test Structure

### Backend Tests

Located in `Server/__tests__/controllers/adminControllers.test.js`

Tests cover:
- User pagination and listing
- User profile editing by admin
- Admin promotion/demotion
- User search functionality
- Edge cases and error handling

### Frontend Tests

Located in `Client/src/__tests__/`:
- `components/Overlays/ActionsOverlay.test.jsx`
- `components/Modals/ProfileEditModal.test.jsx`
- `pages/AdminPages/ManageUsers.test.jsx`

## Best Practices

1. **Backend (Jest)**
   - Use MongoDB Memory Server for isolated testing
   - Clean state between tests with `beforeEach`
   - Mock middleware appropriately
   - Test both success and error scenarios

2. **Frontend (Vitest)**
   - Mock external dependencies (axios, toast)
   - Use waitFor for async operations
   - Test user interactions thoroughly
   - Verify component state changes

## Troubleshooting

### MongoDB Memory Server Issues
If tests fail to start, try increasing timeout in `jest.config.js`

### Frontend Import Errors
Verify `vitest.config.js` has correct path aliases

### Test Timeout
Increase timeout values in configuration files

## CI/CD Integration

These tests are ready for CI/CD pipelines. Example GitHub Actions:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Backend Dependencies
        run: cd Server && npm install
      - name: Run Backend Tests
        run: cd Server && npm test
      - name: Install Frontend Dependencies
        run: cd Client && npm install
      - name: Run Frontend Tests
        run: cd Client && npm test
```

## Coverage Goals

- Statements: > 80%
- Branches: > 75%
- Functions: > 80%
- Lines: > 80%

For detailed information, see TEST_SUMMARY.md and TESTING_GUIDE.md.