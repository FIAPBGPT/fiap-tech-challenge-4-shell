/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState, useCallback } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import { GridColDef } from "@mui/x-data-grid";
import { jwtDecode } from "jwt-decode";
import { useSession } from "next-auth/react";
import { DefaultSession } from "next-auth";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";

import ButtonTCF from "../../@core/components/ui/Button";
import CardTCF from "../../@core/components/ui/Card";
import DatatableTCF from "../../@core/components/ui/Datatable";
import ModalTCF from "../../@core/components/ui/Modal";
import ToastTCF from "../../@core/components/Toast";
import BaseActions from "../../@core/components/ui/Datatable/BaseActions";
import TransacaoForm from "../../@core/components/forms/Transacao";
import ModalUploadTransacoes from "./modalUpload";

import transactionTypeDictionary from "../../@core/utils/transaction-type-dictionary";
import useAxiosAuth from "@/@core/hooks/useAxiosAuth";
import transactionsService from "@/@core/services/api-node/transactions.service";
import { useTransactions } from "@/@core/hooks/useTransactions";

interface CustomJwtPayload {
  userId: string;
  iat: number;
  exp: number;
}
declare module "next-auth" {
  interface User {
    token?: string;
  }

  interface Session extends DefaultSession {
    user: User;
  }
}

export default function Transacoes() {
  const axiosHookHandler = useAxiosAuth();
  const { data: session } = useSession();
  const { user } = useSelector((state: any) => state.user);

  const token = session?.user?.token;
  let userId = "";

  if (token) {
    try {
      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      userId = decodedToken.userId;
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
    }
  }

  const { data: transactions = [], isLoading, refetch } = useTransactions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalUploadOpen, setIsModalUploadOpen] = useState(false);
  const [isModalTransacaoOpen, setIsModalTransacaoOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [typeTransaction, setTypeTransaction] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [dataToForm, setDataToForm] = useState<any>(null); // Inicializando como null
  const [rowId, setRowId] = useState(null);

  const [toastState, setToastState] = useState<{
    show: boolean;
    title: string;
    message: string;
    icon: "success" | "error" | "warning" | "info" | undefined;
  }>({
    show: false,
    title: "",
    message: "",
    icon: undefined,
  });

  const itemClickedCurrent = useRef<any>();

  const TransacoesGraficos = dynamic<{ token: string; clientId: string }>(
    // @ts-ignore
    () => import("remoteNextApp/transacoesGrafico"),
    {
      ssr: false,
      loading: () => (
        <Row>
          <Col className="d-flex justify-content-center">
            <Spinner
              animation="border"
              role="status"
              variant="secondary"
              size="sm"
            />
          </Col>
        </Row>
      ),
    }
  );

  const handleToast = (title: string, message: string, icon: "success" | "error" | "warning" | "info" | undefined) => {
    setToastState({ show: true, title, message, icon });
    setTimeout(() => setToastState({ ...toastState, show: false }), 3000);
  };

  const handleModalUploadOpen = () => setIsModalUploadOpen(true);
  const handleModalClose = () => setIsModalUploadOpen(false);
  const handleDeleteClose = () => setIsModalOpen(false);

  const handleShowDelete = (itemClicked: any) => {
    setIsModalOpen(true);
    itemClickedCurrent.current = itemClicked;
  };

  const handleCloseDeleteSubmit = async () => {
    await transactionsService
      .deleteTransaction(axiosHookHandler, { id: itemClickedCurrent.current })
      .then(() => {
        refetch();
        handleToast("Sucesso!", "Transação Removida com Sucesso", "success");
        setIsModalOpen(false);
      });
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `files/modelo-transacao.csv`;
    link.download = "modelo-transacao.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTransacaoModal = async (
    type: string,
    state: boolean,
    value?: any
  ) => {
    setTypeTransaction(type);
    setModalTitle(
      type === "add"
        ? "Nova Transação"
        : type === "edit"
        ? "Editar Transação"
        : "Visualizar Transação"
    );

    if (type !== "add" && value) {
      try {
        setIsModalLoading(true); // 👉 Começa loading
        const res = await transactionsService.getTransactionById(
          axiosHookHandler,
          { id: value }
        );
        setDataToForm(res.data);
        setIsModalLoading(false); // 👉 Finaliza loading
        setIsModalTransacaoOpen(state);
      } catch (error) {
        console.error(error);
        setIsModalLoading(false);
      }
    } else {
      setDataToForm({});
      setIsModalTransacaoOpen(state);
    }
  };

  const handleTransacaoForm = useCallback(
    async (e: Event, formData: any) => {
      e.preventDefault();
      if (!user.token) return;

      const decodedUser: any = jwtDecode(user.token);

      const payload = {
        ...formData,
        userId: decodedUser.userId,
        description:
          typeTransaction === "add" ? "Transação Criada" : "Transação Editada",
      };

      try {
        if (typeTransaction === "add") {
          await transactionsService.createTransaction(
            axiosHookHandler,
            payload
          );
        } else {
          await transactionsService.updateTransaction(
            axiosHookHandler,
            payload,
            { id: formData._id }
          );
        }
        refetch();
      } catch (error) {
        console.error(error);
      }

      setIsModalTransacaoOpen(false); // Fecha o modal após salvar
    },
    [typeTransaction, user, refetch]
  );

  const columns: GridColDef[] = [
    {
      field: "actions",
      headerName: "Ações",
      headerClassName: "datatable-tcf",
      type: "actions",
      renderCell: (params) => (
        <BaseActions
          editAction={handleTransacaoModal}
          viewAction={handleTransacaoModal}
          deleteAction={handleShowDelete}
          {...{ params, rowId, setRowId }}
        />
      ),
    },
    {
      field: "transaction",
      headerName: "Transação",
      headerClassName: "datatable-tcf",
      width: 130,
    },
    {
      field: "amount",
      headerName: "Quantia",
      headerClassName: "datatable-tcf",
      width: 130,
    },
    {
      field: "date",
      headerName: "Data",
      headerClassName: "datatable-tcf",
      width: 400,
    },
  ];

  const parsedTransactions = transactions.map((item: any) => {
    const options: any = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };

    return {
      ...item,
      amount:
        item.transactionType === "deposito" ? item.amount : item.amount * -1,
      transaction: transactionTypeDictionary.get(item.transactionType),
      date: new Date(item.date).toLocaleDateString("pt-BR", options),
      id: item._id,
    };
  });

  return (
    <>
     
      <ToastTCF
        icon={toastState.icon}
        message={toastState.message}
        title={toastState.title}
        showToast={toastState.show}
      />

      <Row>
        <Col xs={12} className="mb-3">
          <CardTCF
            title="Listagem de Transações"
            body={
              <ListagemComponent
                columns={columns}
                transactions={parsedTransactions}
                paginationModel={{ page: 0, pageSize: 5 }}
                loading={isLoading}
                functionSubmit={handleTransacaoForm}
                functionHandleDownload={handleDownload}
                functionHandleModalOpen={handleModalUploadOpen}
                functionHandleModal={handleTransacaoModal}
                isModalOpen={isModalTransacaoOpen}
                modalTitle={modalTitle}
                typeTransaction={typeTransaction}
                dataToForm={dataToForm}
                isModalLoading={isModalLoading}
              />
            }
          />
        </Col>
        <Col xs={12}>
          <CardTCF
            title="Resumo das Transações"
            body={<TransacoesGraficos token={token!} clientId={userId} />}
          />
        </Col>
      </Row>

      <ModalTCF
        title="Remover Transação"
        isOpen={isModalOpen}
        body="Tem certeza que deseja remover essa transação?"
        hasFooter={true}
        center={true}
        sizeModal="md"
        type="delete"
        onCloseAction={handleDeleteClose}
        onSubmitAction={handleCloseDeleteSubmit}
      />

      <ModalUploadTransacoes
        isOpen={isModalUploadOpen}
        body={<p>Conteúdo do modal centralizado e responsivo</p>}
        center={true}
        type={"home-modal"}
        hasFooter={true}
        onCloseAction={handleModalClose}
        onSubmitAction={refetch}
      />
    </>
  );
}

export function ListagemComponent(props: any) {
  return (
    <>
      <Row>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          className="d-flex d-md-flex justify-content-end gap-3 mb-3"
        >
          <ButtonTCF
            variant={"primary"}
            label={"Baixar Template"}
            disabled={false}
            size={"sm"}
            onClick={() => props.functionHandleDownload()}
          />

          <ButtonTCF
            variant="green"
            label="Transações em Lote"
            disabled={false}
            size="sm"
            onClick={props.functionHandleModalOpen}
          />

          <ButtonTCF
            variant={"green"}
            label={"Nova Transação"}
            disabled={false}
            size={"sm"}
            onClick={() => props.functionHandleModal("add", true)}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="mb-3">
          <DatatableTCF
            columns={props.columns}
            rows={props.transactions}
            paginationModel={props.paginationModel}
            loading={props.loading}
          />
        </Col>
      </Row>
      {props.isModalOpen && (
        <ModalTCF
          isOpen={true}
          body={
            props.isModalLoading ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "200px" }}
              >
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <TransacaoForm
                isEdit={props.typeTransaction === "edit"}
                isView={props.typeTransaction === "view"}
                formValues={props.dataToForm || {}}
                showDatePicker={true}
                onSubmitAction={props.functionSubmit}
              />
            )
          }
          title={props.modalTitle}
          hasFooter={false}
          center={true}
          sizeModal="md"
          type={"transacao"}
          onCloseAction={() => props.functionHandleModal("", false)}
        />
      )}
    </>
  );
}
