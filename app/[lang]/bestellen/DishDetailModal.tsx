'use client';

import { Dish } from './page';

interface Allergen {
  code: string;
  name_de: string;
  name_tr: string;
  type: string;
}

interface DishDetailModalProps {
  dish: Dish;
  allergens: Allergen[];
  onClose: () => void;
  onAddToCart: (dish: Dish) => void;
}

export default function DishDetailModal({ dish, allergens, onClose, onAddToCart }: DishDetailModalProps) {
  const handleAddToCart = () => {
    onAddToCart(dish);
    onClose();
  };

  const dishAllergens = dish.allergen_codes
    ?.map(code => allergens.find(a => a.code.toLowerCase() === code.toLowerCase()))
    .filter(Boolean) as Allergen[];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
          <h3 className="text-xl font-medium text-gray-900">{dish.name_de}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image */}
          {dish.image_url ? (
            <div className="w-full h-64 bg-gray-100 overflow-hidden mb-6">
              <img 
                src={dish.image_url} 
                alt={dish.name_de} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6">
              <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {dish.menu_number && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Menü-Nr.</p>
                <p className="text-sm font-medium">{dish.menu_number}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Preis</p>
              <p className="text-2xl font-semibold text-gray-900">€{dish.price.toFixed(2)}</p>
            </div>
          </div>

          {/* Turkish Name */}
          {dish.name_tr && dish.name_tr !== dish.name_de && (
            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Türkischer Name</p>
              <p className="text-sm text-gray-700">{dish.name_tr}</p>
            </div>
          )}

          {/* Description */}
          {dish.description_de && (
            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Beschreibung</p>
              <p className="text-sm text-gray-700 leading-relaxed">{dish.description_de}</p>
            </div>
          )}

          {/* Turkish Description */}
          {dish.description_tr && dish.description_tr !== dish.description_de && (
            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Türkische Beschreibung</p>
              <p className="text-sm text-gray-700 leading-relaxed">{dish.description_tr}</p>
            </div>
          )}

          {/* Ingredients */}
          {dish.ingredients && (
            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Zutaten</p>
              <p className="text-sm text-gray-700 leading-relaxed">{dish.ingredients}</p>
            </div>
          )}

          {/* Allergens */}
          {dishAllergens && dishAllergens.length > 0 && (
            <div className="mb-6 bg-amber-50 border border-amber-200 p-4">
              <div className="flex items-start gap-2 mb-3">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <p className="text-xs text-amber-900 uppercase tracking-wide font-semibold mb-2">Allergene & Zusatzstoffe</p>
                  <div className="space-y-2">
                    {dishAllergens.map((allergen) => (
                      <div key={allergen.code} className="flex items-start gap-2">
                        <span className="inline-block px-2 py-0.5 bg-amber-600 text-white text-xs font-medium min-w-[24px] text-center">
                          {allergen.code.toUpperCase()}
                        </span>
                        <span className="text-sm text-amber-900 flex-1">
                          {allergen.name_de}
                          {allergen.name_tr && allergen.name_tr !== allergen.name_de && (
                            <span className="text-amber-700 ml-2">({allergen.name_tr})</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Raw Details (if any) */}
          {dish.raw_details && (
            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Weitere Informationen</p>
              <p className="text-xs text-gray-600 leading-relaxed">{dish.raw_details}</p>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-gray-900 text-white px-6 py-4 text-sm uppercase tracking-wide font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            In den Warenkorb
          </button>
        </div>
      </div>
    </div>
  );
}
