import React, { useState } from "react";
import s from "./styles.css";

const PriceTableSelector = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("principal");
    const [selectValue, setSelectValue] = useState("");

    const handleOptionChange = (e: any) => {
        setSelectedOption(e.target.value);
        setSelectValue(""); 
    };

    const handleSelectChange = (e: any) => {
        setSelectValue(e.target.value);
    };

    const handleSubmit = () => {
        if (selectValue) {
            const newPath = `/?sc=${selectValue}`;
            window.location.href = newPath; 
        } else {
            alert("Por favor, selecione uma opção antes de enviar.");
        }
    };

    return (
        <div className={s["price-table-container"]}>
            <button 
                className={s["price-table-button"]} 
                onClick={() => setIsModalOpen(!isModalOpen)}
            >
                Tabela de Preço
            </button>

            {isModalOpen && (
                <div className={s["modal"]}>
                    <div className={s["radio-group"]}>
                        <label>
                            <input
                                type="radio"
                                value="principal"
                                checked={selectedOption === "principal"}
                                onChange={handleOptionChange}
                            />
                            Principal
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="vendor"
                                checked={selectedOption === "vendor"}
                                onChange={handleOptionChange}
                            />
                            Vendor
                        </label>
                    </div>

                    <div className={s["select-group"]}>
                        <select value={selectValue} onChange={handleSelectChange}>
                            <option value="" disabled>Selecione uma opção</option>
                            {selectedOption === "principal" && (
                                <>
                                    <option value="1">Principal 1</option>
                                    <option value="2">Principal 2</option>
                                </>
                            )}
                            {selectedOption === "vendor" && (
                                <option value="3">Vendor 1</option>
                            )}
                        </select>
                    </div>

                    <button 
                        className={s["submit-button"]} 
                        onClick={handleSubmit}
                    >
                        Enviar
                    </button>
                </div>
            )}
        </div>
    );
};

export default PriceTableSelector;
