/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import { Col, Form, Row } from "react-bootstrap";
import { TransacaoFormProps } from "../../props/transacao-form";
import ButtonTCF from "../ui/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as formik from "formik";
import * as yup from "yup";
import {
  ErrorMessage,
  FormLabelStrong,
} from "../../../@theme/custom/FormStyles";
import { useEffect, useRef, useState } from "react";

const TransacaoForm: React.FC<TransacaoFormProps> = ({
  formValues,
  isEdit,
  isView,
  showDatePicker,
  onSubmitAction,
}) => {
  const { Formik } = formik;
  const [startDate, setStartDate] = useState(new Date());
  const initialValue = useRef<any>({
    transactionType: "",
    amount: "",
    date: new Date(), // Inicializa com um valor padrão de data
  });
  const [loading, setLoading] = useState(true);

  const schema = yup.object().shape({
    transactionType: yup
      .string()
      .required("Por favor, escolha um tipo de transação!"),
    amount: yup
      .number()
      .positive("Deve ser um valor positivo!")
      .required("Por favor, insira um valor!")
      .min(1, "O valor tem que ser maior ou igual a 1!"),
    date: yup.date().required("Por favor, insira uma data válida!"),
  });

  const beforeSubmit = () => {
    initialValue.current.date = startDate; // Garante que a data correta seja enviada
  };

  useEffect(() => {
    // Espera até que o formulário não esteja em estado de "loading"
    setLoading(true);

    if (!isEdit && !isView) {
      // Caso não seja edição ou visualização, inicializa com valores padrão
      initialValue.current = {
        transactionType: "",
        amount: "",
        date: new Date(),
      };
      setStartDate(new Date()); // Garante que o startDate seja corretamente inicializado
      setLoading(false);
    } else {
      // Caso seja edição ou visualização, usa os valores passados via formValues
      initialValue.current = {
        ...formValues,
        date: formValues?.date ?? new Date(), // Se formValues não tiver 'date', usa a data atual
      };
      setStartDate(formValues?.date ?? new Date()); // Garante que a data seja atualizada
      setLoading(false);
    }
  }, [isView, isEdit, formValues]); // Dependendo de formValues, isEdit ou isView, ele irá atualizar

  return (
    <>
      {!loading && (
        <>
          <Formik
            validationSchema={schema}
            onSubmit={() => console.log()}
            initialValues={initialValue.current}
          >
            {({
              handleSubmit,
              handleChange,
              resetForm,
              values,
              touched,
              errors,
              dirty,
              isValid,
            }) => (
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  beforeSubmit();
                  handleSubmit();
                  onSubmitAction && onSubmitAction(e, values);
                  resetForm();
                }}
              >
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput2"
                    >
                      <FormLabelStrong>Tipo de Transação</FormLabelStrong>
                      <Form.Select
                        aria-label="Transacao"
                        name="transactionType"
                        onChange={handleChange}
                        value={values.transactionType}
                        disabled={isView}
                        isValid={
                          touched.transactionType && !errors.transactionType
                        }
                      >
                        <option>Selecione o Tipo de Transação</option>
                        <option value="credito">Crédito</option>
                        <option value="deposito">Depósito</option>
                        <option value="debito">Débito</option>
                        <option value="pix">PIX</option>
                        <option value="ted">TED</option>
                        <option value="tef">TEF</option>
                      </Form.Select>
                      {errors.transactionType && touched.transactionType && (
                        <ErrorMessage>
                          {errors.transactionType as string}
                        </ErrorMessage>
                      )}
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput3"
                    >
                      <FormLabelStrong>Valor</FormLabelStrong>
                      <Form.Control
                        type="number"
                        placeholder="Informe o Valor"
                        name="amount"
                        step={0.1}
                        value={values.amount}
                        onChange={handleChange}
                        isValid={touched.amount && !errors.amount}
                        disabled={isView}
                      />
                      {errors.amount && touched.amount && (
                        <ErrorMessage>{errors.amount as string}</ErrorMessage>
                      )}
                    </Form.Group>
                  </Col>
                  {showDatePicker && (
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.Datepicker"
                      >
                        <FormLabelStrong>Data</FormLabelStrong>
                        <DatePicker
                          name="date"
                          selected={startDate}
                          disabled={isView}
                          onChange={(date: any) => {
                            setStartDate(date);
                            values.date = date; // Atualiza o valor do formulário para a data selecionada
                          }}
                        />
                        {errors.date && touched.date && (
                          <ErrorMessage>{errors.date as string}</ErrorMessage>
                        )}
                      </Form.Group>
                    </Col>
                  )}
                </Row>
                <Row className="mt-3 text-end">
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <div className="d-grid gap-2">
                      <ButtonTCF
                        variant={"base"}
                        label={!isView ? "Concluir Transação" : "OK"}
                        disabled={
                          !isEdit && !isView ? !(dirty && isValid) : false
                        }
                        size={"sm"}
                        type="submit"
                      />
                    </div>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </>
      )}
    </>
  );
};
export default TransacaoForm;
