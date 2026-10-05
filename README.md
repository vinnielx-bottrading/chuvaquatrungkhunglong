# Chu và Quả Trứng Thất Lạc

## Phiên bản 1.4.1 — Bản đầu để chơi và điều chỉnh
Game khám phá 3D low-poly bằng tiếng Việt, dành cho trẻ chơi cùng phụ huynh. Chu đọc truyện khủng long, nhận ra một ngọn núi quen thuộc, xin phép và cùng bố lên đường. Trẻ tập quan sát, giải câu đố, nhận biết tình huống nguy hiểm và nhờ người lớn hỗ trợ.

Bản 1.4 có một hành trình hoàn chỉnh gồm 4 chặng. Thời lượng thiết kế hướng tới khoảng 10–15 phút khi đọc và khám phá; chưa đo thời gian chơi với trẻ thực tế, người chơi biết đáp án có thể hoàn thành nhanh hơn.

## Chơi trực tiếp và chạy bản tải về
- Chơi ở đường dẫn bản game được gửi cùng file.
- Với bản tải xuống: giải nén, mở terminal trong thư mục có README này, chạy `python3 -m http.server 8000`, rồi mở `http://localhost:8000/`.
- Không mở `index.html` bằng file:// vì trình duyệt chặn ES modules.
- Muốn đưa lên hosting tĩnh, dùng thư mục thư mục gốc làm thư mục xuất bản. Không cần build, database hoặc API key.
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

## Hành trình và lời giải dành cho phụ huynh
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

## Lưu tiến trình
- Tự lưu **đầu mỗi chặng** vào localStorage của trình duyệt trên thiết bị hiện tại.
- Mở lại game có lựa chọn tiếp tục từ đầu chặng đã lưu hoặc bắt đầu chuyến đi mới.
- Đóng trang giữa chặng sẽ phải chơi lại chặng đó; các ghi chú và huy hiệu của các chặng trước được giữ.
- Không có tài khoản và không đồng bộ giữa điện thoại, máy tính hoặc trình duyệt khác nhau.
- Chơi lại từ đầu có bước xác nhận và thay tiến trình cũ trên thiết bị đó.
- Nếu trình duyệt chặn lưu trữ, game báo và vẫn cho chơi tiếp.

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
- `index.html`: giao diện tiếng Việt.
- `style.css`: bố cục máy tính/điện thoại.
- `game.js`: dựng cảnh, nhân vật, bốn chặng, nhiệm vụ, điều khiển và lưu tiến trình.
- `audio.js`: nhạc nền, chim, suối, mưa, bật/tắt và tạm ngưng âm thanh.
- `vendor/`: Three.js 0.180.0 được đóng gói tại chỗ.
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
Thống nhất Noto Sans hỗ trợ tiếng Việt cho tiêu đề, hội thoại và nút. Font được đóng gói trong `fonts/` (đủ Latin, Latin mở rộng và tiếng Việt, trọng lượng 400/700), không phụ thuộc font trên máy người chơi hoặc Google Fonts khi chạy game. Tăng chiều cao dòng ở tiêu đề để dấu không bị cắt. Chuẩn hóa nội dung Unicode NFC.
Giấy phép font: `licenses/NOTO-SANS-OFL.txt` (SIL Open Font License).
- **1.4 — 2026-10-05:** sửa dấu tiếng Việt bị lệch ở tiêu đề; đóng gói font và cập nhật mã phiên bản tải tài nguyên.

## Mới trong 1.4 — Ủng hộ tự nguyện
- Nút ♡ Ủng hộ ở góc phải; mở bảng sẽ tạm dừng game. Đóng bằng × hoặc Esc sẽ quay lại đúng trạng thái chơi/hội thoại trước đó.
- Chọn 20.000đ, 50.000đ, 100.000đ hoặc nhập số nguyên từ 1.000 đến 999.999.999 đồng (chỉ nhập chữ số).
- VietQR tự cập nhật số tiền và nội dung `Ung ho game Chu`. Người nhận: NGUYEN HOANG VINH, Vietcombank, tài khoản 0111000182684; thông tin được đối chiếu từ QR gốc chủ game cung cấp.
- QR được tạo ngay trên thiết bị, không gọi dịch vụ QR bên ngoài; không lưu thông tin thanh toán, không xác nhận giao dịch hoặc mở khóa nội dung trả phí.
- Cấu hình người nhận và nội dung nằm trong `donate.js`. Nếu thay tài khoản, cần kiểm tra lại QR trước khi phát hành.
- Thư viện QR: qrcode-generator của Kazuhiko Arase, MIT; mã và thông báo bản quyền tại `vendor/qrcode.mjs`, giấy phép tại `licenses/QRCODE-LICENSE.txt`.
- Đã giải mã độc lập 6 QR (ba mức gợi ý, mức tùy ý và hai biên), đối chiếu tài khoản/ngân hàng/nội dung/số tiền và CRC QR gốc; kiểm tra từ chối số không hợp lệ. Chưa thực hiện chuyển khoản thực tế bằng ứng dụng ngân hàng. Chưa kiểm tra giao diện mới trên thiết bị/GPU thật.

## Điều chỉnh giao diện 1.4.1
- Nút Ủng hộ nằm cuối cùng hàng Nhật ký / Âm thanh / Tạm dừng. Điện thoại dùng biểu tượng trái tim cùng hàng để tiết kiệm chỗ.
- QR mở trong hộp nhỏ rộng tối đa 320px phía bên phải dưới hàng nút; không phủ nền, làm mờ hay chiếm toàn màn hình. QR rộng 176px.
- Đóng bằng nút ×, Esc, bấm lại Ủng hộ hoặc bấm ngoài hộp. Game giữ nguyên trạng thái trước khi mở.
- Giữ các mức tiền, số tiền tùy chọn, tài khoản và nội dung QR của 1.4.

## GitHub
Tải toàn bộ nội dung ZIP vào gốc repository, index.html ở gốc. GitHub Pages chọn main, /(root). Không cần build.
