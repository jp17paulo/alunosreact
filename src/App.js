import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import logoCadastro from "./assets/cadastro.png";

function App({ baseUrl = "https://localhost:44340/api/alunos" }) {
  // BaseUrl com valor padrão
  const [data, setData] = useState([]);
  const [updateData, setUpdateData] = useState(true);
  const [loading, setLoading] = useState(true);
  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [error, setError] = useState(null);

  const [alunoSelecionado, setAlunoSelecionado] = useState({
    id: "",
    nome: "",
    email: "",
    idade: "",
  });

  const selecionarAluno = (aluno, opcao) => {
    setAlunoSelecionado(aluno);

    // Se a opção for "Editar", abre ou fecha o modal de edição
    opcao === "Editar" ? abrirFecharModalEditar() : abrirFecharModalExcluir();
  };

  const abrirFecharModalIncluir = () => {
    setModalIncluir(!modalIncluir);
  };

  const abrirFecharModalEditar = () => {
    setModalEditar(!modalEditar);
  };

  const abrirFecharModalExcluir = () => {
    setModalExcluir(!modalExcluir);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlunoSelecionado({
      ...alunoSelecionado,
      [name]: value,
    });
    console.log(alunoSelecionado);
  };

  const pedidoGet = async () => {
    try {
      const response = await axios.get(baseUrl);
      setData(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setError("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  const pedidoPost = async () => {
    delete alunoSelecionado.id;
    alunoSelecionado.idade = parseInt(alunoSelecionado.idade);

    try {
      const response = await axios.post(baseUrl, alunoSelecionado);
      setData(data.concat(response.data));
      setUpdateData(true);
      abrirFecharModalIncluir();
    } catch (error) {
      console.log(error);
    }
  };

  const pedidoPut = async () => {
    alunoSelecionado.idade = parseInt(alunoSelecionado.idade);

    await axios
      .put(baseUrl + "/" + alunoSelecionado.id, alunoSelecionado)
      .then((response) => {
        var resposta = response.data;
        var dadosAuxiliar = data;
        console.log(data);
        // eslint-disable-next-line array-callback-return
        dadosAuxiliar.map((aluno) => {
          if (aluno.id === alunoSelecionado.id) {
            aluno.nome = resposta.nome;
            aluno.email = resposta.email;
            aluno.idade = resposta.idade;
          }
        });
        setUpdateData(true);
        abrirFecharModalEditar();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const pedidoDelete = async () => {
    try {
      // const response = await axios.delete(baseUrl + "/" + alunoSelecionado.id);

      // Atualiza a lista de alunos, removendo o aluno excluído
      setData(data.filter((aluno) => aluno.id !== alunoSelecionado.id));
      setUpdateData(true);

      // Fecha o modal de exclusão
      abrirFecharModalExcluir();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (updateData) {
      pedidoGet(); // Função para buscar os dados
      setUpdateData(false); // Evita loop, reseta o estado
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateData]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="aluno-container">
      <h3>Cadastro de Alunos</h3>
      <br />
      <header>
        <img src={logoCadastro} alt="Cadastro" />
        <button onClick={abrirFecharModalIncluir} className="btn btn-success">
          Incluir Novo Aluno
        </button>
      </header>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Idade</th>
            <th>Operação</th>
          </tr>
        </thead>
        <tbody>
          {data.map((aluno) => (
            <tr key={aluno.id}>
              <td>{aluno.id}</td>
              <td>{aluno.nome}</td>
              <td>{aluno.email}</td>
              <td>{aluno.idade}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => selecionarAluno(aluno, "Editar")}
                >
                  Editar
                </button>
                {" | "}
                <button
                  className="btn btn-danger"
                  onClick={() => selecionarAluno(aluno, "Excluir")}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={modalIncluir} toggle={abrirFecharModalIncluir}>
        <ModalHeader toggle={abrirFecharModalIncluir}>
          Incluir Alunos
        </ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nome:</label>
            <input
              type="text"
              className="form-control"
              name="nome"
              onChange={handleChange}
            />
            <br />
            <label>Email:</label>
            <input
              type="text"
              className="form-control"
              name="email"
              onChange={handleChange}
            />
            <br />
            <label>Idade:</label>
            <input
              type="text"
              className="form-control"
              name="idade"
              onChange={handleChange}
            />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="btn btn-primary" onClick={pedidoPost}>
            Incluir
          </Button>
          <Button className="btn btn-danger" onClick={abrirFecharModalIncluir}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={modalEditar} toggle={abrirFecharModalEditar}>
        <ModalHeader toggle={abrirFecharModalEditar}>Editar Aluno</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>ID:</label>
            <br />
            <input
              type="text"
              readOnly
              value={alunoSelecionado && alunoSelecionado.id}
            />
            <br />
            <label>Nome:</label>
            <br />
            <input
              type="text"
              className="form-control"
              name="nome"
              onChange={handleChange}
              value={alunoSelecionado && alunoSelecionado.nome}
            />
            <br />
            <label>Email:</label>
            <br />
            <input
              type="text"
              className="form-control"
              name="email"
              onChange={handleChange}
              value={alunoSelecionado && alunoSelecionado.email}
            />
            <br />
            <label>Idade:</label>
            <br />
            <input
              type="text"
              className="form-control"
              name="idade"
              onChange={handleChange}
              value={alunoSelecionado && alunoSelecionado.idade}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoPut()}>
            Editar
          </button>
          {"  "}
          <button
            className="btn btn-danger"
            onClick={() => abrirFecharModalEditar()}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={modalExcluir}>
        <ModalBody>
          Confirma a exclusão deste(a) aluno(a):{" "}
          {alunoSelecionado && alunoSelecionado.nome}?
        </ModalBody>

        <ModalFooter>
          <button
            className="btn btn-danger"
            onClick={() => pedidoDelete()} // Função que lida com a exclusão do aluno
          >
            Sim
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => abrirFecharModalExcluir()} // Função que lida com o cancelamento da exclusão
          >
            Não
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
