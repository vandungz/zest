import { create } from 'zustand'

export const useUiStore = create((set) => ({
    isCartOpen: false,
    isSideOpen: false,
    isLoginOpen: false,

    // Mở từng overlay riêng lẻ.
    openCart: () => set({ isCartOpen: true }),
    openSideMenu: () => set({ isSideOpen: true }),
    openLogin: () => set({ isLoginOpen: true }),

    // Đóng từng overlay riêng lẻ.
    closeCart: () => set({ isCartOpen: false }),
    closeSideMenu: () => set({ isSideOpen: false }),
    closeLogin: () => set({ isLoginOpen: false }),

    // Đóng tất cả overlay khi nhấn Escape hoặc cần reset UI.
    closeAllOverlays: () => set({
        isCartOpen: false,
        isSideOpen: false,
        isLoginOpen: false,
    }),

    // Cho phép component cũ set boolean trực tiếp trong lúc migrate.
    setLoginOpen: (isOpen) => set({ isLoginOpen: isOpen }),
}))
