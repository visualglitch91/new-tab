export const config = {
  port: 6173,
  development_server_port: 6174,
  development_server_proxy: "localhost:6174",

  file_manager: {
    root_dir: "",
  },

  home_assistant: {
    url: "",
    token: "",
  },

  transmission: {
    url: "",
  },

  jdownloader: {
    username: "",
    password: "",
  },

  whats_up_docker: {
    url: "",
  },

  ticktick: {
    username: "",
    password: "",
    project_ids: [""],
    excluded_calendar_ids: [""],
  },

  tmdb: {
    key: "",
  },

  sonarr: {
    url: "",
    key: "",
  },

  radarr: {
    url: "",
    key: "",
  },

  matrix: {
    homeserver: "",
    token: "",
  },

  tvbox: {
    adb_host: "",
  },

  package_tracker: {
    webhook: "",
  },

  pomodoro: {
    websocket: "",
  },
};
