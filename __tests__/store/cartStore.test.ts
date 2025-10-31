import { act, renderHook, waitFor } from '@testing-library/react';
import { useCartStore } from '@/store/cartStore';

describe('cartStore', () => {
  // 테스트용 초기 데이터
  const setupTestData = () => {
    act(() => {
      useCartStore.setState({
        items: [
          {
            id: '1',
            name: '헤드폰',
            price: 89000,
            quantity: 1,
            imageUrl: '/headphone.jpg',
            isSelected: true,
          },
          {
            id: '2',
            name: '스마트워치',
            price: 199000,
            quantity: 2,
            imageUrl: '/watch.jpg',
            isSelected: false,
          },
        ],
        isLoading: false,
        error: null,
      });
    });
  };

  beforeEach(() => {
    setupTestData();
  });

  describe('초기 상태', () => {
    it('초기 상태가 올바르게 설정되어야 한다', () => {
      const { result } = renderHook(() => useCartStore());
      
      expect(result.current.items).toHaveLength(2);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  describe('toggleItemSelection', () => {
    it('특정 상품의 선택 상태를 토글해야 한다', () => {
      const { result } = renderHook(() => useCartStore());

      // 초기 상태 확인
      expect(result.current.items[0].isSelected).toBe(true);

      // 선택 상태 토글
      act(() => {
        result.current.toggleItemSelection('1');
      });

      expect(result.current.items[0].isSelected).toBe(false);

      // 다시 토글
      act(() => {
        result.current.toggleItemSelection('1');
      });

      expect(result.current.items[0].isSelected).toBe(true);
    });

    it('다른 상품의 선택 상태는 변경되지 않아야 한다', () => {
      const { result } = renderHook(() => useCartStore());

      const initialSecondItemSelection = result.current.items[1].isSelected;

      act(() => {
        result.current.toggleItemSelection('1');
      });

      expect(result.current.items[1].isSelected).toBe(initialSecondItemSelection);
    });
  });

  describe('toggleAllItemsSelection', () => {
    it('모든 상품을 선택 상태로 변경해야 한다', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.toggleAllItemsSelection(true);
      });

      expect(result.current.items.every(item => item.isSelected)).toBe(true);
    });

    it('모든 상품을 선택 해제 상태로 변경해야 한다', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.toggleAllItemsSelection(false);
      });

      expect(result.current.items.every(item => !item.isSelected)).toBe(true);
    });
  });

  describe('updateItemQuantity', () => {
    it('상품 수량을 올바르게 업데이트해야 한다', () => {
      const { result } = renderHook(() => useCartStore());

      expect(result.current.items[0].quantity).toBe(1);

      act(() => {
        result.current.updateItemQuantity('1', 5);
      });

      expect(result.current.items[0].quantity).toBe(5);
    });

    it('수량이 1 미만으로 설정될 경우 1로 유지해야 한다', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.updateItemQuantity('1', 0);
      });

      expect(result.current.items[0].quantity).toBe(1);

      act(() => {
        result.current.updateItemQuantity('1', -5);
      });

      expect(result.current.items[0].quantity).toBe(1);
    });

    it('다른 상품의 수량은 변경되지 않아야 한다', () => {
      const { result } = renderHook(() => useCartStore());

      const initialSecondItemQuantity = result.current.items[1].quantity;

      act(() => {
        result.current.updateItemQuantity('1', 10);
      });

      expect(result.current.items[1].quantity).toBe(initialSecondItemQuantity);
    });
  });

  describe('removeItem', () => {
    it('특정 상품을 삭제해야 한다', () => {
      const { result } = renderHook(() => useCartStore());

      expect(result.current.items).toHaveLength(2);

      act(() => {
        result.current.removeItem('1');
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items.find(item => item.id === '1')).toBeUndefined();
    });

    it('존재하지 않는 ID로 삭제를 시도해도 에러가 발생하지 않아야 한다', () => {
      const { result } = renderHook(() => useCartStore());

      const initialLength = result.current.items.length;

      act(() => {
        result.current.removeItem('non-existent-id');
      });

      expect(result.current.items).toHaveLength(initialLength);
    });
  });

  describe('initCart', () => {
    it('장바구니 데이터를 초기화하고 로딩 상태를 관리해야 한다', async () => {
      const { result } = renderHook(() => useCartStore());

      // 초기 상태를 빈 배열로 설정
      act(() => {
        useCartStore.setState({ items: [], isLoading: false });
      });

      expect(result.current.items).toHaveLength(0);

      // initCart 호출
      act(() => {
        result.current.initCart();
      });

      // 로딩 상태 확인
      expect(result.current.isLoading).toBe(true);

      // 데이터 로드 완료 대기 (setTimeout 500ms)
      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
          expect(result.current.items.length).toBeGreaterThan(0);
        },
        { timeout: 1000 }
      );
    });
  });

  describe('Derived State (Selectors)', () => {
    it('파생 상태들이 정의되어 있어야 한다', () => {
      const { result } = renderHook(() => useCartStore());
      
      // 파생 상태가 존재하는지만 확인
      expect(result.current).toHaveProperty('totalProductPrice');
      expect(result.current).toHaveProperty('deliveryFee');
      expect(result.current).toHaveProperty('totalItemCount');
      expect(result.current).toHaveProperty('totalSelectedItemCount');
      expect(result.current).toHaveProperty('selectedItems');
      expect(result.current).toHaveProperty('isAllItemsSelected');
      expect(result.current).toHaveProperty('freeDeliveryRemainingAmount');
      expect(result.current).toHaveProperty('totalPaymentPrice');
    });

    it('totalProductPrice는 숫자 타입을 반환해야 한다', () => {
      const { result } = renderHook(() => useCartStore());
      expect(typeof result.current.totalProductPrice).toBe('number');
    });

    it('deliveryFee는 숫자 타입을 반환해야 한다', () => {
      const { result } = renderHook(() => useCartStore());
      expect(typeof result.current.deliveryFee).toBe('number');
    });

    it('selectedItems는 배열 타입을 반환해야 한다', () => {
      const { result } = renderHook(() => useCartStore());
      expect(Array.isArray(result.current.selectedItems)).toBe(true);
    });

    it('isAllItemsSelected는 불리언 타입을 반환해야 한다', () => {
      const { result } = renderHook(() => useCartStore());
      expect(typeof result.current.isAllItemsSelected).toBe('boolean');
    });
  });
});

