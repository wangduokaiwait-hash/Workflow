import type { AddressItem } from '../types/address';

/**
 * 示例地址数据,用于页面初始渲染
 */
export const mockAddresses: AddressItem[] = [
  {
    id: 1,
    checked: false,
    tags: ['常用', '公司'],
    address: '地址未超过一行展示',
    name: '张先生',
    phone: '112****3838',
  },
  {
    id: 2,
    checked: false,
    tags: ['上次下单', '学校'],
    address: '地址未超过一行展示',
    name: '张先生',
    phone: '11212343838',
  },
  {
    id: 3,
    checked: false,
    tags: ['距离最近', '父母家'],
    address:
      '城开YOYO联合办公6楼 超过固定长度折行3行 超过固定长度折行3行 超过固定长度折行3行',
    stopText: '04:59 后餐厅停止接单',
    name: '张先生',
    phone: '112****3838',
  },
  {
    id: 4,
    checked: false,
    tags: ['距离最近', '家'],
    address: '一行固定宽度展示超出后折行 超过固定长度折行折行折行折行折行折行折行',
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
