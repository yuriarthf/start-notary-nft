import Web3 from "web3";
import starNotaryArtifact from "../../build/contracts/StarNotary.json";

const App = {
    web3: null,
    account: null,
    meta: null,

    start: async function () {
        const { web3 } = this;
        try {
            // get account
            this.account = (
                await window.ethereum.request({ method: "eth_requestAccounts" })
            )[0];
            // get contract instance
            const networkId = window.ethereum.networkVersion;
            const deployedNetwork = starNotaryArtifact.networks[networkId];
            this.meta = new web3.eth.Contract(
                starNotaryArtifact.abi,
                deployedNetwork.address
            );
            console.log(this.meta.methods);
        } catch (error) {
            console.error("Could not connect to contract or chain.");
        }
    },

    setStatus: function (message) {
        const status = document.getElementById("status");
        status.innerHTML = message;
    },

    showStarName: function (message) {
        const lookupStatus = document.getElementById("lookupStatus");
        lookupStatus.innerHTML = message;
    },

    createStar: async function () {
        const { createStar } = this.meta.methods;
        const name = document.getElementById("starName").value;
        const id = parseInt(document.getElementById("starId").value);
        console.log(typeof id);
        console.log(this.account);
        await createStar(name, id).send({ from: this.account });
        console.log("passed");
        App.setStatus("New Star Owner is " + this.account + ".");
    },

    // Implement Task 4 Modify the front end of the DAPP
    lookUp: async function () {
        const { lookUptokenIdToStarInfo } = this.meta.methods;
        const starId = parseInt(document.getElementById("starId").value);
        const starName = await lookUptokenIdToStarInfo(starId).call();
        App.showStarName("Star Name: " + starName);
    },
};

window.App = App;

window.addEventListener("load", async function () {
    if (typeof window.ethereum !== "undefined") {
        // use MetaMask's provider
        App.web3 = new Web3(window.ethereum);
    } else {
        console.warn(
            "No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live"
        );
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        App.web3 = new Web3(
            new Web3.providers.HttpProvider("http://127.0.0.1:9545")
        );
    }

    App.start();
});
