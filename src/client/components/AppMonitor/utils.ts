const labels: Record<string, string | undefined> = {
  other: "Outros",
  management: "Administração",
};

export interface App {
  id: string;
  name: string;
  status: "running" | "stoppped" | "errored";
  cpu: number;
  memory: string;
  uptime: string;
  type: "docker" | "pm2";
}

export function formatName(stack: string) {
  return stack
    .split("-")
    .map((word) => {
      if (word.length > 0) {
        const firstLetter = word[0].toUpperCase();
        const restOfWord = word.slice(1).toLowerCase();
        return firstLetter + restOfWord;
      }

      return word;
    })
    .join(" ");
}

export function formatStackName(stack: string) {
  return labels[stack] || formatName(stack);
}
