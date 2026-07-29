Page({
  data: {
    // 地址列表数据（复用之前的地址列表）
    addresses: [
      { id: 1, checked: false, tags: ['常用', '公司'], address: '地址未超过一行展示', name: '张先生', phone: '112****3838' },
      { id: 2, checked: false, tags: ['上次下单', '学校'], address: '地址未超过一行展示', name: '张先生', phone: '11212343838' },
      { id: 3, checked: false, tags: ['距离最近', '父母家'], address: '城开YOYO联合办公6楼 超过固定长度折行3行 超过固定长度折行3行 超过固定长度折行3行', stopText: '04:59 后餐厅停止接单', name: '张先生', phone: '112****3838' },
      { id: 4, checked: false, tags: ['距离最近', '家'], address: '一行固定宽度展示超出后折行 超过固定长度折行折行折行折行折行折行折行', name: '张先生', phone: '112****3838' },
      { id: 5, checked: true, tags: ['常用', '公司'], address: '城开YOYO联合办公6楼', name: '张先生', phone: '112****3838' },
    ],
    // 优惠券浮层显示状态
    couponVisible: false,
    // 优惠券列表
    coupons: [
      { id: 1, type: 'normal', title: '美味经典芝士风情皇家卷边披萨披萨披萨', price: '39.9元', validPeriod: '2025.10.29-11.29', claimed: false, ruleText: '规则说明' },
      { id: 2, type: 'package', title: '每月领券', price: '', validPeriod: '', claimed: false, packageDesc: '2张券待领取', tags: ['专享券包'] },
      { id: 3, type: 'appExclusive', title: '香辣劲爆鸡米花小份10块', subtitle: '甄选白羽鸡鸡尖', price: '10元', validPeriod: '2025.10.29-2026.11.29', claimed: false, tags: ['APP专享', '白金会员享'], ruleText: '规则说明' },
      { id: 4, type: 'normal', title: '美味经典芝士风情皇家卷边披萨披萨披萨', price: '39.9元', validPeriod: '2025.10.29-11.29', claimed: false, ruleText: '规则说明' },
      { id: 5, type: 'normal', title: '香辣鸡腿堡套餐', price: '25元', validPeriod: '2025.10.29-12.29', claimed: false, ruleText: '规则说明' },
      { id: 6, type: 'memberExclusive', title: '会员专享全家福套餐', price: '88元', validPeriod: '2025.10.29-2026.01.29', claimed: false, tags: ['白金会员享'], ruleText: '规则说明' },
    ],
    // 新领取的券ID集合（用于高亮）
    newCouponIds: [],
    // 红包粒子（小程序中通过JS逐帧动画实现）
    particles: [],
    // 是否正在动画中
    isAnimating: false,
    // 触摸相关
    touchStartY: 0,
    sheetTranslateY: 0,
    isSheetMoving: false,
  },

  // 动画定时器
  animTimers: [],

  // ===== 地址列表操作 =====
  onSelectAddress(e) {
    const id = parseInt(e.currentTarget.dataset.id, 10);
    const addresses = this.data.addresses.map(item => ({
      ...item,
      checked: item.id === id,
    }));
    this.setData({ addresses });
  },

  onEditAddress(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({ title: `编辑地址 ${id}`, icon: 'none' });
  },

  // ===== 优惠券浮层操作 =====
  openCouponModal() {
    this.setData({
      couponVisible: true,
      sheetTranslateY: 0,
    });
  },

  closeCouponModal() {
    // 清除所有动画定时器
    this.animTimers.forEach(timer => clearInterval(timer));
    this.animTimers = [];
    this.setData({
      couponVisible: false,
      particles: [],
    });
  },

  // 触摸开始
  onTouchStart(e) {
    this.setData({
      touchStartY: e.touches[0].clientY,
      isSheetMoving: true,
    });
  },

  // 触摸移动
  onTouchMove(e) {
    const diff = e.touches[0].clientY - this.data.touchStartY;
    if (diff > 0) {
      this.setData({ sheetTranslateY: diff });
    }
  },

  // 触摸结束
  onTouchEnd() {
    const diff = this.data.sheetTranslateY;
    if (diff > 100) {
      this.closeCouponModal();
    } else {
      this.setData({ sheetTranslateY: 0, isSheetMoving: false });
    }
  },

  // 阻止冒泡
  stopPropagation() {
    // do nothing
  },

  // ===== 领券操作（核心动画逻辑） =====
  onClaimCoupon(e) {
    const couponId = parseInt(e.currentTarget.dataset.id, 10);
    if (this.data.isAnimating) return;

    this.setData({ isAnimating: true });

    // 1. 获取按钮位置（起点）
    const btnQuery = wx.createSelectorQuery();
    btnQuery.select(`#coupon-item-${couponId} .claim-btn`).boundingClientRect();
    btnQuery.select('.coupon-list').boundingClientRect();
    btnQuery.exec((res) => {
      const btnRect = res[0];
      const listRect = res[1];

      if (!btnRect || !listRect) {
        this.setData({ isAnimating: false });
        return;
      }

      const fromX = btnRect.left + btnRect.width / 2;
      const fromY = btnRect.top + btnRect.height / 2;
      const toX = listRect.left + listRect.width / 2;
      const toY = listRect.bottom - 60;

      // 2. 随机生成 1-4 张新券
      const newCount = Math.floor(Math.random() * 4) + 1;
      const maxId = Math.max(...this.data.coupons.map(c => c.id), 0);

      // 3. 生成红包粒子并启动逐帧动画
      const particles = [];
      for (let i = 0; i < newCount; i++) {
        const offsetX = (Math.random() - 0.5) * 120;
        const offsetY = (Math.random() - 0.5) * 60;
        const duration = 600 + Math.random() * 300;
        const delay = i * 100;
        const targetX = toX + offsetX;
        const targetY = toY + offsetY;
        const height = 120 + Math.random() * 80;

        particles.push({
          id: Date.now() + i,
          left: fromX,
          top: fromY,
          transform: 'translate(-50%, -50%) scale(1)',
          opacity: 1,
          _fromX: fromX,
          _fromY: fromY,
          _toX: targetX,
          _toY: targetY,
          _height: height,
          _duration: duration,
          _delay: delay,
          _startTime: null,
        });
      }

      this.setData({ particles });

      // 4. 启动逐帧动画
      particles.forEach((p, idx) => {
        const timer = setTimeout(() => {
          this.startParticleAnimation(p.id, p._fromX, p._fromY, p._toX, p._toY, p._height, p._duration);
        }, p._delay);
        this.animTimers.push(timer);
      });

      // 5. 准备新券数据
      const newCoupons = [];
      const newIds = [];
      const prices = ['5元', '10元', '20元', '免配送费', '满100减30'];
      const titles = ['新客专享优惠券', '限时抢购券', '满减通用券', '会员体验券', '生日特权券'];

      for (let i = 0; i < newCount; i++) {
        const id = maxId + i + 1;
        newCoupons.push({
          id,
          type: 'normal',
          title: titles[Math.floor(Math.random() * titles.length)],
          price: prices[Math.floor(Math.random() * prices.length)],
          validPeriod: '2025.10.29-11.29',
          claimed: false,
          isNew: true,
          tags: ['新领'],
        });
        newIds.push(id);
      }

      // 6. 标记原券为已领取
      const updatedCoupons = this.data.coupons.map(c =>
        c.id === couponId ? { ...c, claimed: true } : c
      );

      // 7. 等待动画完成后插入新券
      const maxDelay = Math.max(...particles.map(p => p._duration + p._delay));

      const finishTimer = setTimeout(() => {
        // 清除所有动画定时器
        this.animTimers.forEach(timer => clearInterval(timer));
        this.animTimers = [];

        this.setData({
          particles: [],
          coupons: [...updatedCoupons, ...newCoupons],
          newCouponIds: newIds,
          isAnimating: false,
        });

        // 1.5秒后清除高亮
        const clearTimer = setTimeout(() => {
          this.setData({ newCouponIds: [] });
        }, 1500);
        this.animTimers.push(clearTimer);
      }, maxDelay + 100);
      this.animTimers.push(finishTimer);
    });
  },

  /**
   * 启动单个粒子的逐帧抛物线动画
   * 使用二次贝塞尔曲线
   */
  startParticleAnimation(id, fromX, fromY, toX, toY, height, duration) {
    const startTime = Date.now();
    const midX = (fromX + toX) / 2;
    const midY = Math.min(fromY, toY) - height;

    const frameTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);

      // 二次贝塞尔曲线
      const x = (1 - t) * (1 - t) * fromX + 2 * (1 - t) * t * midX + t * t * toX;
      const y = (1 - t) * (1 - t) * fromY + 2 * (1 - t) * t * midY + t * t * toY;
      const scale = 1 - t * 0.3;
      const opacity = t > 0.9 ? 0.2 : 1;

      // 更新粒子位置
      const particles = this.data.particles.map(p => {
        if (p.id === id) {
          return {
            ...p,
            left: x,
            top: y,
            transform: `translate(-50%, -50%) scale(${scale})`,
            opacity,
          };
        }
        return p;
      });

      this.setData({ particles });

      if (t >= 1) {
        clearInterval(frameTimer);
      }
    }, 16); // ~60fps

    this.animTimers.push(frameTimer);
  },
});
