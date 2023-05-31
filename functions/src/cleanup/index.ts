import { Firestore, Timestamp } from "firebase-admin/firestore";

export default async function cleanupOldEvents(adminDb: Firestore) {
	// timestamp 24 hours ago
	const oneDayOldTimestamp = Timestamp.fromMillis(Date.now() - 86400000);
	const eventsRef = adminDb.collection("events");
	const query = eventsRef.where("dateTime", "<", oneDayOldTimestamp);

	return new Promise((resolve, reject) => {
		deleteQueryBatch(adminDb, query, resolve).catch(reject);
	});
}

async function deleteQueryBatch(adminDb: Firestore, query: any, resolve: any) {
	const snapshot = await query.get();
	const batchSize = snapshot.size;
	if (batchSize === 0) {
		// When there are no documents left, we are done
		resolve();
		return;
	}
	// Delete documents in a batch
	const batch = adminDb.batch();
	snapshot.docs.forEach((doc: any) => {
		batch.delete(doc.ref);
	});
	await batch.commit();

	// Recurse on the next process tick, to avoid
	// exploding the stack.

	process.nextTick(() => {
		deleteQueryBatch(adminDb, query, resolve);
	});
}
