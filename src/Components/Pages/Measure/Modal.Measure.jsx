import React, { useState, useEffect } from "react";
import LogoCotovia from "../../AssetsIcons/cotovia.png";
import "../Measure/Modal.Measure.css";
import { useNavigate } from "react-router-dom";

const ModalMeasure = ({
  openMeasure,
  setOpenMeasure,
  rows,
  setRows,
  cpf,
  client,
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
}) => {
  const [localDescription, setLocalDescription] = useState(description);
  const navigate = useNavigate();

  useEffect(() => {
    if (!openMeasure) return;
    setLocalDescription(description || "");
  }, [openMeasure, description]);

  const handleSendEmail = async () => {
    const emailData = {
      cpf,
      client,
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
      rows,
    };

    try {
      const response = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("E-mail enviado com sucesso!");
        setOpenMeasure(false);
      } else {
        alert(`Erro ao enviar e-mail: ${data.message || "Erro desconhecido"}`);
      }
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      alert("Ocorreu um erro ao tentar enviar o e-mail.");
    }
  };

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

  const handleCloseModal = () => {
    setRows(rows);
    setOpenMeasure(false);
    navigate("/");
  };

  const handleDescriptionChange = (e) => {
    setLocalDescription(e.target.value);
  };

  if (!openMeasure) return null;

  return (
    <div className="modal">
      <div>
        <section className="_navModalMeasure">
          <img src={LogoCotovia} alt="Logo Cotovia" />
        </section>

        <section className="text-titlle">
          <h1>Ficha Técnica do Pedido</h1>
        </section>

        <div className="sectorClientSuplier">
          <section className="_sectionClient">
            <p>
              CPF: <strong>{cpf}</strong>
            </p>
            <p>
              Cliente: <strong>{client}</strong>
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
          <section>
            <p>
              Colar: <strong>{colar}</strong>
            </p>
            <p>
              Pala: <strong>{pala}</strong>
            </p>
            <p>
              Manga: <strong>{manga}</strong>
            </p>
            <p>
              Tórax: <strong>{torax}</strong>
            </p>
            <p>
              Cintura: <strong>{cintura}</strong>
            </p>
            <p>
              Quadril: <strong>{quadril}</strong>
            </p>
            <p>
              Cumprimento: <strong>{cumprimento}</strong>
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
          <section>
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
              Rígido: <strong>{extraRigido}</strong>
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
          </section>
        </div>

        <div className="sectorDescription">
          <label htmlFor="description">Descrição:</label>
          <textarea
            id="description"
            value={localDescription}
            onChange={handleDescriptionChange}
            placeholder="Detalhes adicionais..."
          />
        </div>

        <section className="actions">
          <button onClick={handleSendEmail}>Enviar E-mail</button>
          <button onClick={handlePrint}>Imprimir</button>
          <button onClick={handleCloseModal}>Fechar</button>
        </section>
      </div>
    </div>
  );
};

export default ModalMeasure;
