import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { App } from 'antd';
import { useAuth } from '../context/AuthContext';

/**
 * useApplyFlow — Smart Apply Now handler.
 *
 * Rules:
 *  1. Not logged in            → /register
 *  2. Logged in, non-student   → show warning (admins/staff cannot apply)
 *  3. Logged in, student       → check application status → route accordingly
 */
export const useApplyFlow = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { user, token } = useAuth();

  const handleApplyNow = async (queryString = '') => {

    // 1. Not logged in → Register page
    if (!token || !user) {
      navigate(`/register${queryString}`);
      return;
    }

    // 2. Logged in but NOT a student (admin / staff / lecturer)
    const role = (user.role || '').toLowerCase();
    const STUDENT_ROLES = ['student'];
    if (!STUDENT_ROLES.includes(role)) {
      message.warning('Only students can apply for courses. Admin/Staff accounts cannot submit applications.');
      return;
    }

    // 3. Logged in student → check existing application status
    try {
      const res = await axios.get('http://localhost:8080/api/applications/my-application', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const app = res.data?.application || res.data;

      // Guard: empty/null response → no application yet
      if (!app || !app.status) {
        navigate(`/apply${queryString}`);
        return;
      }

      const status = app.status;

      if (status === 'PENDING') {
        message.info('Your application is under review. Course access will be available after approval.');
        navigate('/student-dashboard');
      } else if (status === 'APPROVED') {
        message.success('You now have access to your course.');
        navigate('/student-dashboard');
      } else if (status === 'REJECTED') {
        message.error('Your application was not approved. Please review your status or reapply.');
        navigate('/student-dashboard');
      } else {
        navigate(`/apply${queryString}`);
      }

    } catch (error) {
      // 404 → no application yet, send to form
      if (error.response?.status === 404) {
        navigate(`/apply${queryString}`);
      } else {
        console.error('Error fetching application status:', error);
        message.error('An error occurred while checking your status. Redirecting to application form.');
        navigate(`/apply${queryString}`);
      }
    }
  };

  return { handleApplyNow };
};
