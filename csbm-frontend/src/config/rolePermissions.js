export const rolePermissions = {
  super_admin: ['*', 'user_management'],
  registration_staff: ['student_approvals', 'manual_registration'],
  marketing_coordinator: ['course_management', 'manage_workshops'],
  finance_staff: ['payment_management', 'analytics_reports'],
  STUDENT: ['student_dashboard'],
  LECTURER: ['student_dashboard', 'lecturer_tools'],
};
