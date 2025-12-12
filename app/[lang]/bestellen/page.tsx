'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import toast from 'react-hot-toast';
import DishDetailModal from './DishDetailModal';

interface Category {
  id: string;
  name_de: string;
  name_tr: string;
  position: number;
}

export interface Dish {
  id: string;
  category_id: string;
  name_de: string;
  name_tr: string;
  description_de: string;
  description_tr: string;
  price: number;
  image_url: string;
  position: number;
  menu_number?: string;
  allergen_codes?: string[];
  ingredients?: string;
  raw_details?: string;
}

interface Allergen {
  code: string;
  name_de: string;
  name_tr: string;
  type: string;
}

interface CartItem {
  dish: Dish;
  quantity: number;
}

export default function BestellenPage() {
  const pathname = usePathname();
  const currentLocale = pathname?.startsWith('/de') ? 'de' : pathname?.startsWith('/tr') ? 'tr' : 'de';
  const isGerman = currentLocale === 'de';

  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const categoryRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Checkout form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  useEffect(() => {
    loadMenu();
    loadWhatsAppNumber();
    loadAllergens();
  }, []);

  // Filter dishes based on search query
  const getFilteredData = () => {
    if (!searchQuery.trim()) {
      return categories.map(cat => ({
        ...cat,
        dishes: dishes.filter(d => d.category_id === cat.id)
      })).filter(cat => cat.dishes.length > 0);
    }

    const query = searchQuery.toLowerCase();
    return categories.map(cat => ({
      ...cat,
      dishes: dishes.filter(d => 
        d.category_id === cat.id && (
          (d.name_de && d.name_de.toLowerCase().includes(query)) ||
          (d.name_tr && d.name_tr.toLowerCase().includes(query)) ||
          (d.description_de && d.description_de.toLowerCase().includes(query)) ||
          (d.description_tr && d.description_tr.toLowerCase().includes(query)) ||
          (d.menu_number && d.menu_number.toLowerCase().includes(query))
        )
      )
    })).filter(cat => cat.dishes.length > 0);
  };

  const filteredData = getFilteredData();

  const loadMenu = async () => {
    try {
      setLoading(true);
      const { data: categoriesData } = await supabase
        .from('dish_categories')
        .select('*')
        .eq('is_active', true)
        .order('position');

      const { data: dishesData } = await supabase
        .from('dishes')
        .select('*')
        .eq('is_active', true)
        .order('position');

      setCategories(categoriesData || []);
      setDishes(dishesData || []);
    } catch (error) {
      console.error('Fehler beim Laden des Menüs:', error);
      toast.error(isGerman ? 'Menü konnte nicht geladen werden' : 'Menü yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const loadWhatsAppNumber = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'whatsapp_business_number')
        .single();

      if (data?.value) {
        setWhatsappNumber(data.value);
      } else {
        // Varsayılan numara (ayarlanmamışsa)
        setWhatsappNumber('4917612345678');
      }
    } catch (error) {
      console.error('WhatsApp numarası yüklenemedi:', error);
      // Hata durumunda varsayılan numara
      setWhatsappNumber('4917612345678');
    }
  };

  const loadAllergens = async () => {
    try {
      const { data } = await supabase
        .from('allergens')
        .select('*')
        .order('code');

      setAllergens(data || []);
    } catch (error) {
      console.error('Allergen-Daten konnten nicht geladen werden:', error);
    }
  };

  const scrollToCategory = (categoryId: string) => {
    const element = categoryRefs.current[categoryId];
    if (element) {
      const yOffset = -100; // Offset for fixed header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveCategory(categoryId);
    }
  };

  // Track scroll position to highlight active category
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      for (const category of categories) {
        const element = categoryRefs.current[category.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveCategory(category.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories]);

  const addToCart = (dish: Dish) => {
    const existingItem = cart.find(item => item.dish.id === dish.id);
    const dishName = isGerman ? dish.name_de : dish.name_tr;
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.dish.id === dish.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
      toast.success(`${dishName} +1`, { duration: 1500 });
    } else {
      setCart([...cart, { dish, quantity: 1 }]);
      toast.success(isGerman ? `${dishName} hinzugefügt` : `${dishName} eklendi`, { duration: 1500 });
    }
  };

  const removeFromCart = (dishId: string) => {
    setCart(cart.filter(item => item.dish.id !== dishId));
  };

  const updateQuantity = (dishId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(dishId);
      return;
    }
    
    setCart(cart.map(item =>
      item.dish.id === dishId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.dish.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Delivery fee: €3 for totals up to and including €30, free above €30
  const getDeliveryFee = () => {
    const subtotal = getTotalPrice();
    if (subtotal > 0 && subtotal <= 30) return 3;
    return 0;
  };

  const getFinalTotal = () => {
    return getTotalPrice() + getDeliveryFee();
  };

  const sendWhatsAppOrder = () => {
    if (!customerName || !customerPhone || !customerAddress) {
      toast.error(isGerman 
        ? 'Bitte füllen Sie alle Pflichtfelder aus' 
        : 'Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    if (cart.length === 0) {
      toast.error(isGerman ? 'Ihr Warenkorb ist leer' : 'Sepetiniz boş');
      return;
    }

    // WhatsApp mesajını oluştur
    let message = isGerman 
      ? `*--- NEUE BESTELLUNG ---*\n\n`
      : `*--- YENİ SİPARİŞ ---*\n\n`;
    
    message += isGerman 
      ? `*Kunde:* ${customerName}\n*Telefon:* ${customerPhone}\n*Adresse:* ${customerAddress}\n`
      : `*Müşteri:* ${customerName}\n*Telefon:* ${customerPhone}\n*Adres:* ${customerAddress}\n`;
    
    if (deliveryNote) {
      message += isGerman 
        ? `*Hinweis:* ${deliveryNote}\n`
        : `*Not:* ${deliveryNote}\n`;
    }
    
    message += isGerman ? `\n*BESTELLUNG:*\n` : `\n*SİPARİŞ:*\n`;
    
    cart.forEach((item, index) => {
      const dishName = isGerman ? item.dish.name_de : item.dish.name_tr;
      message += `${index + 1}. ${item.quantity}x ${dishName} - €${(item.dish.price * item.quantity).toFixed(2)}\n`;
    });
    
    const fee = getDeliveryFee();
    const finalTotal = getFinalTotal();

    message += isGerman 
      ? `\n*ZWISCHENSUMME:* €${getTotalPrice().toFixed(2)}\n` 
      : `\n*ARA TOPLAM:* €${getTotalPrice().toFixed(2)}\n`;
    message += isGerman
      ? `*LIEFERUNG:* ${fee === 0 ? 'Kostenlos' : `€${fee.toFixed(2)}`}\n`
      : `*TESLIMAT:* ${fee === 0 ? 'Ücretsiz' : `€${fee.toFixed(2)}`}\n`;
    message += isGerman 
      ? `*GESAMT:* €${finalTotal.toFixed(2)}\n\n_Bitte bestätigen Sie die Bestellung und teilen Sie die geschätzte Lieferzeit mit._`
      : `*TOPLAM:* €${finalTotal.toFixed(2)}\n\n_Lütfen siparişi onaylayın ve tahmini teslimat süresini bildirin._`;

    if (!whatsappNumber) {
      toast.error(isGerman 
        ? 'WhatsApp-Nummer nicht konfiguriert. Bitte kontaktieren Sie den Administrator.'
        : 'WhatsApp numarası ayarlanmamış. Lütfen yönetici ile iletişime geçin.');
      return;
    }
    
    // URL encode edilmiş mesaj
    const encodedMessage = encodeURIComponent(message);
    
    // WhatsApp linkini oluştur
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Yeni sekmede WhatsApp'ı aç
    window.open(whatsappUrl, '_blank');
    
    toast.success(isGerman ? 'WhatsApp wird geöffnet...' : 'WhatsApp açılıyor...');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          {isGerman ? 'Menü wird geladen...' : 'Menü yükleniyor...'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-3">
            {isGerman ? 'Online Bestellen' : 'Online Sipariş'}
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            {isGerman 
              ? 'Wählen Sie Ihre Lieblingsgerichte und bestellen Sie direkt über WhatsApp'
              : 'Favori yemeklerinizi seçin ve doğrudan WhatsApp üzerinden sipariş verin'}
          </p>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search Bar */}
        <div className="mb-8 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isGerman ? 'Suchen Sie nach Gerichten...' : 'Yemek ara...'}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 sm:text-sm shadow-sm"
          />
        </div>

        {/* Mobile Category Navigation */}
        <div className="lg:hidden sticky top-[70px] z-40 bg-gray-50 pb-4 -mx-6 px-6 overflow-x-auto shadow-sm no-scrollbar">
          <div className="flex gap-2">
            {filteredData.map((category) => {
              const displayName = isGerman ? category.name_de : category.name_tr;
              
              return (
                <button
                  key={category.id}
                  onClick={() => scrollToCategory(category.id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {displayName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Delivery fee notice */}
        <div className="mb-6">
          <div className="bg-amber-50 border border-amber-200 text-amber-900 text-sm px-4 py-3">
            {isGerman
              ? 'Lieferkosten: Bis einschließlich 30 € fällt eine Liefergebühr von 3 € an. Ab 30 € ist die Lieferung kostenlos.'
              : 'Teslimat ücreti: 30 € dâhil olmak üzere 30 €’ya kadar 3 € teslimat ücreti uygulanır. 30 € üzeri teslimat ücretsizdir.'}
          </div>
        </div>
        <div className="flex gap-8">
          {/* Left Sidebar - Category Navigation (Desktop Only) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-white border border-gray-200 shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-sm uppercase tracking-wider font-semibold text-gray-900">
                    {isGerman ? 'Kategorien' : 'Kategoriler'}
                  </h2>
                </div>
                <nav className="p-2">
                  {filteredData.map((category) => {
                    const displayName = isGerman ? category.name_de : category.name_tr;
                    const otherName = isGerman ? category.name_tr : category.name_de;
                    const subName = displayName !== otherName ? otherName : null;

                    return (
                      <button
                        key={category.id}
                        onClick={() => scrollToCategory(category.id)}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors rounded ${
                          activeCategory === category.id
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="font-medium">{displayName}</div>
                        {subName && (
                          <div className="text-xs mt-0.5 opacity-75">
                            {subName}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content - Dish List */}
          <main className="flex-1 min-w-0">
            {filteredData.length === 0 ? (
              <div className="text-center py-16 bg-white border border-gray-200">
                <p className="text-lg text-gray-500">
                  {searchQuery 
                    ? (isGerman ? 'Keine Ergebnisse gefunden' : 'Sonuç bulunamadı')
                    : (isGerman ? 'Keine Gerichte verfügbar' : 'Mevcut yemek yok')}
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {filteredData.map((category) => {
                  const displayName = isGerman ? category.name_de : category.name_tr;
                  const otherName = isGerman ? category.name_tr : category.name_de;
                  const subName = displayName !== otherName ? otherName : null;

                  return (
                    <section
                      key={category.id}
                      ref={(el) => { categoryRefs.current[category.id] = el; }}
                      className="scroll-mt-32"
                    >
                      {/* Category Header */}
                      <div className="mb-6 pb-3 border-b-2 border-gray-900">
                        <h2 className="text-2xl md:text-3xl font-light tracking-wide text-gray-900">
                          {displayName}
                        </h2>
                        {subName && (
                          <p className="text-sm text-gray-600 mt-1">
                            {subName}
                          </p>
                        )}
                      </div>

                      {/* Dishes List */}
                      <div className="space-y-3">
                        {category.dishes.map((dish) => (
                          <div
                            key={dish.id}
                            className="bg-white border border-gray-200 hover:shadow-md transition-shadow"
                          >
                            <div className="flex gap-3 p-3 md:gap-4 md:p-4">
                              {/* Dish Image */}
                              <button
                                onClick={() => setSelectedDish(dish)}
                                className="flex-shrink-0 w-16 h-16 md:w-24 md:h-24 bg-gray-100 overflow-hidden hover:opacity-90 transition-opacity rounded-md"
                              >
                                {dish.image_url ? (
                                  <img
                                    src={dish.image_url}
                                    alt={isGerman ? dish.name_de : dish.name_tr}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                    <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                              </button>

                              {/* Dish Info */}
                              <div className="flex-1 min-w-0 flex flex-col justify-between">
                                <button
                                  onClick={() => setSelectedDish(dish)}
                                  className="text-left w-full group"
                                >
                                  <div className="flex justify-between items-start gap-2 mb-1">
                                    <h3 className="font-medium text-gray-900 text-sm md:text-base leading-tight group-hover:text-gray-600 transition-colors line-clamp-2">
                                      {isGerman ? dish.name_de : dish.name_tr}
                                    </h3>
                                    <span className="font-semibold text-gray-900 text-sm md:text-lg whitespace-nowrap">
                                      €{dish.price.toFixed(2)}
                                    </span>
                                  </div>

                                  {/* Menu Number & Allergen Badges */}
                                  <div className="flex items-center gap-1 flex-wrap mb-1">
                                    {dish.menu_number && (
                                      <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 bg-gray-900 text-white font-medium rounded-sm">
                                        Nr. {dish.menu_number}
                                      </span>
                                    )}
                                    {Array.isArray(dish.allergen_codes) && dish.allergen_codes.length > 0 && (
                                      dish.allergen_codes.map((code) => (
                                        <span
                                          key={`${dish.id}-${code}`}
                                          className="text-[10px] px-1.5 py-0.5 bg-amber-100 border border-amber-300 text-amber-900 font-medium rounded-sm"
                                        >
                                          {String(code).toUpperCase()}
                                        </span>
                                      ))
                                    )}
                                  </div>

                                  {/* Description */}
                                  {(isGerman ? dish.description_de : dish.description_tr) && (
                                    <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
                                      {isGerman ? dish.description_de : dish.description_tr}
                                    </p>
                                  )}
                                </button>
                              </div>

                              {/* Quick Add Button */}
                              <div className="flex-shrink-0 flex items-start pt-1">
                                <button
                                  onClick={() => addToCart(dish)}
                                  className="w-8 h-8 md:w-12 md:h-12 bg-gray-900 hover:bg-gray-700 text-white flex items-center justify-center transition-colors group rounded-full md:rounded-none"
                                  title={isGerman ? 'In den Warenkorb' : 'Sepete ekle'}
                                >
                                  <svg className="w-4 h-4 md:w-6 md:h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </main>

          {/* Right Sidebar - Cart (Desktop Only) */}
          <aside className="hidden xl:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-white border-2 border-gray-900 shadow-lg">
                <div className="p-4 bg-gray-900 text-white">
                  <h2 className="text-lg font-medium tracking-wide flex items-center justify-between">
                    <span>{isGerman ? 'Warenkorb' : 'Sepet'}</span>
                    {cart.length > 0 && (
                      <span className="text-sm bg-white text-gray-900 px-2 py-0.5 rounded-full">
                        {getTotalItems()}
                      </span>
                    )}
                  </h2>
                </div>

                <div className="p-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="text-gray-500 text-sm">
                        {isGerman ? 'Ihr Warenkorb ist leer' : 'Sepetiniz boş'}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                        {cart.map((item) => (
                          <div key={item.dish.id} className="flex gap-2 p-2 border border-gray-200 rounded">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm text-gray-900 line-clamp-1 mb-1">
                                {isGerman ? item.dish.name_de : item.dish.name_tr}
                              </h3>
                              <p className="text-xs text-gray-600 mb-2">€{item.dish.price.toFixed(2)}</p>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item.dish.id, item.quantity - 1)}
                                  className="w-6 h-6 border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-sm font-medium"
                                >
                                  -
                                </button>
                                <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.dish.id, item.quantity + 1)}
                                  className="w-6 h-6 border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-sm font-medium"
                                >
                                  +
                                </button>
                                <button
                                  onClick={() => removeFromCart(item.dish.id)}
                                  className="ml-auto text-red-600 hover:text-red-800"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-semibold text-sm">€{(item.dish.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t-2 border-gray-900 pt-3 mb-4 space-y-1">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">{isGerman ? 'Zwischensumme:' : 'Ara Toplam:'}</span>
                          <span>€{getTotalPrice().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">{isGerman ? 'Lieferung:' : 'Teslimat:'}</span>
                          <span>
                            {getDeliveryFee() === 0 
                              ? (isGerman ? 'Kostenlos' : 'Ücretsiz') 
                              : `€${getDeliveryFee().toFixed(2)}`}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-lg font-semibold">{isGerman ? 'Gesamt:' : 'Toplam:'}</span>
                          <span className="text-xl font-bold">€{getFinalTotal().toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {getTotalItems()} {isGerman ? 'Artikel' : 'Ürün'}
                        </p>
                      </div>

                      <button
                        onClick={() => setShowCheckout(true)}
                        className="w-full bg-green-600 text-white px-4 py-3 text-sm uppercase tracking-wide font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        {isGerman ? 'Bestellen' : 'Sipariş Ver'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Cart Bottom Bar */}
      {cart.length > 0 && (
        <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-900 p-4 z-40 shadow-lg">
          <button
            onClick={() => setShowCheckout(true)}
            className="w-full bg-green-600 text-white px-6 py-4 text-sm uppercase tracking-wide font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{isGerman ? 'Warenkorb' : 'Sepet'} ({getTotalItems()})</span>
            <span className="font-bold">€{getFinalTotal().toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* Dish Detail Modal */}
      {selectedDish && (
        <DishDetailModal
          dish={selectedDish}
          allergens={allergens}
          isGerman={isGerman}
          onClose={() => setSelectedDish(null)}
          onAddToCart={addToCart}
        />
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-light tracking-wide">
                  {isGerman ? 'Bestellung abschließen' : 'Siparişi Tamamla'}
                </h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-500 hover:text-gray-900"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-4">
                  {isGerman ? 'Ihre Kontaktdaten' : 'İletişim Bilgileriniz'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      {isGerman ? 'Name *' : 'İsim *'}
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={isGerman ? 'Ihr Name' : 'Adınız'}
                      className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      {isGerman ? 'Telefonnummer *' : 'Telefon Numarası *'}
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+49 176 12345678"
                      className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      {isGerman ? 'Lieferadresse *' : 'Teslimat Adresi *'}
                    </label>
                    <textarea
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder={isGerman ? 'Straße, Hausnummer, PLZ, Stadt' : 'Sokak, Kapı No, Posta Kodu, Şehir'}
                      rows={3}
                      className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      {isGerman ? 'Hinweise (optional)' : 'Notlar (opsiyonel)'}
                    </label>
                    <textarea
                      value={deliveryNote}
                      onChange={(e) => setDeliveryNote(e.target.value)}
                      placeholder={isGerman ? 'z.B. Klingel, Stockwerk, besondere Wünsche...' : 'Örn. Kapı zili, kat, özel istekler...'}
                      rows={2}
                      className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gray-900"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-3">
                  {isGerman ? 'Bestellübersicht' : 'Sipariş Özeti'}
                </h3>
                <div className="space-y-2 mb-4">
                  {cart.map((item) => (
                    <div key={item.dish.id} className="flex justify-between text-sm">
                      <span>{item.quantity}x {isGerman ? item.dish.name_de : item.dish.name_tr}</span>
                      <span>€{(item.dish.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1 border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{isGerman ? 'Zwischensumme:' : 'Ara Toplam:'}</span>
                    <span>€{getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{isGerman ? 'Lieferung:' : 'Teslimat:'}</span>
                    <span>{getDeliveryFee() === 0 ? (isGerman ? 'Kostenlos' : 'Ücretsiz') : `€${getDeliveryFee().toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-semibold pt-2">
                    <span>{isGerman ? 'Gesamt:' : 'Toplam:'}</span>
                    <span>€{getFinalTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={sendWhatsAppOrder}
                className="w-full bg-green-600 text-white px-6 py-4 text-sm uppercase tracking-wide font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                {isGerman ? 'Bestellung via WhatsApp senden' : 'WhatsApp ile sipariş gönder'}
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                {isGerman 
                  ? 'Sie werden zu WhatsApp weitergeleitet, um Ihre Bestellung zu bestätigen'
                  : 'Siparişinizi onaylamak için WhatsApp\'a yönlendirileceksiniz'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
