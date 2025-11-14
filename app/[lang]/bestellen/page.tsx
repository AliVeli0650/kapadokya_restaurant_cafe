'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import toast from 'react-hot-toast';

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

interface CartItem {
  dish: Dish;
  quantity: number;
}

export default function BestellenPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);

  // Checkout form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  useEffect(() => {
    loadMenu();
    loadWhatsAppNumber();
  }, []);

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
      toast.error('Menü konnte nicht geladen werden');
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

  const addToCart = (dish: Dish) => {
    const existingItem = cart.find(item => item.dish.id === dish.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.dish.id === dish.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { dish, quantity: 1 }]);
    }
    
    toast.success(`${dish.name_de} zum Warenkorb hinzugefügt`);
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

  const sendWhatsAppOrder = () => {
    if (!customerName || !customerPhone || !customerAddress) {
      toast.error('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }

    if (cart.length === 0) {
      toast.error('Ihr Warenkorb ist leer');
      return;
    }

    // WhatsApp mesajını oluştur
    let message = `*--- NEUE BESTELLUNG ---*\n\n`;
    message += `*Kunde:* ${customerName}\n`;
    message += `*Telefon:* ${customerPhone}\n`;
    message += `*Adresse:* ${customerAddress}\n`;
    if (deliveryNote) {
      message += `*Hinweis:* ${deliveryNote}\n`;
    }
    message += `\n*BESTELLUNG:*\n`;
    
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.quantity}x ${item.dish.name_de} - €${(item.dish.price * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\n*GESAMT: €${getTotalPrice().toFixed(2)}*\n\n`;
    message += `_Bitte bestätigen Sie die Bestellung und teilen Sie die geschätzte Lieferzeit mit._`;

    if (!whatsappNumber) {
      toast.error('WhatsApp numarası ayarlanmamış. Lütfen yönetici ile iletişime geçin.');
      return;
    }
    
    // URL encode edilmiş mesaj
    const encodedMessage = encodeURIComponent(message);
    
    // WhatsApp linkini oluştur
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Yeni sekmede WhatsApp'ı aç
    window.open(whatsappUrl, '_blank');
    
    toast.success('WhatsApp wird geöffnet...');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Menü wird geladen...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-3">Online Bestellen</h1>
            <p className="text-gray-300 text-lg max-w-2xl">
              Wählen Sie Ihre Lieblingsgerichte und bestellen Sie direkt über WhatsApp
            </p>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Menu Column */}
          <div className="flex-1">
            {categories.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-300 bg-white">
                <p className="text-lg text-gray-500">Keine Gerichte verfügbar</p>
              </div>
            ) : (
              <div className="space-y-16">
            {categories.map((category) => {
              const categoryDishes = dishes.filter(d => d.category_id === category.id);
              if (categoryDishes.length === 0) return null;

              return (
                <section key={category.id} className="bg-white border border-gray-200 p-8 shadow-sm">
                  <h2 className="text-3xl font-light tracking-wide mb-8 pb-4 border-b-2 border-gray-900">
                    {category.name_de}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {categoryDishes.map((dish) => (
                      <div key={dish.id} className="flex gap-4 p-4 hover:bg-gray-50 transition-colors rounded border border-gray-100">
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
                            <p className="text-sm text-gray-600 leading-relaxed mb-3">{dish.description_de}</p>
                          )}
                          <button
                            onClick={() => addToCart(dish)}
                            className="bg-gray-900 text-white px-4 py-2 text-sm uppercase tracking-wide hover:bg-gray-700 transition-colors w-full md:w-auto"
                          >
                            In den Warenkorb
                          </button>
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

          {/* Cart Sidebar - Desktop */}
          <div className="hidden lg:block lg:w-96 lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white border-2 border-gray-900 p-6">
              <h2 className="text-2xl font-light tracking-wide mb-6 pb-4 border-b-2 border-gray-900">
                Warenkorb
              </h2>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-gray-500 text-sm">Ihr Warenkorb ist leer</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.dish.id} className="flex gap-3 p-3 border border-gray-200 rounded">
                        {item.dish.image_url && (
                          <div className="w-16 h-16 flex-shrink-0 bg-gray-100 overflow-hidden rounded">
                            <img 
                              src={item.dish.image_url} 
                              alt={item.dish.name_de} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-1">{item.dish.name_de}</h3>
                          <p className="text-xs text-gray-600 mb-2">€{item.dish.price.toFixed(2)}</p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.dish.id, item.quantity - 1)}
                              className="w-6 h-6 border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-sm"
                            >
                              -
                            </button>
                            <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.dish.id, item.quantity + 1)}
                              className="w-6 h-6 border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-sm"
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

                  <div className="border-t-2 border-gray-900 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Gesamt:</span>
                      <span className="text-xl font-bold">€{getTotalPrice().toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{getTotalItems()} Artikel</p>
                  </div>

                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-green-600 text-white px-6 py-3 text-sm uppercase tracking-wide font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Bestellen
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Cart Bottom Bar */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-900 p-4 z-40 shadow-lg">
          <button
            onClick={() => setShowCheckout(true)}
            className="w-full bg-green-600 text-white px-6 py-4 text-sm uppercase tracking-wide font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Warenkorb anzeigen ({getTotalItems()})</span>
            <span className="font-bold">€{getTotalPrice().toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-light tracking-wide">Bestellung abschließen</h2>
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
                <h3 className="font-medium text-gray-900 mb-4">Ihre Kontaktdaten</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ihr Name"
                      className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Telefonnummer *</label>
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
                    <label className="block text-sm text-gray-700 mb-2">Lieferadresse *</label>
                    <textarea
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Straße, Hausnummer, PLZ, Stadt"
                      rows={3}
                      className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Hinweise (optional)</label>
                    <textarea
                      value={deliveryNote}
                      onChange={(e) => setDeliveryNote(e.target.value)}
                      placeholder="z.B. Klingel, Stockwerk, besondere Wünsche..."
                      rows={2}
                      className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gray-900"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Bestellübersicht</h3>
                <div className="space-y-2 mb-4">
                  {cart.map((item) => (
                    <div key={item.dish.id} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.dish.name_de}</span>
                      <span>€{(item.dish.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-xl font-semibold border-t border-gray-200 pt-3">
                  <span>Gesamt:</span>
                  <span>€{getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={sendWhatsAppOrder}
                className="w-full bg-green-600 text-white px-6 py-4 text-sm uppercase tracking-wide font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Bestellung via WhatsApp senden
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                Sie werden zu WhatsApp weitergeleitet, um Ihre Bestellung zu bestätigen
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
