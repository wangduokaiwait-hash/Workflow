/**
 * 优惠券数据结构
 */
export interface Coupon {
  /** 唯一标识 */
  id: number;
  /** 优惠券标题 */
  title: string;
  /** 优惠金额/折扣 */
  value: string;
  /** 使用条件 */
  condition: string;
  /** 有效期 */
  expireAt: string;
  /** 是否已领取 */
  claimed: boolean;
  /** 优惠券类型: 满减/折扣/新用户 */
  type: 'discount' | 'cash' | 'new';
}
