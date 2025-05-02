import OrdersCard from '@/components/OrdersCard';

import { getAllOrders as orders } from '@/api/order';
const Normal_Orders = () => {


  const handleDecline = ( orderId: number ) => {
    
  };

  return (
    <div>
      <h1 className='text-3xl'>Normal Orders</h1>
      <OrdersCard orders={orders} reusableButton={(order)=>(<div className='flex  gap-2'>
          <button 
          onClick={() => handleDecline(order.id)} 
          className='bg-orange-600 hover:bg-orange-600 px-6 py-3 rounded-xl text-left'
          >
          Buy
          </button>
          <button 
          onClick={() => handleDecline(order.id)} 
          style={{ border: '2px solid red', color: 'red', padding: '5px', borderRadius: '5px', background: 'transparent', cursor: 'pointer' }}
          >
          Decline
          </button> 

          </div>
        )}/>
    </div>
  );
};

export default Normal_Orders;