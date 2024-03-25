import Dockerode from "dockerode";

const dockerode = new Dockerode({ socketPath: "/var/run/docker.sock" });

export default dockerode;
