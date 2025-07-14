import { useState, useEffect } from 'react';

interface CustomBank {
  name: string;
  color: string;
}

interface CustomCategory {
  name: string;
  icon: string;
  color: string;
}

export const useCustomBanks = () => {
  const [customBanks, setCustomBanks] = useState<CustomBank[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedBanks = localStorage.getItem('customBanks');
    if (savedBanks) {
      setCustomBanks(JSON.parse(savedBanks));
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('customBanks', JSON.stringify(customBanks));
  }, [customBanks]);

  const addBank = (bank: CustomBank) => {
    setCustomBanks(prev => [...prev, bank]);
  };

  const deleteBank = (bankName: string) => {
    setCustomBanks(prev => prev.filter(b => b.name !== bankName));
  };

  return {
    customBanks,
    addBank,
    deleteBank
  };
};

export const useCustomCategories = () => {
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCategories = localStorage.getItem('customCategories');
    if (savedCategories) {
      setCustomCategories(JSON.parse(savedCategories));
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('customCategories', JSON.stringify(customCategories));
  }, [customCategories]);

  const addCategory = (category: CustomCategory) => {
    setCustomCategories(prev => [...prev, category]);
  };

  const deleteCategory = (categoryName: string) => {
    setCustomCategories(prev => prev.filter(c => c.name !== categoryName));
  };

  return {
    customCategories,
    addCategory,
    deleteCategory
  };
};