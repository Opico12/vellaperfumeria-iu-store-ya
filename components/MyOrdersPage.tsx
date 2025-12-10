
import React, { useEffect, useState } from 'react';
import type { Currency } from './currency';
import { formatCurrency } from './currency';
import type { CartItem, View } from './types';

interface Order {
    id: string;
    date: string;
    total: number;
    status: string;
    items: CartItem[];
    paymentMethod: string;
}

interface MyOrdersPageProps {
    currency: Currency;
    onNavigate: (view: View, payload?: any) => void;
}

const ShoppingBagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

const MyOrdersPage: React.FC<MyOrdersPageProps> = ({ currency, onNavigate }) => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const loadOrders = () => {
            try {
                const storedOrders = localStorage.getItem('vellaperfumeria_past_orders');
                if (storedOrders) {
                    // Sort by date descending (newest first)
                    // Note: Assuming date strings are comparable or simple enough for this demo
                    const parsedOrders = JSON.parse(storedOrders).reverse();
                    setOrders(parsedOrders);
                }
            } catch (error) {
                console.error("Failed to load orders", error);
            }
        };

        loadOrders();
    }, []);

    if (orders.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center animate-fade-in">
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 max-w-xl mx-auto flex flex-col items-center">
                    <ShoppingBagIcon />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No tienes pedidos recientes</h2>
                    <p className="text-gray-500 mb-8">Parece que aún no has realizado ninguna compra.</p>
                    <button 
                        onClick={() => onNavigate('products')}
                        className="bg-black text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
                    >
                        Empezar a Comprar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <h1 className="text-3xl font-extrabold text-black mb-8">Mis Pedidos</h1>
            
            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                        
                        {/* Order Header */}
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex flex-col sm:flex-row sm:gap-8">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Pedido realizado</p>
                                    <p className="text-sm font-medium text-gray-900">{order.date}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Total</p>
                                    <p className="text-sm font-bold text-gray-900">{formatCurrency(order.total, currency)}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Pedido N.º</p>
                                    <p className="text-sm font-mono text-gray-700">{order.id}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    order.status === 'Completado' || order.status === 'Verificado' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-blue-100 text-blue-800'
                                }`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>

                        {/* Order Body */}
                        <div className="p-6">
                            <div className="flex flex-col sm:flex-row gap-6">
                                {/* Product Thumbnails Preview */}
                                <div className="flex-grow">
                                    <div className="flex flex-wrap gap-4">
                                        {order.items.map((item, idx) => (
                                            <div key={`${order.id}-${idx}`} className="flex items-center gap-4 min-w-[200px]">
                                                <div className="relative w-16 h-16 border border-gray-100 rounded-lg overflow-hidden flex-shrink-0 bg-white">
                                                    <img 
                                                        src={item.product.imageUrl} 
                                                        alt={item.product.name} 
                                                        className="w-full h-full object-contain p-1"
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-900 line-clamp-2">{item.product.name}</span>
                                                    <span className="text-xs text-gray-500">Cant: {item.quantity}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex-shrink-0 flex flex-col gap-3 justify-center sm:border-l border-gray-100 sm:pl-6">
                                     <button 
                                        onClick={() => onNavigate('products', 'all')}
                                        className="text-sm font-semibold text-[var(--color-primary-solid)] hover:text-fuchsia-800 transition-colors border border-[var(--color-primary-solid)] rounded-lg px-4 py-2 text-center"
                                     >
                                         Volver a comprar
                                     </button>
                                     <a 
                                        href={`https://api.whatsapp.com/send?phone=34661202616&text=Hola,%20tengo%20una%20duda%20sobre%20mi%20pedido%20${order.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-gray-500 hover:text-gray-900 text-center"
                                     >
                                         Ayuda con el pedido
                                     </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default MyOrdersPage;
