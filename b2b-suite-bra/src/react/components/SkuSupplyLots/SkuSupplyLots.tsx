import { useEffect, useState } from "react";
import { Spinner } from "vtex.styleguide";
import { useSku } from "../SkuContext";
import styles from "./SkuSupplyLots.css";

function SkuSupplyLots() {
  const { sku } = useSku();
  const hasAttachments = sku.attachments && sku.attachments.length > 0;
  const [quantity, setQuantity] = useState<any>(null);

  const convertDate = (date: string) => {
    const dateObject = new Date(date);
    const formattedDate = dateObject.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return formattedDate;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/supplyLots?id=${sku.itemId}`
        );

        if (!response.ok) {
          throw new Error("Erro na requisição");
        }

        const data = await response.json();
        setQuantity(data.response);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.skuSupplyLotsContainer}>
      {hasAttachments ? (
        <span>Não tem estoque futuro</span>
      ) : (
        <>
          {quantity !== null ? (
            <>
              {quantity.map((quantityItem: any) => (
                <div key={quantityItem.skuId}>
                  <span>Quantidade total:{quantityItem.totalQuantity}</span>
                  <span>
                    Estoque futuro: {convertDate(quantityItem.dateOfSupplyUtc)}
                  </span>
                </div>
              ))}
            </>
          ) : (
            <Spinner />
          )}
        </>
      )}
    </div>
  );
}

export default SkuSupplyLots;
