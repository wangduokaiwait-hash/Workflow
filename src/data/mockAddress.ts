import type { AddressItem } from '../types/address';

/**
 * 示例地址数据,用于页面初始渲染
 */
export const mockAddresses: AddressItem[] = [
  {
    id: 1,
    checked: false,
    tags: ['常用', '公司'],
    address: '上海市浦东新区陆家嘴金融中心',
    name: '张先生',
    phone: '112****3838',
  },
  {
    id: 2,
    checked: false,
    tags: ['上次下单', '学校'],
    address: '北京市海淀区清华大学紫荆公寓',
    name: '张先生',
    phone: '11212343838',
  },
  {
    id: 3,
    checked: false,
    tags: ['距离最近', '父母家'],
    address:
      '城开YOYO联合办公6楼 上海市徐汇区漕宝路120弄6号 近桂林公园地铁站步行约5分钟',
    stopText: '04:59 后餐厅停止接单',
    name: '张先生',
    phone: '112****3838',
  },
  {
    id: 4,
    checked: false,
    tags: ['距离最近', '家'],
    address: '广东省深圳市南山区科技园南区高新南一道012号深圳湾科技生态园',
    name: '张先生',
    phone: '112****3838',
  },
  {
    id: 5,
    checked: true,
    tags: ['常用', '公司'],
    address: '城开YOYO联合办公6楼',
    name: '张先生',
    phone: '112****3838',
  },
];
