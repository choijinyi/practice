import {
  calculateTotalProductPrice,
  calculateDeliveryFee,
  calculateFreeDeliveryRemainingAmount,
  calculateTotalPaymentPrice,
  getSelectedItemCount,
  isAllItemsSelected,
  getSelectedItems,
  FREE_DELIVERY_THRESHOLD,
  DEFAULT_DELIVERY_FEE,
} from '@/utils/cartUtils';
import { CartItem } from '@/app/types/cart';

describe('cartUtils', () => {
  const mockItems: CartItem[] = [
    {
      id: '1',
      name: '헤드폰',
      price: 10000,
      quantity: 1,
      imageUrl: '/headphone.jpg',
      isSelected: true,
    },
    {
      id: '2',
      name: '스마트워치',
      price: 20000,
      quantity: 2,
      imageUrl: '/watch.jpg',
      isSelected: true,
    },
    {
      id: '3',
      name: '키보드',
      price: 5000,
      quantity: 1,
      imageUrl: '/keyboard.jpg',
      isSelected: false,
    },
  ];

  describe('calculateTotalProductPrice', () => {
    it('선택된 상품들의 총 가격을 올바르게 계산해야 한다', () => {
      // 10000 * 1 + 20000 * 2 = 50000
      expect(calculateTotalProductPrice(mockItems)).toBe(50000);
    });

    it('선택된 상품이 없을 경우 0을 반환해야 한다', () => {
      const unselectedItems = mockItems.map(item => ({ ...item, isSelected: false }));
      expect(calculateTotalProductPrice(unselectedItems)).toBe(0);
    });

    it('빈 배열일 경우 0을 반환해야 한다', () => {
      expect(calculateTotalProductPrice([])).toBe(0);
    });

    it('수량이 여러 개인 상품의 가격을 올바르게 계산해야 한다', () => {
      const items: CartItem[] = [
        { ...mockItems[0], quantity: 3, isSelected: true }, // 10000 * 3 = 30000
      ];
      expect(calculateTotalProductPrice(items)).toBe(30000);
    });
  });

  describe('calculateDeliveryFee', () => {
    it('총 금액이 50,000원 미만일 경우 3,000원을 반환해야 한다', () => {
      expect(calculateDeliveryFee(49999)).toBe(DEFAULT_DELIVERY_FEE);
      expect(calculateDeliveryFee(30000)).toBe(DEFAULT_DELIVERY_FEE);
      expect(calculateDeliveryFee(0)).toBe(DEFAULT_DELIVERY_FEE);
    });

    it('총 금액이 50,000원 이상일 경우 0원을 반환해야 한다', () => {
      expect(calculateDeliveryFee(50000)).toBe(0);
      expect(calculateDeliveryFee(60000)).toBe(0);
      expect(calculateDeliveryFee(100000)).toBe(0);
    });

    it('정확히 50,000원일 경우 0원을 반환해야 한다', () => {
      expect(calculateDeliveryFee(FREE_DELIVERY_THRESHOLD)).toBe(0);
    });
  });

  describe('calculateFreeDeliveryRemainingAmount', () => {
    it('무료배송까지 남은 금액을 올바르게 계산해야 한다', () => {
      expect(calculateFreeDeliveryRemainingAmount(0)).toBe(50000);
      expect(calculateFreeDeliveryRemainingAmount(30000)).toBe(20000);
      expect(calculateFreeDeliveryRemainingAmount(49999)).toBe(1);
    });

    it('이미 무료배송 조건을 충족한 경우 0을 반환해야 한다', () => {
      expect(calculateFreeDeliveryRemainingAmount(50000)).toBe(0);
      expect(calculateFreeDeliveryRemainingAmount(60000)).toBe(0);
    });

    it('음수 값을 반환하지 않아야 한다', () => {
      expect(calculateFreeDeliveryRemainingAmount(100000)).toBe(0);
    });
  });

  describe('calculateTotalPaymentPrice', () => {
    it('상품 금액과 배송비를 더한 값을 반환해야 한다', () => {
      expect(calculateTotalPaymentPrice(50000, 0)).toBe(50000);
      expect(calculateTotalPaymentPrice(10000, 3000)).toBe(13000);
      expect(calculateTotalPaymentPrice(49999, 3000)).toBe(52999);
    });

    it('상품 금액이 0일 경우 배송비만 반환해야 한다', () => {
      expect(calculateTotalPaymentPrice(0, 3000)).toBe(3000);
    });

    it('배송비가 0일 경우 상품 금액만 반환해야 한다', () => {
      expect(calculateTotalPaymentPrice(50000, 0)).toBe(50000);
    });
  });

  describe('getSelectedItemCount', () => {
    it('선택된 상품의 개수를 올바르게 반환해야 한다', () => {
      expect(getSelectedItemCount(mockItems)).toBe(2);
    });

    it('선택된 상품이 없을 경우 0을 반환해야 한다', () => {
      const unselectedItems = mockItems.map(item => ({ ...item, isSelected: false }));
      expect(getSelectedItemCount(unselectedItems)).toBe(0);
    });

    it('모든 상품이 선택된 경우 전체 개수를 반환해야 한다', () => {
      const allSelectedItems = mockItems.map(item => ({ ...item, isSelected: true }));
      expect(getSelectedItemCount(allSelectedItems)).toBe(3);
    });

    it('빈 배열일 경우 0을 반환해야 한다', () => {
      expect(getSelectedItemCount([])).toBe(0);
    });
  });

  describe('isAllItemsSelected', () => {
    it('모든 상품이 선택된 경우 true를 반환해야 한다', () => {
      const allSelectedItems = mockItems.map(item => ({ ...item, isSelected: true }));
      expect(isAllItemsSelected(allSelectedItems)).toBe(true);
    });

    it('일부 상품만 선택된 경우 false를 반환해야 한다', () => {
      expect(isAllItemsSelected(mockItems)).toBe(false);
    });

    it('선택된 상품이 없을 경우 false를 반환해야 한다', () => {
      const unselectedItems = mockItems.map(item => ({ ...item, isSelected: false }));
      expect(isAllItemsSelected(unselectedItems)).toBe(false);
    });

    it('빈 배열일 경우 false를 반환해야 한다', () => {
      expect(isAllItemsSelected([])).toBe(false);
    });
  });

  describe('getSelectedItems', () => {
    it('선택된 상품 목록만 반환해야 한다', () => {
      const selectedItems = getSelectedItems(mockItems);
      expect(selectedItems).toHaveLength(2);
      expect(selectedItems[0].id).toBe('1');
      expect(selectedItems[1].id).toBe('2');
    });

    it('선택된 상품이 없을 경우 빈 배열을 반환해야 한다', () => {
      const unselectedItems = mockItems.map(item => ({ ...item, isSelected: false }));
      expect(getSelectedItems(unselectedItems)).toEqual([]);
    });

    it('모든 상품이 선택된 경우 전체 목록을 반환해야 한다', () => {
      const allSelectedItems = mockItems.map(item => ({ ...item, isSelected: true }));
      expect(getSelectedItems(allSelectedItems)).toHaveLength(3);
    });

    it('빈 배열일 경우 빈 배열을 반환해야 한다', () => {
      expect(getSelectedItems([])).toEqual([]);
    });
  });
});




