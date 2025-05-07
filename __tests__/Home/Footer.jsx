import Footer from '../../@core/components/Home/Footer';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from "styled-components";
import "@testing-library/jest-dom";

// Mock simplificado do tema
const mockTheme = {
  themeColor: {
    white: "#FFFFFF",
  },
  themeFonts: {
    headerSemibold: {
      fontFamily: "Arial",
      fontSize: "16px",
      fontWeight: "bold",
      lineHeight: "20px",
    },
  },
  font_size: {
    fontsizemedium: "14px",
  },
};

describe("Footer component", () => {
  it("deve renderizar as seções de Serviços, Contato e Desenvolvido com Amor", () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <Footer />
      </ThemeProvider>
    );

    expect(screen.getByText("Serviços")).toBeInTheDocument();
    expect(screen.getByText("Conta corrente")).toBeInTheDocument();
    expect(screen.getByText("Conta PJ")).toBeInTheDocument();
    expect(screen.getByText("Cartão de crédito")).toBeInTheDocument();

    expect(screen.getByText("Contato")).toBeInTheDocument();
    expect(screen.getByText("0800 004 250 08")).toBeInTheDocument();
    expect(screen.getByText("teste@gmail.com")).toBeInTheDocument();
    expect(screen.getByText("ouvidoria@outlook.com")).toBeInTheDocument();

    expect(screen.getByText("Desenvolvido com Amor")).toBeInTheDocument();
  });

  it("deve renderizar o logo e os ícones das redes sociais", () => {
    render(
      <ThemeProvider theme={mockTheme}>
        <Footer />
      </ThemeProvider>
    );

    const images = screen.getAllByAltText("Descrição da imagem");
    expect(images.length).toBeGreaterThanOrEqual(1);

    const instagramIcon = images.find((img) =>
      img.getAttribute("src")?.includes("Instagram.svg")
    );
    const whatsappIcon = images.find((img) =>
      img.getAttribute("src")?.includes("Whatsapp.svg")
    );
    const youtubeIcon = images.find((img) =>
      img.getAttribute("src")?.includes("Youtube.svg")
    );

    expect(instagramIcon).toBeInTheDocument();
    expect(whatsappIcon).toBeInTheDocument();
    expect(youtubeIcon).toBeInTheDocument();
  });
});
