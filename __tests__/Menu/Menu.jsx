import { render, screen } from '@testing-library/react';
import Menu from '../../@core/components/ui/menu/Menu';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';

// Mock do tema
const mockTheme = {
  themeColor: {
    primary: '#ff0000',
    secondary: '#00ff00',
  },
};

// Mock de hooks e outros componentes
jest.mock('../../@core/components/hooks/WindowsSize.ts', () => ({
  __esModule: true,
  default: () => ({ width: 400 }),  // Mock para simular que a largura da janela é 400px
}));



describe('Menu Component', () => {
  

  it('deve exibir o item de menu "Início"', () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <Menu />
      </ThemeProvider>
    );

    expect(screen.getByText(/Início/i)).toBeInTheDocument();
  });

  it('deve exibir o item de menu "Transferências"', () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <Menu />
      </ThemeProvider>
    );

    expect(screen.getByText(/Transferências/i)).toBeInTheDocument();
  });

  it('deve exibir o item de menu "Transações"', () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <Menu />
      </ThemeProvider>
    );

    expect(screen.getByText(/Transações/i)).toBeInTheDocument();
  });

  it('deve exibir o item de menu "Investimentos"', () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <Menu />
      </ThemeProvider>
    );

    expect(screen.getByText(/Investimentos/i)).toBeInTheDocument();
  });

  it('deve exibir o item de menu "Outros serviços"', () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <Menu />
      </ThemeProvider>
    );

    expect(screen.getByText(/Outros serviços/i)).toBeInTheDocument();
  });
});
