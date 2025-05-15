import { render, screen } from '@testing-library/react';
import AsideMenu from '../../@core/components/ui/menu/AsideMenu';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';

// Mock do tema
const mockTheme = {
  themeColor: {
    primary: '#ff0000',
    secondary: '#00ff00',
  },
};

// Mock do hook useWindowSize
jest.mock('../../@core/components/hooks/WindowsSize.ts', () => ({
  __esModule: true,
  default: () => ({ width: 400 }),  // Mock para simular que a largura da janela é 400px
}));


describe('AsideMenu Component', () => {
  const pathname = '/home';

  beforeEach(() => {
    render(
      <ThemeProvider theme={mockTheme}>
        <AsideMenu pathname={pathname} />
      </ThemeProvider>
    );
  });

  it('deve exibir o item de menu "Início"', () => {
    expect(screen.getByText(/Início/i)).toBeInTheDocument();
  });

  it('deve exibir o item de menu "Transferências"', () => {
    expect(screen.getByText(/Transferências/i)).toBeInTheDocument();
  });

  it('deve exibir o item de menu "Transações"', () => {
    expect(screen.getByText(/Transações/i)).toBeInTheDocument();
  });

  it('deve exibir o item de menu "Investimentos"', () => {
    expect(screen.getByText(/Investimentos/i)).toBeInTheDocument();
  });

  it('deve exibir o item de menu "Outros serviços"', () => {
    expect(screen.getByText(/Outros serviços/i)).toBeInTheDocument();
  });
});
