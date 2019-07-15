// Your sandbox code goes here!
// See ./examples/*.js for code exmaples

// 페이지 197     1.  연결
// npm install web3  --save
const Ethereumjs  = require('ethereumjs-tx')
const Web3 = require('web3')
const rpcURL = 'https://ropsten.infura.io/v3/f2d6082eec7d47fd9843b71b0651e47d' // Your RCkP URL goes here
const web3 = new Web3(rpcURL)
console.log("1111")
const address = '0x83438A43F40b7f442a55a4C63EC20549ba4AD6ae' // Your account address goes here
web3.eth.getBalance(address, (err, wei) => { balance = web3.utils.fromWei(wei, 'ether')
 })
console.log("22222")


// 페이지 198 2. 주소 생성

//let createdAddress = web3.eth.accounts.create()
//console.log("생성된 주소 : ", createdAddress)
let password = 'test'
let keystore = web3.eth.accounts.create().encrypt(password)
let private = web3.eth.accounts.decrypt(keystore, password)

console.log(keystore)
console.log(private)


// 페이지 199

//let address = '0x83438A43F40b7f442a55a4C63EC20549ba4AD6ae'
let balance =  web3.eth.getBalance(address, (err, wei) => { balance = web3.utils.fromWei(wei, 'ether')
 })
console.log(balance)    //  pending 메시지 찍힘


// 페이지 200

let blockinfoFunc =  async function() {
    let reValue =  await web3.eth.getBlock(0);
    console.log("reValue : ", reValue)
    return reValue;
};
console.log("blockinfoFunc : ", blockinfoFunc())

// 위와 같음
// get latest block number
web3.eth.getBlockNumber().then(console.log)



// 페이지 201
// npm install ethereumjs-tx  --save

let addressMy = "0x83438A43F40b7f442a55a4C63EC20549ba4AD6ae"
let private_key = "1db0908c2331e0502b529163e1f2fa21aec4fd8d109dba7d800adc6ec0375a40"
let toAddress = "0x9a87d53b56509CB6A22F5d42d397c659F0aCF336"
   // toAddress is account3

web3.eth.getTransactionCount(addressMy, "pending").then((totalCount) => {
    console.log("totalCount : ", totalCount)
    //return totalCount;

    let rawTx = {
        nonce : web3.utils.toHex(totalCount),
        gasPrice : web3.utils.toHex(21*10**9),
        gasLimit : web3.utils.toHex(21000),
        from : addressMy,
        to : toAddress,
        value : 1*10**17
    };

    let tx = new Ethereumjs(rawTx)
    //let pk = new Ethereumjs.Buffer(private_key, 'hex')
    tx.sign(Buffer.from(private_key, 'hex'))



    let serializedTx = tx.serialize();
    let sts = '0x' + serializedTx.toString('hex')
    web3.eth.sendSignedTransaction(sts, (err, txHash) => {
        console.log('txHash : ', txHash)

        web3.eth.getTransaction(txHash).then((callbackValue) => {
            console.log("callbackValue : ", callbackValue)
        })
    })

  //  console.log("txInfo : ", txInfo)

})



// 페이지 203
// solidity code
/*
pragma solidity ^0.5;

contract Coursetro {
    
    string fName;
    uint age;
    event Instructor(
        string name,
        uint age
    );
    
    function setInstructor(string memory _fName, uint _age) public {
        fName = _fName;
        age = _age;
        emit Instructor(_fName, _age);
    }
    
    function getInstructor() public view returns (string memory, uint) {
        return (fName, age);
    }
}

*/


//  페이지 204,205   컨트랙트 배포 "PDF 파일엔 없음"


let ABI = [
    {		
    "constant": false,
		"inputs": [
			{
				"name": "_fName",
				"type": "string"
			},
			{
				"name": "_age",
				"type": "uint256"
			}
		],
		"name": "setInstructor",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getInstructor",
		"outputs": [
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "age",
				"type": "uint256"
			}
		],
		"name": "Instructor",
		"type": "event"
	}
]

// 컨트랙트 배포
//const contract = new web3.eth.Contract(ABI, addressMy)
const MyContract = new web3.eth.Contract(ABI)
/*
var text = "hello world";
var bytes = ethers.utils.toUtf8Bytes(text);
var textAgain = ethers.utils.toUtf8String(bytes);
*/

//var byteABI = ABI.toString('binary');
var byteABI = Buffer.from( ABI, 'utf8' )

console.log("ABI bytecode : ", byteABI)

  const gas = MyContract.deploy({
    data: byteABI
  }).estimateGas()

  MyContract.deploy({
    data: byteABI
  }).send({
    from: addressMy,
    gas: gas,
  })
  .on('error', (error) => {
    console.log(error)
  })
  .on('transactionHash', (transactionHash) => {
    console.log(transactionHash)
  })
  .on('receipt', (receipt) => {
     // receipt will contain deployed contract address
     console.log(receipt)
  })
  .on('confirmation', (confirmationNumber, receipt) => {
    console.log(receipt)
  })

// 페이지 206   컨트랙트 조회

//const IP = 'wss://ropsten.infura.io/ws'
//const web3_ws = new Web3(new Web3.providers.WebsocketProvider(IP));

MyContract.methods.getInstructor().call().then((err, data1, data2) => {
    console.log({ err, data1, data2 })
})
/*

// 페이지 207  

let bytedata = contract.methods.setInstructor("KCOD", 10).encodeABI()

console.log("bytedata: ", bytedata)


// 이더스캔에서 컨트랙트주소를 읽어 온다
const contractAddress = '0xd03696B53924972b9903eB17Ac5033928Be7D3Bc'

web3.eth.getTransactionCount(addressMy, "pending").then((totalCount) => {
    console.log("totalCount : ", totalCount)

    let rawTx = {
        nonce : web3.utils.toHex(totalCount),
        gasPrice : web3.utils.toHex(21*10**9),
        gasLimit : web3.utils.toHex(21000),
        to : contractAddress,
        from : addressMy,
        data : bytedata
    };

    let tx = new Ethereumjs(rawTx)
    //let pk = new Ethereumjs.Buffer(private_key, 'hex')
    tx.sign(Buffer.from(private_key, 'hex'))



    let serializedTx = tx.serialize();
    let sts = '0x' + serializedTx.toString('hex')
    web3.eth.sendSignedTransaction(sts, (err, txHash) => {
        console.log('txHash : ', txHash)

        web3.eth.getTransaction(txHash).then((callbackValue) => {
            console.log("callbackValue : ", callbackValue)
        })
    })

})



// 페이지 208


const web3_ws = new Web3(new Web3.providers.WebsocketProvider('wss://ropsten.infura.io/_ws'));

const subscription = web3_ws.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
if (error) return console.error(error);

console.log('Successfully subscribed!', blockHeader);
}).on('data', (blockHeader) => {
console.log('data: ', blockHeader);
});

// unsubscribes the subscription
subscription.unsubscribe((error, success) => {
    if (error) return console.error(error);
    
    console.log('Successfully unsubscribed!');
    });



    */




    /*
// event까지 수신하기 위해서는 WebsocketProvider 로 연결해야 함

const subscription = web3_ws.eth.subscribe('logs', (error, logs) => {
    console.log("logs : ", logs)
    console.log("error : ", error)
})

contract.events.Instructor().on('data', (event) => {
    console.log('data set : ')
    console.log(event)

    console.log('필요 데이터 추출 : ')
    console.log(event.returnValues)
})
*/
