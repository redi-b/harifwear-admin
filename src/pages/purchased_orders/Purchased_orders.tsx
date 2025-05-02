import OrdersCard from '@/components/OrdersCard';

import { getAllOrders as orders } from '@/api/order';
const Purchased_orders = () => {
  const handlePurchased = ( orderId: number ) => {
    /* console.log(`Declined product with ID: ${productId}`); */
    // Add logic to handle declining a product
  };
  return (
    <div>
      <h1>Purchased Orders</h1>
      <OrdersCard orders={orders} reusableButton={(order)=>(<button 
        className="bg-orange-600 hover:bg-orange-600 px-6 py-3 rounded-xl text-left"
        onClick={() => handlePurchased(order.id)}
      >
        Purchased
      </button>)} />
    </div>
  )
}

export default Purchased_orders