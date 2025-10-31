'use client';

import { useEffect } from 'react';
import {
  useCartItems,
  useCartLoading,
  useCartError,
  useTotalItemCount,
  useTotalSelectedItemCount,
  useIsAllItemsSelected,
  useTotalProductPrice,
  useDeliveryFee,
  useFreeDeliveryRemainingAmount,
  useTotalPaymentPrice,
  useInitCart,
  useToggleItemSelection,
  useToggleAllItemsSelection,
  useUpdateItemQuantity,
  useRemoveItem,
} from '@/store/cartStore';
import { CartItem } from '@/app/types/cart';

/**
 * 장바구니 페이지 컴포넌트
 */
export default function CartPage() {
  const items = useCartItems();
  const isLoading = useCartLoading();
  const error = useCartError();
  const totalItemCount = useTotalItemCount();
  const totalSelectedItemCount = useTotalSelectedItemCount();
  const isAllItemsSelected = useIsAllItemsSelected();
  const totalProductPrice = useTotalProductPrice();
  const deliveryFee = useDeliveryFee();
  const freeDeliveryRemainingAmount = useFreeDeliveryRemainingAmount();
  const totalPaymentPrice = useTotalPaymentPrice();

  const initCart = useInitCart();
  const toggleItemSelection = useToggleItemSelection();
  const toggleAllItemsSelection = useToggleAllItemsSelection();
  const updateItemQuantity = useUpdateItemQuantity();
  const removeItem = useRemoveItem();

  // 초기 데이터 로드
  useEffect(() => {
    initCart();
  }, [initCart]);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">오류가 발생했습니다</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  // 수량 증가 핸들러
  const handleIncreaseQuantity = (item: CartItem) => {
    updateItemQuantity(item.id, item.quantity + 1);
  };

  // 수량 감소 핸들러
  const handleDecreaseQuantity = (item: CartItem) => {
    if (item.quantity > 1) {
      updateItemQuantity(item.id, item.quantity - 1);
    }
  };

  // 전체 선택 핸들러
  const handleToggleAll = () => {
    toggleAllItemsSelection(!isAllItemsSelected);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 pb-32 lg:pb-6">
        {/* 헤더 */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">장바구니</h1>
          <p className="mt-1 text-sm text-gray-600">
            총 {totalItemCount}개의 상품이 담겨있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* 상품 목록 */}
          <div className="lg:col-span-2">
            {/* 전체 선택 */}
            <div className="mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAllItemsSelected}
                  onChange={handleToggleAll}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  전체 선택 ({totalSelectedItemCount}/{totalItemCount})
                </span>
              </label>
            </div>

            {/* 상품 리스트 */}
            <div className="space-y-4">
              {items.length === 0 ? (
                <div className="py-20 text-center text-gray-500">
                  장바구니가 비어있습니다.
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4"
                  >
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                      {/* 체크박스 */}
                      <input
                        type="checkbox"
                        checked={item.isSelected}
                        onChange={() => toggleItemSelection(item.id)}
                        className="w-4 h-4 mt-1 sm:mt-0 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
                      />

                      {/* 상품 이미지 */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* 상품 정보 - 모바일에서 세로 배치 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2">
                            {item.name}
                          </h3>
                          {/* 모바일: 삭제 버튼 */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="flex-shrink-0 text-gray-400 hover:text-red-600 sm:hidden"
                            aria-label="상품 삭제"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <p className="text-base sm:text-lg font-bold text-gray-900">
                              {item.price.toLocaleString()}원
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              총 {(item.price * item.quantity).toLocaleString()}원
                            </p>
                          </div>

                          {/* 수량 조절 */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDecreaseQuantity(item)}
                              disabled={item.quantity <= 1}
                              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleIncreaseQuantity(item)}
                              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 text-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 데스크톱: 삭제 버튼 */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="hidden sm:flex flex-shrink-0 text-red-500 hover:text-red-700"
                        aria-label="상품 삭제"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 주문 요약 - 데스크톱 */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                주문 요약
              </h2>

              {/* 선택된 상품 개수 */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">선택된 상품</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {totalSelectedItemCount}개
                  </span>
                </div>
              </div>

              {/* 가격 정보 */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">상품 금액</span>
                  <span className="font-medium text-gray-900">
                    {totalProductPrice.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">배송비</span>
                  <span className="font-medium text-gray-900">
                    {deliveryFee.toLocaleString()}원
                  </span>
                </div>
              </div>

              {/* 무료배송 메시지 */}
              {freeDeliveryRemainingAmount > 0 && totalSelectedItemCount > 0 && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 {freeDeliveryRemainingAmount.toLocaleString()}원 더 구매하시면 무료배송!
                  </p>
                </div>
              )}
              
              {/* 무료배송 달성 메시지 */}
              {freeDeliveryRemainingAmount === 0 && totalSelectedItemCount > 0 && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✓ 무료배송 조건을 충족했습니다!
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold text-gray-900">
                    총 결제 금액
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {totalPaymentPrice.toLocaleString()}원
                  </span>
                </div>
                <div className="text-xs text-gray-500 mb-6 text-right">
                  {totalSelectedItemCount > 0 && `${Math.floor(totalPaymentPrice * 0.01).toLocaleString()}P 적립 예정`}
                </div>

                {/* 주문하기 버튼 */}
                <button
                  disabled={totalSelectedItemCount === 0}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    totalSelectedItemCount === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {totalSelectedItemCount === 0
                    ? '상품을 선택해주세요'
                    : `${totalSelectedItemCount}개 상품 주문하기`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 하단 고정 주문 요약 바 */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* 무료배송 메시지 - 모바일 */}
          {freeDeliveryRemainingAmount > 0 && totalSelectedItemCount > 0 && (
            <div className="mb-2 p-2 bg-blue-50 rounded text-center">
              <p className="text-xs text-blue-700">
                💡 {freeDeliveryRemainingAmount.toLocaleString()}원 더 구매하시면 무료배송!
              </p>
            </div>
          )}
          {freeDeliveryRemainingAmount === 0 && totalSelectedItemCount > 0 && (
            <div className="mb-2 p-2 bg-green-50 rounded text-center">
              <p className="text-xs text-green-700">
                ✓ 무료배송 조건 충족!
              </p>
            </div>
          )}
          
          <div className="flex items-center justify-between gap-4">
            {/* 가격 정보 */}
            <div className="flex-1">
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-gray-500">총</span>
                <span className="text-xl font-bold text-blue-600">
                  {totalPaymentPrice.toLocaleString()}
                </span>
                <span className="text-sm text-gray-700">원</span>
              </div>
              <div className="text-xs text-gray-500">
                {totalSelectedItemCount > 0 ? (
                  <>
                    상품 {totalProductPrice.toLocaleString()}원 + 배송비 {deliveryFee.toLocaleString()}원
                  </>
                ) : (
                  '상품을 선택해주세요'
                )}
              </div>
            </div>

            {/* 주문하기 버튼 */}
            <button
              disabled={totalSelectedItemCount === 0}
              className={`flex-shrink-0 py-3 px-6 rounded-lg font-medium transition-colors ${
                totalSelectedItemCount === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
              }`}
            >
              {totalSelectedItemCount === 0
                ? '선택 필요'
                : `${totalSelectedItemCount}개 주문`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
