import { CartItem } from '@/app/types/cart';

/**
 * 무료배송 기준 금액
 */
export const FREE_DELIVERY_THRESHOLD = 50000;

/**
 * 기본 배송비
 */
export const DEFAULT_DELIVERY_FEE = 3000;

/**
 * 선택된 상품들의 총 가격을 계산합니다.
 * @param items 장바구니 상품 목록
 * @returns 선택된 상품들의 총 가격
 */
export function calculateTotalProductPrice(items: CartItem[]): number {
  return items
    .filter(item => item.isSelected)
    .reduce((total, item) => total + item.price * item.quantity, 0);
}

/**
 * 총 가격에 따른 배송비를 계산합니다.
 * @param totalPrice 총 상품 가격
 * @returns 배송비 (50,000원 이상일 경우 0원)
 */
export function calculateDeliveryFee(totalPrice: number): number {
  return totalPrice >= FREE_DELIVERY_THRESHOLD ? 0 : DEFAULT_DELIVERY_FEE;
}

/**
 * 무료배송까지 남은 금액을 계산합니다.
 * @param totalPrice 총 상품 가격
 * @returns 무료배송까지 남은 금액 (이미 무료배송 조건 충족 시 0)
 */
export function calculateFreeDeliveryRemainingAmount(totalPrice: number): number {
  const remaining = FREE_DELIVERY_THRESHOLD - totalPrice;
  return remaining > 0 ? remaining : 0;
}

/**
 * 최종 결제 금액을 계산합니다.
 * @param totalProductPrice 총 상품 가격
 * @param deliveryFee 배송비
 * @returns 최종 결제 금액
 */
export function calculateTotalPaymentPrice(
  totalProductPrice: number,
  deliveryFee: number
): number {
  return totalProductPrice + deliveryFee;
}

/**
 * 선택된 상품 개수를 계산합니다.
 * @param items 장바구니 상품 목록
 * @returns 선택된 상품 개수
 */
export function getSelectedItemCount(items: CartItem[]): number {
  return items.filter(item => item.isSelected).length;
}

/**
 * 모든 상품이 선택되었는지 확인합니다.
 * @param items 장바구니 상품 목록
 * @returns 모든 상품 선택 여부
 */
export function isAllItemsSelected(items: CartItem[]): boolean {
  if (items.length === 0) return false;
  return items.every(item => item.isSelected);
}

/**
 * 선택된 상품 목록을 반환합니다.
 * @param items 장바구니 상품 목록
 * @returns 선택된 상품 목록
 */
export function getSelectedItems(items: CartItem[]): CartItem[] {
  return items.filter(item => item.isSelected);
}




