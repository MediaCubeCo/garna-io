import logo from './logo.svg';
import './App.css';
import { Badge } from './components/demo/Badge';
import Form from './components/form/form';
import Modal from './components/modal/modal';

function App() {
	return (
		<>
			<Modal />
		</>

		// <div className="App">
		//   <header className="App-header">
		//     <Badge text="Привет 2" variant="Light" />

		//     <img src={logo} className="App-logo" alt="logo" />
		//     <p>
		//       Edit <code>src/App.js</code> and save to reload.
		//     </p>
		//     <a
		//       className="App-link"
		//       href="https://reactjs.org"
		//       target="_blank"
		//       rel="noopener noreferrer"
		//     >
		//       Learn React
		//     </a>
		//   </header>
		// </div>
	);
}

export default App;
