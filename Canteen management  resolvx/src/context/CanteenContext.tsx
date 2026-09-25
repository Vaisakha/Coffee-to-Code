import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Canteen, 
  Category, 
  Product, 
  Ingredient, 
  Order, 
  CartItem, 
  UserRole, 
  OrderStatus, 
  Complaint, 
  Feedback,
  Coupon,
  WalletTransaction
} from '../types';
import { 
  initialCanteen, 
  initialCategories, 
  initialProducts, 
  initialIngredients, 
  initialOrders, 
  initialComplaints, 
  initialCoupons 
} from '../data/mockData';
import { supabase } from '../lib/supabase';
import confetti from 'canvas-confetti';

interface Toast {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface CanteenContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeView: 'landing' | 'app';
  setActiveView: (view: 'landing' | 'app') => void;
  
  canteen: Canteen;
  categories: Category[];
  products: Product[];
  ingredients: Ingredient[];
  orders: Order[];
  complaints: Complaint[];
  coupons: Coupon[];
  
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  
  orderType: 'DINE_IN' | 'TAKEAWAY';
  setOrderType: (type: 'DINE_IN' | 'TAKEAWAY') => void;
  tableNumber: string;
  setTableNumber: (table: string) => void;
  packagingType: 'NORMAL' | 'ECO';
  setPackagingType: (type: 'NORMAL' | 'ECO') => void;
  selectedPickupSlot: string;
  setSelectedPickupSlot: (slot: string) => void;
  appliedCoupon: Coupon | null;
  applyCouponCode: (code: string) => boolean;
  removeCoupon: () => void;
  
  cartSubtotal: number;
  cartPackagingFee: number;
  cartDiscount: number;
  cartTotal: number;
  
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  
  placeOrder: (paymentMethod: string) => Promise<Order>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  verifyPickup: (tokenOrQr: string) => { success: boolean; message: string; order?: Order };
  
  // Admin & Inventory Actions
  updateProduct: (updated: Product) => void;
  addProduct: (product: Product) => void;
  restockIngredient: (ingredientId: string, amount: number) => void;
  resolveComplaint: (complaintId: string, notes: string) => void;
  submitFeedback: (feedback: Omit<Feedback, 'id' | 'created_at'>) => void;
  submitComplaint: (complaint: Omit<Complaint, 'id' | 'status' | 'created_at'>) => void;
  
  // POS Simulator
  thermalReceiptOrder: Order | null;
  setThermalReceiptOrder: (order: Order | null) => void;
  
  // Wallet Savings System
  walletBalance: number;
  walletTransactions: WalletTransaction[];
  addWalletMoney: (amount: number, method: string) => void;
  deductWalletMoney: (amount: number, description: string) => boolean;

  // Toasts
  toasts: Toast[];
  addToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const CanteenContext = createContext<CanteenContextType | undefined>(undefined);

export const CanteenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [activeView, setActiveView] = useState<'landing' | 'app'>('app');

  const [canteen, setCanteen] = useState<Canteen>(initialCanteen);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [coupons] = useState<Coupon[]>(initialCoupons);

  // Wallet State
  const [walletBalance, setWalletBalance] = useState<number>(1250);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([
    {
      id: 'tx-101',
      type: 'DEPOSIT',
      amount: 1500,
      method: 'GPay / UPI',
      description: 'GPay Top-up Deposit',
      date: new Date(Date.now() - 86400000 * 2).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 'tx-102',
      type: 'SPENT',
      amount: 250,
      method: 'BiteQ Wallet Pay',
      description: 'Order #ORD-8412 (Chicken Biryani)',
      date: new Date(Date.now() - 86400000 * 1).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const addWalletMoney = (amount: number, method: string) => {
    setWalletBalance((prev) => prev + amount);
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'DEPOSIT',
      amount,
      method,
      description: `Money deposited via ${method}`,
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    setWalletTransactions((prev) => [newTx, ...prev]);
    addToast('Wallet Deposited! 💰', `Added ₹${amount} to your BiteQ Savings Wallet via ${method}`, 'success');
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
  };

  const deductWalletMoney = (amount: number, description: string): boolean => {
    if (walletBalance < amount) {
      addToast('Insufficient Wallet Balance', `Available balance is ₹${walletBalance}. Please top up your wallet.`, 'error');
      return false;
    }
    setWalletBalance((prev) => prev - amount);
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'SPENT',
      amount,
      method: 'BiteQ Wallet Pay',
      description,
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    setWalletTransactions((prev) => [newTx, ...prev]);
    return true;
  };

  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<'DINE_IN' | 'TAKEAWAY'>('DINE_IN');
  const [tableNumber, setTableNumber] = useState<string>('4');
  const [packagingType, setPackagingType] = useState<'NORMAL' | 'ECO'>('NORMAL');
  const [selectedPickupSlot, setSelectedPickupSlot] = useState<string>('ASAP (in 12 min)');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const [activeOrder, setActiveOrder] = useState<Order | null>(initialOrders[0]);
  const [thermalReceiptOrder, setThermalReceiptOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Sync from Supabase on load
  useEffect(() => {
    async function loadFromSupabase() {
      try {
        const { data: catData } = await supabase.from('biteq_categories').select('*').order('sort_order');
        if (catData && catData.length > 0) setCategories(catData as Category[]);

        const { data: prodData } = await supabase.from('biteq_products').select('*');
        if (prodData && prodData.length > 0) setProducts(prodData as Product[]);

        const { data: ingData } = await supabase.from('biteq_ingredients').select('*');
        if (ingData && ingData.length > 0) setIngredients(ingData as Ingredient[]);

        const { data: ordData } = await supabase.from('biteq_orders').select('*, items:biteq_order_items(*)').order('created_at', { ascending: false });
        if (ordData && ordData.length > 0) {
          const formattedOrders = ordData.map((o: any) => ({
            ...o,
            items: o.items || [],
          }));
          setOrders(formattedOrders);
          // Set student's active order to the first active one
          const studentActive = formattedOrders.find((o: Order) => o.status !== 'PICKED_UP' && o.status !== 'CANCELLED');
          if (studentActive) setActiveOrder(studentActive);
        }
      } catch (err) {
        console.warn('Supabase fetch notice (using high-speed local reactive cache):', err);
      }
    }
    loadFromSupabase();

    // Supabase Realtime channel subscription
    const channel = supabase
      .channel('biteq_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'biteq_orders' }, () => {
        loadFromSupabase();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Update Canteen Mood dynamically based on queue load
  useEffect(() => {
    const activeCount = orders.filter((o) => o.status === 'PENDING' || o.status === 'ACCEPTED' || o.status === 'PREPARING').length;
    let load: 'CHILL' | 'BUSY' | 'CHAOTIC' = 'CHILL';
    if (activeCount >= 6) {
      load = 'CHAOTIC';
    } else if (activeCount >= 2) {
      load = 'BUSY';
    }
    setCanteen((prev) => ({
      ...prev,
      current_load: load,
      avg_prep_time_minutes: load === 'CHAOTIC' ? 18 : load === 'BUSY' ? 12 : 6,
    }));
  }, [orders]);

  // Cart operations
  const addToCart = (product: Product) => {
    if (product.availability === 'SOLD_OUT' || product.stock_quantity <= 0) {
      addToast('Sold Out', `${product.name} is currently out of stock.`, 'warning');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock_quantity) {
          addToast('Limit Reached', `Only ${product.stock_quantity} available right now.`, 'warning');
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    addToast('Added to Cart', `${product.name} added to your tray`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCouponCode = (code: string) => {
    const found = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.is_active);
    if (!found) {
      addToast('Invalid Coupon', 'Coupon code not found or expired', 'error');
      return false;
    }
    const currentSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    if (currentSubtotal < found.min_order_amount) {
      addToast('Min Order Required', `Minimum order of ₹${found.min_order_amount} required for this coupon`, 'warning');
      return false;
    }
    setAppliedCoupon(found);
    addToast('Coupon Applied! 🎉', `Applied ${found.code} successfully!`, 'success');
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartPackagingFee = orderType === 'TAKEAWAY' ? (packagingType === 'ECO' ? 5 : 0) : 0;
  const cartDiscount = appliedCoupon
    ? Math.min((cartSubtotal * appliedCoupon.discount_percent) / 100, appliedCoupon.max_discount)
    : 0;
  const cartTotal = Math.max(0, cartSubtotal + cartPackagingFee - cartDiscount);

  // Place Order Flow (Section 13, 14, 17, 18, 28, 29)
  const placeOrder = async (paymentMethod: string): Promise<Order> => {
    if (paymentMethod === 'WALLET') {
      const ok = deductWalletMoney(cartTotal, `Canteen Order Booking (${cart.length} items)`);
      if (!ok) {
        throw new Error('Insufficient Wallet Balance');
      }
    }
    // Generate authentic digital token code (e.g. B142)
    const existingTokens = orders.map((o) => {
      const match = o.token_code?.match(/B(\d+)/);
      return match ? parseInt(match[1], 10) : 136;
    });
    const maxTokenNum = existingTokens.length > 0 ? Math.max(...existingTokens) : 141;
    const nextTokenNum = maxTokenNum + 1;
    const tokenCode = `B${nextTokenNum}`;
    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const qrCodeToken = `BITEQ-${tokenCode}-VERIFY-SECURE-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Estimated ready time
    const readyMinutes = Math.max(canteen.avg_prep_time_minutes, 10);
    const estDate = new Date(Date.now() + readyMinutes * 60000);
    const estTimeString = estDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      canteen_id: canteen.id,
      user_id: 'student-sherin-01',
      user_name: 'Sherin (Student)',
      order_number: orderNumber,
      order_type: orderType,
      table_number: orderType === 'DINE_IN' ? tableNumber : undefined,
      packaging_type: packagingType,
      packaging_fee: cartPackagingFee,
      subtotal: cartSubtotal,
      discount: cartDiscount,
      total_amount: cartTotal,
      status: 'ACCEPTED',
      payment_status: 'PAID',
      pickup_time: selectedPickupSlot,
      token_code: tokenCode,
      qr_code_token: qrCodeToken,
      estimated_ready_time: estTimeString,
      created_at: new Date().toISOString(),
      items: cart.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        unit_price: item.product.price,
        quantity: item.quantity,
        total_price: item.product.price * item.quantity,
      })),
    };

    // Update local state instantly
    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);

    // Section 28 & 29: Automatic stock & ingredient deduction
    setProducts((prev) =>
      prev.map((prod) => {
        const cartMatch = cart.find((c) => c.product.id === prod.id);
        if (cartMatch) {
          const newStock = Math.max(0, prod.stock_quantity - cartMatch.quantity);
          return {
            ...prod,
            stock_quantity: newStock,
            availability: newStock <= 0 ? 'SOLD_OUT' : newStock <= 5 ? 'LIMITED' : 'AVAILABLE',
          };
        }
        return prod;
      })
    );

    // Deduct key ingredients
    setIngredients((prev) =>
      prev.map((ing) => {
        let deduct = 0;
        if (ing.name.includes('Rice')) deduct = 0.25;
        if (ing.name.includes('Chicken')) deduct = 0.2;
        if (ing.name.includes('Oil')) deduct = 0.05;
        const newQty = Math.max(0, ing.current_quantity - deduct);
        return {
          ...ing,
          current_quantity: Number(newQty.toFixed(2)),
          status: newQty <= ing.min_quantity ? (newQty === 0 ? 'OUT_OF_STOCK' : 'CRITICAL') : 'NORMAL',
        };
      })
    );

    clearCart();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF5E36', '#10B981', '#F59E0B', '#8B5CF6'],
      });
    } catch (e) {
      // Confetti fallback
    }

    addToast('Payment Confirmed! 🚀', `Token #${tokenCode} generated. Sent to kitchen queue!`, 'success');

    // Sync to Supabase in background
    try {
      await supabase.from('biteq_orders').insert({
        canteen_id: canteen.id,
        user_id: newOrder.user_id,
        user_name: newOrder.user_name,
        order_number: newOrder.order_number,
        order_type: newOrder.order_type,
        table_number: newOrder.table_number,
        packaging_type: newOrder.packaging_type,
        packaging_fee: newOrder.packaging_fee,
        subtotal: newOrder.subtotal,
        discount: newOrder.discount,
        total_amount: newOrder.total_amount,
        status: newOrder.status,
        payment_status: newOrder.payment_status,
        pickup_time: newOrder.pickup_time,
        token_code: newOrder.token_code,
        qr_code_token: newOrder.qr_code_token,
        estimated_ready_time: newOrder.estimated_ready_time,
      });

      await supabase.from('biteq_tokens').insert({
        token_code: newOrder.token_code,
        status: newOrder.status,
        queue_position: 1,
      });
    } catch (err) {
      console.warn('Supabase sync notice:', err);
    }

    return newOrder;
  };

  // Kitchen operations: Accept -> Prepare -> Ready -> Picked Up
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updated = {
            ...order,
            status: newStatus,
            actual_ready_time: newStatus === 'READY' ? new Date().toISOString() : order.actual_ready_time,
            picked_up_at: newStatus === 'PICKED_UP' ? new Date().toISOString() : order.picked_up_at,
          };
          if (activeOrder?.id === orderId) {
            setActiveOrder(updated);
          }
          return updated;
        }
        return order;
      })
    );

    const targetOrder = orders.find((o) => o.id === orderId);
    if (newStatus === 'READY') {
      addToast('Order Ready! 🔔', `Token #${targetOrder?.token_code} is ready for pickup at Counter 1!`, 'success');
    } else if (newStatus === 'PREPARING') {
      addToast('Kitchen Cooking 👨‍🍳', `Token #${targetOrder?.token_code} moved to preparation`, 'info');
    }

    // Sync to Supabase
    try {
      await supabase.from('biteq_orders').update({ status: newStatus }).eq('id', orderId);
    } catch (e) {
      // Local reactive fallback
    }
  };

  // Verify Pickup (QR scan or token enter by staff)
  const verifyPickup = (tokenOrQr: string) => {
    const cleaned = tokenOrQr.trim().toUpperCase();
    const order = orders.find(
      (o) =>
        o.token_code?.toUpperCase() === cleaned ||
        o.qr_code_token?.toUpperCase() === cleaned ||
        o.order_number?.toUpperCase() === cleaned
    );

    if (!order) {
      return { success: false, message: 'Invalid token or QR code. Order not found.' };
    }

    if (order.status === 'PICKED_UP') {
      return { success: false, message: `Token ${order.token_code} has already been picked up. Duplicate scan prevented!`, order };
    }

    if (order.status !== 'READY') {
      return { success: false, message: `Order ${order.token_code} is currently ${order.status}, not ready yet.`, order };
    }

    // Successfully verified!
    updateOrderStatus(order.id, 'PICKED_UP');
    return { success: true, message: `Token ${order.token_code} verified successfully! Food handed over.`, order };
  };

  // Admin menu and inventory management
  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    addToast('Menu Updated', `${updated.name} updated successfully`, 'success');
  };

  const addProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    addToast('Food Added', `${newProd.name} added to canteen menu`, 'success');
  };

  const restockIngredient = (ingredientId: string, amount: number) => {
    setIngredients((prev) =>
      prev.map((ing) => {
        if (ing.id === ingredientId) {
          const newQty = ing.current_quantity + amount;
          return {
            ...ing,
            current_quantity: newQty,
            status: newQty > ing.min_quantity ? 'NORMAL' : 'LOW',
            updated_at: new Date().toISOString(),
          };
        }
        return ing;
      })
    );
    addToast('Restock Success', `Added ${amount} to inventory`, 'success');
  };

  const resolveComplaint = (complaintId: string, notes: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? { ...c, status: 'RESOLVED', admin_notes: notes }
          : c
      )
    );
    addToast('Complaint Resolved', 'Status marked as resolved and notes saved', 'success');
  };

  const submitFeedback = (fb: Omit<Feedback, 'id' | 'created_at'>) => {
    addToast('Thank You! ⭐', 'Your feedback helps improve canteen food & service.', 'success');
  };

  const submitComplaint = (comp: Omit<Complaint, 'id' | 'status' | 'created_at'>) => {
    const newComp: Complaint = {
      ...comp,
      id: `comp-${Date.now()}`,
      status: 'OPEN',
      created_at: new Date().toISOString(),
    };
    setComplaints((prev) => [newComp, ...prev]);
    addToast('Complaint Filed', 'Your issue has been logged. Admin will review promptly.', 'info');
  };

  return (
    <CanteenContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeView,
        setActiveView,
        canteen,
        categories,
        products,
        ingredients,
        orders,
        complaints,
        coupons,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        orderType,
        setOrderType,
        tableNumber,
        setTableNumber,
        packagingType,
        setPackagingType,
        selectedPickupSlot,
        setSelectedPickupSlot,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        cartSubtotal,
        cartPackagingFee,
        cartDiscount,
        cartTotal,
        activeOrder,
        setActiveOrder,
        placeOrder,
        updateOrderStatus,
        verifyPickup,
        updateProduct,
        addProduct,
        restockIngredient,
        resolveComplaint,
        submitFeedback,
        submitComplaint,
        thermalReceiptOrder,
        setThermalReceiptOrder,
        walletBalance,
        walletTransactions,
        addWalletMoney,
        deductWalletMoney,
        toasts,
        addToast,
      }}
    >
      {children}

      {/* Global Toast Render */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast">
            <span
              className="pulse-dot"
              style={{
                backgroundColor:
                  toast.type === 'success'
                    ? '#10B981'
                    : toast.type === 'warning'
                    ? '#F59E0B'
                    : toast.type === 'error'
                    ? '#F43F5E'
                    : '#06B6D4',
              }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{toast.title}</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>{toast.message}</div>
            </div>
          </div>
        ))}
      </div>
    </CanteenContext.Provider>
  );
};

export const useCanteen = () => {
  const context = useContext(CanteenContext);
  if (!context) throw new Error('useCanteen must be used within CanteenProvider');
  return context;
};
