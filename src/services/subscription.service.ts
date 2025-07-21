import type { IResponse } from "types/backend";
import type { ISubscription } from "types/subscription.type";
import instance from "services/axios.customize";

export const createSubscriptionAPI = (data: { planId: number }) => {
    const url_backend = '/api/v1/subscriptions';
    return instance.post<IResponse<ISubscription>>(url_backend, data);
}
