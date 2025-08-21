import { ArrowLeft, Search, Plus, Minus, Popcorn, Cookie, Coffee, UtensilsCrossed, Candy, IceCream } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import popcornImg from '@/assets/popcorn.jpg';
import nachosImg from '@/assets/nachos.jpg';
import softDrinkImg from '@/assets/soft-drink.jpg';
import hotdogImg from '@/assets/hotdog.jpg';
import candyImg from '@/assets/candy.jpg';
import iceCreamImg from '@/assets/ice-cream.jpg';
interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}
interface FoodSelectionProps {
  onBack: () => void;
  onContinue: (foodItems: {
    item: FoodItem;
    quantity: number;
  }[], total: number) => void;
}
export function FoodSelection({
  onBack,
  onContinue
}: FoodSelectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showComboPopup, setShowComboPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showComboMagic, setShowComboMagic] = useState(false);
  const [hasAddedFirstItem, setHasAddedFirstItem] = useState(false);
  const foodItems: FoodItem[] = [{
    id: '1',
    name: 'Classic Popcorn',
    description: 'Freshly popped corn with butter (413 Kcal)',
    price: 180,
    image: popcornImg,
    category: 'Popcorn'
  }, {
    id: '2',
    name: 'Cheese Nachos',
    description: 'Crispy nachos with melted cheese (665 kcal)',
    price: 220,
    image: nachosImg,
    category: 'Snacks'
  }, {
    id: '3',
    name: 'Soft Drink (Large)',
    description: 'Refreshing cold beverage 500ml',
    price: 150,
    image: softDrinkImg,
    category: 'Beverages'
  }, {
    id: '4',
    name: 'Hot Dog',
    description: 'Grilled sausage with condiments',
    price: 200,
    image: hotdogImg,
    category: 'Main'
  }, {
    id: '5',
    name: 'Candy Mix',
    description: 'Assorted movie theater candies',
    price: 120,
    image: candyImg,
    category: 'Sweets'
  }, {
    id: '6',
    name: 'Ice Cream',
    description: 'Vanilla ice cream cup',
    price: 160,
    image: iceCreamImg,
    category: 'Desserts'
  }, {
    id: 'combo-popcorn',
    name: 'Combo Popcorn (Large)',
    description: 'Part of special combo offer',
    price: 180,
    image: popcornImg,
    category: 'Combo'
  }, {
    id: 'combo-drink',
    name: 'Combo Soft Drink (Large)',
    description: 'Part of special combo offer',
    price: 150,
    image: softDrinkImg,
    category: 'Combo'
  }];
  const categories = [
    { name: 'All', icon: null },
    { name: 'Popcorn', icon: Popcorn },
    { name: 'Snacks', icon: Cookie },
    { name: 'Beverages', icon: Coffee },
    { name: 'Main', icon: UtensilsCrossed },
    { name: 'Sweets', icon: Candy },
    { name: 'Desserts', icon: IceCream }
  ];
  const filteredItems = foodItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const notComboItem = item.category !== 'Combo'; // Exclude combo items from regular display
    return matchesCategory && matchesSearch && notComboItem;
  });
  const updateQuantity = (itemId: string, change: number) => {
    setCart(prev => {
      const newQuantity = (prev[itemId] || 0) + change;
      const wasEmpty = Object.values(prev).reduce((sum, qty) => sum + qty, 0) === 0;
      
      if (newQuantity <= 0) {
        const {
          [itemId]: _,
          ...rest
        } = prev;
        return rest;
      }
      
      const newCart = {
        ...prev,
        [itemId]: newQuantity
      };
      
      // Show combo magic when first food item is added
      if (wasEmpty && change > 0 && !hasAddedFirstItem && !itemId.includes('combo')) {
        setHasAddedFirstItem(true);
        setTimeout(() => {
          setShowComboMagic(true);
          setTimeout(() => setShowComboMagic(false), 3000);
        }, 500);
      }
      
      return newCart;
    });
  };
  const getTotalItems = () => Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const getTotalPrice = () => {
    return Object.entries(cart).reduce((sum, [itemId, quantity]) => {
      const item = foodItems.find(f => f.id === itemId);
      // Special combo pricing: if both combo items are in cart, apply combo price
      if (itemId === 'combo-popcorn' || itemId === 'combo-drink') {
        const comboPopcornQty = cart['combo-popcorn'] || 0;
        const comboDrinkQty = cart['combo-drink'] || 0;
        const comboSets = Math.min(comboPopcornQty, comboDrinkQty);
        
        if (itemId === 'combo-popcorn') {
          const comboPrice = comboSets * 250; // ₹250 per combo set
          const extraPopcorn = (comboPopcornQty - comboSets) * 180; // Regular price for extra
          return sum + comboPrice + extraPopcorn;
        } else if (itemId === 'combo-drink') {
          // Price already calculated in combo-popcorn, just add extra drinks
          const extraDrinks = (comboDrinkQty - comboSets) * 150;
          return sum + extraDrinks;
        }
      }
      return sum + (item?.price || 0) * quantity;
    }, 0);
  };
  const getCartItems = () => {
    return Object.entries(cart).map(([itemId, quantity]) => {
      const item = foodItems.find(f => f.id === itemId)!;
      return {
        item,
        quantity
      };
    });
  };
  return <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b shadow-sm z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-bold text-lg text-booking-dark">Grab a Bite!</h1>
              <p className="text-xs text-gray-600">INOX Megaplex: Phoenix Mall of the...</p>
            </div>
          </div>
          <Button variant="outline" className="text-booking-primary border-booking-primary">
            Skip
          </Button>
        </div>

        {/* Search */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search for F&B Items" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 border-gray-200 focus:border-booking-primary" />
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 pb-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {categories.map(category => <Button key={category.name} variant={selectedCategory === category.name ? "default" : "outline"} className={`min-w-fit px-4 py-2 text-sm ${selectedCategory === category.name ? 'bg-booking-primary text-white' : 'border-gray-200 text-gray-600 hover:border-booking-primary'} flex items-center gap-2`} onClick={() => setSelectedCategory(category.name)}>
                {category.icon && <category.icon className="w-4 h-4" />}
                {category.name}
              </Button>)}
          </div>
        </div>
      </div>

      {/* Food Items */}
      <div className="p-4 space-y-4 pb-24">
        {/* Show combo items only if they exist in cart */}
        {(cart['combo-popcorn'] > 0 || cart['combo-drink'] > 0) && (
          <Card className={`p-4 shadow-sm border-booking-primary bg-booking-light relative ${
            showComboMagic ? 'animate-pulse' : ''
          } ${hasAddedFirstItem && !(cart['combo-popcorn'] > 0 || cart['combo-drink'] > 0) ? 'ring-4 ring-booking-primary ring-opacity-50 animate-bounce' : ''}`}>
            {showComboMagic && (
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-booking-primary/20 to-booking-primary/10 animate-pulse"></div>
            )}
            <div className="flex gap-4 relative z-10">
              <div className="flex -space-x-2">
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border-2 border-white">
                  <img src={popcornImg} alt="Popcorn" className="w-full h-full object-cover" />
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border-2 border-white">
                  <img src={softDrinkImg} alt="Soft Drink" className="w-full h-full object-cover" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-start gap-2 mb-1">
                  <div className="w-3 h-3 bg-booking-primary rounded-full mt-1 flex-shrink-0"></div>
                  <h3 className="font-semibold text-booking-dark text-sm leading-tight">Movie Combo (Popcorn + Soft Drink)</h3>
                  <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded ml-auto animate-pulse">SAVE ₹80</span>
                </div>
                
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">Special combo offer - Limited to 1 per ticket</p>
                
                <div className="flex items-center justify-center gap-2">
                  <div>
                    <span className="text-sm text-gray-500 line-through">₹330</span>
                    <span className="text-lg font-bold text-booking-primary ml-2">₹250</span>
                  </div>
                  
                  {(cart['combo-popcorn'] > 0 || cart['combo-drink'] > 0) ? (
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="w-8 h-8 border-booking-primary text-booking-primary" 
                        onClick={() => {
                          setCart(prev => ({
                            ...prev,
                            'combo-popcorn': Math.max(0, (prev['combo-popcorn'] || 0) - 1),
                            'combo-drink': Math.max(0, (prev['combo-drink'] || 0) - 1)
                          }));
                        }}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="font-semibold text-booking-dark min-w-[20px] text-center">
                        {Math.min(cart['combo-popcorn'] || 0, cart['combo-drink'] || 0)}
                      </span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="w-8 h-8 border-booking-primary text-booking-primary" 
                        onClick={() => {
                          const currentComboCount = Math.min(cart['combo-popcorn'] || 0, cart['combo-drink'] || 0);
                          if (currentComboCount < 2) { // Limit to 2 tickets max
                            setCart(prev => ({
                              ...prev,
                              'combo-popcorn': (prev['combo-popcorn'] || 0) + 1,
                              'combo-drink': (prev['combo-drink'] || 0) + 1
                            }));
                          }
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        setCart(prev => ({
                          ...prev,
                          'combo-popcorn': (prev['combo-popcorn'] || 0) + 1,
                          'combo-drink': (prev['combo-drink'] || 0) + 1
                        }));
                        setShowConfetti(true);
                        setTimeout(() => setShowConfetti(false), 3000);
                      }}
                      className="bg-booking-primary hover:bg-booking-primary/90 text-white px-6 py-2 rounded-lg font-semibold"
                    >
                      Add Combo
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}
        
        {filteredItems.map(item => {
        const quantity = cart[item.id] || 0;
        return <Card key={item.id} className="p-3 shadow-sm border-gray-100">
              <div className="flex items-center gap-3">
                {/* Product Image - 52x52 */}
                <div className="bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="object-cover" style={{width: '52px', height: '52px'}} />
                </div>
                
                {/* Product Info Block */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <h3 className="font-semibold text-booking-dark text-sm leading-tight">{item.name}</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-tight line-clamp-2">{item.description}</p>
                </div>
                
                {/* Add Button Block */}
                <div className="flex items-center gap-2">
                  {quantity > 0 && (
                    <span className="animate-slide-right" style={{fontSize: '15px', fontWeight: '400'}}>₹{item.price}</span>
                  )}
                  {quantity === 0 ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-booking-primary text-booking-primary hover:bg-booking-primary hover:text-white px-4 py-1 text-xs" 
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      Add ₹{item.price}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="w-6 h-6 border-booking-primary text-booking-primary" onClick={() => updateQuantity(item.id, -1)}>
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="font-semibold text-booking-dark min-w-[16px] text-center text-sm">{quantity}</span>
                      <Button variant="outline" size="icon" className="w-6 h-6 border-booking-primary text-booking-primary" onClick={() => updateQuantity(item.id, 1)}>
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>;
      })}
      </div>

      {/* Bottom Cart */}
      {getTotalItems() > 0 && <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3 text-sm">
              <span>Ticket Total: ₹440</span>
              <span>Food Total: ₹{getTotalPrice()}</span>
            </div>
            <Button onClick={() => onContinue(getCartItems(), getTotalPrice())} className="w-full bg-booking-primary hover:bg-booking-primary/90 text-white min-h-[72px] py-4 text-lg font-semibold rounded-xl">
              <div className="flex justify-between items-center w-full">
                <div className="text-left">
                  <div className="text-lg font-bold">07:30 PM</div>
                  <div className="text-xs font-light">THU, 21 AUG</div>
                </div>
                <div className="flex items-center gap-2">
                  <span>Continue</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </Button>
          </div>
        </div>}

      {/* Skip option when no items */}
      {getTotalItems() === 0 && <div className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t">
          <Button onClick={() => setShowComboPopup(true)} variant="outline" className="w-full border-booking-primary text-booking-primary min-h-[72px] py-4 text-lg font-semibold rounded-xl">
            <div className="flex justify-between items-center w-full">
              <div className="text-left">
                <div className="text-lg font-bold">07:30 PM</div>
                <div className="text-xs font-light">THU, 21 AUG</div>
              </div>
              <div className="flex items-center gap-2">
                <span>Continue Without Food</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </Button>
        </div>}

      {/* Combo Popup - Slide from bottom */}
      {showComboPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl max-h-[80vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3258/3258504.png"
                  alt="Special Offer"
                  className="w-8 h-8"
                />
                <div>
                  <h2 className="text-xl font-bold text-booking-dark">Wait! Special Offer</h2>
                  <p className="text-sm text-gray-600">Don't miss out on our amazing combo deal</p>
                  <p className="text-xs text-booking-primary font-medium mt-1">🎫 1 Combo per Ticket • Limited offer</p>
                </div>
              </div>
              <button 
                onClick={() => setShowComboPopup(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4">
              <div className="bg-booking-light rounded-xl p-4 mb-4 border-2 border-dashed border-booking-primary">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex -space-x-2">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border-2 border-white">
                      <img src={popcornImg} alt="Popcorn" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border-2 border-white">
                      <img src={softDrinkImg} alt="Soft Drink" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-booking-dark mb-1">Movie Combo</h4>
                    <p className="text-sm text-gray-600 mb-2">Popcorn + Soft Drink (Large)</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 line-through">₹330</span>
                      <span className="text-xl font-bold text-booking-primary">₹250</span>
                      <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded">SAVE ₹80</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3">
              <Button
                onClick={() => {
                  setShowComboPopup(false);
                  onContinue([], 0);
                }}
                variant="outline"
                className="border-booking-primary text-booking-primary hover:bg-booking-light min-h-[56px] py-3 rounded-xl text-lg font-semibold"
                style={{ width: '36%' }}
              >
                No Thanks
              </Button>
              <Button
                onClick={() => {
                  // Add combo items to cart
                  setCart(prev => ({
                    ...prev,
                    'combo-popcorn': (prev['combo-popcorn'] || 0) + 1,
                    'combo-drink': (prev['combo-drink'] || 0) + 1
                  }));
                  setShowComboPopup(false);
                  setShowConfetti(true);
                  setTimeout(() => setShowConfetti(false), 3000);
                }}
                className="bg-booking-primary hover:bg-booking-primary/90 text-white min-h-[56px] py-3 rounded-xl text-lg font-semibold"
                style={{ width: '64%' }}
              >
                Add Combo & Save ₹80
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-10px`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              >
                <div
                  className="w-2 h-2 rounded"
                  style={{
                    backgroundColor: ['#00c307', '#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1'][Math.floor(Math.random() * 5)]
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>;
}