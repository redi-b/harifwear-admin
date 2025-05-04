import React, { useEffect } from 'react'
import { Order } from '@/libs/Interface'
import { getAllOrders as order } from '@/api/order';
interface OrdersCardProps {
  type: 'regular' | 'custom';
  status: string;
  reusableButton?: (order:Order) => React.ReactNode;
  orderStatuses?: string[]|undefined;
}
const OrdersCard = ({type,status,reusableButton,orderStatuses}:OrdersCardProps) => {
  const [orders, setOrders] = React.useState<Order[]>([]);
  
  useEffect(() => {
    const fetchOrders = async () => {
      setOrders(order);
    }
    fetchOrders();
  },[type,status])


  const handleStatusChange = (orderId: number, status: string) => {
    if (status === 'Purchased') {
      alert('Order has been purchased!');
    }
    else if (status === 'Shipped') {
      alert('Order has been shipped!');
    }
  };
  return (
    <div >
      {!orders?<p>No {status} orders found.</p>:
      orders.map((order) => (
        <div key={order.id} className='border-2 text-black border-orange-600 rounded-lg m-[10px] p-2' >
          <h2>Order ID: {order.id}</h2>
          <p><strong>Name:</strong> {order.name}</p>
          <p><strong>Address:</strong> {order.address}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
          <h3>Products:</h3>
          {order.products.map((product) => (
            <div key={product.id} style={{ borderBottom: '5px solid #ea580c', margin: '5px', padding: '5px', display: 'flex', alignItems: 'center', height: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',width: '50%' }}>

              <img src="/product.jpg" alt={product.name}  style={{height: '50%', width: '50%'}}/>
                <p style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap',maxWidth:"80%", textAlign: 'center' }}>
                 {product.name}
                </p>

            </div>
              <div>

              <p><strong>Size:</strong> {product.size}</p>
              <p><strong>Color:</strong> {product.color}</p>
              <p><strong>Description:</strong> {product.description}</p>
              <p><strong>Price:</strong> {product.price} Birr</p>
              <p><strong>Quantity:</strong> {product.quantity}</p>
              </div>
            </div>
          ))}
          {reusableButton?reusableButton(order): 
          status !== 'Delivered'&&status !== 'Cancelled' ?
          <button 
        className="bg-orange-600 hover:bg-orange-600 px-6 py-3 rounded-xl text-left text-black cursor-pointer"    
        onClick={()=>handleStatusChange(order.id, status)}
        >
        {orderStatuses &&  orderStatuses[orderStatuses.indexOf(status) + 1] }
      </button >:null}
        </div>
      ))}
    </div>
  )
}

export default OrdersCard