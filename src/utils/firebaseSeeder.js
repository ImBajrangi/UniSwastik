import { db } from "../lib/firebase";
import { collection, doc, setDoc, getDocs, query, limit } from "firebase/firestore";
import { servers, channels, dmList, campusNews, upcomingEvents } from "../data/mockData";

export const seedDatabase = async () => {
  try {
    // Check if already seeded
    const q = query(collection(db, "servers"), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return;
    }

    console.log("Starting Database Seeding...");

    // 1. Seed Servers
    for (const server of servers) {
      await setDoc(doc(db, "servers", server.id), server);
      
      // 2. Seed Channels for this server
      const serverChannels = channels[server.id] || [];
      for (const channel of serverChannels) {
        await setDoc(doc(db, "channels", channel.id), {
          ...channel,
          serverId: server.id
        });
      }
    }

    // 3. Seed DMs
    for (const dm of dmList) {
      await setDoc(doc(db, "dms", dm.id), {
        ...dm,
        participantIds: ['user-1', dm.id]
      });
    }

    // 4. Seed Campus News
    for (const news of campusNews) {
      await setDoc(doc(db, "news", news.id), news);
    }

    // 5. Seed Events
    for (const event of upcomingEvents) {
      await setDoc(doc(db, "events", event.id), event);
    }

    console.log("Elite Seeding Complete!");
  } catch (error) {
    console.error("Seeding Error:", error);
  }
};
