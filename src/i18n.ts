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
                    "intro.line2": "Here you’ll find easy tips, fun tutorials, and stuff you can buy—like cute patterns and handmade goodies. Whether you're just learning or you've got yarn in every drawer, there’s something here for you.",
                    "intro.line3": "Grab your hook, make a mess, and let’s crochet something awesome.",
                    blogIntro: "Jump into my blog! It’s packed with tons of fun stuff—helpful tips, easy techniques, a big ol’ free patterns, and loads more to keep your hook happy.",
                    input: "y'all looking for something?",
                    placeholder: "Seek and ye shall swoon...",
                    view: "View all",
                },
            },
            vi: {
                translation: {
                    welcome: "Chào mọi người! Mình là Lay",
                    "intro.line1": "Mình là người đứng sau thế giới nhỏ bé mềm mại - nơi đan móc vui vẻ, lộn xộn và tràn ngập tình yêu nàyyyy.",
                    "intro.line2": "Ở đây có đủ thứ cho bạn khám phá: mẹo hay, hướng dẫn dễ hiểu, và cả đồ để mua - từ mẫu móc dễ thương đến sản phẩm làm sẵn xinh xắn. Dù bạn mới học hay đã móc đến mức len nằm khắp nhà, thì cũng có thứ dành cho bạn ở đây!",
                    "intro.line3": "Cầm móc lên, quấn len vào, và cùng nhau tạo ra điều gì đó thật tuyệt nhaaaaa.",
                    blogIntro: "Vào đây với mình! Ở đây có đủ thứ hay ho: các mẹo vặt, kỹ thuật đơn giản, thư viện với vô vàn mẫu móc miễn phí, và còn nhiều điều thú vị đang chờ bạn khám phá!",
                    input: "Đang tìm thứ gì đó à?",
                    placeholder: "Tìm kiếm đi, rồi bạn sẽ... rung động...",
                    view: "Xem tất cả",
                },
            },
        },

        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
