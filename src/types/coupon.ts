/**
 * 优惠券类型
 */
export type CouponType = 'normal' | 'package' | 'appExclusive' | 'memberExclusive';

/**
 * 优惠券数据结构
 */
export interface CouponItem {
  /** 唯一标识 */
  id: number;
  /** 优惠券类型 */
  type: CouponType;
  /** 标题/名称 */
  title: string;
  /** 副标题/描述 */
  subtitle?: string;
  /** 价格/金额 */
  price: string;
  /** 有效期 */
  validPeriod: string;
  /** 是否已领取 */
  claimed: boolean;
  /** 是否为新领取的（用于高亮闪烁） */
  isNew?: boolean;
  /** 标签列表（如 APP专享、白金会员享） */
  tags?: string[];
  /** 券包描述（如 2张券待领取） */
  packageDesc?: string;
  /** 图片URL（可选） */
  image?: string;
  /** 规则说明 */
  ruleText?: string;
}

/**
 * 飞行红包粒子
 */
export interface FlyingParticle {
  id: number;
  /** 起始坐标 */
  fromX: number;
  fromY: number;
  /** 目标坐标 */
  toX: number;
  toY: number;
  /** 动画持续时间(ms) */
  duration: number;
  /** 延迟(ms) */
  delay: number;
}
