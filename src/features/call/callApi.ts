import { api } from "@/src/api/config";

export interface InitiateCallResponse {
  roomName: string;
  token: string;
  url: string;
  callee: { id: string; name: string; role: string };
}

export interface IncomingCallPayload {
  roomName: string;
  token: string;
  url: string;
  deliveryId: string;
  from: { id: string; name: string; role: string };
}

export const callApi = {
  initiate: async (deliveryId: string): Promise<InitiateCallResponse> => {
    const res = await api.post("/calls/initiate", { deliveryId });
    return (res.data?.data ?? res.data) as InitiateCallResponse;
  },

  end: async (deliveryId: string, reason = "ended"): Promise<void> => {
    try {
      await api.post("/calls/end", { deliveryId, reason });
    } catch {
      // best-effort signal
    }
  },
};
