# I. Hướng dẫn nhúng webphone vào ứng dụng CRM của doanh nghiệp

**1. Chức năng của webphone**
- Là một webphone dựa trên mã nguồn mở javascript.
- Công nghệ sử dụng WebRTC chạy trực tiếp trên trình duyệt (Chrome/Firefox/Edge/CocCoc/Safari), không cần cài đặt thêm
  softphone ngoài.
- Thực hiện gọi ra Click-to-call trên webphone
- Tiếp nhận cuộc gọi vào trên webphone
- Hỗ trợ popup thông tin khách hàng khi có cuộc gọi đến

**2. Hướng dẫn tích hợp**

**Bước 1: Yêu cầu Alohub khởi tạo thông tin tài khoản**

Bộ tham số cung cấp gồm có:
| STT | Tên tham số         | Mô tả                                                                    | Chú thích |
|-----|---------------------|--------------------------------------------------------------------------|------|
| 1   | txtDomain           | Địa chỉ API endpoint, ví dụ: **https://domain.com/api/**                 |Chỉ dùng khi tích hợp API, nếu nhúng jsphone thì không cần)
| 2   | txtApiKey           | Key tích hợp, ví dụ **kjlkjkdshlfjdslkj@#!23**                           |Chỉ dùng khi tích hợp API, nếu nhúng jsphone thì không cần
| 3   | txtWebsocketServerUrl | Địa chỉ socket server, ví dụ **wss://alohub.vn:7443**                  |Bắt buộc
| 4   | txtPassword         | Mật khẩu                                                                 |Bắt buộc
| 5   | txtDisplayName      | Tên hiển thị của máy lẻ, ví dụ **Sale 1000**                             |Tùy chọn
| 6   | txtPublicIdentity   | Địa chỉ của máy lẻ, ví dụ **sip:1000@alohub.vn:5060**                    |Bắt buộc


**Bước 2: Tải mã nguồn và demo**
- Sử dụng package mã nguồn: demo-js-new
- Có thể chạy thử demo trên local hoặc demo online tại: https://app.alohub.vn/jsphonev10.0/index.html

**Bước 3: Hướng dẫn lập trình**
- Import các lib javascript vào ứng dụng CRM của doanh nghiệp, các lib này được đóng gói trong mã nguồn cung cấp (trong
  đó sipjs.js là file js chứa các hàm Alohub định nghĩa sẵn để hỗ trợ thông báo, xử lý giao diện, tương tác tuỳ theo nhu
  cầu của từng CRM)

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

- Sau khi kết nối thành công với tổng đài, ngay lúc này đã có thể nhận và gọi điện tới khách hàng. Các hàm dùng để tương
  tác với webphone:

| STT | Hàm                 | Mô tả                                                                    |
|-----|---------------------|--------------------------------------------------------------------------|
| 1   | startRingTone();    | Dùng để chạy âm thanh                                                    |
| 2   | stopRingTone();     | Dùng để dừng âm thanh                                                    |
| 3   | stopRingbackTone(); | Dùng để dừng âm thanh khi đổ chuông                                      |
| 4   | onTogglePhone();    | Mở đóng form                                                             |
| 5   | saveCredentials();  | Lưu thông tin đăng nhập                                                  |
| 6   | loadCredentials();  | Lấy thông tin đăng nhập từ localStorage                                  |
| 7   | onCall();           | Thực hiện cuộc gọi thông tin số điện thoại lấy từ form  alohub_call_dial |
| 8   | onAnswer();         | Thực hiện kết nối cuộc gọi                                               |
| 9   | onHangUp();         | Kết thúc cuộc gọi                                                        |
| 10  | alohubMakeCall();   | Kết nối cuộc gọi sử dụng API                                             |

**Chú ý:**
- Tất cả các hàm dưới đây đều phải được implement để đảm bảo tính đúng đắn của chương trình
- Các hàm này đã được để trong file sipjs.js

**4. Phụ lục:**

**Bảng các tham số cấu hình được sử dụng**
| STT | Name         | Mô tả                                                                                                 |
|-----|--------------|-------------------------------------------------------------------------------------------------------|
| 1   | isAutoAnswer | Nếu muốn hệ thống tự bắt máy thì 1 và ngược lại (mặc định 1)                                          |
| 2   | usingCallJs  | Hệ thống có 2 option gọi ra cho khách hàng: sử dụng JSPhone(1) và sử dụng API makeCall(0). Mặc định 0 |

**Bảng mã lỗi khi gọi ra sử dụng API**
| STT | Error Code                    | Sip Code                                         | Mô tả                                                                                                                |
|-----|-------------------------------|--------------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| 1   | IPCC\_NOT\_CONNECT\_CUSTOMER  | 404                                              | Không kết nối được đến số thuê bao                                                                                   |
| 2   | 486                           | Khách hàng đang bận                              |
| 3   | 408                           | Khách hàng không nghe máy hoặc có lỗi xảy ra     |
| 4   | 403                           | Đầu số này chưa được thanh toán cước             |
| 5   | 487                           | Khách hàng không nghe máy                        |
| 6   | 480                           | Thuê bao khách hàng tạm thời không liên lạc được |
| 7   | Các mã khác                   | Có lỗi xảy ra                                    |
| 8   | IPCC\_NOT\_CONNECT\_AGENT\_ID |                                                  | Không thể kết nối được đến thiết bị nghe gọi của tư vấn viênkiểm tra lại IP Phone/SoftPhone và đường truyền Internet |
| 9   | CALLOUT\_AGENT\_BUSY          |                                                  | Mã trả về 786 - Busy. Vui lòng đăng xuất và đăng nhập lại để tiếp tục sử dụng.                                       |
| 10  | CALLOUT\_PERMISSION\_DENY     |                                                  | Không có quyền gọi ra. Liên hệ Admin để cấu hình                                                                     |
| 11  | ERROR\_CALLOUT\_CONNECT       |                                                  | Có lỗi xảy ra                                                                                                        |
