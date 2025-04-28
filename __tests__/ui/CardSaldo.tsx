import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import CardSaldo from '../../@core/components/ui/CardSaldo/CardSaldo';

describe('CardSaldo', () => {
  const now = new Date('2025-04-25T06:00:00.000Z');

  beforeEach(() => jest.useFakeTimers().setSystemTime(now));

  it('renders the user\'s name and the balance', () => {
    render(
      <CardSaldo
        name={'Hermelinda'}
        balance={10.5}
        showBalance={true}
      />,
    )

    expect(screen.getByText('Olá, Hermelinda :)')).toBeInTheDocument();
    expect(screen.getByText('sexta-feira, 25/04/2025')).toBeInTheDocument();
    expect(screen.getByText('Saldo')).toBeInTheDocument();
    expect(screen.getByText('Conta Corrente')).toBeInTheDocument();
    expect(screen.getByText('R$ 10,50')).toBeInTheDocument();
  });

  describe('when `showBalance` is `false`', () => {
    it('does not render the balance', () => {
      const { baseElement } = render(
        <CardSaldo
          name={'Hermelinda'}
          balance={10.5}
          showBalance={false}
        />,
      )

      expect(baseElement).not.toHaveTextContent('R$ 10,50');
      expect(baseElement).toHaveTextContent('R$ XXXX');
    });
  });

  describe('when the "eye" icon is clicked', () => {
    it('toggles the balance visibility', async () => {
      const user = userEvent.setup({ delay: null });

      const { baseElement } = render(
        <CardSaldo
          name={'Hermelinda'}
          balance={10.5}
          showBalance={false}
        />,
      );

      expect(baseElement).toHaveTextContent('R$ XXXX');
      expect(baseElement).not.toHaveTextContent('R$ 10,50');

      const button = screen.getByRole('button');
      await user.click(button);

      expect(baseElement).not.toHaveTextContent('R$ XXXX');
      expect(baseElement).toHaveTextContent('R$ 10,50');
    });
  });

})
