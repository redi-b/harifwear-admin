import OrdersCard from '@/components/OrdersCard';


export default function Regular_Orders () {


  const handleDecline = ( orderId: number ) => {
    
  };

  return (
    <div>
      <h1 className='text-3xl'>Normal Orders</h1>
      <OrdersCard type={"regular"} status={""} reusableButton={(order)=>(<div className='flex  gap-2'>
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
