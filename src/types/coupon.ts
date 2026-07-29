export type CouponType = 'cash' | 'discount';

export interface Coupon {
  id: number;
  type: CouponType;
  title: string;
  /** 金额或折扣值 */
  value: string;
  /** 单位: 元 / 折 */
  unit?: string;
  condition: string;
  expireAt: string;
  claimed: boolean;
  /** 标签, 例如 ["限时", "新客"] */
  tags?: string[];
  /** 是否为新领取的(高亮闪烁) */
  isNew?: boolean;
  /** 规则说明 */
  ruleText?: string;
}

export interface ParticleState {
  id: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  startTime: number;
  duration: number;
}
