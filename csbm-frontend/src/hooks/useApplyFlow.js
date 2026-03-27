import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { App } from 'antd';

export const useApplyFlow = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();

  const handleApplyNow = async (queryString = '') => {
    const token = localStorage.getItem('token');
    
    // 1. Not logged in -> Route to /register
    if (!token) {
      navigate(`/register${queryString}`);
      return;
    }

    // 2. Logged in -> Fetch application status
    try {
      const res = await axios.get('http://localhost:8080/api/applications/my-application', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const app = res.data.application || res.data;
      const status = app.status;

      // 3. Route correctly based on status
      if (status === 'PENDING') {
        message.info("Your application is under review. Course access will be available after approval.");
        navigate("/student-dashboard");
      } else if (status === 'APPROVED') {
        message.success("You now have access to your course.");
        navigate("/student-dashboard");
      } else if (status === 'REJECTED') {
        message.error("Your application was not approved. Please review your status or reapply.");
        navigate("/student-dashboard");
      } else {
        // Fallback for an unknown state -> Application form
        navigate(`/apply${queryString}`);
      }

    } catch (error) {
      // 404 No application found -> means they have "not_submitted"
      if (error.response && error.response.status === 404) {
        navigate(`/apply${queryString}`);
      } else {
        console.error("Error fetching application status:", error);
        message.error("An error occurred while checking your status. Redirecting to application form.");
        navigate(`/apply${queryString}`);
      }
    }
  };

  return { handleApplyNow };
};
