import { render, screen } from '@testing-library/react';
import CardCotacoes from '../../@core/components/ui/CardCotacoes/CardCotacoes';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { FaDollarSign } from 'react-icons/fa';

// Mock para o tema caso o styled-components exija
const mockTheme = {
  themeColor: {
    primary: '#000',
    secondary: '#fff',
  },
};

// Mock da imagem do next/image para evitar erro no teste
jest.mock('next/image', () => (props) => {
  return <img {...props} alt={props.alt} />;
});

describe('CardCotacoes Component', () => {
  it('deve renderizar nome, cotação, variação e ícones corretamente', () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <CardCotacoes
          moeda={<FaDollarSign data-testid="moeda-icon" />}
          nome="Dólar"
          cotacao={5.23}
          variacao={1.5}
        />
      </ThemeProvider>
    );

    // Verifica se o nome da moeda aparece
    expect(screen.getByText('Dólar')).toBeInTheDocument();

    // Verifica se a cotação aparece corretamente
    expect(screen.getByText('5.23')).toBeInTheDocument();

    // Verifica se a variação aparece corretamente
    expect(screen.getByText('1.5%')).toBeInTheDocument();

    // Verifica se os ícones são renderizados
    expect(screen.getByTestId('moeda-icon')).toBeInTheDocument();

    // Verifica se as imagens foram carregadas
    expect(screen.getByAltText('Seta para cima')).toBeInTheDocument();
    expect(screen.getByAltText('Gráfico')).toBeInTheDocument();
  });
});
