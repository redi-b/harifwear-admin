import OrdersCard from '@/components/OrdersCard';

import {getAllOrders as  orders } from '@/api/order';

const Delivered_orders = () => {

return (
  <div>
    <h1>Delivered Orders</h1>
    <OrdersCard orders={orders} reusableButton={()=>null} />
  </div>
)
}

export default Delivered_orders