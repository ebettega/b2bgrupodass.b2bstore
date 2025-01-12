import { path } from "ramda";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useCssHandles } from "vtex.css-handles";
import { FormattedCurrency } from "vtex.format-currency";
import { Item } from "../typings";
import { useProviderWhiteLabel } from "./ProviderWhiteLabel/ProviderWhiteLabel";
import { useSku } from "./SkuContext";

const CSS_HANDLES = ["priceContainer"] as const;

interface Props {
  showLabel: boolean;
}

const SkuPrice = ({ showLabel }: Props) => {
  const { sku }: { sku: Item } = useSku();
  const sellingPriceDefault: number | undefined = path(
    ["sellers", 0, "commertialOffer", "Price"],
    sku
  );
  const [sellingPrice, setSellingPrice] = useState<number | undefined>(
    sellingPriceDefault
  );
  const handles = useCssHandles(CSS_HANDLES);
  const provider = useProviderWhiteLabel();
  const sellerId = provider.seller;
  useEffect(() => {
    const fetchSimulation = async () => {
      try {
        if (sellerId !== "1") {
          const response = await fetch(
            "/api/checkout/pub/orderForms/simulation",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                items: [
                  {
                    id: sku?.itemId,
                    quantity: 1,
                    seller: sellerId,
                  },
                ],
                country: "BRA",
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }

          const data = await response.json();
          const price = data.items[0].price;
          setSellingPrice(price / 100);
        }
      } catch (error) {
        console.error("Failed to fetch simulation", error);
      }
    };

    fetchSimulation();
  }, [sku, provider.seller]);

  return sellingPrice ? (
    <div
      className={`pt3 pb5 t-body c-muted-1 lh-copy ${handles.priceContainer}`}
    >
      {showLabel && (
        <span className="t-body c-on-base fw7 pr3">
          <FormattedMessage id="store/sku-list.sku.price.title" />:{" "}
        </span>
      )}
      <span>
        <FormattedCurrency value={sellingPrice} />
      </span>
    </div>
  ) : (
    <div />
  );
};

export default SkuPrice;
