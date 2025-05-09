import axios from 'axios';
import transactionsService from "@/@core/services/api-node/transactions.service";

jest.mock('axios');

describe('Transactions Service', () => {
    describe('getTransactions', () => {
        it('calls the transactions list endpoint', async () => {
            const userId = 123456;

            axios.get.mockResolvedValue({});

            await transactionsService.getTransactions(axios, { userId });

            expect(axios.get).toHaveBeenCalledWith(`api/users/${userId}/transactions`);
        });
    });

    describe('getTransactionById', () => {
        it('calls the "transaction by id" endpoint', async () => {
            const id = 456789;

            axios.get.mockResolvedValue({});

            await transactionsService.getTransactionById(axios, { id });

            expect(axios.get).toHaveBeenCalledWith(`api/users/transactions/${id}`);
        });
    });

    describe('createTransaction', () => {
        it('calls the transaction creation endpoint', async () => {
            const transactionData = { some: 'data' };

            axios.post.mockResolvedValue({});

            await transactionsService.createTransaction(axios, transactionData);

            expect(axios.post).toHaveBeenCalledWith('api/users/transactions', transactionData);
        });
    });

    describe('updateTransaction', () => {
        it('calls the transaction update endpoint', async () => {
            const transactionId = 123;
            const transactionData = { some: 'data' };

            axios.put.mockResolvedValue({});

            await transactionsService.updateTransaction(axios, transactionData, { id: transactionId });

            expect(axios.put).toHaveBeenCalledWith(`api/users/transactions/${transactionId}`, transactionData);
        });
    });

    describe('deleteTransaction', () => {
        it('calls the transaction deletion endpoint', async () => {
            const id = 123;

            axios.delete.mockResolvedValue({});

            await transactionsService.deleteTransaction(axios, { id });

            expect(axios.delete).toHaveBeenCalledWith(`api/users/transactions/${id}`);
        });
    });
});
