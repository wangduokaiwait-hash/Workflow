import { memo, type MouseEvent } from 'react';
import type { AddressItem as AddressItemType } from '../../types/address';
import RadioButton from '../RadioButton';
import EditButton from '../EditButton';
import AddressTag from '../AddressTag';
import AddressBadge from '../AddressBadge';
import styles from './AddressItem.module.css';

export interface AddressItemProps {
  /** 单条地址数据 */
  data: AddressItemType;
  /** 点击 Item 切换选中 */
  onSelect: (id: number) => void;
  /** 点击编辑按钮 */
  onEdit: (item: AddressItemType) => void;
}

/**
 * 单条地址 Item
 * 整体采用左右布局: 左侧 Radio, 右侧 内容区
 * 右侧内容区分两行:
 *   1. 标签 + 地址 + Badge + Edit
 *   2. 姓名 + 手机号
 */
const AddressItem = ({ data, onSelect, onEdit }: AddressItemProps) => {
  const { id, checked, tags, address, name, phone, stopText } = data;

  const handleItemClick = () => {
    onSelect(id);
  };

  const handleEdit = (_e: MouseEvent<HTMLButtonElement>) => {
    onEdit(data);
  };

  return (
    <div
      className={`${styles.item} ${checked ? styles.checked : ''}`}
      onClick={handleItemClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleItemClick();
        }
      }}
    >
      {/* 左侧 Radio */}
      <div className={styles.radioWrap}>
        <RadioButton
          checked={checked}
          onChange={handleItemClick}
          ariaLabel={`选择地址 ${name}`}
        />
      </div>

      {/* 右侧内容区 */}
      <div className={styles.content}>
        {/* 第一行: Tag + Address + Badge + Edit */}
        <div className={styles.firstRow}>
          <div className={styles.firstRowLeft}>
            {tags.length > 0 && (
              <div className={styles.tags}>
                {tags.map((tag) => (
                  <AddressTag key={tag} text={tag} />
                ))}
              </div>
            )}
            <div className={styles.addressWrap}>
              <p className={styles.address}>{address}</p>
            </div>
            {stopText && <AddressBadge text={stopText} />}
          </div>
          <div className={styles.editWrap}>
            <EditButton onEdit={handleEdit} ariaLabel={`编辑地址 ${name}`} />
          </div>
        </div>

        {/* 第二行: 姓名 + 手机号 */}
        <div className={styles.secondRow}>
          <span className={styles.name}>{name}</span>
          <span className={styles.phone}>{phone}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(AddressItem);
