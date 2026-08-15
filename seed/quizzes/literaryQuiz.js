// Quiz: Ukrainian & Japanese literature trivia, in Ukrainian, Japanese & English
export default {
  id: "literary-quiz",
  title: "Literary Quiz 📚",
  languages: [
    { code: "uk", name: "Українська" },
    { code: "ja", name: "日本語" },
    { code: "en", name: "English" }
  ],
  questions: {
    uk: [
      {
        question: `Юрій Андрухович був одним із засновників поетичного угруповання «Бу-Ба-Бу», яке зробило карнавал, іронію та літературну гру частиною української поезії кінця 1980-х. Як розшифровується його назва?`,
        answers: [
          { text: "Буква — барва — бутафорія", score: false },
          { text: "Бунт — бароко — буря", score: false },
          { text: "Буржуазія — бандура — будяк", score: false },
          { text: "Бурлеск — балаган — буфонада", score: true }
        ]
      },
      {
        question: `У романі Сергія Жадана «Ворошиловград» Герман повертається на Донбас після зникнення брата. Який родинний бізнес йому доводиться захищати?`,
        answers: [
          { text: "Придорожній готель", score: false },
          { text: "Автозаправну станцію", score: true },
          { text: "Старий кінотеатр", score: false },
          { text: "Вугільну шахту", score: false }
        ]
      },
      {
        question: `Михайло Коцюбинський побудував <i>Intermezzo</i> як перепочинок виснаженого митця серед персоніфікованих сил природи. Кому безпосередньо присвячено новелу?`,
        answers: [
          { text: "Кононівським полям", score: true },
          { text: "Карпатським полонинам", score: false },
          { text: "Чернігівським лісам", score: false },
          { text: "Кримському морю", score: false }
        ]
      },
      {
        question: `Під псевдонімом В. Домонтович вийшли інтелектуальні романи «Дівчина з ведмедиком» і «Доктор Серафікус». Яким було справжнє ім'я автора?`,
        answers: [
          { text: "Юрій Шевельов", score: false },
          { text: "Валер'ян Підмогильний", score: false },
          { text: "Віктор Петров", score: true },
          { text: "Майк Йогансен", score: false }
        ]
      },
      {
        question: `У романі Юрія Яновського «Майстер корабля» персонажі мають прототипів серед діячів українського кіно 1920-х років. Хто став прототипом режисера Сева?`,
        answers: [
          { text: "Лесь Курбас", score: false },
          { text: "Олександр Довженко", score: true },
          { text: "Василь Кричевський", score: false },
          { text: "Амвросій Бучма", score: false }
        ]
      },
      {
        question: `Герой роману Валер'яна Підмогильного «Місто» приїздить із села до Києва, поступово входить у літературне середовище та намагається підкорити місто. Як його звати?`,
        answers: [
          { text: "То-Ма-Кі", score: false },
          { text: "Андрій Чумак", score: false },
          { text: "Михайло Решето", score: false },
          { text: "Степан Радченко", score: true }
        ]
      },
      {
        question: `«Повість про Ґенджі» (源氏物語) докладно зображує придворне життя, кохання й політичні зв'язки аристократії. У яку історичну добу відбуваються її події?`,
        answers: [
          { text: "Доба Камакура", score: false },
          { text: "Доба Хей'ан", score: true },
          { text: "Доба Сенґоку", score: false },
          { text: "Доба Едо", score: false }
        ]
      },
      {
        question: `Хто став першим японським письменником, удостоєним Нобелівської премії з літератури, і є автором «Країни снігів» (雪国)?`,
        answers: [
          { text: "Юкіо Мішіма", score: false },
          { text: "Кобо Абе", score: false },
          { text: "Ясунарі Кавабата", score: true },
          { text: "Джюн'їчіро Танідзакі", score: false }
        ]
      },
      {
        question: `У романі Юкіо Мішіми «Золотий храм» (金閣寺) головний герой поступово стає одержимим красою храму. До якого вчинку зрештою призводить ця одержимість?`,
        answers: [
          { text: "Він створює точну копію храму.", score: false },
          { text: "Він залишає монастир і назавжди покидає Кіото.", score: false },
          { text: "Він підпалює храм.", score: true },
          { text: "Він намагається оголосити храм своєю власністю.", score: false }
        ]
      },
      {
        question: `У романі Харукі Муракамі «Кафка на пляжі» (海辺のカフカ) літній чоловік на ім'я Наката втрачає здатність читати, але набуває незвичайного дару. Що він уміє робити?`,
        answers: [
          { text: "Передбачати землетруси", score: false },
          { text: "Розмовляти з котами", score: true },
          { text: "Читати чужі сни", score: false },
          { text: "Зупиняти час на кілька хвилин", score: false }
        ]
      }
    ],
    ja: [
      {
        question: `タラス・シェフチェンコは最初の詩集を『コブザール』と名づけました。伝統的な「コブザール」とは、どのような人だったでしょうか。`,
        answers: [
          { text: "修道院で年代記を書く人物", score: false },
          { text: "村の法律と裁判を担当する人物", score: false },
          { text: "コブザやバンドゥーラを弾きながら歌う旅の吟遊詩人", score: true },
          { text: "コサック軍の命令を運ぶ伝令", score: false }
        ]
      },
      {
        question: `レーシャ・ウクラインカの戯曲『森の歌』で、人間の青年ルカーシュと恋に落ちる森の精の名前は何でしょうか。`,
        answers: [
          { text: "カッサンドラ", score: false },
          { text: "マウカ", score: true },
          { text: "マルーシャ", score: false },
          { text: "ソロミヤ", score: false }
        ]
      },
      {
        question: `イヴァン・コトリャレウスキーの『エネイーダ』では、古代叙事詩の英雄たちがウクライナ・コサックのように描き直されています。その旅を率いる英雄は誰でしょうか。`,
        answers: [
          { text: "アキレウス", score: false },
          { text: "オルフェウス", score: false },
          { text: "オデュッセウス", score: false },
          { text: "アイネイアース", score: true }
        ]
      },
      {
        question: `ミハイロ・コツュブィンスキーの『忘れられた祖先の影』では、恋愛悲劇と精霊や民間信仰の世界が交差します。物語の中心となる地域はどこでしょうか。`,
        answers: [
          { text: "黒海沿岸の港町", score: false },
          { text: "カルパチア山地のフツル地方", score: true },
          { text: "ドンバスの炭鉱地域", score: false },
          { text: "キーウ近郊のドニプロ川流域", score: false }
        ]
      },
      {
        question: `ウラス・サムチュクの小説『マリア』は、一人の農村女性とその家族の運命を通して、ウクライナのどの歴史的悲劇を描いた作品でしょうか。`,
        answers: [
          { text: "クリミア・タタール人の追放", score: false },
          { text: "チョルノービリ原発事故", score: false },
          { text: "1932～1933年のホロドモール", score: true },
          { text: "1918年のキーウ包囲", score: false }
        ]
      },
      {
        question: `2020年に刊行され、海外でも高く評価されたソフィア・アンドルホーヴィチの小説『アマドカ』。題名の「アマドカ」とは、何を指しているでしょうか。`,
        answers: [
          { text: "古い地図に記されていた、現在のウクライナ領内にあったとされる湖", score: true },
          { text: "戦争で消滅したユダヤ人の町", score: false },
          { text: "中世に書かれた謎の年代記", score: false },
          { text: "カルパチア山脈に伝わる伝説の鳥", score: false }
        ]
      },
      {
        question: `芥川龍之介の『藪の中』では、一つの殺人事件について複数の人物が証言します。最後まで真相を確定できなくする、この作品の最も重要な構成上の特徴はどれでしょうか。`,
        answers: [
          { text: "証言者が全員、事件をまったく覚えていない。", score: false },
          { text: "それぞれの証言が重要な部分で矛盾している。", score: true },
          { text: "犯人の証言だけが意図的に削除されている。", score: false },
          { text: "事件が夢だったことが最後に明かされる。", score: false }
        ]
      },
      {
        question: `夏目漱石の『こころ』の最終部では、先生が友人Kへの裏切りと長年の罪悪感を明らかにします。この部分はどのような形式で書かれているでしょうか。`,
        answers: [
          { text: "Kの日記", score: false },
          { text: "新聞記事の記録", score: false },
          { text: "「私」と先生の最後の会話", score: false },
          { text: "先生から「私」へ送られた長い手紙", score: true }
        ]
      },
      {
        question: `太宰治の『人間失格』で、主人公の葉蔵は幼い頃から他人に強い恐怖を感じています。その恐怖を隠すため、彼は主にどのように振る舞うでしょうか。`,
        answers: [
          { text: "常に病気のふりをする。", score: false },
          { text: "道化を演じ、人を笑わせる。", score: true },
          { text: "自分を天才的な芸術家として見せる。", score: false },
          { text: "他人とは一切話さず、沈黙を守る。", score: false }
        ]
      },
      {
        question: `川端康成の『雪国』で、島村はある芸術について研究し、評論まで書いていますが、実際の舞台を一度も見たことがありません。それは何でしょうか。`,
        answers: [
          { text: "日本舞踊", score: false },
          { text: "西洋バレエ", score: true },
          { text: "能", score: false },
          { text: "歌舞伎", score: false }
        ]
      }
    ],
    en: [
      {
        question: `A forest spirit named Mavka falls in love with the human musician Lukash, but their relationship brings the freedom of the forest into conflict with ordinary human life. In which work does this story unfold?`,
        answers: [
          { text: "<i>Cassandra</i> by Lesia Ukrainka", score: false },
          { text: "<i>The Forest Song</i> by Lesia Ukrainka", score: true },
          { text: "<i>Marusia Churai</i> by Lina Kostenko", score: false },
          { text: "<i>The Stone Cross</i> by Vasyl Stefanyk", score: false }
        ]
      },
      {
        question: `Taras Shevchenko called his first poetry collection <i>Kobzar</i>, a title that eventually became closely associated with the poet himself. What was a kobzar traditionally?`,
        answers: [
          { text: "A monastery chronicler", score: false },
          { text: "A village judge responsible for oral law", score: false },
          { text: "A travelling bard who performed with a kobza or bandura", score: true },
          { text: "A Cossack responsible for carrying military messages", score: false }
        ]
      },
      {
        question: `Mykhailo Kotsiubynsky's <i>Shadows of Forgotten Ancestors</i> combines a tragic love story with local beliefs, rituals and mythological beings. Which community and landscape form its cultural world?`,
        answers: [
          { text: "The Hutsuls of the Carpathian Mountains", score: true },
          { text: "Crimean Tatars of the Black Sea coast", score: false },
          { text: "Mining communities of the Donbas", score: false },
          { text: "Fishing villages of the Dnipro delta", score: false }
        ]
      },
      {
        question: `Oksana Zabuzhko's <i>Fieldwork in Ukrainian Sex</i> connects the narrator's destructive relationship with which broader concern?`,
        answers: [
          { text: "Soviet industrial development", score: false },
          { text: "Colonial trauma and national identity", score: true },
          { text: "Religious conflict in rural Ukraine", score: false },
          { text: "The decline of the aristocracy", score: false }
        ]
      },
      {
        question: `The writers of Ukraine's "Executed Renaissance" differed greatly in style, from experimental prose to theatre and neoclassical poetry. What principally connects them?`,
        answers: [
          { text: "They were nineteenth-century writers who published exclusively abroad.", score: false },
          { text: "They participated in the cultural revival of the 1920s and were later suppressed, imprisoned or killed under Stalin.", score: true },
          { text: "They were dissident writers who emerged after the Chornobyl disaster.", score: false },
          { text: "They translated medieval religious texts into modern Ukrainian.", score: false }
        ]
      },
      {
        question: `Pasha, a teacher, crosses a rapidly changing front line to bring his nephew home from a boarding school. Which work and author match this journey?`,
        answers: [
          { text: "<i>Grey Bees</i> by Andrey Kurkov", score: false },
          { text: "<i>Voroshilovgrad</i> by Serhiy Zhadan", score: false },
          { text: "<i>The Orphanage</i> by Serhiy Zhadan", score: true },
          { text: "<i>The Moscoviad</i> by Yuri Andrukhovych", score: false }
        ]
      },
      {
        question: `The final and longest section of Natsume Sōseki's <i>Kokoro</i> (こころ) reveals Sensei's past and explains his guilt concerning his friend K. In what form is this section presented?`,
        answers: [
          { text: "A series of newspaper reports", score: false },
          { text: "K's recovered diary", score: false },
          { text: "A conversation recorded by the narrator", score: false },
          { text: "A long letter written by Sensei", score: true }
        ]
      },
      {
        question: `A violent death is reconstructed through mutually contradictory testimonies, including those of a bandit, the dead man's wife and the dead man himself. Which work by Akutagawa Ryūnosuke matches this structure?`,
        answers: [
          { text: "<i>Rashōmon</i> (羅生門)", score: false },
          { text: "<i>In a Grove</i> (藪の中)", score: true },
          { text: "<i>The Nose</i> (鼻)", score: false },
          { text: "<i>Hell Screen</i> (地獄変)", score: false }
        ]
      },
      {
        question: `Natsume Sōseki's <i>I Am a Cat</i> (吾輩は猫である) observes human behaviour from the perspective of a nameless cat. Which section of society is principally satirised?`,
        answers: [
          { text: "The aristocratic court of the Heian period", score: false },
          { text: "Meiji-era Tokyo intellectuals and the emerging urban middle class", score: true },
          { text: "Rural samurai families during the collapse of the shogunate", score: false },
          { text: "Factory workers in postwar Osaka", score: false }
        ]
      },
      {
        question: `Haruki Murakami's <i>Kafka on the Shore</i> (海辺のカフカ) alternates between the journey of fifteen-year-old Kafka Tamura and the life of the elderly Nakata. What unusual ability does Nakata possess?`,
        answers: [
          { text: "He can enter other people's dreams.", score: false },
          { text: "He can communicate with cats.", score: true },
          { text: "He can remember events that have not happened yet.", score: false },
          { text: "He can hear music hidden inside ordinary objects.", score: false }
        ]
      }
    ]
  },
  localisations: {
    uk: {
      quiz_name: "Літературний квіз 📚",
      quiz_description: "Перевірте свої знання української та японської літератури — від класики до сучасних романів! Тест складається з 10 запитань. Правильно відповівши щонайменше на 7 із 10 питань, ви отримаєте кодове слово — назвіть його волонтеру і отримаєте закладку, яка водночас є лотерейним квитком на розіграш книги. Приємної літературної подорожі!",
      maxscore: "Бездоганний результат! Ви справжній знавець української та японської літератури. Щоб отримати шанс виграти книгу сьогодні ввечері, назвіть організаторам кодове слово:<br><br><strong>СВІТЛЯЧОК</strong>",
      highscore: "Чудовий результат! До максимуму забракло зовсім трохи, а ваші знання все одно вражають. Щоб отримати шанс виграти книгу сьогодні ввечері, назвіть організаторам кодове слово:<br><br><strong>СВІТЛЯЧОК</strong>",
      avgscore: "Гарний результат! Ви непогано орієнтуєтесь у творчості українських та японських письменників. На жаль, для отримання кодового слова потрібно правильно відповісти щонайменше на 7 із 10 питань — спробуйте пройти тест ще раз!",
      lowscore: "Дякуємо, що взяли участь! Українська та японська літератури такі багаті, що знати геть усе неможливо. Щоб отримати кодове слово, потрібно правильно відповісти щонайменше на 7 із 10 питань — спробуйте пройти тест ще раз!"
    },
    ja: {
      quiz_name: "文学クイズ 📚",
      quiz_description: "ウクライナと日本の文学について、古典から現代小説まで知識を試してみましょう!全10問です。10問中7問以上正解すると合言葉がもらえます。それを係員に伝えると、本の抽選会用の<ruby>栞<rt>しおり</rt></ruby>(宝くじ形式のチケット)と交換できます。楽しい文学の旅を!",
      maxscore: "満点です!ウクライナと日本の文学、両方をよくご存知ですね。今夜の抽選会で本が当たるチャンスを得るには、係員に合言葉<br><br>「<strong><ruby>蛍<rt>ほたる</rt></ruby></strong>」を伝えてください。",
      highscore: "素晴らしい結果です!満点まであと少しでした。今夜の抽選会で本が当たるチャンスを得るには、係員に合言葉<br><br>「<strong><ruby>蛍<rt>ほたる</rt></ruby></strong>」を伝えてください。",
      avgscore: "良い結果です!ウクライナと日本の作家について、ある程度知っていらっしゃいますね。合言葉をもらうには10問中7問以上の正解が必要です。もう一度挑戦してみてください!",
      lowscore: "ご参加ありがとうございました!ウクライナと日本の文学はとても奥深く、すべてを知るのは簡単ではありません。合言葉をもらうには10問中7問以上の正解が必要です。もう一度挑戦してみてください!"
    },
    en: {
      quiz_name: "Literary Quiz 📚",
      quiz_description: "Test your knowledge of Ukrainian and Japanese literature — from the classics to contemporary novels! The quiz has 10 questions. Answer at least 7 out of 10 questions correctly to get a code word — tell it to a volunteer to receive a bookmark that doubles as a raffle ticket for a book giveaway. Enjoy your literary journey!",
      maxscore: "A flawless result! You are a true connoisseur of Ukrainian and Japanese literature. To get a chance to win a book tonight, tell the organisers the code word:<br><br><strong>FIREFLY</strong>",
      highscore: "A great result! You were just short of the maximum, and your knowledge is still impressive. To get a chance to win a book tonight, tell the organisers the code word:<br><br><strong>FIREFLY</strong>",
      avgscore: "A good result! You know your way around Ukrainian and Japanese writers fairly well. Unfortunately, to get the code word you need to answer at least 7 out of 10 questions correctly — try the quiz again!",
      lowscore: "Thanks for taking part! Ukrainian and Japanese literature are so rich that knowing everything is impossible. To get the code word, you need to answer at least 7 out of 10 questions correctly — try the quiz again!"
    }
  },
  // Only needed if this quiz should behave or look different from the
  // shared defaults in ../globalUiConfig.js.
  uiconfig: {}
};
