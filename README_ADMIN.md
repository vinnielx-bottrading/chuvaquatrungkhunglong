# Quản trị game Chu — 1.6

## Trang quản trị ở đâu?
Mở `admin.html` cùng thư mục/tên miền với game, hoặc bấm **Quản trị** ở trang mở đầu.
Bản hiện tại: https://chu-dinosaur-egg-demo.nguyenhoangvinh456.chatgpt.site/admin.html

## Thiết lập bắt buộc lần đầu
1. Chạy `schema.sql` nếu chưa làm bản 1.5; bật Google theo `SUPABASE_SETUP.md`.
2. Chạy toàn bộ `admin-schema.sql` trong Supabase SQL Editor của dự án ltvlupdmjlmuqyaexvmn. Script không xóa người chơi/tiến trình, chạy lại được cho cùng phiên bản.
3. Mở admin.html, đăng nhập Google. Sao chép **UUID của chính bạn** hiện dưới thông tin tài khoản.
4. Trong SQL Editor chạy câu sau, thay placeholder bằng UUID thật:
```sql
insert into chu_private.admins(user_id)
values ('THAY-BANG-UUID-CUA-BAN')
on conflict do nothing;
```
5. Về admin, bấm **Kiểm tra lại quyền**.
Không có mật khẩu mặc định hay nút tự cấp quyền. Không đưa service_role/Google Client Secret vào frontend. SQL/RLS kiểm tra quyền, không chỉ ẩn nút giao diện.

## Chương & trang mở đầu
Chỉnh tiêu đề, lời giới thiệu, tên/mô tả/thứ tự chương. Có Mở, Sắp ra mắt, Hẹn lịch mở, Tạm khóa, Ẩn. Nhập giờ theo Việt Nam UTC+7; database lưu UTC. Trang đầu lấy mốc giờ server và kiểm tra cấu hình mỗi phút.

Chương 1 chứa bốn chặng hiện tại; có thể đổi tên chặng nhưng chưa đổi thứ tự gameplay. Chương 2, 3, 4 là thẻ giới thiệu dự kiến, chưa có bản đồ/nhiệm vụ. Thêm chương giới thiệu không tự tạo game; dù chọn Mở, chương chưa có code vẫn hiện Sắp ra mắt.

Khóa áp dụng cho bắt đầu/khôi phục qua giao diện, không ngắt người đang chơi. Đây là quản lý phát hành giao diện, không phải DRM/paywall cho tài nguyên đã tải. Mất mạng dùng cấu hình công khai đã nhận gần nhất; chưa từng nhận cấu hình thì dùng bản mặc định với Chương 1 mở. Không dùng cơ chế này để bảo vệ nội dung bí mật/trả phí.

## Quy trình xuất bản
- **Lưu nháp**: lưu công việc, chưa đổi game.
- **Xem trước**: xem tiêu đề/mô tả/thẻ trong hộp xem trước; không chạy bản đồ.
- **Xuất bản vào game**: lưu bản đang sửa rồi áp dụng. Người chơi nhận khi mở trang đầu hoặc sau tối đa khoảng một phút khi còn ở trang đầu và có mạng.
- **Lịch sử xuất bản**: xem 30 lần gần nhất, thời gian và UUID người thực hiện; đưa bản cũ vào nháp rồi xuất bản để khôi phục.
- Revision ngăn bản nháp cũ ở một phiên khác ghi đè âm thầm. Nếu xung đột, tải lại trang và áp dụng lại phần chỉnh cần giữ.

## Âm thanh
Có âm thanh mặc định theo ngữ cảnh (Web Audio): nhạc nhẹ, chim/gió, suối theo vị trí, mưa theo cảnh; hang có giai điệu thấp hơn. Tải MP3/OGG/WAV/M4A tối đa 20 MB, nghe thử rồi chọn cho chương hoặc riêng chặng. Điều chỉnh nhạc, thiên nhiên/hiệu ứng, suối riêng từ 0–100%.

Chặng không có nhạc riêng dùng nhạc chương; không chọn file dùng mặc định. File không tải/phát được quay về mặc định. Khôi phục mặc định không xóa file. Tải lên chưa áp dụng vào game cho tới khi lưu và xuất bản. Nhạc mới áp dụng sau lần tải cấu hình khi về trang đầu.

Kho hiển thị 100 file mới nhất, tên UUID tránh ghi đè. Chưa có xóa file để tránh làm hỏng cấu hình đang sử dụng. Bucket chu-audio công khai chỉ dùng cho nhạc game, không tải dữ liệu cá nhân vào đây.

## Người đăng ký
Tìm tên/email, 50 hồ sơ/trang, xem ngày ghi nhận, hoạt động đã ghi nhận gần nhất và tiến trình. CSV xuất **trang hiện tại**, chống ô công thức. Chỉ admin thấy hồ sơ người khác; người chơi chỉ xem dữ liệu của mình. Không đọc Gmail và không tự gửi quảng cáo.

## Dữ liệu bổ sung
- chu_catalog_draft: bản nháp chỉ admin đọc/ghi.
- chu_catalog_public: cấu hình game đọc công khai.
- chu_catalog_history: lịch sử xuất bản, ứng dụng không sửa/xóa.
- storage chu-audio: admin tải/liệt kê, công khai đọc file nhạc.
- Dùng lại chu_profiles, chu_progress, chu_private.admins của bản 1.5.

## Kiểm chứng và giới hạn
Đã chạy SQL hai lần trên PostgreSQL WASM/PGlite mô phỏng auth/storage, kiểm tra chặn người thường xuất bản/tải nhạc, khách không đọc bản nháp, xuất bản tạo lịch sử, chống bản nháp cũ. Kiểm tra lịch mở/khóa/chương chưa xây dựng; game bốn chặng qua DOM/renderer giả lập; âm thanh mặc định render offline không clipping.
Chưa chạy SQL trên dự án thật, chưa kiểm tra Google/tải nhạc/UI trình duyệt thật. Sau thiết lập hãy thử: lưu nháp không đổi game; xuất bản có đổi; khóa/mở chương; chọn nhạc; đăng nhập bằng tài khoản không có quyền. Quyền chia sẻ Sites được giữ nguyên.
