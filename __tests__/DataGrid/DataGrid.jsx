import { render, screen } from '@testing-library/react';
import DatatableTCF from '../../@core/components/ui/Datatable/index';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';

// Mock do tema
const mockTheme = {
  themeColor: {
    primary: '#ff0000',
    secondary: '#00ff00',
  },
};

// Dados simulados
const mockColumns = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'name', headerName: 'Nome', width: 150 },
];

const mockRows = [
  { id: 1, name: 'João' },
  { id: 2, name: 'Maria' },
];

describe('DatatableTCF Component', () => {
  it('deve renderizar as colunas e linhas corretamente', () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <DatatableTCF
          columns={mockColumns}
          rows={mockRows}
          paginationModel={{ page: 0, pageSize: 5 }}
          checkbox={true}
          loading={false}
        />
      </ThemeProvider>
    );

    // Verifica se os nomes das colunas estão na tela
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Nome')).toBeInTheDocument();

    // Verifica se os dados estão renderizados
    expect(screen.getByText('João')).toBeInTheDocument();
    expect(screen.getByText('Maria')).toBeInTheDocument();
  });

  it('deve exibir o componente de carregamento quando loading=true', () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <DatatableTCF
          columns={mockColumns}
          rows={[]}
          paginationModel={{ page: 0, pageSize: 5 }}
          checkbox={false}
          loading={true}
        />
      </ThemeProvider>
    );

    // Verifica se o indicador de carregamento está presente
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
