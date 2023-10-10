import { useQuery } from "@tanstack/react-query";

export default function useAndroidApps() {
  const { data = [] } = useQuery(["android-apps"], () => {
    return new Promise<{ name: string; href: string; icon: string }[]>(
      (resolve) => {
        const iframe = document.createElement("iframe");

        iframe.style.position = "absolute";
        iframe.style.top = "-99999px";
        iframe.style.left = "-99999px";
        iframe.style.width = "1px";
        iframe.style.height = "1px";
        iframe.src = "fully://launcher";

        document.body.appendChild(iframe);

        const onMessage = (event: { data: string }) => {
          try {
            const data = JSON.parse(event.data);

            if (data.message === "android-apps") {
              resolve(data.data);
              window.removeEventListener("message", onMessage);
              document.body.removeChild(iframe);
            }
          } catch (err) {}
        };

        window.addEventListener("message", onMessage);
      }
    );
  });

  return data;
}
