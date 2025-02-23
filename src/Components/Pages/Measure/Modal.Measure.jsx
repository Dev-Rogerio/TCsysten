import React, { useState, useEffect } from "react";
import LogoCotovia from "../../AssetsIcons/cotovia.png";
import "../Measure/Modal.Measure.css";
import { useNavigate } from "react-router-dom";

const ModalMeasure = (props) => {
  const {
    openMeasure,
    setOpenMeasure,
    rows, // rows precisa ser tratado corretamente
    setRows,
    cpf,
    colar,
    pala,
    manga,
    cintura,
    quadril,
    cumprimento,
    biceps,
    antebraco,
    punhoEsquerdo,
    punhoDireito,
    torax,
    extraRigido,
    barbatana,
    modelColar,
    vendedor,
    id,
    inputDate,
    deliveryDate,
    metersTissue,
    monograma,
    modelFish,
    typeFront,
    typeModel,
    typePense,
    description = "",
  } = props;

  const [localDescription, setLocalDescription] = useState(description || "");
  const navigate = useNavigate();

  useEffect(() => {
    if (!openMeasure) return;

    // Verifica se os dados estão no localStorage e os recupera
    const savedRows = localStorage.getItem("rows");
    const savedDescription = localStorage.getItem("localDescription");

    if (savedRows) {
      setRows(JSON.parse(savedRows));
    }
    if (savedDescription) {
      setLocalDescription(savedDescription);
    }
  }, [openMeasure, setRows]);

  const API_URL = "https://tales-cotovia.onrender.com"; // URL do servidor Render

  const handlePrint = () => {
    const originalBody = document.body.innerHTML;
    try {
      const modalContent = document.querySelector(".modal").innerHTML;
      document.body.innerHTML = modalContent;
      window.print();
    } finally {
      document.body.innerHTML = originalBody;
    }
  };

  const handleSendEmail = async () => {
    const requiredFields = { cpf, colar, pala, manga };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length) {
      alert(`Campos obrigatórios ausentes: ${missingFields.join(", ")}`);
      return;
    }

    const emailData = {
      cpf,
      colar,
      pala,
      manga,
      cintura,
      quadril,
      cumprimento,
      biceps,
      antebraco,
      punhoEsquerdo,
      punhoDireito,
      torax,
      extraRigido,
      barbatana,
      modelColar,
      vendedor,
      id,
      inputDate,
      deliveryDate,
      metersTissue,
      monograma,
      modelFish,
      typeFront,
      typeModel,
      typePense,
      description: localDescription,
    };

    console.log("Dados que estão sendo enviados:", emailData);

    try {
      const response = await fetch(`${API_URL}/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("E-mail enviado com sucesso:", data);
        alert("E-mail enviado com sucesso!");
        setOpenMeasure(false);
      } else {
        console.error("Erro do servidor:", data.message);
        alert(`Erro ao enviar e-mail: ${data.message || "Erro desconhecido"}`);
      }
    } catch (error) {
      console.error("Erro ao enviar o e-mail:", error);
      alert("Ocorreu um erro ao tentar enviar o e-mail.");
    }
  };

  const handleCloseModal = () => {
    // Salva os dados no localStorage antes de navegar
    localStorage.setItem("rows", JSON.stringify(rows));
    localStorage.setItem("localDescription", localDescription);

    setRows(rows); // Mantém os dados no estado
    setOpenMeasure(false); // Fecha o modal

    // Navega para a página de measure
    navigate("/measure");
  };

  const renderRowDetails = () => {
    if (rows && typeof rows === "object" && !Array.isArray(rows)) {
      const rowEntries = Object.entries(rows);
      return (
        <div className="_wrapper-InfoDescription">
          {rowEntries.map(([key, value]) => (
            <p key={key}>
              {key}: <strong>{value || "N/A"}</strong>
            </p>
          ))}
        </div>
      );
    } else {
      return <p>Informações de produto não disponíveis</p>;
    }
  };

  if (!openMeasure) return null;

  return (
    <div className="modal">
      <div>
        <section className="_navModalMeasure">
          <img src={LogoCotovia} alt="Logo Cotovia" />
        </section>

        <section className="text-titlle">
          <h1>"Ficha Técnica do Pedido"</h1>
        </section>

        <div className="sectorClientSuplier">
          <section className="_sectionClient">
            <p>
              CPF: <strong>{cpf}</strong>
            </p>
            <p>
              Cliente: <strong>{""}</strong>
            </p>
            <p>
              Contato: <strong>{""}</strong>
            </p>
          </section>
          <section className="_sectionDateInfo">
            <p>
              N. do Pedido: <strong>{id}</strong>
            </p>
            <p className="vendedor">
              Vendedor: <strong>{vendedor}</strong>
            </p>
            <p>
              Data do Pedido: <strong>{inputDate}</strong>
            </p>
            <p>
              Data de Entrega: <strong>{deliveryDate}</strong>
            </p>
          </section>
        </div>

        <div className="sectorPersonalized">
          <section className="_firstLeft-MeasureDate">
            <p>
              Colar: <strong>{colar}</strong>
            </p>
            <p>
              Tórax: <strong>{torax}</strong>
            </p>
            <p>
              Pala: <strong>{pala}</strong>
            </p>
            <p>
              Cintura: <strong>{cintura}</strong>
            </p>
            <p>
              Quadril: <strong>{quadril}</strong>
            </p>
            <p>
              Manga: <strong>{manga}</strong>
            </p>
            <p>
              Biceps: <strong>{biceps}</strong>
            </p>
            <p>
              Antebraço: <strong>{antebraco}</strong>
            </p>
            <p>
              Punho E: <strong>{punhoEsquerdo}</strong>
            </p>
            <p>
              Punho D: <strong>{punhoDireito}</strong>
            </p>
          </section>
          <section className="_secondRight-MeasureDate">
            <p>
              Calarinho: <strong>{modelColar}</strong>
            </p>
            <p>
              Punhos: <strong>{modelFish}</strong>
            </p>
            <p>
              Frente: <strong>{typeFront}</strong>
            </p>
            <p>
              Monograma: <strong>{monograma}</strong>
            </p>
            <p>
              Rigido: <strong>{extraRigido}</strong>
            </p>
            <p>
              Barbatana: <strong>{barbatana}</strong>
            </p>
            <p>
              Pense: <strong>{typePense}</strong>
            </p>
            <p>
              Modelo: <strong>{typeModel}</strong>
            </p>
            <p>
              Mtrs. de tecido: <strong>{metersTissue}</strong>
            </p>
          </section>
        </div>

        <div className="_wrapperModArea">
          <textarea
            name="Importante"
            id="important"
            value={localDescription}
            onChange={(e) => setLocalDescription(e.target.value)}
          />
        </div>

        <div className="sectorBotton">
          <section className="_wrapper-divFooter">
            <div className="areaButton">
              <button onClick={handleSendEmail}>Enviar E-mail</button>
              <button onClick={handlePrint}>Emprimir</button>
              <button onClick={handleCloseModal}>Voltar</button>
            </div>
          </section>
        </div>

        {/* Renderizar detalhes da linha */}
        {renderRowDetails()}
      </div>
    </div>
  );
};

export default ModalMeasure;
