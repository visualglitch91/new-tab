import { sendMessage } from "./hass";
import ListenerGroup from "./ListenerGroup";
import peerConnectionManager from "./peerConnectionManager";

interface WebRtcAnswer {
  answer: string;
}

abstract class VideoBase {
  private divElement = document.createElement("div");
  private canvasElement = document.createElement("canvas");
  protected videoElement = document.createElement("video");
  public loading = false;

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
  }

  protected drawFrame() {
    if (!this.videoElement.srcObject) {
      return;
    }

    this.canvasElement.width = this.videoElement.videoWidth;
    this.canvasElement.height = this.videoElement.videoHeight;

    const context = this.canvasElement.getContext("2d")!;

    context.drawImage(this.videoElement, 0, 0);

    if (this.loading && context.getImageData(0, 0, 1, 1).data[3] === 255) {
      this.loading = false;
      this.videoElement.dispatchEvent(new Event("loading-changed"));
    }

    window.requestAnimationFrame(() => this.drawFrame());
  }

  abstract startStreaming(): Promise<void>;

  abstract stopStreaming(): void;

  on(name: string, handler: (event: Event) => void) {
    this.videoElement.addEventListener(name, handler);
    return () => this.off(name, handler);
  }

  off(name: string, handler: (event: Event) => void) {
    this.videoElement.removeEventListener(name, handler);
  }

  getElement() {
    return this.divElement;
  }
}

export default class RTCVideo extends VideoBase {
  private listenerGroup: ListenerGroup | undefined;

  private handleWebRtcOffer(offer: string) {
    return sendMessage<WebRtcAnswer>({
      type: "camera/web_rtc_offer",
      entity_id: this.entityId,
      offer: offer,
    });
  }

  async startStreaming() {
    if (!this.loading) {
      this.loading = true;
      this.videoElement.dispatchEvent(new Event("loading-changed"));
    }

    const { listenerGroup, peerConnection, offerSDPString } =
      await peerConnectionManager.getPeerConnection();

    this.listenerGroup = listenerGroup;

    let webRtcAnswer: WebRtcAnswer;

    try {
      webRtcAnswer = await this.handleWebRtcOffer(offerSDPString);
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

    this.drawFrame();
    this.listenerGroup.addUnsubscribe(() => peerConnection.close());
  }

  stopStreaming() {
    this.videoElement.srcObject = null;
    this.videoElement.removeAttribute("src");
    this.listenerGroup?.unsubscribeAll();
    this.listenerGroup = undefined;
  }
}
