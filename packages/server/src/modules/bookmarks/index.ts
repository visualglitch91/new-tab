import ObjectID from "bson-objectid";
import { Bookmark } from "@home-control/types/bookmarks";
import { createAppModule } from "../../utils";
import Storage from "../../storage";

export default createAppModule("bookmarks", (instance) => {
  const storage = new Storage<Bookmark>("bookmarks");

  instance.get("/", async () => {
    return storage.getAll();
  });

  instance.post<{
    Body: Omit<Bookmark, "id">;
  }>("/", async (req) => {
    const bookmark = {
      ...req.body,
      id: String(ObjectID()),
    };

    storage.save(bookmark);

    return bookmark;
  });

  instance.delete<{
    Params: { id: string };
  }>("/:id", async (req) => {
    storage.remove(req.params.id);
    return { success: true };
  });
});
