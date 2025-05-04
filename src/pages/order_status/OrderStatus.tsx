
import * as Tabs from '@radix-ui/react-tabs';
import { useState } from 'react';
import clsx from 'clsx';
import OrdersCard from '../../components/OrdersCard';

const orderStatuses = [ 'Purchased', 'Shipped', 'Delivered', 'Cancelled']

export default function OrdersStatus() {
  const [selectedStatus, setSelectedStatus] = useState('Purchased');
  const [orderType, setOrderType] = useState<'regular' | 'custom'>('regular');

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  return (
    <div className="p-4 max-w-[60%] mx-auto font-sans">
      <h1 className="text-2xl font-bold text-center mb-6">Orders</h1>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {orderStatuses.map((status) => (
          <button
            key={status}
            onClick={() => handleStatusChange(status)}
            className={clsx(
              'px-4 py-2 rounded-full text-sm font-medium hover:cursor-pointer',
              selectedStatus === status
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-700'
            )}
          >
            {status}
          </button>
        ))}
      </div>
      <Tabs.Root value={orderType} onValueChange={(val) => setOrderType(val as 'regular' | 'custom')}>
        <Tabs.List className="flex justify-center border-b border-gray-200 mb-4">
          <Tabs.Trigger
            value="regular"
            className={clsx(
              'px-4 py-2 font-semibold text-sm border-b-2 cursor-pointer',
              orderType === 'regular'
                ? 'text-orange-600 border-orange-600'
                : 'text-gray-600 border-transparent'
            )}
          >
            Regular Orders
          </Tabs.Trigger>
          <Tabs.Trigger
            value="custom"
            className={clsx(
              'px-4 py-2 font-semibold text-sm border-b-2 cursor-pointer',
              orderType === 'custom'
                ? 'text-orange-600 border-orange-600'
                : 'text-gray-600 border-transparent'
            )}
          >
            Custom Orders
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="regular" className="text-center text-gray-500">
           <OrdersCard type='regular' status={selectedStatus} orderStatuses={orderStatuses}/> 
          
        </Tabs.Content>
        <Tabs.Content value="custom" className="text-center text-gray-500">
           <OrdersCard type='custom' status={selectedStatus} orderStatuses={orderStatuses}/> 
          
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
