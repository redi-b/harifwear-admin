import OrdersCard from '@/components/OrdersCard';

import { getAllOrders as orders } from '@/api/order';
const Shipped_orders = () => {

  const handleShipped = ( orderId: number ) => {
    /* console.log(`Declined product with ID: ${productId}`); */}
return (
  <div>
    <h1>Shipped Orders</h1>
    <OrdersCard orders={orders} reusableButton={(order)=>(<button 
      className="bg-orange-600 hover:bg-orange-600 px-6 py-3 rounded-xl text-left"
      onClick={() => handleShipped(order.id)}
    >
      Shipped
    </button>)} />
  </div>
)
}


export default Shipped_orders