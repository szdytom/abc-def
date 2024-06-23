import Papa from 'papaparse';

export const availableData = [
	['B1U0', new URL('../data/b1u0.CSV', import.meta.url)],
	['B1U1', new URL('../data/b1u1.CSV', import.meta.url)],
	['B1U2', new URL('../data/b1u2.CSV', import.meta.url)],
	['B1U3', new URL('../data/b1u3.CSV', import.meta.url)],
	['B1U4', new URL('../data/b1u4.CSV', import.meta.url)],
	['B1U5', new URL('../data/b1u5.CSV', import.meta.url)],
    ['B6U1', new URL('../data/b6u1.CSV', import.meta.url)],
	['B6U2', new URL('../data/b6u2.CSV', import.meta.url)],
	['B6U3', new URL('../data/b6u3.CSV', import.meta.url)],
	['B6U4', new URL('../data/b6u4.CSV', import.meta.url)],
	['B6U5', new URL('../data/b6u5.CSV', import.meta.url)],
	['B7U1', new URL('../data/b7u1.CSV', import.meta.url)],
	['B7U2', new URL('../data/b7u2.CSV', import.meta.url)],
	['B7U3', new URL('../data/b7u3.CSV', import.meta.url)],
	['B7U4', new URL('../data/b7u4.CSV', import.meta.url)],
	['B7U5', new URL('../data/b7u5.CSV', import.meta.url)],
];

export function parseSelectedUnits() {
	return JSON.parse(localStorage.getItem('abc-def-selectedUnits') ?? '[]');
}

export async function loadWordList() {
	let units_urls = parseSelectedUnits();
	let rawWordlists = await Promise.all(units_urls.map(u => loadData(u)));
	let wordlist = new Map();
	for (let rawWordlist of rawWordlists) {
		for (let row of rawWordlist) {
			if (row.length < 3) { continue; }
			if (row[2].indexOf('Z') == -1 && row[2].indexOf('*') != -1) {
				wordlist.set(row[0], {
					word: row[0],
					text: row[1],
				});
			}
		}
	}
	return wordlist;
}

export async function loadData(url) {
	let res = await fetch(url);
	let data = await res.text();
	return Papa.parse(data, { header: false }).data;
}
