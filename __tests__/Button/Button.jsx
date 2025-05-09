import { render, screen, fireEvent } from "@testing-library/react";
import ButtonTCF from "../../@core/components/ui/Button";
import { FaBeer } from "react-icons/fa";
import "@testing-library/jest-dom";
describe("ButtonTCF", () => {
  it("renderiza com label", () => {
    render(<ButtonTCF label="Clique aqui" />);
    expect(screen.getByText("Clique aqui")).toBeInTheDocument();
  });


  it("aplica classe 'rounded-circle' quando rounded=true", () => {
    render(<ButtonTCF label="Rounded" rounded />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("rounded-circle");
  });

  it("aplica classe 'w-icon' quando icon é passado", () => {
    render(<ButtonTCF label="Icon Button" icon={<FaBeer />} />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("w-icon");
  });

  it("aplica 'disabled' corretamente", () => {
    render(<ButtonTCF label="Desativado" disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("chama função onClick ao clicar", () => {
    const onClickMock = jest.fn();
    render(<ButtonTCF label="Clique" onClick={onClickMock} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClickMock).toHaveBeenCalled();
  });
});
