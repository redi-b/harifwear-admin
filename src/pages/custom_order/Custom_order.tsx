import { getAllCustomOrders as orders } from "@/api/order"

const Custom_order = () => {
  
  const handleSubmit = (productId: number) => {}
  return (
    <div>
      <h1 className='text-3xl'>Custom Orders</h1>
      {orders.map((order) => (
        <div key={order.id}  style={{ border: '1px solid #ccc', margin: '10px', padding: '10px',borderColor: 'orange', borderRadius: '5px' }}>
          <h2>Order ID: {order.id}</h2>
          <p><strong>Name:</strong> {order.name}</p>
          <p><strong>Address:</strong> {order.address}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
          <h3>Products:</h3>
          {order.products.map((product) => (
            <div key={product.id} style={{ border: '1px solid #ddd', margin: '5px', padding: '5px', display: 'flex', alignItems: 'center', height: 'auto' }}>
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
                <div style={{ display: 'flex', alignItems: 'center',  padding: '5px' }}>
                <strong>Enter Price in birr: </strong>
                <input type="number" className='outline-1 p-1'  />
                </div>
              
                <button 
                onClick={() => handleSubmit(product.id)} 
                style={{ border: '2px solid green', color: 'green', padding: '5px', borderRadius: '5px', background: 'transparent', cursor: 'pointer' }}
                >
                submit
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default Custom_order