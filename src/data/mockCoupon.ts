import type { CouponItem } from '../types/coupon';

/**
 * 示例优惠券数据
 */
export const mockCoupons: CouponItem[] = [
  {
    id: 1,
    type: 'normal',
    title: '美味经典芝士风情皇家卷边披萨披萨披萨',
    price: '39.9元',
    validPeriod: '2025.10.29-11.29',
    claimed: false,
    image: '',
    ruleText: '规则说明',
  },
  {
    id: 2,
    type: 'package',
    title: '每月领券',
    price: '',
    validPeriod: '',
    claimed: false,
    packageDesc: '2张券待领取',
    tags: ['专享券包'],
  },
  {
    id: 3,
    type: 'appExclusive',
    title: '香辣劲爆鸡米花小份10块',
    subtitle: '甄选白羽鸡鸡尖',
    price: '10元',
    validPeriod: '2025.10.29-2026.11.29',
    claimed: false,
    tags: ['APP专享', '白金会员享'],
    ruleText: '规则说明',
  },
  {
    id: 4,
    type: 'normal',
    title: '美味经典芝士风情皇家卷边披萨披萨披萨',
    price: '39.9元',
    validPeriod: '2025.10.29-11.29',
    claimed: false,
    image: '',
    ruleText: '规则说明',
  },
  {
    id: 5,
    type: 'normal',
    title: '香辣鸡腿堡套餐',
    price: '25元',
    validPeriod: '2025.10.29-12.29',
    claimed: false,
    image: '',
    ruleText: '规则说明',
  },
  {
    id: 6,
    type: 'memberExclusive',
    title: '会员专享全家福套餐',
    price: '88元',
    validPeriod: '2025.10.29-2026.01.29',
    claimed: false,
    tags: ['白金会员享'],
    ruleText: '规则说明',
  },
];

/**
 * 暴涨后可能生成的新券模板
 */
export const newCouponTemplates: Omit<CouponItem, 'id' | 'claimed' | 'isNew'>[] = [
  {
    type: 'normal',
    title: '满100减20通用券',
    price: '20元',
    validPeriod: '2025.10.29-11.29',
    tags: ['新客专享'],
    ruleText: '规则说明',
  },
  {
    type: 'normal',
    title: '免配送费券',
    price: '免配送费',
    validPeriod: '2025.10.29-11.05',
    tags: ['限时'],
    ruleText: '规则说明',
  },
  {
    type: 'normal',
    title: '第二件半价券',
    price: '5折',
    validPeriod: '2025.10.29-11.15',
    tags: ['热门'],
    ruleText: '规则说明',
  },
  {
    type: 'memberExclusive',
    title: '会员升级礼包',
    price: '50元',
    validPeriod: '2025.10.29-2026.10.29',
    tags: ['白金会员享'],
    ruleText: '规则说明',
  },
];
