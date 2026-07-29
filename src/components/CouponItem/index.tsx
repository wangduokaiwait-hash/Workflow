import { memo, useEffect, useRef } from 'react';
import type { CouponItem as CouponItemType } from '../../types/coupon';
import styles from './CouponItem.module.css';

interface CouponItemProps {
  data: CouponItemType;
  isNew?: boolean;
  onClaim?: (id: number) => void;
  isAnimatingIn?: boolean;
  animationIndex?: number;
}

/**
 * 优惠券项组件
 * 支持多种类型：普通券、券包、APP专享券、会员专享券
 */
const CouponItem = ({
  data,
  isNew,
  onClaim,
  isAnimatingIn,
  animationIndex = 0,
}: CouponItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);

  // 新券高亮闪烁动画
  useEffect(() => {
    if (isNew && itemRef.current) {
      itemRef.current.classList.add(styles.highlight);
      const timer = setTimeout(() => {
        itemRef.current?.classList.remove(styles.highlight);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  // 入场动画
  useEffect(() => {
    if (isAnimatingIn && itemRef.current) {
      itemRef.current.style.animationDelay = `${animationIndex * 80}ms`;
      itemRef.current.classList.add(styles.slideIn);
    }
  }, [isAnimatingIn, animationIndex]);

  const handleClaim = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClaim?.(data.id);
  };

  // 渲染普通券
  const renderNormalCoupon = () => (
    <div className={styles.normalCoupon}>
      <div className={styles.leftSection}>
        <div className={styles.priceWrapper}>
          <span className={styles.price}>{data.price}</span>
          <span className={styles.priceTag}>优惠券</span>
        </div>
        <div className={styles.infoWrapper}>
          <p className={styles.title}>{data.title}</p>
          <p className={styles.validPeriod}>{data.validPeriod}</p>
          {data.ruleText && <p className={styles.ruleText}>{data.ruleText}</p>}
        </div>
      </div>
      <div className={styles.rightSection}>
        <button className={styles.claimBtn} data-claim-btn="true" onClick={handleClaim}>
          立即领券
        </button>
      </div>
    </div>
  );

  // 渲染券包
  const renderPackageCoupon = () => (
    <div className={styles.packageCoupon}>
      <div className={styles.packageLeft}>
        <div className={styles.packageIcon}>
          <div className={styles.packageIconInner}>
            <span className={styles.packageIconText}>券</span>
          </div>
          {data.packageDesc && <span className={styles.packageDesc}>{data.packageDesc}</span>}
        </div>
        {data.tags?.map((tag) => (
          <span key={tag} className={styles.packageTag}>
            {tag}
          </span>
        ))}
      </div>
      <button className={styles.packageClaimBtn} data-claim-btn="true" onClick={handleClaim}>
        立即领取
      </button>
    </div>
  );

  // 渲染APP专享券
  const renderAppExclusiveCoupon = () => (
    <div className={styles.appExclusiveCoupon}>
      <div className={styles.appLeftSection}>
        <div className={styles.appPriceWrapper}>
          <span className={styles.appPrice}>{data.price}</span>
          <span className={styles.appPriceLabel}>优惠券</span>
        </div>
        <div className={styles.appInfoWrapper}>
          <p className={styles.appTitle}>{data.title}</p>
          {data.subtitle && <p className={styles.appSubtitle}>{data.subtitle}</p>}
          <div className={styles.appTagsRow}>
            {data.tags?.map((tag) => (
              <span key={tag} className={styles.appTag}>
                {tag}
              </span>
            ))}
          </div>
          <p className={styles.appValidPeriod}>{data.validPeriod}</p>
        </div>
      </div>
      <div className={styles.appRightSection}>
        <button className={styles.appClaimBtn} data-claim-btn="true" onClick={handleClaim}>
          立即领券
        </button>
        {data.ruleText && <span className={styles.appRuleText}>{data.ruleText}</span>}
      </div>
    </div>
  );

  // 渲染会员专享券
  const renderMemberExclusiveCoupon = () => (
    <div className={styles.memberExclusiveCoupon}>
      <div className={styles.memberLeftSection}>
        <div className={styles.memberPriceWrapper}>
          <span className={styles.memberPrice}>{data.price}</span>
          <span className={styles.memberPriceUnit}>优惠券</span>
        </div>
        <div className={styles.memberInfoWrapper}>
          <p className={styles.memberTitle}>{data.title}</p>
          <div className={styles.memberTagsRow}>
            {data.tags?.map((tag) => (
              <span key={tag} className={styles.memberTag}>
                {tag}
              </span>
            ))}
          </div>
          <p className={styles.memberValidPeriod}>{data.validPeriod}</p>
        </div>
      </div>
      <div className={styles.memberRightSection}>
        <button className={styles.memberClaimBtn} data-claim-btn="true" onClick={handleClaim}>
          立即领券
        </button>
        {data.ruleText && <span className={styles.memberRuleText}>{data.ruleText}</span>}
      </div>
    </div>
  );

  return (
    <div
      ref={itemRef}
      className={`${styles.couponItem} ${isNew ? styles.newCoupon : ''}`}
      data-type={data.type}
    >
      {data.type === 'normal' && renderNormalCoupon()}
      {data.type === 'package' && renderPackageCoupon()}
      {data.type === 'appExclusive' && renderAppExclusiveCoupon()}
      {data.type === 'memberExclusive' && renderMemberExclusiveCoupon()}
    </div>
  );
};

export default memo(CouponItem);
