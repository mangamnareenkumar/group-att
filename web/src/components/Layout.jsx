import React from 'react';
import { Users, Github } from 'lucide-react';
import { userStorage } from '../utils/userStorage';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen text-white flex flex-col" style={{fontFamily: 'Inter, sans-serif'}}>
      <nav className="glass rounded-2xl m-2 sm:m-4 mb-4 sm:mb-8">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-4">
              <div className="gradient-btn p-2 rounded-xl">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold gradient-text">
                  ✨ Group Attendance
                </h1>
                <p className="text-xs sm:text-sm text-white/70">User: {userStorage.getCurrentUser().slice(-8)}</p>
              </div>
            </div>
            
            <a
              href="https://github.com/OfzenEnt"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-white/70 hover:text-white glass-hover rounded-xl transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </nav>
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      
      <footer className="mt-auto py-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-white/70 text-sm">
              Made with ❤️ by <span className="gradient-text font-semibold">Ofzen</span>
            </p>
            <p className="text-white/50 text-xs mt-1">
              © 2025 Ofzen. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}