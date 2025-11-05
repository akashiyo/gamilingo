"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

const BottomNav = () => {
    const pathname = usePathname();
    const router = useRouter();

    const navItems = [
        {
            id: 'home',
            label: 'Accueil',
            icon: '/home.svg',
            iconActive: '/home-select.svg',
            path: '/'
        },
        {
            id: 'cards',
            label: 'Cards',
            icon: '/cards.svg',
            iconActive: '/cards-select.svg',
            path: '/cards'
        },
        {
            id: 'level',
            label: 'Apprentissages',
            icon: '/level.svg',
            iconActive: '/level-select.svg',
            path: '/level'
        },
        {
            id: 'profil',
            label: 'Profil',
            icon: '/profil.svg',
            iconActive: '/profil-select.svg',
            path: '/profil'
        },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => router.push(item.path)}
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                            isActive(item.path) ? 'text-purple-600' : 'text-gray-400'
                        }`}
                    >
                        <img
                            src={isActive(item.path) ? item.iconActive : item.icon}
                            alt={item.label}
                        />
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default BottomNav;