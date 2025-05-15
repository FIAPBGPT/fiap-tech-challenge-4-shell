/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query';
import useAxiosAuth from '@/@core/hooks/useAxiosAuth';
import { jwtDecode } from 'jwt-decode';
import { useSession } from 'next-auth/react';

/**
 * Custom hook to fetch and manage user transactions using React Query.
 *
 * This hook retrieves the authenticated user's transactions by making an API call.
 * It uses the user's token to decode their user ID and fetches the transactions
 * associated with that ID. The data is cached and considered fresh for 1 minute
 * to avoid unnecessary refetches during that period.
 *
 * @returns {UseQueryResult<any, unknown>} A React Query result object containing
 * the transactions data, loading state, and error information.
 *
 * @remarks
 * - Requires `useAxiosAuth` for authenticated API requests.
 * - Requires `useSession` to retrieve the current user's session and token.
 * - Decodes the token using `jwtDecode` to extract the user ID.
 *
 * @example
 * ```tsx
 * const { data: transactions, isLoading, error } = useTransactions();
 *
 * if (isLoading) return <p>Loading...</p>;
 * if (error) return <p>Error loading transactions</p>;
 *
 * return (
 *   <ul>
 *     {transactions.map(transaction => (
 *       <li key={transaction.id}>{transaction.description}</li>
 *     ))}
 *   </ul>
 * );
 * ```
 */
export function useTransactions() {
  const axiosAuth = useAxiosAuth();
  const { data: session } = useSession();

  const token = (session?.user as { token?: string })?.token;
  const decoded: any = token ? jwtDecode(token) : null;
  const userId = decoded?.userId;

  return useQuery({
    queryKey: ['transactions', userId],
    queryFn: async () => {
      if (!userId) return [];

      const response = await axiosAuth.get(`/api/users/${userId}/transactions`);
      
      return response.data.result;
    },
    enabled: !!userId && !!token,
    staleTime: 1000 * 60, // 1 minuto (Define que os dados são considerados frescos por 1 minuto, evitando refetchs desnecessários nesse período.)
  });
}

