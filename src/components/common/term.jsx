const Term = () => {
    return (
        <div className="term-container">
            <div className="term-header">
                <h1>Điều Khoản Sử Dụng</h1>
                <p>
                    Chào mừng bạn đến với <strong>ClickWork</strong> – nền tảng hỗ trợ tìm kiếm việc làm dành cho người dùng Việt Nam.
                </p>
                <p>
                    Trang web này là một <strong>đồ án học phần</strong> và được phát triển với mục đích học tập, không nhằm mục đích thương mại hay cung cấp dịch vụ thực tế.
                </p>
            </div>

            <div className="term-section">
                <h2>1. Chấp Nhận Điều Khoản</h2>
                <p>Bằng việc truy cập hoặc sử dụng ClickWork, bạn đồng ý với các điều khoản và điều kiện được nêu trong tài liệu này. Nếu bạn không đồng ý với bất kỳ phần nào của điều khoản, vui lòng ngừng sử dụng trang web.</p>
            </div>

            <div className="term-section">
                <h2>2. Mục Đích Sử Dụng</h2>
                <p>ClickWork được xây dựng nhằm mô phỏng chức năng của một nền tảng tuyển dụng, hỗ trợ người dùng đăng tin tuyển dụng hoặc tìm kiếm công việc một cách trực quan.</p>
                <p>Tuy nhiên, do đây là một đồ án học phần:</p>
                <ul>
                    <li>Các dữ liệu công việc, tài khoản người dùng có thể là giả lập.</li>
                    <li>Không có giao dịch thực tế, hợp đồng, hay nghĩa vụ pháp lý phát sinh từ nội dung hiển thị.</li>
                </ul>
            </div>

            <div className="term-section">
                <h2>3. Tài Khoản Người Dùng</h2>
                <p>Người dùng có thể tạo tài khoản trên ClickWork để đăng tuyển hoặc tìm việc. Bạn có trách nhiệm:</p>
                <ul>
                    <li>Cung cấp thông tin chính xác khi đăng ký.</li>
                    <li>Không sử dụng thông tin giả mạo hoặc gây hiểu lầm.</li>
                    <li>Bảo mật tài khoản và mật khẩu của mình.</li>
                </ul>
            </div>

            <div className="term-section">
                <h2>4. Quyền và Nghĩa Vụ</h2>
                <h3>4.1. Quyền của người dùng</h3>
                <ul>
                    <li>Truy cập miễn phí các chức năng của nền tảng.</li>
                    <li>Đăng bài tuyển dụng hoặc hồ sơ tìm việc (dưới dạng mô phỏng).</li>
                </ul>

                <h3>4.2. Nghĩa vụ của người dùng</h3>
                <ul>
                    <li>Không sử dụng nền tảng vào mục đích lừa đảo, quấy rối hoặc vi phạm pháp luật.</li>
                    <li>Không đăng tải nội dung phản cảm, không phù hợp với thuần phong mỹ tục Việt Nam.</li>
                    <li>Không can thiệp, phá hoại hoạt động của website.</li>
                </ul>
            </div>

            <div className="term-section">
                <h2>5. Giới Hạn Trách Nhiệm</h2>
                <p>ClickWork không chịu trách nhiệm với bất kỳ tổn thất, thiệt hại nào xảy ra do việc sử dụng hoặc không thể sử dụng nền tảng, bao gồm nhưng không giới hạn:</p>
                <ul>
                    <li>Thông tin sai lệch từ người dùng khác.</li>
                    <li>Lỗi kỹ thuật, bảo trì hoặc tấn công hệ thống.</li>
                    <li>Những hiểu lầm về tính xác thực của dữ liệu.</li>
                </ul>
            </div>

            <div className="term-section">
                <h2>6. Quyền Sở Hữu Trí Tuệ</h2>
                <p>Tất cả nội dung, thiết kế, mã nguồn thuộc quyền sở hữu của nhóm phát triển ClickWork và chỉ được sử dụng cho mục đích giáo dục, nghiên cứu.</p>
            </div>

            <div className="term-section">
                <h2>7. Sửa Đổi Điều Khoản</h2>
                <p>ClickWork có quyền chỉnh sửa nội dung điều khoản bất kỳ lúc nào để phù hợp với yêu cầu môn học hoặc cải tiến chức năng. Mọi thay đổi sẽ được thông báo rõ ràng trên website.</p>
            </div>

            <div className="term-section">
                <h2>8. Liên Hệ</h2>
                <p>Mọi thắc mắc liên quan đến điều khoản sử dụng, vui lòng liên hệ nhóm phát triển qua email: <strong>clickwork.project@gmail.com</strong></p>
            </div>

            <footer className="term-footer">
                <p>&copy; 2025 ClickWork - Đồ án học phần. Mọi quyền không được bảo lưu.</p>
            </footer>
        </div>
    );
};

export default Term;
