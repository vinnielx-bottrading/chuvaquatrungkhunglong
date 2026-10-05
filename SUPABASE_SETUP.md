# Thiết lập Supabase cho Chu — 1.5

## 1. Tạo bảng
Dự án đã điền trong game: `https://ltvlupdmjlmuqyaexvmn.supabase.co`.
Mở Supabase Dashboard đúng dự án → SQL Editor → New query → dán toàn bộ `schema.sql` → Run.
Hai dòng xác minh cuối phải có `rowsecurity = true`. Script không xóa người dùng hoặc dữ liệu sẵn có, và chạy lại được cho cùng phiên bản.

Bảng `chu_profiles`: tên, email, thời điểm ghi nhận đăng ký, lần hoạt động gần nhất. Hồ sơ được ghi sau đăng nhập; thông tin đăng nhập gốc vẫn nằm trong Authentication → Users.
Bảng `chu_progress`: mỗi người một bản lưu cho Chương 1; gồm chặng (0–3), nhiệm vụ hoàn thành, nhật ký, huy hiệu, vị trí, câu đố và kết thúc.
`chu_private.admins` dành cho quyền xem danh sách trong admin về sau; trang quản trị có ở bản 1.6; xem README_ADMIN.md và chạy admin-schema.sql.

## 2. Bật đăng nhập Google
1. Trong Google Cloud / Google Auth Platform: chọn hoặc tạo dự án, cấu hình Branding, Audience và thông tin hỗ trợ.
2. Tạo OAuth Client loại **Web application**.
3. Authorized JavaScript origins: thêm tên miền gốc của game (không gồm đường dẫn).
4. Authorized redirect URIs: thêm chính xác:
   `https://ltvlupdmjlmuqyaexvmn.supabase.co/auth/v1/callback`
5. Trong Supabase → Authentication → Sign In / Providers → Google: bật Google, điền Client ID và Client Secret vừa tạo → Save.
6. Chỉ yêu cầu scope `openid`, email và profile. Không cần quyền Gmail. Nếu ứng dụng Google đang ở Testing, thêm tài khoản thử vào Test users; khi phát hành, cấu hình Audience phù hợp.

**Không đưa Google Client Secret hoặc Supabase service_role vào mã game/GitHub.** Client Secret chỉ nhập trong Supabase Dashboard. Khóa `sb_publishable_...` trong `dist/supabase-config.js` là khóa công khai; RLS bảo vệ dữ liệu.

## 3. Cho phép URL quay lại game
Trong Supabase → Authentication → URL Configuration:
- Site URL: tên miền bản game bạn sử dụng.
- Redirect URLs: thêm đúng URL trang `auth-callback.html` của từng bản game.

Bản Sites:
`https://chu-dinosaur-egg-demo.nguyenhoangvinh456.chatgpt.site/auth-callback.html`

Bản Vercel: `https://TEN-GAME.vercel.app/auth-callback.html` (thay bằng tên miền thật).
GitHub Pages có tên repository: `https://TEN-USER.github.io/TEN-REPO/auth-callback.html`.
Local theo source repo: `http://localhost:8000/dist/auth-callback.html`.
Local theo ZIP GitHub: `http://localhost:8000/auth-callback.html`.
Không dùng wildcard rộng khi đã biết địa chỉ chính thức. Khi đổi domain, cập nhật cả URL Configuration và Google origins.

## 4. Tải game lên GitHub / Vercel
ZIP đã đặt `index.html`, `auth-callback.html`, `game.js`, các module và tài nguyên ở thư mục gốc. Tải toàn bộ nội dung ZIP vào repository. Chọn hosting tĩnh, không cần build. Giữ file `schema.sql` để quản lý phiên bản; không đưa khóa bí mật vào đó.
Với source repo Sites, thư mục xuất bản là `dist/`. `package.json` và lockfile chỉ phục vụ đóng gói lại SDK khi sửa code; bản ZIP đã chứa SDK nên không cần npm install.

## 5. Cách chơi và lưu
- Khách chơi hoàn toàn trong bộ nhớ của trang. Đóng, tải lại hoặc thoát về màn hình đầu sẽ mất hành trình. Bản localStorage cũ của v1.4 được bỏ để phù hợp cơ chế này.
- Đăng nhập mở cửa sổ riêng, giữ trang game gốc đang mở. Nếu trình duyệt chặn popup, cho phép rồi bấm lại. Hủy đăng nhập không xóa hành trình hiện tại.
- Phiên đăng nhập được Supabase SDK giữ trên trình duyệt để có thể đăng nhập lại tự động. Đây là dữ liệu phiên xác thực, không phải bản lưu tiến trình khách.
- Người đã đăng nhập được lưu sau nhiệm vụ/chuyển chặng/kết thúc, mỗi 15 giây, và có nút Lưu ngay. Một câu thoại đang mở sẽ không được khôi phục nguyên văn; game khôi phục trạng thái nhiệm vụ và cảnh.
- Nếu tài khoản đã có bản lưu, người chơi chọn tiếp tục bản đó hoặc thay bằng hành trình hiện tại sau xác nhận. Không tự gộp/ghi đè khi hai thiết bị có bản khác nhau.
- Chỉ báo “Đã đồng bộ” sau khi server xác nhận. Lỗi mạng/chưa chạy SQL sẽ báo chưa lưu; giữ trang mở và thử lại. Không có hàng đợi lưu bền vững khi offline.
- Nút Thoát mở lựa chọn đăng nhập để lưu, thoát không lưu hoặc chơi tiếp. Đã đăng nhập thì thử lưu trước khi về màn hình đầu; nếu thất bại, phải chọn bỏ tiến trình chưa lưu một cách rõ ràng.
- Đóng tab/tải lại dùng cảnh báo mặc định beforeunload khi có tiến trình chưa lưu. Trình duyệt quyết định nội dung và có thể không hiện khi đóng ứng dụng, bị hệ điều hành tắt hoặc chưa tương tác. Không thể bảo đảm cảnh báo trong mọi trường hợp.
- Đăng xuất kết thúc phiên chơi hiện tại sau xác nhận; không xóa bản đã đồng bộ trên server.

## 6. Quyền quản trị (tùy chọn)
Sau khi chính bạn đăng nhập Google một lần, vào Authentication → Users, sao chép UUID của bạn rồi chạy:
```sql
insert into chu_private.admins(user_id)
values ('THAY-BANG-UUID-THAT-CUA-BAN')
on conflict do nothing;
```
Không chạy nguyên văn placeholder. Người chơi không được tự thêm mình vào bảng admins. Quyền quản trị không dựa vào user_metadata hoặc email do người chơi tự gửi.
Hiện có thể xem người đăng ký và tiến trình bằng Supabase Table Editor. Bản 1.6 có admin.html; xem README_ADMIN.md và chạy SQL bổ sung.

## 7. Kiểm tra sau khi cấu hình
1. Chơi khách, hoàn thành một nhiệm vụ, chọn Thoát → Chơi tiếp: hành trình phải còn.
2. Chọn Thoát không lưu, bắt đầu lại: hành trình mới phải trống.
3. Đăng nhập Google khi đang chơi khách → lưu → Table Editor thấy đúng user_id và snapshot.
4. Trên trình duyệt/thiết bị khác, đăng nhập cùng tài khoản và chọn Tiếp tục bản trên tài khoản.
5. Đăng nhập tài khoản thứ hai: không thấy hành trình của người thứ nhất.
6. Tắt mạng, thử lưu: không được hiện “Đã đồng bộ”; bật mạng rồi thử lại.
7. Hai thiết bị cùng lưu: bản cũ phải được yêu cầu chọn lại, không âm thầm ghi đè.

## Kiểm chứng bản bàn giao
Đã chạy schema hai lần trên PostgreSQL WASM (PGlite) với mô phỏng auth.uid/JWT: RLS hai người dùng, chặn anon, chặn sửa chủ sở hữu và tự cấp admin, kiểm tra revision chống ghi đè. Đã chạy hành trình game bốn chặng trong môi trường DOM/renderer giả lập, kiểm tra khôi phục bản lưu và không lưu khách vào localStorage. Chưa chạy SQL trên dự án thật, chưa kiểm tra đăng nhập Google đầu-cuối, chưa kiểm tra UI trên trình duyệt/GPU thật. Bạn cần thực hiện checklist trên sau cấu hình.

## Tài liệu chính thức
- https://supabase.com/docs/guides/auth/social-login/auth-google
- https://supabase.com/docs/guides/auth/sessions/pkce-flow
- https://supabase.com/docs/guides/database/postgres/row-level-security

SDK được đóng gói: @supabase/supabase-js 2.117.2, phiên bản cố định trong package-lock.json. Nhạc mặc định Web Audio và bảng QR vẫn giữ nguyên.
