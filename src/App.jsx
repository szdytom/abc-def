import './index.css';
import { SpellBox } from './components/SpellBox';
import * as rawWordlist from '../data/midterm.json';

let wordlist = new Map();
for (let row of rawWordlist) {
	if (row[2].indexOf('*') != -1) {
		wordlist.set(row[0], {
			word: row[0],
			text: row[1],
		});
	}
}

export function App() {
	return (
		<>
			<main>
				<SpellBox wordlist={wordlist} />
			</main>
		</>
	);
}

