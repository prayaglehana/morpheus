import React, {Component} from 'react';
// import Main from './Main';
import Transaction from './Transaction';
import Main from './Main';
import Web3 from 'web3'
//100000000,"Piggy",4,"PGY"
// ropsten token addres  0xaf13a1579a45c0b3888efd6c59161dc17ffefb06
// factory contrat : 0xfd47fa890cff28a4ad101cb67a21745ee19afcd8
// import { convertPatternsToTasks } from 'fast-glob/out/managers/tasks';
let _web3;
var factory_abi=[{"constant":false,"inputs":[{"name":"Vold","type":"uint256"},{"name":"sender","type":"address"},{"name":"receiver","type":"address"},{"name":"realrequiredPrice","type":"uint256"},{"name":"category","type":"string"}],"name":"createContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"requestTokens","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"Vold","type":"uint256"},{"indexed":false,"name":"receiver","type":"address"},{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"newContractAddress","type":"address"},{"indexed":false,"name":"realrequiredPrice","type":"uint256"},{"indexed":false,"name":"category","type":"string"}],"name":"contractCreated","type":"event"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"allDeals","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"b","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenContractAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}]
var deal_abi=[{"constant":false,"inputs":[],"name":"unlockDeal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"unsatisfyDeal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"refundSecurity","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"Volds","type":"uint256"},{"name":"amount","type":"uint256"}],"name":"addSecurity","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"satisfyDeal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tokenContractAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"lockDeal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"showStatus","outputs":[{"components":[{"name":"exist","type":"bool"},{"name":"secSender","type":"bool"},{"name":"secReceiver","type":"bool"},{"name":"lock","type":"bool"},{"name":"satisfied","type":"bool"},{"name":"rewardClaimed","type":"bool"}],"name":"","type":"tuple"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PiggyBankContractAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"showDetails","outputs":[{"components":[{"name":"receiver","type":"address"},{"name":"sender","type":"address"},{"name":"category","type":"string"},{"name":"description","type":"string"},{"name":"Vold","type":"uint256"},{"name":"curBalanceToken","type":"uint256"},{"name":"realrequiredPrice","type":"uint256"},{"name":"securityDepositToken","type":"uint256"},{"name":"realsecurityDepositPrice","type":"uint256"}],"name":"","type":"tuple"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"Vnew","type":"uint256"},{"name":"useBank","type":"bool"}],"name":"claimReward","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"Vold","type":"uint256"},{"name":"amount","type":"uint256"}],"name":"addmoney","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newRequiredToken","type":"uint256"},{"name":"newrealrequiredPrice","type":"uint256"}],"name":"updaterequiredBalance","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"Vold","type":"uint256"},{"name":"sender","type":"address"},{"name":"receiver","type":"address"},{"name":"realrequiredPrice","type":"uint256"},{"name":"category","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"Vold","type":"uint256"},{"indexed":false,"name":"receiver","type":"address"},{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"curBalanceToken","type":"uint256"}],"name":"eventaddmoney","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"Volds","type":"uint256"},{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"receiver","type":"address"},{"indexed":false,"name":"secSender","type":"bool"},{"indexed":false,"name":"secReceiver","type":"bool"}],"name":"eventSecurityDeposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"receiver","type":"address"},{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"lock","type":"bool"}],"name":"eventDealLocked","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"receiver","type":"address"},{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"satisfied","type":"bool"}],"name":"eventDealSatisfied","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"receiver","type":"address"},{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"toGet","type":"uint256"}],"name":"eventRewardClaimed","type":"event"},{"anonymous":false,"inputs":[],"name":"eventupdaterequiredBalance","type":"event"}]

var factoryContract=undefined,dealContract=undefined;

   
  //  else {
  //     console.log('No web3? You should consider trying MetaMask!');
  //     var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
  // }
class App extends Component{
  constructor(props){
    super(props);
    this.state= {
      thisAccount:undefined,
      ca : undefined
    }
  this.loadContract=this.loadContract.bind(this)
    
  }

   componentWillMount(){
    if (typeof window.web3 !== 'undefined') {
            _web3 = new Web3(window.web3.currentProvider);
            console.log('adx');
            _web3.eth.getAccounts().then(e=>{
              this.setState({
                thisAccount:e[0]
              })
          });
                  // run the following code only once. Metamask will ask for permission. allow it. then you can comment following code for subsequent ...
                    // window.ethereum.enable().then((account) =>{
                    //     const defaultAccount = account[0]
                    //     _web3.eth.defaultAccount = defaultAccount
                    //     console.log(defaultAccount);
                    
                    // })
                    factoryContract=new _web3.eth.Contract(factory_abi, '0xdb6cb729c77054b0ba3dbfa1bbfaf4ccf51f4560', {from:_web3.eth.defaultAccount})   ;
                
            }
            else 
              console.log('Unable to connect to metamask');
  }
  loadContract( ca){
          console.log('la',ca)
           this.setState({
                ca:ca
           });

           dealContract=  new _web3.eth.Contract(deal_abi, ca, {from:_web3.eth.defaultAccount})   ;
  }
  render(){
    
    if(factoryContract!==undefined && this.state.ca==undefined)
        {console.log('int ca',this.state.thisAccount);
            return(
              <div>
                <Transaction factoryContract={factoryContract} thisAccount={this.state.thisAccount}  search_by_ca={this.loadContract}/>
                {/* <Main/> */}
              </div>
            );
    }
    else if(this.state.thisAccount && this.state.ca && dealContract){
      return (<div><Main  dealContract={dealContract}  thisAccount={this.state.thisAccount} ca={this.state.ca}  /></div>)
    }
    else
     return ( <div><a href="https://metamask.io/">Please install metamask first !</a> </div>)
    
    
   
  }
 

  
}
export default App;
