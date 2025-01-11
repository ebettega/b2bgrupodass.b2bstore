import { path, pathOr } from "ramda";
import React, { FunctionComponent, useContext, useState, useEffect } from "react";
import { useDevice } from "vtex.device-detector";
import { ProductContext } from "vtex.product-context";
import { ExtensionPoint } from "vtex.render-runtime";
import s from "./styles.css";

import { Item, Product } from "../typings";

enum Device {
  mobile = "mobile",
  desktop = "desktop",
}

const getSkuDisplaySequence = (item: Item) =>
  +(
    item.variations.find((variation) => variation.name === "skuDisplaySequence")
      ?.values?.[0] ?? 0
  );

const compareItemsSequence = (a: Item, b: Item) =>
  getSkuDisplaySequence(a) - getSkuDisplaySequence(b);

const SkuListComponent = React.memo(({ device }: { device: Device }) => {
  const valuesFromContext = useContext(ProductContext);
  const items: Item[] = pathOr([], ["product", "items"], valuesFromContext);
  const product: Product | undefined = path(["product"], valuesFromContext);
  const selectedItem: Item | undefined = path(["selectedItem"], valuesFromContext);
  const sortedItems = [...items].sort(compareItemsSequence);

  const itemsWithAttachments = sortedItems.filter(
    (item) => item.attachments && item.attachments.length > 0
  );
  const itemsWithoutAttachments = sortedItems.filter(
    (item) => !item.attachments || item.attachments.length === 0
  );

  const [activeTab, setActiveTab] = useState<
    "withAttachments" | "withoutAttachments"
  >(() =>
    selectedItem && selectedItem.attachments && selectedItem.attachments.length > 0
      ? "withAttachments"
      : "withoutAttachments"
  );

  useEffect(() => {
    if (
      selectedItem &&
      selectedItem.attachments &&
      selectedItem.attachments.length > 0
    ) {
      setActiveTab("withAttachments");
    } else {
      setActiveTab("withoutAttachments");
    }
  }, [selectedItem]);

  const renderContent = (item: Item, index: number) => {
    switch (device) {
      case Device.mobile:
        return (
          <ExtensionPoint
            id="sku-content.mobile"
            isFirstItem={index === 0}
            item={item}
            product={product}
            key={`sku-content-${item.itemId}`}
          />
        );
      case Device.desktop:
      default:
        return (
          <ExtensionPoint
            id="sku-content.desktop"
            isFirstItem={index === 0}
            item={item}
            product={product}
            key={`sku-content-${item.itemId}`}
          />
        );
    }
  };

  const buttonStyles = {
    padding: "10px 20px",
    margin: "5px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const activeButtonStyles = {
    ...buttonStyles,
    backgroundColor: "#001432",
    color: "white",
    border: "1px solid #001432",
  };

  return (
    <div className={s["sku-list-container"]}>
      {itemsWithAttachments.length ? (
        <div className={s["tab-header"]}>
          <button
            style={
              activeTab === "withAttachments" ? activeButtonStyles : buttonStyles
            }
            onClick={() => setActiveTab("withAttachments")}
          >
            Grade Fechada
          </button>
          <button
            style={
              activeTab === "withoutAttachments" ? activeButtonStyles : buttonStyles
            }
            onClick={() => setActiveTab("withoutAttachments")}
          >
            Grade Aberta
          </button>
        </div>
      ) : (
        <></>
      )}

      <div className={s["tab-content"]}>
        {activeTab === "withAttachments" && (
          <div className={s["tab-panel"]}>
            {itemsWithAttachments.map(renderContent)}
          </div>
        )}
        {activeTab === "withoutAttachments" && (
          <div className={s["tab-panel"]}>
            {itemsWithoutAttachments.map(renderContent)}
          </div>
        )}
      </div>
    </div>
  );
});

SkuListComponent.displayName = "SkuListComponent";

const SkuList: FunctionComponent = () => {
  const { isMobile } = useDevice();

  return (
    <SkuListComponent device={isMobile ? Device.mobile : Device.desktop} />
  );
};

export default SkuList;
