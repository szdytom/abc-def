import { openDB } from 'idb';

export async function getDatabaseInstance() {
	return await openDB('ABC_DEF', 1, {
		upgrade(db) {
			const ratings = db.createObjectStore('ratings', {
				keyPath: 'word'
			});
			ratings.createIndex('learnt', 'learnt');
			ratings.createIndex('lastApperance', 'lastApperance');
		}
	});
}

function getRandomElement(array) {
	// Return null for empty arrays.
	if (array.length === 0) {
		return null;
	}

	const randomIndex = Math.floor(Math.random() * array.length);
	return array[randomIndex];
}

export class RatingStore {
	/** @type {import('idb').IDBPDatabase} */
	db;
	constructor() {
		this.db = null;
	}

	get connected() {
		return this.db != null;
	}

	async connect() {
		this.db = await getDatabaseInstance();
	}

	async touchItem(word) {
		let res = await this.db.getAll('ratings', word, 1);
		if (res.length == 0) {
			await this.db.add('ratings', {
				word,
				learnt: false,
				rating: 6,
				confidence: 3,
				lastApperance: -Infinity,
			});
		}
	}

	async currentStep() {
		const tx = this.db.transaction('ratings', 'readonly');
		const idx = tx.store.index('lastApperance');
		const cursor = await idx.openCursor(null, 'prev');
		let res = cursor.value?.lastApperance ?? 0;
		await tx.done;
		return Math.max(res, 0);
	}

	async markItem(word, outcome) {
		let step = await this.currentStep();
		const tx = this.db.transaction('ratings', 'readwrite');
		let item = await tx.store.get(word);
		item.learnt = true;
		item.lastApperance = step + 1;
		let old_rating = item.rating;
		item.rating += item.confidence * outcome;
		if (item.rating < 0) {
			item.rating = 0;
		}

		if ((old_rating - 6) * outcome >= 0) {
			item.confidence = Math.max(item.confidence / 1.2, 1.6);
		} else {
			item.confidence *= 1.2;
		}

		if (outcome === 1) {
			item.rating = Math.max(item.rating, 3);
		} else {
			item.rating = Math.min(item.rating, 4.5);
		}
		await tx.store.put(item);
		await tx.done;
		return item;
	}

	async getItem(wordlist) {
		let step = await this.currentStep();
		let review = [], learn = [], fallback = [];
		for (let word of wordlist) {
			let item = await this.db.get('ratings', word);
			if (item.learnt) {
				let gap = Math.ceil(Math.pow(1.3, item.rating)) + 1;
				if (gap < step - item.lastApperance) {
					review.push(item);
				} else {
					fallback.push(item);
				}
			} else {
				learn.push(item);
			}
		}

		return {
			progress: {
				reviewCount: review.length,
				learnCount: learn.length,
			},
			next: getRandomElement(review)
				?? getRandomElement(learn)
				?? getRandomElement(fallback),
		};
	}
};
