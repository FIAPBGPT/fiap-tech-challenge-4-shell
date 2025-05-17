import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react'
import TransacaoForm from '../../../@core/components/forms/Transacao';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

describe('Login Form', () => {
    it('renders the login form', async () => {
        render(
            <TransacaoForm
                onSubmitAction={jest.fn()}
                showDatePicker={false}
            />
        );

        expect(screen.getByText('Tipo de Transação')).toBeInTheDocument();
        expect(screen.getByText('Valor')).toBeInTheDocument();
        expect(screen.findByText('Data')).toBeUndefined;
        expect(screen.getByText('Concluir Transação')).toBeDisabled();
    });

    describe('when `showDatePicker` is `true`', () => {
        it('renders the login form', async () => {
            render(
                <TransacaoForm
                    onSubmitAction={jest.fn()}
                    showDatePicker={true}
                />
            );
    
            expect(screen.getByText('Tipo de Transação')).toBeInTheDocument();
            expect(screen.getByText('Valor')).toBeInTheDocument();
            expect(screen.getByText('Data')).toBeInTheDocument();
            expect(screen.getByText('Concluir Transação')).toBeDisabled();
        });
    });

    describe('when the user inserts valid login data', () => {
        it('enables the submit button', async () => {
            const submitHandler = jest.fn();

            render(
                <TransacaoForm
                    onSubmitAction={submitHandler}
                    showDatePicker={true}
                />
            );

            const transactionType = screen.getByRole('combobox');
            const transactionAmount = screen.getByRole('spinbutton');
            const transactionDate = screen.getByRole('textbox');
            const submitButton = screen.getByText('Concluir Transação');

            expect(submitButton).toBeDisabled();

            await act(() => userEvent.selectOptions(transactionType, 'deposito'));
            await userEvent.type(transactionAmount, '123');
            await userEvent.clear(transactionDate);
            await userEvent.type(transactionDate, '05/15/2025');

            expect(submitButton).toBeEnabled();

            await userEvent.click(submitButton);

            expect(submitHandler).toHaveBeenCalled();
        });
    });
});
