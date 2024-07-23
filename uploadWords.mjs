// uploadArabicCategories.mjs
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(readFileSync('./miscarded-firebase-adminsdk-ye5j6-a7b9c6853c.json', 'utf8'));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firestore = admin.firestore();

const arabicCategories = [
  {
    category: 'الحيوانات',
    words: [
      'قطة', 'كلب', 'أسد', 'نمر', 'فيل', 'زرافة', 'حمار وحشي', 'كنغر', 'باندا', 'دب', 'ذئب', 'ثعلب', 'غزال', 'قرد', 'كوالا', 'أرنب', 'سنجاب', 'فرس النهر', 'وحيد القرن', 'فهد'
    ]
  },
  {
    category: 'الفواكه',
    words: [
      'تفاح', 'موز', 'عنب', 'برتقال', 'مانجو', 'أناناس', 'خوخ', 'كرز', 'كيوي', 'برقوق', 'بطيخ', 'فراولة', 'توت أزرق', 'توت العليق', 'توت أسود', 'ليمون', 'ليمون حامض', 'رمان', 'تين', 'جريب فروت'
    ]
  },
  {
    category: 'الألوان',
    words: [
      'أحمر', 'أزرق', 'أخضر', 'أصفر', 'أرجواني', 'برتقالي', 'وردي', 'بني', 'أسود', 'أبيض', 'رمادي', 'سماوي', 'قرمزي', 'ليموني', 'نيلي', 'ماروني', 'فيروزي', 'أزرق مخضر', 'زيتوني', 'ذهبي'
    ]
  },
  {
    category: 'الدول',
    words: [
      'الولايات المتحدة', 'كندا', 'المكسيك', 'البرازيل', 'ألمانيا', 'فرنسا', 'إيطاليا', 'اليابان', 'الصين', 'الهند', 'روسيا', 'إسبانيا', 'أستراليا', 'الأرجنتين', 'مصر', 'نيجيريا', 'جنوب أفريقيا', 'كوريا الجنوبية', 'السعودية', 'تركيا'
    ]
  },
  {
    category: 'المركبات',
    words: [
      'سيارة', 'شاحنة', 'دراجة نارية', 'دراجة', 'حافلة', 'قطار', 'طائرة', 'قارب', 'مروحية', 'غواصة', 'سكوتر', 'لوح تزلج', 'ترام', 'فان', 'جيب', 'تاكسي', 'مركبة هوائية', 'يخت', 'جرار', 'ليموزين'
    ]
  },
  {
    category: 'الرياضات',
    words: [
      'كرة القدم', 'كرة السلة', 'التنس', 'البيسبول', 'الهوكي', 'الكريكيت', 'الجولف', 'الرجبي', 'الكرة الطائرة', 'السباحة', 'ركوب الدراجات', 'الملاكمة', 'المصارعة', 'الجمباز', 'ركوب الأمواج', 'التزلج', 'التزلج على الجليد', 'التزلج على الثلج', 'الرماية', 'الريشة الطائرة'
    ]
  },
  {
    category: 'الوظائف',
    words: [
      'طبيب', 'معلم', 'مهندس', 'محامي', 'ممرض', 'طيار', 'طاه', 'رجل إطفاء', 'شرطي', 'فنان', 'عالم', 'ممثل', 'موسيقي', 'كاتب', 'مهندس معماري', 'طبيب أسنان', 'صيدلي', 'طبيب بيطري', 'كهربائي', 'سباك'
    ]
  },
  {
    category: 'الأثاث',
    words: [
      'كرسي', 'طاولة', 'أريكة', 'سرير', 'مكتب', 'خزانة', 'رف', 'براز', 'خزانة', 'دولاب', 'كرسي بذراعين', 'مقعد', 'مكتبة', 'طاولة قهوة', 'طاولة بجانب السرير', 'خزانة مطبخ', 'بوفيه', 'مسند قدم', 'كرسي هزاز', 'مقعد مزدوج'
    ]
  },
  {
    category: 'الأدوات',
    words: [
      'مطرقة', 'مفتاح ربط', 'مفك براغي', 'مثقاب', 'منشار', 'كماشة', 'إزميل', 'مستوى', 'شريط قياس', 'سلم', 'فأس', 'مجرفة', 'مكشطة', 'مجرفة', 'عصا الرفع', 'صنفرة', 'ملزمة', 'ملف', 'مطرقة صغيرة', 'قاطع أسلاك'
    ]
  },
  {
    category: 'الآلات الموسيقية',
    words: [
      'جيتار', 'بيانو', 'طبول', 'كمان', 'فلوت', 'بوق', 'ساكسفون', 'كلارينيت', 'تشيلو', 'قيثارة', 'ترومبون', 'باس', 'أوبوا', 'مندولين', 'بانجو', 'أكورديون', 'مزمار القربة', 'هارمونيكا', 'يوكليلي', 'زيلوفون'
    ]
  },
  {
    category: 'الأفلام',
    words: [
      'Inception', 'Titanic', 'Avatar', 'The Matrix', 'Interstellar', 'The Godfather', 'Star Wars', 'Jurassic Park', 'The Avengers', 'Forrest Gump', 'Pulp Fiction', 'The Shawshank Redemption', 'Fight Club', 'Gladiator', 'The Dark Knight', 'Jaws', 'Rocky', 'Casablanca', 'Goodfellas', 'Schindler\'s List'
    ]
  },
  {
    category: 'المغنيين',
    words: [
      'Beyoncé', 'Adele', 'Elvis Presley', 'Michael Jackson', 'Madonna', 'Freddie Mercury', 'Whitney Houston', 'Taylor Swift', 'Bruno Mars', 'Ariana Grande', 'Frank Sinatra', 'Elton John', 'Bob Dylan', 'Stevie Wonder', 'David Bowie', 'Prince', 'John Lennon', 'Paul McCartney', 'Janis Joplin', 'Aretha Franklin'
    ]
  },
  {
    category: 'الممثلين',
    words: [
      'Leonardo DiCaprio', 'Meryl Streep', 'Robert De Niro', 'Tom Hanks', 'Johnny Depp', 'Scarlett Johansson', 'Brad Pitt', 'Denzel Washington', 'Jennifer Lawrence', 'Morgan Freeman', 'Al Pacino', 'Julia Roberts', 'Natalie Portman', 'Angelina Jolie', 'Harrison Ford', 'Will Smith', 'Samuel L. Jackson', 'Charlize Theron', 'Cate Blanchett', 'Emma Stone'
    ]
  },
  {
    category: 'المخرجين',
    words: [
      'Steven Spielberg', 'Martin Scorsese', 'Christopher Nolan', 'Quentin Tarantino', 'Alfred Hitchcock', 'James Cameron', 'Stanley Kubrick', 'Ridley Scott', 'Peter Jackson', 'Francis Ford Coppola', 'Tim Burton', 'David Fincher', 'Guillermo del Toro', 'George Lucas', 'Woody Allen', 'Clint Eastwood', 'Wes Anderson', 'Joel Coen', 'Ethan Coen', 'Spike Lee'
    ]
  },
  {
    category: 'ماركات السيارات',
    words: [
      'Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz', 'Audi', 'Tesla', 'Volkswagen', 'Nissan', 'Porsche', 'Lamborghini', 'Ferrari', 'Bentley', 'Jaguar', 'Maserati', 'Lexus', 'Subaru', 'Mazda', 'Aston Martin'
    ]
  },
  {
    category: 'الطعام الكردي',
    words: [
      'Dolma', 'Kebab', 'Biryani', 'Qozy', 'Fasolia', 'Kubba', 'Kofta', 'Pacha', 'Tapsi', 'Paqla', 'Gus', 'Birinj'
    ]
  },
  {
    category: 'المغنيين الكرد',
    words: [
      'Shivan Perwer', 'Hesen Zîrek', 'Zekeria Abdulla', 'Ayub Ali', 'Faxir Heriri', 'Karim Kaban', 'Mihemed Mamle', 'Merzia Feriqi', 'Nasir Rezazi', 'Abbas Kemendi', 'Karwan Xabati', 'Dashni Morad', 'Goran', 'Adnan Karim', 'Cwan Hajo', 'Azhdar Wahbi', 'Hozan Dino', 'Rozh Karim', 'Chopi Fetah', 'Hani'
    ]
  }
];

const uploadArabicCategories = async () => {
  const categoriesCollection = firestore.collection('arabic_categories');

  for (const categoryData of arabicCategories) {
    await categoriesCollection.add(categoryData);
  }

  console.log('Arabic categories uploaded successfully!');
};

uploadArabicCategories().catch(console.error);
