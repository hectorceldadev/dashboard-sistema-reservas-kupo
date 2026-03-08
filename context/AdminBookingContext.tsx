'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AdminBookingContextType {
  isOpen: boolean;
  openModal: () => void; 
  closeModal: () => void;
}

const AdminBookingContext = createContext<AdminBookingContextType | undefined>(undefined);

export function AdminBookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openModal = () => setIsOpen(true)

  const closeModal = () => setIsOpen(false)

  return (
    <AdminBookingContext.Provider value={{isOpen, openModal, closeModal}}>
      {children}
    </AdminBookingContext.Provider>
  );
}

export function useAdminBooking() {
  const context = useContext(AdminBookingContext);
  if (!context) {
    throw new Error('useBooking debe usarse dentro de un BookingProvider');
  }
  return context;
}