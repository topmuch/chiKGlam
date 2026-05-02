'use client';

import { useState, useEffect, useCallback } from 'react';
import { useStore } from '@/store/use-store';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Package,
  User,
  MapPin,
  Heart,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Plus,
  Pencil,
  Trash2,
  Star,
  ShoppingBag,
  Eye,
  Shield,
  Truck,
  CreditCard,
} from 'lucide-react';

// ===== Types =====

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  brand: string;
  price: number;
  quantity: number;
  total: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string | null;
  shippingAddress: string;
  billingAddress: string | null;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: string;
  paymentMethod: string | null;
  shippingCarrier: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  createdAt: string;
  items: OrderItem[];
}

interface Address {
  id: string;
  userId: string;
  label: string | null;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string | null;
  city: string;
  state: string | null;
  postalCode: string;
  country: string;
  phone: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AddressFormData {
  label: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  processing: {
    label: 'Processing',
    className: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  validated: {
    label: 'Validated',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  shipped: {
    label: 'Shipped',
    className: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  delivered: {
    label: 'Delivered',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
};

const EMPTY_ADDRESS_FORM: AddressFormData = {
  label: '',
  firstName: '',
  lastName: '',
  address1: '',
  address2: '',
  city: '',
  postalCode: '',
  country: 'France',
  phone: '',
  isDefault: false,
};

// ===== Sidebar Navigation =====

const sidebarTabs = [
  { value: 'orders', label: 'Orders', icon: Package },
  { value: 'profile', label: 'Profile', icon: User },
  { value: 'addresses', label: 'Addresses', icon: MapPin },
  { value: 'wishlist', label: 'Wishlist', icon: Heart },
];

function UserSidebar({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  const { currentUser } = useStore();
  const initials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : currentUser?.email?.[0]?.toUpperCase() || '?';

  return (
    <div className="space-y-6">
      {/* User Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-rose-100 to-pink-50 px-6 py-8 text-center">
          <Avatar className="mx-auto mb-3 h-20 w-20 border-4 border-white shadow-md">
            <AvatarImage src={currentUser?.avatar || ''} alt={currentUser?.name || ''} />
            <AvatarFallback className="bg-white text-rose-600 text-2xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-lg text-gray-900">
            {currentUser?.name || 'Guest'}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">{currentUser?.email}</p>
          <Badge variant="secondary" className="mt-2 text-xs capitalize">
            {currentUser?.role || 'Customer'}
          </Badge>
        </div>
        <CardContent className="p-0">
          <div className="px-6 py-3 flex items-center justify-between text-sm border-b">
            <span className="text-muted-foreground">Member since</span>
            <span className="font-medium">
              {currentUser?.createdAt
                ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })
                : 'N/A'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card className="p-2">
        <nav className="space-y-1">
          {sidebarTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => onTabChange(tab.value)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-rose-50 text-rose-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-rose-600' : 'text-gray-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </Card>
    </div>
  );
}

// ===== Orders Tab =====

function OrdersTab() {
  const { currentUser } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ userId: currentUser.id });
      if (statusFilter !== 'all') params.set('status', statusFilter);
      const res = await fetch(`/api/orders?${params.toString()}`);
      const data = await res.json();
      if (data.success !== false) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery.trim()) return true;
    return order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const parseAddress = (addressStr: string) => {
    try {
      return typeof addressStr === 'string' ? JSON.parse(addressStr) : addressStr;
    } catch {
      return { address: addressStr };
    }
  };

  const getTrackingUrl = (carrier: string | null, trackingNumber: string | null) => {
    if (!carrier || !trackingNumber) return null;
    const c = carrier.toLowerCase();
    if (c === 'colissimo') {
      return `https://www.colissimo.fr/portal/page/redirect?trackingNumber=${trackingNumber}`;
    }
    if (c === 'chronopost') {
      return `https://www.chronopost.fr/tracking-no-cms/suivi-page?lang=en&listNumber=${trackingNumber}`;
    }
    return null;
  };

  const renderStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status] || {
      label: status,
      className: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return (
      <Badge variant="outline" className={`${config.className} text-xs font-semibold`}>
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="validated">Validated</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredOrders.length === 0 ? (
        <Card className="py-16">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-1">No orders yet</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              {searchQuery || statusFilter !== 'all'
                ? 'No orders match your search criteria. Try adjusting your filters.'
                : 'When you place your first order, it will appear here.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const shippingAddr = parseAddress(order.shippingAddress);
            const trackingLink = getTrackingUrl(order.shippingCarrier, order.trackingNumber);

            return (
              <Card key={order.id} className={`transition-all ${isExpanded ? 'ring-1 ring-rose-200' : ''}`}>
                {/* Order Header */}
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 cursor-pointer"
                  onClick={() => toggleExpand(order.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50">
                      <Package className="h-5 w-5 text-rose-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    {renderStatusBadge(order.status)}
                    <div className="text-right">
                      <p className="font-semibold text-sm">{formatPrice(order.total)}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0">
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 ml-1" />
                      ) : (
                        <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t px-6 pb-6 pt-4 space-y-6">
                    {/* Order Items */}
                    <div>
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4" />
                        Order Items
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 p-3 rounded-lg bg-gray-50"
                          >
                            <div className="h-14 w-14 rounded-lg overflow-hidden bg-white border shrink-0">
                              <img
                                src={item.productImage || '/images/products/skii-cleansing-oil.png'}
                                alt={item.productName}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{item.productName}</p>
                              <p className="text-xs text-muted-foreground">{item.brand}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-medium text-sm">{formatPrice(item.total)}</p>
                              <p className="text-xs text-muted-foreground">
                                Qty: {item.quantity} × {formatPrice(item.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatPrice(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>
                          {order.shippingCost === 0
                            ? 'Free'
                            : formatPrice(order.shippingCost)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax (VAT)</span>
                        <span>{formatPrice(order.tax)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>{formatPrice(order.total)}</span>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Shipping Address
                      </h4>
                      <div className="text-sm text-muted-foreground bg-gray-50 rounded-lg p-3">
                        {shippingAddr?.name && <p className="font-medium text-gray-900">{shippingAddr.name}</p>}
                        {shippingAddr?.address && <p>{shippingAddr.address}</p>}
                        {(shippingAddr?.city || shippingAddr?.postalCode) && (
                          <p>{shippingAddr.city}{shippingAddr.postalCode ? ` ${shippingAddr.postalCode}` : ''}</p>
                        )}
                        {shippingAddr?.country && <p>{shippingAddr.country}</p>}
                        {!shippingAddr?.name && typeof order.shippingAddress === 'string' && (
                          <p>{order.shippingAddress}</p>
                        )}
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Payment Method
                      </h4>
                      <div className="text-sm text-muted-foreground bg-gray-50 rounded-lg p-3 capitalize">
                        {order.paymentMethod || 'Card'}
                      </div>
                    </div>

                    {/* Tracking Info */}
                    {(order.trackingNumber || order.shippingCarrier) && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Tracking Information
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                          {order.shippingCarrier && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Carrier</span>
                              <span className="font-medium capitalize">{order.shippingCarrier}</span>
                            </div>
                          )}
                          {order.trackingNumber && (
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Tracking Number</span>
                              <span className="font-mono text-xs">{order.trackingNumber}</span>
                            </div>
                          )}
                          {trackingLink && (
                            <a
                              href={trackingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 text-sm font-medium mt-1"
                            >
                              Track your package
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ===== Profile Tab =====

function ProfileTab() {
  const { currentUser, setUser } = useStore();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile fields
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
    }
  }, [currentUser]);

  const handleSaveProfile = async () => {
    if (!currentUser?.id) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      });
      const data = await res.json();
      if (data.success) {
        setUser({ ...currentUser, name, email, phone });
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentUser?.id) return;
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'All password fields are required.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    setSavingPassword(true);
    setMessage(null);
    try {
      // Verify current password first
      const loginRes = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email: currentUser.email, password: currentPassword }),
      });
      const loginData = await loginRes.json();
      if (!loginData.success) {
        setMessage({ type: 'error', text: 'Current password is incorrect.' });
        setSavingPassword(false);
        return;
      }
      // Update password
      const res = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setMessage({ type: 'success', text: 'Password changed successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to change password' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Message */}
      {message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm font-medium ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>Update your personal details and contact information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Full Name</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-email">Email Address</Label>
            <Input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-phone">Phone Number</Label>
            <Input
              id="profile-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+33 6 00 00 00 00"
            />
          </div>
          <Button onClick={handleSaveProfile} disabled={saving} className="mt-2">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>Update your password to keep your account secure.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
          <Button
            onClick={handleChangePassword}
            disabled={savingPassword}
            variant="outline"
            className="mt-2"
          >
            {savingPassword ? 'Updating...' : 'Update Password'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ===== Address Form Dialog =====

function AddressFormDialog({
  open,
  onOpenChange,
  address,
  userId,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address: Address | null;
  userId: string;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<AddressFormData>(EMPTY_ADDRESS_FORM);
  const [saving, setSaving] = useState(false);
  const isEditing = !!address;

  useEffect(() => {
    if (address) {
      setForm({
        label: address.label || '',
        firstName: address.firstName,
        lastName: address.lastName,
        address1: address.address1,
        address2: address.address2 || '',
        city: address.city,
        postalCode: address.postalCode,
        country: address.country,
        phone: address.phone || '',
        isDefault: address.isDefault,
      });
    } else {
      setForm({ ...EMPTY_ADDRESS_FORM });
    }
  }, [address, open]);

  const updateField = (field: keyof AddressFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.firstName || !form.lastName || !form.address1 || !form.city || !form.postalCode) {
      return;
    }
    setSaving(true);
    try {
      if (isEditing && address) {
        const res = await fetch(`/api/addresses/${address.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.success) {
          onSaved();
          onOpenChange(false);
        }
      } else {
        const res = await fetch('/api/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, userId }),
        });
        const data = await res.json();
        if (data.success) {
          onSaved();
          onOpenChange(false);
        }
      }
    } catch (err) {
      console.error('Failed to save address:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Address' : 'Add New Address'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the details for this address.'
              : 'Fill in the details for your new address.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="addr-label">Label (e.g., Home, Work)</Label>
            <Input
              id="addr-label"
              value={form.label}
              onChange={(e) => updateField('label', e.target.value)}
              placeholder="Home"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="addr-firstname">First Name *</Label>
              <Input
                id="addr-firstname"
                value={form.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                placeholder="First name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addr-lastname">Last Name *</Label>
              <Input
                id="addr-lastname"
                value={form.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                placeholder="Last name"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="addr-address1">Address Line 1 *</Label>
            <Input
              id="addr-address1"
              value={form.address1}
              onChange={(e) => updateField('address1', e.target.value)}
              placeholder="Street address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addr-address2">Address Line 2</Label>
            <Input
              id="addr-address2"
              value={form.address2}
              onChange={(e) => updateField('address2', e.target.value)}
              placeholder="Apartment, suite, etc. (optional)"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="addr-city">City *</Label>
              <Input
                id="addr-city"
                value={form.city}
                onChange={(e) => updateField('city', e.target.value)}
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addr-postal">Postal Code *</Label>
              <Input
                id="addr-postal"
                value={form.postalCode}
                onChange={(e) => updateField('postalCode', e.target.value)}
                placeholder="75001"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="addr-country">Country</Label>
            <Input
              id="addr-country"
              value={form.country}
              onChange={(e) => updateField('country', e.target.value)}
              placeholder="France"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addr-phone">Phone</Label>
            <Input
              id="addr-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="+33 6 00 00 00 00"
            />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="addr-default"
              checked={form.isDefault}
              onChange={(e) => updateField('isDefault', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
            />
            <Label htmlFor="addr-default" className="text-sm font-normal cursor-pointer">
              Set as default address
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !form.firstName || !form.lastName || !form.address1 || !form.city || !form.postalCode}
          >
            {saving ? 'Saving...' : isEditing ? 'Update Address' : 'Add Address'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ===== Delete Confirmation Dialog =====

function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ===== Addresses Tab =====

function AddressesTab() {
  const { currentUser } = useStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);

  const fetchAddresses = useCallback(async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/addresses?userId=${currentUser.id}`);
      const data = await res.json();
      if (data.success) {
        setAddresses(data.addresses || []);
      }
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleAdd = () => {
    setEditingAddress(null);
    setDialogOpen(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setDialogOpen(true);
  };

  const handleDelete = (address: Address) => {
    setAddressToDelete(address);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!addressToDelete) return;
    try {
      await fetch(`/api/addresses/${addressToDelete.id}`, { method: 'DELETE' });
      fetchAddresses();
    } catch (err) {
      console.error('Failed to delete address:', err);
    }
  };

  const handleSetDefault = async (address: Address) => {
    if (address.isDefault) return;
    try {
      await fetch(`/api/addresses/${address.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDefault: true }),
      });
      fetchAddresses();
    } catch (err) {
      console.error('Failed to set default address:', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">Saved Addresses</h3>
          <p className="text-sm text-muted-foreground">
            Manage your shipping and billing addresses.
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card className="py-16">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-1">No saved addresses</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              Add your first address to speed up checkout.
            </p>
            <Button onClick={handleAdd} className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <Card
              key={address.id}
              className={`relative transition-all ${address.isDefault ? 'ring-1 ring-rose-200' : ''}`}
            >
              {address.isDefault && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-rose-100 text-rose-700 border-rose-200 text-xs">
                    Default
                  </Badge>
                </div>
              )}
              <CardContent className="pt-6 space-y-3">
                {address.label && (
                  <div className="flex items-center gap-2">
                    <Star className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
                    <span className="font-semibold text-sm">{address.label}</span>
                  </div>
                )}
                <div className="text-sm space-y-1">
                  <p className="font-medium">
                    {address.firstName} {address.lastName}
                  </p>
                  <p className="text-muted-foreground">{address.address1}</p>
                  {address.address2 && (
                    <p className="text-muted-foreground">{address.address2}</p>
                  )}
                  <p className="text-muted-foreground">
                    {address.city} {address.postalCode}
                  </p>
                  <p className="text-muted-foreground">{address.country}</p>
                  {address.phone && (
                    <p className="text-muted-foreground">{address.phone}</p>
                  )}
                </div>
                <Separator />
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(address)}
                    className="h-8 text-xs gap-1"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  {!address.isDefault && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(address)}
                        className="h-8 text-xs gap-1"
                      >
                        <Star className="h-3.5 w-3.5" />
                        Set Default
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(address)}
                        className="h-8 text-xs gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddressFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        address={editingAddress}
        userId={currentUser?.id || ''}
        onSaved={fetchAddresses}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Address"
        description="Are you sure you want to delete this address? This action cannot be undone."
      />
    </div>
  );
}

// ===== Wishlist Tab =====

function WishlistTab() {
  return (
    <Card className="py-16">
      <CardContent className="flex flex-col items-center justify-center text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Heart className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg mb-1">Your wishlist is empty</h3>
        <p className="text-muted-foreground text-sm max-w-sm">
          Browse our collection and click the heart icon on products you love to save them here.
        </p>
      </CardContent>
    </Card>
  );
}

// ===== Main CustomerDashboard =====

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const { currentUser } = useStore();

  // If no user, show login prompt
  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto py-16">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Welcome to Your Account</h3>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
              Please sign in to access your orders, manage your profile, and more.
            </p>
            <Button className="gap-2" onClick={() => window.location.href = '/'}>
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Account</h1>
        <p className="text-muted-foreground mt-1">
          Manage your orders, profile, and preferences.
        </p>
      </div>

      {/* Desktop Layout: Sidebar + Content */}
      <div className="hidden lg:grid lg:grid-cols-[280px_1fr] gap-8">
        <aside className="space-y-6">
          <UserSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </aside>
        <main className="min-w-0">
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'addresses' && <AddressesTab />}
          {activeTab === 'wishlist' && <WishlistTab />}
        </main>
      </div>

      {/* Mobile/Tablet Layout: Horizontal Tabs + Content */}
      <div className="lg:hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="overflow-x-auto -mx-4 px-4 pb-2">
            <TabsList className="w-full sm:w-auto">
              {sidebarTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5 flex-1 sm:flex-initial">
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
          <TabsContent value="orders">
            <OrdersTab />
          </TabsContent>
          <TabsContent value="profile">
            <ProfileTab />
          </TabsContent>
          <TabsContent value="addresses">
            <AddressesTab />
          </TabsContent>
          <TabsContent value="wishlist">
            <WishlistTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
