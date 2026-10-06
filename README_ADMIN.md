# Quản trị game Chu — 1.11

## Khôi phục chương và xuất bản

- Chương 1–4 luôn có trong trình chỉnh sửa. Nếu bản cũ đã xóa Chương 2, bản này bổ sung lại ở trạng thái **Sắp ra mắt**; chọn **Mở** rồi **Xuất bản vào game** khi sẵn sàng.
- Muốn lấy lại tên, mô tả, âm thanh đã chỉnh trước khi xóa: vào **Lịch sử xuất bản**, tìm phiên bản còn chương đó, bấm **Khôi phục riêng: [tên chương]**. Các chương khác không bị thay đổi. Bản được khôi phục luôn là Sắp ra mắt để tránh vô tình mở chơi.
- Chương giới thiệu bổ sung có thể **Cất vào mục khôi phục**. Chúng nằm cuối trang Chương trong **Chương đã cất**; lưu bản nháp để giữ thay đổi này.
- **Lưu nháp** chưa tác động đến người chơi. **Xuất bản vào game** lưu nháp, gửi xuất bản rồi đọc lại bản công khai để xác nhận. Nếu chưa xác nhận được, kiểm tra mạng / tải lại admin trước khi quyết định xuất bản tiếp.
- Lời hẹn cho mỗi chương nằm ở trường **Lời hẹn khi chưa mở chương**. Chọn **Hẹn lịch mở** và giờ Việt Nam nếu muốn hiện ngày mở tự động. Chương 1–4 vẫn hiện trên trang đầu dù chưa mở. Trạng thái Ẩn cũ nay chỉ ngăn chơi, không giấu thẻ chương.
- Không cần SQL mới. Không xóa hay ghi đè tiến trình của người chơi khi đổi trạng thái phát hành.

## Trang quản trị ở đâu?
Mở trực tiếp `admin.html` cùng thư mục/tên miền với game. Trang người chơi không có liên kết quản trị.
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

Chương 1–4 đều có bốn chặng; có thể đổi tên chặng nhưng chưa đổi thứ tự gameplay. Nút Chơi thử chương mở nội dung cho admin mà không phát hành. Thêm chương ngoài bốn chương này chỉ tạo thẻ giới thiệu, không tự tạo nội dung chơi.

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
Đã chạy SQL hai lần trên PostgreSQL WASM/PGlite mô phỏng auth/storage, kiểm tra chặn người thường xuất bản/tải nhạc, khách không đọc bản nháp, xuất bản tạo lịch sử, chống bản nháp cũ. Kiểm tra lịch mở/khóa/chương chưa xây dựng; game 16 chặng qua DOM/renderer giả lập; âm thanh mặc định render offline không clipping.
Chưa chạy SQL trên dự án thật, chưa kiểm tra Google/tải nhạc/UI trình duyệt thật. Sau thiết lập hãy thử: lưu nháp không đổi game; xuất bản có đổi; khóa/mở chương; chọn nhạc; đăng nhập bằng tài khoản không có quyền. Quyền chia sẻ Sites được giữ nguyên.

## Cập nhật 1.7: mở Chương 2–4 khi bạn sẵn sàng

Chạy `chapters-upgrade.sql` sau bộ SQL đã cài trước đây. Không cần tạo lại tài khoản hay cấp lại admin.

Chương 1–4 đều có 4 chặng chơi. Mở trang admin, dùng **Chơi thử chương** để mở tab kiểm tra riêng (chỉ admin, không lưu tiến trình). Sau khi kiểm tra, chọn **Mở** / **Hẹn lịch mở**, bấm **Xuất bản vào game**. Bạn có thể giữ chương khác ở Sắp ra mắt, Tạm khóa hoặc Ẩn. Việc tải ZIP lên GitHub không tự xuất bản cấu hình chương mới.

Lần đọc cấu hình cũ bổ sung tên 4 chặng và lời giới thiệu mặc định mới vào trình chỉnh sửa. Lưu nháp/đăng lại để lưu các cập nhật này vào database. Bản công khai cũ vẫn quyết định lịch phát hành, âm thanh và trạng thái. Lịch sử cũ được giữ; khi khôi phục, kiểm tra trạng thái rồi mới xuất bản.

Danh sách người chơi hiển thị các bản lưu theo từng chương. Nhạc chương/chặng áp dụng cho cả 4 chương. Tất cả thiết lập quản trị chỉ hiện tại admin.html, không có liên kết từ trang khách.
