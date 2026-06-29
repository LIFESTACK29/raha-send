import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import {
  AudioSession,
  LiveKitRoom,
  registerGlobals,
  useLocalParticipant,
  useParticipants,
} from "@livekit/react-native";
import {
  connectDeliverySocket,
  getDeliverySocket,
} from "@/src/features/delivery/services/delivery.socket";
import { callApi, IncomingCallPayload } from "./callApi";

// Wire react-native-webrtc into the global scope. Must run once before any call.
registerGlobals();

interface ActiveCall {
  roomName: string;
  token: string;
  url: string;
  deliveryId: string;
  peerName: string;
  outgoing: boolean;
}

interface CallContextValue {
  startCall: (deliveryId: string) => Promise<void>;
  isBusy: boolean;
}

const CallContext = createContext<CallContextValue>({
  startCall: async () => {},
  isBusy: false,
});

export const useCall = () => useContext(CallContext);

export function CallProvider({ children }: { children: React.ReactNode }) {
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [incoming, setIncoming] = useState<IncomingCallPayload | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  // ── Socket signaling ────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const handleIncoming = (payload: IncomingCallPayload) => {
      if (!mounted) return;
      // Ignore if already on a call.
      setActiveCall((cur) => {
        if (!cur) setIncoming(payload);
        return cur;
      });
    };

    const handleEnded = () => {
      if (!mounted) return;
      setIncoming(null);
      setActiveCall(null);
    };

    const setup = async () => {
      try {
        await connectDeliverySocket();
        const s = getDeliverySocket();
        s?.on("incoming_call", handleIncoming);
        s?.on("call_ended", handleEnded);
      } catch {
        // socket will retry on its own
      }
    };
    void setup();

    return () => {
      mounted = false;
      const s = getDeliverySocket();
      s?.off("incoming_call", handleIncoming);
      s?.off("call_ended", handleEnded);
    };
  }, []);

  // Tapping an INCOMING_CALL push (app was closed/backgrounded) surfaces the
  // incoming-call prompt with the token carried in the push payload.
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as any;
      if (
        data?.type === "INCOMING_CALL" &&
        data.roomName &&
        data.token &&
        data.url
      ) {
        setActiveCall((cur) => {
          if (!cur) {
            setIncoming({
              roomName: String(data.roomName),
              token: String(data.token),
              url: String(data.url),
              deliveryId: String(data.deliveryId || ""),
              from: { id: "", name: String(data.callerName || "Contact"), role: "" },
            });
          }
          return cur;
        });
      }
    });
    return () => sub.remove();
  }, []);

  const startCall = useCallback(async (deliveryId: string) => {
    setIsBusy(true);
    try {
      const res = await callApi.initiate(deliveryId);
      setActiveCall({
        roomName: res.roomName,
        token: res.token,
        url: res.url,
        deliveryId,
        peerName: res.callee?.name || "Contact",
        outgoing: true,
      });
    } finally {
      setIsBusy(false);
    }
  }, []);

  const acceptIncoming = useCallback(() => {
    if (!incoming) return;
    setActiveCall({
      roomName: incoming.roomName,
      token: incoming.token,
      url: incoming.url,
      deliveryId: incoming.deliveryId,
      peerName: incoming.from?.name || "Contact",
      outgoing: false,
    });
    setIncoming(null);
  }, [incoming]);

  const declineIncoming = useCallback(() => {
    if (incoming) void callApi.end(incoming.deliveryId, "declined");
    setIncoming(null);
  }, [incoming]);

  const endActiveCall = useCallback(() => {
    setActiveCall((cur) => {
      if (cur) void callApi.end(cur.deliveryId, "ended");
      return null;
    });
  }, []);

  return (
    <CallContext.Provider value={{ startCall, isBusy }}>
      {children}

      {/* Incoming call prompt */}
      <Modal visible={!!incoming && !activeCall} transparent animationType="fade">
        <View style={st.incomingBackdrop}>
          <View style={st.incomingCard}>
            <View style={st.avatarBig}>
              <Ionicons name="person" size={40} color="#fff" />
            </View>
            <Text style={st.incomingName}>{incoming?.from?.name || "Contact"}</Text>
            <Text style={st.incomingSub}>Incoming call…</Text>
            <View style={st.incomingActions}>
              <TouchableOpacity style={[st.roundBtn, st.declineBtn]} onPress={declineIncoming}>
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={[st.roundBtn, st.acceptBtn]} onPress={acceptIncoming}>
                <Ionicons name="call" size={26} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Active call */}
      {activeCall && (
        <Modal visible transparent={false} animationType="slide">
          <ActiveCallView call={activeCall} onHangup={endActiveCall} />
        </Modal>
      )}
    </CallContext.Provider>
  );
}

function ActiveCallView({
  call,
  onHangup,
}: {
  call: ActiveCall;
  onHangup: () => void;
}) {
  useEffect(() => {
    let active = true;
    AudioSession.startAudioSession().catch(() => {});
    return () => {
      active = false;
      AudioSession.stopAudioSession().catch(() => {});
      void active;
    };
  }, []);

  return (
    <LiveKitRoom
      serverUrl={call.url}
      token={call.token}
      connect
      audio
      video={false}
      onDisconnected={onHangup}
      options={{ adaptiveStream: false }}
    >
      <CallControls peerName={call.peerName} onHangup={onHangup} />
    </LiveKitRoom>
  );
}

function CallControls({
  peerName,
  onHangup,
}: {
  peerName: string;
  onHangup: () => void;
}) {
  const participants = useParticipants();
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();
  const connected = participants.length > 1;

  const [seconds, setSeconds] = useState(0);
  const startedRef = useRef<number | null>(null);

  useEffect(() => {
    if (connected && startedRef.current === null) {
      startedRef.current = Date.now();
    }
    if (!connected) return;
    const t = setInterval(() => {
      if (startedRef.current) {
        setSeconds(Math.floor((Date.now() - startedRef.current) / 1000));
      }
    }, 1000);
    return () => clearInterval(t);
  }, [connected]);

  const toggleMute = () => {
    void localParticipant?.setMicrophoneEnabled(!isMicrophoneEnabled);
  };

  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
    seconds % 60
  ).padStart(2, "0")}`;

  return (
    <View style={st.callContainer}>
      <View style={st.callTop}>
        <View style={st.avatarBig}>
          <Ionicons name="person" size={48} color="#fff" />
        </View>
        <Text style={st.callName}>{peerName}</Text>
        <Text style={st.callStatus}>
          {connected ? mmss : "Calling…"}
        </Text>
      </View>

      <View style={st.callActions}>
        <TouchableOpacity
          style={[st.roundBtn, isMicrophoneEnabled ? st.mutedOff : st.mutedOn]}
          onPress={toggleMute}
        >
          <Ionicons
            name={isMicrophoneEnabled ? "mic" : "mic-off"}
            size={26}
            color="#fff"
          />
        </TouchableOpacity>
        <TouchableOpacity style={[st.roundBtn, st.declineBtn]} onPress={onHangup}>
          <Ionicons name="call" size={26} color="#fff" style={{ transform: [{ rotate: "135deg" }] }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  incomingBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  incomingCard: {
    width: "100%",
    backgroundColor: "#022401",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
  },
  incomingName: { fontSize: 22, fontFamily: "GTWalsheimPro-Bold", color: "#fff", marginTop: 16 },
  incomingSub: { fontSize: 14, fontFamily: "GTWalsheimPro", color: "#bbcf8d", marginTop: 4 },
  incomingActions: { flexDirection: "row", gap: 48, marginTop: 32 },
  callContainer: { flex: 1, backgroundColor: "#022401", justifyContent: "space-between", paddingVertical: 80 },
  callTop: { alignItems: "center" },
  avatarBig: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#bbcf8d",
    alignItems: "center",
    justifyContent: "center",
  },
  callName: { fontSize: 26, fontFamily: "GTWalsheimPro-Bold", color: "#fff", marginTop: 20 },
  callStatus: { fontSize: 16, fontFamily: "GTWalsheimPro", color: "#bbcf8d", marginTop: 8 },
  callActions: { flexDirection: "row", justifyContent: "center", gap: 40 },
  roundBtn: { width: 68, height: 68, borderRadius: 34, alignItems: "center", justifyContent: "center" },
  acceptBtn: { backgroundColor: "#10b981" },
  declineBtn: { backgroundColor: "#ef4444" },
  mutedOn: { backgroundColor: "#ef4444" },
  mutedOff: { backgroundColor: "rgba(255,255,255,0.15)" },
});
