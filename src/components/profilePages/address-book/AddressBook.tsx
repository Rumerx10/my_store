'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, MapPin, Phone } from 'lucide-react';

const AddressBook = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Home',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      phone: '+1 (555) 123-4567',
      default: true,
    },
    {
      id: 2,
      name: 'Office',
      street: '456 Business Ave',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      phone: '+1 (555) 987-6543',
      default: false,
    },
  ]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });

  const handleAddress = (id: number) => {
    setAddresses(
      addresses.map((addr) =>
        addr.id === id ? { ...addr, default: !addr.default } : { ...addr, default: false },
      ),
    );
  };

  const handleEdit = (address: (typeof addresses)[0]) => {
    setEditingId(address.id);
    setFormData({
      name: address.name,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      phone: address.phone,
    });
  };

  const handleDelete = (id: number) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSaveAddress = () => {
    if (editingId) {
      setAddresses(
        addresses.map((addr) => (addr.id === editingId ? { ...addr, ...formData } : addr)),
      );
      setEditingId(null);
    } else {
      const newAddress = {
        id: Math.max(...addresses.map((a) => a.id), 0) + 1,
        ...formData,
        default: false,
      };
      setAddresses([...addresses, newAddress]);
      setIsAddingNew(false);
    }
    setFormData({
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
    });
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingId(null);
    setFormData({
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-28 pb-12">
        <div className="container flex flex-col mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Address Book</h1>
              <p className="text-gray-600 mt-2">Manage your delivery addresses</p>
            </div>
            <Button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus size={20} />
              Add Address
            </Button>
          </div>

          {/* Add/Edit Address Form */}
          {(isAddingNew || editingId) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {editingId ? 'Edit Address' : 'New Address'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-gray-700">
                    Address Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Home, Office"
                    className="mt-2"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-gray-700">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 000-0000"
                    className="mt-2"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="street" className="text-gray-700">
                    Street Address
                  </Label>
                  <Input
                    id="street"
                    placeholder="123 Main Street"
                    className="mt-2"
                    value={formData.street}
                    onChange={(e) => handleInputChange('street', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="city" className="text-gray-700">
                    City
                  </Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    className="mt-2"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="text-gray-700">
                    State
                  </Label>
                  <Input
                    id="state"
                    placeholder="NY"
                    className="mt-2"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="zip" className="text-gray-700">
                    Zip Code
                  </Label>
                  <Input
                    id="zip"
                    placeholder="10001"
                    className="mt-2"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={handleSaveAddress} className="bg-blue-600 hover:bg-blue-700">
                  Save Address
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Address Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`rounded-lg border-2 p-6 transition-all ${
                  address.default
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleAddress(address.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <button className="flex items-center gap-2 cursor-pointer hover:opacity-75 transition-opacity">
                    <MapPin size={20} className="text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{address.name}</h3>
                    {address.default && (
                      <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-gray-700">{address.street}</p>
                  <p className="text-gray-700">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <div className="flex items-center gap-2 text-gray-600 pt-2 border-t border-gray-200">
                    <Phone size={16} />
                    <span>{address.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressBook;
