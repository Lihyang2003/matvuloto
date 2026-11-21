# Mật Vụ Lô Tô 🧧

Game lô tô Tết chơi trên trình duyệt, kiểu đấu trí như Goose Goose Duck. Mỗi trận chia làm **2 đội bí mật**: bạn làm nhiệm vụ để nhận số, mang số của đội về kho, đem giấu số của đối thủ, và dùng ám hiệu để nhận ra đồng đội. Đội nào cất đủ 5 số vào kho trước thì **KINH!**

▶ **Chơi online:** https://lihyang2003.github.io/matvuloto/

⬇ **Tải bản chơi offline:** [download/MatVuLoTo.zip](https://lihyang2003.github.io/matvuloto/download/MatVuLoTo.zip). Giải nén rồi bấm đúp `MatVuLoTo.html` (nên mở bằng Chrome hoặc Edge). Không cần mạng, không cần cài đặt.

## Luật chơi
1. **Đội bí mật.** Khi trận bắt đầu, người chơi được chia ngẫu nhiên vào Đội Đỏ hoặc Đội Xanh. Bạn chỉ biết đội của mình.
2. **Tờ vé.** Bấm vào dãy số đội ở góc trái để mở vé. Vé có gợi ý về 5 số của đội (vd: *Năm Đinh Mùi · Phát tài phát lộc*) và **ám hiệu** của đội (vd: nhảy lên 2 lần).
3. **Nhiệm vụ.** Đi tới các chấm vàng trên bản đồ để làm nhiệm vụ. Xong nhiệm vụ bạn nhận 1 số; game chỉ báo số đó có thuộc dãy của đội bạn hay không. Nhiệm vụ chung (Gói bánh chưng) cần ít nhất một nửa số người trong đội cùng có mặt.
4. **Mang số.** Mỗi số chỉ giữ được 60 giây và chỉ mang được tối đa 2 số lạ. Số của đội thì đem về **kho đội**; số lạ thì đem **giấu** ở một trạm nhiệm vụ. Cả hai đều làm bằng cách mở túi rồi nhấn giữ, kéo số vào ô bên phải. Hết giờ mà chưa cất thì số rơi xuống đất, ai đi ngang cũng lụm được.
5. **Quản trò hô số.** Theo thời gian đặt lúc tạo phòng, mọi người tập hợp ở sân trước. Một người được chọn nghe quản trò hô một số của đội đối thủ, và chỉ người đó nghe thấy.
6. **RÌNH!** Khi một đội đã có 4 số, cả phòng nhận cảnh báo. Đội cất đủ 5 số vào kho trước thì thắng.

Tường thì phải đi vòng qua cửa, bậc thềm trước nhà thì phải **nhảy** mới lên được. Mic hoạt động theo khoảng cách: đứng gần thì nghe rõ, ra xa thì nhỏ dần (bản prototype mô phỏng bằng bong bóng chữ).

## Điều khiển
| Hành động | Bàn phím | Màn hình cảm ứng / chuột |
|---|---|---|
| Di chuyển | ← ↑ → ↓ hoặc W A S D | Kéo joystick |
| Nhảy · Ngồi | Space · C | Nút **NHẢY** · **NGỒI** |
| Làm nhiệm vụ / cất / giấu | F | Thẻ hành động hiện ra khi đứng ở trạm hoặc kho |
| Lụm số rơi | E | Nút **LỤM** |
| Túi · Vé · Bản đồ · Mic · Tạm dừng | B · T · M · V · Esc | Nút túi · dãy số đội · minimap · mic · bánh răng |

## Các màn có trong game
Splash, Onboard, Đăng nhập, Đăng ký, Hướng dẫn, Sảnh chính, Nhân vật (12 con giáp và trang phục), Shop, Tạo phòng, Vào phòng bằng mã, Tìm phòng, Phòng chờ, Chia đội bí mật, Trận đấu (vé, nhiệm vụ, túi, quản trò hô số, RÌNH), Kết quả, Tổng kết, Xếp hạng, Nhiệm vụ, Hồ sơ, Bạn bè, Hộp thư, Điểm danh 7 ngày, Cài đặt.

Tiến độ chơi thử (xu, XP, cấp độ, nhân vật, đồ đã mua) được lưu trong `localStorage` của trình duyệt. Muốn chơi lại từ đầu thì vào **Cài đặt → Xoá dữ liệu chơi thử**.

## Kỹ thuật
- HTML, CSS và JavaScript thuần, không cần build. Chạy bằng một static server bất kỳ, ví dụ `python -m http.server`.
- Màn hình thiết kế ở khung 1920×1080 và tự co giãn theo cửa sổ.
- `python tools/stamp.py`: gắn mã phiên bản vào CSS/JS trong `index.html`. Chạy trước mỗi lần push để trình duyệt không giữ bản cũ.
- `python tools/collision.py`: tạo bản đồ va chạm (tường, bậc thềm) từ ảnh bản đồ.
- `python tools/ticket_frame.py`: tạo khung tờ vé lô tô dạng vector.
- `python tools/build_single.py`: đóng gói cả game thành một file HTML chơi offline và cập nhật `download/MatVuLoTo.zip`.
- Chữ tiêu đề kiểu JunkDog được chuyển sẵn thành SVG trong `js/junkdog-data.js` (đủ chữ in hoa tiếng Việt), nên repo không kèm file font.

Thiết kế gốc nằm trong file Figma của dự án.
