import { Fab } from "@mui/material";
import { Row } from "react-bootstrap";
import styled from "styled-components";

export const FloatButtonRow = styled(Row)`
  position: fixed;
  bottom: 20px; /* distância do fundo da tela */
  right: 20px; /* distância da direita da tela */
  z-index: 1000; /* garante que fique acima de outros elementos */
`;
export const FloatButton = styled(Fab)`
  button {
    background-color: ${(props) => props.theme.themeColor.primary};
    color: ${(props) => props.theme.themeColor.white};
  }
`;
