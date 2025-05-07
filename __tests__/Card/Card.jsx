import { render, screen } from "@testing-library/react";
import CardTCF from "../../@core/components/ui/Card/index";
import { ThemeProvider } from "styled-components";
import "@testing-library/jest-dom";

// Mock do tema
const mockTheme = {
  themeColor: {
    darkGrey: "#333333",
    primary: "#FF5733",
  },
};

describe("CardTCF component", () => {
  it("deve renderizar o título corretamente", () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <CardTCF title="Título Teste" />
      </ThemeProvider>
    );

    expect(screen.getByText("Título Teste")).toBeInTheDocument();
  });

  it("deve renderizar o conteúdo do body quando passado", () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <CardTCF title="Teste" body={<p>Conteúdo do corpo</p>} />
      </ThemeProvider>
    );

    expect(screen.getByText("Conteúdo do corpo")).toBeInTheDocument();
  });

  it("deve renderizar o conteúdo do footer quando passado", () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <CardTCF title="Teste" footer={<span>Rodapé aqui</span>} />
      </ThemeProvider>
    );

    expect(screen.getByText("Rodapé aqui")).toBeInTheDocument();
  });

  it("deve renderizar as imagens decorativas com alt correto", () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <CardTCF title="Teste" />
      </ThemeProvider>
    );

    expect(screen.getByAltText("Border Top Right")).toBeInTheDocument();
    expect(screen.getByAltText("Border Bottom Left")).toBeInTheDocument();
  });
});
