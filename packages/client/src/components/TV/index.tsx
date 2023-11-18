import { Stack } from "@mui/material";
import { makeTurnOnCall } from "../../utils/hass";
import useModal from "../../utils/useModal";
import EntityButton from "../EntityButton";
import MediaCard from "../MediaCard";
import Grid from "../Grid";
import IconHugeButton from "../IconHugeButton";
import BaseEntityButton from "../BaseEntityButton";
import AndroidRemoteDialog from "../AndroidRemoteDialog";
import { ScriptImageButtonCard } from "./utils";
import ButtonRow from "../ButtonRow";

function spacer(height?: number) {
  return <div style={{ height: height && `${height}px` }} />;
}

function AndroidRemoteButton() {
  const mount = useModal();

  function showRemote() {
    mount((_, props) => <AndroidRemoteDialog {...props} />);
  }

  return (
    <BaseEntityButton icon="remote" label="Controle" onClick={showRemote} />
  );
}

export default function TV({ noMediCard }: { noMediCard?: boolean }) {
  return (
    <Stack spacing={2}>
      {!noMediCard && (
        <>
          <MediaCard />
          {spacer(12)}
        </>
      )}

      <ButtonRow>
        <EntityButton entityId="media_player.sala_tv" changeTimeout={30_000} />
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
        <ScriptImageButtonCard asset="jellyfin" script="sala_mibox_jellyfin" />
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
        <ScriptImageButtonCard asset="twitch" script="sala_mibox_twitch" />
        <ScriptImageButtonCard asset="switch" script="sala_tv_switch" />
        <ScriptImageButtonCard asset="ps5" script="sala_tv_playstation_5" />

        <IconHugeButton
          icon="mdi:information-outline"
          size={40}
          action={makeTurnOnCall("script.sala_receiver_info")}
        />
      </Grid>
    </Stack>
  );
}
