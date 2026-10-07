-- قاعدة بيانات مشروع «شنو أطبخ؟»
-- تشغيل: psql -U postgres -d shno_atbakh -f server/sql/schema.sql
-- مكتوبة من كود الباكند (models). جداول بريميوم ينشئها السيرفر وحده.

CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) UNIQUE NOT NULL
);
INSERT INTO roles (id, name) VALUES (1, 'user'), (2, 'admin') ON CONFLICT DO NOTHING;
SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password TEXT,
  google_id VARCHAR(100) UNIQUE,
  role_id INTEGER NOT NULL DEFAULT 1 REFERENCES roles(id),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);
INSERT INTO categories (id, name, description) VALUES
  (1, 'شرقي', 'أكلات عراقية وشرقية'),
  (2, 'غربي', 'أكلات عالمية')
ON CONFLICT DO NOTHING;
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

CREATE TABLE IF NOT EXISTS recipes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  instructions TEXT,
  prep_time INTEGER,
  servings INTEGER,
  image_url TEXT,
  category_id INTEGER REFERENCES categories(id),
  views_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- نفس أرقام وصفات الواجهة (client/src/data/mockRecipes.jsx)
INSERT INTO recipes (id, name, description, prep_time, servings, image_url, category_id) VALUES
  (1, 'باستا بالطماطم والريحان', 'باستا بسيطة بالطماطم الطازجة والريحان.', 25, 4, NULL, 2),
  (2, 'طبق دجاج ورز', 'دجاج متبّل يُقدَّم مع الرز والخضروات.', 35, 4, NULL, 1),
  (3, 'سلطة الحديقة', 'سلطة مقرمشة مليئة بخضروات الموسم.', 15, 4, NULL, 2),
  (4, 'عجة بالخضار', 'بيض طري محشو بخضروات ملونة.', 20, 4, NULL, 1),
  (5, 'دولمة', 'خضار محشية بالرز واللحم ومطبوخة بصلصة الطماطم.', 90, 4, '/recipes/dolma.webp', 1),
  (6, 'برياني عراقي', 'رز متبّل بالبهارات مع الدجاج والمكسرات والبازلاء.', 60, 4, '/recipes/biryani.webp', 1),
  (7, 'شوربة عدس', 'شوربة دافئة ومشبعة بالعدس والكمون والليمون.', 35, 4, '/recipes/lentil-soup.webp', 1),
  (8, 'شكشوكة', 'بيض مطهو في صلصة الطماطم والفلفل.', 20, 4, '/recipes/shakshuka.webp', 1),
  (9, 'تبسي باذنجان', 'باذنجان مقلي مع كرات اللحم والطماطم في الفرن.', 75, 4, '/recipes/eggplant-tepsi.webp', 1),
  (10, 'سلطة فتوش', 'خضروات طازجة مع خبز محمص ودبس الرمان.', 15, 4, '/recipes/fattoush.webp', 1),
  (11, 'بيتزا مارغريتا', 'عجينة رقيقة مع الطماطم والجبن والريحان.', 40, 4, '/recipes/pizza.webp', 2),
  (12, 'بان كيك', 'فطائر ناعمة تُقدَّم مع العسل أو الفواكه.', 20, 4, '/recipes/pancakes.webp', 2),
  (13, 'كبة حلب', 'أقراص رز محشوة باللحم المفروم والبصل والبهارات.', 80, 4, '/recipes/kubba-halab.webp', 1),
  (14, 'تمن ومرق فاصوليا', 'فاصوليا بيضاء مطبوخة بصلصة الطماطم مع اللحم، تُقدَّم مع التمن.', 60, 4, '/recipes/fasolia.webp', 1),
  (15, 'تشريب دجاج', 'خبز عراقي مغموس بمرق الدجاج مع الحمص والليمون الأسود.', 70, 4, '/recipes/tashreeb.webp', 1),
  (16, 'فلافل', 'أقراص مقرمشة من الحمص والأعشاب، تُقدَّم مع الصمون.', 30, 4, '/recipes/falafel.webp', 1),
  (17, 'حمص بطحينة', 'حمص ناعم بالطحينة والليمون وزيت الزيتون.', 15, 4, '/recipes/hummus.webp', 1),
  (18, 'كليجة', 'معجنات عراقية محشوة بالتمر والهيل، رمز العيد.', 90, 4, '/recipes/kleicha.webp', 1),
  (19, 'شوربة طماطم', 'شوربة كريمية دافئة بالطماطم والريحان.', 30, 4, '/recipes/tomato-soup.webp', 2),
  (20, 'سلطة سيزر بالدجاج', 'خس مقرمش مع دجاج مشوي وخبز محمص وصلصة السيزر.', 20, 4, '/recipes/caesar.webp', 2),
  (21, 'برغر لحم', 'برغر لحم مشوي مع الخضروات والجبن في خبز طري.', 30, 4, '/recipes/burger.webp', 2),
  (22, 'سمك مسكوف', 'سمك مشوي على الطريقة العراقية مع الطماطم والبصل.', 60, 4, '/recipes/masgouf.webp', 1)
ON CONFLICT DO NOTHING;
SELECT setval('recipes_id_seq', (SELECT MAX(id) FROM recipes));

CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, recipe_id)
);

CREATE TABLE IF NOT EXISTS weekly_meals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  day VARCHAR(20) NOT NULL,
  meal_type VARCHAR(20) NOT NULL,
  servings INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
