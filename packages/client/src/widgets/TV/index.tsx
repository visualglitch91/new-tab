import { Fragment } from "react";
import { makeTurnOnCall } from "../../utils/hass";
import Stack from "../../components/Stack";
import ButtonRow from "../../components/ButtonRow";
import EntityButton from "../../components/EntityButton";
import MediaCard from "../../components/MediaCard";
import { ScriptImageButtonCard } from "./utils";
import Grid from "../../components/Grid";
import IconButtonCard from "../../components/IconButtonCard";
import { TVEntityButton } from "../../components/TVEntityButton";
import BaseEntityButton from "../../components/BaseEntityButton";
import useModal from "../../utils/useModal";
import AndroidRemoteDialog from "../../components/AndroidRemoteDialog";
import { useResponsive } from "../../utils/general";
import StickMobileHeader from "../../components/StickMobileHeader";

function spacer(height?: number) {
  return <div style={{ height: height && `${height}px` }} />;
}

function AndroidRemoteButton() {
  const [mount, modals] = useModal();

  function showRemote() {
    mount((unmount) => <AndroidRemoteDialog onClose={unmount} />);
  }

  return (
    <>
      {modals}
      <BaseEntityButton
        icon="remote"
        label="Controle"
        onPrimaryAction={showRemote}
      />
    </>
  );
}

export default function TV() {
  const { isMobile } = useResponsive();
  const MediaCardWrapper = isMobile ? StickMobileHeader : Fragment;

  return (
    <Stack smallGap>
      <MediaCardWrapper>
        <MediaCard />
      </MediaCardWrapper>

      {spacer(12)}

      <ButtonRow>
        <TVEntityButton />
        <EntityButton entityId="switch.sala_ambilight" changeTimeout={30_000} />
        <AndroidRemoteButton />
      </ButtonRow>

      {spacer(12)}

      <Grid gap={12} columnWidth={120} rowHeight={70}>
        <ScriptImageButtonCard asset="globo" script="sala_tv_globo" />
        <ScriptImageButtonCard
          asset="globoplay"
          script="sala_mibox_globoplay"
        />
        <ScriptImageButtonCard asset="plex" script="sala_mibox_plex" />
        <ScriptImageButtonCard
          asset="disneyplus"
          script="sala_mibox_disney_plus"
        />
        <ScriptImageButtonCard asset="hbomax" script="sala_mibox_hbo_max" />
        <ScriptImageButtonCard asset="starplus" script="sala_mibox_star_plus" />
        <ScriptImageButtonCard
          asset="prime_video"
          script="sala_mibox_prime_video"
        />
        <ScriptImageButtonCard asset="spotify" script="sala_mibox_spotify" />
        <ScriptImageButtonCard
          asset="crunchyroll"
          script="sala_mibox_crunchyroll"
        />
        <ScriptImageButtonCard asset="youtube" script="sala_mibox_youtube" />
        <ScriptImageButtonCard asset="kodi" script="sala_mibox_kodi" />
        <ScriptImageButtonCard asset="twitch" script="sala_mibox_twitch" />
        <ScriptImageButtonCard asset="switch" script="sala_tv_switch" />
        <ScriptImageButtonCard asset="ps5" script="sala_tv_playstation_5" />

        <IconButtonCard
          icon="mdi:information-outline"
          size={40}
          action={makeTurnOnCall("script.sala_receiver_info")}
        />
      </Grid>
    </Stack>
  );
}
