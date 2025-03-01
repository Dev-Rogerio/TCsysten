import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { redirectDocument, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Colarinho from "../../AssetsIcons/typeColarinho.png";
import Duplo from "../../AssetsIcons/duplo.png";
import Redondo from "../../AssetsIcons/redondo.png";
import Chanfrado from "../../AssetsIcons/chanfrado.png";
import Site from "../../AssetsIcons/logocotovia.jpeg";
import ModalMeasure from "./Modal.Measure";
import Modal from "./modalError";
import ModalSelect from "./modal.Select";
import { jsPDF } from "jspdf";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import "../Measure/measure.css";
import "../Measure/modalError.css";

function calculateDeliveryDate(date) {
  if (!date) return "";
  const currentDate = new Date(date);
  currentDate.setDate(currentDate.getDate() + 16);
  return currentDate.toLocaleDateString();
}
function Measure() {
  const [dadosCliente, setDadosCliente] = useState(null);
  const [cpf, setCpf] = useState("");
  const [cliente, setCliente] = useState(null);
  const location = useLocation();
  const [contato, setContato] = useState("");
  const [error, setError] = useState("");
  const [formNumber, setFormNumber] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clearColar, setClearColar] = useState("");
  const [clearPala, setClearPala] = useState("");
  const [clearManga, setClearManga] = useState("");
  const [clearTorax, setClearTorax] = useState("");
  const [clearCintura, setClearCintura] = useState("");
  const [clearQuadril, setClearQuadril] = useState("");
  const [clearCumprimento, setClearCumprimento] = useState("");
  const [clearPunho, setClearPunho] = useState("");
  const [clearMetro, setClearMetro] = useState("");

  const [clearParis, setClearParis] = useState("");
  const [clearWindsor, setClearWindsor] = useState("");
  const [clearItaly, setClearItaly] = useState("");
  const [clearIngles, setClearIngles] = useState("");
  const [clearDouglas, setClearDouglas] = useState("");
  const [clearBicoDow, setClearBicoDow] = useState("");
  const [selectedRadio, setSelectedRadio] = useState("");
  const [selectedPunhoRadio, setSelectedPunhoRadio] = useState("");
  const [selectedFrenteRadio, setSelectedFrenteRadio] = useState("");
  const [client, setClient] = useState("");
  const [formData, setFormData] = useState({ number: 1 });
  const [lastNumber, setLastNumber] = useState(1);
  const navigate = useNavigate();
  const [inputDate, setInputDate] = useState("");
  const [openMeasure, setOpenMeasure] = useState(false);
  const [torax, setTorax] = useState("");
  const [colar, setColar] = useState("");
  const [pala, setPala] = useState("");
  const [manga, setManga] = useState("");
  const [cintura, setCintura] = useState("");
  const [quadril, setQuadril] = useState("");
  const [cumprimento, setCumprimento] = useState("");
  const [biceps, setBiceps] = useState("");
  const [antebraco, setAntebraco] = useState("");
  const [punhoEsquerdo, setPunhoEsquerdo] = useState("");
  const [punhoDireito, setPunhoDireito] = useState("");
  const [extraRigido, setExtraRigido] = useState("");
  const [barbatana, setBarbatana] = useState("");
  const [modelColar, setModelColar] = useState("");
  const [vendedor, setVendedor] = useState("");
  const [id, setId] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [metersTissue, setMetersTissue] = useState("");
  const [monograma, setMonograma] = useState("");
  const [modelFish, setModelFish] = useState("");
  const [typeFront, setTypeFront] = useState("");
  const [typePense, setTypePense] = useState("");
  const [typeModel, setTypeModel] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [erroMessage, setErroMessage] = useState("");
  const [select, setSelect] = useState("");
  const [openSelect, setOpenSelect] = useState(true);
  const [codProduct, setCodProduct] = useState("");
  const [codTextil, setCodTextil] = useState("");
  const [texture, setTexture] = useState("");
  const [fornecedor, setFornecedor] = useState("");
  const [rows, setRows] = useState([]);
  const [clearMonograma, setClearMonograma] = useState(false);

  const generateId = (currentId) => {
    return currentId + 1;
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const cpf = queryParams.get("cpf");
    if (cpf) {
      fetchClientData(cpf);
    }
  }, [location.search]);

  useEffect(() => {
    setDeliveryDate(calculateDeliveryDate(inputDate));
  }, [inputDate]);

  useEffect(() => {
    if (cpf) {
      fetchClientData(cpf);
    } else {
      setCliente({});
      setContato("");
    }
  }, [cpf]);
  useEffect(() => {
    localStorage.setItem("ultimoLastNumber", lastNumber);
  }, [lastNumber]);

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  // Adicionando useEffect para monitorar mudanças de estado
  useEffect(() => {
    console.log("openSelect mudou:", openSelect);
  }, [openSelect]);

  useEffect(() => {
    console.log("openMeasure mudou:", openMeasure);
  }, [openMeasure]);

  const fetchClientData = async (cpf) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/clienttable?cpf=${cpf}`
      );
      if (response.data && response.data.length > 0) {
        const clientData = response.data[0];
        setCliente(clientData);
        setContato(clientData.telefone || "");
      } else {
        setCliente({});
        setContato("");
      }
    } catch (error) {
      console.error("Erro ao buscar dados do cliente:", error);
      setError("Erro ao buscar dados do cliente");
      setCliente({});
      setContato("");
    }
  };
  const handleCpfChange = (event) => {
    // setCpf(event.target.value);
    setCpf(event.target.value);
  };
  // const handlePrint = () => {
  //   window.print();
  // };
  const handleLimparFormulario = () => {
    setCpf("");
    setCliente({});
    setContato("");
    setInputDate("");
    setDeliveryDate("");
    setClient("");
    setClearColar("");
    setClearPala("");
    setClearManga("");
    setClearTorax("");
    setClearCintura("");
    setClearQuadril("");
    setClearCumprimento("");
    setBiceps("");
    setAntebraco("");
    setClearPunho("");
    setClearMetro("");
    setClearMonograma("");
    setClearParis("");
    setClearWindsor("");
    setClearItaly("");
    setClearIngles("");
    setClearDouglas("");
    setClearBicoDow("");
    setClearParis("");
    setSelectedRadio("");
    setSelectedPunhoRadio("");
    setSelectedFrenteRadio("");
    setVendedor("");
    setInputDate("");
  };
  const isValidCPF = (cpf) => {
    return true;
  };

  //
  // Função para gerar o PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text("Informações do Pedido", 20, 20);
    doc.text(`Modelo de Peixe: ${formData.modelFish}`, 20, 30);
    doc.text(`Tipo de Frente: ${formData.typeFront}`, 20, 40);
    doc.text(`Barbatana: ${formData.barbatana}`, 20, 50);
    doc.text(`Modelo: ${formData.typeModel}`, 20, 60);
    doc.text(`Pense: ${formData.typePense}`, 20, 70);
    doc.text(`Extra Rígido: ${formData.extraRigido}`, 20, 80);
    doc.text(`MTRS/TEC.: ${formData.metersTissue}`, 20, 90);
    doc.text(`Monograma: ${formData.monograma}`, 20, 100);
    doc.text(`Observações: ${formData.description}`, 20, 110);

    // Gera o PDF em memória
    const pdfBlob = doc.output("blob");

    // Cria um arquivo real antes de anexar ao FormData
    const pdfFile = new File([pdfBlob], "pedido.pdf", {
      type: "application/pdf",
    });

    // Aqui você pode enviar o PDF por e-mail
    sendEmailWithPDF(pdfBlob);
  };

  // Função para enviar o e-mail com o PDF
  const sendEmailWithPDF = (pdfBlob) => {
    const formData = new FormData();
    const pdfFile = new File([pdfBlob], "pedido.pdf", {
      type: "application/pdf",
    });

    formData.append("pdf", pdfFile);

    // Supondo que você tenha uma rota no backend que lida com o envio de e-mails
    fetch("https://tales-cotovia.onrender.com/send-email", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log("Email enviado com sucesso", data))
      .catch((error) => console.error("Erro ao enviar e-mail:", error));
  };
  //

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validação do vendedor
    if (!vendedor.trim()) {
      setErrorMessage("O campo vendedor está vazio");
      setShowModal(true);
      return;
    }

    // Validação do CPF
    if (!isValidCPF(cpf)) {
      console.error("CPF inválido");
      setErrorMessage("O CPF inserido é inválido!");
      setShowModal(true);
      return; // Para a execução caso o CPF seja inválido
    }

    // Validação de outras partes do formulário, caso necessário

    // Ações após passar todas as validações
    console.log("Formulário enviado com sucesso!");

    // Preparar os dados para enviar ao servidor
    // const data = {
    //   cpf,
    //   description, // Suponho que você tenha uma variável 'description' no seu formulário
    //   measurements, // Suponho que você tenha uma variável 'measurements' com as medidas
    //   rows, // As linhas de itens adicionais
    // };
    console.log("Dados enviados:", data);

    const data = {
      cpf,
      description, // Suponho que você tenha uma variável 'description' no seu formulário
      measurements: {
        colar,
        pala,
        manga,
        torax,
        cintura,
        quadril,
        cumprimento,
        biceps,
        antebraco,
        punhoEsquerdo,
        punhoDireito,
      },
      vendedor, // Dados do vendedor
      deliveryDate, // Data de entrega
      metersTissue, // Medida de tecido
      monograma, // Monograma
      modelFish, // Modelo de peixe
      typeFront, // Tipo de frente
      typeModel, // Tipo de modelo
      extraRigido, // Extra rígido
      barbatana, // Barbatana
      modelColar, // Modelo de colar
      typePense, // Tipo de pense
    };

    // Enviar os dados para o servidor
    try {
      const response = await fetch(
        "https://tales-cotovia.onrender.com/send-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      console.log(result); // Verifique a resposta do servidor no console

      if (result.success) {
        alert("E-mail enviado com sucesso!");
      } else {
        alert(`Erro: ${result.message}`);
      }
    } catch (error) {
      console.error("Erro ao enviar dados para o servidor:", error);
      alert("Ocorreu um erro ao enviar os dados. Tente novamente.");
    }

    // Ações de fechamento do modal ou outras ações que você tenha
    setOpenMeasure(true);
    fetchClientData(cpf);
    setShowModal(false);
  };

  const handleVendedorChange = (e) => {
    setVendedor(e.target.value);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const handleAutoDecimalInput = (value, setter) => {
    let numericValue = value.replace(/\D/g, "");

    if (numericValue.length > 2) {
      numericValue = numericValue.slice(0, -2) + "." + numericValue.slice(-2);
    }
    setter(numericValue);
  };
  const handleIdChange = (e) => {
    setId(e.target.value);
  };
  const handleDateChange = (event) => {
    setInputDate(event.target.value);
  };
  const handleDeliveryDate = (e) => {
    setDeliveryDate(e.target.value);
  };
  const hadlemetersTissueChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9.]/g, "");
    if (value.length > 1 && !value.includes(".")) {
      value = value[0] + "." + value.slice(1);
    }
    if (value.length > 4) {
      value = value.slice(0, 4);
    }
    setMetersTissue(value);
  };
  const handleMonogramaChange = (e) => {
    setMonograma(e.target.value);
  };
  const handleMeasureChamge = (e) => {
    const { name, value } = e.target;
    // Remover caracteres não numéricos, exceto o ponto
    let sanitizedValue = value.replace(/[^0-9.]/g, "");
    // Adicionar o ponto automaticamente após o primeiro número
    if (sanitizedValue.length > 2) {
      sanitizedValue = sanitizedValue.slice(0, 2);
    }
    // Atualizar o estado com o valor sanitizado e formatado
    switch (name) {
      case "colar":
        setColar(sanitizedValue);
        break;
      case "pala":
        setPala(sanitizedValue);
        break;
      case "manga":
        setManga(sanitizedValue);
        break;
      case "torax":
        setTorax(sanitizedValue);
        break;
      case "cintura":
        setCintura(sanitizedValue);
        break;
      case "quadril":
        setQuadril(sanitizedValue);
        break;
      case "cumprimento":
        setCumprimento(sanitizedValue);
        break;
      case "biceps":
        setBiceps(sanitizedValue);
        break;
      case "antebraco":
        setAntebraco(sanitizedValue);
        break;
      case "punhoEsquerdo":
        setPunhoEsquerdo(sanitizedValue);
        break;
      case "punhoDireito":
        setPunhoDireito(sanitizedValue);
        break;
      default:
        break;
    }
  };
  const handleExtraRigido = (e) => {
    setExtraRigido(e.target.value);
  };
  const handleBarbatanaChange = (e) => {
    setBarbatana(e.target.value);
  };
  const handleModelColarChange = (e) => {
    setModelColar(e.target.value);
  };
  const handleFishChange = (e) => {
    setModelFish(e.target.value);
  };
  const handleTypeModelChange = (e) => {
    setTypeModel(e.target.value);
  };
  const handleTypeFrontChange = (e) => {
    setTypeFront(e.target.value);
  };
  const handleTypePenseChange = (e) => {
    setTypePense(e.target.value);
  };
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };
  const validateFields = () => {
    console.log("Vendedor", vendedor);
    console.log("CPF", cpf);
    console.log("Data", inputDate);
    if (!vendedor.trim()) {
      setErrorMessage("Preencha o campo VENDEDOR! ");
      setShowModal(true);
      return false;
    }
    if (!cpf.trim()) {
      setErrorMessage("CPF inválido");
      setShowModal(true);
      return false;
    }
    if (!inputDate.trim()) {
      setErrorMessage("Informe uma DATA!");
      setShowModal(true);
      return false;
    }
    const selectedDate = new Date(inputDate);
    const yesterday = new Date();
    yesterday.setHours(0, 0, 0, 0);
    yesterday.setDate(yesterday.getDate() - 1);

    if (selectedDate < yesterday) {
      setErrorMessage("A data não pode ser inferior!");
      setShowModal(true);
      return false;
    }
    if (!colar.trim()) {
      setErrorMessage("Insira a medida do [ COLAR ]");
      setShowModal(true);
      return false;
    }
    if (!pala.trim()) {
      setErrorMessage("Insira a medida da [ PALA ]");
      setShowModal(true);
      return false;
    }
    if (!manga.trim()) {
      setErrorMessage("Insira a medida da [ MANGA ]");
      setShowModal(true);
      return false;
    }
    if (!torax.trim()) {
      setErrorMessage("Insira a medida do [ TÓRAX ]");
      setShowModal(true);
      return false;
    }
    if (!cintura.trim()) {
      setErrorMessage("Insira a medida da [ CINTURA ]");
      setShowModal(true);
      return false;
    }
    if (!quadril.trim()) {
      setErrorMessage("Insira a medida do [ QUADRIL ]");
      setShowModal(true);
      return false;
    }
    if (!cumprimento.trim()) {
      setErrorMessage("Insira a medida do [ COMPRIMENTO ]");
      setShowModal(true);
      return false;
    }
    if (!biceps.trim()) {
      setErrorMessage("Insira a medida do [ BICEPS ]");
      setShowModal(true);
      return false;
    }
    if (!antebraco.trim()) {
      setErrorMessage("Insira a medida do [ ANTEBRAÇO ]");
      setShowModal(true);
      return false;
    }
    if (!punhoEsquerdo.trim()) {
      setErrorMessage("Insira a medida do [ PUNHO ESQUERDO ]");
      setShowModal(true);
      return false;
    }
    if (!punhoDireito.trim()) {
      setErrorMessage("Insira a medida do [ PUNHO DIREITO ]");
      setShowModal(true);
      return false;
    }
    if (!modelColar) {
      setErrorMessage(
        "Selecione um modelo de COLARINHO!   [ITALIANO] - [PADRE] - [DÓRIA] - [HUGH] - [INGLÊS]"
      );
      setShowModal(true);
      return false;
    }
    if (!modelFish) {
      setErrorMessage(
        "Selecone um modelo de PUNHO! [DUPO] - [REDONDO] - [CHANFRADO]"
      );
      setShowModal(true);
      return false;
    }
    if (!typeFront) {
      setErrorMessage(
        "Selecione o tipo de FRENTE! [ LISA ] - [ ENBUTIDA ] - [ MACHO ] - [ WA ]"
      );
      setShowModal(true);
      return false;
    }
    if (!barbatana) {
      setErrorMessage("Selecione BARBATANA! [ SIM ] - [ NÃO ]");
      setShowModal(true);
      return false;
    }
    if (!typeModel) {
      setErrorMessage("Selecione o modelo da CAMISA! [ SLIN ] - [ CONFOT ]");
      setShowModal(true);
      return false;
    }
    if (!typePense) {
      setErrorMessage("Selecione PENSE! [ SIM ] - [ NÃO ]");
      setShowModal(true);
      return false;
    }
    if (!extraRigido) {
      setErrorMessage("Selecione RIGIDO! [ SIM ] [ NÃO ]");
      setShowModal(true);
      return false;
    }
    setErrorMessage(""); // Limpa a mensagem de erro
    setShowModal(false);
    console.log("Todos os campos são válidos, continuando...");
    setOpenMeasure(!openMeasure);
    return true;
  };

  console.log("Descrição enviada para o ModalMeasure:", description);
  console.log("ID antes de abrir o modal:", id);
  useEffect(() => {
    if (!id) {
      setId(generateId()); // Gerar um id ou buscar de alguma API
    }
  }, [id]);

  return (
    <>
      <div className="containerTypeMeasure">
        <form onSubmit={handleSubmit} className="form-ScreenTokenMeasure">
          <header className="_wrapper-header">
            <section>
              <img src={Site} alt="" />
              {/* <img src="" alt="" /> */}
            </section>

            <section>
              <p className="for-text">VENDEDOR:</p>
              <input
                className="for-Inputs"
                type="text"
                value={vendedor}
                onChange={handleVendedorChange}
              />
            </section>

            <section>
              <h1 className="textToken">Ficha de Produção</h1>
            </section>

            <section>
              <p className="for-text">N. Do Pedido</p>
              <input
                className="for-Inputs"
                type="text"
                value={id}
                onChange={handleIdChange}
              />
            </section>
          </header>
          <hr />
          <main className="_wrapper-main">
            <section className="wrapper-dataForm">
              <section>
                <p className="for-text">CPF:</p>
                <input
                  mask="999.999.999-99"
                  type="text"
                  className="for-Inputs"
                  value={cpf}
                  onChange={handleCpfChange}
                />
              </section>

              <section>
                <p className="for-text">CONTATO:</p>
                <input
                  type="text"
                  className="for-Inputs"
                  // value={contato}
                />
              </section>

              <section>
                <p className="for-text">CLIENTE:</p>
                <input
                  type="text"
                  className="for-Inputs"
                  // value={cliente ? cliente.nome : ''}
                  readOnly
                />
              </section>

              <section className="info-date">
                <section>
                  <p className="for-text">DATE:</p>
                  <input
                    type="date"
                    value={inputDate}
                    onChange={(e) => setInputDate(e.target.value)}
                  />
                </section>

                <section>
                  <p className="for-text">ENTREGA:</p>
                  <input
                    type="text"
                    className="for-Inputs for-inputs-small"
                    value={deliveryDate}
                    readOnly
                  />
                </section>
              </section>

              <section className="setDate">
                <p className="for-text">DATA DEFINIDA</p>
              </section>

              <section className="_Date-Defined">
                <label htmlFor="" className="for-text">
                  <input className="_secImput-radio" type="radio" />
                  PREVISÃO DE PROVA
                </label>
                <label htmlFor="" className="for-text">
                  <input
                    className="_secImput-radio"
                    type="radio"
                    // value={deliveryDate}
                    // onChange={handleDeliveryDate}
                  />
                  PREVISÃO DE ENTREGA
                </label>
              </section>
            </section>
          </main>

          <article className="_wrapper-article">
            <section className="wrapper-MeasureDatas">
              <section className="measures-datas">
                <div>
                  <input
                    type="text"
                    name="colar"
                    value={colar}
                    onChange={handleMeasureChamge}
                    inputMode="decimal"
                    placeholder="00"
                  />
                  <p className="for-text">Colar</p>
                </div>
                <div>
                  <input
                    type="text"
                    name="pala"
                    value={pala}
                    placeholder="00"
                    onChange={handleMeasureChamge}
                  />
                  <p className="for-text">Pala</p>
                </div>
                <div>
                  <input
                    type="text"
                    name="manga"
                    value={manga}
                    placeholder="00"
                    onChange={handleMeasureChamge}
                  />
                  <p className="for-text">Manga</p>
                </div>
                <div>
                  <input
                    type="text"
                    name="torax"
                    value={torax}
                    placeholder="00"
                    onChange={handleMeasureChamge}
                  />
                  <p className="for-text">Tórax</p>
                </div>
                <div>
                  <input
                    type="text"
                    name="cintura"
                    value={cintura}
                    placeholder="00"
                    onChange={handleMeasureChamge}
                  />
                  <p className="for-text">Cintura</p>
                </div>
                <div>
                  <input
                    type="text"
                    name="quadril"
                    value={quadril}
                    placeholder="00"
                    onChange={handleMeasureChamge}
                  />
                  <p className="for-text">Quadril</p>
                </div>
                <div>
                  <input
                    type="text"
                    name="cumprimento"
                    value={cumprimento}
                    placeholder="00"
                    onChange={handleMeasureChamge}
                  />
                  <p className="for-text">Cumpr.</p>
                </div>
                <div>
                  <input
                    type="text"
                    name="biceps"
                    value={biceps}
                    placeholder="00"
                    onChange={handleMeasureChamge}
                  />
                  <p className="for-text">Biceps</p>
                </div>
                <div>
                  <input
                    type="text"
                    name="antebraco"
                    value={antebraco}
                    placeholder="00"
                    onChange={handleMeasureChamge}
                  />
                  <p className="for-text">Antebr.</p>
                </div>
                <div>
                  <input
                    type="text"
                    name="punhoEsquerdo"
                    value={punhoEsquerdo}
                    placeholder="00"
                    onChange={handleMeasureChamge}
                  />
                  <p className="for-text">Punho E</p>
                </div>
                <div>
                  <input
                    type="text"
                    name="punhoDireito"
                    value={punhoDireito}
                    placeholder="00"
                    onChange={handleMeasureChamge}
                  />
                  <p className="for-text">Punho D</p>
                </div>
              </section>
            </section>
          </article>

          <aside className="_wrapper-aside">
            <section className="wrapper-asideCollar">
              <section className="_sec-colar">
                <img src={Colarinho} alt="" />
                <div className="_secInfoRadio">
                  <label htmlFor="paris" className="for-text">
                    <input
                      type="radio"
                      id="italiano"
                      className="_secImput-radio"
                      value="Italiano"
                      checked={modelColar === "Italiano"}
                      onChange={handleModelColarChange}
                    />
                    ITALIANO
                  </label>
                </div>
              </section>
              <section className="_sec-colar">
                <img src={Colarinho} alt="" className="imgColarinho" />
                <div className="_secInfoRadio">
                  <label htmlFor="windsor" className="for-text">
                    <input
                      type="radio"
                      id="padre"
                      className="_secImput-radio"
                      value="Padre"
                      checked={modelColar === "Padre"}
                      onChange={handleModelColarChange}
                    />
                    PADRE
                  </label>
                </div>
              </section>

              <section className="_sec-colar">
                <img src={Colarinho} alt="" className="imgColarinho" />
                <div className="_secInfoRadio">
                  <label htmlFor="doria" className="for-text">
                    <input
                      type="radio"
                      id="doria"
                      className="_secImput-radio"
                      value="Doria"
                      checked={modelColar === "Doria"}
                      onChange={handleModelColarChange}
                    />
                    DÓRIA
                  </label>
                </div>
              </section>

              <section className="_sec-colar">
                <img src={Colarinho} alt="" className="imgColarinho" />
                <div className="_secInfoRadio">
                  <label htmlFor="hugh" className="for-text">
                    <input
                      type="radio"
                      id="hugh"
                      className="_secImput-radio"
                      value="Hugh"
                      checked={modelColar === "Hugh"}
                      onChange={handleModelColarChange}
                    />
                    HUGH
                  </label>
                </div>
              </section>

              <section className="_sec-colar">
                <img src={Colarinho} alt="" className="imgColarinho" />
                <div className="_secInfoRadio">
                  <label htmlFor="ingles" className="for-text">
                    <input
                      type="radio"
                      id="ingles"
                      className="_secImput-radio"
                      value="Ingles"
                      checked={modelColar === "Ingles"}
                      onChange={handleModelColarChange}
                    />
                    INGLÊS
                  </label>
                </div>
              </section>
            </section>
          </aside>

          <nav className="_wrapper-nav">
            <section className="wrapper-navCollar">
              <section className="_sec-punho">
                <img src={Duplo} alt="" />
                <div className="_secInfoRadio">
                  <label className="for-text" htmlFor="duplo">
                    <input
                      type="radio"
                      className="_secImput-radio"
                      value="Duplo"
                      checked={modelFish === "Duplo"}
                      onChange={handleFishChange}
                    />
                    DUPLO
                  </label>
                </div>
              </section>

              <section className="_sec-punho">
                <img src={Redondo} alt="" className="_punho" />
                <div className="_secInfoRadio">
                  <label htmlFor="" className="for-text">
                    <input
                      className="_secImput-radio"
                      type="radio"
                      value="Redondo"
                      checked={modelFish === "Redondo"}
                      onChange={handleFishChange}
                    />
                    REDONDO
                  </label>
                </div>
              </section>

              <section className="_sec-punho">
                <img src={Chanfrado} alt="" className="_punho" />
                <div className="_secInfoRadio">
                  <label htmlFor="" className="for-text">
                    <input
                      className="_secImput-radio"
                      type="radio"
                      value="Chanfrado"
                      checked={modelFish === "Chanfrado"}
                      onChange={handleFishChange}
                    />
                    CHANFRADO
                  </label>
                </div>
              </section>
            </section>
          </nav>

          <section className="_wrapper-section">
            <section className="_wrapper-sectionPersonalized">
              <section className="typeTextFront">
                <p className="for-text">TIPO DE FRENTE</p>
              </section>

              <section className="boxTypePersinalized">
                <div className="_secInfoRadio">
                  <label htmlFor="" className="for-text">
                    <input
                      className="_secImput-radio "
                      type="radio"
                      value="Lisa"
                      checked={typeFront === "Lisa"}
                      onChange={handleTypeFrontChange}
                    />
                    LISA
                  </label>
                </div>
                <div className="_secInfoRadio">
                  <label htmlFor="" className="for-text">
                    <input
                      className="_secImput-radio"
                      type="radio"
                      value="Embutida"
                      checked={typeFront === "Embutida"}
                      onChange={handleTypeFrontChange}
                    />
                    EMB.
                  </label>
                </div>
                <div className="_secInfoRadio">
                  <label htmlFor="" className="for-text">
                    <input
                      className="_secImput-radio"
                      type="radio"
                      value="Macho"
                      checked={typeFront === "Macho"}
                      onChange={handleTypeFrontChange}
                    />
                    MACHO
                  </label>
                </div>
                <div className="_secInfoRadio">
                  <label htmlFor="" className="for-text">
                    <input
                      className="_secImput-radio"
                      type="radio"
                      value="WA"
                      checked={typeFront === "WA"}
                      onChange={handleTypeFrontChange}
                    />
                    WA
                  </label>
                </div>
              </section>

              <section className="typeTextBarbatana">
                <p className="for-text">BARBATANA</p>
              </section>

              <section className="boxTypeBarbatana">
                <div className="_secInfoRadio">
                  <label htmlFor="" className="for-text">
                    <input
                      type="radio"
                      id="barbatana"
                      value="Sim"
                      checked={barbatana === "Sim"}
                      className="_secImput-radio"
                      onChange={handleBarbatanaChange}
                    />
                    SIM
                  </label>
                </div>
                <div className="_secInfoRadio">
                  <label htmlFor="" className="for-text">
                    <input
                      type="radio"
                      className="_secImput-radio"
                      id="barbatana"
                      value="Não"
                      checked={barbatana === "Não"}
                      onChange={handleBarbatanaChange}
                    />
                    NÃO
                  </label>
                </div>
              </section>
            </section>
          </section>

          <div className="_wrapper-div">
            <section className="_wrapper-divModel">
              <section className="typeTextModel">
                <p className="for-text">MODELO DA CAMISA</p>
              </section>

              <section className="boxTypePersinalized">
                <section className="_secInfoRadio">
                  <label htmlFor="" className="for-text">
                    <input
                      className="_secImput-radio"
                      type="radio"
                      value="Slin"
                      checked={typeModel === "Slin"}
                      onChange={handleTypeModelChange}
                    />
                    SLIN
                  </label>
                </section>

                <section className="_secInfoRadio">
                  <label htmlFor="" className="for-text">
                    <input
                      className="_secImput-radio"
                      type="radio"
                      value="Confort"
                      checked={typeModel === "Confort"}
                      onChange={handleTypeModelChange}
                    />
                    CONFORT
                  </label>
                </section>
              </section>

              <section className="typeTextEntraceCosta">
                <p className="for-text">PENSE</p>
              </section>

              <section className="boxTypeEntraceCoast">
                <section className="_secInfoRadio">
                  <label htmlFor="" className="for-text">
                    <input
                      className="_secImput-radio"
                      type="radio"
                      value="Sim"
                      checked={typePense === "Sim"}
                      onChange={handleTypePenseChange}
                    />
                    SIM
                  </label>
                </section>

                <section className="_secInfoRadio">
                  <label htmlFor="" className="for-text">
                    <input
                      className="_secImput-radio"
                      type="radio"
                      value="Não"
                      checked={typePense === "Não"}
                      onChange={handleTypePenseChange}
                    />
                    NÂO
                  </label>
                </section>
              </section>

              <section className="typeTextRigid">
                <p className="for-text">EXTRA RIGIDO</p>
              </section>

              <section className="boxTypeRigid">
                <section className="_secInfoRadio">
                  <label htmlFor="" className="for-text">
                    <input
                      type="radio"
                      className="_secImput-radio"
                      id="sim"
                      value="Sim"
                      checked={extraRigido === "Sim"}
                      onChange={handleExtraRigido}
                    />
                    SIM
                  </label>
                </section>

                <section className="_secInfoRadio">
                  <label htmlFor="" className="for-text">
                    <input
                      type="radio"
                      className="_secImput-radio"
                      id="nao"
                      value="Não"
                      checked={extraRigido === "Não"}
                      onChange={handleExtraRigido}
                    />
                    NÃO
                  </label>
                </section>
              </section>
            </section>
          </div>

          <div className="_wrapper-div">
            <div className="_wrapper-divMeters">
              <div className="typeTextMeters">
                <p className="for-text">MTRS/TEC.</p>
              </div>
              <section className="boxTypeMeters">
                <input
                  type="text"
                  className="for-Inputs"
                  value={metersTissue}
                  onChange={hadlemetersTissueChange}
                />
              </section>
              <div className="typeTextMonograma">
                <p className="for-text">MONOGRAMA</p>
              </div>
              <section className="boxTypeMonograma">
                <input
                  type="text"
                  className="for-Inputs"
                  value={monograma}
                  onChange={handleMonogramaChange}
                />
              </section>
            </div>
          </div>

          <div className="_wrapper-div">
            <div className="_wrapper-area">
              <form>
                <textarea
                  className="for-text"
                  name="comments"
                  id="comments"
                  rows="4"
                  cols="50"
                  placeholder="Escreva suas observações aqui..."
                  value={description}
                  onChange={handleDescriptionChange}
                ></textarea>
              </form>
            </div>
          </div>

          <footer className="_wrapper-div">
            <section className="_wrapper-divFooter">
              <div className="areaButton">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!validateFields()) {
                      return;
                    }
                    setOpenMeasure(!openMeasure);
                    console.log("Campo válido, coninuando...");
                  }}
                >
                  Enviar
                </button>

                <button type="button">Sair</button>
                <button type="button">Limpar</button>
              </div>
            </section>
          </footer>
          <hr />
          <ModalSelect
            openSelect={openSelect}
            setCodProduct={setCodProduct}
            setCodTextil={setCodTextil}
            setTexture={setTexture}
            setFornecedor={setFornecedor}
            rows={rows}
            setRows={setRows}
          ></ModalSelect>
        </form>

        <ModalMeasure
          openMeasure={openMeasure}
          setOpenMeasure={setOpenMeasure}
          torax={torax}
          cpf={cpf}
          colar={colar}
          pala={pala}
          manga={manga}
          cintura={cintura}
          quadril={quadril}
          cumprimento={cumprimento}
          biceps={biceps}
          antebraco={antebraco}
          punhoEsquerdo={punhoEsquerdo}
          punhoDireito={punhoDireito}
          extraRigido={extraRigido}
          barbatana={barbatana}
          modelColar={modelColar}
          vendedor={vendedor}
          id={id}
          inputDate={inputDate}
          deliveryDate={deliveryDate}
          metersTissue={metersTissue}
          monograma={monograma}
          modelFish={modelFish}
          typeFront={typeFront}
          typePense={typePense}
          typeModel={typeModel}
          description={description}
          codProduct={codProduct}
          codTextil={codTextil}
          texture={texture}
          fornecedor={fornecedor}
          rows={rows}
          setRows={setRows}
        />
      </div>
      {showModal && <Modal message={errorMessage} closeModal={closeModal} />}
    </>
  );
}
export default Measure;
