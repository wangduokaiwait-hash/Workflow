/**
 * 收货地址条目数据结构
 */
export interface AddressItem {
  /** 唯一标识 */
  id: number;
  /** 是否选中 */
  checked: boolean;
  /** 标签列表,例如 ["常用", "公司"] */
  tags: string[];
  /** 详细地址文本 */
  address: string;
  /** 收件人姓名 */
  name: string;
  /** 收件人手机号 */
  phone: string;
  /** 餐厅停止接单等特殊提示文案(可选) */
  stopText?: string;
  /** 是否为默认地址(可选) */
  isDefault?: boolean;
  /** 是否距离最近(可选) */
  isNearest?: boolean;
}
