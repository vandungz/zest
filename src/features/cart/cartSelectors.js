export const selectCartItems = (state) => state.cart.items

export const selectTotalItems = (state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)

export const selectSubtotal = (state) =>
    state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

export const selectIsCartEmpty = (state) =>
    state.cart.items.length === 0

export const selectCartItemById = (state, id) =>
    state.cart.items.find(item => item.id === id)