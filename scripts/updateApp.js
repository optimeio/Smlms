const fs = require('fs');

let content = fs.readFileSync('c:/lms1/frontend/src/App.jsx', 'utf8');

// Add new imports
const importsToAdd = `
const StudentAssignments = lazy(() => import('./pages/dashboards/StudentAssignments'));
const TrainerAssignments = lazy(() => import('./pages/dashboards/TrainerAssignments'));
const TrainerMaterials = lazy(() => import('./pages/dashboards/TrainerMaterials'));
const TrainerReports = lazy(() => import('./pages/dashboards/TrainerReports'));
const TrainerMessages = lazy(() => import('./pages/dashboards/TrainerMessages'));
const TrainerNotifications = lazy(() => import('./pages/dashboards/TrainerNotifications'));
const TrainerSettings = lazy(() => import('./pages/dashboards/TrainerSettings'));

const AdminUsers = lazy(() => import('./pages/dashboards/AdminUsers'));
const AdminSpoc = lazy(() => import('./pages/dashboards/AdminSpoc'));
const AdminCourses = lazy(() => import('./pages/dashboards/AdminCourses'));
const AdminCategories = lazy(() => import('./pages/dashboards/AdminCategories'));
const AdminScheduling = lazy(() => import('./pages/dashboards/AdminScheduling'));
const AdminAssignments = lazy(() => import('./pages/dashboards/AdminAssignments'));
const AdminAttendance = lazy(() => import('./pages/dashboards/AdminAttendance'));
const AdminCertificates = lazy(() => import('./pages/dashboards/AdminCertificates'));
const AdminReports = lazy(() => import('./pages/dashboards/AdminReports'));
const AdminNotifications = lazy(() => import('./pages/dashboards/AdminNotifications'));
const AdminSystem = lazy(() => import('./pages/dashboards/AdminSystem'));
const AdminDocuments = lazy(() => import('./pages/dashboards/AdminDocuments'));
const AdminAudit = lazy(() => import('./pages/dashboards/AdminAudit'));
const AdminProfile = lazy(() => import('./pages/dashboards/AdminProfile'));
`;

content = content.replace(
  'const AdminLiveClasses = lazy(() => import(\'./pages/dashboards/AdminLiveClasses\'));',
  'const AdminLiveClasses = lazy(() => import(\'./pages/dashboards/AdminLiveClasses\'));\n' + importsToAdd
);

// Route path="a" replacements
content = content.replace(
  '<Route path="assignments" element={<PlaceholderPage title="Assignments & Quiz" description="Your pending and submitted assignments will appear here." />} />',
  '<Route path="assignments" element={<StudentAssignments />} />'
);

// Route path="b" replacements
content = content.replace(
  '<Route path="assignments" element={<PlaceholderPage title="Assignments" description="Student submissions and grading will appear here." />} />',
  '<Route path="assignments" element={<TrainerAssignments />} />'
);
content = content.replace(
  '<Route path="materials" element={<PlaceholderPage title="Study Materials" description="Your teaching resources will appear here." />} />',
  '<Route path="materials" element={<TrainerMaterials />} />'
);
content = content.replace(
  '<Route path="reports" element={<PlaceholderPage title="Reports" description="Training reports will appear here." />} />',
  '<Route path="reports" element={<TrainerReports />} />'
);
content = content.replace(
  '<Route path="messages" element={<PlaceholderPage title="Messages" description="Your messages and updates will appear here." />} />',
  '<Route path="messages" element={<TrainerMessages />} />'
);
content = content.replace(
  '<Route path="notifications" element={<PlaceholderPage title="Notifications" description="Your latest notifications will appear here." />} />',
  '<Route path="notifications" element={<TrainerNotifications />} />'
);
content = content.replace(
  '<Route path="settings" element={<PlaceholderPage title="Settings" description="Your account preferences will appear here." />} />',
  '<Route path="settings" element={<TrainerSettings />} />'
);

// Route path="d" replacements
content = content.replace(
  '<Route path="users" element={<PlaceholderPage title="User Management" description="User administration will appear here." />} />',
  '<Route path="users" element={<AdminUsers />} />'
);
content = content.replace(
  '<Route path="spoc" element={<PlaceholderPage title="SPOC" description="SPOC account management will appear here." />} />',
  '<Route path="spoc" element={<AdminSpoc />} />'
);
content = content.replace(
  '<Route path="courses" element={<PlaceholderPage title="Course Management" description="Course administration will appear here." />} />',
  '<Route path="courses" element={<AdminCourses />} />'
);
content = content.replace(
  '<Route path="categories" element={<PlaceholderPage title="Categories" description="Course categories will appear here." />} />',
  '<Route path="categories" element={<AdminCategories />} />'
);
content = content.replace(
  '<Route path="scheduling" element={<PlaceholderPage title="Scheduling" description="Schedule management will appear here." />} />',
  '<Route path="scheduling" element={<AdminScheduling />} />'
);
content = content.replace(
  '<Route path="assignments" element={<PlaceholderPage title="Assignments" description="Global assignment tracking will appear here." />} />',
  '<Route path="assignments" element={<AdminAssignments />} />'
);
content = content.replace(
  '<Route path="attendance" element={<PlaceholderPage title="Attendance" description="Attendance administration will appear here." />} />',
  '<Route path="attendance" element={<AdminAttendance />} />'
);
content = content.replace(
  '<Route path="certificates" element={<PlaceholderPage title="Certificates" description="Certificate administration will appear here." />} />',
  '<Route path="certificates" element={<AdminCertificates />} />'
);
content = content.replace(
  '<Route path="reports" element={<PlaceholderPage title="Reports" description="Reporting dashboards will appear here." />} />',
  '<Route path="reports" element={<AdminReports />} />'
);
content = content.replace(
  '<Route path="notifications" element={<PlaceholderPage title="Notifications" description="Platform notifications will appear here." />} />',
  '<Route path="notifications" element={<AdminNotifications />} />'
);
content = content.replace(
  '<Route path="system" element={<PlaceholderPage title="System Settings" description="System configuration will appear here." />} />',
  '<Route path="system" element={<AdminSystem />} />'
);
content = content.replace(
  '<Route path="documents" element={<PlaceholderPage title="Document Manager" description="Platform documents will appear here." />} />',
  '<Route path="documents" element={<AdminDocuments />} />'
);
content = content.replace(
  '<Route path="audit" element={<PlaceholderPage title="Audit Logs" description="Audit logs will appear here." />} />',
  '<Route path="audit" element={<AdminAudit />} />'
);
content = content.replace(
  '<Route path="profile" element={<PlaceholderPage title="Profile" description="Your profile and personal details will appear here." />} />',
  '<Route path="profile" element={<AdminProfile />} />'
);

fs.writeFileSync('c:/lms1/frontend/src/App.jsx', content);
console.log('App.jsx updated!');
