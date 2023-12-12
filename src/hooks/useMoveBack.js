import { useNavigate } from 'react-router-dom';

// Tao custom hook de quay lai trang truoc do
export function useMoveBack() {
  const navigate = useNavigate();
  return () => navigate(-1);
}
