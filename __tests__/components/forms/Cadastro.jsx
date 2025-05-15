import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react'
import CadastroForm from '../../../@core/components/forms/Cadastro';
import userEvent from '@testing-library/user-event';

describe('Registration Form', () => {
    it('renders the registration form', async () => {
        render(<CadastroForm onSubmitAction={jest.fn()} />);

        expect(screen.getByText('Preencha os campos abaixo para criar sua conta corrente!')).toBeInTheDocument();
        expect(screen.getByText('Nome')).toBeInTheDocument();
        expect(screen.getByText('E-mail')).toBeInTheDocument();
        expect(screen.getByText('Senha')).toBeInTheDocument();
        expect(screen.getByText(/descrito na Política de Privacidade do banco\./)).toBeInTheDocument();
        expect(screen.getByText('Criar Conta')).toBeDisabled();
    });


    describe('when the user inserts valid data', () => {
        it('enables the submit button', async () => {
            const submitHandler = jest.fn();

            render(<CadastroForm onSubmitAction={submitHandler} />);

            const nameInput = screen.getByTestId('name-input');
            const emailInput = screen.getByTestId('email-input');
            const passwordInput = screen.getByTestId('password-input');
            const termsCheckbox = screen.getByTestId('terms-checkbox');
            const submitButton = screen.getByText('Criar Conta');

            expect(submitButton).toBeDisabled();

            await userEvent.type(nameInput, 'Hermelinda de Jesus');
            await userEvent.type(emailInput, 'hermelinda.jesus@gmail.com');
            await userEvent.type(passwordInput, '123abcABC@');
            await userEvent.click(termsCheckbox);

            expect(submitButton).toBeEnabled();

            await userEvent.click(submitButton);

            expect(submitHandler).toHaveBeenCalled();
        });
    });
});
