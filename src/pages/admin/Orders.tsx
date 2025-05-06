import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Tabs from "@radix-ui/react-tabs";
import clsx from "clsx";
import {
  getAllOrders,
  getAllCustomOrders,
  updateOrderStatus,
  updateCustomOrderStatus,
} from "@/api/order";
import { PulseLoader } from "react-spinners";
import { Order, CustomOrder, OrderStatus } from "@/types/order";
import RegularOrderCard from "@/components/RegularOrderCard";
import CustomOrderCard from "@/components/CustomOrderCard";
import ErrorMessage from "@/components/ErrorMessage";
import { AxiosResponse } from "axios";
import { MdSearch } from "react-icons/md";
import { FaArrowDown, FaArrowUp, FaChevronDown } from "react-icons/fa";

const Orders = () => {
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [orderType, setOrderType] = useState<"regular" | "custom">("regular");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "total">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const {
    data: orders,
    isFetching: fetchingRegular,
    error: fetchRegularError,
  } = useQuery<AxiosResponse, Error, Order[]>({
    queryKey: ["regular-orders"],
    queryFn: getAllOrders,
    select: (response) => response.data.orders,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: customOrders,
    isFetching: fetchingCustom,
    error: fetchCustomError,
  } = useQuery<AxiosResponse, Error, CustomOrder[]>({
    queryKey: ["custom-orders"],
    queryFn: getAllCustomOrders,
    select: (response) => response.data.customOrders,
    staleTime: 1000 * 60 * 5,
  });

  const filterOptions: (OrderStatus | "all")[] = [
    "all",
    "purchased",
    "pending",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const filteredOrders = orders
    ?.filter((o) => (filter === "all" ? true : o.status === filter))
    .filter((o) =>
      searchQuery
        ? String(o.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.delivery_info.fullName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : true
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return sortOrder === "asc"
          ? a.subtotal - b.subtotal
          : b.subtotal - a.subtotal;
      }
    });

  const filteredCustomOrders = customOrders
    ?.filter((o) => (filter === "all" ? true : o.status === filter))
    .filter((o) =>
      searchQuery
        ? String(o.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.delivery_info.fullName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : true
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return 0; // Custom orders don't have subtotal, so no sorting by total
      }
    });

  // Bulk update mutation
  const { mutate: bulkUpdate, isPending: updating } = useMutation({
    mutationFn: async (status: OrderStatus) => {
      console.log(`Updating ${selectedOrders.length} orders to ${status}`);
      const updatePromises = selectedOrders.map((id) => {
        if (orderType === "regular") {
          return updateOrderStatus(id, status);
        } else {
          return updateCustomOrderStatus(id, status);
        }
      });

      const results = await Promise.allSettled(updatePromises);
      const errors: string[] = [];

      results.forEach((result, index) => {
        if (result.status === "rejected") {
          errors.push(
            `Order ${selectedOrders[index]}: ${result.reason.message}`
          );
        }
      });

      if (errors.length > 0) {
        throw new Error(errors.join("; "));
      }

      return selectedOrders.length;
    },
    onSuccess: (count: number) => {
      const listQueryKey =
        orderType === "regular" ? ["regular-orders"] : ["custom-orders"];
      queryClient.invalidateQueries({ queryKey: listQueryKey });
      selectedOrders.forEach((id) => {
        const queryKey =
          orderType === "regular" ? ["order", id] : ["custom-order", id];
        queryClient.invalidateQueries({ queryKey });
      });

      setUpdateMessage(
        `${count} order${count > 1 ? "s" : ""} updated successfully!`
      );
      setUpdateError(null);
      setTimeout(() => setUpdateMessage(null), 3000);

      setSelectedOrders([]);
    },
    onError: (error: Error) => {
      setUpdateError(`Failed to update some orders: ${error.message}`);
      setUpdateMessage(null);
      setTimeout(() => setUpdateError(null), 5000);
    },
  });

  // Bulk update handler
  const handleBulkUpdate = async (status: OrderStatus) => {
    if (selectedOrders.length === 0) {
      setUpdateError("No orders selected.");
      setTimeout(() => setUpdateError(null), 3000);
      return;
    }
    bulkUpdate(status);
  };

  const toggleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  if (fetchingRegular || fetchingCustom)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PulseLoader color="#f97316" size={15} />
      </div>
    );

  if (fetchRegularError || fetchCustomError)
    return (
      <ErrorMessage
        title={"Error"}
        description={
          fetchRegularError?.message ||
          fetchCustomError?.message ||
          "Something went wrong."
        }
        retry={() => {
          if (fetchRegularError) getAllOrders();
          if (fetchCustomError) getAllCustomOrders();
        }}
        className="w-fit"
      />
    );

  return (
    <div className="flex flex-col items-center min-h-screen py-6 md:px-2">
      <div className="w-full max-w-6xl">
        <h1 className="mb-6 text-4xl font-bold text-center text-gray-900">
          Admin Order Management
        </h1>
        {/* Sticky Controls */}
        <div className="sticky top-0 z-20 pt-4 pb-2 bg-gray-50">
          {/* Search and Sort */}
          <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by order ID or customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 text-sm transition-all border border-gray-400 rounded-lg outline-none focus:border-orange-500"
              />
              <MdSearch className="absolute w-5 h-5 text-gray-400 right-3 top-2.5" />
            </div>
            <div className="flex items-center self-end gap-4">
              <div className="relative inline-block w-48">
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "date" | "total")
                  }
                  className="w-full px-4 py-2 pr-10 text-sm transition-all border border-gray-400 rounded-lg outline-none appearance-none cursor-pointer hover:bg-gray-100 active:border-orange-500"
                >
                  <option value="date">Sort by Date</option>
                  {orderType === "regular" && (
                    <option value="total">Sort by Total</option>
                  )}
                </select>
                <div className="absolute inset-y-0 flex items-center text-gray-600 pointer-events-none right-3">
                  <FaChevronDown />
                </div>
              </div>

              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="p-2 text-gray-700 border border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                {sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />}
              </button>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {filterOptions.map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={clsx(
                  "px-4 py-2 text-sm font-medium rounded-full capitalize transition-colors min-w-[80px]",
                  filter === "all" && status === "all"
                    ? "bg-orange-500 text-white shadow-md"
                    : status === filter
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
                )}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Tabs */}
          <Tabs.Root
            value={orderType}
            onValueChange={(val) => {
              setSelectedOrders([]);
              setOrderType(val as "regular" | "custom");
            }}
          >
            <Tabs.List className="flex justify-center border-b border-gray-300">
              <Tabs.Trigger
                value="regular"
                className={clsx(
                  "px-4 py-2 font-semibold text-lg border-b-2 cursor-pointer",
                  orderType === "regular"
                    ? "text-orange-600 border-orange-600"
                    : "text-gray-600 border-transparent hover:text-orange-600"
                )}
              >
                Regular Orders
              </Tabs.Trigger>
              <Tabs.Trigger
                value="custom"
                className={clsx(
                  "px-4 py-2 font-semibold text-lg border-b-2 cursor-pointer",
                  orderType === "custom"
                    ? "text-orange-600 border-orange-600"
                    : "text-gray-600 border-transparent hover:text-orange-600"
                )}
              >
                Custom Orders
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>

          {/* Bulk Actions */}
          {selectedOrders.length > 0 && (
            <div className="flex flex-col items-center justify-center p-4 space-y-3 bg-white border-b border-gray-200 rounded-b-lg shadow-md">
              <div className="flex items-center justify-between w-full max-w-md">
                <span className="text-sm font-medium">
                  {selectedOrders.length}{" "}
                  {orderType === "regular" ? "order" : "custom order"}
                  {selectedOrders.length > 1 ? "s" : ""} selected
                </span>
                <button
                  onClick={() => setSelectedOrders([])}
                  className="text-sm text-red-600 cursor-pointer hover:underline"
                >
                  Clear Selection
                </button>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  "purchased",
                  "pending",
                  "shipped",
                  "delivered",
                  "cancelled",
                ].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleBulkUpdate(status as OrderStatus)}
                    disabled={updating}
                    className={clsx(
                      "px-3 py-1.5 text-sm font-medium text-white rounded transition",
                      updating
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-600 cursor-pointer"
                    )}
                  >
                    Mark as {status}
                  </button>
                ))}
              </div>
              {updating && (
                <div className="flex items-center gap-2 mt-2">
                  <PulseLoader color="#f97316" size={8} />
                  <span className="text-sm text-gray-600">Updating...</span>
                </div>
              )}
              {updateMessage && (
                <div className="w-full max-w-md p-2 mt-2 text-sm text-center text-green-800 bg-green-100 rounded-md">
                  {updateMessage}
                </div>
              )}
              {updateError && (
                <div className="w-full max-w-md p-2 mt-2 text-sm text-center text-red-800 bg-red-100 rounded-md">
                  {updateError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tab Content */}
        <div className="max-w-6xl px-1 mx-auto mt-8 sm:px-2 md:px-4 lg:px-12 2xl:px-20">
          <Tabs.Root value={orderType}>
            <Tabs.Content value="regular">
              {filteredOrders && filteredOrders.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {filteredOrders.map((order) => (
                    <RegularOrderCard
                      key={order.id}
                      order={order}
                      isSelected={selectedOrders.includes(String(order.id))}
                      onSelect={() => toggleSelectOrder(String(order.id))}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-lg text-gray-500">
                    {filter === "all"
                      ? "No regular orders found."
                      : `No ${filter} regular orders found.`}
                  </p>
                </div>
              )}
            </Tabs.Content>
            <Tabs.Content value="custom">
              {filteredCustomOrders && filteredCustomOrders.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {filteredCustomOrders.map((order) => (
                    <CustomOrderCard
                      key={order.id}
                      order={order}
                      isSelected={selectedOrders.includes(String(order.id))}
                      onSelect={() => toggleSelectOrder(String(order.id))}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-lg text-gray-500">
                    {filter === "all"
                      ? "No custom orders found."
                      : `No ${filter} custom orders found.`}
                  </p>
                </div>
              )}
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
    </div>
  );
};

export default Orders;
