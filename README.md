# Mật Vụ Lô Tô 🧧

Game lô tô Tết chơi trên trình duyệt. Bạn chọn một trong 12 con giáp, chạy quanh nhà ngoại để lụm những quả lô tô vừa được gọi, rồi hô **KINH!** trước Đội Xanh.

▶ **Chơi ngay:** https://lihyang2003.github.io/matvuloto/

## Cách chơi
| Hành động | Bàn phím | Màn hình cảm ứng / chuột |
|---|---|---|
| Di chuyển | ← ↑ → ↓ hoặc W A S D | Kéo joystick |
| Nhảy | Space | Nút **NHẢY** |
| Lụm số | E | Nút **LỤM** (sáng lên khi đứng gần quả lô tô) |
| KINH | K / Enter | Nút **KINH!** (hiện khi vé đủ 5 số) |
| Bản đồ · Túi · Tạm dừng | M · B · Esc | Minimap · Túi · Bánh răng |

1. Vé của bạn có 5 số. Mỗi khi người gọi xướng một số trong vé, quả lô tô số đó rơi xuống sàn và hiện chấm vàng trên minimap.
2. Chạy tới quả lô tô rồi bấm **LỤM**. Quả số chưa được gọi thì không lụm được. Số đã gọi nhưng không có trong vé lụm được, mỗi quả +1 xu.
3. Đủ 5 số thì bấm **KINH!**. Thua khi hết 2:45 hoặc Đội Xanh đủ số trước.

## Các màn có trong game
Splash, Onboard, Đăng nhập, Đăng ký, Hướng dẫn, Sảnh chính, Nhân vật (12 con giáp + trang phục), Shop (Phụ kiện / Gói xu), Tạo phòng, Vào phòng bằng mã, Tìm phòng, Phòng chờ, Đếm ngược, Trận đấu, Kết quả, Tổng kết (xu và XP chạy số, có lên cấp), Xếp hạng, Nhiệm vụ, Hồ sơ, Bạn bè, Hộp thư, Điểm danh 7 ngày, Cài đặt.

Tiến độ (xu, XP, cấp độ, nhân vật, đồ đã mua) được lưu trong `localStorage` của trình duyệt. Muốn chơi lại từ đầu thì vào **Cài đặt → Xoá dữ liệu chơi thử**.

## Kỹ thuật
- HTML, CSS và JavaScript thuần, không cần build. Mở `index.html` qua một static server là chạy, ví dụ `python -m http.server`.
- Màn hình thiết kế ở khung 1920×1080 và tự co giãn theo cửa sổ.
- Font Be Vietnam Pro và Russo One tải từ Google Fonts.
- Chữ tiêu đề kiểu JunkDog được chuyển sẵn thành SVG trong `js/junkdog-data.js`, nên repo không kèm file font.
- Một số ảnh vật phẩm (xu, lì xì, trang phục) được tạo bằng Figma AI.

Thiết kế gốc nằm trong file Figma của dự án.
