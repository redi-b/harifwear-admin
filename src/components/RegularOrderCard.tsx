import { Link } from "react-router-dom";
import clsx from "clsx";
import { Order } from "@/types/order";
import { FaEye } from "react-icons/fa";

interface RegularOrderCardProps {
  order: Order;
  isSelected: boolean;
  onSelect: () => void;
}

const RegularOrderCard = ({
  order,
  isSelected,
  onSelect,
}: RegularOrderCardProps) => {
  const productSummary = order.products.slice(0, 2).map((p) => ({
    name: p.name.length > 80 ? p.name.slice(0, 80) + "…" : p.name,
    fullName: p.name,
    quantity: p.quantity,
  }));
  const extraProducts =
    order.products.length > 2 ? `+${order.products.length - 2} more` : "";
  const totalProducts = order.products.length;

  return (
    <div
      onClick={onSelect}
      className={clsx(
        "p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-orange-500 transition-all duration-200 cursor-pointer",
        isSelected && "border-orange-500 bg-orange-50"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
            onClick={(e) => e.stopPropagation()}
          />
          <h3 className="text-xl font-semibold text-gray-900">
            Order #{order.id}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold">
            <span className="text-orange-600">{order.subtotal.toFixed(2)}</span>{" "}
            Birr
          </span>
          <span
            className={clsx(
              "px-3 py-1 text-xs font-medium rounded-full capitalize",
              order.status === "purchased" && "bg-blue-100 text-blue-800",
              order.status === "pending" && "bg-yellow-100 text-yellow-800",
              order.status === "shipped" && "bg-purple-100 text-purple-800",
              order.status === "delivered" && "bg-green-100 text-green-800",
              order.status === "cancelled" && "bg-red-100 text-red-800"
            )}
          >
            {order.status}
          </span>
        </div>
      </div>
      <p className="mb-2 text-sm font-semibold text-gray-700">
        Date: {new Date(order.created_at).toLocaleDateString()}
      </p>
      <p className="mb-2 text-sm text-gray-600">
        <span className="font-medium">Customer:</span>{" "}
        <span className="text-gray-800">{order.delivery_info.fullName}</span>
      </p>
      <div className="mb-2 text-sm text-gray-600">
        <span className="font-medium">Products:</span>
        <ul className="pl-2 mt-1 space-y-1">
          {productSummary.map((p, index) => (
            <li
              key={index}
              className="relative text-gray-800 group"
              title={p.fullName}
            >
              {p.name} (x{p.quantity})
            </li>
          ))}
          {extraProducts && <li className="text-gray-500">{extraProducts}</li>}
        </ul>
      </div>
      <p className="mb-4 text-sm text-gray-600">
        <span className="font-medium text-orange-600">
          {totalProducts} products in order
        </span>
      </p>
      <div className="flex justify-end">
        <Link
          to={`/orders/${order.id}`}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-colors bg-orange-500 rounded-full hover:bg-orange-600"
          onClick={(e) => e.stopPropagation()}
        >
          <FaEye size={16} />
          View
        </Link>
      </div>
    </div>
  );
};

export default RegularOrderCard;
