# Các khái niệm React trong ex1 (SBA301)

> Tài liệu ôn nhanh các khái niệm React mà giảng viên có thể hỏi khi vấn đáp bài `Slot3/ex1`. Mỗi mục đều chỉ rõ vị trí code thực tế trong project để bạn dễ chỉ tay khi trình bày.

---

## 1. Entry point: `createRoot` + `StrictMode` (`src/main.jsx`)

```jsx
createRoot(document.getElementById('root')).render(
  <StrictMode><App /></StrictMode>
)
```

- `createRoot` là API mới của **React 18** (thay cho `ReactDOM.render` cũ), bật **concurrent rendering**.
- `StrictMode` là *development-only*: nó **render component 2 lần** để phát hiện side-effect không đúng (gọi setState trong render, effect không cleanup…). Trong production thì không có chuyện này.
- Câu hỏi hay gặp: "Tại sao app log 2 lần?" → vì StrictMode.

---

## 2. JSX

JSX không phải HTML — nó là *syntactic sugar* compile thành `React.createElement(...)`. Vì vậy:

- Dùng `className` thay vì `class` (vì `class` là từ khóa JS).
- Biểu thức JS được nhúng bằng `{}`: `{orchid.orchidName}`, `` {`mailto:${email}`} ``.
- Mỗi component phải return **một root element duy nhất** → trong `App.jsx` bạn dùng Fragment `<>...</>` để gom `HeroCarousel` và `ListOfOrchids` lại.

---

## 3. Functional Component vs Class Component

Đây là điểm giảng viên *chắc chắn* hỏi vì ex1 có cả hai:

- **Functional component** (đa số file): `Header`, `Footer`, `HeroCarousel`, `ListOfOrchids`, `About`, `Contact`, `ConfirmModal`, `MyProfile`, `App`. Chỉ là một function trả về JSX, dùng được **Hooks**.
- **Class component**: `Orchid.jsx` — `class Orchid extends Component` với method `render()`, truy cập props qua `this.props`.

| Tiêu chí | Function Component | Class Component |
|---|---|---|
| Cú pháp | `function X(props)` | `class X extends Component` |
| Props | tham số trực tiếp | `this.props` |
| State | `useState` | `this.state` + `this.setState` |
| Lifecycle | `useEffect` | `componentDidMount`, `componentDidUpdate`… |

React hiện đại khuyến khích dùng functional + hooks.

---

## 4. Props (truyền dữ liệu cha → con)

Bài bạn có cả 4 kiểu props phổ biến:

- **Destructuring props** (`Footer.jsx`): `function Footer({ avatar, name, email })`.
- **Props là chuỗi / số / bool** (`App.jsx`): `<Footer avatar="/images/work.png" name="thanh" email="thanhptv.vn" />`.
- **Props là object/array** (`App.jsx`): `<HeroCarousel slides={CarouselData} />`, `<ListOfOrchids orchidsData={OrchidsData} />`.
- **Props là function (callback)** (`ListOfOrchids` → `Orchid`): `<Orchid orchid={orchid} onDetail={handleShow} />`. Đây là cách **con báo ngược lên cha** — Orchid bấm nút Detail thì gọi `onDetail(orchid)` để cha mở modal.
- **Props là JSX/React element** (`ListOfOrchids` → `ConfirmModal`): prop `body={<div>...</div>}` — truyền nguyên một đoạn JSX vào con.

---

## 5. State với `useState` Hook (`ListOfOrchids.jsx`)

```jsx
const [show, setShow] = useState(false);
const [selectedOrchid, setSelectedOrchid] = useState(null);
```

- `useState` là **Hook** — chỉ dùng được trong functional component, không được gọi trong `if`/`for` (Rules of Hooks).
- Trả về cặp `[value, setter]`. Gọi `setShow(true)` → React **re-render** component.
- State **bất biến (immutable)**: phải gọi setter, không gán trực tiếp `show = true`.

---

## 6. Lifting State Up (nâng state lên cha)

Trong `ListOfOrchids`:

- State `show` / `selectedOrchid` **không** đặt ở `Orchid` cũng không ở `ConfirmModal`, mà ở **component cha chung** của cả hai.
- Cha truyền `handleShow` xuống `Orchid` (để mở), truyền `show` + `handleClose` xuống `ConfirmModal` (để đóng/hiển thị).
- Đây chính là pattern **"lifting state up"** trong docs React — câu hỏi *đinh* của giảng viên.

---

## 7. Conditional Rendering (4 kiểu xuất hiện trong bài)

- **Short-circuit `&&`** (`Orchid.jsx`): `{orchid.isSpecial && (<span>Đặc biệt</span>)}`.
- **Ternary `? :`** — chưa dùng trong bài nhưng nên biết: `cond ? <A/> : <B/>`.
- **Early return** (`Orchid.jsx` `render()`): `if (!orchid) return <div>Không tìm thấy…</div>`.
- **Optional chaining** (`ListOfOrchids.jsx`): `selectedOrchid?.orchidName` — tránh crash khi `selectedOrchid` còn là `null`.

---

## 8. List Rendering với `.map()` và `key`

```jsx
{orchidsData.map((orchid) => (
  <Col ... key={orchid.id}>
    <Orchid orchid={orchid} onDetail={handleShow} />
  </Col>
))}
```

- Render list = dùng `.map()` trả về array các element.
- **Prop `key`** là *bắt buộc* và phải **unique trong cùng list** — React dùng key để biết phần tử nào thêm/xóa/đổi vị trí khi re-render (reconciliation).
- Không dùng `index` làm key nếu list có thể sắp xếp lại — trong bài bạn đã dùng `orchid.id` và `slide.id` → đúng chuẩn.

---

## 9. Event Handling

- Tên event theo **camelCase**: `onClick`, `onHide`, `onConfirm` (HTML thuần là `onclick`).
- Truyền **function reference**, không gọi luôn: `onClick={handleClose}` đúng, `onClick={handleClose()}` sai (sẽ gọi ngay khi render).
- Khi cần truyền tham số → bọc arrow: `onClick={() => onDetail(orchid)}` (`Orchid.jsx`).

---

## 10. React Router (`react-router-dom`) — `App.jsx`

```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<><HeroCarousel/><ListOfOrchids/></>} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
  </Routes>
</BrowserRouter>
```

- `BrowserRouter` bọc app để dùng HTML5 history API → URL "đẹp" không có `#`.
- `Routes` + `Route`: chọn component render theo `path`.
- `<Link to="/about">` (`Header.jsx`) thay cho `<a href>` — **không reload trang**, chỉ đổi route phía client (SPA).
- Pattern `as={Link}` trong Header: dùng component `Nav.Link` của Bootstrap nhưng *hành xử* như `Link` của router.

---

## 11. Component Composition / Layout

`App.jsx` thể hiện **composition**: layout cố định `<Header /> <main>{routes}</main> <Footer />`, phần ở giữa thay đổi theo URL. Đây là cách React thay thế "master page" của ASP.NET hay layout của các framework khác.

---

## 12. Import / Export Modules (ES Modules)

- **Default export** (đa số component): `export default function Header()` → import không cần ngoặc nhọn: `import Header from './components/Header'`.
- **Named export** (file data): `export const OrchidsData = [...]` → import có ngoặc nhọn: `import { OrchidsData } from './data/OrchidsData.js'`.
- Mỗi file có thể có **nhiều named export** nhưng chỉ **một default export**.

---

## 13. Public folder vs `src/assets`

- Ảnh trong `public/images/...` được truy cập qua đường dẫn tuyệt đối `/images/work.png` (Vite copy nguyên si vào root build).
- Ảnh trong `src/assets/` (hero.png, react.svg) thường phải `import` mới được — sẽ qua bundler để hash tên file, cache-busting.
- Trong `Orchid.jsx` có dòng `orchid.image.startsWith("/") ? orchid.image : `/${orchid.image}`` — chính là chuẩn hóa đường dẫn vì data viết `"images/orchid1.jpg"` thiếu `/` đầu.

---

## 14. Những điểm "bẫy" hay bị hỏi

- **Tại sao mỗi list item phải có `key`?** → để React reconcile hiệu quả, tránh re-render thừa và lỗi state ở list con.
- **Vì sao không sửa state trực tiếp?** → React so sánh tham chiếu để quyết định re-render; mutate trực tiếp không trigger render.
- **Hooks chỉ được gọi ở đâu?** → top-level của function component (hoặc custom hook), không trong `if`/`loop`/nested function.
- **Khác biệt `props` và `state`?** → props là *immutable, từ cha truyền xuống*; state là *mutable, do chính component sở hữu*.
- **JSX biên dịch thành gì?** → `React.createElement(type, props, ...children)`.
- **Component name viết hoa chữ đầu?** → bắt buộc, để JSX phân biệt với HTML tag thường (`<div>` vs `<Div>`).

---

## 15. Lỗi nhỏ trong code có thể bị soi

Trong `App.jsx`:

```jsx
import { BrowserRouter as BrowsersRouter, Route, Routes } from 'react-router-dom'
```

Bạn alias `BrowserRouter as BrowsersRouter` (thừa chữ "s"). Code vẫn chạy, nhưng nếu giảng viên hỏi "tên đúng của router này là gì?" → đáp án là `BrowserRouter`. Nên đổi lại cho gọn để khỏi mất điểm tiểu tiết.

---

## Bảng tổng hợp khái niệm ↔ file

| Khái niệm | File minh họa |
|---|---|
| `createRoot`, `StrictMode` | `src/main.jsx` |
| Functional component | hầu hết các file `.jsx` |
| Class component, `render()`, `this.props` | `src/components/Orchid.jsx` |
| Destructuring props | `src/components/Footer.jsx`, `Header.jsx` |
| Callback prop (con → cha) | `ListOfOrchids.jsx` → `Orchid.jsx` |
| JSX làm prop | `ListOfOrchids.jsx` → `ConfirmModal.jsx` |
| `useState` | `ListOfOrchids.jsx` |
| Lifting state up | `ListOfOrchids.jsx` (cha của `Orchid` & `ConfirmModal`) |
| Conditional `&&` | `Orchid.jsx` (badge "Đặc biệt") |
| Optional chaining `?.` | `ListOfOrchids.jsx` |
| `.map()` + `key` | `HeroCarousel.jsx`, `ListOfOrchids.jsx` |
| Event handler arrow | `Orchid.jsx` (`onClick`) |
| React Router | `App.jsx`, `Header.jsx` |
| Fragment `<>...</>` | `App.jsx` (Route `/`) |
| Default vs Named export | components vs `data/*.js` |
