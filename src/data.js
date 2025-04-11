import Papa from 'papaparse';

export const availableData = [
	['B1U0', new URL('../data/b1u0.CSV', import.meta.url)],
	['B1U1', new URL('../data/b1u1.CSV', import.meta.url)],
	['B1U2', new URL('../data/b1u2.CSV', import.meta.url)],
	['B1U3', new URL('../data/b1u3.CSV', import.meta.url)],
	['B1U4', new URL('../data/b1u4.CSV', import.meta.url)],
	['B1U5', new URL('../data/b1u5.CSV', import.meta.url)],

	['B2U1', new URL('../data/b2u1.CSV', import.meta.url)],
	['B2U2', new URL('../data/b2u2.CSV', import.meta.url)],
	['B2U3', new URL('../data/b2u3.CSV', import.meta.url)],
	['B2U4', new URL('../data/b2u4.CSV', import.meta.url)],
	['B2U5', new URL('../data/b2u5.CSV', import.meta.url)],

	['B3U1', new URL('../data/b3u1.CSV', import.meta.url)],
	['B3U2', new URL('../data/b3u2.CSV', import.meta.url)],
	['B3U3', new URL('../data/b3u3.CSV', import.meta.url)],
	['B3U4', new URL('../data/b3u4.CSV', import.meta.url)],
	['B3U5', new URL('../data/b3u5.CSV', import.meta.url)],

	['B4U1', new URL('../data/b4u1.CSV', import.meta.url)],
	['B4U2', new URL('../data/b4u2.CSV', import.meta.url)],
	['B4U3', new URL('../data/b4u3.CSV', import.meta.url)],
	['B4U4', new URL('../data/b4u4.CSV', import.meta.url)],
	['B4U5', new URL('../data/b4u5.CSV', import.meta.url)],

	['B5U1', new URL('../data/b5u1.CSV', import.meta.url)],
	['B5U2', new URL('../data/b5u2.CSV', import.meta.url)],
	['B5U3', new URL('../data/b5u3.CSV', import.meta.url)],
	['B5U4', new URL('../data/b5u4.CSV', import.meta.url)],
	['B5U5', new URL('../data/b5u5.CSV', import.meta.url)],

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

	['Phrase: Eye', new URL('../data/ActEye.csv', import.meta.url)],
	['Phrase: Feet', new URL('../data/ActFeet.csv', import.meta.url)],
	['Phrase: Hand', new URL('../data/ActHand.csv', import.meta.url)],
	['Phrase: Head', new URL('../data/ActHead.csv', import.meta.url)],
	['Phrase: Leg', new URL('../data/ActLeg.csv', import.meta.url)],
	['Phrase: Mouth', new URL('../data/ActMouth.csv', import.meta.url)],

	['Phrase: Angry', new URL('../data/FeelingAngry.csv', import.meta.url)],
	['Phrase: Excite', new URL('../data/FeelingExcite.csv', import.meta.url)],
	['Phrase: Fear', new URL('../data/FeelingFear.csv', import.meta.url)],
	['Phrase: Laugh', new URL('../data/FeelingLaugh.csv', import.meta.url)],
	['Phrase: Pride', new URL('../data/FeelingPride.csv', import.meta.url)],
	['Phrase: Sad', new URL('../data/FeelingSad.csv', import.meta.url)],
	['Phrase: Satisfy', new URL('../data/FeelingSatisfy.csv', import.meta.url)],
	['Phrase: Shock', new URL('../data/FeelingShock.csv', import.meta.url)],
	['Phrase: Thanks', new URL('../data/FeelingThanks.csv', import.meta.url)],
];

export function parseSelectedUnits() {
	let list = JSON.parse(localStorage.getItem('abc-def-selectedUnits') ?? '[]');
	return list.filter(url => availableData.some(d => d[1].toString() === url));
}

export function parseFilterOptions() {
    return localStorage.getItem('abc-def-filterOptions') ?? 'isStarred';
}

export async function loadWordList() {
	let filter_expr = 'return ' + parseFilterOptions();
	let wordlist = new Map();
	try {
		let units_urls = parseSelectedUnits();
		let filter_func = new Function('isStarred', 'isPhrase', 'isProper', filter_expr);
		let rawWordlists = await Promise.all(units_urls.map(u => loadData(u)));
		for (let rawWordlist of rawWordlists) {
			for (let row of rawWordlist) {
				if (row.length < 3) { continue; }
				const isStarred = row[2].indexOf('*') != -1;
				const isPhrase = row[2].indexOf('D') != -1;
				const isProper = row[2].indexOf('Z') != -1;
				if (filter_func(isStarred, isPhrase, isProper)) {
					wordlist.set(row[0], {
						word: row[0],
						text: row[1],
					});
				}
			}
		}
	} catch(e) {
		return e.toString();
	}
	return wordlist;
}

export async function loadData(url) {
	let res = await fetch(url);
	let data = await res.text();
	return Papa.parse(data, { header: false }).data;
}
