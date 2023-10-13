import { Component } from "react";

class IPSubnetCalculator extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ip: "",
			prefix: 0,
			subnetMask: "",
			wildcardMask: "",
			numIPAddresses: 0,
			numUsableIPAddresses: 0,
			numUsers: 0,
			suggestedPrefix: 24,
		};
	}

	handleIPChange = (event) => {
		this.setState({ ip: event.target.value });
	};

	handlePrefixChange = (event) => {
		this.setState({ prefix: parseInt(event.target.value) });
	};

	handleNumUsersChange = (event) => {
		this.setState({ numUsers: parseInt(event.target.value) });
	};

	calculateIP = () => {
		const { ip, prefix } = this.state;

		if (ip && prefix >= 0 && prefix <= 32) {
			// Konversi prefix menjadi subnet mask dalam bentuk bilangan biner
			const subnetMaskBinary = "1".repeat(prefix).padEnd(32, "0");

			// Konversi subnet mask dari bilangan biner menjadi bilangan desimal
			const subnetMaskDecimal = parseInt(subnetMaskBinary, 2);

			// Hitung wildcard mask dengan melakukan komplement terhadap subnet mask
			const wildcardMaskDecimal = 0xffffffff ^ subnetMaskDecimal;

			// Hitung jumlah total alamat IP
			const numIPAddresses = 2 ** (32 - prefix);

			// Jumlah alamat IP yang dapat digunakan adalah jumlah total alamat IP dikurangi 2
			const numUsableIPAddresses = numIPAddresses - 2;

			this.setState({
				subnetMask: `${(subnetMaskDecimal >> 24) & 0xff}.${
					(subnetMaskDecimal >> 16) & 0xff
				}.${(subnetMaskDecimal >> 8) & 0xff}.${subnetMaskDecimal & 0xff}`,
				wildcardMask: `${(wildcardMaskDecimal >> 24) & 0xff}.${
					(wildcardMaskDecimal >> 16) & 0xff
				}.${(wildcardMaskDecimal >> 8) & 0xff}.${wildcardMaskDecimal & 0xff}`,
				numIPAddresses,
				numUsableIPAddresses,
			});
		} else {
			// Tampilkan pesan kesalahan jika input tidak valid
			this.setState({
				subnetMask: "Input tidak valid",
				wildcardMask: "Input tidak valid",
				numIPAddresses: 0,
				numUsableIPAddresses: 0,
			});
		}
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
				<h1>Kalkulator IP dan Prefix</h1>
				<div>
					<h2>Pencari Prefix</h2>
					<label>Jumlah Pengguna:</label>
					<input
						type="number"
						value={this.state.numUsers}
						onChange={this.handleNumUsersChange}
					/>
					<button onClick={this.findPrefix}>Cari Prefix</button>
					<p>Rekomendasi Prefix: /{this.state.suggestedPrefix}</p>
				</div>
				<div>
					<h2>Kalkulator IP</h2>
					<input
						type="text"
						placeholder="Alamat IP"
						value={this.state.ip}
						onChange={this.handleIPChange}
					/>
					<input
						type="number"
						placeholder="Prefix"
						value={this.state.prefix}
						onChange={this.handlePrefixChange}
					/>
					<button onClick={this.calculateIP}>Hitung IP</button>
					<div>
						<p>Subnet Mask: {this.state.subnetMask}</p>
						<p>Wildcard Mask: {this.state.wildcardMask}</p>
						<p>Jumlah Alamat IP: {this.state.numIPAddresses}</p>
						<p>
							Jumlah Alamat IP yang Dapat Digunakan:{" "}
							{this.state.numUsableIPAddresses}
						</p>
					</div>
				</div>
			</div>
		);
	}
}

export default IPSubnetCalculator;
