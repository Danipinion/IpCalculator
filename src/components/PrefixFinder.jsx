import { Component } from "react";

class PrefixFinder extends Component {
	constructor(props) {
		super(props);
		this.state = {
			numUsers: 0,
			suggestedPrefix: 24, // Prefix default yang direkomendasikan
		};
	}

	handleNumUsersChange = (event) => {
		const numUsers = parseInt(event.target.value);
		this.setState({ numUsers });
	};

	findPrefix = () => {
		let numUsers = this.state.numUsers;
		let prefix = 31;
		let maxUsableIPs = 1;

		if (numUsers === 1) {
			this.setState({ suggestedPrefix: 32 }); // Satu alamat IP yang dapat digunakan
			return;
		}

		while (prefix >= 0) {
			maxUsableIPs *= 2;

			if (numUsers <= maxUsableIPs - 2) {
				this.setState({ suggestedPrefix: prefix });
				break;
			}

			prefix--;
		}
	};

	render() {
		return (
			<div>
				<h2>Pencari Prefix</h2>
				<label>Jumlah Pengguna:</label>
				<input
					type="number"
					value={this.state.numUsers}
					onChange={this.handleNumUsersChange}
				/>
				<button onClick={this.findPrefix}>Cari</button>
				<p>Rekomendasi Prefix: /{this.state.suggestedPrefix}</p>
			</div>
		);
	}
}

export default PrefixFinder;
