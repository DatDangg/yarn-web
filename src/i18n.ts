import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        debug: true,
        detection: {
            order: ['localStorage', 'navigator'], // Ưu tiên dùng localStorage
            caches: ['localStorage'],            // Lưu vào localStorage
        },
        resources: {
            en: {
                translation: {
                    welcome: "Hey there! I'm Lay",
                    "intro.line1": "I’m the human behind this fluffy little world where crochet is fun, messy, and full of love.",
                    "intro.line2": "Here you’ll find easy tips, fun tutorials, and stuff you can buy - like cute patterns and handmade goodies. Whether you're just learning or you've got yarn in every drawer, there’s something here for you.",
                    "intro.line3": "Grab your hook, make a mess, and let’s crochet something awesome.",
                    blogIntro: "Jump into my blog! It’s packed with tons of fun stuff - helpful tips, easy techniques, a big ol’ free patterns, and loads more to keep your hook happy.",
                    blogFind: "Finding blog...?",
                    input: "y'all looking for something?",
                    placeholder: "Seek and ye shall swoon...",
                    view: "View all",
                    about: "Hi y'all! I’m Lay - maker, dreamer, and the heart behind <bold>Wool You Be Mine</bold>. This is my little world, stitched together in soft threads and quiet joy, nestled inside the noise of the big one.",
                    quote: "People say coding and crochet have nothing in common, but they’re wrong - both start with a single line, both involve painful unraveling when you mess up, and both have me talking to myself more than I’d like to admit.",
                    random: "Some random things about me",
                    random1 : "I’m a lot enchanted by 张若男. Falling for Zhang Ruonan feels like watching light spill through a window - gentle, and somehow inevitable.",
                    random2: "I adore handicrafts - and sure, I’m lazy, but when the mood strikes, I make magic.",
                    random3: "There’s something in Bui Truong Linh’s melodies that makes me feel a little less alone.",
                    about1: "I’m a frontend developer (a little lazy, I admit =)))",
                    about2: "My love for code started in high school, and since then, it’s been my favorite way to bring ideas to life.",
                    about3: "I especially enjoy crafting luxury animations and adding small, cute UI touches that make a site feel cuteeee and personal.",
                    about4: "My workspace? Shared with more cats (but not riel) than I care to count =))",
                    about5: "Inspiration comes from dreamy ideas, favorite websites, and those random creative sparks that hit out of nowhere.",
                    about6: "This site is a soft little slice of me—where design, code, and comfort all come together.",
                    addCart: "Add to cart success",
                    table1: "PRODUCT",
                    table2: "PRICE",
                    table3: "DISCOUNT",
                    table4: "QUANTITY",
                    table5: "TOTAL",
                    table6: "REMOVE",
                    discount: "Coupon discount",
                    discountDesc: "Enter your coupon code if you have one!",
                    discountPlaceholder: "Enter your code here.",
                    payment: "Payment details",
                    payment1: "Total price",
                    payment2: "Total shipping charges",
                    payment3: "Total coupon discount",
                    payment4: "Total payment",
                    discountErr: "The coupon does not exist."
                },
            },
            vi: {
                translation: {
                    welcome: "Chào mọi người! Mình là Lay",
                    "intro.line1": "Mình là người đứng sau thế giới nhỏ bé mềm mại - nơi đan móc vui vẻ, lộn xộn và tràn ngập tình yêu nàyyyy.",
                    "intro.line2": "Ở đây có đủ thứ cho bạn khám phá: mẹo hay, hướng dẫn dễ hiểu, và cả đồ để mua - từ mẫu móc dễ thương đến sản phẩm làm sẵn xinh xắn. Dù bạn mới học hay đã móc đến mức len nằm khắp nhà, thì cũng có thứ dành cho bạn ở đây!",
                    "intro.line3": "Cầm móc lên, quấn len vào, và cùng nhau tạo ra điều gì đó thật tuyệt nhaaaaa.",
                    blogIntro: "Vào đây với mình! Ở đây có đủ thứ hay ho: các mẹo vặt, kỹ thuật đơn giản, thư viện với vô vàn mẫu móc miễn phí, và còn nhiều điều thú vị đang chờ bạn khám phá!",
                    blogFind: "Blog...?",
                    input: "Đang tìm thứ gì đó à?",
                    placeholder: "Tìm kiếm đi, rồi bạn sẽ... rung động...",
                    view: "Xem tất cả",
                    about: "Mình là Lay - kẻ mộng mơ, người thêu dệt nên những điều nhỏ xinh, và là trái tim đứng sau <bold>Wool You Be Mine</bold>. Đây là thế giới nhỏ của mình, được đan dệt từ những sợi len mềm mại và niềm vui lặng lẽ, nằm gọn giữa những ồn ào của thế giới rộng lớn ngoài kia.",
                    quote: "Lập trình và móc len tưởng chừng chẳng dính dáng gì, nhưng thật ra đều có điểm chung: chỉ cần sai một bước là phải gỡ sạch sẽ từ đầu. Một bên là code vỡ layout, một bên là khăn vặn vẹo không rõ hình thù. Và vâng, mình nói chuyện một mình với cái máy lẫn cuộn len như thể tụi nó hiểu.",
                    random: "Góc nhỏ những điều vu vơ của mình",
                    random1 : "Mình thực sự bị Zhang Ruonan mê hoặc - nhiều hơn mình muốn thừa nhận. Cảm giác rung động vì Zhang Ruonan giống như ánh nắng xuyên qua ô cửa - nhẹ nhàng, mà không cưỡng lại được.",
                    random2: "Mình mê đồ thủ công - lười thì lười thật, nhưng hứng lên là tay cũng khéo lắm nhe.",
                    random3: "Có những lúc chỉ muốn mở nhạc của Bùi Trường Linh và để mọi thứ trôi đi một chút.",
                    about1: "Mình là một frontend developer (có hơi... lười chút =)))",
                    about2: "Bén duyên với code từ thời cấp ba, và từ đó tới giờ, mình mê việc biến ý tưởng thành những trang web.",
                    about3: "Mình đặc biệt thích những animation xịn xò, thỉnh thoảng thêm chút UI dễ thương nữa.",
                    about4: "Góc làm việc thì lúc nào cũng có rất nhiềuuu bé mèo (nhưng không riel :>) làm đồng nghiệp.",
                    about5: "Ý tưởng đến từ những giấc mơ, những trang web mình yêu thích, và cả ở những lúc không ngờ nhất.",
                    about6: "Trang web này là một góc nhỏ mềm mại của mình - nơi code, đam mê, cảm hứng và chút dễ thương gặp nhau.",
                    addCart: "Thêm sản phẩm thành công",
                    table1: "SẢN PHẨM",
                    table2: "GIÁ",
                    table3: "GIẢM GIÁ",
                    table4: "SỐ LƯỢNG",
                    table5: "TỔNG GIÁ",
                    table6: "XÓA",
                    discount: "Mã giảm giá",
                    discountDesc: "Điền mã giảm giá nếu bạn có",
                    discountPlaceholder: "Nhập mã giảm giá ở đây",
                    payment: "Chi tiết thanh toán",
                    payment1: "Tổng tiền hàng",
                    payment2: "Tổng phí vận chuyển",
                    payment3: "Tổng mã giảm giá",
                    payment4: "Tổng thanh toán",
                    discountErr: "Mã đổi không tồn tại."
                },
            },
        },

        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
