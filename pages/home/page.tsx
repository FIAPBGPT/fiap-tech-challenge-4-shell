/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useEffect, useState, Suspense, lazy, useCallback } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import {
  AttachMoney,
  Euro,
  CurrencyPound,
  CurrencyFranc,
} from "@mui/icons-material";
import dynamic from "next/dynamic";
import { jwtDecode } from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";

import ToastTCF from "@/@core/components/Toast";
import CardCotacoes from "@/@core/components/ui/CardCotacoes/CardCotacoes";
import TransacaoForm from "@/@core/components/forms/Transacao";
import useAxiosAuth from "@/@core/hooks/useAxiosAuth";
import userService from "@/@core/services/api-node/user.service";
import transactionsService from "@/@core/services/api-node/transactions.service";
import { returnUserData } from "@/store/user/action";
import { useTransactions } from "@/@core/hooks/useTransactions";
import { useCotacoes } from "@/@core/hooks/useCotacoes";
import { useQueryClient } from "@tanstack/react-query";

const CardSaldoComponent = lazy(
  () => import("@/@core/components/ui/CardSaldo/CardSaldo")
);
const CardTCF = lazy(() => import("@/@core/components/ui/Card"));
const HomeStatement = lazy(() => import("./page.home-statement"));

// @ts-expect-error
const Graficos = dynamic(() => import("remoteNextApp/areaGrafico"), {
  ssr: false,
  loading: () => <Spinner animation="border" variant="secondary" size="sm" />,
});

// @ts-expect-error
const WidgetsComponent = dynamic(() => import("remoteNextApp/widgets"), {
  ssr: false,
  loading: () => <Spinner animation="border" variant="secondary" size="sm" />,
});

interface WidgetProps {
  id: string;
  name: string;
  data: Record<string, unknown>;
}

export default function Home({ widgets }: { widgets: WidgetProps[] }) {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const dispatch = useDispatch();
  const { user } = useSelector((state: unknown) => state.user);
  const axiosHookHandler = useAxiosAuth();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: transactions = [], isLoading: loadingTransactions } =
    useTransactions();
  const {
    data: cotas = [],
    isLoading: loadingCotas,
    isSuccess,
  } = useCotacoes();

  const [balance, setBalance] = useState(0);
  const [transactionsToMFE, setTransactionsToMFE] = useState<unknown>([]);
  const [widgetsToMFE, setWidgetsToMFE] = useState<unknown>({});
  const [loadWidgets, setLoadWidgets] = useState(false);
  const [valueToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState<
    "success" | "error" | "warning" | "info" | undefined
  >(undefined);
  const [toastTitle, setToastTitle] = useState("");
  const [reloadStatement, setReloadStatement] = useState<boolean>(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!transactions || transactions.length === 0) return;

    setTransactionsToMFE(transactions);

    const saldoCalculado = transactions.reduce((sum: number, t: any) => {
      const tipo = t.transactionType;
      const valor = t.amount;

      const tiposEntrada = ["deposito", "credito", "pix", "ted", "tef"];
      const tiposSaida = ["debito"];

      if (tiposEntrada.includes(tipo)) {
        return sum + valor;
      }

      if (tiposSaida.includes(tipo)) {
        return sum - valor;
      }

      return sum; // Ignora tipos desconhecidos
    }, 0);

    setBalance(saldoCalculado);
  }, [transactions]);

  const getCurrencyIcon = (moeda: string) => {
    switch (moeda) {
      case "USD":
        return <AttachMoney />;
      case "EUR":
        return <Euro />;
      case "GBP":
        return <CurrencyPound />;
      case "CHF":
        return <CurrencyFranc />;
      default:
        return null;
    }
  };

  const handleTransacaoForm = useCallback(
    async (e: any, formData: any) => {
      e.preventDefault();

      const token: string = user.token;
      const decodedUser: any = jwtDecode(token);
      const formattedFormData = {
        ...formData,
        userId: decodedUser.userId,
        description: "Transação Realizada na Home",
      };

      try {
        await transactionsService.createTransaction(
          axiosHookHandler,
          formattedFormData
        );

        // ✅ Atualiza a lista de transações
        queryClient.invalidateQueries({ queryKey: ["transactions"] });

        setShowToast(true);
        setMessage("Transação Realizada com Sucesso");
        setIcon("success");
        setToastTitle("Sucesso!");
        setReloadStatement(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (error: any) {
        setShowToast(true);
        setMessage(error.response?.data?.message || "Erro");
        setIcon("error");
        setToastTitle("Erro!");
        setTimeout(() => setShowToast(false), 3000);
      }
    },
    [user, axiosHookHandler]
  );

  useEffect(() => {
    if (reloadStatement === true) setReloadStatement(false);
  }, [reloadStatement]);

  const updateUserWidgets = useCallback(async () => {
    if (user.token === "" || Object.keys(widgetsToMFE as object).length === 0)
      return;
    const token: string = user.token;
    const decodedUser: any = jwtDecode(token);

    const userId: any = { id: decodedUser.userId };
    const formattedDataToUpdate: any = {
      username: "",
      email: "",
      password: "",
      widgets: widgetsToMFE,
    };
    await userService
      .updateUser(axiosHookHandler, formattedDataToUpdate, userId)
      .then(() => {
        dispatch(
          returnUserData({
            ...user,
            widgets: widgetsToMFE,
          })
        );
        setShowToast(true);
        setMessage("Widgets Atualizados com Sucesso");
        setIcon("success");
        setToastTitle("Sucesso!");
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      })
      .catch((error: any) => {
        setShowToast(true);
        setMessage(error.response.data.message);
        setIcon("error");
        setToastTitle("Erro!");
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
        console.error(error.response.data.message);
      });
  }, [user, widgetsToMFE]);

  useEffect(() => {
    if (user.username === "") return;
    updateUserWidgets();
  }, [widgetsToMFE]);

  useEffect(() => {
    if (user.username === "") return;
    setLoadWidgets(true);
    setTimeout(() => setLoadWidgets(false), 2000);
    widgets(widgetsToMFE);
  }, [user]);
  if (!hasMounted) return null;

  return (
    <>
      <ToastTCF
        icon={icon}
        message={message}
        title={toastTitle}
        showToast={valueToast}
      />

      <Col xs={12} sm={12} md={8} lg={8} xl={8}>
        <Suspense fallback={<div>Carregando...</div>}>
          <Row>
            <Col>
              {loadingTransactions || !isSuccess ? (
                <div>Carregando saldo...</div>
              ) : (
                <CardSaldoComponent
                  name={user?.username}
                  balance={balance}
                  showBalance={false}
                />
              )}
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <CardTCF
                title="Nova Transação"
                body={
                  <TransacaoForm
                    onSubmitAction={handleTransacaoForm}
                    showDatePicker={false}
                  />
                }
              />
            </Col>
          </Row>
        </Suspense>

        <Row className="mt-4">
          <Col>
            <div className="d-flex flex-wrap justify-content-between gap-3">
              {loadingCotas || !isSuccess ? (
                <div>Carregando cotações...</div>
              ) : (
                cotas.map((cotacao, idx) => (
                  <CardCotacoes
                    key={idx}
                    moeda={<span>{getCurrencyIcon(cotacao.moeda)}</span>}
                    nome={cotacao.nome}
                    cotacao={cotacao.cotacao}
                    variacao={cotacao.variacao}
                  />
                ))
              )}
            </div>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <Graficos />
          </Col>
        </Row>
      </Col>

      <Col className="pe-0" xs={12} sm={12} md={4} lg={4} xl={4}>
        <Row>
          <Col className="ps-0" xs={12} sm={12} md={12} lg={12} xl={12}>
            <HomeStatement
              onTransactionsLoaded={() => {}}
              reload={reloadStatement}
            />
          </Col>
          <Col className="mt-3 ps-0" xs={12} sm={12} md={12} lg={12} xl={12}>
            <WidgetsComponent
              loading={loadWidgets}
              userSession={user}
              transactions={transactionsToMFE}
              setWidgets={setWidgetsToMFE}
            />
          </Col>
        </Row>
      </Col>
    </>
  );
}
