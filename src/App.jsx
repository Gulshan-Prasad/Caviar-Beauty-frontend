import { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { trackPageView } from '@/utils/analytics';
import SplashScreen from '@/components/layout/SplashScreen';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import CursorEffect from '@/components/ui/CursorEffect';
import BackToTop from '@/components/ui/BackToTop';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import PageTransition from '@/components/layout/PageTransition';

const Home = lazy(() => import('@/pages/Home'));
const Products = lazy(() => import('@/pages/Products'));
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const Login = lazy(() => import('@/pages/Login'));
const AdminLogin = lazy(() => import('@/pages/AdminLogin'));
const AdminChangePassword = lazy(() => import('@/pages/AdminChangePassword'));
const Register = lazy(() => import('@/pages/Register'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const AdminProducts = lazy(() => import('@/pages/AdminProducts'));
const AdminProductForm = lazy(() => import('@/pages/AdminProductForm'));
const AdminOrders = lazy(() => import('@/pages/AdminOrders'));
const AdminUsers = lazy(() => import('@/pages/AdminUsers'));
const AdminCoupons = lazy(() => import('@/pages/AdminCoupons'));
const AdminCatalog = lazy(() => import('@/pages/AdminCatalog'));
const AdminReviews = lazy(() => import('@/pages/AdminReviews'));
const OrderDetail = lazy(() => import('@/pages/OrderDetail'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const Wishlist = lazy(() => import('@/pages/Wishlist'));
const NewArrivals = lazy(() => import('@/pages/NewArrivals'));
const Collections = lazy(() => import('@/pages/Collections'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const VerifyEmail = lazy(() => import('@/pages/VerifyEmail'));
const InfoPage = lazy(() => import('@/pages/InfoPage'));

const PageLoader = () => (
  <PageTransition>
    <div className="pt-32 pb-20 px-4 min-h-screen flex items-center justify-center">
      <span className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  </PageTransition>
);

export default function App() {
  const { pathname } = useLocation();
  const { checkAuth, isLoading } = useAuthStore();
  const { isDark } = useThemeStore();
  const { fetchCart } = useCartStore();
  const { fetchWishlist } = useWishlistStore();
  const [showSplash, setShowSplash] = useState(pathname === '/');

  useEffect(() => { checkAuth(); }, []);
  useEffect(() => { if (isDark) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); }, [isDark]);
  useEffect(() => { if (!isLoading) { fetchCart(); fetchWishlist(); } }, [isLoading]);
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  useEffect(() => { trackPageView(pathname); }, [pathname]);

  if (showSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;

  return (
    <>
      <CursorEffect />
      <Navbar />
      <main className="min-h-screen">
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            <Suspense fallback={<PageLoader />}>
              <Routes location={pathname} key={pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:slug" element={<ProductDetail />} />
                <Route path="/new-arrivals" element={<NewArrivals />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<InfoPage page="faq" />} />
                <Route path="/size-guide" element={<InfoPage page="sizeGuide" />} />
                <Route path="/care-instructions" element={<InfoPage page="careInstructions" />} />
                <Route path="/track-order" element={<InfoPage page="trackOrder" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/change-password" element={<AdminChangePassword />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/orders/:id" element={<OrderDetail />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/products/new" element={<AdminProductForm />} />
                <Route path="/admin/products/:id/edit" element={<AdminProductForm />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/coupons" element={<AdminCoupons />} />
                <Route path="/admin/catalog" element={<AdminCatalog />} />
                <Route path="/admin/reviews" element={<AdminReviews />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </ErrorBoundary>
      </main>
      <Footer />
      <CartDrawer />
      <BackToTop />
    </>
  );
}
