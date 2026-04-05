/**
 * Thư viện dữ liệu bài học (Sách giáo khoa chương trình GDPT 2018)
 * Bao gồm các bộ sách: Kết nối tri thức (KNTT), Cánh diều (CD)
 */

export const LESSON_LIBRARY: Record<string, Record<string, Record<string, string[]>>> = {
  'Toán học': {
    'Khối 12': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Tính đơn điệu và cực trị của hàm số.', 'Bài 2. Giá trị lớn nhất và giá trị nhỏ nhất của hàm số.', 'Bài 3. Đường tiệm cận của đồ thị hàm số.', 'Bài 4. Khảo sát sự biến thiên và vẽ đồ thị của hàm số.', 'Bài 5. Ứng dụng đạo hàm để giải quyết một số vấn đề liên quan đến thực tiễn.',
        'Bài 6. Vectơ trong không gian.', 'Bài 7. Hệ trục toạ độ trong không gian.', 'Bài 8. Biểu thức toạ độ của các phép toán vectơ.', 'Bài 9. Khoảng biến thiên và khoảng tứ phân vị.', 'Bài 10. Phương sai và độ lệch chuẩn.',
        'Bài 11. Nguyên hàm.', 'Bài 12. Tích phân.', 'Bài 13. Ứng dụng hình học của tích phân.', 'Bài 14. Phương trình mặt phẳng.', 'Bài 15. Phương trình đường thẳng trong không gian.',
        'Bài 16. Công thức tính góc trong không gian.', 'Bài 17. Phương trình mặt cầu.', 'Bài 18. Xác suất có điều kiện.', 'Bài 19. Công thức xác suất toàn phần và công thức Bayes.'
      ]
    },
    'Khối 11': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Giá trị lượng giác của góc lượng giác.', 'Bài 2. Công thức lượng giác.', 'Bài 3. Hàm số lượng giác.', 'Bài 4. Phương trình lượng giác cơ bản.', 'Bài 5. Dãy số.',
        'Bài 6. Cấp số cộng.', 'Bài 7. Cấp số nhân.', 'Bài 8. Mẫu số liệu ghép nhóm.', 'Bài 9. Các số đặc trưng đo xu thế trung tâm.', 'Bài 10. Đường thẳng và mặt phẳng trong không gian.',
        'Bài 11. Hai đường thẳng song song.', 'Bài 12. Đường thẳng và mặt phẳng song song.', 'Bài 13. Hai mặt phẳng song song.', 'Bài 14. Phép chiếu song song.', 'Bài 15. Giới hạn của dãy số.',
        'Bài 16. Giới hạn của hàm số.', 'Bài 17. Hàm số liên tục.', 'Bài 18. Luỹ thừa với số mũ thực.', 'Bài 19. Lôgarit.', 'Bài 20. Hàm số mũ và hàm số lôgarit.',
        'Bài 21. Phương trình, bất phương trình mũ và lôgarit.', 'Bài 22. Hai đường thẳng vuông góc.', 'Bài 23. Đường thẳng vuông góc với mặt phẳng.', 'Bài 24. Phép chiếu vuông góc. Góc giữa đường thẳng và mặt phẳng.', 'Bài 25. Hai mặt phẳng vuông góc.',
        'Bài 26. Khoảng cách.', 'Bài 27. Thể tích.', 'Bài 28. Biến cố hợp, biến cố giao, biến cố độc lập.', 'Bài 29. Công thức cộng xác suất.', 'Bài 30. Công thức nhân xác suất cho hai biến cố độc lập.',
        'Bài 31. Định nghĩa và ý nghĩa của đạo hàm.', 'Bài 32. Các quy tắc tính đạo hàm.', 'Bài 33. Đạo hàm cấp hai.'
      ]
    },
    'Khối 10': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Mệnh đề.', 'Bài 2. Tập hợp và các phép toán trên tập hợp.', 'Bài 3. Bất phương trình bậc nhất hai ẩn.', 'Bài 4. Hệ bất phương trình bậc nhất hai ẩn.', 'Bài 5. Giá trị lượng giác của một góc từ 0° đến 180°.',
        'Bài 6. Hệ thức lượng trong tam giác.', 'Bài 7. Các khái niệm mở đầu.', 'Bài 8. Tổng và hiệu của hai vectơ.', 'Bài 9. Tích của vectơ với một số.', 'Bài 10. Vectơ trong mặt phẳng toạ độ.',
        'Bài 11. Tích vô hướng của hai vectơ.', 'Bài 12. Số gần đúng và sai số.', 'Bài 13. Các số đặc trưng đo xu thế trung tâm.', 'Bài 14. Các số đặc trưng đo độ phân tán.', 'Bài 15. Hàm số.',
        'Bài 16. Hàm số bậc hai.', 'Bài 17. Dấu của tam thức bậc hai.', 'Bài 18. Phương trình quy về phương trình bậc hai.', 'Bài 19. Phương trình đường thẳng.', 'Bài 20. Đường thẳng trong mặt phẳng toạ độ.',
        'Bài 21. Đường tròn trong mặt phẳng toạ độ.', 'Bài 22. Ba đường conic.', 'Bài 23. Quy tắc đếm.', 'Bài 24. Hoán vị, chỉnh hợp và tổ hợp.', 'Bài 25. Nhị thức Newton.',
        'Bài 26. Biến cố và định nghĩa cổ điển của xác suất.', 'Bài 27. Thực hành tính xác suất theo định nghĩa cổ điển.'
      ]
    },
    'Khối 7': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Tập hợp các số hữu tỉ.', 'Bài 2. Cộng, trừ, nhân, chia số hữu tỉ.', 'Bài 3. Luỹ thừa với số mũ tự nhiên của một số hữu tỉ.', 'Bài 4. Thứ tự thực hiện các phép tính. Quy tắc chuyển vế.', 'Bài 5. Làm quen với số thập phân vô hạn tuần hoàn.',
        'Bài 6. Số vô tỉ. Căn bậc hai số học.', 'Bài 7. Tập hợp các số thực.', 'Bài 8. Góc ở vị trí đặc biệt. Tia phân giác của một góc.', 'Bài 9. Hai đường thẳng song song và dấu hiệu nhận biết.', 'Bài 10. Tiên đề Euclid. Tính chất của hai đường thẳng song song.',
        'Bài 11. Định lí và chứng minh định lí.', 'Bài 12. Tổng các góc trong một tam giác.', 'Bài 13. Hai tam giác bằng nhau. Trường hợp bằng nhau thứ nhất của tam giác.', 'Bài 14. Trường hợp bằng nhau thứ hai và thứ ba của tam giác.', 'Bài 15. Các trường hợp bằng nhau của tam giác vuông.',
        'Bài 16. Tam giác cân. Đường trung trực của đoạn thẳng.', 'Bài 17. Thu thập và phân loại dữ liệu.', 'Bài 18. Biểu đồ hình quạt tròn.', 'Bài 19. Biểu đồ đoạn thẳng.', 'Bài 20. Tỉ lệ thức.',
        'Bài 21. Tính chất của dãy tỉ số bằng nhau.', 'Bài 22. Đại lượng tỉ lệ thuận.', 'Bài 23. Đại lượng tỉ lệ nghịch.', 'Bài 24. Biểu thức đại số.', 'Bài 25. Đa thức một biến.',
        'Bài 26. Phép cộng và phép trừ đa thức một biến.', 'Bài 27. Phép nhân đa thức một biến.', 'Bài 28. Phép chia đa thức một biến.', 'Bài 29. Làm quen với biến cố.', 'Bài 30. Làm quen với xác suất của biến cố.',
        'Bài 31. Quan hệ giữa góc và cạnh đối diện trong một tam giác.', 'Bài 32. Quan hệ giữa đường vuông góc và đường xiên.', 'Bài 33. Quan hệ giữa ba cạnh của một tam giác.', 'Bài 34. Sự đồng quy của ba trung tuyến, ba đường phân giác trong một tam giác.', 'Bài 35. Sự đồng quy của ba đường trung trực, ba đường cao trong một tam giác.',
        'Bài 36. Hình hộp chữ nhật và hình lập phương.', 'Bài 37. Hình lăng trụ đứng tam giác và hình lăng trụ đứng tứ giác.'
      ]
    },
    'Khối 8': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Đơn thức.', 'Bài 2. Đa thức.', 'Bài 3. Phép cộng và phép trừ đa thức.', 'Bài 4. Phép nhân đa thức.', 'Bài 5. Phép chia đa thức cho đơn thức.',
        'Bài 6. Hiệu hai bình phương. Bình phương của một tổng hay một hiệu.', 'Bài 7. Lập phương của một tổng hay một hiệu.', 'Bài 8. Tổng và hiệu hai lập phương.', 'Bài 9. Phân tích đa thức thành nhân tử.', 'Bài 10. Tứ giác.',
        'Bài 11. Hình thang cân.', 'Bài 12. Hình bình hành.', 'Bài 13. Hình chữ nhật.', 'Bài 14. Hình thoi và hình vuông.', 'Bài 15. Định lí Thalès trong tam giác.',
        'Bài 16. Đường trung bình của tam giác.', 'Bài 17. Tính chất đường phân giác của tam giác.', 'Bài 18. Thu thập và phân loại dữ liệu.', 'Bài 19. Biểu diễn dữ liệu bằng bảng, biểu đồ.', 'Bài 20. Phân tích số liệu thống kê dựa vào biểu đồ.',
        'Bài 21. Phân thức đại số.', 'Bài 22. Tính chất cơ bản của phân thức đại số.', 'Bài 23. Phép cộng và phép trừ phân thức đại số.', 'Bài 24. Phép nhân và phép chia phân thức đại số.', 'Bài 25. Phương trình bậc nhất một ẩn.',
        'Bài 26. Giải bài toán bằng cách lập phương trình.', 'Bài 27. Khái niệm hàm số và đồ thị của hàm số.', 'Bài 28. Hàm số bậc nhất và đồ thị của hàm số bậc nhất.', 'Bài 29. Hệ số góc của đường thẳng.', 'Bài 30. Kết quả có thể và kết quả thuận lợi.',
        'Bài 31. Cách tính xác suất của biến cố bằng tỉ số.', 'Bài 32. Mối liên hệ giữa xác suất thực nghiệm với xác suất và ứng dụng.', 'Bài 33. Hai tam giác đồng dạng.', 'Bài 34. Ba trường hợp đồng dạng của hai tam giác.', 'Bài 35. Định lí Pythagore và ứng dụng.',
        'Bài 36. Các trường hợp đồng dạng của hai tam giác vuông.', 'Bài 37. Hình đồng dạng.', 'Bài 38. Hình chóp tam giác đều.', 'Bài 39. Hình chóp tứ giác đều.'
      ]
    },
    'Khối 9': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Khái niệm phương trình và hệ hai phương trình bậc nhất hai ẩn.', 'Bài 2. Giải hệ hai phương trình bậc nhất hai ẩn.', 'Bài 3. Giải bài toán bằng cách lập hệ phương trình.', 'Bài 4. Phương trình quy về phương trình bậc nhất một ẩn.', 'Bài 5. Bất đẳng thức và tính chất.',
        'Bài 6. Bất phương trình bậc nhất một ẩn.', 'Bài 7. Căn bậc hai và căn thức bậc hai.', 'Bài 8. Khai căn bậc hai với phép nhân và phép chia.', 'Bài 9. Biến đổi đơn giản và rút gọn biểu thức chứa căn thức bậc hai.', 'Bài 10. Căn bậc ba và căn thức bậc ba.',
        'Bài 11. Tỉ số lượng giác của góc nhọn.', 'Bài 12. Một số hệ thức giữa cạnh, góc trong tam giác vuông và ứng dụng.', 'Bài 13. Mở đầu về đường tròn.', 'Bài 14. Cung và dây của đường tròn.', 'Bài 15. Độ dài cung tròn. Diện tích hình quạt tròn và hình vành khuyên.',
        'Bài 16. Vị trí tương đối của đường thẳng và đường tròn.', 'Bài 17. Vị trí tương đối của hai đường tròn.', 'Bài 18. Hàm số y = ax^2 (a ≠ 0).', 'Bài 19. Phương trình bậc hai một ẩn.', 'Bài 20. Định lí Viète và ứng dụng.',
        'Bài 21. Giải bài toán bằng cách lập phương trình.', 'Bài 22. Bảng tần số và biểu đồ tần số.', 'Bài 23. Bảng tần số tương đối và biểu đồ tần số tương đối.', 'Bài 24. Bảng tần số, tần số tương đối ghép nhóm và biểu đồ.', 'Bài 25. Phép thử ngẫu nhiên và không gian mẫu.',
        'Bài 26. Xác suất của biến cố liên quan tới phép thử.', 'Bài 27. Góc nội tiếp.', 'Bài 28. Đường tròn ngoại tiếp và đường tròn nội tiếp của một tam giác.', 'Bài 29. Tứ giác nội tiếp.', 'Bài 30. Đa giác đều.',
        'Bài 31. Hình trụ và hình nón.', 'Bài 32. Hình cầu.'
      ]
    },
    'Khối 6': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Tập hợp', 'Bài 2. Cách ghi số tự nhiên', 'Bài 3. Thứ tự trong tập hợp các số tự nhiên', 'Bài 4. Phép cộng và phép trừ số tự nhiên', 'Bài 5. Phép nhân và phép chia số tự nhiên',
        'Bài 6. Luỹ thừa với số mũ tự nhiên', 'Bài 7. Thứ tự thực hiện các phép tính', 'Bài 8. Quan hệ chia hết và tính chất', 'Bài 9. Dấu hiệu chia hết', 'Bài 10. Số nguyên tố',
        'Bài 11. Ước chung. Ước chung lớn nhất', 'Bài 12. Bội chung. Bội chung nhỏ nhất', 'Bài 13. Tập hợp các số nguyên', 'Bài 14. Phép cộng và phép trừ số nguyên', 'Bài 15. Quy tắc dấu ngoặc',
        'Bài 16. Phép nhân số nguyên', 'Bài 17. Phép chia hết. Ước và bội của một số nguyên', 'Bài 18. Hình tam giác đều. Hình vuông. Hình lục giác đều', 'Bài 19. Hình chữ nhật. Hình thoi. Hình bình hành. Hình thang cân', 'Bài 20. Chu vi và diện tích của một số tứ giác đã học',
        'Bài 21. Hình có trục đối xứng', 'Bài 22. Hình có tâm đối xứng', 'Bài 23. Mở rộng phân số. Phân số bằng nhau', 'Bài 24. So sánh phân số. Hỗn số dương', 'Bài 25. Phép cộng và phép trừ phân số',
        'Bài 26. Phép nhân và phép chia phân số', 'Bài 27. Hai bài toán về phân số', 'Bài 28. Số thập phân', 'Bài 29. Tính toán với số thập phân', 'Bài 30. Làm tròn và ước lượng',
        'Bài 31. Một số bài toán về tỉ số và tỉ số phần trăm', 'Bài 32. Điểm và đường thẳng', 'Bài 33. Điểm nằm giữa hai điểm. Tia', 'Bài 34. Đoạn thẳng. Độ dài đoạn thẳng', 'Bài 35. Trung điểm của đoạn thẳng',
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
        'Bài 1. Cấu trúc của chất. Sự chuyển thể.', 'Bài 2. Nội năng. Định luật I của nhiệt động lực học.', 'Bài 3. Nhiệt độ. Thang nhiệt độ – nhiệt kế.', 'Bài 4. Nhiệt dung riêng.', 'Bài 5. Nhiệt nóng chảy riêng.',
        'Bài 6. Nhiệt hóa hơi riêng.', 'Bài 7. Bài tập về vật lí nhiệt.', 'Bài 8. Mô hình động học phân tử chất khí.', 'Bài 9. Định luật Boyle.', 'Bài 10. Định luật Charles.',
        'Bài 11. Phương trình trạng thái của khí lí tưởng.', 'Bài 12. Áp suất khí theo mô hình động học phân tử. Quan hệ giữa động năng phân tử và nhiệt độ.', 'Bài 13. Bài tập về khí lí tưởng.', 'Bài 14. Từ trường.', 'Bài 15. Lực từ tác dụng lên dây dẫn mang dòng điện. Cảm ứng từ.',
        'Bài 16. Từ thông. Hiện tượng cảm ứng điện từ.', 'Bài 17. Máy phát điện xoay chiều.', 'Bài 18. Ứng dụng hiện tượng cảm ứng điện từ.', 'Bài 19. Điện từ trường. Mô hình sóng điện từ.', 'Bài 20. Bài tập về từ trường.',
        'Bài 21. Cấu trúc hạt nhân.', 'Bài 22. Phản ứng hạt nhân và năng lượng liên kết.', 'Bài 23. Hiện tượng phóng xạ.', 'Bài 24. Công nghiệp hạt nhân.', 'Bài 25. Bài tập về vật lí hạt nhân.'
      ]
    },
    'Khối 11': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Dao động điều hoà', 'Bài 2. Mô tả dao động điều hoà', 'Bài 3. Vận tốc, gia tốc trong dao động điều hoà', 'Bài 4. Bài tập về dao động điều hoà', 'Bài 5. Động năng. Thế năng. Sự chuyển hoá năng lượng giữa động năng và thế năng trong dao động điều hoà',
        'Bài 6. Dao động tắt dần. Dao động cưỡng bức. Hiện tượng cộng hưởng', 'Bài 7. Bài tập về sự chuyển năng lượng trong dao động điều hoà', 'Bài 8. Mô tả sóng', 'Bài 9. Sóng ngang, sóng dọc, sự truyền năng lượng của sóng cơ', 'Bài 10. Thực hành: Đo tần số của sóng âm',
        'Bài 11. Sóng điện từ', 'Bài 12. Giao thoa sóng', 'Bài 13. Sóng dừng', 'Bài 14. Bài tập về sóng', 'Bài 15. Thực hành: Đo tốc độ truyền âm',
        'Bài 16. Lực tương tác giữa hai điện tích', 'Bài 17. Khái niệm điện trường', 'Bài 18. Điện trường đều', 'Bài 19. Thế năng điện', 'Bài 20. Điện thế',
        'Bài 21. Tụ điện', 'Bài 22. Cường độ dòng điện', 'Bài 23. Điện trở. Định luật Ohm', 'Bài 24. Nguồn điện', 'Bài 25. Năng lượng điện và công suất điện',
        'Bài 26. Thực hành: Đo suất điện động và điện trở trong của pin điện hoá'
      ]
    },
    'Khối 10': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Làm quen với Vật lí.', 'Bài 2. Các quy tắc an toàn trong phòng thực hành Vật lí.', 'Bài 3. Thực hành tính sai số trong phép đo. Ghi kết quả đo.',
        'Bài 4. Độ dịch chuyển và quãng đường đi được.', 'Bài 5. Tốc độ và vận tốc.', 'Bài 6. Thực hành: Đo tốc độ của vật chuyển động.', 'Bài 7. Đồ thị độ dịch chuyển – thời gian.', 'Bài 8. Chuyển động biến đổi. Gia tốc.', 'Bài 9. Chuyển động thẳng biến đổi đều.', 'Bài 10. Sự rơi tự do.',
        'Bài 11. Thực hành: Đo gia tốc rơi tự do.', 'Bài 12. Chuyển động ném.', 'Bài 13. Tổng hợp và phân tích lực. Cân bằng lực.', 'Bài 14. Định luật 1 Newton.', 'Bài 15. Định luật 2 Newton.',
        'Bài 16. Định luật 3 Newton.', 'Bài 17. Trọng lực và lực căng.', 'Bài 18. Lực ma sát.', 'Bài 19. Lực cản và lực nâng.', 'Bài 20. Một số ví dụ về cách giải các bài toán thuộc phần động lực học.',
        'Bài 21. Moment lực. Cân bằng của vật rắn.', 'Bài 22. Thực hành: Tổng hợp lực.', 'Bài 23. Năng lượng. Công cơ học.', 'Bài 24. Công suất.', 'Bài 25. Động năng, thế năng.',
        'Bài 26. Cơ năng và định luật bảo toàn cơ năng.', 'Bài 27. Hiệu suất.', 'Bài 28. Động lượng.', 'Bài 29. Định luật bảo toàn động lượng.', 'Bài 30. Thực hành: Xác định động lượng của vật trước và sau va chạm.',
        'Bài 31. Động học của chuyển động tròn đều.', 'Bài 32. Lực hướng tâm và gia tốc hướng tâm.', 'Bài 33. Biến dạng của vật rắn.', 'Bài 34. Khối lượng riêng. Áp suất chất lỏng.'
      ]
    }
  },
  'Hóa học': {
    'Khối 12': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Ester – Lipid.', 'Bài 2. Xà phòng và chất giặt rửa.', 'Bài 3. Ôn tập chương 1.', 'Bài 4. Giới thiệu về carbohydrate. Glucose và fructose.', 'Bài 5. Saccharose và maltose.',
        'Bài 6. Tinh bột và cellulose.', 'Bài 7. Ôn tập chương 2.', 'Bài 8. Amine.', 'Bài 9. Amino acid và peptide.', 'Bài 10. Protein và enzyme.',
        'Bài 11. Ôn tập chương 3.', 'Bài 12. Đại cương về polymer.', 'Bài 13. Vật liệu polymer.', 'Bài 14. Ôn tập chương 4.', 'Bài 15. Thế điện cực và nguồn điện hóa học.',
        'Bài 16. Điện phân.', 'Bài 17. Ôn tập chương 5.', 'Bài 18. Cấu tạo và liên kết trong tinh thể kim loại.', 'Bài 19. Tính chất vật lí và tính chất hóa học của kim loại.', 'Bài 20. Kim loại trong tự nhiên và phương pháp tách kim loại.',
        'Bài 21. Hợp kim.', 'Bài 22. Sự ăn mòn kim loại.', 'Bài 23. Ôn tập chương 6.', 'Bài 24. Nguyên tố nhóm IA.', 'Bài 25. Nguyên tố nhóm IIA.',
        'Bài 26. Ôn tập chương 7.', 'Bài 27. Đại cương về kim loại chuyển tiếp dãy thứ nhất.', 'Bài 28. Sơ lược về phức chất.', 'Bài 29. Một số tính chất và ứng dụng của phức chất.', 'Bài 30. Ôn tập chương 8.'
      ]
    },
    'Khối 11': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Khái niệm về cân bằng hoá học.', 'Bài 2. Cân bằng trong dung dịch nước.', 'Bài 3. Ôn tập chương 1.', 'Bài 4. Nitrogen.', 'Bài 5. Ammonia – Muối ammonium.',
        'Bài 6. Một số hợp chất của nitrogen với oxygen.', 'Bài 7. Sulfur và sulfur dioxide.', 'Bài 8. Sulfuric acid và muối sulfate.', 'Bài 9. Ôn tập chương 2.', 'Bài 10. Hợp chất hữu cơ và hoá học hữu cơ.',
        'Bài 11. Phương pháp tách biệt và tinh chế hợp chất hữu cơ.', 'Bài 12. Công thức phân tử hợp chất hữu cơ.', 'Bài 13. Cấu tạo hoá học hợp chất hữu cơ.', 'Bài 14. Ôn tập chương 3.', 'Bài 15. Alkane.',
        'Bài 16. Hydrocarbon không no.', 'Bài 17. Arene (Hydrocarbon thơm).', 'Bài 18. Ôn tập chương 4.', 'Bài 19. Dẫn xuất halogen.', 'Bài 20. Alcohol.',
        'Bài 21. Phenol.', 'Bài 22. Ôn tập chương 5.', 'Bài 23. Hợp chất carbonyl.', 'Bài 24. Carboxylic acid.', 'Bài 25. Ôn tập chương 6.'
      ]
    },
    'Khối 10': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Thành phần của nguyên tử.', 'Bài 2. Nguyên tố hoá học.', 'Bài 3. Cấu trúc lớp vỏ electron nguyên tử.', 'Bài 4. Ôn tập chương 1.', 'Bài 5. Cấu tạo của bảng tuần hoàn các nguyên tố hoá học.',
        'Bài 6. Xu hướng biến đổi một số tính chất của nguyên tử các nguyên tố trong một chu kì và trong một nhóm.', 'Bài 7. Xu hướng biến đổi thành phần và một số tính chất của hợp chất trong một chu kì.', 'Bài 8. Định luật tuần hoàn. Ý nghĩa của bảng tuần hoàn các nguyên tố hoá học.', 'Bài 9. Ôn tập chương 2.', 'Bài 10. Quy tắc octet.',
        'Bài 11. Liên kết ion.', 'Bài 12. Liên kết cộng hoá trị.', 'Bài 13. Liên kết hydrogen và tương tác van der Waals.', 'Bài 14. Ôn tập chương 3.', 'Bài 15. Phản ứng oxi hoá – khử.',
        'Bài 16. Ôn tập chương 4.', 'Bài 17. Biến thiên enthalpy trong các phản ứng hoá học.', 'Bài 18. Ôn tập chương 5.', 'Bài 19. Tốc độ phản ứng.', 'Bài 20. Ôn tập chương 6.',
        'Bài 21. Nhóm halogen.', 'Bài 22. Hydrogen halide. Muối halide.', 'Bài 23. Ôn tập chương 7.'
      ]
    }
  },
  'Sinh học': {
    'Khối 12': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. DNA và cơ chế tái bản DNA.', 'Bài 2. Gene, quá trình truyền đạt thông tin di truyền và hệ gene.', 'Bài 3. Điều hòa biểu hiện gene.', 'Bài 4. Đột biến gene.', 'Bài 5. Công nghệ di truyền.',
        'Bài 6. Thực hành: Tách chiết DNA.', 'Bài 7. Cấu trúc và chức năng của nhiễm sắc thể.', 'Bài 8. Học thuyết di truyền của Mendel.', 'Bài 9. Mở rộng học thuyết Mendel.', 'Bài 10. Di truyền giới tính và di truyền liên kết với giới tính.',
        'Bài 11. Liên kết gene và hoán vị gene.', 'Bài 12. Đột biến nhiễm sắc thể.', 'Bài 13. Di truyền học người và di truyền y học.', 'Bài 14. Thực hành: Quan sát một số dạng đột biến nhiễm sắc thể.', 'Bài 15. Di truyền gene ngoài nhân.',
        'Bài 16. Tương tác giữa kiểu gene với môi trường và thành tựu chọn giống.', 'Bài 17. Thực hành: Thí nghiệm về thường biến ở cây trồng.', 'Bài 18. Di truyền quần thể.', 'Bài 19. Các bằng chứng tiến hoá.', 'Bài 20. Quan niệm của Darwin về chọn lọc tự nhiên và hình thành loài.',
        'Bài 21. Học thuyết tiến hoá tổng hợp hiện đại.', 'Bài 22. Tiến hoá lớn và quá trình phát sinh chủng loại.', 'Bài 23. Môi trường và các nhân tố sinh thái.', 'Bài 24. Sinh thái học quần thể.', 'Bài 25. Thực hành: Xác định khu vực phân bố, kiểu phân bố cá thể và ước tính kích thước mật độ của quần thể thực vật hoặc động vật ít di chuyển.',
        'Bài 26. Quần xã sinh vật.', 'Bài 27. Thực hành: Tìm hiểu một số đặc trưng cơ bản của quần xã trong tự nhiên.', 'Bài 28. Hệ sinh thái.', 'Bài 29. Trao đổi chất và chuyển hóa năng lượng trong hệ sinh thái.', 'Bài 30. Diễn thế.',
        'Bài 31. Sinh quyển, các chu trình sinh – địa – hóa.', 'Bài 32. Thực hành: Thiết kế một hệ sinh thái nhân tạo.', 'Bài 33. Sinh thái học phục hồi và bảo tồn đa dạng.', 'Bài 34. Phát triển bền vững.', 'Bài 35. Dự án: Tìm hiểu thực trạng bảo tồn sinh thái tại địa phương và đề xuất giải pháp bảo tồn.'
      ]
    },
    'Khối 11': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Khái quát về trao đổi chất và chuyển hóa năng lượng', 'Bài 2. Trao đổi nước và khoáng ở thực vật', 'Bài 3. Thực hành: Trao đổi nước và khoáng ở thực vật', 'Bài 4. Quang hợp ở thực vật', 'Bài 5. Thực hành: Quang hợp ở thực vật',
        'Bài 6. Hô hấp ở thực vật', 'Bài 7. Thực hành: Hô hấp ở thực vật', 'Bài 8. Dinh dưỡng và tiêu hóa ở động vật', 'Bài 9. Hô hấp ở động vật', 'Bài 10. Tuần hoàn ở động vật',
        'Bài 11. Thực hành: Một số thí nghiệm về hệ tuần hoàn', 'Bài 12. Miễn dịch ở động vật và người', 'Bài 13. Bài tiết và cân bằng nội môi', 'Bài 14. Khái quát về cảm ứng ở sinh vật', 'Bài 15. Cảm ứng ở thực vật',
        'Bài 16. Thực hành: Cảm ứng ở thực vật', 'Bài 17. Cảm ứng ở động vật', 'Bài 18. Tập tính ở động vật', 'Bài 19. Khái quát về sinh trưởng và phát triển ở sinh vật', 'Bài 20. Sinh trưởng và phát triển ở thực vật',
        'Bài 21. Thực hành: Bấm ngọn, tỉa cành, tính tuổi cây', 'Bài 22. Sinh trưởng và phát triển ở động vật', 'Bài 23. Thực hành: Quan sát quá trình biến thái ở động vật', 'Bài 24. Khái quát về sinh sản ở sinh vật', 'Bài 25. Sinh sản ở thực vật',
        'Bài 26. Thực hành: Nhân giống vô tính và thụ phấn cho cây', 'Bài 27. Sinh sản ở động vật', 'Bài 28. Mối quan hệ giữa các quá trình sinh lí trong cơ thể sinh vật', 'Bài 29. Một số ngành nghề liên quan đến sinh học cơ thể'
      ]
    },
    'Khối 10': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Giới thiệu khái quát môn Sinh học.', 'Bài 2. Phương pháp nghiên cứu và học tập môn Sinh học.', 'Bài 3. Các cấp độ tổ chức của thế giới sống.', 'Bài 4. Các nguyên tố hoá học và nước.', 'Bài 5. Các phân tử sinh học.',
        'Bài 6. Thực hành: Nhận biết một số phân tử sinh học.', 'Bài 7. Tế bào nhân sơ.', 'Bài 8. Tế bào nhân thực.', 'Bài 9. Thực hành: Quan sát tế bào.', 'Bài 10. Trao đổi chất qua màng tế bào.',
        'Bài 11. Thực hành: Thí nghiệm co và phản co nguyên sinh.', 'Bài 12. Truyền tin tế bào.', 'Bài 13. Khái quát về chuyển hoá vật chất và năng lượng.', 'Bài 14. Phân giải và tổng hợp các chất trong tế bào.', 'Bài 15. Thực hành: Thí nghiệm phân tích ảnh hưởng của một số yếu tố đến hoạt tính của enzyme và kiểm tra hoạt tính của enzyme amylase.',
        'Bài 16. Chu kì tế bào và nguyên phân.', 'Bài 17. Giảm phân.', 'Bài 18. Thực hành: Làm và quan sát tiêu bản quá trình nguyên phân và giảm phân.', 'Bài 19. Công nghệ tế bào.', 'Bài 20. Sự đa dạng và phương pháp nghiên cứu vi sinh vật.',
        'Bài 21. Trao đổi chất, sinh trưởng và sinh sản ở vi sinh vật.', 'Bài 22. Vai trò và ứng dụng của vi sinh vật.', 'Bài 23. Thực hành: Một số phương pháp nghiên cứu vi sinh vật thông dụng, tìm hiểu về các sản phẩm công nghệ vi sinh vật và làm một số sản phẩm lên men từ vi sinh vật.', 'Bài 24. Khái quát về virus.', 'Bài 25. Một số bệnh do virus và các thành tựu nghiên cứu ứng dụng virus.',
        'Bài 26. Thực hành: Điều tra một số bệnh do virus và tuyên truyền phòng chống bệnh.'
      ]
    }
  },
  'Lịch sử': {
    'Khối 12': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Liên hợp quốc.', 'Bài 2. Trật tự thế giới trong Chiến tranh lạnh.', 'Bài 3. Trật tự thế giới sau Chiến tranh lạnh.', 'Bài 4. Sự ra đời và phát triển của Hiệp hội các quốc gia Đông Nam Á (ASEAN).', 'Bài 5. Cộng đồng ASEAN: Từ ý tưởng đến hiện thực.',
        'Bài 6. Cách mạng tháng Tám năm 1945.', 'Bài 7. Cuộc kháng chiến chống thực dân Pháp (1945 – 1954).', 'Bài 8. Cuộc kháng chiến chống Mỹ, cứu nước (1954 – 1975).', 'Bài 9. Cuộc đấu tranh bảo vệ Tổ quốc từ sau tháng 4 – 1975 đến nay. Một số bài học lịch sử của các cuộc kháng chiến bảo vệ Tổ quốc từ năm 1945 đến nay.', 'Bài 10. Khái quát về công cuộc Đổi mới từ năm 1986 đến nay.',
        'Bài 11. Thành tựu cơ bản và bài học của công cuộc Đổi mới ở Việt Nam từ năm 1986 đến nay.', 'Bài 12. Hoạt động đối ngoại của Việt Nam trong đấu tranh giành độc lập dân tộc (từ đầu thế kỉ XX đến Cách mạng tháng Tám năm 1945).', 'Bài 13. Hoạt động đối ngoại của Việt Nam trong kháng chiến chống Pháp (1945 – 1954) và kháng chiến chống Mỹ (1954 – 1975).', 'Bài 14. Hoạt động đối ngoại của Việt Nam từ năm 1975 đến nay.', 'Bài 15. Khái quát cuộc đời và sự nghiệp của Hồ Chí Minh.',
        'Bài 16. Hồ Chí Minh – Anh hùng giải phóng dân tộc.', 'Bài 17. Dấu ấn Hồ Chí Minh trong lòng nhân dân thế giới và Việt Nam.'
      ]
    },
    'Khối 11': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Một số vấn đề chung về cách mạng tư sản.', 'Bài 2. Sự xác lập và phát triển của chủ nghĩa tư bản.', 'Bài 3. Sự hình thành Liên bang Cộng hoà xã hội chủ nghĩa Xô viết.', 'Bài 4. Sự phát triển của chủ nghĩa xã hội từ sau Chiến tranh thế giới thứ hai đến nay.', 'Bài 5. Quá trình xâm lược và cai trị của chủ nghĩa thực dân ở Đông Nam Á.',
        'Bài 6. Hành trình đi đến độc lập dân tộc ở Đông Nam Á.', 'Bài 7. Chiến tranh bảo vệ Tổ quốc trong lịch sử Việt Nam.', 'Bài 8. Một số cuộc khởi nghĩa và chiến tranh giải phóng lịch sử Việt Nam (từ thế kỉ III trước Công nguyên đến cuối thế kỉ XIX).', 'Bài 9. Cuộc cải cách của Hồ Quý Ly và triều Hồ.', 'Bài 10. Cuộc cải cách của Lê Thánh Tông (thế kỉ XV).',
        'Bài 11. Cuộc cải cách của Minh Mạng (nửa đầu thế kỉ XIX).', 'Bài 12. Vị trí và tầm quan trọng của Biển Đông.', 'Bài 13. Việt Nam và Biển Đông.'
      ]
    },
    'Khối 10': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Hiện thực lịch sử và nhận thức lịch sử.', 'Bài 2. Tri thức lịch sử và cuộc sống.', 'Bài 3. Sử học với các lĩnh vực khoa học.', 'Bài 4. Sử học với một số lĩnh vực, ngành nghề hiện đại.', 'Bài 5. Khái niệm văn minh. Một số nền văn minh phương Đông thời kì cổ – trung đại.',
        'Bài 6. Một số nền văn minh phương Tây thời kì cổ – trung đại.', 'Bài 7. Các cuộc cách mạng công nghiệp thời kì cận đại.', 'Bài 8. Các cuộc cách mạng công nghiệp thời kì hiện đại.', 'Bài 9. Cơ sở hình thành văn minh Đông Nam Á thời kì cổ – trung đại.', 'Bài 10. Hành trình phát triển và thành tựu của văn minh Đông Nam Á thời kì cổ – trung đại.',
        'Bài 11. Một số nền văn minh cổ trên đất nước Việt Nam.', 'Bài 12. Văn minh Đại Việt.', 'Bài 13. Đời sống vật chất và tinh thần của cộng đồng các dân tộc Việt Nam.', 'Bài 14. Khối đại đoàn kết dân tộc trong lịch sử Việt Nam.'
      ]
    }
  },
  'Địa lí': {
    'Khối 12': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Vị trí địa lí và phạm vi lãnh thổ.', 'Bài 2. Thiên nhiên nhiệt đới ẩm gió mùa.', 'Bài 3. Sự phân hoá đa dạng của thiên nhiên.', 'Bài 4. Thực hành: Viết báo cáo về sự phân hoá tự nhiên Việt Nam.', 'Bài 5. Vấn đề sử dụng hợp lí tài nguyên thiên nhiên và bảo vệ môi trường.',
        'Bài 6. Dân số Việt Nam.', 'Bài 7. Lao động và việc làm.', 'Bài 8. Đô thị hoá.', 'Bài 9. Thực hành: Viết báo cáo về một chủ đề dân cư ở Việt Nam.', 'Bài 10. Chuyển dịch cơ cấu kinh tế.',
        'Bài 11. Vấn đề phát triển ngành nông nghiệp.', 'Bài 12. Vấn đề phát triển ngành lâm nghiệp và ngành thuỷ sản.', 'Bài 13. Tổ chức lãnh thổ nông nghiệp.', 'Bài 14. Thực hành: Tìm hiểu vai trò ngành nông nghiệp, lâm nghiệp và thuỷ sản; vẽ biểu đồ và nhận xét về ngành nông nghiệp, lâm nghiệp và thuỷ sản.', 'Bài 15. Chuyển dịch cơ cấu ngành công nghiệp.',
        'Bài 16. Một số ngành công nghiệp.', 'Bài 17. Tổ chức lãnh thổ công nghiệp.', 'Bài 18. Thực hành: Vẽ biểu đồ, nhận xét và giải thích tình hình phát triển ngành công nghiệp.', 'Bài 19. Vai trò, các nhân tố ảnh hưởng đến sự phát triển và phân bố các ngành dịch vụ.', 'Bài 20. Giao thông vận tải và bưu chính viễn thông.',
        'Bài 21. Thương mại và du lịch.', 'Bài 22. Thực hành: Tìm hiểu sự phát triển một số ngành dịch vụ.', 'Bài 23. Khai thác thế mạnh ở Trung du và miền núi Bắc Bộ.', 'Bài 24. Phát triển kinh tế – xã hội ở Đồng bằng sông Hồng.', 'Bài 25. Phát triển nông nghiệp, lâm nghiệp và thuỷ sản ở Bắc Trung Bộ.',
        'Bài 26. Phát triển kinh tế biển ở Duyên hải Nam Trung Bộ.', 'Bài 27. Thực hành: Tìm hiểu và viết báo cáo về ý nghĩa của phát triển kinh tế biển đối với quốc phòng an ninh ở Duyên hải Nam Trung Bộ.', 'Bài 28. Khai thác thế mạnh để phát triển kinh tế ở Tây Nguyên.', 'Bài 29. Phát triển kinh tế – xã hội ở Đông Nam Bộ.', 'Bài 30. Sử dụng hợp lí tự nhiên để phát triển kinh tế ở Đồng bằng sông Cửu Long.',
        'Bài 31. Thực hành: Viết báo cáo về biến đổi khí hậu ở Đồng bằng sông Cửu Long.', 'Bài 32. Phát triển các vùng kinh tế trọng điểm.', 'Bài 33. Phát triển kinh tế biển và đảm bảo quốc phòng an ninh ở Biển Đông và các đảo, quần đảo.', 'Bài 34. Thực hành: Viết báo cáo tuyên truyền về bảo vệ chủ quyền biển, đảo của Việt Nam.', 'Bài 35. Thực hành: Tìm hiểu địa lí địa phương.'
      ]
    },
    'Khối 11': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Sự khác biệt về trình độ phát triển kinh tế – xã hội của các nhóm nước', 'Bài 2. Toàn cầu hoá và khu vực hoá kinh tế', 'Bài 3. Thực hành: Tìm hiểu về cơ hội và thách thức của toàn cầu hoá và khu vực hoá kinh tế', 'Bài 4. Một số tổ chức quốc tế và khu vực, an ninh toàn cầu', 'Bài 5. Thực hành: Viết báo cáo về đặc điểm và biểu hiện của nền kinh tế tri thức',
        'Bài 6. Vị trí địa lí, điều kiện tự nhiên, dân cư và xã hội khu vực Mỹ La-tinh', 'Bài 7. Kinh tế khu vực Mỹ La-tinh', 'Bài 8. Thực hành: Viết báo cáo về tình hình phát triển kinh tế – xã hội ở Cộng hoà Liên bang Bra-xin', 'Bài 9. Liên minh châu Âu – Một liên kết kinh tế khu vực lớn', 'Bài 10. Thực hành: Viết báo cáo về sự phát triển công nghiệp của Cộng hoà Liên bang Đức',
        'Bài 11. Vị trí địa lí, điều kiện tự nhiên, dân cư và xã hội khu vực Đông Nam Á', 'Bài 12. Kinh tế khu vực Đông Nam Á', 'Bài 13. Hiệp hội các quốc gia Đông Nam Á (ASEAN)', 'Bài 14. Thực hành: Tìm hiểu hoạt động kinh tế đối ngoại của khu vực Đông Nam Á', 'Bài 15. Vị trí địa lí, điều kiện tự nhiên, dân cư và xã hội khu vực Tây Nam Á',
        'Bài 16. Kinh tế khu vực Tây Nam Á', 'Bài 17. Thực hành: Viết báo cáo về vấn đề dầu mỏ của khu vực Tây Nam Á', 'Bài 18. Vị trí địa lí, điều kiện tự nhiên và dân cư Hoa Kỳ', 'Bài 19. Kinh tế Hoa Kỳ', 'Bài 20. Vị trí địa lí, điều kiện tự nhiên, dân cư và xã hội Liên bang Nga',
        'Bài 21. Kinh tế Liên bang Nga', 'Bài 22. Thực hành: Tìm hiểu về công nghiệp khai thác dầu khí của Liên bang Nga', 'Bài 23. Vị trí địa lí, điều kiện tự nhiên, dân cư và xã hội Nhật Bản', 'Bài 24. Kinh tế Nhật Bản', 'Bài 25. Thực hành: Viết báo cáo về hoạt động kinh tế đối ngoại của Nhật Bản',
        'Bài 26. Vị trí địa lí, điều kiện tự nhiên, dân cư và xã hội Trung Quốc', 'Bài 27. Kinh tế Trung Quốc', 'Bài 28. Thực hành: Viết báo cáo về sự thay đổi của kinh tế vùng duyên hải Trung Quốc', 'Bài 29. Thực hành: Tìm hiểu về kinh tế của Ô-xtrây-li-a', 'Bài 30. Vị trí địa lí, điều kiện tự nhiên, dân cư và xã hội Cộng hoà Nam Phi',
        'Bài 31. Kinh tế Cộng hoà Nam Phi'
      ]
    },
    'Khối 10': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Môn Địa lí với định hướng nghề nghiệp', 'Bài 2. Phương pháp biểu hiện các đối tượng địa lí trên bản đồ', 'Bài 3. Sử dụng bản đồ trong học tập và đời sống, một số ứng dụng của GPS và bản đồ số trong đời sống', 'Bài 4. Sự hình thành Trái Đất, vỏ Trái Đất và vật liệu cấu tạo vỏ Trái Đất', 'Bài 5. Hệ quả địa lí các chuyển động của Trái Đất',
        'Bài 6. Thạch quyển, thuyết kiến tạo mảng', 'Bài 7. Nội lực và ngoại lực', 'Bài 8. Thực hành: Sự phân bố các vành đai động đất, núi lửa', 'Bài 9. Khí quyển, các yếu tố khí hậu', 'Bài 10. Thực hành: Đọc bản đồ các đới và các kiểu khí hậu trên Trái Đất, phân tích biểu đồ một số kiểu khí hậu',
        'Bài 11. Thuỷ quyển, nước trên lục địa', 'Bài 12. Nước biển và đại dương', 'Bài 13. Thực hành: Phân tích chế độ nước sông Hồng', 'Bài 14. Đất trên Trái Đất', 'Bài 15. Sinh quyển',
        'Bài 16. Thực hành: Tìm hiểu sự phân bố đất và sinh vật trên Trái Đất', 'Bài 17. Vỏ địa lí, quy luật thống nhất và hoàn chỉnh của vỏ địa lí', 'Bài 18. Quy luật địa đới và quy luật phi địa đới', 'Bài 19. Quy mô dân số, gia tăng dân số và cơ cấu dân số thế giới', 'Bài 20. Phân bố dân cư và đô thị hoá trên thế giới',
        'Bài 21. Các nguồn lực phát triển kinh tế', 'Bài 22. Cơ cấu kinh tế, tổng sản phẩm trong nước và tổng thu nhập quốc gia', 'Bài 23. Vai trò, đặc điểm, các nhân tố ảnh hưởng tới phát triển và phân bố nông nghiệp, lâm nghiệp, thuỷ sản', 'Bài 24. Địa lí ngành nông nghiệp', 'Bài 25. Địa lí ngành lâm nghiệp và ngành thuỷ sản',
        'Bài 26. Tổ chức lãnh thổ nông nghiệp, một số vấn đề phát triển nông nghiệp hiện đại trên thế giới và định hướng phát triển nông nghiệp trong tương lai', 'Bài 27. Thực hành: Vẽ và nhận xét biểu đồ về sản lượng lương thực của thế giới', 'Bài 28. Vai trò, đặc điểm, cơ cấu ngành công nghiệp, các nhân tố ảnh hưởng tới sự phát triển và phân bố công nghiệp', 'Bài 29. Địa lí một số ngành công nghiệp', 'Bài 30. Tổ chức lãnh thổ công nghiệp',
        'Bài 31. Tác động của công nghiệp đối với môi trường, phát triển năng lượng tái tạo, định hướng phát triển công nghiệp trong tương lai'
      ]
    }
  },
  'Tin học': {
    'Khối 12': {
      'Kết nối tri thức với cuộc sống (Tin học ứng dụng ICT)': [
        'Bài 1. Làm quen với Trí tuệ nhân tạo', 'Bài 2. Trí tuệ nhân tạo trong khoa học và đời sống', 'Bài 3. Một số thiết bị mạng thông dụng', 'Bài 4. Giao thức mạng', 'Bài 5. Thực hành chia sẻ tài nguyên trên mạng',
        'Bài 6. Giao tiếp và ứng xử trong không gian mạng', 'Bài 7. HTML và cấu trúc trang web', 'Bài 8. Định dạng văn bản', 'Bài 9. Tạo danh sách, bảng', 'Bài 10. Tạo liên kết',
        'Bài 11. Chèn tệp tin đa phương tiện và khung nội tuyến vào trang web', 'Bài 12. Tạo biểu mẫu', 'Bài 13. Khái niệm, vai trò của CSS', 'Bài 14. Định dạng văn bản bằng CSS', 'Bài 15. Tạo màu cho chữ và nền',
        'Bài 16. Định dạng khung', 'Bài 17. Các mức ưu tiên của bộ chọn', 'Bài 18. Thực hành tổng hợp thiết kế trang web', 'Bài 19. Dịch vụ sửa chữa và bảo trì máy tính', 'Bài 20. Nhóm nghề quản trị thuộc ngành Công nghệ thông tin',
        'Bài 21. Hội thảo hướng nghiệp', 'Bài 22. Thực hành kết nối các thiết bị số', 'Bài 23. Chuẩn bị xây dựng trang web', 'Bài 24. Xây dựng phần đầu trang web', 'Bài 25. Xây dựng phần thân và chân trang web',
        'Bài 26. Liên kết và thanh điều hướng', 'Bài 27. Biểu mẫu trên trang web', 'Bài 28. Thực hành tổng hợp'
      ],
      'Kết nối tri thức với cuộc sống (Khoa học máy tính CS)': [
        'Bài 1. Hệ điều hành cho thiết bị di động và các thiết bị thông minh', 'Bài 2. Thực hành: Sử dụng hệ điều hành cho thiết bị di động', 'Bài 3. Trí tuệ nhân tạo và ứng dụng', 'Bài 4. Một số vấn đề đạo đức và pháp luật của trí tuệ nhân tạo', 'Bài 5. Mạng máy tính và giao thức mạng',
        'Bài 6. Thực hành: Cấu hình thiết bị mạng cục bộ', 'Bài 7. Internet vạn vật (IoT)', 'Bài 8. Thực hành: Kết nối và sử dụng thiết bị thông minh', 'Bài 9. Một số vấn đề về pháp luật, đạo đức và văn hóa khi sử dụng tài nguyên số', 'Bài 10. Định dạng dữ liệu và lưu trữ dữ liệu',
        'Bài 11. Một số kĩ thuật lập trình nâng cao trong Python', 'Bài 12. Thực hành: Xây dựng chương trình quản lí đơn giản', 'Bài 13. Một số nghề nghiệp trong lĩnh vực Tin học', 'Bài 14. Dự án: Tìm hiểu nghề nghiệp trong lĩnh vực Tin học', 'Bài 15. Hệ quản trị nội dung (CMS)',
        'Bài 16. Thiết lập và quản trị trang web bằng CMS', 'Bài 17. Thực hành: Tạo trang web bằng phần mềm quản trị nội dung', 'Bài 18. Quản lí và biên tập nội dung trên trang web', 'Bài 19. Tối ưu hóa công cụ tìm kiếm (SEO) cho trang web', 'Bài 20. Thực hành: Quản trị và tối ưu hóa trang web',
        'Bài 21. Dự án: Xây dựng trang web tin tức hoặc bán hàng trực tuyến'
      ]
    },
    'Khối 11': {
      'Kết nối tri thức với cuộc sống (Tin học ứng dụng ICT)': [
        'Bài 1. Hệ điều hành.', 'Bài 2. Thực hành sử dụng hệ điều hành.', 'Bài 3. Phần mềm nguồn mở và phần mềm chạy trên Internet.', 'Bài 4. Bên trong máy tính.', 'Bài 5. Kết nối máy tính với các thiết bị số.',
        'Bài 6. Lưu trữ và chia sẻ tập tin trên Internet.', 'Bài 7. Thực hành tìm kiếm thông tin trên Internet.', 'Bài 8. Thực hành nâng cao sử dụng thư điện tử và mạng xã hội.', 'Bài 9. Giao tiếp an toàn trên Internet.', 'Bài 10. Lưu trữ dữ liệu và khai thác thông tin phục vụ quản lí.',
        'Bài 11. Cơ sở dữ liệu.', 'Bài 12. Hệ quản trị cơ sở dữ liệu và hệ cơ sở dữ liệu.', 'Bài 13. Cơ sở dữ liệu quan hệ.', 'Bài 14. SQL – Ngôn ngữ truy vấn có cấu trúc.', 'Bài 15. Bảo mật và an toàn hệ cơ sở dữ liệu.',
        'Bài 16. Công việc quản trị cơ sở dữ liệu.', 'Bài 17. Quản trị cơ sở dữ liệu trên máy tính.', 'Bài 18. Thực hành xác định cấu trúc bảng và các trường khoá.', 'Bài 19. Thực hành tạo lập cơ sở dữ liệu và các bảng.', 'Bài 20. Thực hành tạo lập các bảng có khoá ngoài.',
        'Bài 21. Thực hành cập nhật và truy xuất dữ liệu các bảng.', 'Bài 22. Thực hành cập nhật bảng dữ liệu có tham chiếu.', 'Bài 23. Thực hành truy xuất dữ liệu qua liên kết các bảng.', 'Bài 24. Thực hành sao lưu dữ liệu.', 'Bài 25. Phần mềm chỉnh sửa ảnh.',
        'Bài 26. Công cụ tinh chỉnh màu sắc và công cụ chọn.', 'Bài 27. Công cụ vẽ và một số ứng dụng.', 'Bài 28. Tạo ảnh động.', 'Bài 29. Khám phá phần mềm làm phim.', 'Bài 30. Biên tập phim.',
        'Bài 31. Thực hành tạo phim hoạt hình.'
      ],
      'Kết nối tri thức với cuộc sống (Khoa học máy tính CS)': [
        'Bài 1. Hệ điều hành', 'Bài 2. Thực hành: Sử dụng hệ điều hành', 'Bài 3. Phần mềm ứng dụng và dịch vụ phần mềm', 'Bài 4. Bên trong máy tính', 'Bài 5. Kết nối thiết bị số với máy tính',
        'Bài 6. Lưu trữ và chia sẻ tệp tin trên Internet', 'Bài 7. Thực hành: Tìm kiếm thông tin trên Internet', 'Bài 8. Đạo đức và văn hóa trong môi trường số', 'Bài 9. Cơ sở dữ liệu và hệ quản trị cơ sở dữ liệu', 'Bài 10. Bảng và khóa chính trong cơ sở dữ liệu quan hệ',
        'Bài 11. Thực hành: Khởi tạo cơ sở dữ liệu và bảng', 'Bài 12. Truy vấn dữ liệu và ngôn ngữ SQL', 'Bài 13. Thực hành: Truy vấn dữ liệu', 'Bài 14. Bảo mật và an toàn trong cơ sở dữ liệu', 'Bài 15. Nghề quản trị cơ sở dữ liệu',
        'Bài 16. Ngôn ngữ lập trình bậc cao và Python', 'Bài 17. Biến và lệnh gán', 'Bài 18. Các lệnh vào ra đơn giản', 'Bài 19. Câu lệnh điều kiện If', 'Bài 20. Câu lệnh lặp For'
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
        'Bài 1. Lược sử công cụ tính toán', 'Bài 2. Thông tin trong môi trường số', 'Bài 3. Thực hành: Khai thác thông tin số', 'Bài 4. Đạo đức và văn hoá trong sử dụng công nghệ kĩ thuật số', 'Bài 5. Sử dụng bảng tính giải quyết bài toán thực tế',
        'Bài 6. Sắp xếp và lọc dữ liệu', 'Bài 7. Trực quan hoá dữ liệu', 'Bài 8a. Làm việc với danh sách dạng liệt kê và hình ảnh trong văn bản', 'Bài 9a. Tạo đầu trang, chân trang cho văn bản', 'Bài 10a. Định dạng nâng cao cho trang chiếu',
        'Bài 11a. Sử dụng bản mẫu tạo bài trình chiếu', 'Bài 8b. Phần mềm chỉnh sửa ảnh', 'Bài 9b. Thay đổi khung hình, kích thước ảnh', 'Bài 10b. Thêm văn bản, tạo hiệu ứng cho ảnh', 'Bài 11b. Thực hành tổng hợp',
        'Bài 12. Từ thuật toán đến chương trình', 'Bài 13. Biểu diễn dữ liệu', 'Bài 14. Cấu trúc điều khiển', 'Bài 15. Gỡ lỗi', 'Bài 16. Tin học với nghề nghiệp'
      ],
      'Cánh diều': [
        'Bài 1. Vài nét lịch sử phát triển máy tính', 'Bài 2. Vài nét lịch sử phát triển máy tính (tt)', 'Bài 1. Dữ liệu số trong thời đại thông tin', 'Bài 2. Khai thác thông tin số trong các hoạt động kinh tế xã hội', 'Bài học. Sử dụng công nghệ kĩ thuật số có đạo đức và văn hóa',
        'Bài 1. Lọc dữ liệu', 'Bài 2. Sắp xếp dữ liệu', 'Bài 3. Biểu đồ trong phần mềm bảng tính', 'Bài 4. Thực hành tạo biểu đồ', 'Bài 5. Các kiểu địa chỉ trong Excel',
        'Bài 6. Thực hành tổng hợp', 'Bài 1. Xử lí đồ họa trong văn bản', 'Bài 2. Thực hành xử lí đồ họa trong văn bản', 'Bài 3. Danh sách liệt kê và tiêu đề trang', 'Bài 4. Thực hành tạo danh sách liệt kê và tiêu đề trang',
        'Bài 5. Thực hành tổng hợp', 'Bài 6. Sử dụng các bản mẫu trong tạo bài trình chiếu', 'Bài 7. Thực hành sử dụng bản mẫu', 'Bài 8. Kết nối đa phương tiện và hoàn thiện trang chiếu', 'Bài 9. Thực hành tổng hợp',
        'Bài 1. Thể hiện cấu trúc tuần tự trong chương trình', 'Bài 2. Sử dụng biến trong chương trình', 'Bài 3. Sử dụng biểu thức trong chương trình', 'Bài 4. Thể hiện cấu trúc rẽ nhánh trong chương trình', 'Bài 5. Thể hiện cấu trúc lặp trong chương trình',
        'Bài 6. Thực hành tìm và sửa lỗi', 'Bài 7. Thực hành tổng hợp', 'Bài 1. Tin học và ứng dụng', 'Bài 2. Tin học và các ngành nghề'
      ]
    },
    'Khối 7': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Thiết bị vào – ra', 'Bài 2. Phần mềm máy tính', 'Bài 3. Quản lí dữ liệu trong máy tính', 'Bài 4. Mạng xã hội và một số kênh trao đổi thông tin trên Internet', 'Bài 5. Ứng xử trên mạng',
        'Bài 6. Làm quen với phần mềm bảng tính', 'Bài 7. Tính toán tự động trên bảng tính', 'Bài 8. Công cụ hỗ trợ tính toán', 'Bài 9. Trình bày bảng tính', 'Bài 10. Hoàn thiện bảng tính',
        'Bài 11. Tạo bài trình chiếu', 'Bài 12. Định dạng đối tượng trên trang chiếu', 'Bài 13. Thực hành tổng hợp: Hoàn thiện bài trình chiếu', 'Bài 14. Thuật toán tìm kiếm tuần tự', 'Bài 15. Thuật toán tìm kiếm nhị phân',
        'Bài 16. Thuật toán sắp xếp'
      ],
      'Cánh diều': [
        'Bài 1. Thiết bị vào - ra cơ bản cho máy tính cá nhân', 'Bài 2+3. Các thiết bị vào - ra + Thực hành với các thiết bị vào ra', 'Bài 4. Một số chức năng hệ điều hành', 'Bài 5. Thực hành khám phá trình quản lí hệ thống tệp', 'Bài 6. Thực hành thao tác với tệp và thư mục',
        'Bài 1. Giới thiệu mạng xã hội', 'Bài 2. Thực hành sử dụng mạng xã hội', 'Bài 3. Trao đổi thông tin trên mạng xã hội', 'Bài 1. Ứng xử có văn hóa khi giao tiếp qua mạng.', 'Bài 2. Ứng xử tránh rủi ro trên mạng',
        'Bài 1. Làm quen với bảng tính điện tử', 'Bài 2. Làm quen với trang tính', 'Bài 3. Làm quen với trang tính ( tiếp)', 'Bài 4. Định dạng hiển thị dữ liệu số', 'Bài 5. Định dạng số tiền và ngày tháng',
        'Bài 6. Thực hành lập sổ theo dõi thu chi cá nhân', 'Bài 7. Công thức tính toán dùng địa chỉ của các ô dữ liệu', 'Bài 8. Sử dụng một số hàm có sẵn', 'Bài 9. Định dạng trang tính và in', 'Bài 10. Thực hành tổng hợp',
        'Bài 11. Luyện tập sử dụng phần mềm bảng tính', 'Bài 12. Tạo bài trình chiếu', 'Bài 13. Thực hành định dạng trang chiếu', 'Bài 14. Thêm hiệu ứng cho trang chiếu', 'Bài 15. Thực hành tổng hợp tạo bài trình chiếu',
        'Bài 1. Tìm kiếm tuần tự', 'Bài 2. Tìm kiếm nhị phân', 'Bài 3. Sắp xếp chọn', 'Bài 4. Sắp xếp nổi bọt', 'Bài 5. Thực hành mô phỏng các thuật toán tìm kiếm và sắp xếp.'
      ]
    },
    'Khối 6': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Thông tin và dữ liệu', 'Bài 2. Lưu trữ và trao đổi thông tin', 'Bài 3. Máy tính trong hoạt động thông tin', 'Bài 4. Mạng máy tính', 'Bài 5. Internet',
        'Bài 6. Mạng thông tin toàn cầu World Wide Web', 'Bài 7. Tìm kiếm thông tin trên Internet', 'Bài 8. Thư điện tử', 'Bài 9. An toàn thông tin trên Internet', 'Bài 10. Sơ đồ tư duy',
        'Bài 11. Định dạng văn bản và trình bày trang văn bản', 'Bài 12. Trình bày thông tin ở dạng bảng', 'Bài 13. Thực hành: Tìm kiếm và thay thế', 'Bài 14. Thực hành: Tổng hợp nội dung dự án', 'Bài 15. Thuật toán',
        'Bài 16. Các cấu trúc điều khiển', 'Bài 17. Chương trình máy tính'
      ],
      'Cánh diều': [
        'Bài 1. Thông tin – Thu nhận và xử lí thông tin', 'Bài 2. Lưu trữ và trao đổi thông tin', 'Bài 3. Máy tính trong hoạt động thông tin', 'Bài 4. Biểu diễn văn bản, hình ảnh, âm thanh trong máy tính', 'Bài 5. Dữ liệu trong máy tính',
        'Bài 1. Khái niệm và lợi ích của mạng máy tính', 'Bài 2. Các thành phần của mạng máy tính', 'Bài 3. Mạng có dây và mạng không dây', 'Bài 1. Thông tin trên web', 'Bài 2. Truy cập thông tin trên Internet',
        'Bài 3. Giới thiệu máy tìm kiếm', 'Bài 4. TH tìm kiếm thông tin trên Internet', 'Bài 5. Giới thiệu thư điện tử', 'Bài 6. Thực hành sử dụng thư điện tử', 'Bài 1. Mặt trái của Internet',
        'Bài 2. Sự an toàn và hợp pháp khi sử dụng thông tin', 'Bài 1. Tìm kiếm và thay thế trong soạn thảo văn bản', 'Bài 2. Trình bày trang, định dạng và in văn bản', 'Bài 3. Thực hành tìm kiếm, thay thế và định dạng văn bản', 'Bài 4. Trình bày thông tin ở dạng bảng',
        'Bài 5. Thực hành tổng hợp về soạn thảo văn bản', 'Bài 6. Sơ đồ tư duy', 'Bài 7. Thực hành khám phá phần mềm sơ đồ tư duy', 'Bài 8. Dự án nhỏ: Lợi ích của sơ đồ tư duy', 'Bài 1. Khái niệm thuật toán',
        'Bài 2. Mô tả thuật toán. Cấu trúc tuần tự trong thuật toán', 'Bài 3. Cấu trúc rẽ nhánh trong thuật toán', 'Bài 4: Cấu trúc lặp trong thuật toán.', 'Bài 5. Thực hành về mô tả thuật toán'
      ]
    },
    'Khối 9': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Thế giới kỹ thuật số', 'Bài 2. Thông tin trong giải quyết vấn đề', 'Bài 3. Thực hành: Đánh giá chất lượng thông tin', 'Bài 4. Một số vấn đề pháp lý về sử dụng dịch vụ Internet', 'Bài 5. Tìm hiểu phần mềm mô phỏng',
        'Bài 6. Thực hành: Khai thác phần mềm mô phỏng', 'Bài 7. Trình bày thông tin trong trao đổi và hợp tác', 'Bài 8. Thực hành: Sử dụng công cụ trực quan trình bày', 'Bài 9a. Sử dụng công cụ xác thực dữ liệu', 'Bài 10a. Sử dụng hàm Countif',
        'Bài 11a. Sử dụng hàm Sumif', 'Bài 12a. Sử dụng hàm If', 'Bài 13a. Hoàn thiện bảng tính quản lí tài chính gia đình', 'Bài 14. Giải quyết vấn đề', 'Bài 15. Bài toán tin học',
        'Bài 16. Thực hành: Lập chương trình máy tính', 'Bài 17. Tin học và thế giới nghề nghiệp'
      ],
      'Cánh diều': [
        'Bài 1. Bộ xử lí thông tin ở quanh ta', 'Bài 2. Khả năng và ứng dụng thực tế của máy tính', 'Bài 1. Một số đặc điểm quan trọng của thông tin trong giải quyết vấn đề', 'Bài 2. Chất lượng thông tin khi tìm kiếm, tiếp nhận và trao đổi thông tin', 'Bài 1. Một số tác động tiêu cực của công nghệ kĩ thuật số',
        'Bài 2. Khía cạnh pháp lí, đạo đức, văn hóa của việc trao đổi thông tin qua mạng', 'Bài 1. Phần mềm mô phỏng và ứng dụng', 'Bài 2. Thực hành sử dụng phần mềm mô phỏng', 'Bài 1. Sử dụng bài trình chiếu trong trao đổi thông tin', 'Bài 2. Sử dụng sơ đồ tư duy trình bày thông tin trong trao đổi và hợp tác',
        'Bài 3. Thực hành trình bày thông tin đa phương tiện trong trao đổi và hợp tác', 'Bài 1. Xác thực dữ liệu nhập vào bảng tính', 'Bài 2. Hàm điều kiện IF', 'Bài 3. Hàm điều kiện IF (tiếp theo)', 'Bài 4. Một số hàm thống kê có điều kiện',
        'Bài 5. Thực hành tổng hợp', 'Bài 5. Thực hành tổng hợp (tt)', 'Dự án học tập', 'Bài 1. Các bước giải bài toán bằng máy tính', 'Bài 2. Thực hành xác định bài toán và tìm thuật toán',
        'Bài 3. Thực hành tạo và chạy thử chương trình', 'Bài 4. Dùng máy tính để giải quyết bài toán (Bài tập nhóm)', 'Bài 4. Dùng máy tính để giải quyết bài toán (Bài tập nhóm) (tt)', 'Bài 1. Nhóm nghề phân tích và phát triển phần mềm và các ứng dụng', 'Bài 2. Nhóm nghề Đa phương tiện và nhóm nghề Vận hành hệ thống thông tin',
        'Bài 3. Thực hành tìm hiểu thông tin về các nhóm nghề'
      ]
    }
  },
  'Khoa học tự nhiên': {
    'Khối 6': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Giới thiệu về Khoa học tự nhiên', 'Bài 2. An toàn trong phòng thực hành', 'Bài 3. Sử dụng kính lúp', 'Bài 4. Sử dụng kính hiển vi quang học', 'Bài 5. Đo chiều dài',
        'Bài 6. Đo khối lượng', 'Bài 7. Đo thời gian', 'Bài 8. Đo nhiệt độ', 'Bài 9. Sự đa dạng của chất', 'Bài 10. Các thể của chất và sự chuyển thể',
        'Bài 11. Oxygen. Không khí', 'Bài 12. Một số vật liệu', 'Bài 13. Một số nguyên liệu', 'Bài 14. Một số nhiên liệu', 'Bài 15. Một số lương thực, thực phẩm',
        'Bài 16. Hỗn hợp các chất', 'Bài 17. Tách chất khỏi hỗn hợp', 'Bài 18. Tế bào – Đơn vị cơ bản của sự sống', 'Bài 19. Cấu tạo và chức năng các thành phần của tế bào', 'Bài 20. Sự lớn lên và sinh sản của tế bào',
        'Bài 21. Thực hành: Quan sát và phân biệt một số loại tế bào', 'Bài 22. Cơ thể sinh vật', 'Bài 23. Tổ chức cơ thể đa bào', 'Bài 24. Thực hành: Quan sát và mô tả cơ thể đơn bào, cơ thể đa bào', 'Bài 25. Hệ thống phân loại sinh vật',
        'Bài 26. Khóa lưỡng phân', 'Bài 27. Vi khuẩn', 'Bài 28. Thực hành: Làm sữa chua và quan sát vi khuẩn', 'Bài 29. Virus', 'Bài 30. Nguyên sinh vật',
        'Bài 31. Thực hành: Quan sát nguyên sinh vật', 'Bài 32. Nấm', 'Bài 33. Thực hành: Quan sát các loại nấm', 'Bài 34. Thực vật', 'Bài 35. Thực hành: Quan sát và phân biệt một số nhóm thực vật',
        'Bài 36. Động vật', 'Bài 37. Thực hành: Quan sát và nhận biết một số nhóm động vật ngoài thiên nhiên', 'Bài 38. Đa dạng sinh học', 'Bài 39. Tìm hiểu sinh vật ngoài thiên nhiên', 'Bài 40. Lực là gì?',
        'Bài 41. Biểu diễn lực', 'Bài 42. Biến dạng của lò xo', 'Bài 43. Trọng lực, lực hấp dẫn', 'Bài 44. Lực ma sát', 'Bài 45. Lực cản của nước',
        'Bài 46. Năng lượng và sự truyền năng lượng', 'Bài 47. Một số dạng năng lượng', 'Bài 48. Sự chuyển hóa năng lượng', 'Bài 49. Năng lượng hao phí', 'Bài 50. Năng lượng tái tạo',
        'Bài 51. Tiết kiệm năng lượng', 'Bài 52. Chuyển động nhìn thấy của Mặt Trời. Thiên thể', 'Bài 53. Mặt Trăng', 'Bài 54. Hệ Mặt Trời', 'Bài 55. Ngân hà'
      ]
    },
    'Khối 7': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Phương pháp và kĩ năng học tập môn khoa học tự nhiên', 'Bài 2. Nguyên tử', 'Bài 3. Nguyên tố hóa học', 'Bài 4. Sơ lược về bảng tuần hoàn các nguyên tố hóa học', 'Bài 5. Phân tử - Đơn chất - Hợp chất',
        'Bài 6. Giới thiệu về liên kết hóa học', 'Bài 7. Hóa trị và công thức hóa học', 'Bài 8. Tốc độ chuyển động', 'Bài 9. Đo tốc độ', 'Bài 10. Đồ thị quãng đường - thời gian',
        'Bài 11. Thảo luận về ảnh hưởng của tốc độ trong an toàn giao thông', 'Bài 12. Sóng âm', 'Bài 13. Độ to và độ cao của âm', 'Bài 14. Phản xạ âm, chống ô nhiễm tiếng ồn', 'Bài 15. Năng lượng ánh sáng. Tia sáng, vùng tối',
        'Bài 16. Sự phản xạ ánh sáng', 'Bài 17. Ảnh của vật qua gương phẳng', 'Bài 18. Nam châm', 'Bài 19. Từ trường', 'Bài 20. Chế tạo nam châm điện đơn giản',
        'Bài 21. Khái quát về trao đổi chất và chuyển hóa năng lượng', 'Bài 22. Quang hợp ở thực vật', 'Bài 23. Một số yếu tố ảnh hưởng đến quang hợp', 'Bài 24. Thực hành: Chứng minh quang hợp ở cây xanh', 'Bài 25. Hô hấp tế bào',
        'Bài 26. Một số yếu tố ảnh hưởng đến hô hấp tế bào', 'Bài 27. Thực hành: Hô hấp ở thực vật', 'Bài 28. Trao đổi khí ở sinh vật', 'Bài 29. Vai trò của nước và chất dinh dưỡng đối với sinh vật', 'Bài 30. Trao đổi nước và chất dinh dưỡng ở thực vật',
        'Bài 31. Trao đổi nước và chất dinh dưỡng ở động vật', 'Bài 32. Thực hành: Chứng minh thân vận chuyển nước và lá thoát hơi nước', 'Bài 33. Cảm ứng ở sinh vật và tập tính ở động vật', 'Bài 34. Vận dụng hiện tượng cảm ứng ở sinh vật vào thực tiễn', 'Bài 35. Thực hành: Cảm ứng ở sinh vật',
        'Bài 36. Khái quát về sinh trưởng và phát triển ở sinh vật', 'Bài 37. Ứng dụng sinh trưởng và phát triển ở sinh vật vào thực tiễn', 'Bài 38. Thực hành: Quan sát, mô tả sự sinh trưởng và phát triển ở một số sinh vật', 'Bài 39. Sinh sản vô tính ở sinh vật', 'Bài 40. Sinh sản hữu tính ở sinh vật',
        'Bài 41. Một số yếu tố ảnh hưởng và điều hòa, điều khiển sinh sản ở sinh vật', 'Bài 42. Cơ thể sinh vật là một thể thống nhất'
      ]
    },
    'Khối 8': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Sử dụng một số hóa chất, thiết bị cơ bản trong phòng thí nghiệm', 'Bài 2. Phản ứng hóa học', 'Bài 3. Mol và tỉ khối chất khí', 'Bài 4. Dung dịch và nồng độ', 'Bài 5. Định luật bảo toàn khối lượng và phương trình hóa học',
        'Bài 6. Tính theo phương trình hóa học', 'Bài 7. Tốc độ phản ứng và chất xúc tác', 'Bài 8. Acid', 'Bài 9. Base. Thang pH', 'Bài 10. Oxide',
        'Bài 11. Muối', 'Bài 12. Phân bón hóa học', 'Bài 13. Khối lượng riêng', 'Bài 14. Thực hành xác định khối lượng riêng', 'Bài 15. Áp suất trên một bề mặt',
        'Bài 16. Áp suất chất lỏng. Áp suất khí quyển', 'Bài 17. Lực đẩy Archimedes', 'Bài 18. Tác dụng làm quay của lực. Moment lực', 'Bài 19. Đòn bẩy và ứng dụng', 'Bài 20. Hiện tượng nhiễm điện do cọ xát',
        'Bài 21. Dòng điện, nguồn điện', 'Bài 22. Mạch điện đơn giản', 'Bài 23. Tác dụng của dòng điện', 'Bài 24. Cường độ dòng điện và hiệu điện thế', 'Bài 25. Thực hành đo cường độ dòng điện và hiệu điện thế',
        'Bài 26. Năng lượng nhiệt và nội năng', 'Bài 27. Thực hành đo năng lượng nhiệt bằng joulemeter', 'Bài 28. Sự truyền nhiệt', 'Bài 29. Sự nở vì nhiệt', 'Bài 30. Khái quát về cơ thể người',
        'Bài 31. Hệ vận động ở người', 'Bài 32. Dinh dưỡng và tiêu hóa ở người', 'Bài 33. Máu và hệ tuần hoàn của cơ thể người', 'Bài 34. Hệ hô hấp ở người', 'Bài 35. Hệ bài tiết ở người',
        'Bài 36. Điều hòa môi trường trong của cơ thể người', 'Bài 37. Hệ thần kinh và các giác quan ở người', 'Bài 38. Hệ nội tiết ở người', 'Bài 39. Da và điều hòa thân nhiệt ở người', 'Bài 40. Sinh sản ở người',
        'Bài 41. Môi trường và các nhân tố sinh thái', 'Bài 42. Quần thể sinh vật', 'Bài 43. Quần xã sinh vật', 'Bài 44. Hệ sinh thái', 'Bài 45. Sinh quyển',
        'Bài 46. Cân bằng tự nhiên', 'Bài 47. Bảo vệ môi trường'
      ]
    },
    'Khối 9': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Nhận biết một số dụng cụ, hoá chất. Thuyết trình một vấn đề khoa học', 'Bài 2. Động năng. Thế năng', 'Bài 3. Cơ năng', 'Bài 4. Công và công suất', 'Bài 5. Khúc xạ ánh sáng',
        'Bài 6. Phản xạ toàn phần', 'Bài 7. Lăng kính', 'Bài 8. Thấu kính', 'Bài 9. Thực hành đo tiêu cự của thấu kính hội tụ', 'Bài 10. Kính lúp. Bài tập thấu kính',
        'Bài 11. Điện trở. Định luật Ohm', 'Bài 12. Đoạn mạch nối tiếp, song song', 'Bài 13. Năng lượng của dòng diện và công suất điện', 'Bài 14. Cảm ứng điện từ. Nguyên tắc tạo ra dòng diện xoay chiều', 'Bài 15. Tác dụng của dòng diện xoay chiều',
        'Bài 16. Vòng năng lượng trên Trái Đất. Năng lượng hoá thạch', 'Bài 17. Một số dạng năng lượng tái tạo', 'Bài 18. Tính chất chung của kim loại', 'Bài 19. Dãy hoạt động hoá học', 'Bài 20. Tách kim loại và việc sử dụng hợp kim',
        'Bài 21. Sự khác nhau cơ bản giữa phi kim và kim loại', 'Bài 22. Giới thiệu về hợp chất hữu cơ', 'Bài 23. Alkane', 'Bài 24. Alkene', 'Bài 25. Nguồn nhiên liệu',
        'Bài 26. Ethylic alcohol', 'Bài 27. Acetic acid', 'Bài 28. Lipid', 'Bài 29. Carbohydrate. Glucose và saccharose', 'Bài 30. Tinh bột và cellulose',
        'Bài 31. Protein', 'Bài 32. Polymer', 'Bài 33. Sơ lược về hoá học vỏ Trái Đất và khai thác tài nguyên từ vỏ Trái Đất', 'Bài 34. Khai thác đá vôi. Công nghiệp silicate', 'Bài 35. Khai thác nhiên liệu hoá thạch. Nguồn carbon. Chu trình carbon và sự ấm lên toàn cầu',
        'Bài 36. Khái quát về di truyền học', 'Bài 37. Các quy luật di truyền của Mendel', 'Bài 38. Nucleic acid và gene', 'Bài 39. Tái bản DNA và phiên mã tạo RNA', 'Bài 40. Dịch mã và mối quan hệ từ gene đến tính trạng',
        'Bài 41. Đột biến gene', 'Bài 42. Nhiễm sắc thể và bộ nhiễm sắc thể', 'Bài 43. Nguyên phân và giảm phân', 'Bài 44. Nhiễm sắc thể giới tính và cơ chế xác định giới tính', 'Bài 45. Di truyền liên kết',
        'Bài 46. Đột biến nhiễm sắc thể', 'Bài 47. Di truyền học với con người', 'Bài 48. Ứng dụng công nghệ di truyền vào đời sống', 'Bài 49. Khái niệm tiến hoá và các hình thức chọn lọc', 'Bài 50. Cơ chế tiến hoá',
        'Bài 51. Sự phát sinh và phát triển sự sống trên Trái Đất'
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
        'Bài 1: Các hoạt động kinh tế cơ bản trong đời sống xã hội', 'Bài 2: Các chủ thể của nền kinh tế', 'Bài 3: Thị trường', 'Bài 4: Cơ chế thị trường', 'Bài 5: Ngân sách nhà nước',
        'Bài 6: Thuế', 'Bài 7: Sản xuất kinh doanh và các mô hình sản xuất kinh doanh', 'Bài 8: Tín dụng và vai trò của tín dụng trong đời sống', 'Bài 9: Dịch vụ tín dụng', 'Bài 10: Lập kế hoạch tài chính cá nhân',
        'Bài 11: Khái niệm, đặc điểm và vai trò của pháp luật', 'Bài 12: Hệ thống pháp luật và văn bản pháp luật Việt Nam', 'Bài 13: Thực hiện pháp luật', 'Bài 14: Giới thiệu về Hiến pháp nước Cộng hòa xã hội chủ nghĩa Việt Nam', 'Bài 15: Nội dung cơ bản của Hiến pháp Việt Nam về chế độ chính trị',
        'Bài 16: Quyền con người, quyền và nghĩa vụ cơ bản của công dân trong Hiến pháp', 'Bài 17: Nội dung cơ bản của Hiến pháp về kinh tế, văn hóa, xã hội, giáo dục, khoa học, công nghệ, môi trường', 'Bài 18: Nội dung cơ bản của Hiến pháp về bộ máy nhà nước Cộng hòa xã hội chủ nghĩa Việt Nam', 'Bài 19: Đặc điểm, cấu trúc và nguyên tắc hoạt động của hệ thống chính trị Việt Nam', 'Bài 20: Đặc điểm, nguyên tắc tổ chức và hoạt động của bộ máy nhà nước Cộng hòa xã hội chủ nghĩa Việt Nam',
        'Bài 21: Quốc hội, Chủ tịch nước, Chính phủ nước cộng hòa xã hội chủ nghĩa Việt Nam', 'Bài 22: Tòa án nhân dân và Viện kiểm sát nhân dân', 'Bài 23: Hội đồng nhân dân và Uỷ ban nhân dân'
      ]
    },
    'Khối 11': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1: Canh tranh trong nền kinh tế thị trường.', 'Bài 2: Cung – cầu trong nền kinh tế thị trường.', 'Bài 3: Lam phát.', 'Bài 4: Thất nghiệp.', 'Bài 5: Thị trường lao động và việc làm.',
        'Bài 6: Ý tưởng, cơ hội kinh doanh và các năng lực cần thiết của người kinh doanh.', 'Bài 7: Đạo đức kinh doanh.', 'Bài 8: Văn hoá tiêu dùng.', 'Bài 9: Quyền bình đẳng của công dân trước pháp luật.', 'Bài 10: Bình đẳng giới trong các lĩnh vực.',
        'Bài 11: Quyền bình đẳng giữa các dân tộc.', 'Bài 12: Quyền bình đẳng giữa các tôn giáo.', 'Bài 13: Quyền và nghĩa vụ của công dân trong tham gia quản lí nhà nước và xã hội.', 'Bài 14: Quyền và nghĩa vụ của công dân về bầu cử và ứng cử.', 'Bài 15: Quyền và nghĩa vụ của công dân về khiếu nại, tố cáo.',
        'Bài 16: Quyền và nghĩa vụ của công dân về bảo vệ Tổ quốc.', 'Bài 17: Quyền bất khả xâm phạm về thân thể và quyền được pháp luật bảo hộ về tính mạng, sức khoẻ, danh dự, nhân phẩm của công dân.', 'Bài 18: Quyền bất khả xâm phạm về chỗ ở của công dân.', 'Bài 19: Quyền được bảo đảm an toàn và bí mật thư tín, điện thoại, điện tín của công dân.', 'Bài 20: Quyền và nghĩa vụ của công dân về tự do ngôn luận, báo chí và tiếp cận thông tin.',
        'Bài 21: Quyền và nghĩa vụ của công dân về tự do tín ngưỡng và tôn giáo.'
      ]
    },
    'Khối 12': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1: Tăng trưởng và phát triển kinh tế.', 'Bài 2: Hội nhập kinh tế quốc tế.', 'Bài 3: Bảo hiểm.', 'Bài 4: An sinh xã hội.', 'Bài 5: Lập kế hoạch kinh doanh.',
        'Bài 6: Trách nhiệm xã hội của doanh nghiệp.', 'Bài 7: Quản lí thu, chi trong gia đình.', 'Bài 8: Quyền và nghĩa vụ của công dân về kinh doanh và nộp thuế.', 'Bài 9: Quyền và nghĩa vụ của công dân về sở hữu tài sản và tôn trọng tài sản của người khác.', 'Bài 10: Quyền và nghĩa vụ của công dân trong hôn nhân và gia đình.',
        'Bài 11: Quyền và nghĩa vụ của công dân trong học tập.', 'Bài 12: Quyền và nghĩa vụ của công dân trong bảo vệ, chăm sóc sức khỏe và bảo đảm an sinh xã hội.', 'Bài 13: Quyền và nghĩa vụ của công dân trong bảo vệ di sản văn hoá, môi trường và tài nguyên thiên nhiên.', 'Bài 14: Một số vấn đề chung về pháp luật quốc tế.', 'Bài 15: Công pháp quốc tế về dân cư, lãnh thổ và chủ quyền quốc gia.',
        'Bài 16: Nguyên tắc cơ bản của Tổ chức Thương mại thế giới và hiệp đồng thương mại quốc tế.'
      ]
    }
  },
  'Công nghệ': {
    'Khối 6': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Khái quát về nhà ở', 'Bài 2. Xây dựng nhà ở', 'Bài 3. Ngôi nhà thông minh', 'Bài 4. Thực phẩm và dinh dưỡng', 'Bài 5. Phương pháp bảo quản và chế biến thực phẩm',
        'Bài 6. Dự án: Bữa ăn kết nối yêu thương', 'Bài 7. Trang phục trong đời sống', 'Bài 8. Sử dụng và bảo quản trang phục', 'Bài 9. Thời trang', 'Bài 10. Khái quát về đồ dùng điện trong gia đình',
        'Bài 11. Đèn điện', 'Bài 12. Nồi cơm điện', 'Bài 13. Bếp hồng ngoại', 'Bài 14. Dự án: An toàn và tiết kiệm điện trong gia đình'
      ]
    },
    'Khối 7': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Giới thiệu về trồng trọt', 'Bài 2. Làm đất trồng cây', 'Bài 3. Gieo trồng, chăm sóc và phòng trừ sâu, bệnh cho cây trồng', 'Bài 4. Thu hoạch sản phẩm trồng trọt', 'Bài 5. Nhân giống vô tính cây trồng',
        'Bài 6. Dự án trồng rau an toàn', 'Bài 7. Giới thiệu về rừng', 'Bài 8. Trồng, chăm sóc và bảo vệ rừng', 'Bài 9. Giới thiệu về chăn nuôi', 'Bài 10. Nuôi dưỡng và chăm sóc vật nuôi',
        'Bài 11. Phòng và trị bệnh cho vật nuôi', 'Bài 12. Chăn nuôi gà thịt trong nông hộ', 'Bài 13. Thực hành. Lập kế hoạch nuôi vật nuôi trọng gia đình', 'Bài 14. Giới thiệu về thủy sản', 'Bài 15. Nuôi cá ao',
        'Bài 16. Thực hành. Lập kế hoạch nuôi cá cảnh'
      ]
    },
    'Khối 8': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Một số tiêu chuẩn trình bày bản vẽ kĩ thuật', 'Bài 2. Hình chiếu vuông góc', 'Bài 3. Bản vẽ chi tiết', 'Bài 4. Bản vẽ lắp', 'Bài 5. Bản vẽ nhà',
        'Bài 6. Vật liệu cơ khí', 'Bài 7. Truyền và biến đổi chuyển động', 'Bài 8. Gia công cơ khí bằng tay', 'Bài 9. Ngành nghề trong lĩnh vực cơ khí', 'Bài 10. Dự án: Gia công chi tiết bằng dụng cụ cầm tay',
        'Bài 11. Tai nạn điện', 'Bài 12. Biện pháp an toàn điện', 'Bài 13. Sơ cứu người bị tai nạn điện', 'Bài 14. Khái quát về mạch điện', 'Bài 15. Cảm biến và mô đun cảm biến',
        'Bài 16. Mạch điện điều khiển sử dụng mô đun cảm biến', 'Bài 17. Ngành nghề trong lĩnh vực kĩ thuật điện', 'Bài 18. Giới thiệu về thiết kế kĩ thuật', 'Bài 19. Các bước cơ bản trong thiết kế kĩ thuật', 'Bài 20. Dự án: Thiết kế hệ thống tưới cây tự động'
      ]
    },
    'Khối 9': {
      'Kết nối tri thức với cuộc sống (Lắp đặt mạng điện trong nhà)': [
        'Bài 1. Thiết bị đóng cắt và lấy điện trong gia đình', 'Bài 2. Dụng cụ đo điện cơ bản', 'Bài 3. Thiết kế mạng điện trong nhà', 'Bài 4. Vật liệu, thiết bị và dụng cụ dùng cho lắp đặt mạng điện trong nhà', 'Bài 5. Tính toán chi phí mạng điện trong nhà', 'Bài 6. Thực hành: Lắp đặt mạng điện trong nhà', 'Bài 7. Một số ngành nghề liên quan đến lắp đặt mạng điện trong nhà'
      ],
      'Kết nối tri thức với cuộc sống (Trồng cây ăn quả)': [
        'Bài 1. Giới thiệu chung về cây ăn quả', 'Bài 2. Nhân giống vô tính cây ăn quả', 'Bài 3. Kĩ thuật trồng và chăm sóc cây ăn quả có múi', 'Bài 4. Kĩ thuật trồng và chăm sóc cây nhãn', 'Bài 5. Kĩ thuật trồng và chăm sóc cây xoài', 'Bài 6. Kĩ thuật trồng và chăm sóc cây sầu riêng', 'Bài 7. Kĩ thuật trồng và chăm sóc cây chuối', 'Bài 8. Dự án: Trồng cây ăn quả'
      ],
      'Kết nối tri thức với cuộc sống (Định hướng nghề nghiệp)': [
        'Bài 1. Nghề nghiệp trong lĩnh vực kĩ thuật và công nghệ', 'Bài 2. Cơ cấu hệ thống giáo dục quốc dân', 'Bài 3. Thị trường lao động kĩ thuật, công nghệ tại Việt Nam', 'Bài 4. Quy trình lựa chọn nghề nghiệp', 'Bài 5. Dự án: Tự đánh giá mức độ phù hợp của bản thân với một số ngành nghề trong lĩnh vực kĩ thuật, công nghệ'
      ],
      'Kết nối tri thức với cuộc sống (Chế biến thực phẩm)': [
        'Bài 1. Thành phần dinh dưỡng trong thực phẩm', 'Bài 2. Lựa chọn và bảo quản thực phẩm', 'Bài 3. Một số ngành nghề liên quan đến chế biến thực phẩm', 'Bài 4. An toàn lao động và an toàn vệ sinh thực phẩm', 'Bài 5. Dự án: Tính toán chi phí bữa ăn theo thực đơn', 'Bài 6. Chế biến thực phẩm có sử dụng nhiệt', 'Bài 7. Chế biến thực phẩm không sử dụng nhiệt'
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
        'Bài 6. Ứng phó với tâm lí căng thẳng', 'Bài 7. Phòng chống bạo lực học đường', 'Bài 8. Quản lí tiền', 'Bài 9. Phòng, chống tệ nạn xã hội', 'Bài 10. Quyền và nghĩa vụ của công dân trong gia đình'
      ]
    },
    'Khối 8': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Tự hào về truyền thống dân tộc Việt Nam', 'Bài 2. Tôn trọng sự đa dạng của các dân tộc', 'Bài 3. Lao động cần cù, sáng tạo', 'Bài 4. Bảo vệ lẽ phải', 'Bài 5. Bảo vệ môi trường và tài nguyên thiên nhiên',
        'Bài 6. Xác định mục tiêu cá nhân', 'Bài 7. Phòng, chống bạo lực gia đình', 'Bài 8. Lập kế hoạch chi tiêu', 'Bài 9. Phòng ngừa tai nạn vũ khí, cháy, nổ và các chất độc hại', 'Bài 10. Quyền và nghĩa vụ lao động của công dân'
      ]
    },
    'Khối 9': {
      'Kết nối tri thức với cuộc sống': [
        'Bài 1. Sống có lí tưởng', 'Bài 2. Khoan dung', 'Bài 3. Tích cực tham gia các hoạt động cộng đồng', 'Bài 4. Khách quan và công bằng', 'Bài 5. Bảo vệ hoà bình',
        'Bài 6. Quản lí thời gian hiệu quả', 'Bài 7. Thích ứng với thay đổi', 'Bài 8. Tiêu dùng thông minh', 'Bài 9. Vi phạm pháp luật và trách nhiệm pháp lí', 'Bài 10. Quyền tự do kinh doanh và nghĩa vụ nộp thuế'
      ]
    }
  }
};
