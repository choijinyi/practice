import { create } from 'zustand';
import { CartItem, CartState, CartActions, CartSelectors } from '@/app/types/cart';
import {
  calculateTotalProductPrice,
  calculateDeliveryFee,
  calculateFreeDeliveryRemainingAmount,
  calculateTotalPaymentPrice,
  getSelectedItemCount,
  isAllItemsSelected as checkAllItemsSelected,
  getSelectedItems,
} from '@/utils/cartUtils';

/**
 * Mock 데이터 - 실제로는 API에서 가져올 데이터
 */
const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: '1',
    name: '무선 블루투스 헤드폰',
    price: 89000,
    quantity: 1,
    imageUrl: '/images/headphone.jpg',
    isSelected: false,
  },
  {
    id: '2',
    name: '스마트워치 프로',
    price: 199000,
    quantity: 1,
    imageUrl: '/images/smartwatch.jpg',
    isSelected: false,
  },
  {
    id: '3',
    name: '기계식 키보드',
    price: 159000,
    quantity: 1,
    imageUrl: '/images/keyboard.jpg',
    isSelected: false,
  },
  {
    id: '4',
    name: '무선 마우스',
    price: 45000,
    quantity: 1,
    imageUrl: '/images/mouse.jpg',
    isSelected: false,
  },
];

/**
 * 장바구니 스토어 타입
 */
type CartStore = CartState & CartActions & CartSelectors;

/**
 * 장바구니 상태 관리 스토어
 */
export const useCartStore = create<CartStore>((set, get) => ({
  // State
  items: [],
  isLoading: false,
  error: null,

  // Actions
  initCart: () => {
    set({ isLoading: true, error: null });
    
    // API 호출 시뮬레이션
    setTimeout(() => {
      set({
        items: MOCK_CART_ITEMS,
        isLoading: false,
      });
    }, 500);
  },

  toggleItemSelection: (id: string) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      ),
    }));
  },

  toggleAllItemsSelection: (isSelected: boolean) => {
    set((state) => ({
      items: state.items.map((item) => ({ ...item, isSelected })),
    }));
  },

  updateItemQuantity: (id: string, newQuantity: number) => {
    // 수량은 최소 1이어야 함
    const validQuantity = Math.max(1, newQuantity);
    
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity: validQuantity } : item
      ),
    }));
  },

  removeItem: (id: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },

  // Derived State (Selectors)
  get selectedItems() {
    return getSelectedItems(get().items);
  },

  get totalProductPrice() {
    return calculateTotalProductPrice(get().items);
  },

  get deliveryFee() {
    return calculateDeliveryFee(get().totalProductPrice);
  },

  get freeDeliveryRemainingAmount() {
    return calculateFreeDeliveryRemainingAmount(get().totalProductPrice);
  },

  get totalPaymentPrice() {
    return calculateTotalPaymentPrice(get().totalProductPrice, get().deliveryFee);
  },

  get totalItemCount() {
    return get().items.length;
  },

  get totalSelectedItemCount() {
    return getSelectedItemCount(get().items);
  },

  get isAllItemsSelected() {
    return checkAllItemsSelected(get().items);
  },
}));

/**
 * 개별 셀렉터 훅 (성능 최적화를 위해)
 */
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartLoading = () => useCartStore((state) => state.isLoading);
export const useCartError = () => useCartStore((state) => state.error);
export const useSelectedItems = () => useCartStore((state) => state.selectedItems);
export const useTotalProductPrice = () => useCartStore((state) => state.totalProductPrice);
export const useDeliveryFee = () => useCartStore((state) => state.deliveryFee);
export const useFreeDeliveryRemainingAmount = () => useCartStore((state) => state.freeDeliveryRemainingAmount);
export const useTotalPaymentPrice = () => useCartStore((state) => state.totalPaymentPrice);
export const useTotalItemCount = () => useCartStore((state) => state.totalItemCount);
export const useTotalSelectedItemCount = () => useCartStore((state) => state.totalSelectedItemCount);
export const useIsAllItemsSelected = () => useCartStore((state) => state.isAllItemsSelected);

/**
 * 액션 훅 (개별)
 */
export const useInitCart = () => useCartStore((state) => state.initCart);
export const useToggleItemSelection = () => useCartStore((state) => state.toggleItemSelection);
export const useToggleAllItemsSelection = () => useCartStore((state) => state.toggleAllItemsSelection);
export const useUpdateItemQuantity = () => useCartStore((state) => state.updateItemQuantity);
export const useRemoveItem = () => useCartStore((state) => state.removeItem);




