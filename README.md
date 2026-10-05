# Chu và Quả Trứng Thất Lạc

## Phiên bản 1.7 — Bốn chương khám phá
Game khám phá 3D low-poly bằng tiếng Việt, dành cho trẻ chơi cùng phụ huynh. Chu đọc truyện khủng long, nhận ra một ngọn núi quen thuộc, xin phép và cùng bố lên đường. Trẻ tập quan sát, giải câu đố, nhận biết tình huống nguy hiểm và nhờ người lớn hỗ trợ.

Bản 1.7 có 4 chương, mỗi chương 4 chặng. Chương 2–4 chờ chủ game mở trong admin. Nội dung chi tiết nằm trong README_CHAPTERS.md; hướng dẫn nâng cấp ở cuối tài liệu này. Chưa đo thời lượng chơi với trẻ thực tế.

## Chơi trực tiếp và chạy bản tải về
- Chơi ở đường dẫn bản game được gửi cùng file.
- Với bản tải xuống: giải nén, mở terminal trong thư mục có README này, chạy `python3 -m http.server 8000`, rồi mở `http://localhost:8000/` với ZIP GitHub. Với mã nguồn phát triển, mở `http://localhost:8000/dist/`.
- Không mở `index.html` bằng file:// vì trình duyệt chặn ES modules.
- ZIP GitHub đã có index.html ở gốc: dùng preset Other trên Vercel, không cần lệnh build, thư mục xuất bản là gốc. Mã nguồn phát triển dùng dist/. Chơi khách không cần database; đăng nhập, lưu và admin dùng Supabase đã cấu hình.
- Cần trình duyệt hỗ trợ WebGL và JavaScript. Thư viện Three.js được đóng gói tại chỗ, game không tải tài nguyên từ CDN lúc chơi.

## Điều khiển
| Thao tác | Máy tính | Điện thoại / máy tính bảng |
| --- | --- | --- |
| Di chuyển | WASD hoặc phím mũi tên | Cần cảm ứng góc trái |
| Tương tác | E hoặc nút trên màn hình | Nút hành động góc phải |
| Nhật ký | J hoặc nút Nhật ký | Nút Nhật ký phía trên |
| Tạm dừng | Esc hoặc nút Ⅱ | Nút Ⅱ |
| Gợi ý | Nút Gợi ý trong nhiệm vụ | Nút Gợi ý trong nhiệm vụ |
| Âm thanh | Nút ♫ | Nút ♫ |

Khi đến gần điểm sáng, nhãn hành động hiện ra. Trong hội thoại, nhấn nút để chọn. Chọn chưa phù hợp sẽ được giải thích và thử lại, không bị trừ điểm. Nhạc và âm thanh mặc định bật sau lần bấm vào game đầu tiên. Game tự tạm dừng khi chuyển tab; trên điện thoại có thể chơi dọc hoặc ngang.

## Chương 1 — Hành trình và lời giải dành cho phụ huynh
### Chặng 1 — Khu rừng thì thầm
- Chu quan sát bụi quả tím: chọn không hái, không nếm và hỏi bố.
- Tìm dấu chân ba ngón và chiếc lá bị gặm.
- Dừng trước suối: chọn nhờ bố đi cùng qua cầu có lan can.
- Quan sát mảnh vỏ trứng có đốm xanh bên kia suối.
- Đến cổng hang ở cuối đường. Chỉ đi tiếp khi hoàn thành các khám phá.
- Huy hiệu: **Biết quan sát**.

### Chặng 2 — Hang ánh sáng
- Hang là khu tham quan có đường đánh dấu; chọn ở cạnh bố, kiểm tra đèn và đường đi.
- Khi đèn có vấn đề: đứng ở vị trí an toàn cạnh bố và báo cho bố.
- Đọc đủ ba bia đá; mở cửa theo thứ tự **Lá cây → Dấu chân → Mặt trời**.
- Các biểu tượng được ghi lại trong nhật ký. Chọn sai có thể thử lại biểu tượng đó.
- Huy hiệu: **Biết bình tĩnh**.

### Chặng 3 — Thung lũng bị lãng quên
- Quan sát khủng long ở sau hàng rào; không đến gần, chạm vào hoặc cho ăn.
- Khi khát, dùng nước uống đã chuẩn bị, không uống nước hồ chỉ vì nhìn trong.
- Đối chiếu bản đồ và theo đường có biển cùng bố, không tự đi đường tắt hoặc tách đoàn.
- Phát hiện quả trứng: báo cô kiểm lâm cùng bố, không tự nhặt mang về.
- Huy hiệu: **Biết tôn trọng**.

### Chặng 4 — Đường về tổ ấm
- Cô kiểm lâm phụ trách xe chở trứng. Chu và bố nghỉ chân, uống nước và kiểm tra đường đi.
- Khi có mưa giông, chọn theo người lớn đến nhà nghỉ được chỉ dẫn.
- Vào điểm nghỉ cùng đoàn, chỉ tiếp tục khi người phụ trách hướng dẫn.
- Nhận ra tổ từ hoa văn **đốm xanh** và báo cô kiểm lâm.
- Chu và bố đứng ở điểm quan sát; cô kiểm lâm đưa trứng về tổ. Khủng long con xuất hiện ở cảnh kết.
- Huy hiệu: **Biết hợp tác**.

## Định hướng giáo dục
Tinh thần của game là tò mò, biết quan sát, dừng lại khi chưa chắc và nhờ người lớn tin cậy đi cùng. Các thông điệp được đưa vào tình huống, lựa chọn và nhật ký, thay vì phạt trẻ khi chọn sai.

Bối cảnh khủng long và khu bảo tồn là hư cấu. Chu không tự xuống suối, đẩy cây, vào hang lạ, tiếp cận động vật hoặc tự chuyển trứng. Các ví dụ trong game không thay thế giám sát của người lớn và hướng dẫn tại địa điểm ngoài đời.

## Lưu tiến trình — Google / Supabase
- **Cần chạy schema.sql và bật Google trước khi lưu trực tuyến.** Xem hướng dẫn chi tiết trong [SUPABASE_SETUP.md](SUPABASE_SETUP.md).
- Chưa đăng nhập: chơi tạm trong bộ nhớ, không lưu trên máy. Thoát hoặc tải lại sẽ mất tiến trình; có nhắc khi bấm Thoát.
- Đăng nhập Google: lưu nhiệm vụ, vị trí, nhật ký, huy hiệu và chặng lên tài khoản; có thể tiếp tục trên thiết bị khác.
- Đăng nhập mở cửa sổ riêng để giữ hành trình khách. Có bản lưu cũ thì người chơi chọn bản muốn giữ.
- Đồng bộ sau nhiệm vụ và mỗi 15 giây. Khi lỗi mạng hoặc SQL chưa cấu hình, game báo chưa lưu và cho thử lại.
- Bốn chặng hiện tại đều thuộc **Chương 1: Quả trứng thất lạc**.

## Đã có trong phiên bản này
- 4 khu vực 3D khác nhau: rừng, hang, thung lũng, đường núi có điểm trú.
- Chu, bố đồng hành, cô kiểm lâm, khủng long lớn và khủng long con.
- Chuyển động chân tay của Chu; bố có khớp hông, gối, vai và khuỷu tay, bước theo tốc độ di chuyển, đánh tay và trở về tư thế nghỉ. Cô kiểm lâm cũng có bước chân.
- Cảnh nền mở rộng với địa hình tròn lớn, đồi xa, cây nền và sương; dòng suối kéo dài, đường mòn uốn nhẹ, không còn mép nền chữ nhật lộ ra trong khung nhìn chơi thông thường.
- Cây rung, nước, đom đóm, đèn hang và mưa.
- 19 khám phá bắt buộc, các tình huống lựa chọn và câu đố biểu tượng.
- Nhật ký lưu các điều đã học, 4 huy hiệu và gợi ý bằng cột sáng.
- Điểm chặn ở suối, cửa hang và chặng mưa để không vượt nhiệm vụ an toàn.
- Giao diện bàn phím/cảm ứng, hội thoại có thể cuộn trên màn hình nhỏ, tạm dừng và chơi lại.
- Mở đầu bằng hai trang kể chuyện và cảnh kết có gia đình khủng long.
- Nhạc nền nhẹ, tiết tấu chậm; tiếng chim từng đợt, tiếng suối tăng theo khoảng cách và tiếng mưa theo cảnh. Tất cả được tổng hợp bằng Web Audio tại thiết bị, không tải bản ghi âm bên ngoài. Chưa có giọng đọc.

## Kiểm tra đã thực hiện
- Kiểm tra cú pháp JavaScript và đường dẫn tài nguyên tại chỗ.
- Bản 1.2: dựng âm thanh PCM stereo ngoại tuyến để kiểm tra tín hiệu, không clipping, nút tắt, ngưng khi rời trang và phát lại. Chưa nghe thử trực tiếp trên điện thoại.
- Chạy toàn bộ hành trình 4 chặng trong môi trường giả lập DOM và renderer.
- Kiểm tra từng mục tiêu có đường tiếp cận qua bản đồ va chạm.
- Kiểm tra lựa chọn sai không mở chốt, suối/hang/mưa chỉ mở sau lựa chọn phù hợp, câu đố đúng/sai, chuyển chặng, lưu đầu chặng, kết thúc, nhật ký, chơi lại và điều khiển bàn phím.
- Tích hợp đọc tiến trình WebMCP có kiểm tra đầu vào trong ngữ cảnh giả lập, chưa kiểm chứng bằng trình duyệt hỗ trợ API này.
- **Chưa kiểm chứng giao diện bằng trình duyệt đồ họa thật hoặc hiệu năng trên iPhone/Android.** Cần chơi thử để chỉnh góc nhìn, độ mượt, độ dễ đọc và thời lượng.

## Giới hạn và hướng điều chỉnh
- Mô hình low-poly được dựng từ hình khối; chưa có rig/skinning hay animation nhân vật chuyên nghiệp.
- Cảnh mở đầu là các trang chữ trong game; chưa có tranh minh họa truyện tranh.
- Không có nhảy, leo, chiến đấu, điểm sức khỏe, điều khiển camera tự do hay mô phỏng vật lý toàn phần.
- Người lớn đi theo bằng chuyển động đơn giản; có thể còn chỗ giao nhau với mô hình hoặc địa hình.
- Câu hỏi được viết theo hướng dễ hiểu; độ tuổi và mức đọc phù hợp cần được phụ huynh đánh giá khi chơi thử.
- Chưa có âm thanh đọc lời thoại, chế độ chữ lớn riêng hoặc kiểm tra sư phạm với trẻ.
- Ưu tiên điều chỉnh tiếp: trải nghiệm cảm ứng, độ dài lời thoại, mật độ tình huống, chất lượng mô hình và giọng đọc.

## Cấu trúc mã nguồn
- `dist/index.html`: giao diện tiếng Việt.
- `dist/style.css`: bố cục máy tính/điện thoại.
- `dist/game.js`: dựng cảnh, nhân vật, bốn chặng, nhiệm vụ, điều khiển và lưu tiến trình.
- `dist/audio.js`: nhạc nền, chim, suối, mưa, bật/tắt và tạm ngưng âm thanh.
- `dist/vendor/`: Three.js 0.180.0 được đóng gói tại chỗ.
- `licenses/THREE-LICENSE.txt`: giấy phép MIT của Three.js.
- `README.md`: hướng dẫn, giới hạn và nhật ký phiên bản.

## Nhật ký phiên bản
- **0.1 — 2026-10-04:** đoạn thử khu rừng, ba dấu vết, cầu cây và quả trứng.
- **0.2 — 2026-10-04:** bỏ hành động đẩy cây; thêm bố, cầu có lan can và lời nhắc an toàn trước suối.
- **1.0 — 2026-10-04:** mở rộng bốn chặng, các lựa chọn giáo dục, câu đố hang, cô kiểm lâm đưa trứng về tổ, nhật ký, huy hiệu, gợi ý và lưu đầu chặng.

- **1.1 — 2026-10-04:** tạo khớp và chu kỳ bước đi cho bố/cô kiểm lâm; bố quay theo hướng di chuyển thực tế, dừng thì ngừng bước; mở rộng nền cảnh và thêm lớp đồi/cây xa, kéo dài dòng suối, thay đường mòn thẳng bằng đường cong. Ranh giới di chuyển an toàn của nhiệm vụ vẫn được giữ.

## Âm thanh — 1.2
- Nhạc nền giai điệu chậm khoảng 64 nhịp/phút, âm sắc mềm, có lớp hợp âm và tiếng vang nhẹ.
- Rừng/thung lũng: chim hót thành từng đợt ngắn với khoảng nghỉ và vị trí stereo thay đổi.
- Suối: tiếng nước gồm nền róc rách và các bọt nước nhỏ; càng gần nước càng rõ.
- Hang: tắt tiếng chim và suối, giảm nhạc. Khi mưa: thêm tiếng mưa nhẹ.
- Nút Nhạc & âm thanh bật/tắt toàn bộ. Âm thanh chỉ khởi tạo sau thao tác của người chơi theo yêu cầu trình duyệt.
- Tự tạm ngưng khi rời tab/ứng dụng; giảm nhạc khi đọc hội thoại.
- Đây là âm thanh tổng hợp nguyên bản, không phải bản thu thực địa hoặc bài nhạc có sẵn. Không cần thêm file MP3, internet tải âm thanh hoặc giấy phép bản ghi bên ngoài.

- **1.2 — 2026-10-04:** thêm nhạc nền, tiếng chim, suối theo khoảng cách và tiếng mưa; bật sau thao tác đầu tiên, nút bật/tắt và tự ngưng khi rời trang.

## Khủng long và lối hang — 1.3
- Thung lũng có 7 khủng long với kích thước và màu sắc khác nhau.
- Mỗi con có chu kỳ riêng: đi chậm, dừng, cúi cổ ăn cỏ, nhai rồi ngẩng đầu và đi trở lại. Chân chuyển động luân phiên, đuôi đung đưa.
- Đàn đi trong khu vực quan sát riêng, không thay đổi các nhiệm vụ về giữ khoảng cách với động vật.
- Khủng long mẹ và con ở cảnh kết có cử động nhẹ tại chỗ.
- Cổng vào hang và khung cửa cuối hang chuyển thành vòm đá bất quy tắc, có mảng rêu, dây leo, đèn và ánh sáng trong hang.
- **1.3 — 2026-10-05:** bổ sung đàn khủng long, chu kỳ đi/ăn cỏ và thay cổng chữ nhật bằng vòm hang đá.

## Sửa font tiếng Việt — 1.4
Thống nhất Noto Sans hỗ trợ tiếng Việt cho tiêu đề, hội thoại và nút. Font được đóng gói trong `dist/fonts/` (đủ Latin, Latin mở rộng và tiếng Việt, trọng lượng 400/700), không phụ thuộc font trên máy người chơi hoặc Google Fonts khi chạy game. Tăng chiều cao dòng ở tiêu đề để dấu không bị cắt. Chuẩn hóa nội dung Unicode NFC.
Giấy phép font: `licenses/NOTO-SANS-OFL.txt` (SIL Open Font License).
- **1.4 — 2026-10-05:** sửa dấu tiếng Việt bị lệch ở tiêu đề; đóng gói font và cập nhật mã phiên bản tải tài nguyên.

## Mới trong 1.4 — Ủng hộ tự nguyện
- Nút ♡ Ủng hộ ở góc phải; mở bảng sẽ tạm dừng game. Đóng bằng × hoặc Esc sẽ quay lại đúng trạng thái chơi/hội thoại trước đó.
- Chọn 20.000đ, 50.000đ, 100.000đ hoặc nhập số nguyên từ 1.000 đến 999.999.999 đồng (chỉ nhập chữ số).
- VietQR tự cập nhật số tiền và nội dung `Ung ho game Chu`. Người nhận: NGUYEN HOANG VINH, Vietcombank, tài khoản 0111000182684; thông tin được đối chiếu từ QR gốc chủ game cung cấp.
- QR được tạo ngay trên thiết bị, không gọi dịch vụ QR bên ngoài; không lưu thông tin thanh toán, không xác nhận giao dịch hoặc mở khóa nội dung trả phí.
- Cấu hình người nhận và nội dung nằm trong `dist/donate.js`. Nếu thay tài khoản, cần kiểm tra lại QR trước khi phát hành.
- Thư viện QR: qrcode-generator của Kazuhiko Arase, MIT; mã và thông báo bản quyền tại `dist/vendor/qrcode.mjs`, giấy phép tại `licenses/QRCODE-LICENSE.txt`.
- Đã giải mã độc lập 6 QR (ba mức gợi ý, mức tùy ý và hai biên), đối chiếu tài khoản/ngân hàng/nội dung/số tiền và CRC QR gốc; kiểm tra từ chối số không hợp lệ. Chưa thực hiện chuyển khoản thực tế bằng ứng dụng ngân hàng. Chưa kiểm tra giao diện mới trên thiết bị/GPU thật.

## Điều chỉnh giao diện 1.4.1
- Nút Ủng hộ nằm cuối cùng hàng Nhật ký / Âm thanh / Tạm dừng. Điện thoại dùng biểu tượng trái tim cùng hàng để tiết kiệm chỗ.
- QR mở trong hộp nhỏ rộng tối đa 320px phía bên phải dưới hàng nút; không phủ nền, làm mờ hay chiếm toàn màn hình. QR rộng 176px.
- Đóng bằng nút ×, Esc, bấm lại Ủng hộ hoặc bấm ngoài hộp. Game giữ nguyên trạng thái trước khi mở.
- Giữ các mức tiền, số tiền tùy chọn, tài khoản và nội dung QR của 1.4.

## Sửa giao diện QR 1.4.2
- Sửa nguyên nhân QR đè lên lựa chọn tiền: CSS canvas toàn cục đã được giới hạn cho canvas 3D trong #view.
- Giữ ảnh mẫu người dùng cung cấp tại dist/images/vietqr-card.png: VietQR, NAPAS 247, Vietcombank, tên và tài khoản. Mã QR và dòng số tiền cập nhật trên vùng riêng trong thẻ ảnh, không tràn ra ngoài.
- Số tiền không hợp lệ sẽ ẩn toàn bộ thẻ để tránh quét nhầm mã gốc 20.000đ. Bảng vẫn nhỏ bên phải, nội dung dài cuộn trong bảng.

## Bản 1.5 — 2026-10-05
Thêm đăng nhập Google, hồ sơ người chơi, lưu Supabase với phân quyền từng tài khoản, nhắc khách khi thoát và bảo vệ bản lưu khi chơi nhiều thiết bị. Các file cấu hình: dist/supabase-config.js, dist/cloud-save.js, dist/auth-callback.html; database: schema.sql. Trang admin chương/nhạc và các chương mới chưa nằm trong lần cập nhật này.

Kiểm tra mới: schema chạy lại được; PostgreSQL giả lập xác nhận RLS, chặn truy cập chéo và kiểm tra revision; game khôi phục nhiệm vụ và trạng thái an toàn. Google thật và SQL dự án thật cần được kiểm tra sau khi chủ game thiết lập.

## Bản 1.6 — Trang mở đầu và quản trị
Vào game thấy nhật ký hành trình với Chương 1 và các chương tương lai Sắp ra mắt, không tự vào Chương 1. Admin: admin.html. Hướng dẫn [README_ADMIN.md](README_ADMIN.md). Chạy admin-schema.sql sau schema.sql và cấp quyền cho UUID tài khoản Google của bạn.
Quản lý trang đầu, chương, lịch mở, tên chặng, nhạc/âm lượng; tìm người đăng ký và xuất CSV; lưu nháp, xem trước, xuất bản, khôi phục lịch sử. Chương giới thiệu chưa có gameplay. Du, bản đồ rộng và các chương mới vẫn là hướng phát triển tiếp theo.

## Bản 1.6.1 — Giao diện dành cho người chơi
- Bỏ liên kết Quản trị trên trang mở đầu; chủ game truy cập trực tiếp admin.html.
- Thông báo lỗi đăng nhập, hồ sơ và lưu game chỉ hướng dẫn người chơi thử lại, kiểm tra kết nối và giữ trang mở để tránh mất tiến trình; không hiển thị hướng dẫn SQL, Supabase hoặc README.
- Giữ nguyên đăng nhập và kiểm tra quyền trên trang admin. Không cần chạy thêm SQL.

## Bản 1.7 — Bốn chương có nội dung chơi

- Chương 1 giữ 4 chặng cũ. Chương 2–4 thêm 12 chặng, tổng 36 hoạt động mới: di chuyển tìm điểm quan sát, đọc và ghi nhật ký, chọn hành vi, ghép chuỗi ký hiệu, huy hiệu và kết thúc riêng.
- Du xuất hiện từ Chương 2, có bước đi và đi cùng Chu, bố. Các tuyến mới dài khoảng 95 đơn vị so với khoảng 47 đơn vị của tuyến cũ, cảnh quan có núi, rừng, sông uốn lượn, cỏ và chim chuyển động. Đây là các chặng riêng, chưa phải thế giới mở liền mạch.
- Chương 4 có 5 dáng khủng long cách điệu: Diplodocus, Triceratops, Stegosaurus, Ankylosaurus và Iguanodon; 8 cá thể trong mỗi chặng của công viên. Đi tới lui và cúi ăn cây lá. Xem SOURCES.md về cơ sở kiến thức và giới hạn mô hình.
- Mỗi chương lưu trong một dòng tiến trình riêng; bản lưu Chương 1 được giữ. Trong bảng tài khoản, chọn chương muốn tiếp tục khi ở trang mở đầu. Không chuyển ô lưu khi đang chơi.
- Admin có Chơi thử chương: yêu cầu đăng nhập và quyền admin; chế độ này không tự lưu tiến trình và không xuất bản cấu hình. Khách không có nút hoặc thông tin quản trị trên giao diện.
- Bỏ chữ “Dự kiến” khỏi lời giới thiệu mặc định. Trạng thái “Sắp ra mắt” vẫn dùng cho chương chưa mở. Không tự xuất bản dữ liệu quản trị.

### Nâng cấp từ bản đã thiết lập admin
1. Giải nén ZIP và thay các file ở gốc repository GitHub (index.html nằm ngay ở gốc). Giữ nguyên domain Vercel đang dùng, không phải đổi Google callback khi domain không đổi. Không đưa cả thư mục ZIP bao ngoài vào repository.
2. Chạy `chapters-upgrade.sql` trong SQL Editor của Supabase một lần (có thể chạy lại an toàn). Chỉ mở rộng ô lưu tiến trình, không xóa bản lưu và không đổi trạng thái chương.
3. Vào `admin.html`, bấm **Chơi thử chương** để kiểm tra. Nội dung/names chặng mới được bổ sung vào trình chỉnh sửa khi đọc cấu hình cũ.
4. Khi sẵn sàng, đặt chương muốn mở thành **Mở** hoặc **Hẹn lịch mở**, rồi **Xuất bản vào game**. Chỉ lưu nháp thì khách chưa nhận trạng thái mới. Chương 2–4 chưa có dấu phiên bản nội dung mới trong cấu hình cũ sẽ tiếp tục bị chặn cho đến lần xuất bản này, kể cả trước đó đã đặt Mở.
5. Nếu tùy chỉnh lời giới thiệu trước đây, nội dung tùy chỉnh được giữ; sửa lại trong admin rồi xuất bản. Các mô tả mặc định cũ bắt đầu bằng “Dự kiến:” được thay bằng lời giới thiệu mới.

Cài mới: chạy schema.sql rồi admin-schema.sql; cấu hình Google và quyền admin theo README_ADMIN.md. Bản schema.sql mới đã hỗ trợ 4 chương.

### Kiểm chứng và giới hạn
- Đã chạy mô phỏng đủ 16 chặng với Three.js, kiểm tra đường đến nhiệm vụ, đáp án sai/đúng, ghép chuỗi, khôi phục từng chương, khóa chương và nhân vật/động vật.
- PostgreSQL mô phỏng: SQL chạy lại, lưu độc lập 4 chương, xung đột phiên bản, cách ly người chơi và quyền admin.
- Chưa kiểm thử hình ảnh GPU trên trình duyệt thật hoặc Google/Supabase trực tiếp của chủ game. Chủ game nên chơi thử trên máy tính và điện thoại trước khi mở chương cho khách.
- Mini-game ghép chuỗi đang làm sẽ bắt đầu lại khi tải lại; các nhiệm vụ đã hoàn thành vẫn được lưu. Khách chưa đăng nhập không lưu tiến trình.
