# GroundZero Testing Guide

## 🎯 Overview

This repository includes a comprehensive test suite covering all changes in the current branch.

## 📋 What's Been Tested

### Backend Changes
- ✅ `getUsers` - User listing with pagination
- ✅ `editUser` - Admin user profile editing
- ✅ `makeAdmin` - Promote user to admin
- ✅ `removeAdmin` - Demote admin to user
- ✅ `searchUsers` - User search functionality

### Frontend Changes
- ✅ `ActionsOverlay.jsx` - User action menu component
- ✅ `ProfileEditModal.jsx` - Profile editing modal
- ✅ `ManageUsers.jsx` - User management page

## 🚀 Quick Start

### Run All Tests
```bash
./run-tests.sh
```

### Backend Only
```bash
cd Server
npm install
npm test
```

### Frontend Only
```bash
cd Client
npm install
npm test
```

### Verify Setup
```bash
./verify-test-setup.sh
```

## 📊 Test Coverage

### Backend
- Test File: `Server/__tests__/controllers/adminControllers.test.js`
- Test Cases: 45+
- Functions Covered: 5/5 (100%)

### Frontend
- Test Files: 3 files
- Test Cases: 67+
- Components Covered: 3/3 (100%)

## 🧪 Technologies

### Backend
- Jest
- Supertest
- MongoDB Memory Server

### Frontend
- Vitest
- React Testing Library
- Happy DOM

## 📁 Structure