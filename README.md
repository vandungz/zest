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
+-- src/
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
|   |   +-- CartContext.jsx
|   |   +-- ThemeContext.jsx
|   +-- data/
|   |   +-- products.js
|   |   +-- users.js
|   +-- hooks/
|   |   +-- useBooks.js
|   |   +-- useDebounce.js
|   +-- pages/
|   |   +-- HomePage.jsx
|   +-- App.jsx
|   +-- index.css
|   +-- main.jsx
+-- index.html
+-- package.json
+-- vite.config.js
```

## Kiến trúc ứng dụng

`App.jsx` bọc toàn bộ ứng dụng trong 3 provider:

```text
ThemeProvider
+-- AuthProvider
    +-- CartProvider
        +-- HomePage
```

Thứ tự này quan trọng vì `CartProvider` cần đọc user từ `AuthContext` để tạo key giỏ hàng riêng cho từng tài khoản.

## Luồng tải dữ liệu sách

Dữ liệu sách được lấy trong `src/data/products.js` thông qua Open Library:

```text
HomePage
+-- useBooks()
    +-- đọc cache từ localStorage: zest-books-cache
    +-- nếu cache còn hạn 24 giờ: dùng cache
    +-- nếu không có cache:
        +-- fetch Open Library API
        +-- lọc sách có title và cover_i
        +-- transform thành model nội bộ
        +-- ghi cache mới vào localStorage
```

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

Trang chính quản lý state tại `HomePage.jsx`:

```text
searchQuery      -> giá trị người dùng nhập
activeCategory   -> danh mục đang chọn
currentPage      -> trang hiện tại
isLoginOpen      -> trạng thái modal đăng nhập
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

Giỏ hàng được quản lý trong `CartContext.jsx` bằng `useReducer`.

```text
ProductCard
+-- Add to Cart
    +-- nếu chưa đăng nhập: mở LoginModal
    +-- nếu đã đăng nhập:
        +-- addItem(book)
            +-- dispatch ADD_ITEM
                +-- sách đã có: tăng quantity
                +-- sách chưa có: thêm item với quantity = 1
```

Reducer hỗ trợ các action:

| Action | Tác dụng |
| --- | --- |
| `ADD_ITEM` | Thêm sách mới hoặc tăng số lượng nếu đã có |
| `REMOVE_ITEM` | Xóa một sách khỏi giỏ hàng |
| `INCREASE_QUANTITY` | Tăng số lượng sách |
| `DECREASE_QUANTITY` | Giảm số lượng, nếu về 0 thì xóa khỏi giỏ |
| `CLEAR_CART` | Xóa toàn bộ giỏ hàng |
| `LOAD_CART` | Nạp giỏ hàng từ `localStorage` |

Key lưu giỏ hàng:

```text
Đã đăng nhập:  zest-cart-{user.id}
Chưa đăng nhập: zest-cart-guest
```

Derived data trong giỏ hàng:

| Giá trị | Cách tính |
| --- | --- |
| `totalItems` | Tổng `quantity` của tất cả item |
| `subtotal` | Tổng `price * quantity` |
| `isEmpty` | `items.length === 0` |

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

Màu sắc được định nghĩa bằng CSS variables trong `src/index.css`. Khi `data-theme="dark"`, các biến màu được đổi sang bảng màu tối, còn màu accent giữ nguyên.

## Custom hooks

| Hook | File | Vai trò |
| --- | --- | --- |
| `useBooks` | `src/hooks/useBooks.js` | Tải sách từ Open Library, đọc/ghi cache 24 giờ, trả về `products`, `loading`, `error` |
| `useDebounce` | `src/hooks/useDebounce.js` | Trì hoãn cập nhật giá trị trong 300ms để giảm số lần filter khi người dùng gõ tìm kiếm |

## React hooks được sử dụng

| Hook | Nội dung trong dự án |
| --- | --- |
| `useState` | Quản lý form login, search query, category, page, overlay state, image error |
| `useEffect` | Sync `localStorage`, fetch dữ liệu, lock scroll khi overlay mở, lắng nghe phím Escape |
| `useReducer` | Quản lý giỏ hàng theo action rõ ràng và immutable |
| `useContext` | Chia sẻ auth, cart và theme giữa các component |
| `useMemo` | Tính `filteredBooks`, `paginatedBooks`, `totalItems`, `subtotal`, `pageNumbers` |
| `useCallback` | Giữ reference handler ổn định cho các component memoized |
| `useRef` | Scroll tới collection và focus input email khi mở modal |
| `memo` | Giảm render lại cho `ProductCard`, `ProductList`, `CategoryTabs`, `SearchBar`, `Pagination` |

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
