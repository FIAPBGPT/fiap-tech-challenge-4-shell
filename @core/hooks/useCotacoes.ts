import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook to fetch and format currency exchange rates for USD, EUR, GBP, and CHF against BRL.
 *
 * This hook uses the `useQuery` function from React Query to fetch data from the
 * "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,GBP-BRL,CHF-BRL" API.
 * The fetched data is formatted to include the currency name, code, exchange rate, and variation.
 *
 * @returns {object} An object containing the query result, including the formatted exchange rates:
 * - `nome`: The name of the currency (e.g., "Dólar", "Euro").
 * - `moeda`: The currency code (e.g., "USD", "EUR").
 * - `cotacao`: The formatted exchange rate (e.g., "5,25").
 * - `variacao`: The formatted variation in the exchange rate (e.g., "0,10").
 *
 * @remarks
 * - The exchange rates are fetched from the AwesomeAPI.
 * - The data is cached for 1 minute (`staleTime: 1000 * 60`).
 *
 * @example
 * const { data, isLoading, error } = useCotacoes();
 * if (isLoading) return <p>Loading...</p>;
 * if (error) return <p>Error loading data</p>;
 * return (
 *   <ul>
 *     {data.map((cotacao) => (
 *       <li key={cotacao.moeda}>
 *         {cotacao.nome}: {cotacao.cotacao} (Variação: {cotacao.variacao})
 *       </li>
 *     ))}
 *   </ul>
 * );
 */

export function useCotacoes() {
  return useQuery({
    queryKey: ['cotacoes'],
    queryFn: async () => {
      const response = await fetch(
        'https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,GBP-BRL,CHF-BRL'
      );
      const data = await response.json();

      const formatCurrency = (value: string) =>
        parseFloat(value).toFixed(2).replace('.', ',');

      return [
        {
          nome: 'Dólar',
          moeda: 'USD',
          cotacao: formatCurrency(data.USDBRL.ask),
          variacao: formatCurrency(data.USDBRL.varBid),
        },
        {
          nome: 'Euro',
          moeda: 'EUR',
          cotacao: formatCurrency(data.EURBRL.ask),
          variacao: formatCurrency(data.EURBRL.varBid),
        },
        {
          nome: 'Libra',
          moeda: 'GBP',
          cotacao: formatCurrency(data.GBPBRL.ask),
          variacao: formatCurrency(data.GBPBRL.varBid),
        },
        {
          nome: 'Franco Suiço',
          moeda: 'CHF',
          cotacao: formatCurrency(data.CHFBRL.ask),
          variacao: formatCurrency(data.CHFBRL.varBid),
        },
      ];
    },
    staleTime: 1000 * 60, // 1 minuto (Os dados são considerados "frescos" por 1 minuto. Depois disso, a query pode ser refetchada automaticamente se o componente que usa o hook for montado novamente.)
  });
}

