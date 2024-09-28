import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../service/services';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
};
