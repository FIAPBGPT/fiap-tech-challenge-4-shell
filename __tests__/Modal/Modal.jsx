jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node) => node,
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModalTCF from '../../@core/components/ui/Modal';

describe('ModalTCF', () => {
  const mockClose = jest.fn();
  const mockSubmit = jest.fn();

  const baseProps = {
    isOpen: true,
    title: 'Título de Teste',
    body: <div>Corpo do Modal</div>,
    sizeModal: 'md',
    center: true,
    hasFooter: true,
    type: 'delete',
    onCloseAction: mockClose,
    onSubmitAction: mockSubmit,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente quando isOpen é true', () => {
    render(<ModalTCF {...baseProps} />);
    expect(screen.getByTestId('modal-body')).toBeInTheDocument();
    expect(screen.getByText(/título de teste/i)).toBeInTheDocument();
    expect(screen.getByText(/corpo do modal/i)).toBeInTheDocument();
  });

  it('chama onCloseAction ao clicar no botão Cancelar', () => {
    render(<ModalTCF {...baseProps} />);
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);
    expect(mockClose).toHaveBeenCalledWith('delete');
  });

  it('chama onSubmitAction ao clicar no botão OK', () => {
    render(<ModalTCF {...baseProps} />);
    const okButton = screen.getByRole('button', { name: /ok/i });
    fireEvent.click(okButton);
    expect(mockSubmit).toHaveBeenCalled();
  });

  it('não renderiza o footer quando hasFooter for false', () => {
    render(<ModalTCF {...baseProps} hasFooter={false} />);
    expect(screen.queryByText(/cancelar/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/ok/i)).not.toBeInTheDocument();
  });

  it('não renderiza o título quando title é vazio', () => {
    render(<ModalTCF {...baseProps} title="" />);
    expect(screen.queryByText(/título de teste/i)).not.toBeInTheDocument();
  });

  it('não renderiza nada quando isOpen é false', () => {
    render(<ModalTCF {...baseProps} isOpen={false} />);
    expect(screen.queryByTestId('modal-body')).not.toBeInTheDocument();
  });

  it('chama onCloseAction ao clicar no botão de fechar do header', () => {
    render(<ModalTCF {...baseProps} />);
    const closeButton = screen.getByRole('button', { name: /close/i }); // botão de fechar do Modal.Header
    fireEvent.click(closeButton);
    expect(mockClose).toHaveBeenCalledWith('delete');
  });
});
