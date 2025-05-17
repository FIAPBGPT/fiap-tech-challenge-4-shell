import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react'
import LoginForm from '../../../@core/components/forms/Login';
import userEvent from '@testing-library/user-event';

describe('Login Form', () => {
    it('renders the login form', async () => {
        render(<LoginForm onSubmitAction={jest.fn()} />);

        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('E-mail')).toBeInTheDocument();
        expect(screen.getByText('Senha')).toBeInTheDocument();
        expect(screen.getByText('Esqueci a senha!')).toBeInTheDocument();
        expect(screen.getByText(/Acessar/)).toBeDisabled();
    });

    describe('when the user inserts valid login data', () => {
        it('enables the submit button', async () => {
            const submitHandler = jest.fn();

            render(<LoginForm onSubmitAction={submitHandler} />);

            const emailInput = screen.getByTestId('email-input');
            const passwordInput = screen.getByTestId('password-input');
            const submitButton = screen.getByText(/Acessar/);

            expect(submitButton).toBeDisabled();

            await userEvent.type(emailInput, 'hermelinda.jesus@gmail.com');
            await userEvent.type(passwordInput, '123abcABC@');

            expect(submitButton).toBeEnabled();

            await userEvent.click(submitButton);

            expect(submitHandler).toHaveBeenCalled();
        });
    })
});
