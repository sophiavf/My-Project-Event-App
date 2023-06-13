import { Firestore, Timestamp } from "firebase-admin/firestore";
import { eventsRef } from "../index";

export default async function cleanupOldEvents(adminDb: Firestore) {
	// timestamp 24 hours ago
	const nowTimestamp = Timestamp.fromMillis(Date.now());
	const query = eventsRef.where("dateTime", "<", nowTimestamp);

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
