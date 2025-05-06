import { Link } from "react-router-dom";
import clsx from "clsx";
import { CustomOrder } from "@/types/order";
import { FaEye } from "react-icons/fa";

interface CustomOrderCardProps {
  order: CustomOrder;
  isSelected: boolean;
  onSelect: () => void;
}

const CustomOrderCard = ({
  order,
  isSelected,
  onSelect,
}: CustomOrderCardProps) => {
  const name =
    order.p_name.length > 20 ? order.p_name.slice(0, 20) + "…" : order.p_name;
  const descriptionPreview =
    order.p_description.length > 25
      ? order.p_description.slice(0, 25) + "…"
      : order.p_description;

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
            Custom Order #{order.id}
          </h3>
        </div>
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
      <p className="mb-2 font-semibold text-gray-900 text-md">
        Date: {new Date(order.created_at).toLocaleDateString()}
      </p>
      <p className="mb-2 text-sm text-gray-600">
        <span className="font-medium">Customer:</span>{" "}
        <span className="text-gray-800">{order.delivery_info.fullName}</span>
      </p>
      <p className="mb-2 text-sm text-gray-600">
        <span className="font-medium">Product:</span>{" "}
        <span
          className="relative font-semibold text-gray-800 group"
          title={order.p_name}
        >
          {name}
        </span>
      </p>
      <p className="mb-4 text-sm text-gray-600">
        <span className="font-medium">Description:</span>{" "}
        <span
          className="relative text-gray-800 group"
          title={order.p_description}
        >
          {descriptionPreview}
        </span>
      </p>
      <div className="flex justify-end">
        <Link
          to={`/orders/custom/${order.id}`}
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

export default CustomOrderCard;
