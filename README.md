# Demo-Embed-JS-PHONE
**Giải pháp tích hợp luồng voice giữa ứng dụng web bên thứ 3 và JS-PHONE**

1. **Mô tả các chức năng**

- Hỗ trợ các loại ứng dụng web (web app) tích hợp tổng đài thoại JS-PHONE.

- Người dùng (user) của doanh nghiệp có thể thực hiện việc tiếp nhận cuộc gọi hay gọi điện ra ra cho khách hàng thông qua số hotline.

- Popup thông tin khách hàng khi có cuộc gọi đến

- Công nghệ sử dụng WebRTC không cần cài đặt thêm phần mềm nghe gọi điện.

- Hỗ trợ tích hợp với các thiết bị nghe gọi như IP Phone, Softphone

2. **Khởi tạo**

- Cần có các thông tin cơ bản để đăng nhập như API endpoint ...
- Lấy các thông tin kết nối từ bộ phận hỗ trợ Alohub và lưu lại.

3. **Hướng dẫn tích hợp**

**Chú ý:** Toàn bộ mã nguồn Demo của việc tích hợp với hệ thống tổng đài được upload tại đây.

Sau khi tải về, giải nén và có thể chạy thử demo.

**Bước 1: Lấy thông tin đăng nhập vào hệ thống**

- Khi agent đăng ký hệ thống sẽ cung cấp các thông tin để truy cập.

**Bước 2: Lập trình tích hợp tiếp nhận cuộc gọi JSPhone vào CRM**

- Import các lib javascript đã được VCC cung cấp sẵn vào CRM (trong đó sipjs.js là file js chứa các hàm Alohub định nghĩa sẵn để hỗ trợ thông báo, xử lý giao diện, tương tác tuỳ theo nhu cầu của từng CRM)

       <script src="jssip-3.10.0.min.js" type="text/javascript"></script>
        <script src="sipjs.js" type="text/javascript"></script>

- Copy dòng sau giữa thẻ body:

        <div id="alohub_shipjs_container">
        <audio id="audio_remote" autoplay="autoplay"></audio>
        <audio id="ringtone" loop="" src="sounds/ringtone.wav"></audio>
        <audio id="ringbacktone" loop="" src="sounds/ringbacktone.wav"></audio>
        <audio id="dtmfTone" src="sounds/dtmf.wav"></audio>
        </div>
- Bạn có thể thay đổi giao diện các màn hình đăng nhập, nghe, gọi.... Mẫu như với file demo/index.html
- Lưu ý: Cần đảm bảo các id của các màn hình thay đổi giống với id trong file sipjs.js để js chạy chính xác
- Thực hiện việc kết nối với tổng đài IPCC qua hàm sau:

                onRegister();

- Hệ thống hỗ trợ 2 loại thiết bị nghe gọi:
  - Nghe gọi trên trình duyệt
  - Nghe gọi qua softphone, IP Phone

- Sau khi kết nối thành công với tổng đài, ngay lúc này đã có thể nhận và gọi điện tới khách hàng. Các hàm dùng để tương tác với hệ thống:

| STT | Hàm                 | Mô tả                                                                    |
| --- |---------------------|--------------------------------------------------------------------------|
| 1 | startRingTone();    | Dùng để chạy âm thanh                                                    |
| 2 | stopRingTone();     | Dùng để dừng âm thanh                                                    |
| 3 | stopRingbackTone(); | Dùng để dừng âm thanh khi đổ chuông                                      |
| 4 | onTogglePhone();    | Mở đóng form                                                             |
| 5 | saveCredentials();  | Lưu thông tin đăng nhập                                                  |
| 6 | loadCredentials();  | Lấy thông tin đăng nhập từ localStorage                                  |
| 7 | onCall();           | Thực hiện cuộc gọi thông tin số điện thoại lấy từ form  alohub_call_dial |
| 8 | onAnswer();         | Thực hiện kết nối cuộc gọi                                               |
| 9 | onHangUp();         | Kết thúc cuộc gọi                                                        |

**Chú ý: Tất cả các hàm dưới đây đều phải được implement để đảm bảo tính đúng đắn của chương trình**

**Các hàm này đã được để trong file sipjs.js**

Phụ lục: Bảng mã lỗi khi gọi ra

| STT | Error Code | Sip Code | Mô tả |
| --- | --- | --- | --- |
| 1 | IPCC\_NOT\_CONNECT\_CUSTOMER | 404 | Không kết nối được đến số thuê bao |
| 2 | 486 | Khách hàng đang bận |
| 3 | 408 | Khách hàng không nghe máy hoặc có lỗi xảy ra |
| 4 | 403 | Đầu số này chưa được thanh toán cước |
| 5 | 487 | Khách hàng không nghe máy |
| 6 | 480 | Thuê bao khách hàng tạm thời không liên lạc được |
| 7 | Các mã khác | Có lỗi xảy ra |
| 8 | IPCC\_NOT\_CONNECT\_AGENT\_ID |   | Không thể kết nối được đến thiết bị nghe gọi của tư vấn viênkiểm tra lại IP Phone/SoftPhone và đường truyền Internet |
| 9 | CALLOUT\_AGENT\_BUSY |   | Mã trả về 786 - Busy. Vui lòng đăng xuất và đăng nhập lại để tiếp tục sử dụng. |
| 10 | CALLOUT\_PERMISSION\_DENY |   | Không có quyền gọi ra. Liên hệ Admin để cấu hình |
| 11 | ERROR\_CALLOUT\_CONNECT |   | Có lỗi xảy ra |
