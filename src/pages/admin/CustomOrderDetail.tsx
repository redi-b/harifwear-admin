import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PulseLoader } from "react-spinners";
import { CustomOrder, OrderStatus } from "@/types/order";
import { getCustomOrderById, updateCustomOrderStatus } from "@/api/order";
import { getUserInfo } from "@/api/user";
import { AxiosResponse } from "axios";
import { cn } from "@/lib/utils";
import { FaChevronDown, FaChevronLeft } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

interface UserInfo {
  id: string;
  email: string;
  username: string | null;
}

const CustomOrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Fetch order
  const {
    data: order,
    isFetching: fetchingOrder,
    error: orderError,
  } = useQuery<AxiosResponse, Error, CustomOrder>({
    queryKey: ["custom-order", id],
    queryFn: () => getCustomOrderById(id!),
    select: (response) => response.data.customOrder,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch user info
  const {
    data: userData,
    isFetching: fetchingUser,
    error: userError,
  } = useQuery<AxiosResponse, Error, UserInfo | null>({
    queryKey: ["user", order?.user_id],
    queryFn: () => getUserInfo(order!.user_id),
    select: (response) => response.data,
    enabled: !!order?.user_id,
    staleTime: 1000 * 60 * 5,
  });

  // Update status mutation
  const { mutate: updateStatus, isPending: updatingStatus } = useMutation({
    mutationFn: (status: OrderStatus) => updateCustomOrderStatus(id!, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["custom-orders"] });
      setSelectedStatus("");
      setUpdateMessage("Status updated successfully!");
    },
    onError: (error: Error) => {
      setUpdateError(`Failed to update order status: ${error.message}`);
      setUpdateMessage(null);
    },
  });

  useEffect(() => {
    if (!fetchingOrder && order) {
      setSelectedStatus(order.status);
    }
  }, [fetchingOrder, order, orderError]);

  if (fetchingOrder || fetchingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <PulseLoader color="#f97316" size={15} />
      </div>
    );
  }

  if (orderError || !order) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-6 text-center bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold text-red-600">Error</h2>
          <p className="text-gray-600">
            {orderError?.message || "Failed to load order details."}
          </p>
          <Link
            to="/orders"
            className="inline-block px-4 py-2 mt-4 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const renderStatusBadge = (status: OrderStatus) => (
    <span
      className={cn(
        "px-3 py-1 text-xs font-medium rounded-full capitalize",
        status === "purchased" && "bg-blue-100 text-blue-800",
        status === "pending" && "bg-yellow-100 text-yellow-800",
        status === "shipped" && "bg-purple-100 text-purple-800",
        status === "delivered" && "bg-green-100 text-green-800",
        status === "cancelled" && "bg-red-100 text-red-800"
      )}
    >
      {status}
    </span>
  );

  const handleStatusChange = () => {
    if (selectedStatus && selectedStatus !== order.status) {
      updateStatus(selectedStatus as OrderStatus);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Custom Order #{id}
          </h1>
          <Link
            to="/orders"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-orange-600 rounded-lg hover:bg-orange-700"
          >
            <FaChevronLeft />
            Back to Orders
          </Link>
        </div>

        {/* Status Update */}
        <div className="p-6 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-orange-600">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Update Order Status
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative inline-block w-3/5 max-w-sm">
              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as OrderStatus)
                }
                className="w-full px-4 py-2 pr-10 text-sm transition-all border border-gray-400 rounded-lg outline-none appearance-none cursor-pointer hover:bg-gray-100 active:border-orange-500"
                disabled={updatingStatus}
              >
                <option value="purchased">Purchased</option>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="absolute inset-y-0 flex items-center text-gray-600 pointer-events-none right-3">
                <FaChevronDown />
              </div>
            </div>
            <button
              onClick={handleStatusChange}
              disabled={
                !selectedStatus ||
                selectedStatus === order?.status ||
                updatingStatus
              }
              className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 disabled:bg-gray-400"
            >
              {updatingStatus ? (
                <>
                  <PulseLoader color="#fff" size={8} />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
          {updateMessage && (
            <div className="p-2 mt-4 text-sm text-green-800 bg-green-100 rounded-md">
              {updateMessage}
            </div>
          )}
          {updateError && (
            <div className="p-2 mt-4 text-sm text-center text-red-800 bg-red-100 rounded-md">
              {updateError}
            </div>
          )}
        </div>

        {/* Order and Customer Info */}
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
          {/* Order Info */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-orange-600">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Order Information
            </h2>
            {fetchingOrder && !order ? (
              <div className="flex items-center justify-center py-4">
                <PulseLoader color="#f97316" size={10} />
              </div>
            ) : orderError ? (
              <p className="text-red-600">Error loading order info.</p>
            ) : (
              <div className="grid gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Status:</span>
                  {renderStatusBadge(order.status)}
                </div>
                <p>
                  <span className="font-medium text-gray-600">Date:</span>{" "}
                  <span className="text-gray-800">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Customer Info */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-orange-600">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Customer Information
            </h2>
            {fetchingUser && !userData ? (
              <div className="flex items-center justify-center py-4">
                <PulseLoader color="#f97316" size={10} />
              </div>
            ) : userError ? (
              <p className="text-red-600">Error loading customer info.</p>
            ) : (
              <div className="grid gap-2 text-sm">
                <p>
                  <span className="font-medium text-gray-600">Name:</span>{" "}
                  <span className="text-gray-800">
                    {order.delivery_info.fullName}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-600">Address:</span>{" "}
                  <span className="text-gray-800">
                    {order.delivery_info.address}, {order.delivery_info.city}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-600">
                    Contact Phone:
                  </span>{" "}
                  <span className="text-gray-800">
                    {order.delivery_info.contactPhone}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-600">
                    Delivery Instructions:
                  </span>{" "}
                  <span className="text-gray-800">
                    {order.delivery_info.deliveryInstructions || "None"}
                  </span>
                </p>
                {userData ? (
                  <>
                    <p>
                      <span className="font-medium text-gray-600">Email:</span>{" "}
                      <span className="text-gray-800">{userData.email}</span>
                    </p>
                    <p>
                      <span className="font-medium text-gray-600">
                        Username:
                      </span>{" "}
                      <span className="text-gray-800">
                        {userData.username || "None"}
                      </span>
                    </p>
                  </>
                ) : (
                  <p className="text-gray-600">No user info available.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="p-8 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg hover:border-orange-600">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">
            Product Details
          </h2>
          {fetchingOrder && !order ? (
            <div className="flex items-center justify-center py-4">
              <PulseLoader color="#f97316" size={10} />
            </div>
          ) : orderError ? (
            <p className="text-red-600">Error loading product details.</p>
          ) : (
            <div className="grid gap-4 text-sm">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  {order.p_image_url ? (
                    <img
                      src={order.p_image_url}
                      alt={order.p_name}
                      className="object-cover w-16 h-16 rounded-md"
                      onError={(e) => {
                        e.currentTarget.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='gray'%3E%3Cpath d='M0 0h64v64H0z'/%3E%3C/svg%3E";
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-md">
                      <FaXmark size={32} className="text-orange-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p>
                    <span className="font-medium text-gray-600">Name:</span>{" "}
                    <span
                      className="text-base font-semibold text-gray-800 group"
                      title={order.p_name}
                    >
                      {order.p_name.length > 50
                        ? order.p_name.slice(0, 50) + "…"
                        : order.p_name}
                    </span>
                  </p>
                </div>
              </div>
              <p>
                <span className="font-medium text-gray-600">Description:</span>{" "}
                <span className="text-gray-800">{order.p_description}</span>
              </p>
              <p>
                <span className="font-medium text-gray-600">Notes:</span>{" "}
                <span className="text-gray-800">{order.p_notes || "None"}</span>
              </p>
              <p>
                <span className="font-medium text-gray-600">Link:</span>{" "}
                {order.p_link ? (
                  <a
                    href={order.p_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:underline"
                  >
                    View Link
                  </a>
                ) : (
                  <span className="text-gray-800">None</span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomOrderDetail;
