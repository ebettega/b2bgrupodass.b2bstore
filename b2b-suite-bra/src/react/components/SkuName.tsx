import classNames from 'classnames';
import React from 'react';
import { useCssHandles } from 'vtex.css-handles';
import { useProductDispatch } from 'vtex.product-context/ProductDispatchContext';
import { useSku } from './SkuContext';

const CSS_HANDLES = ['skuName', 'visualizeButton'] as const;

interface Props {
  showLabel: boolean;
}

const SkuName = ({ showLabel }: Props) => {
  const { sku } = useSku();
  const dispatch = useProductDispatch();
  const handles = useCssHandles(CSS_HANDLES);

  // Handler para o botão de seleção
  const handleSelectItem = () => {
    if (dispatch) {
      dispatch({ type: 'SET_SELECTED_ITEM', args: { item: sku } });
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleSelectItem();
  };

  const hasAttachments = sku.attachments && sku.attachments.length > 0;

  return (
    <div className="flex items-center justify-between">
      {showLabel && (
        <span className="t-body c-on-base fw7 pr3">
          Nome:{' '}
        </span>
      )}
      <h4 className={`${handles.skuName} t-heading-4 c-muted-1`}>{sku.name}</h4>
      {hasAttachments && (
        <button
          className={classNames('ml3', handles.visualizeButton)}
          onClick={handleButtonClick}
        >
          Visualizar
        </button>
      )}
    </div>
  );
};

export default SkuName;
