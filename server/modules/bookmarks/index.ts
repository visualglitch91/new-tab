import ObjectID from "bson-objectid";
import { Bookmark } from "$common/types/bookmarks";
import { createAppModule } from "$server/utils";
import Storage from "$server/storage";

export default createAppModule("bookmarks", (instance) => {
  const storage = new Storage<Bookmark>("bookmarks");

  instance.get("/", async () => {
    return storage.getAll();
  });

  instance.post<{
    Body: { bookmarks: Bookmark[] };
  }>("/update-all", async (req) => {
    req.body.bookmarks.forEach((it) => storage.save(it));
    return req.body.bookmarks;
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
