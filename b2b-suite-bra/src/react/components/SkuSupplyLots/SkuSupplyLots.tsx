import { useEffect, useState } from "react";
import { useSku } from "../SkuContext";
import styles from "./SkuSupplyLots.css";

function SkuSupplyLots() {
  const { sku } = useSku();

  const [quantity, setQuantity] = useState(null);
  const [supplyDate, setSupplyDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/logistics/pvt/inventory/items/${sku.itemId}/warehouses/1_1/supplyLots`
        );

        if (!response.ok) {
          throw new Error("Erro na requisição");
        }

        const data = await response.json();
        setQuantity(data[0].totalQuantity);
        if (data[0].dateOfSupplyUtc) {
          const date = new Date(data[0].dateOfSupplyUtc);
          const formattedDate = date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
          setSupplyDate(formattedDate);
        }
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.skuSupplyLotsContainer}>
      {quantity !== null ? (
        <span>
          Estoque futuro: {quantity} {supplyDate}
        </span>
      ) : (
        ""
      )}
    </div>
  );
}

export default SkuSupplyLots;
