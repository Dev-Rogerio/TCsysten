import React, { useEffect, useCallback } from "react";
import "../Measure/modal.select.css";
import { IconButton } from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";

const ModalSelect = ({ openSelect = false, rows, setRows }) => {
  // Memoiza a função para evitar re-renderizações desnecessárias
  const addRow = useCallback(() => {
    setRows((prevRows) => [
      ...prevRows,
      { codTextil: "", codProduct: "", texture: "", fornecedor: "" },
    ]);
  }, [setRows]); // Depende apenas de setRows

  useEffect(() => {
    if (!Array.isArray(rows) || rows.length === 0) {
      setRows([{ codTextil: "", codProduct: "", texture: "", fornecedor: "" }]);
    }
  }, []); // Array vazio faz com que rode apenas uma vez ao montar o componente

  // useEffect(() => {
  //   // seu código
  // }, [addRow]); // Adicionando addRow nas dependências

  // useEffect(() => {
  //   if (!Array.isArray(rows) || rows.length === 0) {
  //     addRow();
  //   }
  // }, [rows, addRow]); // Agora `addRow` é estável e o warning some
  // // Garante pelo menos uma linha inicial no formulário
  // useEffect(() => {
  //   if (!Array.isArray(rows) || rows.length === 0) {
  //     addRow();
  //   }
  // }, [rows]);

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  // const addRow = () => {
  //   setRows([
  //     ...rows,
  //     { codTextil: "", codProduct: "", texture: "", fornecedor: "" },
  //   ]);
  // };

  const removeRow = (index) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const productOptions = [
    { value: "azul-claro", label: "Azul Claro" },
    { value: "azul-medio", label: "Azul Médio" },
    { value: "azul-escuro", label: "Azul Escuro" },
    { value: "off-white", label: "Off-White" },
    { value: "verde-musgo", label: "Verde Musgo" },
    { value: "branco", label: "Branco" },
    { value: "azul", label: "Azul" },
    { value: "rosa", label: "Rosa" },
  ];

  const textureOptions = [
    { value: "textura", label: "Textura" },
    { value: "liso", label: "Liso" },
  ];

  const fornecedorOptions = [
    { value: "imperiale", label: "Imperiale" },
    { value: "cataguases", label: "Cataguases" },
    { value: "estoque-cotovia", label: "Estoque" },
  ];

  return (
    openSelect && (
      <div className="_wrapper-option">
        <table className="_wrapper-table">
          <thead>
            <tr>
              <th>Cód. do Produto</th>
              <th>Cód. do Tecido</th>
              <th>Textura</th>
              <th>Fornecedor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody className="_tab-tbody">
            {(Array.isArray(rows) ? rows : []).map((row, index) => (
              <tr key={index}>
                {/* Cód. Produto */}
                <td>
                  <input
                    type="text"
                    placeholder="Digite a descrição do produto"
                    className="input-cell"
                    value={row.codTextil}
                    onChange={(e) =>
                      handleInputChange(index, "codTextil", e.target.value)
                    }
                  />
                </td>

                {/* Cód. Tecido */}
                <td>
                  <select
                    value={row.codProduct}
                    onChange={(e) =>
                      handleInputChange(index, "codProduct", e.target.value)
                    }
                    className="_info-select"
                  >
                    <option value="">Selecione</option>
                    {productOptions.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
                {/* Textura */}
                <td>
                  <select
                    value={row.texture}
                    onChange={(e) =>
                      handleInputChange(index, "texture", e.target.value)
                    }
                    className="_info-texture"
                  >
                    <option value="">Selecione</option>
                    {textureOptions.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Fornecedor */}
                <td>
                  <select
                    value={row.fornecedor}
                    onChange={(e) =>
                      handleInputChange(index, "fornecedor", e.target.value)
                    }
                    className="_info-fornecedor"
                  >
                    <option value="">Selecione</option>
                    {fornecedorOptions.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Ações */}
                <td className="_button-Acoes">
                  <IconButton
                    onClick={addRow}
                    aria-label="Adicionar linha"
                    color="primary"
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => removeRow(index)}
                    aria-label="Remover linha"
                    color="secondary"
                    disabled={rows.length <= 1}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  );
};

export default ModalSelect;
