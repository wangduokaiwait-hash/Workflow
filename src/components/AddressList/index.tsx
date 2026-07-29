import { useCallback, useState } from 'react';
import type { AddressItem as AddressItemType } from '../../types/address';
import AddressItem from '../AddressItem';
import styles from './AddressList.module.css';

export interface AddressListProps {
  /** 初始地址数据 */
  initialData: AddressItemType[];
  /** 编辑回调(可选, 不传则在控制台输出) */
  onEdit?: (item: AddressItemType) => void;
}

/**
 * 收货地址列表容器
 * - 白色背景
 * - Item 之间使用浅灰色分割线
 * - 支持点击 Item 切换选中状态
 */
const AddressList = ({ initialData, onEdit }: AddressListProps) => {
  const [list, setList] = useState<AddressItemType[]>(initialData);

  // 单选: 选中即取消其他项的 checked
  const handleSelect = useCallback((id: number) => {
    setList((prev) =>
      prev.map((item) => ({
        ...item,
        checked: item.id === id,
      })),
    );
  }, []);

  const handleEdit = useCallback(
    (item: AddressItemType) => {
      if (onEdit) {
        onEdit(item);
      } else {
        // 默认行为: 便于开发期调试
        // eslint-disable-next-line no-console
        console.log('[AddressList] edit:', item);
      }
    },
    [onEdit],
  );

  return (
    <div className={styles.list}>
      {list.map((item) => (
        <AddressItem
          key={item.id}
          data={item}
          onSelect={handleSelect}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );
};

export default AddressList;
