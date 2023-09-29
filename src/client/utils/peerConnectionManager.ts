import ListenerGroup from "./ListenerGroup";
import { sendMessage } from "./hass";

interface WebRtcAnswer {
  answer: string;
}

interface WebRtcSettings {
  stun_server?: string;
}

async function fetchWebRtcSettings() {
  return sendMessage<WebRtcSettings>({
    type: "rtsp_to_webrtc/get_settings",
  });
}

async function fetchPeerConfiguration() {
  const settings = await fetchWebRtcSettings();

  if (!settings || !settings.stun_server) {
    return {};
  }

  return { iceServers: [{ urls: [`stun:${settings.stun_server!}`] }] };
}

export async function preparePeerConnection() {
  const listenerGroup = new ListenerGroup();
  const configuration = await fetchPeerConfiguration();
  const peerConnection = new RTCPeerConnection(configuration);

  // Some cameras (such as nest) require a data channel to establish a stream
  // however, not used by any integrations.
  peerConnection.createDataChannel("dataSendChannel");
  peerConnection.addTransceiver("audio", { direction: "recvonly" });
  peerConnection.addTransceiver("video", { direction: "recvonly" });

  const offerOptions: RTCOfferOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  };

  const offer: RTCSessionDescriptionInit = await peerConnection.createOffer(
    offerOptions
  );

  await peerConnection.setLocalDescription(offer);

  let candidates = ""; // Build an Offer SDP string with ice candidates

  await new Promise<void>((resolve) => {
    listenerGroup.with(peerConnection).subscribe("icecandidate", (event) => {
      if (!event.candidate) {
        resolve(); // Gathering complete
        return;
      }

      candidates += `a=${event.candidate.candidate}\r\n`;
    });
  });

  const offerSDPString = offer.sdp! + candidates;

  return {
    offerSDPString,
    listenerGroup,
    peerConnection,
  };
}

type PeerConnection = Awaited<ReturnType<typeof preparePeerConnection>>;

const PRELOADED_COUNT = 2;

class PeerConnectionManager {
  private preloaded: PeerConnection[] = [];
  private preloading = false;

  private log(...args: any[]) {
    console.log("[PeerConnectionManager]", ...args);
  }

  preload() {
    if (this.preloading) {
      return;
    }

    const count = Math.max(PRELOADED_COUNT - this.preloaded.length);

    this.log(`Preloading ${count} peer connections`);

    Promise.all(new Array(count).fill(0).map(preparePeerConnection)).then(
      (peerConnections) => {
        this.preloaded.push(...peerConnections);
        this.preloading = false;
      }
    );

    this.log(`${count} peer connections preloaded`);
  }

  async getPeerConnection() {
    if (this.preloaded.length > 0 && !this.preloading) {
      this.log(`Consuming one preloaded peer connection`);

      const peerConnection = this.preloaded.pop()!;
      this.preload();

      return peerConnection;
    }

    return preparePeerConnection();
  }
}

const peerConnectionManager = new PeerConnectionManager();

export default peerConnectionManager;
