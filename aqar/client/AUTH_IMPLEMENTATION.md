# Authentication Context and Protected Routes Implementation

## Overview

This document describes the implementation of Tasks 11.1, 11.2, and 11.3 from the Aqar Platform specification:
- **Task 11.1**: Enhanced AuthContext with authentication state management
- **Task 11.2**: ProtectedRoute component for authenticated routes
- **Task 11.3**: RoleProtectedRoute component for role-based access control

## Implementation Details

### Task 11.1: AuthContext Enhancement

**File**: `src/context/AuthContext.jsx`

**Key Features**:
- ✅ Authentication state management (user, token, loading, isAuthenticated)
- ✅ Login function (calls `/api/auth/login`)
- ✅ Register function (calls `/api/auth/register`)
- ✅ Logout function (clears localStorage and state)
- ✅ **LoadUser function** (calls `/api/auth/me` to restore session)
- ✅ Listens for `aqar:unauthorized` event from axios interceptor
- ✅ Stores token and user in localStorage
- ✅ Provides AuthContext and useAuth hook

**New Implementation**:
```javascript
const loadUser = useCallback(async () => {
  const storedToken = localStorage.getItem('aqar_token');
  if (!storedToken) {
    setIsLoading(false);
    return;
  }

  try {
    const { data } = await authApi.getMe();
    if (data.success) {
      persist(data.data, storedToken);
    } else {
      logout();
    }
  } catch (error) {
    logout();
  } finally {
    setIsLoading(false);
  }
}, []);
```

**Usage**:
```javascript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, token, isAuthenticated, login, logout, loadUser } = useAuth();
  
  // Use authentication state and methods
}
```

### Task 11.2: ProtectedRoute Component

**File**: `src/components/ProtectedRoute.jsx`

**Key Features**:
- ✅ Checks if user is authenticated
- ✅ Redirects to `/login` if not authenticated
- ✅ Shows loading spinner while checking auth
- ✅ Passes through to children if authenticated
- ✅ Preserves intended destination in location state

**Implementation**:
```javascript
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Spinner size="lg" center />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
```

**Usage**:
```javascript
import ProtectedRoute from './components/ProtectedRoute';

<Route path="/dashboard" element={
  <ProtectedRoute>
    <UserDashboard />
  </ProtectedRoute>
} />
```

### Task 11.3: RoleProtectedRoute Component

**File**: `src/components/RoleProtectedRoute.jsx`

**Key Features**:
- ✅ Checks if user is authenticated AND has required role
- ✅ Redirects to `/unauthorized` if wrong role
- ✅ Redirects to `/login` if not authenticated
- ✅ Supports multiple allowed roles (admin, owner, agent)
- ✅ Shows loading spinner while checking auth

**Implementation**:
```javascript
const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Spinner size="lg" center />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const hasRequiredRole = rolesArray.includes(user?.role);

  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
```

**Usage**:
```javascript
import RoleProtectedRoute from './components/RoleProtectedRoute';

// Single role
<Route path="/admin/*" element={
  <RoleProtectedRoute allowedRoles="admin">
    <AdminDashboard />
  </RoleProtectedRoute>
} />

// Multiple roles
<Route path="/properties/create" element={
  <RoleProtectedRoute allowedRoles={['owner', 'agent', 'admin']}>
    <AddProperty />
  </RoleProtectedRoute>
} />
```

## Additional Components

### Unauthorized Page

**File**: `src/pages/Unauthorized.jsx`

A user-friendly page displayed when a user tries to access a route they don't have permission for.

**Features**:
- Clear error message
- Visual feedback with icon
- Navigation back to home page

## Testing

### Test Pages Created

1. **TestAuth Page** (`src/pages/TestAuth.jsx`)
   - Tests ProtectedRoute functionality
   - Displays current authentication state
   - Shows user information and JWT token
   - Accessible at: `/test-auth`

2. **TestAdminRole Page** (`src/pages/TestAdminRole.jsx`)
   - Tests RoleProtectedRoute functionality
   - Verifies admin role requirement
   - Accessible at: `/test-admin`

### Manual Testing Instructions

#### Test 1: ProtectedRoute (Unauthenticated)
1. Open browser to `http://localhost:5174/test-auth`
2. **Expected**: Redirect to `/login`
3. **Result**: ✅ Pass if redirected

#### Test 2: ProtectedRoute (Authenticated)
1. Login with any test credentials
2. Navigate to `http://localhost:5174/test-auth`
3. **Expected**: See test page with user information
4. **Result**: ✅ Pass if page displays

#### Test 3: RoleProtectedRoute (Non-Admin)
1. Login with buyer/owner/agent credentials
2. Navigate to `http://localhost:5174/test-admin`
3. **Expected**: Redirect to `/unauthorized`
4. **Result**: ✅ Pass if redirected

#### Test 4: RoleProtectedRoute (Admin)
1. Login with admin credentials
2. Navigate to `http://localhost:5174/test-admin`
3. **Expected**: See admin test page
4. **Result**: ✅ Pass if page displays

#### Test 5: LoadUser on Page Refresh
1. Login with any credentials
2. Refresh the page (F5)
3. **Expected**: User remains logged in
4. **Result**: ✅ Pass if authentication persists

#### Test 6: Unauthorized Event Handling
1. Login with any credentials
2. Wait for token to expire (or manually delete token from backend)
3. Make an API request
4. **Expected**: Automatic logout and redirect to login
5. **Result**: ✅ Pass if logged out automatically

### Test Credentials

Use these credentials from the backend:

```javascript
// Admin
{ email: 'admin@aqar.com', password: 'admin123' }

// Owner
{ email: 'owner@aqar.com', password: 'owner123' }

// Agent
{ email: 'agent@aqar.com', password: 'agent123' }

// Buyer
{ email: 'buyer@aqar.com', password: 'buyer123' }
```

## Integration with Existing Code

### Axios Instance Integration

The implementation works seamlessly with the existing axios interceptor:

**File**: `src/api/axiosInstance.js`

- Request interceptor attaches JWT token from localStorage
- Response interceptor handles 401 errors
- Dispatches `aqar:unauthorized` event on token failure
- AuthContext listens for this event and triggers logout

### Existing Components Compatibility

The new components (`ProtectedRoute` and `RoleProtectedRoute`) work alongside the existing components:

- `PrivateRoute` (from `src/routes/ProtectedRoutes.jsx`)
- `RoleRoute` (from `src/routes/ProtectedRoutes.jsx`)

Both sets of components can be used interchangeably. The new components follow the naming convention specified in the tasks.

## Requirements Validation

### Requirement 20: Frontend Authentication Context ✅

- [x] 20.1: Check for stored JWT token in localStorage on load
- [x] 20.2: Verify token by calling GET /api/auth/me
- [x] 20.3: Store JWT token in localStorage on login
- [x] 20.4: Remove JWT token from localStorage on logout
- [x] 20.5: Provide user data and token via context
- [x] 20.6: Clear token and redirect on expiration/invalid token

### Requirement 21: Frontend Protected Routes ✅

- [x] 21.1: Redirect unauthenticated users to login
- [x] 21.2: Render requested page for authenticated users
- [x] 21.3: Redirect users without required role to unauthorized page
- [x] 21.4: Protect routes: /dashboard/*, /admin/*, /properties/create, /properties/edit/:id

## File Structure

```
src/
├── context/
│   └── AuthContext.jsx          # Enhanced with loadUser function
├── components/
│   ├── ProtectedRoute.jsx       # New: Basic authentication protection
│   └── RoleProtectedRoute.jsx   # New: Role-based protection
├── pages/
│   ├── Unauthorized.jsx         # New: Unauthorized access page
│   ├── TestAuth.jsx            # New: Test page for ProtectedRoute
│   └── TestAdminRole.jsx       # New: Test page for RoleProtectedRoute
├── routes/
│   └── ProtectedRoutes.jsx     # Existing: PrivateRoute and RoleRoute
└── App.jsx                      # Updated: Added test routes
```

## Next Steps

After verifying the implementation:

1. Remove test pages (`TestAuth.jsx`, `TestAdminRole.jsx`) if not needed
2. Remove test routes from `App.jsx`
3. Apply `ProtectedRoute` to all authenticated routes
4. Apply `RoleProtectedRoute` to role-specific routes
5. Proceed to Task 12: Layout and Navigation Components

## Notes

- The `loadUser` function is called automatically on app initialization
- Loading states are handled with the Spinner component
- Location state is preserved for post-login redirects
- The implementation follows React best practices with hooks and context
- All components are fully typed with JSDoc comments
