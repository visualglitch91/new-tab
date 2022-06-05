import { h } from "../utils/preact.mjs";
import { makeTurnOnCall } from "../utils/hass.mjs";
import Stack from "../components/Stack.mjs";
import ListCard from "../components/ListCard.mjs";
import SvgImage from "../components/SvgImage.mjs";
import ButtonRow from "../components/ButtonRow.mjs";
import ButtonCard from "../components/ButtonCard.mjs";
import MaterialIcon from "../components/MaterialIcon.mjs";
import {
  svgStyle,
  imgStyle,
  rgbEntity,
  homeTheaterEntity,
  makeTVButtonCall,
  makeTVMediaControlCall,
  makeTVLaunchAppCall,
} from "./tv.utils.mjs";

export default h`
  <${Stack} smallGap>
    <${ButtonRow} height=${70}>
      <${ButtonCard} onClick=${makeTurnOnCall("scene.tv_ligar")}>
        <${MaterialIcon} icon="mdi:power" size=${28} />
      </${ButtonCard}>
      <${ButtonCard} onClick=${makeTVButtonCall("UP")}>
        <${MaterialIcon} icon="mdi:chevron-up" size=${32} />
      </${ButtonCard}>
      <${ButtonCard}
        onClick=${makeTurnOnCall("script.sala_tv_desligar_tela")}
      >
        <${MaterialIcon} icon="mdi:image-off-outline" size=${25} />
      </${ButtonCard}>
    </${ButtonRow}>
    <${ButtonRow} height=${70}>
      <${ButtonCard} onClick=${makeTVButtonCall("LEFT")}>
        <${MaterialIcon} icon="mdi:chevron-left" size=${32} />
      </${ButtonCard}>
      <${ButtonCard} onClick=${makeTVButtonCall("ENTER")}>
        <${MaterialIcon} icon="mdi:record-circle-outline" size=${25} />
      </${ButtonCard}>
      <${ButtonCard} onClick=${makeTVButtonCall("RIGHT")}>
        <${MaterialIcon} icon="mdi:chevron-right" size=${32} />
      </${ButtonCard}>
    </${ButtonRow}>
    <${ButtonRow} height=${70}>
      <${ButtonCard} onClick=${makeTVButtonCall("BACK")}>
        <${MaterialIcon} icon="mdi:undo" size=${30} />
      </${ButtonCard}>
      <${ButtonCard} onClick=${makeTVButtonCall("DOWN")}>
        <${MaterialIcon} icon="mdi:chevron-down" size=${32} />
      </${ButtonCard}>
      <${ButtonCard} onClick=${makeTVButtonCall("MENU")}>
        <${MaterialIcon} icon="mdi:cog" size=${25} />
      </${ButtonCard}>
    </${ButtonRow}>

    <br />

    <${ButtonRow} height=${55}>
      <${ButtonCard} onClick=${makeTurnOnCall("script.sala_volume_menos")}>
        <${MaterialIcon} icon="mdi:volume-minus" size=${25} />
      </${ButtonCard}>
      <${ButtonCard} onClick=${makeTurnOnCall("script.sala_volume_mute")}>
        <${MaterialIcon} icon="mdi:volume-off" size=${25} />
      </${ButtonCard}>
      <${ButtonCard} onClick=${makeTurnOnCall("script.sala_volume_mais")}>
        <${MaterialIcon} icon="mdi:volume-plus" size=${25} />
      </${ButtonCard}>
    </${ButtonRow}>
    <${ButtonRow} height=${55}>
      <${ButtonCard} onClick=${makeTVMediaControlCall("rewind")}>
        <${MaterialIcon} icon="mdi:rewind" size=${25} />
      </${ButtonCard}>
      <${ButtonCard} onClick=${makeTVMediaControlCall("play")}>
        <${MaterialIcon} icon="mdi:play" size=${25} />
      </${ButtonCard}>
      <${ButtonCard} onClick=${makeTVMediaControlCall("pause")}>
        <${MaterialIcon} icon="mdi:pause" size=${25} />
      </${ButtonCard}>
      <${ButtonCard} onClick=${makeTVMediaControlCall("fastForward")}>
        <${MaterialIcon} icon="mdi:fast-forward" size=${25} />
      </${ButtonCard}>
    </${ButtonRow}>

    <br />
    
    <${ButtonRow}>
      <${ListCard} rows=${[rgbEntity]} />
      <${ListCard} rows=${[homeTheaterEntity]} />
    </${ButtonRow}>

    <br />

    <${ButtonRow} height=${75}>
      <${ButtonCard}
        onClick=${makeTurnOnCall("script.sala_tv_globo_ao_vivo")}
      >
        <img src="assets/globo.png" style=${imgStyle} />
      </${ButtonCard}>

      <${ButtonCard} onClick=${makeTVLaunchAppCall("netflix")}>
        <${SvgImage} src="assets/netflix.svg" style=${svgStyle} />
      </${ButtonCard}>

      <${ButtonCard} onClick=${makeTVLaunchAppCall("com.itkey.plexclient")}>
        <img src="assets/plex.png" style=${imgStyle} />
      </${ButtonCard}>

      <${ButtonCard} onClick=${makeTVLaunchAppCall("youtube.leanback.v4")}>
        <img src="assets/youtube.png" style=${imgStyle} />
      </${ButtonCard}>
    </${ButtonRow}>

    <${ButtonRow} height=${75}>
      <${ButtonCard}
        onClick=${makeTVLaunchAppCall("com.disney.disneyplus-prod")}
      >
        <img src="assets/disneyplus.png" style=${imgStyle} />
      </${ButtonCard}>

      <${ButtonCard}
        onClick=${makeTVLaunchAppCall("com.disney.alch.prod.lrd.app")}
      >
        <${SvgImage} src="assets/starplus.svg" style=${svgStyle} />
      </${ButtonCard}>

      <${ButtonCard} onClick=${makeTVLaunchAppCall("com.hbo.hbomax")}>
        <${SvgImage} src="assets/hbomax.svg" style=${svgStyle} />
      </${ButtonCard}>

      <${ButtonCard} onClick=${makeTVLaunchAppCall("amazon")}>
        <${SvgImage} src="assets/prime_video.svg" style=${svgStyle} />
      </${ButtonCard}>
    </${ButtonRow}>

    <${ButtonRow} height=${75}>
      <${ButtonCard} onClick=${makeTVLaunchAppCall("spotify-beehive")}>
        <${SvgImage} src="assets/spotify.svg" style=${svgStyle} />
      </${ButtonCard}>

      <${ButtonCard} onClick=${makeTurnOnCall("script.sala_tv_hdmi1")}>
        <${SvgImage} src="assets/ps5.svg" style=${svgStyle} />
      </${ButtonCard}>

      <${ButtonCard}
        onClick=${makeTurnOnCall("script.sala_receiver_nintendo_switch")}
      >
        <${SvgImage} src="assets/switch.svg" style=${svgStyle} />
      </${ButtonCard}>

      <${ButtonCard} onClick=${makeTurnOnCall("script.sala_receiver_pc")}>
        <img src="assets/windows.png" style=${imgStyle} />
      </${ButtonCard}>
    </${ButtonRow}>
  </${Stack}>`;