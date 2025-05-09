import { Col, Form, Row } from "react-bootstrap";
import Image from "next/image";
import { LoginFormProps } from "../../props/login-form";
import ButtonTCF from "../ui/Button";
import * as formik from "formik";
import * as yup from "yup";
import { RowCentered } from "../../../@theme/custom/RowCenter";
import {
  FormLabelStrong,
  PStrong,
  LinkCustom,
} from "../../../@theme/custom/FormStyles";

const LoginForm: React.FC<LoginFormProps> = ({ onSubmitAction }) => {
  const { Formik } = formik;

  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Por favor, digite um e-mail válido!")
      .matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
        "Digite um endereço de e-mail válido"
      )
      .required("Por favor, digite seu e-mail"),
    password: yup
      .string()
      .required("Por favor, digite sua senha")
      .min(8, "Senha muito curta - mínimo de 8 caracteres"),
  });

  return (
    <>
      <Formik
        validationSchema={schema}
        onSubmit={console.log}
        initialValues={{
          email: "",
          password: "",
        }}
      >
        {({
          handleSubmit,
          handleChange,
          values,
          touched,
          errors,
          dirty,
          isValid,
        }) => (
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
              if (onSubmitAction) {
                onSubmitAction(values);
              }
            }}
          >
            <RowCentered className="mb-5">
              <Col xs={12} sm={12} md={12} lg={12}>
                <Image
                  src="forms/IlustracaoLogin.svg"
                  width={333.25}
                  height={267}
                  alt="Ilustração Login"
                />
              </Col>
            </RowCentered>
            <RowCentered className="mb-1">
              <Col xs={12} sm={12} md={12} lg={12}>
                <PStrong>Login</PStrong>
              </Col>
            </RowCentered>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Group className="mb-3" controlId="email">
                  <FormLabelStrong>E-mail</FormLabelStrong>
                  <Form.Control
                    type="email"
                    placeholder="Digite seu e-mail"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={touched.email && !!errors.email}
                    isValid={touched.email && !errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                  <Form.Control.Feedback type="valid">
                    E-mail válido!
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Group className="mb-3" controlId="password">
                  <FormLabelStrong>Senha</FormLabelStrong>
                  <Form.Control
                    type="password"
                    placeholder="Digite sua senha"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    isInvalid={touched.password && !!errors.password}
                    isValid={touched.password && !errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                  <Form.Control.Feedback type="valid">
                    Senha válida!
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12}>
                <LinkCustom href="#">Esqueci a senha!</LinkCustom>
              </Col>
            </Row>
            <RowCentered>
              <Col xs={12} sm={12} md={12} lg={12}>
                <ButtonTCF
                  variant={"green"}
                  label={"Acessar"}
                  disabled={!(dirty && isValid)}
                  size={"sm"}
                  type="submit"
                />
              </Col>
            </RowCentered>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default LoginForm;
