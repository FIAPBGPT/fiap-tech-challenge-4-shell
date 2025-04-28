import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Toast from '../@core/components/Toast';

describe('Statement Item', () => {
    it('renders a level 6 heading', () => {
        const expectedTitle='Título do Toast';
        const expectedMessage='A mensagem do Toast';

        const { baseElement, getByRole, getByTestId } = render(
            <Toast
                title={expectedTitle}
                message={expectedMessage}
                showToast={true}
                icon='error'
            />,
        );

        const titleElement = getByRole('heading', { level: 6 });
        const toastIcon = getByTestId('toast-error-icon');

        expect(titleElement).toHaveTextContent(expectedTitle);
        expect(toastIcon).toBeInTheDocument();
        expect(screen.getByText(expectedMessage)).toBeInTheDocument();
    });

    describe('when the icon is not specified', () => {
        it('shows the "info" icon', () => {
            render(<Toast title='Título' message='Mensagem' showToast={true} />);

            expect(screen.findByTestId('toast-success-icon')).toBeUndefined;
            expect(screen.findByTestId('toast-warning-icon')).toBeUndefined;
            expect(screen.findByTestId('toast-error-icon')).toBeUndefined;
            expect(screen.findByTestId('toast-info-icon')).not.toBeUndefined;
        });
    });

    describe('when `showToast` is false', () => {
        it('renders nothing', () => {
            const expectedTitle='Título do Toast';
            const expectedMessage='A mensagem do Toast';
    
            render(<Toast title={expectedTitle} message={expectedMessage} />);

            expect(screen.findByRole('heading', { level: 6 })).toBeUndefined;
            expect(screen.findByText(expectedMessage)).toBeUndefined;
        });
    });
});
