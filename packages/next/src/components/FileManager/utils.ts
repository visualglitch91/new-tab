import { useState } from "react";
import api from "../../utils/api";
import useMountEffect from "../../utils/useMountEffect";
import { useQuery } from "@tanstack/react-query";

interface Base {
  id: string;
  name: string;
  ancestors: Directory[];
}

export interface Directory extends Base {
  type: "dir";
}

export interface File extends Base {
  type: "file";
  size: number;
}

export type Item = File | Directory;

export function useFileNavigation() {
  const [state, setState] = useState<{
    current: Directory;
    prev?: Directory;
  }>();

  useMountEffect(() => {
    api("/file-manager/navigation/files", "get").then((res: Directory) => {
      setState({
        current: res,
        prev: undefined,
      });
    });
  });

  function changeDir(dir: Directory) {
    setState({
      current: dir,
      prev: dir.ancestors.slice(-1)[0],
    });
  }

  const { data: items = [], refetch } = useQuery<Item[]>(
    ["files", state?.current.id],
    () =>
      api(
        `/file-manager/navigation/files/${state?.current.id}/children?orderBy=name&orderDirection=ASC`,
        "get"
      ).then((res) => res.items),
    { enabled: !!state }
  );

  return { ...state, items, refetch, changeDir };
}
