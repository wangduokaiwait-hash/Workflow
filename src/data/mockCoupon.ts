import type { Coupon } from '../types/coupon';

/**
 * 示例优惠券数据
 */
export const mockCoupons: Coupon[] = [
  {
    id: 1,
    title: '满50减10元',
    value: '10',
    condition: '满50元可用',
    expireAt: '2026-12-31',
    claimed: false,
    type: 'cash',
  },
  {
    id: 2,
    title: '8折优惠券',
    value: '8',
    condition: '全场商品',
    expireAt: '2026-08-15',
    claimed: false,
    type: 'discount',
  },
  {
    id: 3,
    title: '新用户专享',
    value: '20',
    condition: '首次下单立减',
    expireAt: '2026-09-01',
    claimed: true,
    type: 'new',
  },
  {
    id: 4,
    title: '满100减25元',
    value: '25',
    condition: '满100元可用',
    expireAt: '2026-10-31',
    claimed: false,
    type: 'cash',
  },
];
