import React, { useState, useEffect } from "react";
import Logo from "../../AssetsIcons/logo.png";
import "./modal.measure.css";
import { useHref } from "react-router-dom";

const ModalMeasure = ({
  openMeasure,
  setOpenMeasure,
  rows,
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
  description = "", // Valor padrão vazio
  setDescription,
}) => {
  const [localDescription, setLocalDescription] = useState(description);

  useEffect(() => {
    console.log("Descrição recebida na modal:", description);
    // Atualiza o estado sempre que a prop description mudar
    if (description !== localDescription) {
      setLocalDescription(description);
    }
  }, [description]);

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
      const response = await fetch(
        "https://tales-cotovia.onrender.com/send-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailData),
        }
      );

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
  const handleChange = (e) => {
    setLocalDescription(e.target.value);
    setDescription(e.target.value); // Certifique-se de que a função 'setDescription' seja chamada para atualizar o estado no componente pai
  };

  const handleCloseModal = () => {
    setRows((prev) => ({ ...prev, description: localDescription }));
    setOpenMeasure(false);
  };

  console.log("Estado localDescription:", localDescription); // Log para ver o valor do estado localDescription

  if (!openMeasure) return null;

  return (
    <div className="modal">
      <div>
        <section className="_navModalMeasure">
          <img src={Logo} alt="" />
        </section>
        <section className="text-titlle">
          <h1>"Ficha Técnica do Pedido"</h1>
          <p>
            Id: <strong>{id}</strong>
          </p>
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
            onChange={handleChange}
            rows="4"
            cols="50"
            placeholder="Escreva suas observações aqui..."
          />
        </div>
        {/* Agora exibindo a descrição digitada */}

        <div className="sectorBotton">
          <button onClick={handleCloseModal}>Confirmar</button>
          <button onClick={handlePrint}>Imprimir</button>
          <button onClick={handleSendEmail}>Enviar E-mail</button>
        </div>
        {rows && rows.length > 0 ? (
          rows.map((row, index) => (
            <div key={index} className="_wrapper-InfoDescription">
              <p>
                Código do Tecido: <strong>{row.codTextil || "N/A"}</strong>
              </p>
              <p>
                Código do Produto: <strong>{row.codProduct || "N/A"}</strong>
              </p>
              <p>
                Tipo de Textura: <strong>{row.texture || "N/A"}</strong>
              </p>
              <p>
                Fornecedor: <strong>{row.fornecedor || "N/A"}</strong>
              </p>
            </div>
          ))
        ) : (
          <p>Nenhum dado disponível</p>
        )}
      </div>
    </div>
  );
};

export default ModalMeasure;
