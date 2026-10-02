import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/utils/helpers';
import { trackEcommerceEvent } from '@/utils/analytics';
import api from '@/utils/api';
import PageTransition from '@/components/layout/PageTransition';
import toast from 'react-hot-toast';

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email(),
  phone: z.string().min(10, 'Enter a valid 10-digit phone number'),
  street: z.string().min(1, 'Required'),
  city: z.string().min(1, 'Required'),
  state: z.string().min(1, 'Required'),
  zipCode: z.string().min(6, 'Enter a valid 6-digit PIN code'),
  country: z.string().min(1),
});

const steps = ['Shipping', 'Payment', 'Review'];
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(window.Razorpay);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const { items, total, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { country: 'India' },
  });

  const shippingCost = total > 5000 ? 0 : 99;
  const tax = total * 0.18;
  const discount = coupon ? Math.min(coupon.discountType === 'percentage' ? total * (coupon.discountValue / 100) : coupon.discountValue, coupon.maxDiscount || Infinity) : 0;
  const grandTotal = total + shippingCost + tax - discount;

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (items.length === 0) return <Navigate to="/cart" replace />;

  if (savedAddresses.length === 0 && isAuthenticated) {
    api.get('/addresses').then(r => setSavedAddresses(r.data.addresses || [])).catch(() => {});
  }

  const applyCoupon = async () => {
    if (!couponCode) return;
    setCouponError('');
    try {
      const { data } = await api.post('/coupons/validate', { code: couponCode, subtotal: total });
      setCoupon(data.coupon);
      toast.success(`Coupon applied: -${formatPrice(data.discount)}`);
    } catch (err) {
      setCoupon(null);
      setCouponError(err.response?.data?.error || 'Invalid coupon');
    }
  };

  const useSavedAddress = (address) => {
    setValue('firstName', address.firstName);
    setValue('lastName', address.lastName);
    setValue('phone', address.phone || '');
    setValue('street', address.street);
    setValue('city', address.city);
    setValue('state', address.state);
    setValue('zipCode', address.zipCode);
    setValue('country', address.country);
    toast.success('Address loaded');
  };

  const placeOrder = async (data) => {
    const { data: address } = await api.post('/addresses', {
      type: 'SHIPPING',
      firstName: data.firstName,
      lastName: data.lastName,
      street: data.street,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country || 'India',
      phone: data.phone,
    });

    const { data: order } = await api.post('/orders', {
      shippingAddressId: address.id,
      paymentMethod: 'Razorpay',
      couponCode: coupon?.code || undefined,
    });

    return order;
  };

  const payWithRazorpay = async (orderId) => {
    const { data: rzp } = await api.post('/payments/create-order', { orderId });

    const Razorpay = await loadRazorpayScript();
    const options = {
      key: rzp.keyId,
      amount: Math.round(rzp.amount * 100),
      currency: rzp.currency || 'INR',
      name: 'Caviar Beauty',
      description: `Order ${rzp.razorpayOrderId}`,
      order_id: rzp.razorpayOrderId,
      prefill: {
        name: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : `${getValues('firstName')} ${getValues('lastName')}`,
        email: user?.email || getValues('email'),
        contact: getValues('phone'),
      },
      theme: { color: '#28221c' },
      handler: async (response) => {
        try {
          await api.post('/payments/verify', {
            orderId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });
          await clearCart();
          trackEcommerceEvent('purchase', {
            items,
            value: grandTotal,
            transaction_id: orderId,
            shipping: shippingCost,
            tax,
            ...(coupon?.code ? { coupon: coupon.code } : {}),
          });
          toast.success('Payment successful! Order confirmed.');
          navigate('/orders/' + orderId);
        } catch (err) {
          toast.error(err.response?.data?.error || 'Payment verification failed');
        }
      },
      modal: {
        ondismiss: async () => {
          try { await api.post(`/orders/${orderId}/cancel`); } catch {}
          setPlacing(false);
          toast.error('Payment cancelled. Your order was not placed.');
        },
      },
    };

    const rzpInstance = new Razorpay(options);
    rzpInstance.open();
  };

  const onSubmit = async (data) => {
    if (step < 2) {
      if (step === 0) {
        trackEcommerceEvent('add_shipping_info', {
          items,
          value: grandTotal,
          shipping_tier: total > 5000 ? 'free' : 'standard',
        });
      } else if (step === 1) {
        trackEcommerceEvent('add_payment_info', { items, value: grandTotal });
      }
      setStep(step + 1);
      return;
    }
    trackEcommerceEvent('begin_checkout', {
      items,
      value: grandTotal,
      ...(coupon?.code ? { coupon: coupon.code } : {}),
    });
    setPlacing(true);
    try {
      const order = await placeOrder(data);
      await payWithRazorpay(order.id);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to place order. Please try again.');
      setPlacing(false);
    }
  };

  return (
    <PageTransition>
      <div className="pt-24 md:pt-32 pb-20 px-4 md:px-8 lg:px-12 min-h-screen">
        <div className="max-w-[1440px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="section-title">Checkout</h1>
            <div className="w-16 h-[1px] bg-gold-500 mt-6 mb-12" />
          </motion.div>

          {/* Progress */}
          <div className="flex items-center mb-12 max-w-2xl">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  i <= step ? 'bg-caviar-950 dark:bg-white text-white dark:text-caviar-950' : 'bg-caviar-200 dark:bg-caviar-700 text-caviar-500'
                }`}>{i + 1}</div>
                <span className={`ml-2 text-xs tracking-widest uppercase ${i <= step ? 'text-caviar-950 dark:text-white font-medium' : 'text-caviar-400'}`}>{s}</span>
                {i < steps.length - 1 && <div className={`flex-1 h-[1px] mx-4 ${i < step ? 'bg-caviar-950 dark:bg-white' : 'bg-caviar-200 dark:bg-caviar-700'}`} />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-8">
              {step === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <h3 className="text-sm tracking-widest uppercase font-medium">Shipping Address</h3>
                  {savedAddresses.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {savedAddresses.map((address) => (
                        <button
                          key={address.id}
                          type="button"
                          onClick={() => useSavedAddress(address)}
                          className="p-4 border border-caviar-300 dark:border-caviar-600 text-left hover:border-gold-500 transition-colors"
                        >
                          <p className="text-xs font-medium">{address.firstName} {address.lastName}</p>
                          <p className="text-[10px] text-caviar-500 mt-1 leading-relaxed">{address.street}, {address.city}, {address.state} {address.zipCode}</p>
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs tracking-wider uppercase mb-2">First Name</label><input {...register('firstName')} className="input-field" /><p className="text-red-500 text-xs mt-1">{errors.firstName?.message}</p></div>
                    <div><label className="block text-xs tracking-wider uppercase mb-2">Last Name</label><input {...register('lastName')} className="input-field" /><p className="text-red-500 text-xs mt-1">{errors.lastName?.message}</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs tracking-wider uppercase mb-2">Email</label><input type="email" {...register('email')} className="input-field" /><p className="text-red-500 text-xs mt-1">{errors.email?.message}</p></div>
                    <div><label className="block text-xs tracking-wider uppercase mb-2">Phone</label><input {...register('phone')} className="input-field" placeholder="10-digit mobile" /><p className="text-red-500 text-xs mt-1">{errors.phone?.message}</p></div>
                  </div>
                  <div><label className="block text-xs tracking-wider uppercase mb-2">Street Address</label><input {...register('street')} className="input-field" /><p className="text-red-500 text-xs mt-1">{errors.street?.message}</p></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div><label className="block text-xs tracking-wider uppercase mb-2">City</label><input {...register('city')} className="input-field" /></div>
                    <div><label className="block text-xs tracking-wider uppercase mb-2">State</label><input {...register('state')} className="input-field" /></div>
                    <div><label className="block text-xs tracking-wider uppercase mb-2">PIN Code</label><input {...register('zipCode')} className="input-field" placeholder="6-digit" /></div>
                  </div>
                  <div><label className="block text-xs tracking-wider uppercase mb-2">Country</label><input {...register('country')} className="input-field" /></div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <h3 className="text-sm tracking-widest uppercase font-medium">Payment Method</h3>
                  <div className="p-6 border border-caviar-200 dark:border-caviar-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Razorpay Secure Checkout</p>
                        <p className="text-xs text-caviar-500 mt-1">Pay via UPI, Credit/Debit Card, Net Banking, or Wallets</p>
                      </div>
                      <span className="text-xs bg-caviar-100 dark:bg-caviar-800 text-caviar-700 dark:text-caviar-200 px-2 py-1">Secure</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <h3 className="text-sm tracking-widest uppercase font-medium">Review Order</h3>
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-3 border-b border-caviar-100 dark:border-caviar-800">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium">{item.product.name}</span>
                        <span className="text-xs text-caviar-400">x{item.quantity}</span>
                      </div>
                      <span className="text-sm">{formatPrice((item.product.discountPrice || item.product.basePrice) * item.quantity)}</span>
                    </div>
                  ))}
                </motion.div>
              )}

              <div className="flex items-center justify-between pt-4">
                {step > 0 ? (
                  <button type="button" onClick={() => setStep(step - 1)} className="text-sm text-caviar-500 hover:text-caviar-950 dark:hover:text-white transition-colors">← Back</button>
                ) : <div />}
                <button type="submit" className="btn-primary text-xs" disabled={placing}>
                  {placing ? 'Processing...' : step === 2 ? 'Pay Securely' : 'Continue'}
                </button>
              </div>
            </form>

            <div className="lg:col-span-1">
              <div className="p-8 border border-caviar-200 dark:border-caviar-800 sticky top-28">
                <h3 className="text-sm tracking-widest uppercase font-medium mb-6">Order Summary</h3>
                <div className="space-y-4 text-sm">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="text-caviar-500 truncate max-w-[180px]">{item.product.name} x{item.quantity}</span>
                      <span>{formatPrice((item.product.discountPrice || item.product.basePrice) * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="border-t border-caviar-200 dark:border-caviar-800 pt-4 space-y-2">
                    <div className="flex justify-between"><span className="text-caviar-500">Subtotal</span><span>{formatPrice(total)}</span></div>
                    <div className="flex justify-between"><span className="text-caviar-500">Shipping</span><span>{total > 5000 ? 'Free' : '₹99'}</span></div>
                    <div className="flex justify-between"><span className="text-caviar-500">GST (18%)</span><span>{formatPrice(tax)}</span></div>
                    {discount > 0 && (
                      <div className="flex justify-between"><span className="text-green-600">Coupon ({coupon.code})</span><span className="text-green-600">-{formatPrice(discount)}</span></div>
                    )}
                  </div>
                  <div className="border-t border-caviar-200 dark:border-caviar-800 pt-4 flex justify-between font-medium text-base">
                    <span>Total</span>
                    <span>{formatPrice(grandTotal)}</span>
                  </div>

                  <div className="border-t border-caviar-200 dark:border-caviar-800 pt-4">
                    <label className="block text-xs tracking-widest uppercase font-medium mb-2">Promo Code</label>
                    <div className="flex space-x-2">
                      <input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="input-field flex-1"
                      />
                      <button type="button" onClick={applyCoupon} className="btn-secondary text-xs">Apply</button>
                    </div>
                    {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
                    {coupon && <p className="text-green-600 text-xs mt-2">Coupon applied</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
