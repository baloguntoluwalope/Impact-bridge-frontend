import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { PageLoader } from './components/common/Loader';
import PublicLayout    from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// ─── Pages ────────────────────────────────────────────────────────
const Home                = lazy(() => import('./pages/Home'));
const About               = lazy(() => import('./pages/About'));
const Contact             = lazy(() => import('./pages/Contact'));
const NotFound            = lazy(() => import('./pages/NotFound'));

const Login               = lazy(() => import('./pages/auth/Login'));
const Register            = lazy(() => import('./pages/auth/Register'));
const VerifyEmail         = lazy(() => import('./pages/auth/VerifyEmail'));
const ForgotPassword      = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword       = lazy(() => import('./pages/auth/ResetPassword'));

// Public browsing
const Requests            = lazy(() => import('./pages/requests/Requests'));
const RequestDetail       = lazy(() => import('./pages/requests/RequestDetail'));
const Projects            = lazy(() => import('./pages/projects/Projects'));
const ProjectDetail       = lazy(() => import('./pages/projects/ProjectDetail'));
const SDGPage             = lazy(() => import('./pages/sdg/SDGPage'));
const SDGDetail           = lazy(() => import('./pages/sdg/SDGDetail'));

// Protected — shared
const SubmitRequest       = lazy(() => import('./pages/requests/SubmitRequest'));
const MyRequests          = lazy(() => import('./pages/requests/MyRequests'));
const Notifications       = lazy(() => import('./pages/notifications/Notifications'));
const Profile             = lazy(() => import('./pages/profile/Profile'));

// Protected — dashboards
const RequesterDashboard  = lazy(() => import('./pages/requester/RequesterDashboard'));
const DonorDashboard      = lazy(() => import('./pages/donors/DonorDashboard'));
const DonationHistory     = lazy(() => import('./pages/donors/DonationHistory'));
const DonorImpact         = lazy(() => import('./pages/donors/DonorImpact'));
const CorporateDashboard  = lazy(() => import('./pages/corporate/CorporateDashboard'));
const AdminDashboard      = lazy(() => import('./pages/dashboard/AdminDashboard'));
const NGODashboard        = lazy(() => import('./pages/dashboard/NGODashboard'));
const GovernmentDashboard = lazy(() => import('./pages/dashboard/GovernmentDashboard'));

// Admin tools
const VerificationQueue   = lazy(() => import('./pages/admin/VerificationQueue'));
const ProjectVerification = lazy(() => import('./pages/admin/ProjectVerification'));
const AdminUsers          = lazy(() => import('./pages/admin/AdminUsers'));
const AdminPayments       = lazy(() => import('./pages/admin/AdminPayments'));
const AdminAnalytics      = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminNGOs           = lazy(() => import('./pages/admin/AdminNGOs'));
const AdminSDGContent     = lazy(() => import('./pages/admin/AdminSDGContent'));
const AdminAuditLogs      = lazy(() => import('./pages/admin/AdminAuditLogs'));

// ─── Query client ─────────────────────────────────────────────────
const qc = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 60000, refetchOnWindowFocus: false },
  },
});

// ─── Guards ───────────────────────────────────────────────────────
// Simple auth guard — only checks if logged in
function RequireAuth({ children }) {
  const { isAuth, ready } = useAuth();
  if (!ready) return <PageLoader />;
  if (!isAuth) return <Navigate to="/login" replace />;
  return children;
}

// Role guard — if role doesn't match, go to their own dashboard
function RequireRole({ roles, children }) {
  const { user, getDashboard } = useAuth();
  if (!roles.includes(user?.role)) {
    return <Navigate to={getDashboard(user?.role)} replace />;
  }
  return children;
}

// Guest only — logged-in users go to their dashboard
function GuestOnly({ children }) {
  const { isAuth, ready, user, getDashboard } = useAuth();
  if (!ready) return <PageLoader />;
  if (isAuth) return <Navigate to={getDashboard(user?.role)} replace />;
  return children;
}

// ─── App ──────────────────────────────────────────────────────────
function AppRoutes() {
  const { ready } = useAuth();
  if (!ready) return <PageLoader />;

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>

        {/* ── PUBLIC — no auth needed ─────────────────────── */}
        <Route element={<PublicLayout />}>
          <Route index                  element={<Home />} />
          <Route path="about"           element={<About />} />
          <Route path="contact"         element={<Contact />} />
          <Route path="requests"        element={<Requests />} />
          <Route path="requests/:id"    element={<RequestDetail />} />
          <Route path="projects"        element={<Projects />} />
          <Route path="projects/:id"    element={<ProjectDetail />} />
          <Route path="sdg"             element={<SDGPage />} />
          <Route path="sdg/:number"     element={<SDGDetail />} />
        </Route>

        {/* ── AUTH — guests only ─────────────────────────── */}
        <Route path="login"             element={<GuestOnly><Login /></GuestOnly>} />
        <Route path="register"          element={<GuestOnly><Register /></GuestOnly>} />
        <Route path="verify-email"      element={<VerifyEmail />} />
        <Route path="forgot-password"   element={<GuestOnly><ForgotPassword /></GuestOnly>} />
        <Route path="reset-password"    element={<GuestOnly><ResetPassword /></GuestOnly>} />

        {/* ── PROTECTED — must be logged in ──────────────── */}
        <Route element={<RequireAuth><DashboardLayout /></RequireAuth>}>

          {/* Shared (any logged-in user) */}
          <Route path="notifications"   element={<Notifications />} />
          <Route path="profile"         element={<Profile />} />
          <Route path="submit-request"  element={<SubmitRequest />} />

          {/* Requester roles */}
          <Route path="my-requests"     element={
            <RequireRole roles={['individual','student','school_admin','community_leader']}>
              <RequesterDashboard />
            </RequireRole>
          } />

          {/* Donor */}
          <Route path="donor/dashboard" element={
            <RequireRole roles={['donor']}><DonorDashboard /></RequireRole>
          } />
          <Route path="donor/donations" element={
            <RequireRole roles={['donor']}><DonationHistory /></RequireRole>
          } />
          <Route path="donor/impact"    element={
            <RequireRole roles={['donor']}><DonorImpact /></RequireRole>
          } />

          {/* Corporate */}
          <Route path="corporate/dashboard" element={
            <RequireRole roles={['corporate']}><CorporateDashboard /></RequireRole>
          } />

          {/* NGO */}
          <Route path="ngo/dashboard"   element={
            <RequireRole roles={['ngo_partner']}><NGODashboard /></RequireRole>
          } />

          {/* Government */}
          <Route path="government/dashboard" element={
            <RequireRole roles={['government_official','super_admin']}><GovernmentDashboard /></RequireRole>
          } />

          {/* Admin */}
          <Route path="admin/dashboard"          element={<RequireRole roles={['super_admin']}><AdminDashboard /></RequireRole>} />
          <Route path="admin/verify/requests"    element={<RequireRole roles={['super_admin','ngo_partner']}><VerificationQueue /></RequireRole>} />
          <Route path="admin/verify/projects"    element={<RequireRole roles={['super_admin']}><ProjectVerification /></RequireRole>} />
          <Route path="admin/users"              element={<RequireRole roles={['super_admin']}><AdminUsers /></RequireRole>} />
          <Route path="admin/payments"           element={<RequireRole roles={['super_admin']}><AdminPayments /></RequireRole>} />
          <Route path="admin/analytics"          element={<RequireRole roles={['super_admin']}><AdminAnalytics /></RequireRole>} />
          <Route path="admin/ngos"               element={<RequireRole roles={['super_admin']}><AdminNGOs /></RequireRole>} />
          <Route path="admin/sdg"                element={<RequireRole roles={['super_admin']}><AdminSDGContent /></RequireRole>} />
          <Route path="admin/audit-logs"         element={<RequireRole roles={['super_admin']}><AdminAuditLogs /></RequireRole>} />

        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={qc}>
        <AuthProvider>
          <NotificationProvider>
            <AppRoutes />
            <Toaster
              position="top-right"
              gutter={8}
              toastOptions={{
                duration: 4000,
                style: { fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:600, borderRadius:12, maxWidth:400, border:'1px solid #e2e8f0' },
                success: { style:{ background:'#fff', color:'#166534', border:'1px solid #bbf7d0' }, iconTheme:{ primary:'#10b981', secondary:'#fff' } },
                error:   { style:{ background:'#fff', color:'#991b1b', border:'1px solid #fecaca' }, iconTheme:{ primary:'#ef4444', secondary:'#fff' } },
              }}
            />
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}


// import React, { Suspense, lazy } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { HelmetProvider } from 'react-helmet-async';
// import { Toaster } from 'react-hot-toast';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import { NotificationProvider } from './context/NotificationContext';
// import { PageLoader } from './components/common/Loader';
// import PublicLayout    from './components/layout/PublicLayout';
// import DashboardLayout from './components/layout/DashboardLayout';

// /* ─── Lazy pages ─────────────────────────────────────────────────── */
// const Home                = lazy(() => import('./pages/Home'));
// const About               = lazy(() => import('./pages/About'));
// const Contact             = lazy(() => import('./pages/Contact'));
// const NotFound            = lazy(() => import('./pages/NotFound'));
// const Login               = lazy(() => import('./pages/auth/Login'));
// const Register            = lazy(() => import('./pages/auth/Register'));
// const VerifyEmail         = lazy(() => import('./pages/auth/VerifyEmail'));
// const ForgotPassword      = lazy(() => import('./pages/auth/ForgotPassword'));
// const ResetPassword       = lazy(() => import('./pages/auth/ResetPassword'));
// const Requests            = lazy(() => import('./pages/requests/Requests'));
// const RequestDetail       = lazy(() => import('./pages/requests/RequestDetail'));
// const SubmitRequest       = lazy(() => import('./pages/requests/SubmitRequest'));
// const Projects            = lazy(() => import('./pages/projects/Projects'));
// const SDGPage             = lazy(() => import('./pages/sdg/SDGPage'));
// const SDGDetail           = lazy(() => import('./pages/sdg/SDGDetail'));
// const DonorDashboard      = lazy(() => import('./pages/donors/DonorDashboard'));
// const AdminDashboard      = lazy(() => import('./pages/dashboard/AdminDashboard'));
// const NGODashboard        = lazy(() => import('./pages/dashboard/NGODashboard'));
// const GovernmentDashboard = lazy(() => import('./pages/dashboard/GovernmentDashboard'));
// const VerificationQueue   = lazy(() => import('./pages/admin/VerificationQueue'));
// const ProjectVerification = lazy(() => import('./pages/admin/ProjectVerification'));

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: { retry:1, staleTime:60000, refetchOnWindowFocus:false },
//   },
// });

// /* ─── Guards ─────────────────────────────────────────────────────── */
// function ProtectedRoute({ children, roles }) {
//   const { isAuth, user, ready } = useAuth();
//   if (!ready) return <PageLoader />;
//   if (!isAuth) return <Navigate to="/login" replace />;
//   if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />;
//   return children;
// }

// function GuestRoute({ children }) {
//   const { isAuth, ready } = useAuth();
//   if (!ready) return <PageLoader />;
//   if (isAuth) return <Navigate to="/donor/dashboard" replace />;
//   return children;
// }

// /* ─── App ────────────────────────────────────────────────────────── */
// function AppRoutes() {
//   const { ready } = useAuth();
//   if (!ready) return <PageLoader />;

//   return (
//     <Suspense fallback={<PageLoader />}>
//       <Routes>
//         {/* Public */}
//         <Route element={<PublicLayout />}>
//           <Route path="/"           element={<Home />} />
//           <Route path="/about"      element={<About />} />
//           <Route path="/contact"    element={<Contact />} />
//           <Route path="/requests"   element={<Requests />} />
//           <Route path="/requests/:id" element={<RequestDetail />} />
//           <Route path="/projects"   element={<Projects />} />
//           <Route path="/sdg"        element={<SDGPage />} />
//           <Route path="/sdg/:number" element={<SDGDetail />} />
//         </Route>

//         {/* Guest-only */}
//         <Route path="/login"           element={<GuestRoute><Login /></GuestRoute>} />
//         <Route path="/register"        element={<GuestRoute><Register /></GuestRoute>} />
//         <Route path="/verify-email"    element={<VerifyEmail />} />
//         <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
//         <Route path="/reset-password"  element={<GuestRoute><ResetPassword /></GuestRoute>} />

//         {/* Protected — Dashboard */}
//         <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
//           {/* Donor / general */}
//           <Route path="/donor/dashboard"  element={<DonorDashboard />} />
//           <Route path="/submit-request"   element={<SubmitRequest />} />

//           {/* Admin */}
//           <Route path="/admin/dashboard"  element={<ProtectedRoute roles={['super_admin']}><AdminDashboard /></ProtectedRoute>} />
//           <Route path="/admin/verify/requests" element={<ProtectedRoute roles={['super_admin','ngo_partner']}><VerificationQueue /></ProtectedRoute>} />
//           <Route path="/admin/verify/projects" element={<ProtectedRoute roles={['super_admin']}><ProjectVerification /></ProtectedRoute>} />

//           {/* NGO */}
//           <Route path="/ngo/dashboard"    element={<ProtectedRoute roles={['ngo_partner']}><NGODashboard /></ProtectedRoute>} />

//           {/* Government */}
//           <Route path="/government/dashboard" element={<ProtectedRoute roles={['government_official','super_admin']}><GovernmentDashboard /></ProtectedRoute>} />
//         </Route>

//         {/* 404 */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </Suspense>
//   );
// }

// export default function App() {
//   return (
//     <HelmetProvider>
//       <QueryClientProvider client={queryClient}>
//         <AuthProvider>
//           <NotificationProvider>
//             <AppRoutes />
//             <Toaster
//               position="top-right"
//               gutter={8}
//               toastOptions={{
//                 duration: 4000,
//                 style: {
//                   fontFamily: 'Inter, sans-serif',
//                   fontSize:   13,
//                   fontWeight: 500,
//                   borderRadius: 12,
//                   boxShadow: '0 8px 24px rgba(0,0,0,.12)',
//                   maxWidth: 380,
//                 },
//                 success: { style:{ background:'#fff', color:'#15803D', border:'1px solid #BBF7D0' }, iconTheme:{ primary:'#10B981', secondary:'#fff' } },
//                 error:   { style:{ background:'#fff', color:'#991B1B', border:'1px solid #FECACA' }, iconTheme:{ primary:'#EF4444', secondary:'#fff' } },
//               }}
//             />
//           </NotificationProvider>
//         </AuthProvider>
//       </QueryClientProvider>
//     </HelmetProvider>
//   );
// }