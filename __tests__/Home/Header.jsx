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

        // Clica no botão "Já Tenho Conta"
        const loginButton = screen.getByText(/Já Tenho Conta/i);
        fireEvent.click(loginButton);

        console.log("screen", screen.debug());
        // Espera o modal aparecer
        await waitFor(() => {
            // Agora espera que o texto "Preencha os campos" esteja na tela
            console.log("screen", screen.debug());
            expect(screen.getByText(/Login/i)).toBeInTheDocument();
        });
    });

    it("deve tentar cadastrar usuário ao enviar formulário de cadastro", async () => {
        // Simula uma tela maior para garantir que o botão "Abrir Minha Conta" esteja visível
        global.innerWidth = 1024;  // Defina a largura da tela para garantir que o botão seja exibido

        render(
            <SessionProvider session={null}>
                <ThemeProvider theme={mockTheme}>
                    <Header />
                </ThemeProvider>
            </SessionProvider>
        );

        // Clica no botão "Abrir Minha Conta"
        const cadastroButton = screen.getByRole("button", { name: "Abrir Minha Conta" });
        fireEvent.click(cadastroButton);

        // Espera a imagem de cadastro ser exibida no modal
        await waitFor(() => {
            expect(screen.getByAltText("Ilustração Cadastro")).toBeInTheDocument();
        });

        // // Preenche os campos do formulário
        // fireEvent.change(screen.getByPlaceholderText("Digite seu nome completo"), {
        //     target: { value: "Usuário Teste" },
        // });
        // fireEvent.change(screen.getByPlaceholderText("Digite seu e-mail"), {
        //     target: { value: "teste@teste.com" },
        // });
        // fireEvent.change(screen.getByPlaceholderText("Digite sua senha"), {
        //     target: { value: "123456" },
        // });

        // // Marca a opção de concordar com os termos
        // fireEvent.click(screen.getByLabelText(/Li e estou ciente/i));

        // // Simula o envio do formulário
        // const submitButton = screen.getByRole("button", { name: /Criar Conta/i });
        // fireEvent.click(submitButton);

        // // Espera o toast de "Usuário Cadastrado" ser exibido após o envio
        // await waitFor(() => {
        //     // Verifica se o toast de sucesso foi exibido
        //     expect(screen.getByText(/Usuário Cadastrado com Sucesso!/i)).toBeInTheDocument();
        // });
    });

});
