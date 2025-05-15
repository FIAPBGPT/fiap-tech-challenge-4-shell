import { render, screen, fireEvent } from '@testing-library/react';
import MenuButton from '../../@core/components/ui/menu/MenuButton';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';

// Mock do tema
const mockTheme = {
  themeColor: {
    primary: '#ff0000',
    secondary: '#00ff00',
  },
};

// Mock do AsideMenu
jest.mock('../../@core/components/ui/menu/AsideMenu', () => ({
  __esModule: true,
  default: ({ pathname }) => (
    <div data-testid="aside-menu">AsideMenu - {pathname}</div>
  ),
}));

describe('MenuButton Component', () => {
  const pathname = '/home';

  it('deve exibir o ícone do menu inicialmente', () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <MenuButton pathname={pathname} />
      </ThemeProvider>
    );

    // Verifica se o botão com ícone está visível
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.queryByTestId('aside-menu')).not.toBeInTheDocument();
  });

  it('deve exibir o componente AsideMenu ao clicar no botão', () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <MenuButton pathname={pathname} />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByTestId('aside-menu')).toBeInTheDocument();
    expect(screen.getByText(`AsideMenu - ${pathname}`)).toBeInTheDocument();
  });

  it('deve alternar entre ícone e AsideMenu ao clicar', () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <MenuButton pathname={pathname} />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');

    // Primeiro clique: abre menu
    fireEvent.click(button);
    expect(screen.getByTestId('aside-menu')).toBeInTheDocument();

    // Segundo clique: fecha menu (volta para o ícone)
    fireEvent.click(button);
    expect(screen.queryByTestId('aside-menu')).not.toBeInTheDocument();
  });
});
