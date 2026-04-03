/**
 * Thư viện dữ liệu bài học (Sách giáo khoa chương trình GDPT 2018)
 * Bao gồm các bộ sách: Kết nối tri thức (KNTT), Cánh diều (CD), Chân trời sáng tạo (CTST)
 */

export const LESSON_LIBRARY: Record<string, Record<string, Record<string, string[]>>> = {
  'Toán học': {
    'Khối 12': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Tính đơn điệu và cực trị của hàm số', 'Bài 2. Giá trị lớn nhất và giá trị nhỏ nhất của hàm số', 'Bài 3. Đường tiệm cận của đồ thị hàm số', 'Bài 4. Khảo sát sự biến thiên và vẽ đồ thị của hàm số', 'Bài 5. Ứng dụng đạo hàm giải quyết bài toán thực tế',
        'Bài 6. Vectơ trong không gian', 'Bài 7. Hệ tọa độ trong không gian', 'Bài 8. Biểu thức tọa độ của các phép toán vectơ', 'Bài 9. Nguyên hàm', 'Bài 10. Nguyên hàm của một số hàm số sơ cấp',
        'Bài 11. Tích phân', 'Bài 12. Ứng dụng hình học của tích phân', 'Bài 13. Phương trình mặt phẳng', 'Bài 14. Phương trình đường thẳng trong không gian', 'Bài 15. Phương trình mặt cầu',
        'Bài 16. Công thức xác suất điều kiện', 'Bài 17. Công thức xác suất toàn phần và công thức Bayes', 'Bài 18. Biến ngẫu nhiên rời rạc và các đặc trưng', 'Bài 19. Biến ngẫu nhiên liên tục và các đặc trưng', 'Bài 20. Mẫu số liệu ghép nhóm',
        'Bài 21. Các số đặc trưng đo mức độ phân tán', 'Bài 22. Ôn tập tổng hợp cuối năm'
      ],
      'Cánh diều': [
        'Bài 1. Tính đơn điệu của hàm số', 'Bài 2. Giá trị lớn nhất và giá trị nhỏ nhất của hàm số', 'Bài 3. Đường tiệm cận của đồ thị hàm số', 'Bài 4. Khảo sát sự biến thiên và vẽ đồ thị của hàm số',
        'Bài 1. Vectơ và các phép toán vectơ trong không gian', 'Bài 2. Tọa độ của vectơ trong không gian', 'Bài 3. Biểu thức tọa độ của các phép toán vectơ',
        'Bài 1. Nguyên hàm', 'Bài 2. Tích phân', 'Bài 3. Ứng dụng hình học của tích phân',
        'Bài 1. Phương trình mặt phẳng', 'Bài 2. Phương trình đường thẳng', 'Bài 3. Phương trình mặt cầu',
        'Bài 1. Các khái niệm cơ bản về xác suất có điều kiện', 'Bài 2. Công thức xác suất toàn phần và công thức Bayes',
        'Bài 1. Khoảng biến thiên. Khoảng tứ phân vị', 'Bài 2. Phương sai. Độ lệch chuẩn'
      ]
    },
    'Khối 11': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Giá trị lượng giác của góc lượng giác', 'Bài 2. Các công thức lượng giác', 'Bài 3. Hàm số lượng giác và đồ thị', 'Bài 4. Phương trình lượng giác cơ bản', 'Bài 5. Dãy số',
        'Bài 6. Cấp số cộng', 'Bài 7. Cấp số nhân', 'Bài 8. Mẫu số liệu ghép nhóm', 'Bài 9. Các số đặc trưng đo xu thế trung tâm', 'Bài 10. Đường thẳng và mặt phẳng trong không gian',
        'Bài 11. Hai đường thẳng song song', 'Bài 12. Đường thẳng và mặt phẳng song song', 'Bài 13. Hai mặt phẳng song song', 'Bài 14. Phép chiếu song song', 'Bài 15. Giới hạn của dãy số',
        'Bài 16. Giới hạn của hàm số', 'Bài 17. Hàm số liên tục', 'Bài 18. Đạo hàm', 'Bài 19. Các quy tắc tính đạo hàm', 'Bài 20. Đạo hàm cấp hai'
      ]
    },
    'Khối 10': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Mệnh đề', 'Bài 2. Tập hợp', 'Bài 3. Các phép toán trên tập hợp', 'Bài 4. Bất phương trình bậc nhất hai ẩn', 'Bài 5. Hệ bất phương trình bậc nhất hai ẩn',
        'Bài 6. Hệ thức lượng trong tam giác', 'Bài 7. Vectơ', 'Bài 8. Tích vô hướng của hai vectơ', 'Bài 9. Các số đặc trưng đo xu thế trung tâm', 'Bài 10. Các số đặc trưng đo độ phân tán',
        'Bài 11. Hàm số và đồ thị', 'Bài 12. Hàm số bậc hai', 'Bài 13. Tam thức bậc hai', 'Bài 14. Phương trình quy về phương trình bậc hai', 'Bài 15. Phương pháp tọa độ trong mặt phẳng',
        'Bài 16. Đường thẳng trong mặt phẳng tọa độ', 'Bài 17. Đường tròn trong mặt phẳng tọa độ', 'Bài 18. Ba đường conic', 'Bài 19. Quy tắc đếm', 'Bài 20. Hoán vị, chỉnh hợp và tổ hợp'
      ]
    },
    'Khối 7': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Tập hợp các số hữu tỉ', 'Bài 2. Cộng, trừ, nhân, chia số hữu tỉ', 'Bài 3. Phép tính lũy thừa với số mũ tự nhiên của một số hữu tỉ', 'Bài 4. Thứ tự thực hiện các phép tính. Quy tắc chuyển vế', 'Bài 5. Làm quen với số thập phân vô hạn tuần hoàn',
        'Bài 6. Số vô tỉ. Căn bậc hai số học', 'Bài 7. Tập hợp các số thực', 'Bài 8. Góc ở vị trí đặc biệt. Tia phân giác của một góc', 'Bài 9. Hai đường thẳng song song và dấu hiệu nhận biết', 'Bài 10. Tiên đề Euclid. Tính chất của hai đường thẳng song song',
        'Bài 11. Định lí và chứng minh định lí', 'Bài 12. Tổng các góc trong một tam giác', 'Bài 13. Hai tam giác bằng nhau. Trường hợp bằng nhau thứ nhất của tam giác', 'Bài 14. Trường hợp bằng nhau thứ hai và thứ ba của tam giác', 'Bài 15. Các trường hợp bằng nhau của tam giác vuông',
        'Bài 16. Tam giác cân. Đường trung trực của đoạn thẳng', 'Bài 17. Thu thập và phân loại dữ liệu', 'Bài 18. Biểu đồ hình quạt tròn', 'Bài 19. Biểu đồ đoạn thẳng', 'Bài 20. Tỉ lệ thức',
        'Bài 21. Tính chất của dãy tỉ số bằng nhau', 'Bài 22. Đại lượng tỉ lệ thuận', 'Bài 23. Đại lượng tỉ lệ nghịch', 'Bài 24. Biểu thức đại số', 'Bài 25. Đa thức một biến',
        'Bài 26. Phép cộng và phép trừ đa thức một biến', 'Bài 27. Phép nhân đa thức một biến', 'Bài 28. Phép chia đa thức một biến', 'Bài 29. Làm quen với biến cố của trò chơi gieo xúc xắc', 'Bài 30. Làm quen với xác suất của biến cố',
        'Bài 31. Quan hệ giữa góc và cạnh đối diện trong một tam giác', 'Bài 32. Quan hệ giữa đường vuông góc và đường xiên', 'Bài 33. Quan hệ giữa ba cạnh của một tam giác', 'Bài 34. Sự đồng quy của ba đường trung tuyến, ba đường phân giác trong một tam giác', 'Bài 35. Sự đồng quy của ba đường trung trực, ba đường cao trong một tam giác',
        'Bài 36. Hình hộp chữ nhật. Hình lập phương', 'Bài 37. Hình lăng trụ đứng tam giác. Hình lăng trụ đứng tứ giác'
      ]
    },
    'Khối 8': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Đơn thức', 'Bài 2. Đa thức', 'Bài 3. Phép cộng và phép trừ đa thức', 'Bài 4. Phép nhân đa thức', 'Bài 5. Phép chia đa thức cho đơn thức',
        'Bài 6. Hiệu hai bình phương. Bình phương của một tổng hay một hiệu', 'Bài 7. Lập phương của một tổng hay một hiệu', 'Bài 8. Tổng và hiệu hai lập phương', 'Bài 9. Phân tích đa thức thành nhân tử', 'Bài 10. Tứ giác',
        'Bài 11. Hình thang cân', 'Bài 12. Hình bình hành', 'Bài 13. Hình chữ nhật', 'Bài 14. Hình thoi và hình vuông', 'Bài 15. Định lí Thalès trong tam giác',
        'Bài 16. Đường trung bình của tam giác', 'Bài 17. Tính chất đường phân giác của tam giác', 'Bài 18. Thu thập và phân loại dữ liệu', 'Bài 19. Biểu diễn dữ liệu bằng bảng, biểu đồ', 'Bài 20. Phân tích số liệu thống kê dựa vào biểu đồ',
        'Bài 21. Phân thức đại số', 'Bài 22. Tính chất cơ bản của phân thức đại số', 'Bài 23. Phép cộng và phép trừ phân thức đại số', 'Bài 24. Phép nhân và phép chia phân thức đại số', 'Bài 25. Phương trình bậc nhất một ẩn',
        'Bài 26. Giải bài toán bằng cách lập phương trình', 'Bài 27. Khái niệm hàm số và đồ thị của hàm số', 'Bài 28. Hàm số bậc nhất và đồ thị của hàm số bậc nhất', 'Bài 29. Hệ số góc của đường thẳng', 'Bài 30. Hai tam giác đồng dạng',
        'Bài 31. Các trường hợp đồng dạng của hai tam giác', 'Bài 32. Hai tam giác vuông đồng dạng', 'Bài 33. Hình chóp tam giác đều', 'Bài 34. Hình chóp tứ giác đều', 'Bài 35. Định lí Pythagore',
        'Bài 36. Các trường hợp đồng dạng của tam giác vuông', 'Bài 37. Hình đồng dạng', 'Bài 38. Dữ liệu và biểu đồ', 'Bài 39. Phân tích số liệu thống kê', 'Bài 40. Xác suất của biến cố ngẫu nhiên'
      ]
    },
    'Khối 9': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Khái niệm phương trình và hệ hai phương trình bậc nhất hai ẩn', 'Bài 2. Giải hệ hai phương trình bậc nhất hai ẩn', 'Bài 3. Giải bài toán bằng cách lập hệ phương trình', 'Bài 4. Phương trình quy về phương trình bậc nhất một ẩn', 'Bài 5. Bất đẳng thức và tính chất',
        'Bài 6. Bất phương trình bậc nhất một ẩn', 'Bài 7. Căn bậc hai và căn thức bậc hai', 'Bài 8. Khai căn bậc hai với phép nhân và phép chia', 'Bài 9. Biến đổi đơn giản biểu thức chứa căn thức bậc hai', 'Bài 10. Căn bậc ba và căn thức bậc ba',
        'Bài 11. Tỉ số lượng giác của góc nhọn', 'Bài 12. Một số hệ thức giữa cạnh và góc trong tam giác vuông', 'Bài 13. Ứng dụng thực tế các tỉ số lượng giác của góc nhọn', 'Bài 14. Đường tròn và sự xác định đường tròn', 'Bài 15. Tính chất đối xứng của đường tròn',
        'Bài 16. Vị trí tương đối của đường thẳng và đường tròn', 'Bài 17. Vị trí tương đối của hai đường tròn', 'Bài 18. Tiếp tuyến của đường tròn', 'Bài 19. Hàm số y = ax^2 (a ≠ 0)', 'Bài 20. Phương trình bậc hai một ẩn',
        'Bài 21. Định lí Viète và ứng dụng', 'Bài 22. Giải bài toán bằng cách lập phương trình bậc hai', 'Bài 23. Đường tròn ngoại tiếp và đường tròn nội tiếp của một tam giác', 'Bài 24. Độ dài đường tròn và diện tích hình tròn', 'Bài 25. Hình trụ',
        'Bài 26. Hình nón', 'Bài 27. Hình cầu', 'Bài 28. Thu thập và trình bày dữ liệu', 'Bài 29. Các số đặc trưng đo xu thế trung tâm cho mẫu số liệu ghép nhóm', 'Bài 30. Xác suất của biến cố'
      ]
    },
    'Khối 6': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Tập hợp', 'Bài 2. Cách ghi số tự nhiên', 'Bài 3. Thứ tự trong tập hợp các số tự nhiên', 'Bài 4. Phép cộng và phép trừ số tự nhiên', 'Bài 5. Phép nhân và phép chia số tự nhiên',
        'Bài 6. Lũy thừa với số mũ tự nhiên', 'Bài 7. Thứ tự thực hiện các phép tính', 'Bài 8. Quan hệ chia hết và tính chất', 'Bài 9. Dấu hiệu chia hết', 'Bài 10. Số nguyên tố',
        'Bài 11. Ước chung. Ước chung lớn nhất', 'Bài 12. Bội chung. Bội chung nhỏ nhất', 'Bài 13. Tập hợp các số nguyên', 'Bài 14. Phép cộng và phép trừ số nguyên', 'Bài 15. Quy tắc dấu ngoặc',
        'Bài 16. Phép nhân số nguyên', 'Bài 17. Phép chia hết. Ước và bội của một số nguyên', 'Bài 18. Hình tam giác đều. Hình vuông. Hình lục giác đều', 'Bài 19. Hình chữ nhật. Hình thoi. Hình bình hành. Hình thang cân', 'Bài 20. Chu vi và diện tích của một số hình phẳng',
        'Bài 21. Hình có trục đối xứng', 'Bài 22. Hình có tâm đối xứng', 'Bài 23. Mở đầu về phân số. Phân số bằng nhau', 'Bài 24. So sánh phân số. Hỗn số dương', 'Bài 25. Phép cộng và phép trừ phân số',
        'Bài 26. Phép nhân và phép chia phân số', 'Bài 27. Hai bài toán về phân số', 'Bài 28. Số thập phân', 'Bài 29. Tính toán với số thập phân', 'Bài 30. Làm tròn số và ước lượng',
        'Bài 31. Một số bài toán về tỉ số và tỉ số phần trăm', 'Bài 32. Điểm. Đường thẳng', 'Bài 33. Điểm nằm giữa hai điểm. Tia', 'Bài 34. Đoạn thẳng. Độ dài đoạn thẳng', 'Bài 35. Trung điểm của đoạn thẳng',
        'Bài 36. Góc', 'Bài 37. Số đo góc', 'Bài 38. Dữ liệu và thu thập dữ liệu', 'Bài 39. Bảng thống kê và biểu đồ tranh', 'Bài 40. Biểu đồ cột',
        'Bài 41. Biểu đồ cột kép', 'Bài 42. Kết quả có thể và sự kiện trong trò chơi, thí nghiệm', 'Bài 43. Xác suất thực nghiệm'
      ]
    }
  },
  'Ngữ văn': {
    'Khối 12': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Khát vọng sống (Truyện)', 'Bài 2. Những thế giới song song (Thơ)', 'Bài 3. Lời của non sông (Văn bản nghị luận)', 'Bài 4. Sức mạnh của tiếng cười (Kịch bản văn học)', 'Bài 5. Những thực thể vô hình (Văn bản thông tin)',
        'Bài 6. Chân dung những con người (Truyện)', 'Bài 7. Tiếng hát của tâm hồn (Thơ)', 'Bài 8. Đối diện với thực tại (Văn bản nghị luận)', 'Bài 9. Những góc nhìn khác nhau (Văn bản thông tin)', 'Bài 10. Ôn tập tổng hợp'
      ]
    }
  },
  'Tiếng Anh': {
    'Khối 12': {
      'Global Success': [
        'Unit 1. Life stories', 'Unit 2. Urbanisation', 'Unit 3. The green movement', 'Unit 4. The mass media', 'Unit 5. Cultural identity',
        'Unit 6. Endangered species', 'Unit 7. Artificial intelligence', 'Unit 8. The world of work', 'Unit 9. Choosing a career', 'Unit 10. Lifelong learning'
      ]
    }
  },
  'Vật lí': {
    'Khối 12': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Nội năng. Định luật 1 của nhiệt động lực học', 'Bài 2. Thang nhiệt độ', 'Bài 3. Nhiệt dung riêng, nhiệt nóng chảy riêng', 'Bài 4. Nhiệt hóa hơi riêng', 'Bài 5. Thuyết động học phân tử chất khí',
        'Bài 6. Áp suất khí theo mô hình động học phân tử', 'Bài 7. Phương trình trạng thái của khí lí tưởng', 'Bài 8. Áp suất khí lí tưởng', 'Bài 9. Từ trường', 'Bài 10. Lực từ. Cảm ứng từ',
        'Bài 11. Từ thông. Cảm ứng điện từ', 'Bài 12. Hiện tượng tự cảm', 'Bài 13. Cấu tạo hạt nhân', 'Bài 14. Độ hụt khối. Năng lượng liên kết', 'Bài 15. Phóng xạ', 'Bài 16. Phản ứng phân hạch và nhiệt hạch'
      ]
    },
    'Khối 11': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Dao động điều hoà', 'Bài 2. Mô tả dao động điều hoà', 'Bài 3. Vận tốc, gia tốc trong dao động điều hoà', 'Bài 4. Bài tập về dao động điều hoà', 'Bài 5. Động năng. Thế năng. Sự chuyển hoá năng lượng trong dao động điều hoà',
        'Bài 6. Dao động tắt dần. Dao động cưỡng bức. Hiện tượng cộng hưởng', 'Bài 7. Bài tập về đồ thị dao động điều hoà', 'Bài 8. Mô tả sóng', 'Bài 9. Sóng ngang. Sóng dọc. Sự truyền năng lượng của sóng cơ', 'Bài 10. Thực hành: Đo tần số của sóng âm',
        'Bài 11. Sóng điện từ', 'Bài 12. Giao thoa sóng', 'Bài 13. Sóng dừng', 'Bài 14. Bài tập về sóng', 'Bài 15. Thực hành: Đo tốc độ truyền âm',
        'Bài 16. Lực tương tác giữa hai điện tích', 'Bài 17. Khái niệm điện trường', 'Bài 18. Điện trường đều', 'Bài 19. Thế năng điện', 'Bài 20. Điện thế',
        'Bài 21. Tụ điện', 'Bài 22. Cường độ dòng điện', 'Bài 23. Điện trở. Định luật Ohm', 'Bài 24. Nguồn điện', 'Bài 25. Năng lượng điện. Công suất điện',
        'Bài 26. Thực hành: Đo suất điện động và điện trở trong của pin'
      ]
    },
    'Khối 10': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Làm quen với Vật lí', 'Bài 2. Các quy tắc an toàn trong phòng thực hành Vật lí', 'Bài 3. Thực hành tính sai số trong phép đo. Ghi kết quả đo', 'Bài 4. Độ dịch chuyển và quãng đường đi được', 'Bài 5. Tốc độ và vận tốc',
        'Bài 6. Đồ thị độ dịch chuyển – thời gian', 'Bài 7. Gia tốc', 'Bài 8. Chuyển động biến đổi. Gia tốc', 'Bài 9. Chuyển động thẳng biến đổi đều', 'Bài 10. Sự rơi tự do',
        'Bài 11. Thực hành: Đo gia tốc rơi tự do', 'Bài 12. Chuyển động ném', 'Bài 13. Tổng hợp và phân tích lực. Cân bằng lực', 'Bài 14. Định luật 1 Newton', 'Bài 15. Định luật 2 Newton',
        'Bài 16. Định luật 3 Newton', 'Bài 17. Trọng lực và lực căng', 'Bài 18. Lực ma sát', 'Bài 19. Lực cản và lực nâng', 'Bài 20. Một số ví dụ về cách giải các bài toán thuộc phần động lực học',
        'Bài 21. Moment lực. Cân bằng của vật rắn', 'Bài 22. Thực hành: Tổng hợp lực', 'Bài 23. Năng lượng. Công cơ học', 'Bài 24. Công suất', 'Bài 25. Động năng, Thế năng',
        'Bài 26. Cơ năng và định luật bảo toàn cơ năng', 'Bài 27. Hiệu suất', 'Bài 28. Động lượng', 'Bài 29. Định luật bảo toàn động lượng', 'Bài 30. Thực hành: Xác định động lượng của vật trước và sau va chạm',
        'Bài 31. Động học của chuyển động tròn đều', 'Bài 32. Lực hướng tâm và gia tốc hướng tâm', 'Bài 33. Biến dạng của vật rắn. Định luật Hooke', 'Bài 34. Khối lượng riêng. Áp suất chất lỏng'
      ]
    }
  },
  'Hóa học': {
    'Khối 12': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Este - Lipit', 'Bài 2. Xà phòng và chất giặt rửa', 'Bài 3. Glucose và Saccharose', 'Bài 4. Tinh bột và Cellulose', 'Bài 5. Amino acid',
        'Bài 6. Peptide và protein', 'Bài 7. Enzyme và nucleic acid', 'Bài 8. Đại cương về polymer', 'Bài 9. Vật liệu polymer', 'Bài 10. Thế điện cực chuẩn của kim loại',
        'Bài 11. Nguồn điện hóa học', 'Bài 12. Điện phân', 'Bài 13. Cấu tạo và tính chất vật lí của kim loại', 'Bài 14. Tính chất hóa học của kim loại', 'Bài 15. Ăn mòn kim loại',
        'Bài 16. Tách kim loại và hợp kim', 'Bài 17. Kim loại kiềm và kiềm thổ', 'Bài 18. Nhôm và hợp chất của nhôm', 'Bài 19. Sắt và hợp chất của sắt', 'Bài 20. Crom và hợp chất của crom'
      ]
    },
    'Khối 11': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Khái niệm về cân bằng hóa học', 'Bài 2. Cân bằng trong dung dịch nước', 'Bài 3. Ôn tập chương 1', 'Bài 4. Nitrogen', 'Bài 5. Ammonia. Muối ammonium',
        'Bài 6. Một số hợp chất của nitrogen với oxygen', 'Bài 7. Sulfur và sulfur dioxide', 'Bài 8. Sulfuric acid và muối sulfate', 'Bài 9. Ôn tập chương 2', 'Bài 10. Hợp chất hữu cơ và hóa học hữu cơ',
        'Bài 11. Phương pháp tách biệt và tinh chế hợp chất hữu cơ', 'Bài 12. Công thức phân tử hợp chất hữu cơ', 'Bài 13. Cấu tạo hóa học hợp chất hữu cơ', 'Bài 14. Ôn tập chương 3', 'Bài 15. Alkane',
        'Bài 16. Hydrocarbon không no', 'Bài 17. Arene (Hydrocarbon thơm)', 'Bài 18. Ôn tập chương 4', 'Bài 19. Dẫn xuất halogen', 'Bài 20. Alcohol',
        'Bài 21. Phenol', 'Bài 22. Ôn tập chương 5', 'Bài 23. Hợp chất carbonyl', 'Bài 24. Carboxylic acid', 'Bài 25. Ôn tập chương 6'
      ]
    },
    'Khối 10': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Thành phần của nguyên tử', 'Bài 2. Nguyên tố hóa học', 'Bài 3. Cấu trúc lớp vỏ electron nguyên tử', 'Bài 4. Ôn tập chương 1', 'Bài 5. Cấu tạo bảng tuần hoàn các nguyên tố hóa học',
        'Bài 6. Xu hướng biến đổi thành phần và một số tính chất của hợp chất trong một chu kì', 'Bài 7. Định luật tuần hoàn. Ý nghĩa của bảng tuần hoàn các nguyên tố hóa học', 'Bài 8. Ôn tập chương 2', 'Bài 9. Liên kết ion', 'Bài 10. Liên kết cộng hóa trị',
        'Bài 11. Liên kết hydrogen và tương tác van der Waals', 'Bài 12. Ôn tập chương 3', 'Bài 13. Phản ứng oxi hóa – khử', 'Bài 14. Ôn tập chương 4', 'Bài 15. Ý nghĩa và cách tính biến thiên enthalpy phản ứng hóa học',
        'Bài 16. Thuyết va chạm và tốc độ phản ứng hóa học', 'Bài 17. Biến thiên enthalpy trong các phản ứng hóa học', 'Bài 18. Ôn tập chương 5', 'Bài 19. Tốc độ phản ứng hóa học', 'Bài 20. Ôn tập chương 6',
        'Bài 21. Nhóm halogen', 'Bài 22. Hydrogen halide và muối halide', 'Bài 23. Ôn tập chương 7'
      ]
    }
  },
  'Sinh học': {
    'Khối 12': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Gen, mã di truyền và nhân đôi DNA', 'Bài 2. Phiên mã và dịch mã', 'Bài 3. Điều hòa hoạt động gen', 'Bài 4. Đột biến gen', 'Bài 5. Nhiễm sắc thể và đột biến cấu trúc NST',
        'Bài 6. Đột biến số lượng NST', 'Bài 7. Quy luật phân li', 'Bài 8. Quy luật phân li độc lập', 'Bài 9. Tương tác gen và tác động đa hiệu của gen', 'Bài 10. Di truyền liên kết',
        'Bài 11. Di truyền liên kết với giới tính', 'Bài 12. Di truyền ngoài nhân', 'Bài 13. Ảnh hưởng của môi trường lên sự biểu hiện của gen', 'Bài 14. Di truyền quần thể', 'Bài 15. Chọn giống bằng phương pháp truyền thống',
        'Bài 16. Chọn giống bằng công nghệ tế bào', 'Bài 17. Chọn giống bằng công nghệ gen', 'Bài 18. Di truyền y học', 'Bài 19. Bằng chứng tiến hóa', 'Bài 20. Học thuyết Lamark và Darwin'
      ]
    },
    'Khối 11': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Khái quát về trao đổi chất và chuyển hóa năng lượng', 'Bài 2. Trao đổi nước và khoáng ở thực vật', 'Bài 3. Thực hành: Thí nghiệm trao đổi nước ở thực vật và trông cây bằng phương pháp thủy canh, khí canh', 'Bài 4. Quang hợp ở thực vật', 'Bài 5. Thực hành: Quang hợp ở thực vật',
        'Bài 6. Hô hấp ở thực vật', 'Bài 7. Thực hành: Hô hấp ở thực vật', 'Bài 8. Dinh dưỡng và tiêu hóa ở động vật', 'Bài 9. Hô hấp ở động vật', 'Bài 10. Tuần hoàn ở động vật',
        'Bài 11. Thực hành: Một số thí nghiệm về tuần hoàn ở động vật', 'Bài 12. Miễn dịch ở động vật và người', 'Bài 13. Bài tiết và cân bằng nội môi', 'Bài 14. Khái quát về cảm ứng', 'Bài 15. Cảm ứng ở thực vật',
        'Bài 16. Thực hành: Cảm ứng ở thực vật', 'Bài 17. Cảm ứng ở động vật', 'Bài 18. Tập tính ở động vật', 'Bài 19. Khái quát về sinh trưởng và phát triển', 'Bài 20. Sinh trưởng và phát triển ở thực vật',
        'Bài 21. Thực hành: Bấm ngọn, tỉa cành, tính tuổi cây và tác động của ethylene đến sự chín của quả', 'Bài 22. Sinh trưởng và phát triển ở động vật', 'Bài 23. Thực hành: Quan sát biến thái ở côn trùng và cho cá ăn ngũ cốc thay thế mồi sống', 'Bài 24. Khái quát về sinh sản', 'Bài 25. Sinh sản ở thực vật',
        'Bài 26. Thực hành: Nhân giống vô tính ở thực vật bằng giâm, chiết, ghép', 'Bài 27. Sinh sản ở động vật', 'Bài 28. Mối quan hệ giữa các quá trình sinh lí trong cơ thể sinh vật và một số ngành nghề liên quan đến sinh học cơ thể'
      ]
    },
    'Khối 10': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Giới thiệu chương trình môn Sinh học. Sinh học và sự phát triển bền vững', 'Bài 2. Phương pháp nghiên cứu và học tập môn Sinh học', 'Bài 3. Các cấp độ tổ chức của thế giới sống', 'Bài 4. Các nguyên tố hóa học và nước', 'Bài 5. Các phân tử sinh học',
        'Bài 6. Thực hành: Nhận biết một số thành phần hóa học trong tế bào', 'Bài 7. Tế bào nhân sơ', 'Bài 8. Tế bào nhân thực', 'Bài 9. Thực hành: Quan sát tế bào', 'Bài 10. Trao đổi chất qua màng tế bào',
        'Bài 11. Thực hành: Thí nghiệm co và phản co nguyên sinh', 'Bài 12. Truyền tin tế bào', 'Bài 13. Khái quát về chuyển hóa vật chất và năng lượng', 'Bài 14. Phân giải các chất và giải phóng năng lượng', 'Bài 15. Tổng hợp các chất và tích lũy năng lượng',
        'Bài 16. Chu kì tế bào và nguyên phân', 'Bài 17. Giảm phân', 'Bài 18. Thực hành: Làm tiêu bản nhất thời quan sát quá trình nguyên phân và giảm phân', 'Bài 19. Công nghệ tế bào', 'Bài 20. Khái quát về vi sinh vật',
        'Bài 21. Trao đổi chất, sinh trưởng và sinh sản ở vi sinh vật', 'Bài 22. Vai trò và ứng dụng của vi sinh vật', 'Bài 23. Thực hành: Một số phương pháp nghiên cứu vi sinh vật thông dụng. Tìm hiểu về các sản phẩm công nghệ vi sinh vật và làm một số sản phẩm lên men', 'Bài 24. Khái quát về virus', 'Bài 25. Một số bệnh do virus và các thành tựu nghiên cứu ứng dụng virus'
      ]
    }
  },
  'Lịch sử': {
    'Khối 12': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Liên hợp quốc', 'Bài 2. Trật tự thế giới trong Chiến tranh lạnh', 'Bài 3. Trật tự thế giới sau Chiến tranh lạnh', 'Bài 4. Sự ra đời và phát triển của ASEAN', 'Bài 5. Cộng đồng ASEAN',
        'Bài 6. Hành trình đi đến độc lập dân tộc ở Đông Nam Á', 'Bài 7. Chiến tranh bảo vệ Tổ quốc trong lịch sử Việt Nam', 'Bài 8. Cuộc vận động giải phóng dân tộc (1939-1945)', 'Bài 9. Cách mạng tháng Tám năm 1945', 'Bài 10. Khởi nghĩa Yên Bái',
        'Bài 11. Phong trào Xô viết Nghệ - Tĩnh', 'Bài 12. Cuộc kháng chiến chống thực dân Pháp (1945-1954)', 'Bài 13. Chiến dịch Điện Biên Phủ', 'Bài 14. Cuộc kháng chiến chống Mỹ (1954-1975)', 'Bài 15. Chiến dịch Hồ Chí Minh',
        'Bài 16. Công cuộc xây dựng và bảo vệ Tổ quốc từ 1975 đến nay', 'Bài 17. Đổi mới đất nước', 'Bài 18. Lịch sử đối ngoại Việt Nam thời hiện đại', 'Bài 19. Thành tựu văn hóa Việt Nam', 'Bài 20. Tổng kết lịch sử Việt Nam'
      ]
    },
    'Khối 11': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Một số vấn đề chung về cách mạng tư sản', 'Bài 2. Sự xác lập và phát triển của chủ nghĩa tư bản', 'Bài 3. Sự hình thành Liên bang Cộng hòa xã hội chủ nghĩa Xô viết và sự phát triển của chủ nghĩa xã hội sau Chiến tranh thế giới thứ hai', 'Bài 4. Sự phát triển của chủ nghĩa xã hội ở Đông Âu và một số quốc gia khác trên thế giới', 'Bài 5. Quá trình xâm lược và cai trị của chủ nghĩa thực dân ở Đông Nam Á',
        'Bài 6. Hành trình đi đến độc lập dân tộc ở Đông Nam Á', 'Bài 7. Khái quát về chiến tranh bảo vệ Tổ quốc trong lịch sử Việt Nam', 'Bài 8. Một số cuộc khởi nghĩa tiêu biểu trong lịch sử Việt Nam', 'Bài 9. Cuộc cải cách của Hồ Quý Ly và triều Hồ', 'Bài 10. Cuộc cải cách của Lê Thánh Tông',
        'Bài 11. Cuộc cải cách của Minh Mạng', 'Bài 12. Vị trí và tầm quan trọng của Biển Đông trong lịch sử Việt Nam', 'Bài 13. Việt Nam và Biển Đông trong lịch sử'
      ]
    },
    'Khối 10': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Hiện thực lịch sử và nhận thức lịch sử', 'Bài 2. Tri thức lịch sử và cuộc sống', 'Bài 3. Sử học với các lĩnh vực khoa học khác', 'Bài 4. Sử học với truyền thống, di sản và du lịch', 'Bài 5. Khái niệm văn minh. Một số nền văn minh Phương Đông thời kì cổ - trung đại',
        'Bài 6. Một số nền văn minh Phương Tây thời kì cổ - trung đại', 'Bài 7. Các cuộc cách mạng công nghiệp thời kì cận đại', 'Bài 8. Các cuộc cách mạng công nghiệp thời kì hiện đại', 'Bài 9. Cơ sở hình thành văn minh Đông Nam Á thời kì cổ - trung đại', 'Bài 10. Hành trình phát triển và thành tựu của văn minh Đông Nam Á thời kì cổ - trung đại',
        'Bài 11. Một số nền văn minh cổ trên đất nước Việt Nam', 'Bài 12. Văn minh Đại Việt', 'Bài 13. Đời sống vật chất và tinh thần của cộng đồng các dân tộc Việt Nam', 'Bài 14. Khối đại đoàn kết dân tộc trong lịch sử Việt Nam'
      ]
    }
  },
  'Địa lí': {
    'Khối 12': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Vị trí địa lí và phạm vi lãnh thổ', 'Bài 2. Thiên nhiên nhiệt đới ẩm gió mùa', 'Bài 3. Sự phân hóa đa dạng của thiên nhiên', 'Bài 4. Sử dụng và bảo vệ tài nguyên thiên nhiên', 'Bài 5. Bảo vệ môi trường và phòng chống thiên tai',
        'Bài 6. Đặc điểm dân số và phân bố dân cư', 'Bài 7. Lao động và việc làm', 'Bài 8. Đô thị hóa', 'Bài 9. Chuyển dịch cơ cấu kinh tế', 'Bài 10. Vấn đề phát triển nông nghiệp',
        'Bài 11. Vấn đề phát triển ngành lâm nghiệp và thủy sản', 'Bài 12. Tổ chức lãnh thổ nông nghiệp', 'Bài 13. Vấn đề phát triển công nghiệp', 'Bài 14. Vấn đề phát triển ngành công nghiệp trọng điểm', 'Bài 15. Tổ chức lãnh thổ công nghiệp',
        'Bài 16. Vấn đề phát triển ngành giao thông vận tải và thông tin liên lạc', 'Bài 17. Vấn đề phát triển ngành thương mại và du lịch', 'Bài 18. Các vùng kinh tế trọng điểm', 'Bài 19. Vấn đề khai thác thế mạnh ở Trung du và miền núi Bắc Bộ', 'Bài 20. Vấn đề chuyển dịch cơ cấu kinh tế ở Đồng bằng sông Hồng'
      ]
    },
    'Khối 11': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Sự khác biệt về trình độ phát triển kinh tế - xã hội của các nhóm nước', 'Bài 2. Toàn cầu hóa và khu vực hóa kinh tế', 'Bài 3. Thực hành: Tìm hiểu về cơ hội và thách thức của toàn cầu hóa và khu vực hóa kinh tế', 'Bài 4. Một số vấn đề an ninh toàn cầu', 'Bài 5. Thực hành: Viết báo cáo về đặc điểm và nội dung của một số vấn đề an ninh toàn cầu',
        'Bài 6. Vị trí địa lí, điều kiện tự nhiên, dân cư và xã hội khu vực Mỹ La tinh', 'Bài 7. Kinh tế khu vực Mỹ La tinh', 'Bài 8. Thực hành: Viết báo cáo về tình hình phát triển kinh tế - xã hội ở Cộng hòa Liên bang Bra-xin', 'Bài 9. Liên minh châu Âu (EU)', 'Bài 10. Thực hành: Làm quen với cách sử dụng bản đồ điện tử và tìm hiểu về các nước trong Liên minh châu Âu',
        'Bài 11. Vị trí địa lí, điều kiện tự nhiên, dân cư và xã hội khu vực Đông Nam Á', 'Bài 12. Kinh tế khu vực Đông Nam Á', 'Bài 13. Hiệp hội các quốc gia Đông Nam Á (ASEAN)', 'Bài 14. Thực hành: Tìm hiểu về hoạt động kinh tế đối ngoại của Đông Nam Á', 'Bài 15. Vị trí địa lí, điều kiện tự nhiên, dân cư và xã hội khu vực Tây Nam Á',
        'Bài 16. Thực hành: Viết báo cáo về tình hình phát triển kinh tế và các vấn đề xã hội ở khu vực Tây Nam Á', 'Bài 17. Vị trí địa lí, điều kiện tự nhiên, dân cư và xã hội Hoa Kỳ', 'Bài 18. Kinh tế Hoa Kỳ', 'Bài 19. Vị trí địa lí, điều kiện tự nhiên, dân cư và xã hội Liên bang Nga', 'Bài 20. Kinh tế Liên bang Nga',
        'Bài 21. Thực hành: Tìm hiểu về tình hình kinh tế - xã hội của Liên bang Nga', 'Bài 22. Vị trí địa lí, điều kiện tự nhiên, dân cư và xã hội Nhật Bản', 'Bài 23. Kinh tế Nhật Bản', 'Bài 24. Vị trí địa lí, điều kiện tự nhiên, dân cư và xã hội Trung Quốc', 'Bài 25. Kinh tế Trung Quốc',
        'Bài 26. Thực hành: Tìm hiểu về sự thay đổi của kinh tế Trung Quốc', 'Bài 27. Vị trí địa lí, điều kiện tự nhiên, dân cư và xã hội Ô-xtrây-li-a', 'Bài 28. Kinh tế Ô-xtrây-li-a', 'Bài 29. Thực hành: Tìm hiểu về dân cư, xã hội và kinh tế của Ô-xtrây-li-a', 'Bài 30. Vị trí địa lí, điều kiện tự nhiên, dân cư và xã hội Cộng hòa Nam Phi',
        'Bài 31. Kinh tế Cộng hòa Nam Phi'
      ]
    },
    'Khối 10': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Môn Địa lí với định hướng nghề nghiệp', 'Bài 2. Phương pháp biểu hiện các đối tượng địa lí trên bản đồ', 'Bài 3. Sử dụng bản đồ trong học tập và đời sống, một số ứng dụng của GPS và bản đồ số', 'Bài 4. Sự hình thành Trái Đất, vỏ Trái Đất và vật liệu cấu tạo vỏ Trái Đất', 'Bài 5. Hệ quả địa lí các chuyển động của Trái Đất',
        'Bài 6. Thạch quyển, nội lực', 'Bài 7. Ngoại lực', 'Bài 8. Thực hành: Sự phân bố các vành đai động đất, núi lửa trên thế giới', 'Bài 9. Khí quyển, phân bố nhiệt độ không khí trên Trái Đất', 'Bài 10. Khí áp và gió',
        'Bài 11. Mưa và sự phân bố lượng mưa trên thế giới', 'Bài 12. Thực hành: Đọc bản đồ các đới và các kiểu khí hậu trên thế giới, phân tích biểu đồ một số kiểu khí hậu', 'Bài 13. Thủy quyển, nước trên lục địa', 'Bài 14. Đất trên Trái Đất', 'Bài 15. Sinh quyển, các nhân tố ảnh hưởng đến sự phát triển và phân bố của sinh vật',
        'Bài 16. Thực hành: Phân tích sự phân bố của đất và sinh vật trên thế giới', 'Bài 17. Vỏ địa lí, quy luật thống nhất và hoàn chỉnh của vỏ địa lí', 'Bài 18. Quy luật địa đới và quy luật phi địa đới', 'Bài 19. Quy mô dân số, gia tăng dân số và cơ cấu dân số thế giới', 'Bài 20. Phân bố dân cư và đô thị hóa trên thế giới',
        'Bài 21. Các nguồn lực phát triển kinh tế', 'Bài 22. Cơ cấu kinh tế, tổng sản phẩm trong nước và tổng thu nhập quốc gia', 'Bài 23. Vai trò, đặc điểm, các nhân tố ảnh hưởng tới sự phát triển và phân bố nông nghiệp, lâm nghiệp, thủy sản', 'Bài 24. Địa lí ngành nông nghiệp', 'Bài 25. Địa lí ngành lâm nghiệp và ngành thủy sản',
        'Bài 26. Thực hành: Vẽ biểu đồ, nhận xét và giải thích tình hình phát triển ngành nông nghiệp, lâm nghiệp, thủy sản', 'Bài 27. Vai trò, đặc điểm, các nhân tố ảnh hưởng tới sự phát triển và phân bố công nghiệp', 'Bài 28. Địa lí các ngành công nghiệp', 'Bài 29. Thực hành: Vẽ biểu đồ, nhận xét và giải thích tình hình phát triển công nghiệp thế giới', 'Bài 30. Vai trò, đặc điểm, các nhân tố ảnh hưởng tới sự phát triển và phân bố dịch vụ',
        'Bài 31. Địa lí ngành giao thông vận tải và bưu chính viễn thông', 'Bài 32. Địa lí ngành thương mại và ngành du lịch', 'Bài 33. Cơ cấu, vai trò, các nhân tố ảnh hưởng đến sự phát triển và phân bố ngành tài chính ngân hàng', 'Bài 34. Địa lí ngành tài chính ngân hàng', 'Bài 35. Môi trường và tài nguyên thiên nhiên',
        'Bài 36. Đặc điểm của phát triển bền vững và tăng trưởng xanh'
      ]
    }
  },
  'Tin học': {
    'Khối 12': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Hệ điều hành cho thiết bị di động và các thiết bị thông minh', 'Bài 2. Thực hành: Sử dụng hệ điều hành cho thiết bị di động', 'Bài 3. Trí tuệ nhân tạo và ứng dụng', 'Bài 4. Một số vấn đề đạo đức và pháp luật của trí tuệ nhân tạo', 'Bài 5. Mạng máy tính và giao thức mạng',
        'Bài 6. Thực hành: Cấu hình thiết bị mạng cục bộ', 'Bài 7. Internet vạn vật (IoT)', 'Bài 8. Thực hành: Kết nối và sử dụng thiết bị thông minh', 'Bài 9. Một số vấn đề về pháp luật, đạo đức và văn hóa khi sử dụng tài nguyên số', 'Bài 10. Định dạng dữ liệu và lưu trữ dữ liệu',
        'Bài 11. Một số kĩ thuật lập trình nâng cao trong Python', 'Bài 12. Thực hành: Xây dựng chương trình quản lí đơn giản', 'Bài 13. Một số nghề nghiệp trong lĩnh vực Tin học', 'Bài 14. Dự án: Tìm hiểu nghề nghiệp trong lĩnh vực Tin học', 'Bài 15. Hệ quản trị nội dung (CMS)',
        'Bài 16. Thiết lập và quản trị trang web bằng CMS', 'Bài 17. Thực hành: Tạo trang web bằng phần mềm quản trị nội dung', 'Bài 18. Quản lí và biên tập nội dung trên trang web', 'Bài 19. Tối ưu hóa công cụ tìm kiếm (SEO) cho trang web', 'Bài 20. Thực hành: Quản trị và tối ưu hóa trang web',
        'Bài 21. Dự án: Xây dựng trang web tin tức hoặc bán hàng trực tuyến'
      ]
    },
    'Khối 11': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Hệ điều hành', 'Bài 2. Thực hành: Sử dụng hệ điều hành', 'Bài 3. Phần mềm ứng dụng và dịch vụ phần mềm', 'Bài 4. Bên trong máy tính', 'Bài 5. Kết nối thiết bị số với máy tính',
        'Bài 6. Lưu trữ và chia sẻ tệp tin trên Internet', 'Bài 7. Thực hành: Tìm kiếm thông tin trên Internet', 'Bài 8. Đạo đức và văn hóa trong môi trường số', 'Bài 9. Cơ sở dữ liệu và hệ quản trị cơ sở dữ liệu', 'Bài 10. Bảng và khóa chính trong cơ sở dữ liệu quan hệ',
        'Bài 11. Thực hành: Khởi tạo cơ sở dữ liệu và bảng', 'Bài 12. Truy vấn dữ liệu và ngôn ngữ SQL', 'Bài 13. Thực hành: Truy vấn dữ liệu', 'Bài 14. Bảo mật và an toàn trong cơ sở dữ liệu', 'Bài 15. Nghề quản trị cơ sở dữ liệu',
        'Bài 16. Phần mềm biên tập ảnh và video', 'Bài 17. Thực hành: Chỉnh sửa ảnh', 'Bài 18. Thực hành: Biên tập video', 'Bài 19. Thực hành: Tạo video giới thiệu dự án', 'Bài 20. Khái quát về thiết kế trang web',
        'Bài 21. Các thẻ HTML cơ bản', 'Bài 22. Định dạng trang web bằng CSS', 'Bài 23. Thực hành: Tạo trang web cá nhân', 'Bài 24. Thực hành: Tạo trang web có nội dung đa phương tiện', 'Bài 25. Dự án: Xây dựng website giới thiệu trường học'
      ]
    },
    'Khối 10': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Thông tin và xử lý thông tin', 'Bài 2. Vai trò của thiết bị thông minh và tin học', 'Bài 3. Một số thành tựu của tin học', 'Bài 4. Hệ nhị phân và ứng dụng', 'Bài 5. Dữ liệu số và các bước xử lý',
        'Bài 6. Mạng máy tính và Internet', 'Bài 7. Thực hành khai thác tài nguyên trên Internet', 'Bài 8. An toàn thông tin trên mạng', 'Bài 9. Đạo đức, văn hóa và pháp luật trong môi trường số', 'Bài 10. Giải quyết vấn đề với sự trợ giúp của máy tính',
        'Bài 11. Hệ điều hành và phần mềm ứng dụng', 'Bài 12. Thực hành sử dụng hệ điều hành và phần mềm', 'Bài 13. Phần mềm nguồn mở và phần mềm chạy trên Internet', 'Bài 14. Dịch vụ lưu trữ đám mây', 'Bài 15. Thực hành thiết kế và lập trình',
        'Bài 16. Ngôn ngữ lập trình bậc cao và Python', 'Bài 17. Biến và lệnh gán', 'Bài 18. Các lệnh vào ra đơn giản', 'Bài 19. Câu lệnh điều kiện If', 'Bài 20. Câu lệnh lặp For',
        'Bài 21. Câu lệnh lặp While', 'Bài 22. Kiểu dữ liệu danh sách', 'Bài 23. Một số lệnh làm việc với dữ liệu danh sách', 'Bài 24. Xâu kí tự', 'Bài 25. Một số lệnh làm việc với xâu kí tự',
        'Bài 26. Hàm trong Python', 'Bài 27. Tham số của hàm', 'Bài 28. Phạm vi của biến', 'Bài 29. Nhận biết lỗi chương trình', 'Bài 30. Kiểm thử và gỡ lỗi chương trình',
        'Bài 31. Thực hành viết chương trình đơn giản', 'Bài 32. Ôn tập lập trình Python'
      ]
    },
    'Khối 8': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Lược sử công cụ tính toán', 'Bài 2. Thông tin trong môi trường kĩ thuật số', 'Bài 3. Thẻ tiêu đề và định dạng văn bản', 'Bài 4. Danh sách và hình ảnh', 'Bài 5. Bảng và khung trong trang web',
        'Bài 6. Thực hành: Tạo trang web cá nhân', 'Bài 7. Cấu trúc lặp', 'Bài 8. Cấu trúc lặp (Tiếp theo)', 'Bài 9. Lập trình chương trình máy tính', 'Bài 10. Các kiểu dữ liệu cơ bản của Python',
        'Bài 11. Biến và lệnh gán', 'Bài 12. Câu lệnh điều kiện và cấu trúc rẽ nhánh', 'Bài 13. Câu lệnh lặp'
      ]
    },
    'Khối 7': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Thiết bị vào - ra', 'Bài 2. Phần mềm máy tính', 'Bài 3. Quản lí dữ liệu trong máy tính', 'Bài 4. Mạng xã hội và chia sẻ thông tin', 'Bài 5. Ứng xử trên mạng',
        'Bài 6. Làm quen với phần mềm bảng tính', 'Bài 7. Tính toán dự án với phần mềm bảng tính', 'Bài 8. Công cụ phối màu sắc', 'Bài 9. Trình bày bài giới thiệu', 'Bài 10. Bản trình chiếu và đa phương tiện',
        'Bài 11. Tạo bài trình chiếu hoàn thiện', 'Bài 12. Thuật toán tìm kiếm', 'Bài 13. Thuật toán sắp xếp', 'Bài 14. Thuật toán tìm kiếm nhị phân', 'Bài 15. Thuật toán sắp xếp nổi bọt'
      ]
    },
    'Khối 6': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Thông tin và dữ liệu', 'Bài 2. Lưu trữ và trao đổi thông tin', 'Bài 3. Máy tính trong hoạt động thông tin', 'Bài 4. Mạng máy tính', 'Bài 5. Internet',
        'Bài 6. Mạng thông tin toàn cầu World Wide Web', 'Bài 7. Tìm kiếm thông tin trên Internet', 'Bài 8. Thư điện tử', 'Bài 9. An toàn thông tin trên Internet', 'Bài 10. Sơ đồ tư duy',
        'Bài 11. Định dạng văn bản và trình bày trang văn bản', 'Bài 12. Trình bày thông tin ở dạng bảng', 'Bài 13. Thực hành: Tìm kiếm và thay thế', 'Bài 14. Thực hành: Tổng hợp nội dung dự án', 'Bài 15. Thuật toán',
        'Bài 16. Các cấu trúc điều khiển', 'Bài 17. Chương trình máy tính'
      ]
    },
    'Khối 9': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Thế giới kỹ thuật số', 'Bài 2. Thông tin trong giải quyết vấn đề', 'Bài 3. Thực hành: Đánh giá chất lượng thông tin', 'Bài 4. Một số vấn đề pháp lý về sử dụng dịch vụ Internet', 'Bài 5. Tìm hiểu phần mềm mô phỏng',
        'Bài 6. Thực hành: Khai thác phần mềm mô phỏng', 'Bài 7. Trình bày thông tin trong trao đổi và hợp tác', 'Bài 8. Thực hành: Sử dụng công cụ trực quan trình bày', 'Bài 9a. Sử dụng công cụ xác thực dữ liệu', 'Bài 10a. Sử dụng hàm Countif',
        'Bài 11a. Sử dụng hàm Sumif', 'Bài 12a. Sử dụng hàm If', 'Bài 13a. Hoàn thiện bảng tính quản lí tài chính gia đình', 'Bài 14. Giải quyết vấn đề', 'Bài 15. Bài toán tin học',
        'Bài 16. Thực hành: Lập chương trình máy tính', 'Bài 17. Tin học và thế giới nghề nghiệp'
      ]
    }
  },
  'Khoa học tự nhiên': {
    'Khối 6': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Giới thiệu về Khoa học tự nhiên', 'Bài 2. An toàn trong phòng thực hành', 'Bài 3. Sử dụng kính lúp và kính hiển vi quang học', 'Bài 4. Đo chiều dài', 'Bài 5. Đo khối lượng',
        'Bài 6. Đo thời gian', 'Bài 7. Đo nhiệt độ', 'Bài 8. Sự đa dạng của chất', 'Bài 9. Sự chuyển thể của chất', 'Bài 10. Hỗn hợp và tách chất ra khỏi hỗn hợp',
        'Bài 11. Oxygen. Không khí', 'Bài 12. Một số vật liệu', 'Bài 13. Một số nhiên liệu', 'Bài 14. Một số nguyên liệu', 'Bài 15. Một số lương thực - thực phẩm',
        'Bài 16. Sơ lược về bảng tuần hoàn các nguyên tố hóa học', 'Bài 17. Tế bào', 'Bài 18. Từ tế bào đến cơ thể', 'Bài 19. Nguy cơ và tác hại của virus', 'Bài 20. Vi khuẩn',
        'Bài 21. Nấm', 'Bài 22. Thực vật', 'Bài 23. Động vật không xương sống', 'Bài 24. Động vật có xương sống', 'Bài 25. Đa dạng sinh học',
        'Bài 26. Lực và tác dụng của lực', 'Bài 27. Lực tiếp xúc và lực không tiếp xúc', 'Bài 28. Lực ma sát', 'Bài 29. Lực cản của nước', 'Bài 30. Trọng lượng và khối lượng',
        'Bài 31. Biến dạng của lò xo. Phép đo lực', 'Bài 32. Năng lượng và sự truyền năng lượng', 'Bài 33. Một số dạng năng lượng', 'Bài 34. Sự chuyển hóa năng lượng', 'Bài 35. Nhiên liệu và năng lượng tái tạo',
        'Bài 36. Tiết kiệm năng lượng', 'Bài 37. Trái Đất và Bầu trời', 'Bài 38. Hệ Mặt Trời và Ngân Hà'
      ]
    },
    'Khối 7': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Phương pháp và kĩ năng học tập môn Khoa học tự nhiên', 'Bài 2. Nguyên tử', 'Bài 3. Nguyên tố hóa học', 'Bài 4. Sơ lược về bảng tuần hoàn các nguyên tố hóa học', 'Bài 5. Phân tử. Đơn chất. Hợp chất',
        'Bài 6. Giới thiệu về liên kết hóa học', 'Bài 7. Hóa trị và công thức hóa học', 'Bài 8. Tốc độ chuyển động', 'Bài 9. Đồ thị quãng đường – thời gian', 'Bài 10. Đo tốc độ',
        'Bài 11. Tốc độ và an toàn giao thông', 'Bài 12. Sóng âm', 'Bài 13. Độ cao và độ to của âm', 'Bài 14. Phản xạ âm, chống ô nhiễm tiếng ồn', 'Bài 15. Ánh sáng, tia sáng',
        'Bài 16. Sự phản xạ ánh sáng', 'Bài 17. Ảnh của vật qua gương phẳng', 'Bài 18. Nam châm', 'Bài 19. Từ trường', 'Bài 20. Từ trường Trái Đất. Sử dụng la bàn',
        'Bài 21. Nam châm điện', 'Bài 22. Vai trò của trao đổi chất và chuyển hóa năng lượng ở sinh vật', 'Bài 23. Quang hợp ở thực vật', 'Bài 24. Thực hành: Chứng minh quang hợp ở cây xanh', 'Bài 25. Hô hấp tế bào',
        'Bài 26. Thực hành: Hô hấp ở hạt nảy mầm', 'Bài 27. Trao đổi khí ở sinh vật', 'Bài 28. Trao đổi nước và chất dinh dưỡng ở thực vật', 'Bài 29. Thực hành: Quan sát cấu tạo của cây và sự vận chuyển các chất trong cây', 'Bài 30. Trao đổi nước và chất dinh dưỡng ở động vật',
        'Bài 31. Hãy bảo vệ sức khỏe của chúng ta', 'Bài 32. Cảm ứng ở sinh vật', 'Bài 33. Tập tính ở động vật', 'Bài 34. Sinh trưởng và phát triển ở sinh vật', 'Bài 35. Các nhân tố ảnh hưởng đến sinh trưởng và phát triển của sinh vật',
        'Bài 36. Khái quát về sinh sản ở sinh vật', 'Bài 37. Sinh sản vô tính ở sinh vật', 'Bài 38. Sinh sản hữu tính ở sinh vật', 'Bài 39. Chứng minh cơ thể sinh vật là một thể thống nhất'
      ]
    },
    'Khối 8': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Sử dụng một số hóa chất, thiết bị cơ bản trong phòng thí nghiệm', 'Bài 2. Phản ứng hóa học', 'Bài 3. Mol và tỉ khối chất khí', 'Bài 4. Dung dịch và nồng độ', 'Bài 5. Định luật bảo toàn khối lượng và phương trình hóa học',
        'Bài 6. Tính theo phương trình hóa học', 'Bài 7. Tốc độ phản ứng và chất xúc tác', 'Bài 8. Acid', 'Bài 9. Base. Thang pH', 'Bài 10. Oxide',
        'Bài 11. Muối', 'Bài 12. Phân bón hóa học', 'Bài 13. Khối lượng riêng', 'Bài 14. Thực hành: Xác định khối lượng riêng', 'Bài 15. Áp suất trên một bề mặt',
        'Bài 16. Áp suất chất lỏng. Áp suất khí quyển', 'Bài 17. Lực đẩy Archimedes', 'Bài 18. Tác dụng làm quay của lực. Moment lực', 'Bài 19. Đòn bẩy', 'Bài 20. Hiện tượng nhiễm điện do cọ xát',
        'Bài 21. Dòng điện, nguồn điện', 'Bài 22. Mạch điện đơn giản', 'Bài 23. Tác dụng của dòng điện', 'Bài 24. Cường độ dòng điện và hiệu điện thế', 'Bài 25. Thực hành: Đo cường độ dòng điện và hiệu điện thế',
        'Bài 26. Năng lượng nhiệt và nội năng', 'Bài 27. Dẫn nhiệt, đối lưu, bức xạ nhiệt', 'Bài 28. Sự nở vì nhiệt', 'Bài 29. Khái quát về cơ thể người', 'Bài 30. Hệ vận động ở người',
        'Bài 31. Hệ tiêu hóa ở người', 'Bài 32. Dinh dưỡng và tiêu hóa ở người', 'Bài 33. Hệ tuần hoàn ở người', 'Bài 34. Máu và hệ tuần hoàn của cơ thể người', 'Bài 35. Hệ hô hấp ở người',
        'Bài 36. Hệ bài tiết ở người', 'Bài 37. Hệ thần kinh và các giác quan ở người', 'Bài 38. Hệ nội tiết ở người', 'Bài 39. Da và điều hòa thân nhiệt ở người', 'Bài 40. Hệ sinh sản ở người',
        'Bài 41. Môi trường sống và các nhân tố sinh thái', 'Bài 42. Quần thể sinh vật', 'Bài 43. Quần xã sinh vật', 'Bài 44. Hệ sinh thái'
      ]
    },
    'Khối 9': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Nhận biết một số dụng cụ, hóa chất. Thuyết minh báo cáo thí nghiệm', 'Bài 2. Động năng. Thế năng', 'Bài 3. Cơ năng', 'Bài 4. Công và công suất', 'Bài 5. Khúc xạ ánh sáng',
        'Bài 6. Phản xạ toàn phần', 'Bài 7. Lăng kính', 'Bài 8. Thấu kính', 'Bài 9. Thực hành: Đo tiêu cự của thấu kính hội tụ', 'Bài 10. Kính lúp. Bài tập thấu kính',
        'Bài 11. Điện trở. Định luật Ohm', 'Bài 12. Đoạn mạch nối tiếp và song song', 'Bài 13. Năng lượng của dòng điện và công suất điện', 'Bài 14. Cảm ứng điện từ. Nguyên tắc tạo ra dòng điện xoay chiều', 'Bài 15. Tác dụng của dòng điện xoay chiều',
        'Bài 16. Tính chất chung của kim loại', 'Bài 17. Dãy hoạt động hóa học của kim loại', 'Bài 18. Tách kim loại và việc sử dụng hợp kim', 'Bài 19. Sự khác nhau giữa phi kim và kim loại', 'Bài 20. Sơ lược về bảng tuần hoàn các nguyên tố hóa học',
        'Bài 21. Hợp chất hữu cơ và hóa học hữu cơ', 'Bài 22. Ethane', 'Bài 23. Ethylene', 'Bài 24. Acetylene', 'Bài 25. Alcohol ethyl',
        'Bài 26. Acetic acid', 'Bài 27. Lipid và chất béo', 'Bài 28. Protein', 'Bài 29. Polymer', 'Bài 30. Di truyền học Mendel. Cơ sở phân tử của hiện tượng di truyền',
        'Bài 31. Nucleic acid và gene', 'Bài 32. Protein và tính trạng', 'Bài 33. Đột biến gene', 'Bài 34. Nhiễm sắc thể và đột biến nhiễm sắc thể', 'Bài 35. Di truyền học người',
        'Bài 36. Ứng dụng công nghệ di truyền vào đời sống', 'Bài 37. Tiến hóa và sự hình thành loài', 'Bài 38. Các quy luật tiến hóa chủ yếu', 'Bài 39. Sinh vật và môi trường', 'Bài 40. Quản lí tài nguyên thiên nhiên và bảo vệ môi trường'
      ]
    }
  },
  'Lịch sử và Địa lí': {
    'Khối 6': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Lịch sử và cuộc sống', 'Bài 2. Dựa vào đâu để biết và phục dựng lại lịch sử?', 'Bài 3. Thời gian trong lịch sử', 'Bài 4. Nguồn gốc loài người', 'Bài 5. Xã hội nguyên thủy',
        'Bài 6. Sự chuyển biến và phân hóa của xã hội nguyên thủy', 'Bài 7. Ai Cập và Lưỡng Hà cổ đại', 'Bài 8. Ấn Độ cổ đại', 'Bài 9. Trung Quốc từ thời cổ đại đến thế kỉ VII', 'Bài 10. Hy Lạp và La Mã cổ đại',
        'Bài 11. Các quốc gia sơ kì ở Đông Nam Á', 'Bài 12. Sự hình thành và bước đầu phát triển của các vương quốc phong kiến ở Đông Nam Á (từ thế kỉ VII đến thế kỉ X)', 'Bài 13. Giao châu và Nhật Nam từ đầu Công nguyên đến thế kỉ X', 'Bài 14. Các cuộc đấu tranh giành độc lập tự chủ của nhân dân Âu Lạc', 'Bài 15. Cuộc khởi nghĩa Hai Bà Trưng và Bà Triệu',
        'Bài 16. Cuộc khởi nghĩa Lý Bí và sự thành lập nước Vạn Xuân', 'Bài 17. Cuộc khởi nghĩa Mai Thúc Loan và Phùng Hưng', 'Bài 18. Bước ngoặt lịch sử đầu thế kỉ X', 'Bài 19. Vương quốc Chăm-pa', 'Bài 20. Vương quốc Phù Nam',
        'Bài 1. Hệ thống kinh, vĩ tuyến. Tọa độ địa lí', 'Bài 2. Bản đồ. Một số lưới kinh, vĩ tuyến. Phương hướng trên bản đồ', 'Bài 3. Tỉ lệ bản đồ. Tính khoảng cách thực tế dựa vào tỉ lệ bản đồ', 'Bài 4. Kí hiệu và bảng chú giải bản đồ. Tìm đường đi trên bản đồ', 'Bài 5. Lược đồ trí nhớ',
        'Bài 6. Trái Đất trong hệ Mặt Trời', 'Bài 7. Chuyển động tự quay quanh trục của Trái Đất và hệ quả', 'Bài 8. Chuyển động quay quanh Mặt Trời của Trái Đất và hệ quả', 'Bài 9. Xác định phương hướng ngoài thực địa', 'Bài 10. Cấu tạo của Trái Đất. Các mảng kiến tạo',
        'Bài 11. Quá trình nội sinh và quá trình ngoại sinh. Hiện tượng tạo núi', 'Bài 12. Núi lửa và động đất', 'Bài 13. Các dạng địa hình chính trên Trái Đất. Khoáng sản', 'Bài 14. Thực hành: Đọc lược đồ địa hình tỉ lệ lớn và lát cắt địa hình đơn giản', 'Bài 15. Lớp vỏ khí. Khí áp và gió trên Trái Đất',
        'Bài 16. Nhiệt độ không khí. Mây và mưa', 'Bài 17. Thời tiết và khí hậu. Biến đổi khí hậu', 'Bài 18. Thực hành: Phân tích biểu đồ nhiệt độ, lượng mưa', 'Bài 19. Thủy quyển và vòng tuần hoàn lớn của nước', 'Bài 20. Sông và hồ',
        'Bài 21. Biển và đại dương', 'Bài 22. Lớp đất trên Trái Đất', 'Bài 23. Con người và thiên nhiên', 'Bài 24. Rừng nhiệt đới', 'Bài 25. Sự phân bố các đới thiên nhiên trên Trái Đất',
        'Bài 26. Biến đổi khí hậu và ứng phó với biến đổi khí hậu'
      ]
    },
    'Khối 7': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Quá trình hình thành và phát triển của chế độ phong kiến ở Tây Âu', 'Bài 2. Các cuộc phát kiến địa lí và sự hình thành quan hệ sản xuất tư bản chủ nghĩa ở Tây Âu', 'Bài 3. Phong trào Văn hóa Phục hưng và Cải cách tôn giáo', 'Bài 4. Trung Quốc từ thế kỉ VII đến giữa thế kỉ XIX', 'Bài 5. Ấn Độ từ thế kỉ IV đến giữa thế kỉ XIX',
        'Bài 6. Các vương quốc phong kiến Đông Nam Á từ nửa sau thế kỉ X đến nửa đầu thế kỉ XVI', 'Bài 7. Vương quốc Lào', 'Bài 8. Vương quốc Cam-pu-chia', 'Bài 9. Đất nước buổi đầu độc lập (939 - 967)', 'Bài 10. Đại Cồ Việt thời Đinh và Tiền Lê (968 - 1009)',
        'Bài 11. Nhà Lý xây dựng và phát triển đất nước (1009 - 1225)', 'Bài 12. Cuộc kháng chiến chống quân xâm lược Tống (1075 - 1077)', 'Bài 13. Đại Việt thời Trần (1226 - 1400)', 'Bài 14. Ba lần kháng chiến chống quân xâm lược Mông - Nguyên', 'Bài 15. Nước Đại Ngu thời Hồ (1400 - 1407)',
        'Bài 16. Khởi nghĩa Lam Sơn (1418 - 1427)', 'Bài 17. Đại Việt thời Lê sơ (1428 - 1527)', 'Bài 18. Vương quốc Chăm-pa và vùng đất Nam Bộ từ đầu thế kỉ X đến đầu thế kỉ XVI',
        'Bài 1. Vị trí địa lí, đặc điểm tự nhiên châu Âu', 'Bài 2. Đặc điểm dân cư, xã hội châu Âu', 'Bài 3. Khai thác, sử dụng và bảo vệ thiên nhiên ở châu Âu', 'Bài 4. Liên minh châu Âu', 'Bài 5. Vị trí địa lí, đặc điểm tự nhiên châu Á',
        'Bài 6. Đặc điểm dân cư, xã hội châu Á', 'Bài 7. Bản đồ chính trị châu Á. Các khu vực của châu Á', 'Bài 8. Thực hành: Tìm hiểu về các nền kinh tế lớn và kinh tế mới nổi ở châu Á', 'Bài 9. Vị trí địa lí, đặc điểm tự nhiên châu Phi', 'Bài 10. Đặc điểm dân cư, xã hội châu Phi',
        'Bài 11. Phương thức con người khai thác, sử dụng và bảo vệ thiên nhiên ở châu Phi', 'Bài 12. Thực hành: Tìm hiểu khái quát về cộng hòa Nam Phi', 'Bài 13. Vị trí địa lí, đặc điểm tự nhiên châu Mỹ', 'Bài 14. Đặc điểm dân cư, xã hội Bắc Mỹ', 'Bài 15. Đặc điểm dân cư, xã hội Trung và Nam Mỹ',
        'Bài 16. Phương thức con người khai thác, sử dụng và bảo vệ thiên nhiên ở Mỹ La-tinh', 'Bài 17. Đặc điểm dân cư, xã hội Ô-xtrây-li-a', 'Bài 18. Châu Nam Cực'
      ]
    },
    'Khối 8': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Cách mạng tư sản Anh và Chiến tranh giành độc lập của 13 thuộc địa Anh ở Bắc Mỹ', 'Bài 2. Cách mạng tư sản Pháp cuối thế kỉ XVIII', 'Bài 3. Cách mạng công nghiệp', 'Bài 4. Đông Nam Á từ nửa sau thế kỉ XVI đến thế kỉ XIX', 'Bài 5. Cuộc xung đột Nam - Bắc triều và Trịnh - Nguyễn',
        'Bài 6. Công cuộc khai phá vùng đất phía Nam từ thế kỉ XVI đến thế kỉ XVIII', 'Bài 7. Khởi nghĩa Tây Sơn', 'Bài 8. Kinh tế, văn hóa và tôn giáo Đại Việt trong các thế kỉ XVI - XVIII', 'Bài 9. Các nước Anh, Pháp, Đức, Mỹ từ cuối thế kỉ XIX đến đầu thế kỉ XX', 'Bài 10. Sự hình thành chủ nghĩa đế quốc ở Nhật Bản và Trung Quốc cuối thế kỉ XIX - đầu thế kỉ XX',
        'Bài 11. Phong trào công nhân và sự ra đời của chủ nghĩa Mác', 'Bài 12. Chiến tranh thế giới thứ nhất (1914 - 1918) và Cách mạng tháng Mười Nga năm 1917', 'Bài 13. Việt Nam dưới thời nhà Nguyễn (nửa đầu thế kỉ XIX)', 'Bài 14. Cuộc kháng chiến chống thực dân Pháp xâm lược (1858 - 1884)', 'Bài 15. Phong trào chống Pháp của nhân dân Việt Nam cuối thế kỉ XIX',
        'Bài 16. Việt Nam đầu thế kỉ XX',
        'Bài 1. Vị trí địa lí và phạm vi lãnh thổ Việt Nam', 'Bài 2. Địa hình Việt Nam', 'Bài 3. Khoáng sản Việt Nam', 'Bài 4. Đặc điểm chung của khí hậu Việt Nam', 'Bài 5. Thực hành: Vẽ và phân tích biểu đồ khí hậu',
        'Bài 6. Thủy văn Việt Nam', 'Bài 7. Vai trò của tài nguyên khí hậu và tài nguyên nước', 'Bài 8. Tác động của biến đổi khí hậu đối với khí hậu và thủy văn Việt Nam', 'Bài 9. Thổ nhưỡng Việt Nam', 'Bài 10. Sinh vật Việt Nam',
        'Bài 11. Phạm vi biển Đông. Vùng biển đảo Việt Nam', 'Bài 12. Môi trường và tài nguyên biển đảo Việt Nam'
      ]
    },
    'Khối 9': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Liên xô và các nước Đông Âu từ năm 1945 đến giữa những năm 70 của thế kỉ XX', 'Bài 2. Việt Nam từ năm 1918 đến năm 1930', 'Bài 3. Phong trào cách mạng 1930 - 1935 và phong trào dân chủ 1936 - 1939', 'Bài 4. Chiến tranh thế giới thứ hai (1939 - 1945)', 'Bài 5. Cách mạng tháng Tám năm 1945',
        'Bài 6. Cuộc kháng chiến chống thực dân Pháp (1945 - 1954)', 'Bài 7. Việt Nam từ năm 1954 đến năm 1975', 'Bài 8. Việt Nam từ năm 1975 đến năm 1986', 'Bài 9. Công cuộc Đổi mới từ năm 1986 đến nay', 'Bài 10. Thế giới trong và sau Chiến tranh lạnh',
        'Bài 11. Xu thế toàn cầu hóa và cách mạng khoa học - công nghệ',
        'Bài 1. Dân tộc và dân số Việt Nam', 'Bài 2. Nông nghiệp, lâm nghiệp và thủy sản', 'Bài 3. Công nghiệp', 'Bài 4. Các ngành dịch vụ', 'Bài 5. Vùng Trung du và miền núi Bắc Bộ',
        'Bài 6. Vùng Đồng bằng sông Hồng', 'Bài 7. Vùng Bắc Trung Bộ và Duyên hải Nam Trung Bộ', 'Bài 8. Vùng Tây Nguyên', 'Bài 9. Vùng Đông Nam Bộ', 'Bài 10. Vùng Đồng bằng sông Cửu Long',
        'Bài 11. Phát triển kinh tế biển đảo và đảm bảo an ninh quốc phòng'
      ]
    }
  },
  'Giáo dục kinh tế và pháp luật': {
    'Khối 10': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Các hoạt động kinh tế cơ bản trong đời sống xã hội', 'Bài 2. Các chủ thể của nền kinh tế', 'Bài 3. Thị trường và cơ chế thị trường', 'Bài 4. Cơ chế thị trường', 'Bài 5. Ngân sách nhà nước',
        'Bài 6. Thuế', 'Bài 7. Sản xuất kinh doanh và các mô hình sản xuất kinh doanh', 'Bài 8. Tín dụng và vai trò của tín dụng trong đời sống', 'Bài 9. Dịch vụ tín dụng', 'Bài 10. Lập kế hoạch tài chính cá nhân',
        'Bài 11. Hệ thống chính trị nước Cộng hòa xã hội chủ nghĩa Việt Nam', 'Bài 12. Bộ máy nhà nước Cộng hòa xã hội chủ nghĩa Việt Nam', 'Bài 13. Chính quyền địa phương', 'Bài 14. Hiến pháp nước Cộng hòa xã hội chủ nghĩa Việt Nam', 'Bài 15. Nội dung cơ bản của Hiến pháp về chế độ chính trị',
        'Bài 16. Nội dung cơ bản của Hiến pháp về quyền con người, quyền và nghĩa vụ cơ bản của công dân', 'Bài 17. Nội dung cơ bản của Hiến pháp về kinh tế, văn hóa, giáo dục, khoa học, công nghệ và môi trường', 'Bài 18. Nội dung cơ bản của Hiến pháp về bộ máy nhà nước', 'Bài 19. Đặc điểm, cấu trúc và nguồn của pháp luật Việt Nam', 'Bài 20. Hệ thống pháp luật và văn bản quy phạm pháp luật Việt Nam',
        'Bài 21. Thực hiện pháp luật'
      ]
    },
    'Khối 11': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Cạnh tranh trong nền kinh tế thị trường', 'Bài 2. Cung - cầu trong nền kinh tế thị trường', 'Bài 3. Lạm phát', 'Bài 4. Thất nghiệp', 'Bài 5. Thị trường lao động và việc làm',
        'Bài 6. Ý tưởng, cơ hội kinh doanh và năng lực kinh doanh', 'Bài 7. Đạo đức kinh doanh', 'Bài 8. Văn hóa tiêu dùng', 'Bài 9. Quyền bình đẳng của công dân trước pháp luật', 'Bài 10. Bình đẳng trong các lĩnh vực của đời sống xã hội',
        'Bài 11. Quyền bình đẳng giữa các dân tộc, tôn giáo', 'Bài 12. Quyền dân chủ trong tham gia quản lý nhà nước và xã hội', 'Bài 13. Quyền và nghĩa vụ cơ bản của công dân trong tham gia quản lý nhà nước và xã hội', 'Bài 14. Quyền và nghĩa vụ cơ bản của công dân về bầu cử và ứng cử', 'Bài 15. Quyền và nghĩa vụ cơ bản của công dân về khiếu nại, tố cáo',
        'Bài 16. Quyền và nghĩa vụ cơ bản của công dân về bảo vệ Tổ quốc', 'Bài 17. Quyền bất khả xâm phạm về thân thể và quyền được pháp luật bảo hộ về tính mạng, sức khỏe, danh dự, nhân phẩm', 'Bài 18. Quyền bất khả xâm phạm về chỗ ở và quyền được bảo đảm bí mật thư tín, điện thoại, điện tín', 'Bài 19. Quyền tự do ngôn luận, báo chí và tiếp cận thông tin', 'Bài 20. Quyền tự do tín ngưỡng và tôn giáo',
        'Bài 21. Một số hình thức vi phạm pháp luật và trách nhiệm pháp lý'
      ]
    },
    'Khối 12': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Tăng trưởng và phát triển kinh tế', 'Bài 2. Hội nhập kinh tế quốc tế', 'Bài 3. Bảo hiểm', 'Bài 4. An sinh xã hội', 'Bài 5. Lập kế hoạch kinh doanh',
        'Bài 6. Trách nhiệm xã hội của doanh nghiệp', 'Bài 7. Quản lý thu, chi trong gia đình', 'Bài 8. Quyền và nghĩa vụ của công dân về kinh doanh', 'Bài 9. Quyền và nghĩa vụ của công dân về nghĩa vụ nộp thuế', 'Bài 10. Quyền và nghĩa vụ của công dân trong bảo vệ, chăm sóc sức khỏe và an sinh xã hội',
        'Bài 11. Quyền và nghĩa vụ của công dân về môi trường và tài nguyên thiên nhiên', 'Bài 12. Quyền và nghĩa vụ của công dân về giáo dục, khoa học và công nghệ', 'Bài 13. Quyền và nghĩa vụ của công dân trong hôn nhân và gia đình', 'Bài 14. Một số quy định cơ bản của pháp luật về sở hữu trí tuệ và chuyển giao công nghệ', 'Bài 15. Một số quy định cơ bản của pháp luật về hình sự',
        'Bài 16. Một số quy định cơ bản của pháp luật về tố tụng hình sự', 'Bài 17. Một số quy định cơ bản của pháp luật về hành chính', 'Bài 18. Một số quy định cơ bản của pháp luật về tố tụng hành chính', 'Bài 19. Một số quy định cơ bản của pháp luật về dân sự', 'Bài 20. Một số quy định cơ bản của pháp luật về tố tụng dân sự'
      ]
    }
  },
  'Công nghệ': {
    'Khối 6': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Khái quát về nhà ở', 'Bài 2. Xây dựng nhà ở', 'Bài 3. Ngôi nhà thông minh', 'Bài 4. Thực phẩm và dinh dưỡng', 'Bài 5. Phương pháp bảo quản và chế biến thực phẩm',
        'Bài 6. Dự án: Bữa ăn kết nối yêu thương', 'Bài 7. Trang phục và thời trang', 'Bài 8. Sử dụng và bảo dưỡng trang phục', 'Bài 9. Thời trang', 'Bài 10. Khái quát về đồ dùng điện trong gia đình',
        'Bài 11. Đèn điện', 'Bài 12. Nồi cơm điện', 'Bài 13. Bếp hồng ngoại', 'Bài 14. Dự án: An toàn và tiết kiệm điện trong gia đình'
      ]
    },
    'Khối 7': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Giới thiệu về trồng trọt', 'Bài 2. Làm đất trồng cây', 'Bài 3. Gieo trồng, chăm sóc và phòng trừ sâu, bệnh cho cây trồng', 'Bài 4. Thu hoạch sản phẩm trồng trọt', 'Bài 5. Nhân giống vô tính cây trồng',
        'Bài 6. Dự án: Trồng cây trong cốc', 'Bài 7. Giới thiệu về rừng', 'Bài 8. Trồng, chăm sóc và bảo vệ rừng', 'Bài 9. Giới thiệu về chăn nuôi', 'Bài 10. Nuôi dưỡng và chăm sóc vật nuôi',
        'Bài 11. Phòng và trị bệnh cho vật nuôi', 'Bài 12. Chăn nuôi gà thịt trong gia đình', 'Bài 13. Thực hành: Lập kế hoạch và tính toán chi phí chăn nuôi', 'Bài 14. Giới thiệu về thủy sản', 'Bài 15. Nuôi cá ao',
        'Bài 16. Thực hành: Lập kế hoạch và tính toán chi phí nuôi cá ao'
      ]
    },
    'Khối 8': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Tiêu chuẩn trình bày bản vẽ kĩ thuật', 'Bài 2. Hình chiếu vuông góc', 'Bài 3. Bản vẽ chi tiết', 'Bài 4. Bản vẽ lắp', 'Bài 5. Bản vẽ nhà',
        'Bài 6. Vật liệu cơ khí', 'Bài 7. Truyền và biến đổi chuyển động', 'Bài 8. Gia công cơ khí bằng tay', 'Bài 9. Ngành nghề phổ biến trong lĩnh vực cơ khí', 'Bài 10. Dự án: Gia công chi tiết bằng dụng cụ cầm tay',
        'Bài 11. Tai nạn điện và biện pháp an toàn điện', 'Bài 12. Cấu trúc chung của mạng điện trong nhà', 'Bài 13. Thiết bị điện trong gia đình', 'Bài 14. Sơ đồ khối của mạch điện điều khiển đơn giản', 'Bài 15. Cảm biến và mô đun cảm biến',
        'Bài 16. Mạch điện điều khiển sử dụng mô đun cảm biến', 'Bài 17. Ngành nghề phổ biến trong lĩnh vực kĩ thuật điện', 'Bài 18. Dự án: Thiết kế mạch điện điều khiển sử dụng mô đun cảm biến', 'Bài 19. Khái quát về thiết kế kĩ thuật', 'Bài 20. Quy trình thiết kế kĩ thuật'
      ]
    }
  },
  'Giáo dục công dân': {
    'Khối 6': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Tự hào về truyền thống gia đình, dòng họ', 'Bài 2. Yêu thương con người', 'Bài 3. Siêng năng, kiên trì', 'Bài 4. Tôn trọng sự thật', 'Bài 5. Tự lập',
        'Bài 6. Tự nhận thức bản thân', 'Bài 7. Ứng phó với tình huống nguy hiểm', 'Bài 8. Tiết kiệm', 'Bài 9. Công dân nước Cộng hòa xã hội chủ nghĩa Việt Nam', 'Bài 10. Quyền và nghĩa vụ cơ bản của công dân',
        'Bài 11. Quyền cơ bản của trẻ em', 'Bài 12. Thực hiện quyền trẻ em'
      ]
    },
    'Khối 7': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Tự hào về truyền thống quê hương', 'Bài 2. Quan tâm, cảm thông và chia sẻ', 'Bài 3. Học tập tự giác, tích cực', 'Bài 4. Giữ chữ tín', 'Bài 5. Bảo tồn di sản văn hóa',
        'Bài 6. Ứng phó với tâm lí căng thẳng', 'Bài 7. Phòng chống bạo lực học đường', 'Bài 8. Quản lí tiền', 'Bài 9. Phòng, chống tệ nạn xã hội', 'Bài 10. Quyền tài sản và quyền sở hữu trí tuệ',
        'Bài 11. Phòng, chống tai nạn vũ khí, cháy, nổ và các chất độc hại', 'Bài 12. Quyền và nghĩa vụ của công dân trong gia đình'
      ]
    },
    'Khối 8': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Tôn trọng phù hợp với đạo đức và truyền thống', 'Bài 2. Tôn trọng sự đa dạng của các dân tộc', 'Bài 3. Lao động cần cù, sáng tạo', 'Bài 4. Bảo vệ lẽ phải', 'Bài 5. Bảo vệ môi trường và tài nguyên thiên nhiên',
        'Bài 6. Xác định mục tiêu cá nhân', 'Bài 7. Phòng, chống bạo lực gia đình', 'Bài 8. Lập kế hoạch tài chính cá nhân', 'Bài 9. Phòng, chống tệ nạn xã hội', 'Bài 10. Quyền và nghĩa vụ của công dân trong gia đình',
        'Bài 11. Quyền và nghĩa vụ của công dân về khiếu nại, tố cáo', 'Bài 12. Quyền và nghĩa vụ của công dân về sở hữu tài sản và tôn trọng tài sản của người khác'
      ]
    },
    'Khối 9': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Sống có lí tưởng', 'Bài 2. Khoan dung', 'Bài 3. Tích cực tham gia các hoạt động xã hội', 'Bài 4. Khách quan và công bằng', 'Bài 5. Bảo vệ hòa bình',
        'Bài 6. Quản lí thời gian hiệu quả', 'Bài 7. Thích ứng với thay đổi', 'Bài 8. Tiêu dùng thông minh', 'Bài 9. Vi phạm pháp luật và trách nhiệm pháp lý', 'Bài 10. Quyền và nghĩa vụ của công dân về lao động',
        'Bài 11. Quyền và nghĩa vụ của công dân về hôn nhân và gia đình', 'Bài 12. Quyền và nghĩa vụ của công dân về kinh doanh và nghĩa vụ nộp thuế'
      ]
    }
  }
};
