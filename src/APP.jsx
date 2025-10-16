import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const materialNames = [
    'Zinc Slab', 'Nylon Resin', 'Titanium Sheet', 'Brass Rod', 
    'Nickel Alloy', 'Polymer Pellets', 'Carbon Fiber', 'Magnesium Ingot',
    'Stainless Plate', 'Silicon Wafer', 'Graphite Block', 'Tungsten Wire'
  ];

  const [materials, setMaterials] = useState([
    {
      id: 1,
      name: 'Steel Coil',
      price: 5200.0,
      previousPrice: 5200.0,
      unit: 'ton',
      priceHistory: [5200, 5200, 5200, 5200, 5200],
      lastUpdated: new Date().toLocaleTimeString()
    },
    {
      id: 2,
      name: 'Aluminum Ingot',
      price: 2850.0,
      previousPrice: 2850.0,
      unit: 'ton',
      priceHistory: [2850, 2850, 2850, 2850, 2850],
      lastUpdated: new Date().toLocaleTimeString()
    },
    {
      id: 3,
      name: 'Copper Wire',
      price: 9100.0,
      previousPrice: 9100.0,
      unit: 'ton',
      priceHistory: [9100, 9100, 9100, 9100, 9100],
      lastUpdated: new Date().toLocaleTimeString()
    }
  ]);

  const [usedNames, setUsedNames] = useState(['Steel Coil', 'Aluminum Ingot', 'Copper Wire']);
  const [selectedMaterialId, setSelectedMaterialId] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setMaterials(prevMaterials =>
        prevMaterials.map(material => {
          const changePercent = (Math.random() - 0.5) * 0.05;
          const newPrice = parseFloat((material.price * (1 + changePercent)).toFixed(2));
          
          const newHistory = [...material.priceHistory.slice(1), newPrice];
          
          return {
            ...material,
            previousPrice: material.price,
            price: newPrice,
            priceHistory: newHistory,
            lastUpdated: new Date().toLocaleTimeString()
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const addNewMaterial = () => {
    const availableNames = materialNames.filter(name => !usedNames.includes(name));
    
    if (availableNames.length === 0) {
      alert('All available materials have been added!');
      return;
    }

    const randomName = availableNames[Math.floor(Math.random() * availableNames.length)];
    const randomPrice = parseFloat((Math.random() * 8000 + 2000).toFixed(2));
    
    const newMaterial = {
      id: Date.now(),
      name: randomName,
      price: randomPrice,
      previousPrice: randomPrice,
      unit: 'ton',
      priceHistory: [randomPrice, randomPrice, randomPrice, randomPrice, randomPrice],
      lastUpdated: new Date().toLocaleTimeString()
    };

    setMaterials(prev => [...prev, newMaterial]);
    setUsedNames(prev => [...prev, randomName]);
  };

  const getPriceChangeStatus = (current, previous) => {
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'stable';
  };

  const MaterialCard = ({ material }) => {
    const status = getPriceChangeStatus(material.price, material.previousPrice);
    const priceDiff = (material.price - material.previousPrice).toFixed(2);
    const isSelected = material.id === selectedMaterialId;

    return (
      <div 
        className={`material-card ${isSelected ? 'selected' : ''}`}
        onClick={() => setSelectedMaterialId(material.id)}
      >
        <div className="material-header">
          <h2 className="material-name">{material.name}</h2>
          <span className={`status-indicator ${status}`}>
            {status === 'up' && '↑ Up'}
            {status === 'down' && '↓ Down'}
            {status === 'stable' && '— Stable'}
          </span>
        </div>
        
        <div className="price-section">
          <div className="current-price">
            ${material.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="unit">/{material.unit}</span>
          </div>
          
          <div className={`price-change ${status}`}>
            {status === 'up' && `+$${priceDiff}`}
            {status === 'down' && `-$${Math.abs(priceDiff)}`}
            {status === 'stable' && '$0.00'}
          </div>
        </div>
        
        <div className="last-updated">
          {isSelected && '📊 Selected for Analysis • '}
          Last Updated: {material.lastUpdated}
        </div>
      </div>
    );
  };

  const PriceTrendAnalysis = () => {
    const selectedMaterial = materials.find(m => m.id === selectedMaterialId);
    
    if (!selectedMaterial) return null;

    const maxPrice = Math.max(...selectedMaterial.priceHistory);
    const minPrice = Math.min(...selectedMaterial.priceHistory);
    const priceRange = maxPrice - minPrice || 1;

    const avgPrice = (selectedMaterial.priceHistory.reduce((a, b) => a + b, 0) / 5).toFixed(2);
    const trend = selectedMaterial.priceHistory[4] > selectedMaterial.priceHistory[0] ? 'Upward' : 
                  selectedMaterial.priceHistory[4] < selectedMaterial.priceHistory[0] ? 'Downward' : 'Stable';

    return (
      <div className="analysis-section">
        <h2 className="analysis-title">Price Trend Analysis</h2>
        <p className="analysis-subtitle">Last 5 Updates for: <strong>{selectedMaterial.name}</strong></p>
        
        <div className="chart-container">
          {selectedMaterial.priceHistory.map((price, index) => {
            const height = ((price - minPrice) / priceRange) * 150 + 30;
            
            return (
              <div key={index} className={`bar ${index === 4 ? 'current' : ''}`} style={{ height: `${height}px` }}>
                <span className="bar-label">T-{4-index}</span>
                <span className="bar-price">${price.toFixed(0)}</span>
              </div>
            );
          })}
        </div>

        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-label">Current Price</div>
            <div className="stat-value">${selectedMaterial.price.toFixed(2)}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">5-Point Average</div>
            <div className="stat-value">${avgPrice}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Max (Last 5)</div>
            <div className="stat-value">${maxPrice.toFixed(2)}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Min (Last 5)</div>
            <div className="stat-value">${minPrice.toFixed(2)}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Trend Direction</div>
            <div className="stat-value">{trend}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <header className="header">
        <div className="title-container">
          <h1>Real-Time Material Price Insights</h1>
          <div className="live-indicator">
            <span className="pulse"></span>
            LIVE
          </div>
        </div>
        <button className="add-button" onClick={addNewMaterial}>
          + Add New Material
        </button>
      </header>
      
      <div className="dashboard-grid">
        {materials.map(material => (
          <MaterialCard key={material.id} material={material} />
        ))}
      </div>

      <PriceTrendAnalysis />
    </div>
  );
};

export default App;