import React from 'react';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import { QATouchProvider } from './context/QATouchContext';


function App() {
  return (
    <QATouchProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Dashboard />
        </main>
      </div>
    </QATouchProvider>
  );
}

export default App;
