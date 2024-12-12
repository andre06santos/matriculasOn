import { Link } from "react-router-dom";
import "./styles.css";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { useRef, useState } from "react";
import { Modal } from "../../../ui/modal";
import {
  handleChangeFilterNome,
  handleChangeFilterUsername,
} from "../../../modules/alunosAdmFormValidation";

const ListUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [nome, setNome] = useState("");
  const [status, setStatus] = useState("");
  const usernameInput = useRef<any>(null);
  const selectInputRef = useRef<any>(null);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const isAluno = (tipo: any) => {
    return tipo === "Aluno";
  };

  const onClean = () => {
    setUsername("");
    setNome("");
    setStatus("");
  };

  const onFocus = () => usernameInput.current.focus();

  const onReset = () => {
    onClean();
    onFocus();
  };

  return (
    <div className="flex-column-gap20">
      {isModalOpen && (
        <Modal
          message="Tem certeza que deseja excluir o cadastro deste usuário?"
          onCancel={closeModal}
        />
      )}
      <div className="add-button">
        <Button label="Adicionar" type="success" selectOptions={options} />
      </div>
      <h1>Usuários</h1>

      <div className="filter flex-column-gap20">
        <span>Filtros</span>
        <form className="form-filter">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e: any) =>
              handleChangeFilterUsername(e.target.value, setUsername)
            }
            ref={usernameInput}
          />
          <Input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e: any) =>
              handleChangeFilterNome(e.target.value, setNome)
            }
          <div className="form-actions">
            <Input type="submit" variant="bgInfo" value="Buscar" />
            <Input
              type="reset"
              variant="bgNeutral"
              value="Limpar"
              onClick={onReset}
            />
          </div>
        </form>
      </div>

      <p>
        Total de usuários encontradas:{" "}
        <span className="permissions-quantity">3</span>
      </p>

      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index): any => (
            <tr key={index}>
              <td>{user.username}</td>
              <td>{user.nome}</td>
              <td>{user.tipo}</td>
              <td className={user.status ? "td-ativo" : "td-inativo"}>
                {user.status ? "Ativo" : "Inativo"}
              </td>
              <td className="table-actions action-column">
                <Link
                  to={
                    isAluno(user.tipo)
                      ? "/alunos/editar-aluno"
                      : "/administradores/editar-administrador"
                  }
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </Link>
                <i className="fa-solid fa-trash-can" onClick={openModal}></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { ListUser };
