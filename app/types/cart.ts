/**
 * 장바구니 상품 아이템 타입
 */
export interface CartItem {
  /** 상품 고유 ID */
  id: string;
  /** 상품명 */
  name: string;
  /** 상품 가격 */
  price: number;
  /** 상품 수량 */
  quantity: number;
  /** 상품 이미지 URL */
  imageUrl: string;
  /** 선택 여부 */
  isSelected: boolean;
}

/**
 * 장바구니 상태 타입
 */
export interface CartState {
  /** 장바구니 상품 목록 */
  items: CartItem[];
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
}

/**
 * 장바구니 액션 타입
 */
export interface CartActions {
  /** 초기 장바구니 데이터 로드 */
  initCart: () => void;
  /** 특정 상품 선택/해제 */
  toggleItemSelection: (id: string) => void;
  /** 모든 상품 선택/해제 */
  toggleAllItemsSelection: (isSelected: boolean) => void;
  /** 특정 상품 수량 업데이트 */
  updateItemQuantity: (id: string, newQuantity: number) => void;
  /** 특정 상품 삭제 */
  removeItem: (id: string) => void;
}

/**
 * 장바구니 파생 상태 타입 (Selectors)
 */
export interface CartSelectors {
  /** 선택된 상품 목록 */
  selectedItems: CartItem[];
  /** 선택된 상품들의 총 가격 */
  totalProductPrice: number;
  /** 배송비 */
  deliveryFee: number;
  /** 무료배송까지 남은 금액 */
  freeDeliveryRemainingAmount: number;
  /** 최종 결제 금액 */
  totalPaymentPrice: number;
  /** 전체 장바구니 상품 개수 */
  totalItemCount: number;
  /** 선택된 상품 개수 */
  totalSelectedItemCount: number;
  /** 모든 상품 선택 여부 */
  isAllItemsSelected: boolean;
}




