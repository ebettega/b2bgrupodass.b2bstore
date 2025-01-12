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
          `/api/logistics/pvt/inventory/items/${sku.itemId}/warehouses/1_1/supplyLots`,
          {
            method: "get",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json; charset=utf-8",
              VtexIdclientAutCookie:
                "eyJhbGciOiJFUzI1NiIsImtpZCI6IjFENjE1M0E4Qzc4MjlBMkRDRDBBNzM0MzU3QzJBQzQ1NTcyQTc0NDYiLCJ0eXAiOiJqd3QifQ.eyJzdWIiOiJ3ZWxsaW5ndG9ud3BlZHJvQGdtYWlsLmNvbSIsImFjY291bnQiOiJiMmJncnVwb2Rhc3MiLCJhdWRpZW5jZSI6ImFkbWluIiwic2VzcyI6IjkxNDQzYWI2LWQwNDgtNDlmYi04ODFmLTc1ZjRkMDRiMTJhZiIsImV4cCI6MTczNjcwNTI0MywidHlwZSI6InVzZXIiLCJ1c2VySWQiOiI2YjBiM2I1ZC0yYjU5LTQ3ZDktYjg4Zi1hZWQ1NjMwNTI1NDgiLCJpYXQiOjE3MzY2MTg4NDMsImlzUmVwcmVzZW50YXRpdmUiOmZhbHNlLCJpc3MiOiJ0b2tlbi1lbWl0dGVyIiwianRpIjoiOTc0MTllZTUtNTllMy00Yzc2LWI4MzUtNmM5ZWMzYzMyOTIyIn0.vHBkqWt1hB6xowoU2sNARikQyflgfF8LErEI2c67_X-8UCSfu60j6F7NcTzv8g7Qr1aN1TTbxUspL-zPcUZKHQ",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Erro na requisição");
        }

        const data = await response.json();
        console.log("data", data);
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
