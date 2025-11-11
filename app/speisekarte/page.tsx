import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const revalidate = 60; // 1 dakika cache

interface Category {
  id: string;
  name_de: string;
  position: number;
}

interface Dish {
  id: string;
  category_id: string;
  name_de: string;
  description_de: string;
  price: number;
  image_url: string;
  position: number;
}

interface MenuImage {
  id: string;
  title: string;
  image_url: string;
  position: number;
}

async function loadMenu() {
  const { data: categories } = await supabase.from('dish_categories').select('*').eq('is_active', true).order('position');
  const { data: dishes } = await supabase.from('dishes').select('*').eq('is_active', true).order('position');
  return { categories: categories || [], dishes: dishes || [] };
}

async function loadMenuImages() {
  const { data } = await supabase
    .from('menu_images')
    .select('*')
    .eq('is_active', true)
    .order('position');
  return (data || []) as MenuImage[];
}

async function loadSettings() {
  const { data } = await supabase.from('site_settings').select('*');
  const map: Record<string, string> = {};
  (data || []).forEach(r => { map[(r as any).key] = (r as any).value; });
  return {
    lieferandoUrl: map['lieferando_url'] || '',
    orderBtn: map['online_order_button_label'] || 'Online Bestellen'
  };
}

export default async function SpeisekartePage() {
  const [menu, menuImages, settings] = await Promise.all([loadMenu(), loadMenuImages(), loadSettings()]);
  const { categories, dishes } = menu;

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section - Navbar için padding ekledik */}
      <div className="bg-gray-900 text-white pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-3">Unsere Speisekarte</h1>
              <p className="text-gray-300 text-lg max-w-2xl">
                Entdecken Sie unsere köstlichen Gerichte mit frischen Zutaten
              </p>
            </div>
            {settings.lieferandoUrl && (
              <a
                href={settings.lieferandoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-gray-900 px-6 md:px-8 py-3 md:py-4 text-sm uppercase tracking-wide font-semibold hover:bg-gray-100 transition-colors inline-block text-center"
              >
                {settings.orderBtn}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Menu Images Section - Menü Fotoğrafları */}
      {menuImages.length > 0 && (
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">Unsere Menükarten</p>
              <h2 className="text-4xl font-light tracking-wide text-gray-900">
                Speisekarten zum Download
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {menuImages.map((menu) => (
                <div key={menu.id} className="bg-white border-2 border-gray-200 overflow-hidden hover:shadow-2xl hover:border-gray-400 transition-all duration-300 group">
                  <a href={menu.image_url} target="_blank" rel="noopener noreferrer" className="block aspect-[3/4] bg-gray-50 relative overflow-hidden">
                    <img
                      src={menu.image_url}
                      alt={menu.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <span className="text-white text-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                        Vergrößern
                      </span>
                    </div>
                  </a>
                  <div className="p-5 bg-gray-900 text-white">
                    <h3 className="text-lg font-medium text-center">{menu.title}</h3>
                    <p className="text-xs text-gray-400 text-center mt-1">Klicken zum Vergrößern</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Menu Section - Detaylı Ürün Listesi */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">Unsere Gerichte</p>
          <h2 className="text-4xl font-light tracking-wide text-gray-900">
            Detaillierte Speisekarte
          </h2>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 bg-white">
            <p className="text-lg text-gray-500">Keine Gerichte verfügbar</p>
          </div>
        ) : (
          <div className="space-y-16">
            {categories.map((category: Category) => {
              const categoryDishes = dishes.filter((d: Dish) => d.category_id === category.id);
              if (categoryDishes.length === 0) return null;

              return (
                <section key={category.id} className="bg-white border border-gray-200 p-8 shadow-sm">
                  <h2 className="text-3xl font-light tracking-wide mb-8 pb-4 border-b-2 border-gray-900">
                    {category.name_de}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {categoryDishes.map((dish: Dish) => (
                      <div key={dish.id} className="flex gap-4 p-4 hover:bg-gray-50 transition-colors rounded">
                        {dish.image_url && (
                          <div className="w-24 h-24 flex-shrink-0 bg-gray-100 overflow-hidden rounded">
                            <img 
                              src={dish.image_url} 
                              alt={dish.name_de} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">{dish.name_de}</h3>
                            <span className="text-lg font-semibold text-gray-900 whitespace-nowrap">€{dish.price.toFixed(2)}</span>
                          </div>
                          {dish.description_de && (
                            <p className="text-sm text-gray-600 leading-relaxed">{dish.description_de}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
