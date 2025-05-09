import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Header from '../../@core/components/Home/Header';
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "styled-components";
import "@testing-library/jest-dom";

const mockTheme = {
    themeColor: {
        dark: "#000000",
        success: "#00FF00",
    },
    themeFonts: {
        headerSemibold: {
            fontFamily: "Arial",
            fontSize: "16px",
            fontWeight: "bold",
            lineHeight: "20px",
        },
    },
};

// Mock do useSession do NextAuth
jest.mock("next-auth/react", () => ({
    ...jest.requireActual("next-auth/react"),
    useSession: jest.fn(() => ({ data: null })),
}));

// Mock do useRouter
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// Mock do useAxiosAuth
jest.mock("@/@core/hooks/useAxiosAuth", () => ({
    __esModule: true,
    default: () => ({
        post: jest.fn(),
    }),
}));

describe("Header component", () => {
    it("deve renderizar o logo", () => {
        render(
            <SessionProvider session={null}>
                <ThemeProvider theme={mockTheme}>
                    <Header />
                </ThemeProvider>
            </SessionProvider>
        );

        const logo = screen.getAllByAltText("Descrição da imagem")[0];
        expect(logo).toBeInTheDocument();
    });

    it("deve abrir o modal de cadastro ao clicar em 'Abrir Minha Conta'", async () => {
        render(
            <SessionProvider session={null}>
                <ThemeProvider theme={mockTheme}>
                    <Header />
                </ThemeProvider>
            </SessionProvider>
        );

        const cadastroButton = screen.getByRole("button", { name: "Abrir Minha Conta" });
        fireEvent.click(cadastroButton);

        await waitFor(() => {
            expect(screen.getByAltText("Ilustração Cadastro")).toBeInTheDocument();
        });
    });

    it("deve abrir o modal de login ao clicar em 'Já Tenho Conta'", async () => {
        render(
            <SessionProvider session={null}>
                <ThemeProvider theme={mockTheme}>
                    <Header />
                </ThemeProvider>
            </SessionProvider>
        );

  
        const loginButton = screen.getByText(/Já Tenho Conta/i);
        fireEvent.click(loginButton);

        console.log("screen", screen.debug());

        await waitFor(() => {

            console.log("screen", screen.debug());
            expect(screen.getByText(/Login/i)).toBeInTheDocument();
        });
    });

    it("deve tentar cadastrar usuário ao enviar formulário de cadastro", async () => {

        global.innerWidth = 1024; 

        render(
            <SessionProvider session={null}>
                <ThemeProvider theme={mockTheme}>
                    <Header />
                </ThemeProvider>
            </SessionProvider>
        );


        const cadastroButton = screen.getByRole("button", { name: "Abrir Minha Conta" });
        fireEvent.click(cadastroButton);


        await waitFor(() => {
            expect(screen.getByAltText("Ilustração Cadastro")).toBeInTheDocument();
        });

    });

});
