import { render, screen } from '@testing-library/react';
import Main from '../../@core/components/Home/Main';
import { ThemeProvider } from 'styled-components';
import '@testing-library/jest-dom';
import { BackgroundHome } from '../../@core/components/Home/Main/MainContainer';

const mockTheme = {
  themeFonts: {
    textHomeMain: {
      fontSize: '2rem',
      fontWeight: 'bold',
      lineHeight: '2.5rem',
      textAlign: 'left',
    },
    headerSemibold: {
      fontFamily: 'Arial',
      fontWeight: 600,
      lineHeight: '1.5rem',
    },
  },
  themeColor: {
    dark: '#000',
    success: '#28a745',
    grey: '#6c757d',
  },
  font_size: {
    fontsizexlarge: '2rem',
  },
};

// TESTES DO COMPONENTE MAIN
describe('Main Component', () => {
  beforeEach(() => {
    render(
      <ThemeProvider theme={mockTheme}>
        <BackgroundHome>
          <Main />
        </BackgroundHome>
      </ThemeProvider>
    );
  });

  it('deve renderizar o título principal', () => {
    expect(
      screen.getByText(/Experimente mais liberdade no controle da sua vida financeira/i)
    ).toBeInTheDocument();
  });

  it('deve renderizar a imagem principal', () => {
    const image = screen.getByAltText(/logo do banco/i);
    expect(image).toBeInTheDocument();
  });

  it('deve exibir os botões "Abrir Minha Conta" e "Já Tenho Conta"', () => {
    expect(screen.getByRole('button', { name: /Abrir Minha Conta/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Já Tenho Conta/i })).toBeInTheDocument();
  });

  it('deve renderizar o título da seção de vantagens', () => {
    expect(screen.getByText(/Vantagens do nosso banco/i)).toBeInTheDocument();
  });

  it('deve renderizar todas as vantagens', () => {
    const titles = [
      "Conta e cartão gratuitos",
      "Saques sem custo",
      "Programa de pontos",
      "Seguro Dispositivos",
    ];

    titles.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    const descriptions = [
      /nossa conta é digital/i,
      /sacar gratuitamente/i,
      /acumular pontos/i,
      /dispositivos móveis/i,
    ];

    descriptions.forEach((desc) => {
      expect(screen.getByText(desc)).toBeInTheDocument();
    });
  });
});
