import { sendMessage } from "./hass";
import ListenerGroup from "./ListenerGroup";

interface WebRtcAnswer {
  answer: string;
}

interface WebRtcSettings {
  stun_server?: string;
}

abstract class VideoBase {
  private divElement = document.createElement("div");
  private canvasElement = document.createElement("canvas");
  protected videoElement = document.createElement("video");

  constructor(protected entityId: string) {
    this.videoElement.autoplay = true;
    this.videoElement.controls = true;

    this.videoElement.volume = 0;
    this.videoElement.style.position = "absolute";
    this.videoElement.style.width = "0px";
    this.videoElement.style.height = "0px";
    this.canvasElement.style.width = "100%";

    this.divElement.appendChild(this.videoElement);
    this.divElement.appendChild(this.canvasElement);

    this.drawFrame();
  }

  private drawFrame() {
    this.canvasElement.width = this.videoElement.videoWidth;
    this.canvasElement.height = this.videoElement.videoHeight;

    this.canvasElement.getContext("2d")!.drawImage(this.videoElement, 0, 0);
    window.requestAnimationFrame(() => this.drawFrame());
  }

  abstract startStreaming(): Promise<void>;

  abstract stopStreaming(): void;

  getElement() {
    return this.divElement;
  }
}

async function fetchWebRtcSettings() {
  return sendMessage<WebRtcSettings>({
    type: "rtsp_to_webrtc/get_settings",
  });
}

export default class RTCVideo extends VideoBase {
  private listenerGroup = new ListenerGroup();

  private handleWebRtcOffer(offer: string) {
    return sendMessage<WebRtcAnswer>({
      type: "camera/web_rtc_offer",
      entity_id: this.entityId,
      offer: offer,
    });
  }

  private async fetchPeerConfiguration() {
    const settings = await fetchWebRtcSettings();

    if (!settings || !settings.stun_server) {
      return {};
    }

    return { iceServers: [{ urls: [`stun:${settings.stun_server!}`] }] };
  }

  async startStreaming() {
    const configuration = await this.fetchPeerConfiguration();
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
      this.listenerGroup
        .with(peerConnection)
        .subscribe("icecandidate", (event) => {
          if (!event.candidate) {
            resolve(); // Gathering complete
            return;
          }

          candidates += `a=${event.candidate.candidate}\r\n`;
        });
    });

    const offer_sdp = offer.sdp! + candidates;

    let webRtcAnswer: WebRtcAnswer;

    try {
      webRtcAnswer = await this.handleWebRtcOffer(offer_sdp);
    } catch (err: any) {
      console.log("Failed to start WebRTC stream: " + err.message);
      peerConnection.close();
      return;
    }

    // Setup callbacks to render remote stream once media tracks are discovered.
    const remoteStream = new MediaStream();

    this.listenerGroup.with(peerConnection).subscribe("track", (event) => {
      remoteStream.addTrack(event.track);
      this.videoElement.srcObject = remoteStream;
    });

    // Initiate the stream with the remote device
    const remoteDesc = new RTCSessionDescription({
      type: "answer",
      sdp: webRtcAnswer.answer,
    });
    try {
      await peerConnection.setRemoteDescription(remoteDesc);
    } catch (err: any) {
      console.log("Failed to connect WebRTC stream: " + err.message);
      peerConnection.close();
      return;
    }

    this.listenerGroup.addUnsubscribe(() => peerConnection.close());
  }

  stopStreaming() {
    this.listenerGroup.unsubscribeAll();
    this.videoElement.srcObject = null;
    this.videoElement.removeAttribute("src");
  }
}
