## Liên kết

- Deploy: https://vandungz.github.io/zest/
- Video demo: https://drive.google.com/file/d/1j7lHP87RK2axWm6oibYWjcjkW8adGGsg/view?usp=sharing

## Chức năng chính

- Hiển thị danh sách sách lấy từ Open Library API.
- Cache danh sách sách trong `localStorage` trong 24 giờ để giảm số lần gọi API.
- Tìm kiếm sách theo tên sách, tác giả hoặc danh mục.
- Lọc sách theo các tab danh mục: `All`, `Fiction`, `Business`, `Design`, `Science`, `Technology`, `Self-Growth`, `History`.
- Phân trang danh sách sách, mỗi trang hiển thị 20 sách.
- Đăng nhập bằng danh sách tài khoản mẫu trong source code.
- Chỉ cho phép thêm sách vào giỏ hàng khi người dùng đã đăng nhập.
- Giỏ hàng có thêm sách, tăng/giảm số lượng, xóa từng sách, xóa toàn bộ giỏ hàng và tính tổng tiền.
- Giỏ hàng được lưu riêng theo từng user; khách chưa đăng nhập có giỏ hàng riêng.
- Giao diện sáng/tối, theme được lưu lại sau khi reload trang.
- Header có menu bên trái, modal đăng nhập, drawer giỏ hàng và nút đổi theme.
- UI responsive theo grid 2-6 cột tùy kích thước màn hình.

## Cấu trúc thư mục

```text
zest/
+-- public/
|   +-- favicon.svg
|   +-- icons.svg
+-- docs/
|   +-- reference/
|   |   +-- CartContext.before-redux.jsx
|   |   +-- useBooks.before-redux.js
|   +-- state-management-roadmap.md
+-- src/
|   +-- app/
|   |   +-- store.js
|   +-- assets/
|   |   +-- hero.png
|   +-- components/
|   |   +-- common/
|   |   |   +-- Avatar.jsx
|   |   |   +-- Badge.jsx
|   |   |   +-- Button.jsx
|   |   |   +-- Spinner.jsx
|   |   +-- CartDrawer.jsx
|   |   +-- CategoryTabs.jsx
|   |   +-- Header.jsx
|   |   +-- Hero.jsx
|   |   +-- LoginModal.jsx
|   |   +-- Pagination.jsx
|   |   +-- ProductCard.jsx
|   |   +-- ProductList.jsx
|   |   +-- SearchBar.jsx
|   |   +-- SideMenu.jsx
|   +-- context/
|   |   +-- AuthContext.jsx
|   |   +-- ThemeContext.jsx
|   +-- data/
|   |   +-- products.js
|   |   +-- users.js
|   +-- features/
|   |   +-- books/
|   |   |   +-- booksCache.js
|   |   |   +-- booksSelectors.js
|   |   |   +-- booksSlice.js
|   |   |   +-- booksThunks.js
|   |   +-- cart/
|   |   |   +-- CartPersistenceBridge.js
|   |   |   +-- cartSelectors.js
|   |   |   +-- cartSlice.js
|   +-- hooks/
|   |   +-- useDebounce.js
|   +-- pages/
|   |   +-- HomePage.jsx
|   +-- stores/
|   |   +-- uiStore.js
|   +-- App.jsx
|   +-- index.css
|   +-- main.jsx
+-- index.html
+-- package.json
+-- vite.config.js
```

## Kiến trúc ứng dụng

`App.jsx` bọc toàn bộ ứng dụng bằng Redux Provider, sau đó là các Context còn phù hợp:

```text
Provider store={store}
+-- ThemeProvider
    +-- AuthProvider
        +-- CartPersistenceBridge
        +-- HomePage
```

Thứ tự này quan trọng vì:

- `Provider store={store}` cho phép toàn app dùng Redux qua `useSelector` và `useDispatch`.
- `ThemeProvider` quản lý theme sáng/tối.
- `AuthProvider` quản lý user đăng nhập.
- `CartPersistenceBridge` nằm bên trong `AuthProvider`, nên đọc được `user` bằng `useAuth()` để tạo key giỏ hàng đúng cho từng user.

## Kiến trúc state management

Zest hiện dùng nhiều lớp quản lý state, mỗi lớp có trách nhiệm riêng:

| Lớp | Quản lý | Lý do |
| --- | --- | --- |
| Redux Toolkit | Cart state, books async state | Đây là domain state dùng ở nhiều component, có nhiều action, derived data, async loading và persistence/cache boundary. |
| Zustand | Overlay UI state | Cart drawer, side menu và login modal là UI state nhẹ, cần phối hợp giữa nhiều component nhưng không cần Redux boilerplate. |
| Context | Auth và theme | Auth hiện vẫn là fake-login đơn giản. Theme là use case tốt cho Context vì chỉ có một giá trị global kèm DOM/localStorage side effect. |
| Local component state | Search, filter, pagination, image fallback, form fields | Các state này thuộc một màn hình hoặc một component cụ thể, chưa cần global ownership. |

## Redux store

Redux store được tạo trong `src/app/store.js`:

```text
store
+-- cart
|   +-- items
+-- books
    +-- items
    +-- status
    +-- error
```

`cart` và `books` là hai slice độc lập. Component đọc dữ liệu bằng selector, còn thay đổi state bằng action/thunk.

## Luồng tải dữ liệu sách

Dữ liệu sách được lấy trong `src/data/products.js` thông qua Open Library, nhưng lifecycle loading/error/cache hiện được quản lý bằng Redux Toolkit:

```text
HomePage
+-- useEffect
    +-- nếu books.status === idle
        +-- dispatch(fetchBooks())
            +-- booksThunks.js
                +-- đọc cache từ localStorage: zest-books-cache
                +-- nếu cache còn hạn 24 giờ: return cached data
                +-- nếu không có cache:
                    +-- fetch Open Library API
                    +-- transform thành model nội bộ trong data/products.js
                    +-- ghi cache mới bằng booksCache.js
                    +-- fulfilled -> booksSlice lưu items
```

State của books:

| Field | Ý nghĩa |
| --- | --- |
| `items` | Danh sách sách đã load |
| `status` | `idle`, `loading`, `succeeded` hoặc `failed` |
| `error` | Message lỗi khi fetch thất bại |

Model sách sau khi transform:

| Field | Ý nghĩa |
| --- | --- |
| `id` | Lấy từ `book.key`, fallback theo index |
| `title` | Tên sách |
| `author` | Tác giả đầu tiên trong `author_name` |
| `cover` | URL ảnh bìa từ Open Library Covers API |
| `category` | Chủ đề đầu tiên trong `subject`, được rút gọn |
| `year` | Năm xuất bản đầu tiên |
| `price` | Giá giả lập tính từ `cover_i` |

## Luồng tìm kiếm, lọc và phân trang

Trang chính quản lý UI state cục bộ tại `HomePage.jsx`:

```text
searchQuery      -> giá trị người dùng nhập
activeCategory   -> danh mục đang chọn
currentPage      -> trang hiện tại
```

Luồng xử lý:

```text
Người dùng gõ tìm kiếm
+-- setSearchQuery()
    +-- useDebounce(searchQuery, 300ms)
        +-- useMemo(filteredBooks)
            +-- lọc theo category nếu category khác All
            +-- lọc theo title, author, category nếu có keyword
                +-- useMemo(paginatedBooks)
                    +-- ProductList render 20 sách của trang hiện tại
```

Khi người dùng đổi keyword, đổi category hoặc đổi trang, `HomePage` reset/chuyển state và scroll về khu vực collection bằng `collectionRef`.

## Luồng đăng nhập

Đăng nhập được quản lý trong `AuthContext.jsx`.

```text
LoginModal
+-- submit email/password
    +-- login(email, password)
        +-- validate email và password không rỗng
        +-- tìm user trong USERS_DB
        +-- nếu sai: set authError
        +-- nếu đúng:
            +-- loại bỏ password khỏi object user
            +-- setUser(safeUser)
            +-- lưu user vào localStorage: zest-user
```

Khi logout:

```text
SideMenu / AuthContext
+-- logout()
    +-- setUser(null)
    +-- xóa authError
    +-- remove localStorage key zest-user
```

Lưu ý: đây là cơ chế authentication giả lập phục vụ bài tập frontend. Dự án chưa có backend, token, session server hoặc mã hóa password.

## Luồng giỏ hàng

Giỏ hàng hiện được quản lý bằng Redux Toolkit trong `src/features/cart/cartSlice.js`.

```text
ProductCard
+-- Add to Cart
    +-- nếu chưa đăng nhập: mở LoginModal bằng Zustand
    +-- nếu đã đăng nhập:
        +-- dispatch(addItem(book))
            +-- sách đã có: tăng quantity
            +-- sách chưa có: thêm item với quantity = 1
```

Reducer hỗ trợ các action:

| Action creator | Tác dụng |
| --- | --- |
| `addItem(book)` | Thêm sách mới hoặc tăng số lượng nếu đã có |
| `removeItem(id)` | Xóa một sách khỏi giỏ hàng |
| `increaseQuantity(id)` | Tăng số lượng sách |
| `decreaseQuantity(id)` | Giảm số lượng, nếu về 0 thì xóa khỏi giỏ |
| `clearCart()` | Xóa toàn bộ giỏ hàng |
| `loadCart(items)` | Nạp giỏ hàng từ `localStorage` |

Derived data của giỏ hàng nằm trong `cartSelectors.js`:

| Selector | Cách tính |
| --- | --- |
| `selectCartItems` | Trả về `state.cart.items` |
| `selectTotalItems` | Tổng `quantity` của tất cả item |
| `selectSubtotal` | Tổng `price * quantity` |
| `selectIsCartEmpty` | `items.length === 0` |
| `selectCartItemById` | Tìm item theo `id` |

## Luồng lưu giỏ hàng

Cart persistence hiện nằm trong `CartPersistenceBridge.js`.

```text
CartPersistenceBridge
+-- đọc user từ AuthContext
+-- tạo cartKey
    +-- đã đăng nhập:  zest-cart-{user.id}
    +-- chưa đăng nhập: zest-cart-guest
+-- khi cartKey đổi:
    +-- đọc localStorage
    +-- dispatch(loadCart(items))
+-- khi Redux cart items đổi:
    +-- ghi localStorage theo cartKey hiện tại
```

Bridge component được dùng thay middleware vì auth vẫn nằm trong Context. Redux middleware chỉ thấy Redux state, trong khi hiện tại Redux store chưa có `state.auth`.

## Luồng UI overlay

Overlay UI state được quản lý bằng Zustand trong `src/stores/uiStore.js`.

```text
uiStore
+-- isCartOpen
+-- isSideOpen
+-- isLoginOpen
+-- openCart()
+-- closeCart()
+-- openSideMenu()
+-- closeSideMenu()
+-- openLogin()
+-- closeLogin()
+-- closeAllOverlays()
```

`Header.jsx` đọc overlay state bằng custom hook `useHeaderOverlayState()`. Hook này gom các state/action Header cần, và dùng `useShallow` để tránh re-render không cần thiết khi các field không đổi.

## Luồng theme sáng/tối

Theme được quản lý trong `ThemeContext.jsx`.

```text
Người dùng bấm nút đổi theme
+-- toggleTheme()
    +-- setTheme(light <-> dark)
        +-- useEffect
            +-- set data-theme trên document.documentElement
            +-- lưu localStorage key zest-theme
```

Theme vẫn giữ ở Context vì đây là state global đơn giản, chỉ có một giá trị chính và một số side effect rõ ràng.

Màu sắc được định nghĩa bằng CSS variables trong `src/index.css`. Khi `data-theme="dark"`, các biến màu được đổi sang bảng màu tối, còn màu accent giữ nguyên.

## Custom hooks

| Hook | File | Vai trò |
| --- | --- | --- |
| `useDebounce` | `src/hooks/useDebounce.js` | Trì hoãn cập nhật giá trị trong 300ms để giảm số lần filter khi người dùng gõ tìm kiếm |
| `useHeaderOverlayState` | `src/components/Header.jsx` | Gom Zustand overlay state/action mà Header cần dùng |

`useBooks` đã được thay bằng Redux Toolkit (`booksSlice`, `booksThunks`, `booksSelectors`, `booksCache`). Nếu cần đối chiếu cách cũ, xem `docs/reference/useBooks.before-redux.js`.

## React hooks được sử dụng

| Hook | Nội dung trong dự án |
| --- | --- |
| `useState` | Quản lý form login, search query, category, page, image error |
| `useEffect` | Sync `localStorage`, fetch dữ liệu bằng thunk trigger, lock scroll khi overlay mở, lắng nghe phím Escape |
| `useContext` | Chia sẻ auth và theme giữa các component |
| `useMemo` | Tính `filteredBooks`, `paginatedBooks`, `pageNumbers` |
| `useCallback` | Giữ reference handler ổn định cho các component memoized |
| `useRef` | Scroll tới collection, focus input email khi mở modal, chặn save cart rỗng trước khi hydrate xong |
| `memo` | Giảm render lại cho `ProductCard`, `ProductList`, `CategoryTabs`, `SearchBar`, `Pagination` |
| `useSelector` | Đọc Redux state qua selectors |
| `useDispatch` | Dispatch Redux actions và thunks |

## Các component chính

| Component | Vai trò |
| --- | --- |
| `Header` | Thanh điều hướng sticky, mở menu, login modal, cart drawer và đổi theme |
| `Hero` | Khu vực mở đầu với CTA scroll tới collection |
| `CategoryTabs` | Chọn danh mục sách |
| `SearchBar` | Controlled input để tìm kiếm sách |
| `ProductList` | Render grid sách và empty state |
| `ProductCard` | Hiển thị sách, ảnh bìa, tác giả, category, giá và nút thêm giỏ hàng |
| `Pagination` | Điều hướng trang danh sách sách |
| `LoginModal` | Form đăng nhập, hiển thị lỗi và danh sách tài khoản mẫu |
| `CartDrawer` | Drawer giỏ hàng, tăng/giảm/xóa item, subtotal, clear cart |
| `SideMenu` | Menu bên trái, hiển thị thông tin user và login/logout |
| `Button`, `Avatar`, `Badge`, `Spinner` | Component dùng chung |

## LocalStorage keys

| Key | Dữ liệu |
| --- | --- |
| `zest-theme` | Theme hiện tại: `light` hoặc `dark` |
| `zest-user` | User đang đăng nhập, không lưu password |
| `zest-books-cache` | Danh sách sách đã fetch và timestamp cache |
| `zest-cart-guest` | Giỏ hàng của khách chưa đăng nhập |
| `zest-cart-{user.id}` | Giỏ hàng riêng của từng user |

## API sử dụng

Dự án gọi Open Library Search API:

```text
https://openlibrary.org/search.json?q=subject:fiction&limit=1000&fields=key,title,author_name,cover_i,subject,first_publish_year
```

Ảnh bìa sách lấy theo `cover_i`:

```text
https://covers.openlibrary.org/b/id/{cover_i}-M.jpg
```

## Tài liệu học tập

- `docs/state-management-roadmap.md`: roadmap refactor state management theo từng phase.
- `docs/reference/CartContext.before-redux.jsx`: bản CartContext cũ để đối chiếu trước/sau Redux Toolkit.
- `docs/reference/useBooks.before-redux.js`: bản useBooks cũ để đối chiếu trước/sau Redux Toolkit async state.
- `src/features/cart/*`: ví dụ Redux Toolkit cho domain state có derived data và persistence theo user.
- `src/features/books/*`: ví dụ Redux Toolkit cho async state, thunk và cache service.
- `src/stores/uiStore.js`: ví dụ Zustand cho UI state nhẹ.
